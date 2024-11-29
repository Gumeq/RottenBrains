/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "dark-grey": "0 4px 8px rgba(255, 255, 255, 0.1)", // Customize as needed
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        accent: "hsl(var(--accent))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      height: {
        dvh: "100dvh",
        svh: "100svh",
        lvh: "100lvh",
      },
      minHeight: {
        dvh: "100dvh",
        svh: "100svh",
        lvh: "100lvh",
      },
      maxHeight: {
        dvh: "100dvh",
        svh: "100svh",
        lvh: "100lvh",
      },
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      margin: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    // other plugins...
  ],
};
