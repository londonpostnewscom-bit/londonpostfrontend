/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0e2a6d',
        accent: '#c89435',
        soft: '#f4f7fb',
        ink: '#162033'
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.08)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top left, rgba(200,148,53,0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(14,42,109,0.2), transparent 35%)'
      }
    },
  },
  plugins: [],
};
