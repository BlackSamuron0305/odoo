import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { useOdooQuery } from '@/hooks/useOdooQuery';
import { SkeletonCard } from '@/components/SkeletonLoader';

interface MailMessage {
  id: number;
  subject: string;
  body: string;
  author_id: [number, string] | false;
  date: string;
  model: string;
  res_id: number;
  message_type: string;
  is_read: boolean | undefined;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 120);
}

function timeAgo(dateStr: string): string {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <View className="w-10 h-10 rounded-full bg-brand-light items-center justify-center">
      <Text className="text-sm font-bold text-brand-primary">{initials}</Text>
    </View>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const { uid } = useAuthStore();

  const { data: messages, isLoading, refetch } = useOdooQuery<MailMessage>('mail.message', {
    domain: [
      ['res_id', '!=', false],
      ['message_type', 'in', ['email', 'comment']],
      ['partner_ids', 'in', [uid ?? 0]],
    ],
    fields: ['subject', 'body', 'author_id', 'date', 'model', 'res_id', 'message_type'],
    limit: 40,
    order: 'date desc',
  });

  return (
    <View className="flex-1 bg-surface-subtle">
      <FlatList
        data={messages}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
            </View>
          ) : (
            <View className="items-center py-20 gap-3">
              <Text className="text-5xl">💬</Text>
              <Text className="text-lg font-bold text-odoo-800">No messages</Text>
              <Text className="text-sm text-odoo-400">Your inbox is empty</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const authorName = Array.isArray(item.author_id) ? item.author_id[1] : 'Unknown';
          return (
            <TouchableOpacity
              className="bg-white rounded-xl px-4 py-3 flex-row gap-3 items-start"
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/message-thread', params: { model: item.model, resId: item.res_id } })}
            >
              <AuthorAvatar name={authorName} />
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="text-sm font-semibold text-odoo-900 flex-1" numberOfLines={1}>
                    {authorName}
                  </Text>
                  <Text className="text-xs text-odoo-400 ml-2">{timeAgo(item.date)}</Text>
                </View>
                {item.subject ? (
                  <Text className="text-sm text-odoo-700 mt-0.5" numberOfLines={1}>{item.subject}</Text>
                ) : null}
                <Text className="text-xs text-odoo-400 mt-0.5" numberOfLines={2}>
                  {stripHtml(item.body)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
