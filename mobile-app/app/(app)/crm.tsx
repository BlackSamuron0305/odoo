import { View, Text } from 'react-native';

export default function CrmScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-subtle">
      <Text className="text-4xl mb-3">📈</Text>
      <Text className="text-xl font-bold text-odoo-900">CRM Pipeline</Text>
      <Text className="text-sm text-odoo-500 mt-1">Coming in Sprint 7</Text>
    </View>
  );
}
