import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#71639e',
        tabBarInactiveTintColor: '#adb5bd',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#e9ecef',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: '#71639e' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tabs.Screen name="crm" options={{ title: 'CRM', tabBarIcon: ({ focused }) => <TabIcon emoji="📈" focused={focused} /> }} />
      <Tabs.Screen name="contacts" options={{ title: 'Contacts', tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} /> }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} /> }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ focused }) => <TabIcon emoji="⋯" focused={focused} /> }} />
      {/* Hidden from tab bar but accessible as routes */}
      <Tabs.Screen name="calendar" options={{ href: null, title: 'Calendar' }} />
      <Tabs.Screen name="activities" options={{ href: null, title: 'Activities' }} />
    </Tabs>
  );
}
