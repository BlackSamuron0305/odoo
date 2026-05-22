import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const router = useRouter();
  const { client, uid } = useAuthStore();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPush().then((token) => {
      if (token && client && uid) {
        // Store token on server (requires custom Odoo module or partner field)
        // This is a no-op if the field doesn't exist but won't crash
        client.callKw('res.partner', 'write', [[uid], { mobile_push_token: token }])
          .catch(() => { /* optional server support */ });
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[Push] received:', notification.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      if (data?.model === 'crm.lead' && data?.id) {
        router.push('/(app)/crm');
      } else if (data?.model === 'res.partner' && data?.id) {
        router.push({ pathname: '/contact-detail', params: { id: String(data.id) } });
      } else if (data?.model === 'mail.message') {
        router.push('/(app)/messages');
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [client, uid]);
}

async function registerForPush(): Promise<string | null> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}
