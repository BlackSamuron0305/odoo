import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/auth';

export default function SetupScreen() {
  const router = useRouter();
  const { setServerUrl, availableDatabases, database, isLoading, error, clearError } = useAuthStore();
  const setDatabase = useAuthStore((s) => s.database);

  const [url, setUrl] = useState('https://');
  const [selectedDb, setSelectedDb] = useState<string | null>(null);

  const handleConnect = async () => {
    clearError();
    try {
      await setServerUrl(url.trim());
    } catch {
      // error is set in store
    }
  };

  const handleContinue = () => {
    if (!selectedDb && availableDatabases.length > 0) {
      Alert.alert('Select a database', 'Please select a database to continue.');
      return;
    }
    useAuthStore.setState({ database: selectedDb ?? availableDatabases[0] });
    router.replace('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-2xl bg-brand-primary items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">O</Text>
          </View>
          <Text className="text-3xl font-bold text-odoo-900">Connect to Odoo</Text>
          <Text className="text-base text-odoo-500 mt-2 text-center">
            Enter your Odoo server address
          </Text>
        </View>

        <View className="gap-4">
          <TextInput
            className="border border-odoo-300 rounded-xl px-4 py-3 text-base text-odoo-900 bg-white"
            value={url}
            onChangeText={setUrl}
            placeholder="https://your-odoo-server.com"
            autoCapitalize="none"
            keyboardType="url"
            autoCorrect={false}
          />

          {error && (
            <Text className="text-status-danger text-sm">{error}</Text>
          )}

          <TouchableOpacity
            className="bg-brand-primary rounded-xl py-4 items-center"
            onPress={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">Connect</Text>
            )}
          </TouchableOpacity>
        </View>

        {availableDatabases.length > 0 && (
          <View className="mt-6 gap-3">
            <Text className="text-sm font-semibold text-odoo-600 uppercase tracking-widest">
              Select Database
            </Text>
            {availableDatabases.map((db) => (
              <TouchableOpacity
                key={db}
                className={`border rounded-xl px-4 py-3 flex-row justify-between items-center ${
                  (selectedDb ?? availableDatabases[0]) === db
                    ? 'border-brand-primary bg-brand-primary/10'
                    : 'border-odoo-200 bg-white'
                }`}
                onPress={() => setSelectedDb(db)}
              >
                <Text className={`text-base ${
                  (selectedDb ?? availableDatabases[0]) === db
                    ? 'text-brand-primary font-semibold'
                    : 'text-odoo-700'
                }`}>{db}</Text>
                {(selectedDb ?? availableDatabases[0]) === db && (
                  <Text className="text-brand-primary">✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="bg-brand-primary rounded-xl py-4 items-center mt-2"
              onPress={handleContinue}
            >
              <Text className="text-white text-base font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
