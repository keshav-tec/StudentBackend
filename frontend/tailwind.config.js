/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        peerly: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#2e1065"
        },
        accent: {
          500: "#d4872c",
          600: "#bd7421"
        }
      },
      boxShadow: {
        "3d": "0 18px 40px rgba(20, 16, 70, 0.18)",
        "3d-hover": "0 25px 55px rgba(20, 16, 70, 0.25)"
      }
    }
  },
  plugins: []
};