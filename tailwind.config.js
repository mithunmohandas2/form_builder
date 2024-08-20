/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      // fontFamily: {
      //   'roboto': ['Roboto', 'sans-serif'],
      // },
      colors: {
        headerText: "#808080",
        headerSelectedText: "#161691",
        headerSelectedBg: "#BBBBE9",
        headerHoverBg: "#E8E8F8",
        primary: "#1C1CB5",
        primaryHover: "#14147F",
        dragBox: "#7777D3",
      },
    }
  },
  plugins: [],
}

