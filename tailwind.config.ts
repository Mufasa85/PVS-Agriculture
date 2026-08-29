import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        // Correspond aux media queries de la maquette d'origine
        nav: "901px",
      },
      colors: {
        brand: {
          50: "#f6f7fd",
          100: "#e9ebfb",
          300: "#9aa3f0",
          500: "#4d58dd",
          600: "#3a45c4",
          700: "#232d95",
          800: "#171f6e",
          900: "#10154a",
        },
        gold: {
          500: "#dfa62e",
          600: "#c48f22",
        },
        ink: {
          500: "#6b6f8a",
          700: "#3c4058",
          900: "#12142a",
        },
        line: "#e3e5f5",
        muted: {
          light: "#c3c7ec",
          DEFAULT: "#a9adcf",
          dark: "#8f93bd",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(16,21,74,0.06)",
        card: "0 12px 32px rgba(16,21,74,0.10)",
        float: "0 24px 60px rgba(16,21,74,0.16)",
        header: "0 6px 24px rgba(16,21,74,0.06)",
        brand: "0 6px 16px rgba(58,69,196,0.35)",
        "brand-btn": "0 10px 24px rgba(58,69,196,0.30)",
        "brand-btn-hover": "0 16px 32px rgba(58,69,196,0.38)",
        gold: "0 10px 24px rgba(223,166,46,0.35)",
        "gold-pill": "0 10px 22px rgba(223,166,46,0.4)",
        whatsapp: "0 12px 28px rgba(37,211,102,0.45)",
        "img-dark": "0 30px 60px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        pvs: "14px",
        "pvs-lg": "22px",
      },
      transitionTimingFunction: {
        pvs: "cubic-bezier(.16,.8,.24,1)",
      },
      maxWidth: {
        shell: "1220px",
      },
      keyframes: {
        "wa-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        "wa-pulse": "wa-pulse 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
