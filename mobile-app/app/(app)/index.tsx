import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/stores/auth';

export default function HomeScreen() {
  const { sessionInfo, serverUrl } = useAuthStore();

  return (
    <ScrollView className="flex-1 bg-surface-subtle" contentContainerClassName="px-4 py-6 gap-4">
      {/* Welcome header */}
      <View className="bg-white rounded-xl p-4 shadow-sm">
        <Text className="text-xl font-bold text-odoo-900">
          Hello, {sessionInfo?.name ?? 'User'} 👋
        </Text>
        <Text className="text-sm text-odoo-500 mt-1">{serverUrl}</Text>
      </View>

      {/* Quick nav tiles */}
      <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest mt-2">
        Quick Access
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {[
          { label: 'CRM',      emoji: '📈', bg: 'bg-purple-50' },
          { label: 'Contacts', emoji: '👥', bg: 'bg-blue-50'   },
          { label: 'Calendar', emoji: '📅', bg: 'bg-green-50'  },
          { label: 'Messages', emoji: '💬', bg: 'bg-orange-50' },
        ].map(({ label, emoji, bg }) => (
          <TouchableOpacity
            key={label}
            className={`${bg} rounded-xl p-4 flex-1 min-w-32 items-center gap-2`}
          >
            <Text className="text-3xl">{emoji}</Text>
            <Text className="text-sm font-semibold text-odoo-700">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
