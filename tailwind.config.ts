import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "water-wave-1": {
          "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: "0.8" },
          "100%": { transform: "translate(-50%, -50%) scale(1.6)", opacity: "0" },
        },
        "water-wave-2": {
          "0%": { transform: "translate(-50%, -50%) scale(0.6)", opacity: "0.8" },
          "100%": { transform: "translate(-50%, -50%) scale(1.4)", opacity: "0" },
        },
        "water-wave-3": {
          "0%": { transform: "translate(-50%, -50%) scale(0.4)", opacity: "0.8" },
          "100%": { transform: "translate(-50%, -50%) scale(1.2)", opacity: "0" },
        },
        "glow-text": {
          "0%,100%": { textShadow: "0 0 10px rgba(236,72,153,0.6)" },
          "50%": { textShadow: "0 0 18px rgba(236,72,153,0.9)" },
        },
      },
      animation: {
        "fade-in": "fade-in 600ms ease-out both",
        "spin-slow": "spin-slow 10s linear infinite",
        "water-wave-1": "water-wave-1 1.8s ease-out infinite",
        "water-wave-2": "water-wave-2 2.2s ease-out infinite",
        "water-wave-3": "water-wave-3 2.6s ease-out infinite",
        "glow-text": "glow-text 2.8s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
} satisfies Config;


