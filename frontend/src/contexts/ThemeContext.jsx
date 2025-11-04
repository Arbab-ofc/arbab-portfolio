import React, { createContext, useContext, useEffect, useState } from 'react';
import themeStore, { initializeTheme } from '../stores/themeStore';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [theme, setTheme] = useState(themeStore.getState().theme);

  useEffect(() => {
    // Rehydrate the store on mount
    themeStore.persist.rehydrate();
    setIsHydrated(true);

    // Set up cleanup for system preference listener
    const cleanup = initializeTheme();

    // Subscribe to store changes
    const unsubscribe = themeStore.subscribe((state) => {
      setTheme(state.theme);
    });

    return () => {
      unsubscribe();
      cleanup?.();
    };
  }, []);

  // Prevent flash of incorrect theme
  if (!isHydrated) {
    return null;
  }

  const resolvedTheme = themeStore.getState().getResolvedTheme();

  const value = {
    theme,
    resolvedTheme,
    setTheme: themeStore.getState().setTheme,
    toggleTheme: themeStore.getState().toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;