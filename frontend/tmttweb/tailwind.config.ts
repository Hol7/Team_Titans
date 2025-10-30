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
        // Brand colors
        brand: {
          white: "#FFFFFF",
          purple: "#311C3B",
          light: "#F8F7FA",
          dark: "#1A0F21",
        },
        // Primary palette (purple-based)
        primary: {
          50: "#F5F3F7",
          100: "#E8E4ED",
          200: "#D1C9DB",
          300: "#B0A3C1",
          400: "#8B7AA3",
          500: "#311C3B",
          600: "#2A1832",
          700: "#221429",
          800: "#1A0F21",
          900: "#120B17",
        },
        // Accent colors
        accent: {
          purple: "#8B5CF6",
          pink: "#EC4899",
          blue: "#3B82F6",
          cyan: "#06B6D4",
        },
        // Semantic colors
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-lexend)", "system-ui", "sans-serif"],
        lexend: ["var(--font-lexend)", "sans-serif"],
      },
      fontSize: {
        // Mobile-first responsive typography
        xs: ["0.75rem", { lineHeight: "1rem", fontWeight: "400" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        base: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        xl: ["1.25rem", { lineHeight: "1.875rem", fontWeight: "500" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        "5xl": ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        "6xl": ["3.75rem", { lineHeight: "1.1", fontWeight: "800" }],
        "7xl": ["4.5rem", { lineHeight: "1", fontWeight: "800" }],
      },
      spacing: {
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "8": "2rem",
        "10": "2.5rem",
        "12": "3rem",
        "16": "4rem",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "aurora": "aurora 60s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        aurora: {
          "0%, 100%": { transform: "translateX(-50%) translateY(-50%) rotate(0deg)" },
          "50%": { transform: "translateX(-50%) translateY(-50%) rotate(180deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" },
          "100%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;