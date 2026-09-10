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
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          hover: "var(--bg-card-hover)",
          elevated: "var(--bg-elevated)",
          sidebar: "var(--sidebar-bg)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          emphasis: "var(--border-emphasis)",
        },
        accent: "var(--accent)",
        positive: "var(--positive)",
        negative: "var(--negative)",
        neutral: "var(--neutral)",
        info: "var(--info)",
        "ai-purple": "var(--ai-purple)",
        destructive: "var(--destructive)",
        warning: "var(--warning)",
        red: "var(--destructive)",
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
