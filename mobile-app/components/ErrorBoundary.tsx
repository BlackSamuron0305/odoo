import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-4xl">⚠️</Text>
          <Text className="text-lg font-bold text-odoo-900 text-center">
            Something went wrong
          </Text>
          <Text className="text-sm text-odoo-500 text-center">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </Text>
          <TouchableOpacity
            className="bg-brand-primary rounded-xl px-6 py-3"
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
