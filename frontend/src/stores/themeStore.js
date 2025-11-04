import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const themeStore = create(
  persist(
    (set, get) => ({
      // Theme can be 'light', 'dark', or 'system'
      theme: 'system',

      // Set theme explicitly
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      // Toggle between light and dark (ignoring system)
      toggleTheme: () => {
        const { theme } = get();
        let currentResolvedTheme;

        if (theme === 'system') {
          currentResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
          currentResolvedTheme = theme;
        }

        const newTheme = currentResolvedTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      // Get the actual resolved theme (light or dark)
      getResolvedTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      }
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the theme value, not computed properties
      partialize: (state) => ({ theme: state.theme }),
      // Don't persist on every change to avoid performance issues
      skipHydration: true,
    }
  )
);

// Helper function to apply theme to document
function applyTheme(theme) {
  const root = document.documentElement;
  const resolvedTheme = theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme;

  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Initialize theme on app load
export const initializeTheme = () => {
  // Add theme-loaded class to enable transitions after initialization
  setTimeout(() => {
    document.documentElement.classList.add('theme-loaded');
  }, 100);

  const storedState = JSON.parse(localStorage.getItem('theme-storage') || '{}');
  const theme = storedState.state?.theme || 'system';
  applyTheme(theme);

  // Set up system preference listener
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = () => {
    const currentTheme = themeStore.getState().theme;
    if (currentTheme === 'system') {
      const newResolvedTheme = mediaQuery.matches ? 'dark' : 'light';
      if (newResolvedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  mediaQuery.addEventListener('change', handleSystemChange);

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleSystemChange);
  };
};

export default themeStore;