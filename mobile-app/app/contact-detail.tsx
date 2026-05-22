import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { SkeletonCard } from '@/components/SkeletonLoader';

interface ContactDetail {
  id: number;
  name: string;
  email: string | false;
  phone: string | false;
  mobile: string | false;
  job_position: string | false;
  company_id: [number, string] | false;
  street: string | false;
  city: string | false;
  country_id: [number, string] | false;
}

function InfoRow({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center px-4 py-3 border-b border-odoo-100"
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <Text className="text-sm text-odoo-500 w-24">{label}</Text>
      <Text className={`text-sm flex-1 text-right ${onPress ? 'text-brand-primary font-medium' : 'text-odoo-800'}`}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { client, serverUrl } = useAuthStore();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!client || !id) return;
    client.callKw<ContactDetail[]>('res.partner', 'read', [[Number(id)]], {
      fields: ['name', 'email', 'phone', 'mobile', 'job_position', 'company_id', 'street', 'city', 'country_id'],
    })
      .then(([c]) => setContact(c ?? null))
      .catch(() => setContact(null))
      .finally(() => setIsLoading(false));
  }, [client, id]);

  const openInBrowser = () => {
    if (serverUrl && id) {
      Linking.openURL(`${serverUrl}/web#model=res.partner&id=${id}&view_type=form`);
    }
  };

  const scheduleActivity = () => {
    Alert.alert('Schedule Activity', 'Full activity scheduling coming in Sprint 9.', [{ text: 'OK' }]);
  };

  const address = [contact?.street, contact?.city, Array.isArray(contact?.country_id) ? contact.country_id[1] : null]
    .filter(Boolean).join(', ');

  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-surface-subtle px-4 pt-6 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </ScrollView>
    );
  }

  if (!contact) {
    return (
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-4xl">❓</Text>
        <Text className="text-base font-semibold text-odoo-700">Contact not found</Text>
        <TouchableOpacity className="bg-brand-primary rounded-xl px-6 py-3" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials = contact.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const palette = ['#71639e', '#3b7dd8', '#27ae60', '#e67e22', '#e74c3c'];
  const color = palette[contact.name.charCodeAt(0) % palette.length];

  return (
    <ScrollView className="flex-1 bg-surface-subtle" contentContainerClassName="pb-8">
      {/* Header */}
      <View className="items-center py-8 bg-white">
        <View style={{ backgroundColor: color }} className="w-20 h-20 rounded-full items-center justify-center mb-3">
          <Text className="text-white text-3xl font-bold">{initials}</Text>
        </View>
        <Text className="text-xl font-bold text-odoo-900">{contact.name}</Text>
        {contact.job_position && (
          <Text className="text-sm text-odoo-500 mt-0.5">{contact.job_position}</Text>
        )}
        {Array.isArray(contact.company_id) && (
          <Text className="text-sm text-brand-primary mt-0.5">{contact.company_id[1]}</Text>
        )}
      </View>

      {/* Quick actions */}
      <View className="flex-row justify-around px-4 py-4 bg-white mt-2">
        {contact.phone || contact.mobile ? (
          <TouchableOpacity className="items-center gap-1"
            onPress={() => Linking.openURL(`tel:${contact.phone || contact.mobile}`)}>
            <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
              <Text className="text-xl">📞</Text>
            </View>
            <Text className="text-xs text-odoo-500">Call</Text>
          </TouchableOpacity>
        ) : null}
        {contact.email ? (
          <TouchableOpacity className="items-center gap-1"
            onPress={() => Linking.openURL(`mailto:${contact.email}`)}>
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
              <Text className="text-xl">✉️</Text>
            </View>
            <Text className="text-xs text-odoo-500">Email</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity className="items-center gap-1" onPress={scheduleActivity}>
          <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center">
            <Text className="text-xl">📅</Text>
          </View>
          <Text className="text-xs text-odoo-500">Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center gap-1" onPress={openInBrowser}>
          <View className="w-12 h-12 rounded-full bg-odoo-100 items-center justify-center">
            <Text className="text-xl">🌐</Text>
          </View>
          <Text className="text-xs text-odoo-500">Browser</Text>
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View className="bg-white rounded-xl mt-2 overflow-hidden mx-4">
        {contact.email && (
          <InfoRow label="Email" value={contact.email} onPress={() => Linking.openURL(`mailto:${contact.email}`)} />
        )}
        {contact.phone && (
          <InfoRow label="Phone" value={contact.phone} onPress={() => Linking.openURL(`tel:${contact.phone}`)} />
        )}
        {contact.mobile && (
          <InfoRow label="Mobile" value={contact.mobile} onPress={() => Linking.openURL(`tel:${contact.mobile}`)} />
        )}
        {address ? (
          <InfoRow label="Address" value={address}
            onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`)} />
        ) : null}
      </View>
    </ScrollView>
  );
}
