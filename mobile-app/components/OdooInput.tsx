import { View, TextInput, Text, type TextInputProps } from 'react-native';

interface OdooInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function OdooInput({ label, error, ...props }: OdooInputProps) {
  return (
    <View className="gap-1">
      {label && (
        <Text className="text-xs font-semibold text-odoo-600 uppercase tracking-widest">
          {label}
        </Text>
      )}
      <TextInput
        className={`border rounded-xl px-4 py-3 text-base text-odoo-900 bg-white ${
          error ? 'border-status-danger' : 'border-odoo-300'
        }`}
        placeholderTextColor="#adb5bd"
        {...props}
      />
      {error && (
        <Text className="text-status-danger text-xs">{error}</Text>
      )}
    </View>
  );
}
