// components/ThemeSwitch.tsx

"use client"; // This is a client-side component

import { useTheme } from "@/context/ThemeContext";
import React from "react";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

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
        <p>Change theme</p>
      </div>
    </button>
  );
}
