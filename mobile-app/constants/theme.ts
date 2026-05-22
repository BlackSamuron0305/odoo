import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  background:   '#ffffff',
  surface:      '#f8f9fa',
  surfaceSubtle:'#f3f2f7',
  text:         '#212529',
  textMuted:    '#6c757d',
  textFaint:    '#adb5bd',
  border:       '#dee2e6',
  borderMuted:  '#e9ecef',
  brandPrimary: '#71639e',
  brandLight:   '#ede9f8',
  danger:       '#dc3545',
  success:      '#28a745',
  warning:      '#ffc107',
  card:         '#ffffff',
  shadow:       '#00000018',
} as const;

export const darkTheme = {
  background:   '#0f0f1a',
  surface:      '#1a1a2e',
  surfaceSubtle:'#141428',
  text:         '#e8e8f0',
  textMuted:    '#9999bb',
  textFaint:    '#5555aa',
  border:       '#2e2e50',
  borderMuted:  '#252540',
  brandPrimary: '#9b8ec4',
  brandLight:   '#2a2445',
  danger:       '#ff6b6b',
  success:      '#51cf66',
  warning:      '#ffd43b',
  card:         '#1e1e35',
  shadow:       '#00000040',
} as const;

export type Theme = typeof lightTheme;

interface ThemeStore {
  mode: 'system' | 'light' | 'dark';
  setMode: (mode: 'system' | 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  setMode: async (mode) => {
    set({ mode });
    await AsyncStorage.setItem('theme_mode', mode);
  },
}));

// Load persisted mode on startup
AsyncStorage.getItem('theme_mode').then((saved) => {
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    useThemeStore.setState({ mode: saved });
  }
});

export function useTheme(): Theme {
  const { mode } = useThemeStore();
  const systemScheme = useColorScheme();
  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  return isDark ? darkTheme : lightTheme;
}
