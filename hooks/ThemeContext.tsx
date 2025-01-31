"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme; // User-chosen theme ("light", "dark", or "system")
  effectiveTheme: "light" | "dark"; // Actual applied theme based on system preferences
  toggleTheme: () => void; // Cycles through themes
  setTheme: (theme: Theme) => void; // Sets a specific theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) => {
  // Initialize the theme state from localStorage or fall back to initialTheme
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme;
      if (
        storedTheme === "light" ||
        storedTheme === "dark" ||
        storedTheme === "system"
      ) {
        return storedTheme;
      }
    }
    return initialTheme;
  });

  // Determine the effective theme (applied theme)
  const getEffectiveTheme = (currentTheme: Theme): "light" | "dark" => {
    if (currentTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return currentTheme;
  };

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" ? getEffectiveTheme(theme) : "light", // Default to "light" during SSR
  );

  // Update effectiveTheme dynamically when the system preference or theme changes
  useEffect(() => {
    const updateEffectiveTheme = () => {
      setEffectiveTheme(getEffectiveTheme(theme));
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      updateEffectiveTheme(); // Set effective theme initially
      mediaQuery.addEventListener("change", updateEffectiveTheme);
      return () => {
        mediaQuery.removeEventListener("change", updateEffectiveTheme);
      };
    } else {
      updateEffectiveTheme();
    }
  }, [theme]);

  // Persist the theme in localStorage and cookies whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000`; // Save for 1 year
  }, [theme]);

  // Update the HTML class to apply the dark theme
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      effectiveTheme === "dark",
    );
  }, [effectiveTheme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  return (
    <ThemeContext.Provider
      value={{ theme, effectiveTheme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
