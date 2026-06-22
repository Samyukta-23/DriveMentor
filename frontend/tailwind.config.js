/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',     // Deep Navy
        secondary: '#111827',   // Dark Gray
        accentBlue: '#3B82F6',  // Electric Blue
        accentCyan: '#06B6D4',  // Cyan
        accentGreen: '#22C55E', // Success Green
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
