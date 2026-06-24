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
          // ── Core surfaces (deep charcoal theme) ──
          black:      "#13110F",   // page background
          surface:    "#1F1C19",   // subtle surface
          card:       "#1C1916",   // card background
          raised:     "#2E2A26",   // slightly raised surfaces
          border:     "#4B4640",   // default border
          "border-lt":"#625C55",   // lighter border / divider

          // ── Text scale ──
          white:      "#F5F2E9",   // primary text (light)
          "lt-gray":  "#BDB6AA",   // body text — secondary
          mid:        "#9C9387",   // secondary / muted
          subtle:     "#7E776D",   // placeholders / hints

          // ── Accent — Gold
          accent:     "#D4AF37",   // primary gold accent
          "accent-lt":"#F0DA93",   // hover / light state
          "accent-dk":"#A67C1D",   // pressed / dark state
          "accent-muted":"#5A4516", // muted tint bg

          // ── Keep for WhyUs section (light cream bg) ──
          cream:      "#F5F1EA",
          offwhite:   "#F0EEE9",
          slate:      "#1C1C1C",
        },
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body:    ["system-ui", "sans-serif"],
      },
      backgroundImage: {
        "subtle-grid":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
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
