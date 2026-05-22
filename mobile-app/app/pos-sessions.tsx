import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

interface PosSession {
  id: number;
  name: string;
  state: 'opening_control' | 'opened' | 'closing_control' | 'closed';
  config_id: [number, string];
  user_id: [number, string];
  start_at: string;
  order_count: number;
}

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  opened:          { label: 'Open',    color: 'bg-green-100 text-green-700'  },
  opening_control: { label: 'Opening', color: 'bg-amber-100 text-amber-700'  },
  closing_control: { label: 'Closing', color: 'bg-orange-100 text-orange-700'},
  closed:          { label: 'Closed',  color: 'bg-odoo-100 text-odoo-500'   },
};

export default function PosScreen() {
  const router = useRouter();
  const { client } = useAuthStore();
  const [sessions, setSessions] = useState<PosSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    if (!client) return;
    setIsLoading(true);
    try {
      const data = await client.callKw<PosSession[]>('pos.session', 'search_read', [], {
        domain: [['state', 'in', ['opening_control', 'opened', 'closing_control']]],
        fields: ['name', 'state', 'config_id', 'user_id', 'start_at', 'order_count'],
        limit: 20,
        order: 'start_at desc',
      });
      setSessions(data ?? []);
    } catch { setSessions([]); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, [client]);

  const closeSession = async (sessionId: number) => {
    Alert.alert('Close Session', 'Close this POS session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Close',
        style: 'destructive',
        onPress: async () => {
          try {
            await client?.callKw('pos.session', 'action_pos_session_closing_control', [[sessionId]]);
            load();
          } catch (e: unknown) {
            Alert.alert('Error', (e as Error).message);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-surface-subtle">
      <FlatList
        data={sessions}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator color="#71639e" size="large" />
            </View>
          ) : (
            <View className="items-center py-20 gap-3">
              <Text className="text-5xl">🛒</Text>
              <Text className="text-lg font-bold text-odoo-800">No open sessions</Text>
              <Text className="text-sm text-odoo-400">All POS sessions are closed</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const status = STATE_LABELS[item.state] ?? STATE_LABELS.closed;
          return (
            <View className="bg-white rounded-xl p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-bold text-odoo-900">
                  {Array.isArray(item.config_id) ? item.config_id[1] : item.name}
                </Text>
                <View className={`px-3 py-1 rounded-full ${status.color}`}>
                  <Text className="text-xs font-bold">{status.label}</Text>
                </View>
              </View>

              <View className="flex-row gap-4">
                <View>
                  <Text className="text-xs text-odoo-400">Orders</Text>
                  <Text className="text-lg font-bold text-odoo-900">{item.order_count}</Text>
                </View>
                <View>
                  <Text className="text-xs text-odoo-400">Cashier</Text>
                  <Text className="text-sm font-semibold text-odoo-700">
                    {Array.isArray(item.user_id) ? item.user_id[1] : '—'}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                {item.state === 'opened' && (
                  <TouchableOpacity
                    className="flex-1 bg-brand-primary rounded-xl py-3 items-center"
                    onPress={() => router.push({ pathname: '/pos-order', params: { sessionId: item.id } })}
                  >
                    <Text className="text-white font-semibold">New Order</Text>
                  </TouchableOpacity>
                )}
                {item.state === 'opened' && (
                  <TouchableOpacity
                    className="flex-1 bg-odoo-100 rounded-xl py-3 items-center"
                    onPress={() => closeSession(item.id)}
                  >
                    <Text className="text-odoo-700 font-semibold">Close Session</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
