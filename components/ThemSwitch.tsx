import { useState, useEffect } from "react";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light",
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
      className="flex w-full items-center text-foreground focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <div className="flex w-full flex-row items-center gap-2">
          <img
            src="/assets/icons/light-mode.svg"
            alt=""
            className="invert-on-dark"
          />
          <p>Change theme</p>
        </div>
      ) : (
        <div className="flex w-full flex-row items-center gap-2">
          <img
            src="/assets/icons/dark-mode.svg"
            alt=""
            className="invert-on-dark"
          />
          <p>Change theme</p>
        </div>
      )}
    </button>
  );
}
