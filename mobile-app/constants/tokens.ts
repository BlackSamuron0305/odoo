// Re-export design tokens for use inside React Native components
// Source of truth: tokens/tokens.ts (root of the monorepo)

export const colors = {
  brand: {
    primary:   '#71639e',
    secondary: '#c2b9de',
    light:     '#ede9f8',
  },
  odoo: {
    50:  '#faf9fd',
    100: '#f3f1f9',
    200: '#e5e0f2',
    300: '#d0c8e8',
    400: '#b3a7d7',
    500: '#8f82be',
    600: '#7a6caa',
    700: '#6a5c99',
    800: '#5c4f87',
    900: '#3b2e6e',
  },
  status: {
    success: '#28a745',
    warning: '#ffc107',
    danger:  '#dc3545',
    info:    '#17a2b8',
  },
  surface: {
    DEFAULT: '#f8f9fa',
    subtle:  '#f3f2f7',
    white:   '#ffffff',
  },
} as const;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  '2xl': 48,
} as const;

export const radii = {
  sm:  4,
  md:  8,
  lg:  12,
  xl:  16,
  '2xl': 24,
  full: 9999,
} as const;

export const fontSizes = {
  xs:   11,
  sm:   13,
  base: 16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 30,
} as const;
