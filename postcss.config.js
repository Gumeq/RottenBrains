module.exports = {
	plugins: [
		require("postcss-nested"), // Add the nesting plugin before Tailwind CSS
		require("tailwindcss"),
		require("autoprefixer"),
	],
};
