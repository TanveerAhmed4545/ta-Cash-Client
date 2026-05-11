/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#1A3626",
          "primary-content": "#ffffff",
          "secondary": "#bbf7d0",
          "accent": "#10b981",
          "neutral": "#f4f7f5",
          "neutral-content": "#4B5563",
          "base-100": "#ffffff",
          "base-200": "#F4F7F5",
          "base-300": "#E8ECE9",
          "base-content": "#111827",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
        dark: {
          "primary": "#34D399",
          "primary-content": "#022C22",
          "secondary": "#15803d",
          "accent": "#10b981",
          "neutral": "#0B1310",
          "neutral-content": "#9CA3AF",
          "base-100": "#14221C",
          "base-200": "#0B1310",
          "base-300": "#23302A",
          "base-content": "#F9FAFB",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
};
