/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        secondary: "#1976D2",
        accent: "#FFA000",
        background: "#F5F5F5",
        text: "#212121",
      },
      fontFamily: {
        heebo: ["Heebo", "Assistant", "sans-serif"],
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
      },
      borderRadius: {
        '8': '8px',
      }
    },
  },
  plugins: [],
}
