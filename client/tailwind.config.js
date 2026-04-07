/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#0d0a1a',
          card: '#1a1535',
          border: '#2a2550',
          gold: '#f0c060',
          'gold-dim': 'rgba(240,192,96,0.15)',
        },
        phase: {
          menstrual: '#c04080',
          follicular: '#6080e0',
          ovulatory: '#40c080',
          luteal: '#c08040',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
