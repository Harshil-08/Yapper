import { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

/**
 * useTheme is a custom hook that allows easy access to the ThemeContext.
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * ThemeProvider is a component that wraps its children with ThemeContext
 * and provides theme state and toggle functionality.
 */
export const ThemeProvider = ({ children }) => {
  let initialTheme;
  try {
    const savedTheme = localStorage.getItem("theme");
    initialTheme = savedTheme && savedTheme !== "null" ? JSON.parse(savedTheme) : false; // Default to light theme
  } catch {
    initialTheme = false; // Default to light theme
  }

  const [theme, setTheme] = useState(initialTheme);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(!theme);
  };

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    if (theme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
