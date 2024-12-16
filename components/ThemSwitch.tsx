// components/ThemeSwitch.tsx

"use client";

import { useTheme } from "@/context/ThemeContext";
import React from "react";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  // Optional: If you want to show some user-friendly label that changes with the theme.
  const getLabel = (currentTheme: string) => {
    if (currentTheme === "light") return "Light Theme";
    if (currentTheme === "dark") return "Dark Theme";
    if (currentTheme === "system") return "System Theme";
    return "Change theme";
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center text-foreground focus:outline-none"
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-2">
        <img
          src={`/assets/icons/${theme}-mode.svg`}
          alt={`${theme} mode icon`}
          className="invert-on-dark"
        />
        <p>{getLabel(theme)}</p>
      </div>
    </button>
  );
}
