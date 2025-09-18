/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f1419',
        'dark-surface': '#1a1f26',
        'dark-border': '#374151',
      }
    },
  },
  plugins: [],
}