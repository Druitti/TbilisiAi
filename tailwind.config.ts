import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        primary: {
          purple: "#7B61FF",
          blue: "#00C2FF",
          aqua: "#00E5A8",
        },
      },
      backgroundImage: {
        "gradient-prism":
          "linear-gradient(to right, #7B61FF, #00C2FF, #00E5A8)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(123, 97, 255, 0.15)",
        "glow-blue": "0 0 40px rgba(0, 194, 255, 0.12)",
        "glow-aqua": "0 0 40px rgba(0, 229, 168, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
