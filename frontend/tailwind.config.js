/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E88E5",
        secondary: "#00E5FF",
        dark: "#0A0F1C",
        textMain: "#FFFFFF",
        textSecondary: "#B0BEC5",
        accent: "#00BCD4",
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 188, 212, 0.4)',
      }
    },
  },
  plugins: [],
}
