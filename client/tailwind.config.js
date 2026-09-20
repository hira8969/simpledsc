/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A1128',
          navyLight: '#14213D',
          navyDark: '#050B1A',
          purple: '#4F46E5',
          indigo: '#4338CA',
          indigoLight: '#6366F1',
          lavender: '#F8F9FE',
          lavenderDark: '#EEF2FF',
          accent: '#7C3AED',
          success: '#059669',
          warning: '#D97706',
          danger: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(10, 17, 40, 0.05), 0 2px 6px -1px rgba(10, 17, 40, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(10, 17, 40, 0.1), 0 4px 10px -2px rgba(10, 17, 40, 0.04)',
        'elevated': '0 20px 40px -8px rgba(79, 70, 229, 0.12)'
      }
    },
  },
  plugins: [],
}
