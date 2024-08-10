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
			className=" focus:outline-none flex items-center text-foreground w-full"
			aria-label="Toggle theme"
		>
			{theme === "light" ? (
				<div className="flex flex-row gap-4 w-full justify-between items-center ">
					<p>Change theme</p>
					<img
						src="/assets/icons/light-mode.svg"
						alt=""
						className="invert-on-dark"
					/>
				</div>
			) : (
				<div className="flex flex-row gap-4 w-full items-center justify-between">
					<p>Change theme</p>
					<img
						src="/assets/icons/dark-mode.svg"
						alt=""
						className="invert-on-dark"
					/>
				</div>
			)}
		</button>
	);
}
