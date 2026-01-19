/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080808",
        foreground: "#F5F5F0",
        primary: {
          DEFAULT: "#FFCC00",
          foreground: "#080808",
        },
        accent: {
          DEFAULT: "#00E6E6",
          foreground: "#080808",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
