import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useOdooQuery } from '@/hooks/useOdooQuery';
import { SkeletonCard } from '@/components/SkeletonLoader';

interface CalendarEvent {
  id: number;
  name: string;
  start: string;
  stop: string;
  partner_ids: number[];
  location: string | false;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function isoDate(d: Date) {
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function CalendarScreen() {
  const { uid } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Build week range for the selected date's week
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const { data: events, isLoading, refetch } = useOdooQuery<CalendarEvent>('calendar.event', {
    domain: [
      ['partner_ids', 'in', [uid ?? 0]],
      ['start', '>=', isoDate(startOfWeek)],
      ['start', '<', isoDate(endOfWeek)],
    ],
    fields: ['name', 'start', 'stop', 'location'],
    limit: 50,
    order: 'start asc',
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const eventsForSelected = events.filter((e) => {
    const eDate = new Date(e.start);
    return eDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <ScrollView
      className="flex-1 bg-surface-subtle"
      contentContainerClassName="pb-6"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      {/* Month header + week nav */}
      <View className="bg-white px-4 pt-4 pb-3">
        <View className="flex-row justify-between items-center mb-3">
          <TouchableOpacity onPress={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() - 7);
            setSelectedDate(d);
          }}>
            <Text className="text-brand-primary font-semibold text-lg">‹</Text>
          </TouchableOpacity>
          <Text className="text-base font-bold text-odoo-900">
            {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + 7);
            setSelectedDate(d);
          }}>
            <Text className="text-brand-primary font-semibold text-lg">›</Text>
          </TouchableOpacity>
        </View>

        {/* Week strip */}
        <View className="flex-row justify-between">
          {weekDays.map((d, i) => {
            const isSelected = d.toDateString() === selectedDate.toDateString();
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <TouchableOpacity
                key={i}
                className="items-center gap-1 flex-1"
                onPress={() => setSelectedDate(new Date(d))}
              >
                <Text className="text-xs text-odoo-400">{DAYS[d.getDay()]}</Text>
                <View className={`w-8 h-8 rounded-full items-center justify-center ${
                  isSelected ? 'bg-brand-primary' : isToday ? 'bg-brand-light' : ''
                }`}>
                  <Text className={`text-sm font-semibold ${
                    isSelected ? 'text-white' : isToday ? 'text-brand-primary' : 'text-odoo-800'
                  }`}>
                    {d.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Events for selected day */}
      <View className="px-4 mt-4 gap-3">
        <Text className="text-xs font-bold text-odoo-500 uppercase tracking-widest">
          {selectedDate.toDateString() === new Date().toDateString() ? "Today's Events" : 'Events'}
        </Text>

        {isLoading ? (
          <View className="gap-2">{[1, 2].map((k) => <SkeletonCard key={k} />)}</View>
        ) : eventsForSelected.length === 0 ? (
          <View className="bg-white rounded-xl p-6 items-center gap-2">
            <Text className="text-3xl">🗓️</Text>
            <Text className="text-base font-semibold text-odoo-700">No events</Text>
            <Text className="text-sm text-odoo-400">Nothing scheduled for this day</Text>
          </View>
        ) : (
          eventsForSelected.map((event) => (
            <View key={event.id} className="bg-white rounded-xl px-4 py-3 flex-row gap-3">
              <View className="w-1 rounded-full bg-brand-primary self-stretch" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-odoo-900">{event.name}</Text>
                <Text className="text-xs text-odoo-500 mt-0.5">
                  {formatTime(event.start)} – {formatTime(event.stop)}
                </Text>
                {event.location && (
                  <Text className="text-xs text-odoo-400 mt-0.5">📍 {event.location}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
