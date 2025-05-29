/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Include the content harvester components
    '../../src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme color palette
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
    },
  },
  plugins: [],
};