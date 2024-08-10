import React from "react";

const ThemeScript = () => {
	const themeScript = `
		(function() {
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) {
				document.documentElement.setAttribute('data-theme', savedTheme);
			} else {
				const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
				document.documentElement.setAttribute('data-theme', systemTheme);
			}
		})();
	`;

	return (
		<script
			dangerouslySetInnerHTML={{
				__html: themeScript,
			}}
		/>
	);
};

export default ThemeScript;
