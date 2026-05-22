const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Odoo brand tokens (from tokens/tokens.json)
        brand: {
          primary:   '#71639e',
          secondary: '#8f8f8f',
          action:    '#017e84',
        },
        status: {
          success: '#28a745',
          warning: '#ffac00',
          danger:  '#dc3545',
          info:    '#17a2b8',
        },
        odoo: {
          // Gray scale
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle:  '#f8f9fa',
          dark:    '#1a1a2e',
          'dark-subtle': '#1e1e2e',
        },
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
        mono: ['Courier', 'monospace'],
      },
      fontSize: {
        'xs':  ['11px', { lineHeight: '16px' }],
        'sm':  ['12px', { lineHeight: '18px' }],
        'base':['14px', { lineHeight: '22px' }],
        'lg':  ['16px', { lineHeight: '24px' }],
        'xl':  ['18px', { lineHeight: '28px' }],
        '2xl': ['22px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '40px' }],
        '4xl': ['36px', { lineHeight: '48px' }],
      },
      spacing: {
        '0.5': '2px', '1': '4px', '2': '8px', '3': '12px', '4': '16px',
        '5': '20px', '6': '24px', '8': '32px', '10': '40px', '12': '48px',
      },
      borderRadius: {
        'sm':   '3px',
        DEFAULT:'4px',
        'md':   '6px',
        'lg':   '8px',
        'xl':   '12px',
        '2xl':  '16px',
        'full': '9999px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.06)',
        DEFAULT: '0 2px 4px rgba(0,0,0,0.08)',
        'md': '0 2px 8px rgba(0,0,0,0.10)',
        'lg': '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
