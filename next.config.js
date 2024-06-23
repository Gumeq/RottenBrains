/** @type {import('next').NextConfig} */

module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				// You can specify a pathname or leave it undefined to allow all paths
				pathname: "**/*", // Allows all paths
			},
			{
				protocol: "https",
				hostname: "ui-avatars.com",
				pathname: "**/*", // Allows all paths
			},
		],
		dangerouslyAllowSVG: true, // Enable SVG support
	},
};
