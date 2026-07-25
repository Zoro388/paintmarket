// // import type { Config } from "tailwindcss";

// // const config: Config = {
// //   content: [
// //     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
// //     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
// //     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
// //   ],
// //   theme: {
// //     extend: {
// //       colors: {
// //         brand: {
// //           // ── Core surfaces (deep charcoal theme) ──
// //           black:      "#13110F",   // page background
// //           surface:    "#1F1C19",   // subtle surface
// //           card:       "#1C1916",   // card background
// //           raised:     "#2E2A26",   // slightly raised surfaces
// //           border:     "#4B4640",   // default border
// //           "border-lt":"#625C55",   // lighter border / divider

// //           // ── Text scale ──
// //           white:      "#F5F2E9",   // primary text (light)
// //           "lt-gray":  "#BDB6AA",   // body text — secondary
// //           mid:        "#9C9387",   // secondary / muted
// //           subtle:     "#7E776D",   // placeholders / hints

// //           // ── Accent — Gold
// //           accent:     "#D4AF37",   // primary gold accent
// //           "accent-lt":"#F0DA93",   // hover / light state
// //           "accent-dk":"#A67C1D",   // pressed / dark state
// //           "accent-muted":"#5A4516", // muted tint bg

// //           // ── Keep for WhyUs section (light cream bg) ──
// //           cream:      "#F5F1EA",
// //           offwhite:   "#F0EEE9",
// //           slate:      "#1C1C1C",
// //         },
// //       },
// //       fontFamily: {
// //         display: ["Georgia", "Times New Roman", "serif"],
// //         body:    ["system-ui", "sans-serif"],
// //       },
// //       backgroundImage: {
// //         "subtle-grid":
// //           "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
// //       },
// //       backgroundSize: {
// //         "subtle-grid": "48px 48px",
// //       },
// //       keyframes: {
// //         fadeUp: {
// //           "0%":   { opacity: "0", transform: "translateY(20px)" },
// //           "100%": { opacity: "1", transform: "translateY(0)" },
// //         },
// //         fadeIn: {
// //           "0%":   { opacity: "0" },
// //           "100%": { opacity: "1" },
// //         },
// //         slideIn: {
// //           "0%":   { opacity: "0", transform: "translateX(-16px)" },
// //           "100%": { opacity: "1", transform: "translateX(0)" },
// //         },
// //       },
// //       animation: {
// //         "fade-up":  "fadeUp 0.55s ease forwards",
// //         "fade-in":  "fadeIn 0.35s ease forwards",
// //         "slide-in": "slideIn 0.4s ease forwards",
// //       },
// //     },
// //   },
// //   plugins: [],
// // };
// // export default config;


// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           // ── Core surfaces (Fresh, clean light theme for true color presentation) ──
//           black:       "#F9F8F5",   // Base page background (warm alabaster, soft on the eyes)
//           surface:     "#FFFFFF",   // High-contrast clean white for sections & product cards
//           card:        "#FFFFFF",   // Pure white background for accurate paint color display
//           raised:      "#F3EFE8",   // Subtle elevated interactive elements / hover states
//           border:      "#E5E0D8",   // Soft neutral border for visual structure
//           "border-lt": "#EFEDE7",   // Delicate dividers

//           // ── Text scale (High contrast, crisp typography) ──
//           white:       "#1A1816",   // Primary high-contrast text (dark obsidian instead of light)
//           "lt-gray":   "#4A453E",   // Body text — comfortable secondary reading level
//           mid:         "#736C62",   // Muted labels & secondary captions
//           subtle:      "#A1998E",   // Input placeholders & disabled states

//           // ── Accent — Rich Warm Amber Gold ──
//           accent:      "#C69214",   // High-contrast gold accent for buttons & active states
//           "accent-lt": "#D9A832",   // Hover state
//           "accent-dk": "#9B6F08",   // Active/Pressed state
//           "accent-muted":"#FAF4E3", // Subtle active background / chip fill

//           // ── Utility Light Shades ──
//           cream:       "#F5F1EA",   // Accent section background (e.g. WhyUs)
//           offwhite:    "#EFECE6",   // Subtle badge / tag background
//           slate:       "#24201D",   // Deep contrast elements (footers, dark badges)
//         },
//       },
//       fontFamily: {
//         display: ["Georgia", "Times New Roman", "serif"],
//         body:    ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
//       },
//       backgroundImage: {
//         "subtle-grid":
//           "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
//       },
//       backgroundSize: {
//         "subtle-grid": "48px 48px",
//       },
//       keyframes: {
//         fadeUp: {
//           "0%":   { opacity: "0", transform: "translateY(20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         fadeIn: {
//           "0%":   { opacity: "0" },
//           "100%": { opacity: "1" },
//         },
//         slideIn: {
//           "0%":   { opacity: "0", transform: "translateX(-16px)" },
//           "100%": { opacity: "1", transform: "translateX(0)" },
//         },
//       },
//       animation: {
//         "fade-up":  "fadeUp 0.55s ease forwards",
//         "fade-in":  "fadeIn 0.35s ease forwards",
//         "slide-in": "slideIn 0.4s ease forwards",
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;
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