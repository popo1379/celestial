import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#0f0f15",
          elevated: "#14141d",
        },
        accent: {
          gold: "#c9a96e",
          "gold-dim": "#9a8a6a",
        },
        text: {
          primary: "#e8e6e3",
          secondary: "#a8a6a3",
          tertiary: "#6a6865",
        },
        positive: "#4ecdc4",
        challenging: "#ff6b6b",
        "neutral-aspect": "#5a8de2",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
