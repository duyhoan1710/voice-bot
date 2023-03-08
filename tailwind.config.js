/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        body: "calc(100vh - 5rem)",
      },
      colors: {
        "grey-400": "#F3F3F3",
        "grey-600": "rgba(34, 34, 34, 0.7)",
      },
    },
  },
  plugins: [],
};
