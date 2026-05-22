import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { useOdooQuery } from '@/hooks/useOdooQuery';
import { useKpis, type OdooActivity } from '@/hooks/useHomeData';
import { SkeletonCard } from '@/components/SkeletonLoader';

const ACTIVITY_ICONS: Record<string, string> = {
  'Email':    '📧',
  'Call':     '📞',
  'Meeting':  '📅',
  'Task':     '✅',
  'Upload':   '📎',
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDeadline(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

export default function HomeScreen() {
  const { sessionInfo, uid } = useAuthStore();
  const { data: kpis, isLoading: kpisLoading } = useKpis();

  const { data: activities, isLoading: activitiesLoading, refetch } = useOdooQuery<OdooActivity>(
    'mail.activity',
    {
      domain: [['user_id', '=', uid ?? 0]],
      fields: ['activity_type_id', 'summary', 'date_deadline', 'res_model', 'res_id'],
      limit: 20,
      order: 'date_deadline asc',
    },
  );

  const kpiTiles = [
    {
      label: 'Opportunities',
      value: kpis ? String(kpis.opportunities) : '—',
      sub: kpis ? `$${(kpis.opportunitiesValue / 1000).toFixed(0)}k` : '',
      emoji: '📈',
      bg: 'bg-purple-50',
    },
    {
      label: "Today's Meetings",
      value: kpis ? String(kpis.meetings) : '—',
      sub: '',
      emoji: '📅',
      bg: 'bg-blue-50',
    },
    {
      label: 'Open Tasks',
      value: kpis ? String(kpis.tasks) : '—',
      sub: '',
      emoji: '✅',
      bg: 'bg-green-50',
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-surface-subtle"
      contentContainerClassName="px-4 py-6 gap-5"
      refreshControl={<RefreshControl refreshing={activitiesLoading} onRefresh={refetch} />}
    >
      {/* Header */}
      <View>
        <Text className="text-2xl font-bold text-odoo-900">
          {getGreeting()}, {sessionInfo?.name?.split(' ')[0] ?? 'there'} 👋
        </Text>
        <Text className="text-sm text-odoo-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      {/* KPI tiles */}
      <View className="flex-row gap-3">
        {kpisLoading
          ? [1, 2, 3].map((k) => (
              <View key={k} className="flex-1 bg-white rounded-xl p-4 h-24" />
            ))
          : kpiTiles.map(({ label, value, sub, emoji, bg }) => (
              <View key={label} className={`flex-1 ${bg} rounded-xl p-3 gap-1`}>
                <Text className="text-xl">{emoji}</Text>
                <Text className="text-2xl font-bold text-odoo-900">{value}</Text>
                {sub ? <Text className="text-xs text-odoo-500">{sub}</Text> : null}
                <Text className="text-xs text-odoo-600 leading-tight">{label}</Text>
              </View>
            ))}
      </View>

      {/* Today's activities */}
      <View>
        <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest mb-3">
          Your Activities
        </Text>

        {activitiesLoading ? (
          <View className="gap-3">
            {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
          </View>
        ) : activities.length === 0 ? (
          <View className="bg-white rounded-xl p-6 items-center gap-2">
            <Text className="text-3xl">🎉</Text>
            <Text className="text-base font-semibold text-odoo-800">All caught up!</Text>
            <Text className="text-sm text-odoo-500">No pending activities.</Text>
          </View>
        ) : (
          <View className="gap-2">
            {activities.map((act) => {
              const typeName = Array.isArray(act.activity_type_id) ? act.activity_type_id[1] : 'Task';
              const icon = ACTIVITY_ICONS[typeName] ?? '📌';
              const deadline = formatDeadline(act.date_deadline);
              const isOverdue = deadline.includes('overdue');
              return (
                <TouchableOpacity
                  key={act.id}
                  className="bg-white rounded-xl px-4 py-3 flex-row items-center gap-3"
                  activeOpacity={0.7}
                >
                  <Text className="text-2xl w-8">{icon}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-odoo-900" numberOfLines={1}>
                      {act.summary || typeName}
                    </Text>
                    <Text className="text-xs text-odoo-500">{act.res_model?.replace('.', ' ')}</Text>
                  </View>
                  <View className={`px-2 py-0.5 rounded-full ${isOverdue ? 'bg-red-100' : 'bg-odoo-100'}`}>
                    <Text className={`text-xs font-semibold ${isOverdue ? 'text-red-600' : 'text-odoo-600'}`}>
                      {deadline}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
