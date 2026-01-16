import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, themeConfig }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, fallback to config
    const saved = localStorage.getItem('portfolio-theme');
    return saved || themeConfig?.mode || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-theme', theme);
    
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    if (themeConfig?.allowUserToggle !== false) {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, allowToggle: themeConfig?.allowUserToggle !== false }}>
      {children}
    </ThemeContext.Provider>
  );
};
