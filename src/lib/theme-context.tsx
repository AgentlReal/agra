'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isLight: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check initial theme from DOM or localStorage
    const domTheme = document.documentElement.getAttribute('data-theme') as Theme | null;
    const storedTheme = (typeof window !== 'undefined' ? localStorage.getItem('agra_theme') : null) as Theme | null;
    const initialTheme: Theme = storedTheme || domTheme || 'dark';

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'agra_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    root.classList.remove('dark', 'light');
    root.classList.add(newTheme);
    try {
      localStorage.setItem('agra_theme', newTheme);
    } catch {
      // ignore localStorage quota errors
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isLight: theme === 'light', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
