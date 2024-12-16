// components/ThemeContext.tsx

"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: "light" | "dark"; // Derived theme based on system if needed
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void; // Optionally expose setTheme to directly set system, etc.
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // Determine the effective theme (used by the UI)
  const getEffectiveTheme = (currentTheme: Theme): "light" | "dark" => {
    if (currentTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return currentTheme;
  };

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    // We'll default this on initial render
    typeof window !== "undefined"
      ? getEffectiveTheme(initialTheme)
      : initialTheme === "system"
        ? "light" // fallback (no SSR matching)
        : initialTheme,
  );

  useEffect(() => {
    const updateEffectiveTheme = () => {
      setEffectiveTheme(getEffectiveTheme(theme));
    };

    // If we are in system mode, listen for changes in system preference
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateEffectiveTheme);
      updateEffectiveTheme();
      return () => {
        mediaQuery.removeEventListener("change", updateEffectiveTheme);
      };
    } else {
      // If not system, just set effective theme
      setEffectiveTheme(getEffectiveTheme(theme));
    }
  }, [theme]);

  // Update <html> class, localStorage, and cookie whenever effective theme changes
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      effectiveTheme === "dark",
    );
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year
  }, [effectiveTheme, theme]);

  const toggleTheme = () => {
    // Cycle through themes: light -> dark -> system -> light ...
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
