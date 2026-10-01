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
        // Palet light mode (coolors 000000-14213d-fca311-e5e5e5-ffffff):
        // navy = teks/border/CTA sekunder, oranye = aksen, putih/abu = permukaan.
        cyber: {
          bg: "#ffffff",
          surface: "#e5e5e5",
          card: "#ffffff",
          border: "#14213d",
          light: "#14213d",
        },
        neon: {
          amber: "#fca311",
          orange: "#fca311",
          purple: "#14213d",
        },
        // Aksen: oranye (fill/border/gradient). Teks utama: ink (navy).
        accent: "#fca311",
        signal: "#14213d",
        ink: "#14213d",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        glow: "0 0 18px -6px rgba(252, 163, 17, 0.35)",
        "glow-signal": "0 0 16px -6px rgba(20, 33, 61, 0.3)",
        "glow-orange": "0 0 18px -6px rgba(252, 163, 17, 0.35)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
