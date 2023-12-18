import React, { createContext, useEffect } from "react";

// Creating a context for managing theme-related data and functions
export const ThemeContext = createContext();

const defaultTheme = "light";
const darkTheme = "dark";

// ThemeProvider Component
export default function ThemeProvider({ children }) {
  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const oldTheme = getTheme();
    const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;

    updateTheme(newTheme, oldTheme);
  };

  // Effect to set the theme on component mount
  useEffect(() => {
    const theme = getTheme();
    // If no theme is stored, set the default theme
    if (!theme) updateTheme(defaultTheme);
    // If a theme is stored, set it
    else updateTheme(theme);
  }, []);

  // Providing the context values to the child components
  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Function to get the stored theme from local storage
const getTheme = () => localStorage.getItem("theme");

// Function to update the theme in the DOM and local storage
const updateTheme = (theme, themeToRemove) => {
  if (themeToRemove) document.documentElement.classList.remove(themeToRemove);

  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
};
