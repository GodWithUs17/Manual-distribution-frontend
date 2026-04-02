/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This ensures Tailwind scans your React components
  ],
  theme: {
    extend: {
            colors: {
        lautech: {
          green: '#1B5E20', // Deep green
          navy: '#1A237E',  // Navy blue
          gold: '#D4A574',  // Muted gold
          cream: '#F5F1E8', // Warm cream
          creamDark: '#E5E0D8', // Darker cream for borders
        }
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'], // Academic authority
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean body text
      }
    },
  },
  plugins: [],
}