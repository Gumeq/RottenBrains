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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: "hsl(var(--foreground))", // Text color
            a: {
              color: "hsl(var(--accent))", // Links
              textDecoration: "underline",
              "&:hover": {
                color: "hsl(var(--primary))", // Links hover
              },
            },
            h1: {
              color: "hsl(var(--foreground))",
            },
            h2: {
              color: "hsl(var(--foreground))",
            },
            h3: {
              color: "hsl(var(--foreground))",
            },
            strong: {
              color: "hsl(var(--foreground))", // Bold text
            },
            blockquote: {
              color: "hsl(var(--foreground))",
              borderLeftColor: "hsl(var(--accent))", // Blockquote border
            },
          },
        },
        dark: {
          css: {
            color: "hsl(var(--foreground))", // Dark mode text
            a: {
              color: "hsl(var(--accent))",
              "&:hover": {
                color: "hsl(var(--primary))",
              },
            },
            h1: {
              color: "hsl(var(--foreground))",
            },
            h2: {
              color: "hsl(var(--foreground))",
            },
            h3: {
              color: "hsl(var(--foreground))",
            },
            strong: {
              color: "hsl(var(--foreground))",
            },
            blockquote: {
              color: "hsl(var(--foreground))",
              borderLeftColor: "hsl(var(--accent))",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
