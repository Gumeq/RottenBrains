"use client";

import { useState, useEffect } from "react";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const initialTheme = savedTheme
        ? (savedTheme as "light" | "dark")
        : prefersDark
          ? "dark"
          : "light";
      setTheme(initialTheme);

      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
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
