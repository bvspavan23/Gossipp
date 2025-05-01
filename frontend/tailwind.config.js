/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Baloo 2"', 'sans-serif'],
      chewy: ['Chewy', 'cursive'],
      baloo: ['"Baloo 2"', 'cursive'],
    },
    extend: {},
  },
  plugins: [],
}