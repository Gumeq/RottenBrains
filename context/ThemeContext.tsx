// components/ThemeContext.tsx

"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

export type Theme = "light" | "dark"; // Export Theme type

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
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

  // Update localStorage and <html> class when theme changes
  useEffect(() => {
    // Update the <html> class
    document.documentElement.classList.toggle("dark", theme === "dark");

    // Update localStorage
    localStorage.setItem("theme", theme);

    // Update the cookie
    document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
