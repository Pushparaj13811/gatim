import { createContext, useContext, useEffect, useState } from 'react';

// Define all possible themes
type Theme = 'dark' | 'light' | 'system' | 'neon' | 'solarized' | 'light-bliss' | 'retro-warm' | 'dark-cosmos' | 'pastel-dream ' | 'gradient-luxe';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Initial state
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

// Create context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'gati-desk-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Sync the theme with the root element and localStorage
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all possible theme classes
    root.classList.remove('light', 'dark', 'neon', 'solarized', 'light-bliss', 'retro-warm', 'dark-cosmos', 'pastel-dream', 'gradient-luxe');

    if (theme === 'system') {
      // Determine system theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme); // Add the chosen theme
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom hook for accessing theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
