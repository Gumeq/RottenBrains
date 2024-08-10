/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			boxShadow: {
				"dark-grey": "0 4px 8px rgba(255, 255, 255, 0.1)", // Customize the color and blur as needed
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
		},
	},
	plugins: [
		require("@tailwindcss/aspect-ratio"),
		// other plugins...
	],
};
