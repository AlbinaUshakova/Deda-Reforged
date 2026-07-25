import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--bg-surface)",
        panel: "var(--bg-panel)",
        card: "var(--bg-card)",
        "card-hover": "var(--bg-card-hover)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        ui: "var(--ui-accent)",
        ink: {
          DEFAULT: "var(--text-primary)",
          muted: "var(--text-secondary)",
          faint: "var(--text-tertiary)",
        },
        hair: "var(--border-soft)",
        progress: {
          DEFAULT: "var(--progress)",
          good: "var(--progress-good)",
          low: "var(--progress-low)",
          track: "var(--progress-bg)",
        },
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "0 8px 24px rgba(31, 28, 23, 0.07)",
      },
      fontFamily: {
        ui: "var(--font-ui)",
        display: "var(--font-display)",
        georgian: "var(--font-georgian)",
      },
    },
  },
  plugins: [],
};

export default config;
