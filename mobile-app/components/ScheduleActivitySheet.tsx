import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, ScrollView,
  ActivityIndicator, Platform,
} from 'react-native';
import { useAuthStore } from '@/stores/auth';

interface ActivityType {
  id: number;
  name: string;
}

interface ScheduleActivitySheetProps {
  visible: boolean;
  resModel: string;
  resId: number;
  onClose: () => void;
  onScheduled?: () => void;
}

const FALLBACK_TYPES: ActivityType[] = [
  { id: 1, name: 'Email' },
  { id: 2, name: 'Call' },
  { id: 3, name: 'Meeting' },
  { id: 4, name: 'Task' },
];

export function ScheduleActivitySheet({
  visible, resModel, resId, onClose, onScheduled,
}: ScheduleActivitySheetProps) {
  const { client } = useAuthStore();
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>(FALLBACK_TYPES);
  const [selectedType, setSelectedType] = useState<number>(FALLBACK_TYPES[0].id);
  const [summary, setSummary] = useState('');
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load activity types when modal opens
  const loadTypes = async () => {
    if (!client) return;
    try {
      const types = await client.callKw<ActivityType[]>('mail.activity.type', 'search_read', [], {
        fields: ['name'],
        limit: 20,
      });
      if (types?.length) {
        setActivityTypes(types);
        setSelectedType(types[0].id);
      }
    } catch { /* use fallback */ }
  };

  const handleSchedule = async () => {
    if (!client) return;
    setIsSaving(true);
    setError(null);
    try {
      await client.callKw('mail.activity', 'create', [{
        res_model: resModel,
        res_id: resId,
        activity_type_id: selectedType,
        summary,
        note,
        date_deadline: dueDate,
      }]);
      onScheduled?.();
      onClose();
      setSummary('');
      setNote('');
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
      onShow={loadTypes}
    >
      <View className="flex-1 bg-surface-subtle">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-odoo-100">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-brand-primary text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-base font-bold text-odoo-900">Schedule Activity</Text>
          <TouchableOpacity onPress={handleSchedule} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#71639e" /> : (
              <Text className="text-brand-primary text-base font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="gap-4 pb-8">
          {/* Activity Type */}
          <View className="gap-2">
            <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest">Activity Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              <View className="flex-row gap-2">
                {activityTypes.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    className={`px-4 py-2 rounded-full border ${
                      selectedType === t.id
                        ? 'bg-brand-primary border-brand-primary'
                        : 'bg-white border-odoo-200'
                    }`}
                    onPress={() => setSelectedType(t.id)}
                  >
                    <Text className={`text-sm font-semibold ${
                      selectedType === t.id ? 'text-white' : 'text-odoo-700'
                    }`}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Summary */}
          <View className="gap-1">
            <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest">Summary</Text>
            <TextInput
              className="bg-white border border-odoo-200 rounded-xl px-4 py-3 text-base text-odoo-900"
              value={summary}
              onChangeText={setSummary}
              placeholder="Brief summary..."
            />
          </View>

          {/* Due Date */}
          <View className="gap-1">
            <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest">Due Date</Text>
            <TextInput
              className="bg-white border border-odoo-200 rounded-xl px-4 py-3 text-base text-odoo-900"
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
            />
          </View>

          {/* Note */}
          <View className="gap-1">
            <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest">Note</Text>
            <TextInput
              className="bg-white border border-odoo-200 rounded-xl px-4 py-3 text-base text-odoo-900"
              value={note}
              onChangeText={setNote}
              placeholder="Optional note..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          </View>

          {error && (
            <View className="bg-red-50 rounded-lg px-3 py-2">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
