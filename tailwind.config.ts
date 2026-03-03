/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#0A0A0F",
          secondary: "#12121A",
        },
        primary: "#6366f1",
        accent: "#22c55e",
      },

      backgroundImage: {
        "dark-gradient":
          "linear-gradient(to right, #0A0A0F, #12121A, #0A0A0F)",
      },
    },
  },
  plugins: [],
};
