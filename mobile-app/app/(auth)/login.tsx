import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useAuthStore } from '@/stores/auth';

export default function LoginScreen() {
  const { login, serverUrl, database, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    clearError();
    try {
      await login(email.trim(), password);
    } catch {
      // error set in store
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6">
        {/* Logo */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-2xl bg-brand-primary items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">O</Text>
          </View>
          <Text className="text-3xl font-bold text-odoo-900">Sign In</Text>
          <Text className="text-sm text-odoo-500 mt-1">{serverUrl}</Text>
          {database && (
            <View className="mt-1 px-3 py-1 bg-odoo-100 rounded-full">
              <Text className="text-xs text-odoo-600">{database}</Text>
            </View>
          )}
        </View>

        {/* Form */}
        <View className="gap-3">
          <TextInput
            className="border border-odoo-300 rounded-xl px-4 py-3 text-base text-odoo-900 bg-white"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <View className="relative">
            <TextInput
              className="border border-odoo-300 rounded-xl px-4 py-3 text-base text-odoo-900 bg-white pr-12"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!showPassword}
              textContentType="password"
              autoComplete="password"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              className="absolute right-4 top-3.5"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text className="text-odoo-500">{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View className="bg-status-danger/10 rounded-lg px-3 py-2">
              <Text className="text-status-danger text-sm">{error}</Text>
            </View>
          )}

          <TouchableOpacity
            className="bg-brand-primary rounded-xl py-4 items-center mt-2"
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
