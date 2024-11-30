// tailwind.config.js

module.exports = {
  darkMode: "class", // Use class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // For Next.js pages directory
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // For Next.js 13 app directory
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        btn: {
          background: "hsl(var(--btn-background) / <alpha-value>)",
          "background-hover":
            "hsl(var(--btn-background-hover) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
