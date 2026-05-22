import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { OfflineBanner } from '@/components/OfflineBanner';

export default function RootLayout() {
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const { isAvailable, status, authenticate } = useBiometricAuth();
  const [biometricDone, setBiometricDone] = useState(false);

  usePushNotifications();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/setup');
      setBiometricDone(true);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)');
    } else if (isAuthenticated && !inAuthGroup && !biometricDone) {
      // Require biometric on first app open after session restore
      if (isAvailable) {
        authenticate().then((ok) => {
          if (!ok) {
            // Failed biometric → force re-login
            useAuthStore.getState().logout();
            router.replace('/(auth)/setup');
          }
          setBiometricDone(true);
        });
      } else {
        setBiometricDone(true);
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f2f7' }}>
        <ActivityIndicator size="large" color="#71639e" />
      </View>
    );
  }

  if (status === 'checking') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f1a' }}>
        <Text style={{ color: '#fff', fontSize: 48, marginBottom: 16 }}>🔒</Text>
        <Text style={{ color: '#e8e8f0', fontSize: 18, fontWeight: '600' }}>Verifying identity…</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f1a', gap: 16 }}>
        <Text style={{ color: '#fff', fontSize: 48 }}>🔐</Text>
        <Text style={{ color: '#e8e8f0', fontSize: 18, fontWeight: '600' }}>Authentication required</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#71639e', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
          onPress={() => authenticate().then((ok) => { if (ok) setBiometricDone(true); })}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Slot />
    </View>
  );
}
