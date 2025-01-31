"use client";

import { useTheme } from "@/hooks/ThemeContext";
import React from "react";

export default function NavThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  const getLabel = (currentTheme: string) => {
    if (currentTheme === "light") return "Light Theme";
    if (currentTheme === "dark") return "Dark Theme";
    if (currentTheme === "system") return "System Theme";
    return "Change theme";
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex w-full flex-row items-center gap-4 px-4 py-2 hover:bg-foreground/20"
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-2">
        {/* Ensure you have an icon for system-mode.svg or handle it if not */}
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
