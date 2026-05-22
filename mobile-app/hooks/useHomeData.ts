import { useAuthStore } from '@/stores/auth';

interface OdooActivity {
  id: number;
  activity_type_id: [number, string];
  summary: string;
  date_deadline: string;
  res_model: string;
  res_id: number;
  user_id: [number, string];
}

interface OdooCrmLead {
  id: number;
  name: string;
  partner_id: [number, string] | false;
  stage_id: [number, string];
  expected_revenue: number;
  user_id: [number, string] | false;
  probability: number;
}

interface KpiData {
  opportunities: number;
  opportunitiesValue: number;
  meetings: number;
  tasks: number;
}

export function useKpis(): { data: KpiData | null; isLoading: boolean } {
  const { client, uid } = useAuthStore();
  const [data, setData] = useState<KpiData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!client || !uid) return;
    setIsLoading(true);
    Promise.all([
      client.callKw<number>('crm.lead', 'search_count', [[['user_id', '=', uid], ['active', '=', true]]]),
      client.callKw<OdooCrmLead[]>('crm.lead', 'search_read', [], {
        domain: [['user_id', '=', uid], ['active', '=', true]],
        fields: ['expected_revenue'],
      }),
      client.callKw<number>('calendar.event', 'search_count', [
        [['partner_ids', 'in', [uid]], ['start', '>=', todayStart()], ['start', '<', tomorrowStart()]],
      ]),
      client.callKw<number>('project.task', 'search_count', [
        [['user_ids', 'in', [uid]], ['stage_id.fold', '=', false]],
      ]),
    ])
      .then(([opps, oppRecords, meetings, tasks]) => {
        const value = (oppRecords as OdooCrmLead[]).reduce((s, r) => s + (r.expected_revenue ?? 0), 0);
        setData({ opportunities: opps as number, opportunitiesValue: value, meetings: meetings as number, tasks: tasks as number });
      })
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, [client, uid]);

  return { data, isLoading };
}

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}
function tomorrowStart() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

import { useState, useEffect } from 'react';

export type { OdooActivity, OdooCrmLead };
