import {
  View, Text, FlatList, TouchableOpacity, Alert,
  useWindowDimensions, RefreshControl,
} from 'react-native';
import { useCrmPipeline, type CrmLead, type CrmStage } from '@/hooks/useCrmPipeline';
import { SkeletonCard } from '@/components/SkeletonLoader';

function initials(name: string | false): string {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function daysSince(dateStr: string): number {
  return Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function LeadCard({
  lead, stages, onMove, onMarkWon, onMarkLost,
}: {
  lead: CrmLead; stages: CrmStage[];
  onMove: (id: number, stageId: number) => void;
  onMarkWon: (id: number) => void;
  onMarkLost: (id: number) => void;
}) {
  const partnerName = Array.isArray(lead.partner_id) ? lead.partner_id[1] : 'Unknown';
  const days = daysSince(lead.write_date);
  const currentStageIdx = stages.findIndex((s) => s.id === (Array.isArray(lead.stage_id) ? lead.stage_id[0] : -1));
  const nextStage = stages[currentStageIdx + 1];

  const handleLongPress = () => {
    Alert.alert(lead.name, 'Choose action', [
      ...(nextStage ? [{ text: `Move to "${nextStage.name}"`, onPress: () => onMove(lead.id, nextStage.id) }] : []),
      { text: 'Mark Won ✅', onPress: () => onMarkWon(lead.id) },
      { text: 'Mark Lost ❌', style: 'destructive' as const, onPress: () => onMarkLost(lead.id) },
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  return (
    <TouchableOpacity className="bg-white rounded-xl p-3 mb-2 shadow-sm" activeOpacity={0.85} onLongPress={handleLongPress}>
      <View className="flex-row items-center gap-2 mb-2">
        <View className="w-8 h-8 rounded-full bg-brand-light items-center justify-center">
          <Text className="text-xs font-bold text-brand-primary">{initials(partnerName)}</Text>
        </View>
        <Text className="text-sm font-semibold text-odoo-900 flex-1" numberOfLines={1}>{partnerName}</Text>
      </View>
      <Text className="text-xs text-odoo-700 mb-2" numberOfLines={2}>{lead.name}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-bold text-odoo-900">
          {lead.expected_revenue ? `$${(lead.expected_revenue / 1000).toFixed(0)}k` : '—'}
        </Text>
        <View className="flex-row items-center gap-1">
          <View className={`px-2 py-0.5 rounded-full ${days > 30 ? 'bg-red-100' : 'bg-odoo-100'}`}>
            <Text className={`text-xs ${days > 30 ? 'text-red-600' : 'text-odoo-500'}`}>{days}d</Text>
          </View>
          {lead.probability ? (
            <View className="px-2 py-0.5 rounded-full bg-green-100">
              <Text className="text-xs text-green-700">{Math.round(lead.probability)}%</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function KanbanColumn({ stage, leads, stages, colWidth, onMove, onMarkWon, onMarkLost }: {
  stage: CrmStage; leads: CrmLead[]; stages: CrmStage[]; colWidth: number;
  onMove: (id: number, stageId: number) => void;
  onMarkWon: (id: number) => void;
  onMarkLost: (id: number) => void;
}) {
  const total = leads.reduce((s, l) => s + (l.expected_revenue ?? 0), 0);
  return (
    <View style={{ width: colWidth }} className="mr-3">
      <View className="flex-row items-center justify-between mb-2 px-1">
        <Text className="text-sm font-bold text-odoo-800" numberOfLines={1}>{stage.name}</Text>
        <View className="bg-brand-light px-2 py-0.5 rounded-full">
          <Text className="text-xs font-bold text-brand-primary">{leads.length}</Text>
        </View>
      </View>
      {total > 0 && <Text className="text-xs text-odoo-500 mb-2 px-1">${(total / 1000).toFixed(0)}k total</Text>}
      <FlatList
        data={leads}
        keyExtractor={(l) => String(l.id)}
        renderItem={({ item }) => (
          <LeadCard lead={item} stages={stages} onMove={onMove} onMarkWon={onMarkWon} onMarkLost={onMarkLost} />
        )}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text className="text-2xl mb-2">📭</Text>
            <Text className="text-xs text-odoo-400">No opportunities</Text>
          </View>
        }
      />
    </View>
  );
}

export default function CrmScreen() {
  const { stages, leadsByStage, isLoading, error, refetch, moveToStage, markWon, markLost } = useCrmPipeline();
  const { width } = useWindowDimensions();
  const colWidth = width * 0.8;

  if (isLoading && stages.length === 0) {
    return (
      <View className="flex-1 bg-surface-subtle px-4 pt-6 flex-row gap-3">
        {[1, 2].map((k) => (
          <View key={k} style={{ width: colWidth }} className="gap-2">
            <SkeletonCard /><SkeletonCard />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-4xl">⚠️</Text>
        <Text className="text-base font-semibold text-odoo-800">Failed to load pipeline</Text>
        <Text className="text-sm text-odoo-500">{error}</Text>
        <TouchableOpacity className="bg-brand-primary rounded-xl px-6 py-3" onPress={refetch}>
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-subtle">
      <FlatList
        horizontal
        data={stages}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={colWidth + 12}
        snapToAlignment="start"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        renderItem={({ item: stage }) => (
          <KanbanColumn
            stage={stage}
            leads={leadsByStage[stage.id] ?? []}
            stages={stages}
            colWidth={colWidth}
            onMove={moveToStage}
            onMarkWon={markWon}
            onMarkLost={markLost}
          />
        )}
      />
    </View>
  );
}
