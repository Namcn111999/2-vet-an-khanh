/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        ink: "#2A1710",
        paper: "#FBF5EC",
        clay: {
          DEFAULT: "#7B391A",
          dark: "#4A2110",
          light: "#A6673C",
        },
        tan: "#F6EEE2",
        amber: {
          DEFAULT: "#FFA400",
          dark: "#D98A00",
        },
        rust: {
          DEFAULT: "#C97D3D",
          light: "#F2DCC0",
          dark: "#9C5F28",
        },
        line: "#EAD8C7",
      },
      fontFamily: {
        display: ["'Literata'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};
