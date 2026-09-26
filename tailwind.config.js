/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kraft: {
          bg: "#0e0d0c",
          panel: "#171513",
          gold: "#c9a24b",
          goldlight: "#e6c877",
          cream: "#f4ede0",
          line: "#2a2724",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
