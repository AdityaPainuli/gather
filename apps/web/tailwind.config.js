/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Include this if you're using the Next.js 13 app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
