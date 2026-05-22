import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth';

export default function MoreScreen() {
  const { sessionInfo, serverUrl, database, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/setup');
        },
      },
    ]);
  };

  const rows = [
    { label: 'Name',     value: sessionInfo?.name },
    { label: 'Username', value: sessionInfo?.username },
    { label: 'Company',  value: String(sessionInfo?.company_id ?? '') },
    { label: 'Language', value: sessionInfo?.lang },
    { label: 'Server',   value: serverUrl ?? '' },
    { label: 'Database', value: database ?? '' },
  ];

  return (
    <ScrollView className="flex-1 bg-surface-subtle" contentContainerClassName="px-4 py-6 gap-4">
      {/* Avatar */}
      <View className="items-center mb-2">
        <View className="w-20 h-20 rounded-full bg-brand-primary items-center justify-center">
          <Text className="text-white text-3xl font-bold">
            {sessionInfo?.name?.[0] ?? '?'}
          </Text>
        </View>
        <Text className="text-xl font-bold text-odoo-900 mt-3">{sessionInfo?.name}</Text>
        <Text className="text-sm text-odoo-500">{sessionInfo?.username}</Text>
      </View>

      {/* Info card */}
      <View className="bg-white rounded-xl overflow-hidden">
        {rows.map(({ label, value }, i) => (
          <View
            key={label}
            className={`flex-row justify-between px-4 py-3 ${
              i < rows.length - 1 ? 'border-b border-odoo-100' : ''
            }`}
          >
            <Text className="text-sm text-odoo-500">{label}</Text>
            <Text className="text-sm text-odoo-800 font-medium max-w-48" numberOfLines={1}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      {/* Quick links */}
      <View className="bg-white rounded-xl overflow-hidden mt-2">
        {[
          { label: '📅 Calendar',    route: '/(app)/calendar'   },
          { label: '✅ Activities',  route: '/(app)/activities' },
          { label: '🛒 POS Sessions', route: '/pos-sessions'    },
        ].map(({ label, route }) => (
          <TouchableOpacity
            key={route}
            className="flex-row justify-between items-center px-4 py-3 border-b border-odoo-100"
            onPress={() => router.push(route as never)}
          >
            <Text className="text-sm text-odoo-800">{label}</Text>
            <Text className="text-odoo-400">›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity
        className="bg-status-danger rounded-xl py-4 items-center mt-4"
        onPress={handleLogout}
      >
        <Text className="text-white text-base font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
