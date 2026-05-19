import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        panel: "#f8fafc",
        line: "#e2e8f0",
        accent: "#2563eb",
        accentSoft: "#dbeafe",
      },
      boxShadow: {
        panel: "0 18px 45px -30px rgba(15, 23, 42, 0.45)",
      },
      fontFamily: {
        sans: ["'Segoe UI'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
