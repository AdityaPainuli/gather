/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Include this if you're using the Next.js 13 app directory
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' }
        }
      },
      animation: {
        pulse: 'pulse 2s ease-in-out infinite'
      }
    }
  },
  plugins: [],
};
