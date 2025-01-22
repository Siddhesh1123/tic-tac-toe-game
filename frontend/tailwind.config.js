/** @type {import('tailwindcss').Config} */
import daisyui from './node_modules/daisyui'
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#3b82f6", // Blue primary color (for buttons, links)
          secondary: "#ec4899", // Pink secondary color (for accents)
          accent: "#fbbf24", // Accent color
          neutral: "#f3f4f6", // Light neutral background (white-ish)
          "base-100": "#ffffff", // White background for root theme
          "base-200": "#f1f5f9", // Light gray (for cards and panels)
        },
      },
      "light", // Default DaisyUI light theme, can be omitted if you want a custom theme
    ],
  },
};

