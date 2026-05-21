/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../components/**/*.{js,ts,jsx,tsx}" // Support components in root if we keep them there
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
