/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./examples/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Dark theme color palette based on GitHub dark theme
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Dark theme specific colors
        dark: {
          bg: {
            primary: '#0d1117',
            secondary: '#161b22', 
            tertiary: '#1c2129',
            elevated: '#21262d',
          },
          border: {
            primary: '#30363d',
            secondary: '#21262d',
            muted: '#484f58',
          },
          text: {
            primary: '#c9d1d9',
            secondary: '#8b949e',
            muted: '#656d76',
            inverse: '#f0f6fc',
          },
          accent: {
            primary: '#7e43ff',
            hover: '#9057ff',
            muted: '#7e43ff33',
          },
          status: {
            error: '#f85149',
            warning: '#f0883e', 
            success: '#3fb950',
            info: '#58a6ff',
            pending: '#f0883e',
            processing: '#58a6ff',
            completed: '#3fb950',
          }
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
        mono: [
          '"SFMono-Regular"',
          'Consolas',
          '"Liberation Mono"',
          'Menlo',
          'Courier',
          'monospace',
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '96': '24rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'dark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'dark': '0 4px 12px 0 rgb(0 0 0 / 0.3)',
        'dark-lg': '0 10px 25px 0 rgb(0 0 0 / 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'fade-out': 'fadeOut 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    // Custom plugin for component utilities
    function({ addComponents, theme }) {
      addComponents({
        '.content-harvester': {
          fontFamily: theme('fontFamily.sans'),
          backgroundColor: theme('colors.dark.bg.secondary'),
          color: theme('colors.dark.text.primary'),
          borderRadius: theme('borderRadius.lg'),
          border: `1px solid ${theme('colors.dark.border.primary')}`,
        },
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.md'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          transitionProperty: 'all',
          transitionDuration: theme('transitionDuration.200'),
          cursor: 'pointer',
          '&:focus': {
            outline: 'none',
            ringWidth: '2px',
            ringColor: theme('colors.dark.accent.primary'),
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.dark.accent.primary'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.dark.accent.hover'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.dark.bg.tertiary'),
          color: theme('colors.dark.text.primary'),
          border: `1px solid ${theme('colors.dark.border.primary')}`,
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.dark.bg.elevated'),
          },
        },
        '.toast': {
          backgroundColor: theme('colors.dark.bg.elevated'),
          color: theme('colors.dark.text.primary'),
          borderRadius: theme('borderRadius.md'),
          boxShadow: theme('boxShadow.dark-lg'),
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          borderLeft: `4px solid ${theme('colors.dark.accent.primary')}`,
        },
        '.toast-error': {
          borderLeftColor: theme('colors.dark.status.error'),
        },
        '.toast-success': {
          borderLeftColor: theme('colors.dark.status.success'),
        },
        '.toast-warning': {
          borderLeftColor: theme('colors.dark.status.warning'),
        },
      });
    },
  ],
};