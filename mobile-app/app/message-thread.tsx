import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth';

interface MailMessage {
  id: number;
  body: string;
  author_id: [number, string] | false;
  date: string;
  message_type: string;
  subtype_id: [number, string] | false;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function timeAgo(d: string): string {
  const diff = Math.round((Date.now() - new Date(d).getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
}

export default function MessageThreadScreen() {
  const { model, resId } = useLocalSearchParams<{ model: string; resId: string }>();
  const { client, uid } = useAuthStore();
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    if (!client || !model || !resId) return;
    setIsLoading(true);
    try {
      const data = await client.callKw<MailMessage[]>('mail.message', 'search_read', [], {
        domain: [['res_id', '=', Number(resId)], ['model', '=', model]],
        fields: ['body', 'author_id', 'date', 'message_type', 'subtype_id'],
        limit: 80,
        order: 'date asc',
      });
      setMessages(data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, [client, model, resId]);

  const sendReply = async () => {
    if (!reply.trim() || !client) return;
    setIsSending(true);
    try {
      await client.callKw(model, 'message_post', [[Number(resId)]], {
        body: reply.trim(),
        message_type: 'comment',
        subtype_xmlid: 'mail.mt_comment',
      });
      setReply('');
      await loadMessages();
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-subtle"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#71639e" size="large" />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd()}
          renderItem={({ item }) => {
            const authorName = Array.isArray(item.author_id) ? item.author_id[1] : 'Unknown';
            const isNote = item.message_type === 'comment' && Array.isArray(item.subtype_id) && item.subtype_id[1]?.toLowerCase().includes('note');
            return (
              <View className={`rounded-xl px-4 py-3 ${isNote ? 'bg-amber-50 border border-amber-200' : 'bg-white'}`}>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs font-bold text-odoo-700">{authorName}</Text>
                  <Text className="text-xs text-odoo-400">{timeAgo(item.date)}</Text>
                </View>
                <Text className="text-sm text-odoo-800">{stripHtml(item.body)}</Text>
              </View>
            );
          }}
        />
      )}

      {/* Compose bar */}
      <View className="flex-row items-center gap-2 px-4 py-3 bg-white border-t border-odoo-100">
        <TextInput
          className="flex-1 border border-odoo-200 rounded-xl px-4 py-2 text-base text-odoo-900 bg-surface-subtle"
          value={reply}
          onChangeText={setReply}
          placeholder="Write a reply..."
          multiline
          maxLength={2000}
        />
        <TouchableOpacity
          className={`w-10 h-10 rounded-full items-center justify-center ${reply.trim() ? 'bg-brand-primary' : 'bg-odoo-200'}`}
          onPress={sendReply}
          disabled={!reply.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white text-lg">➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
