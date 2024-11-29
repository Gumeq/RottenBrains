"use client";

import { useState, useEffect } from "react";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      return savedTheme
        ? (savedTheme as "light" | "dark")
        : prefersDark
          ? "dark"
          : "light";
    }
    return "light"; // Default to 'light' if window is undefined
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
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
      <div className="flex w-full flex-row items-center gap-2">
        <img
          src={`/assets/icons/${theme}-mode.svg`}
          alt=""
          className="invert-on-dark"
        />
        <p>Change theme</p>
      </div>
    </button>
  );
}
