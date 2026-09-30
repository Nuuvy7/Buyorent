import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#080c14",
          surface: "#0f1624",
          card: "#141d30",
          border: "#1e293b",
          light: "#28354f",
        },
        neon: {
          amber: "#fbbf24",
          orange: "#f97316",
          purple: "#c084fc",
        },
        // Aksen utama: biru. Hijau (signal) hanya untuk elemen penting:
        // CTA utama, status live/verified, metrik sukses.
        accent: "#38bdf8",
        signal: "#00ff87",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        glow: "0 0 18px -6px rgba(56, 189, 248, 0.35)",
        "glow-signal": "0 0 16px -6px rgba(0, 255, 135, 0.3)",
        "glow-orange": "0 0 18px -6px rgba(249, 115, 22, 0.25)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
