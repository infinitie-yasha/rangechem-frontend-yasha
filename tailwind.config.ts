import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config: import("tailwindcss").Config = {
  content: [
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        thin: "50", // was 100
        extralight: "150", // was 200
        light: "250", // was 300
        normal: "350", // was 400
        medium: "450", // was 500
        semibold: "550", // was 600
        bold: "600", // was 700
        extrabold: "750", // was 800
        black: "850", // was 900
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        tiny: "0.4375rem", // 7px
        xxs: "0.625rem", // 10px
        xs: "0.75rem", // 12px
        small: "0.875rem", // 14px
        medium: "0.9375rem", // 15px
        large: "1.125rem", // 18px
      },
      screens: {
        xxs: "320px",
        xs: "375px",
        sm: "431px",
        md: "769px",
        lg: "1440px",
        xl: "1800px",
        xxl: "2550px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui",
      addCommonColors: false,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {
        dividerWeight: "1px",
        disabledOpacity: 0.45,
        radius: {
          small: "6px",
          medium: "8px",
          large: "12px",
        },
        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "2px",
        },
      },
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#000000",
            focus: "#A0194F",
            primary: {
              50: "#fdf2f7",
              100: "#fce7f0",
              200: "#fbcfe3",
              300: "#f9a8c9",
              400: "#f472ab",
              500: "#A0194F",
              600: "#8b1445",
              700: "#73103a",
              800: "#5c0c2e",
              900: "#450922",
              DEFAULT: "#A0194F",
            },
          },
        },

        dark: {
          colors: {
            background: "#000000",
            foreground: "#FFFFFF",
            focus: "#c02663",
            primary: {
              50: "#fdf2f7",
              100: "#fce7f0",
              200: "#fbcfe3",
              300: "#f9a8c9",
              400: "#f472ab",
              500: "#A0194F",
              600: "#8b1445",
              700: "#73103a",
              800: "#5c0c2e",
              900: "#450922",
              DEFAULT: "#A0194F",
            },
          },
        },
      },
    }),
  ],
};

export default config;
