import { View, Text, TextInput, TouchableOpacity, FlatList, Linking } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOdooQuery } from '@/hooks/useOdooQuery';
import { SkeletonCard } from '@/components/SkeletonLoader';

interface Partner {
  id: number;
  name: string;
  email: string | false;
  phone: string | false;
  mobile: string | false;
  job_position: string | false;
  company_id: [number, string] | false;
}

function AvatarCircle({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const palette = ['#71639e', '#3b7dd8', '#27ae60', '#e67e22', '#e74c3c'];
  const color = palette[name.charCodeAt(0) % palette.length];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }}
      className="items-center justify-center">
      <Text style={{ fontSize: size * 0.35, color: 'white', fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

export default function ContactsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const domain = search.trim() ? [['name', 'ilike', search.trim()]] : [];

  const { data: contacts, isLoading, refetch } = useOdooQuery<Partner>('res.partner', {
    domain,
    fields: ['name', 'email', 'phone', 'mobile', 'job_position', 'company_id'],
    limit: 80,
    order: 'name asc',
  });

  return (
    <View className="flex-1 bg-surface-subtle">
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-white border border-odoo-200 rounded-xl px-3 gap-2">
          <Text className="text-odoo-400">🔍</Text>
          <TextInput
            className="flex-1 py-3 text-base text-odoo-900"
            placeholder="Search contacts..."
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-odoo-400 text-lg">✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {isLoading && contacts.length === 0 ? (
        <View className="px-4 gap-2 mt-2">{[1, 2, 3, 4].map((k) => <SkeletonCard key={k} />)}</View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center gap-3 py-3 border-b border-odoo-100"
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/contact-detail', params: { id: item.id } })}
            >
              <AvatarCircle name={item.name} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-odoo-900" numberOfLines={1}>{item.name}</Text>
                <Text className="text-xs text-odoo-500" numberOfLines={1}>
                  {[item.job_position, Array.isArray(item.company_id) ? item.company_id[1] : null].filter(Boolean).join(' · ')}
                </Text>
              </View>
              {item.phone || item.mobile ? (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone || item.mobile}`)} className="p-2">
                  <Text>📞</Text>
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Text className="text-4xl">👥</Text>
              <Text className="text-base font-semibold text-odoo-700">
                {search ? 'No contacts found' : 'No contacts yet'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
