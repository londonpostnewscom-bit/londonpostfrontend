/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
              primary: '#16324F',  // navy — your logo, structural
  accent:  '#B3231D',  // red  — your logo, urgent/investigative
  gold:    '#C9932F',  // editorial warmth
  lagoon:  '#1F6F6B',  // regional/forum cool
  azure:   '#2E6F9E',  // aviation — sky
  ink:     '#0B1220',
  soft:    '#F4F5F7',
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
