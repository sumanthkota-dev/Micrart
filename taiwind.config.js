/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // include app folder if using Next.js 13+
  ],
  darkMode: false, // disable dark mode
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "#f5f5f5",           // Material 3 surface color
        'on-surface': "#171717",      // Text color on surface
        primary: "#6750A4",           // Accent color for titles/buttons
      },
      fontFamily: {
        sans: "var(--font-sans, Arial, Helvetica, sans-serif)",
        mono: "var(--font-mono, monospace)",
      },
    },
  },
  plugins: [],
};
