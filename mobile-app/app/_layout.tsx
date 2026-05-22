import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/setup');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#71639e" />
      </View>
    );
  }

  return <Slot />;
}
