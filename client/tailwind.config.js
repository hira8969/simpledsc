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
          purple: '#5B2EFF',
          purpleHover: '#4A22DE',
          purpleLight: '#F3EFFF',
          purpleSecondary: '#703BFF',
          darkPurple: '#25145F',
          navy: '#11112F',
          navyDark: '#0B0B20',
          bg: '#FAF9FF',
          text: '#16162D',
          muted: '#70708A',
          border: '#E5E2F0',
          card: '#FFFFFF',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(17, 17, 47, 0.05), 0 2px 6px -1px rgba(17, 17, 47, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(91, 46, 255, 0.12), 0 4px 10px -2px rgba(17, 17, 47, 0.04)',
        'elevated': '0 20px 40px -8px rgba(91, 46, 255, 0.15)',
        'token-glow': '0 15px 35px -5px rgba(91, 46, 255, 0.35)'
      }
    },
  },
  plugins: [],
}
