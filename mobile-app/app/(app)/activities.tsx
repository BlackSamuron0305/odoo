import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useOdooQuery } from '@/hooks/useOdooQuery';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { ScheduleActivitySheet } from '@/components/ScheduleActivitySheet';

interface Activity {
  id: number;
  activity_type_id: [number, string];
  summary: string;
  date_deadline: string;
  res_model: string;
  res_id: number;
  res_name: string;
  user_id: [number, string];
}

const TYPE_ICONS: Record<string, string> = {
  Email: '📧', Call: '📞', Meeting: '📅', Task: '✅', Upload: '📎',
};

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date(new Date().toDateString());
}

function formatDue(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `${diff}d`;
}

export default function ActivitiesScreen() {
  const { client, uid } = useAuthStore();
  const [scheduleFor, setScheduleFor] = useState<{ model: string; id: number } | null>(null);

  const { data: activities, isLoading, refetch } = useOdooQuery<Activity>('mail.activity', {
    domain: [['user_id', '=', uid ?? 0]],
    fields: ['activity_type_id', 'summary', 'date_deadline', 'res_model', 'res_id', 'res_name', 'user_id'],
    limit: 50,
    order: 'date_deadline asc',
  });

  const markDone = async (activityId: number) => {
    try {
      await client?.callKw('mail.activity', 'action_done', [[activityId]]);
      refetch();
    } catch (e: unknown) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  // Group by model
  const grouped = activities.reduce<Record<string, Activity[]>>((acc, a) => {
    const key = a.res_model ?? 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const sections = Object.entries(grouped);

  return (
    <View className="flex-1 bg-surface-subtle">
      {isLoading && activities.length === 0 ? (
        <View className="px-4 pt-4 gap-3">
          {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={([model]) => model}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          ListEmptyComponent={
            <View className="items-center py-20 gap-3">
              <Text className="text-5xl">🎉</Text>
              <Text className="text-lg font-bold text-odoo-800">All done!</Text>
              <Text className="text-sm text-odoo-400">No pending activities</Text>
            </View>
          }
          renderItem={({ item: [model, acts] }) => (
            <View>
              <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest mb-2">
                {model.replace('.', ' ')} ({acts.length})
              </Text>
              <View className="gap-2">
                {acts.map((act) => {
                  const typeName = Array.isArray(act.activity_type_id) ? act.activity_type_id[1] : 'Task';
                  const icon = TYPE_ICONS[typeName] ?? '📌';
                  const overdue = isOverdue(act.date_deadline);
                  return (
                    <View key={act.id} className="bg-white rounded-xl px-4 py-3 flex-row items-center gap-3">
                      <Text className="text-2xl">{icon}</Text>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-odoo-900" numberOfLines={1}>
                          {act.summary || typeName}
                        </Text>
                        <Text className="text-xs text-odoo-400 mt-0.5" numberOfLines={1}>
                          {act.res_name}
                        </Text>
                      </View>
                      <View className="items-end gap-1">
                        <View className={`px-2 py-0.5 rounded-full ${overdue ? 'bg-red-100' : 'bg-odoo-100'}`}>
                          <Text className={`text-xs font-semibold ${overdue ? 'text-red-600' : 'text-odoo-600'}`}>
                            {formatDue(act.date_deadline)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          className="bg-green-100 px-2 py-0.5 rounded-full"
                          onPress={() => markDone(act.id)}
                        >
                          <Text className="text-xs font-semibold text-green-700">Done ✓</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        />
      )}

      {scheduleFor && (
        <ScheduleActivitySheet
          visible
          resModel={scheduleFor.model}
          resId={scheduleFor.id}
          onClose={() => setScheduleFor(null)}
          onScheduled={refetch}
        />
      )}
    </View>
  );
}
