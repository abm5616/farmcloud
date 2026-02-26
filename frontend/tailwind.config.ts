import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(32, 45%, 45%)",
        "primary-light": "hsl(32, 50%, 55%)",
        accent: "hsl(16, 65%, 55%)",
        bg: "hsl(40, 33%, 96%)",
        card: "hsl(40, 30%, 98%)",
        fg: "hsl(25, 30%, 15%)",
        muted: "hsl(25, 15%, 45%)",
        border: "hsl(35, 25%, 85%)",
        success: "hsl(85, 35%, 40%)",
        warning: "hsl(38, 90%, 50%)",
        destructive: "hsl(8, 70%, 50%)",
        sidebar: {
          bg: "hsl(25, 25%, 18%)",
          fg: "hsl(40, 25%, 92%)",
          muted: "hsl(40, 15%, 55%)",
          accent: "hsl(25, 20%, 25%)",
          highlight: "hsl(32, 45%, 55%)",
        },
      },
      borderRadius: {
        DEFAULT: "0.625rem",
      },
      boxShadow: {
        DEFAULT: "0 2px 12px -2px hsl(25 30% 15% / 0.08)",
        lg: "0 4px 20px -4px hsl(25 30% 15% / 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
