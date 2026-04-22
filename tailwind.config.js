/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FDF6EC', dark: '#F5EDE0' },
        beige: { DEFAULT: '#E8D5B7', light: '#F0E6D3' },
        'warm-brown': { DEFAULT: '#5C3D2E', light: '#7A5A4A' },
        'rich-brown': '#3E2723',
        gold: { DEFAULT: '#C8A45A', light: '#D4B86A', dark: '#A88B3F' },
        'sage-green': { DEFAULT: '#4A7C59', light: '#5A9169' },
        charcoal: '#2C2C2C',
        ivory: '#FFFFF0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(92, 61, 46, 0.08)',
        'card-hover': '0 8px 30px rgba(92, 61, 46, 0.15)',
        gold: '0 4px 15px rgba(200, 164, 90, 0.3)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
