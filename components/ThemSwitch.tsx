import { useState, useEffect } from "react";

export default function ThemeSwitch() {
	const [theme, setTheme] = useState<"light" | "dark">(
		typeof window !== "undefined" &&
			localStorage.getItem("theme") === "dark"
			? "dark"
			: "light"
	);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded focus:outline-none flex items-center justify-center invert-on-dark"
			aria-label="Toggle theme"
		>
			{theme === "light" ? (
				<img src="/assets/icons/light-mode.svg" alt="" />
			) : (
				<img src="/assets/icons/dark-mode.svg" alt="" />
			)}
		</button>
	);
}
