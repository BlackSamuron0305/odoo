import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

export interface CrmStage {
  id: number;
  name: string;
  sequence: number;
}

export interface CrmLead {
  id: number;
  name: string;
  partner_id: [number, string] | false;
  stage_id: [number, string];
  expected_revenue: number;
  date_deadline: string | false;
  user_id: [number, string] | false;
  probability: number;
  kanban_state: string;
  write_date: string;
}

interface PipelineData {
  stages: CrmStage[];
  leadsByStage: Record<number, CrmLead[]>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  moveToStage: (leadId: number, stageId: number) => Promise<void>;
  markWon: (leadId: number) => Promise<void>;
  markLost: (leadId: number) => Promise<void>;
}

export function useCrmPipeline(): PipelineData {
  const { client } = useAuthStore();
  const [stages, setStages] = useState<CrmStage[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!client) return;
    setIsLoading(true);
    Promise.all([
      client.callKw<CrmStage[]>('crm.stage', 'search_read', [], {
        fields: ['name', 'sequence'],
        order: 'sequence asc',
      }),
      client.callKw<CrmLead[]>('crm.lead', 'search_read', [], {
        domain: [['active', '=', true]],
        fields: ['name', 'partner_id', 'stage_id', 'expected_revenue', 'date_deadline', 'user_id', 'probability', 'kanban_state', 'write_date'],
        limit: 200,
        order: 'sequence asc, id desc',
      }),
    ])
      .then(([s, l]) => {
        setStages(s as CrmStage[]);
        setLeads(l as CrmLead[]);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [client, tick]);

  const leadsByStage = stages.reduce<Record<number, CrmLead[]>>((acc, s) => {
    acc[s.id] = leads.filter((l) => Array.isArray(l.stage_id) && l.stage_id[0] === s.id);
    return acc;
  }, {});

  const moveToStage = async (leadId: number, stageId: number) => {
    await client?.callKw('crm.lead', 'write', [[leadId], { stage_id: stageId }]);
    setTick((t) => t + 1);
  };

  const markWon = async (leadId: number) => {
    await client?.callKw('crm.lead', 'action_set_won', [[leadId]]);
    setTick((t) => t + 1);
  };

  const markLost = async (leadId: number) => {
    await client?.callKw('crm.lead', 'action_mark_lost', [[leadId], {}]);
    setTick((t) => t + 1);
  };

  return {
    stages,
    leadsByStage,
    isLoading,
    error,
    refetch: () => setTick((t) => t + 1),
    moveToStage,
    markWon,
    markLost,
  };
}
