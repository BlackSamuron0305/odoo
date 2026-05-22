import { View, Text } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  if (isOnline) return null;
  return (
    <View className="bg-amber-500 px-4 py-2 items-center">
      <Text className="text-white text-xs font-semibold">
        ⚡ Offline — showing cached data
      </Text>
    </View>
  );
}
