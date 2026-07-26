
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
        brand: {
          // ── Lifted Dark Surfaces (Warmer charcoal base with lighter cards) ──
          black:       "#1E1B18",   // Page background (lighter, warmer charcoal instead of harsh #13110F)
          surface:     "#2A2622",   // Distinct section background
          card:        "#2E2A25",   // Card background — elevated & distinctly visible
          raised:      "#3B3630",   // Interactive hover states & raised elements
          border:      "#585148",   // Crisper, well-defined borders
          "border-lt": "#70685E",   // Lighter dividers / active element outlines

          // ── Text Scale (High Contrast & Sharp Readability) ──
          white:       "#FAFAFA",   // Primary headers — bright clean white for maximum pop
          "lt-gray":   "#E2DDD5",   // Body text — crisp light stone (much easier to read)
          mid:         "#BDB5A8",   // Secondary captions / labels
          subtle:      "#938B7E",   // Placeholders & muted meta text

          // ── Accent — Bright Warm Gold ──
          accent:      "#E5B83A",   // Lighter, higher-contrast gold accent
          "accent-lt": "#F5CE58",   // Hover state
          "accent-dk": "#BF931D",   // Active/Pressed state
          "accent-muted":"#423412", // Subdued highlight background

          // ── Utility Light Shades ──
          cream:       "#F5F1EA",   // Accent section background (e.g. WhyUs light section)
          offwhite:    "#EFECE6",   // Light UI elements
          slate:       "#181614",   // Deep contrast elements
        },
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body:    ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      backgroundImage: {
        "subtle-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "subtle-grid": "48px 48px",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.55s ease forwards",
        "fade-in":  "fadeIn 0.35s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;