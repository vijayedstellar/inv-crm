import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F2044", light: "#1B3A6B", mid: "#243B6E" },
        accent: { DEFAULT: "#E8772E", soft: "#F4A261" },
        gold: "#C9A84C",
        teal: { DEFAULT: "#1A9E8F", soft: "#E6F7F5" },
        surface: { DEFAULT: "#F7F8FC", 2: "#EDEEF4" },
        ink: { 1: "#0F2044", 2: "#4A5578", 3: "#8892A4" },
        line: "#DDE1EE",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
