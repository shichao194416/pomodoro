import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
	const savedTheme = localStorage.getItem('pomodoro-theme') as Theme;
	if (savedTheme) {
	  return savedTheme;
	}

	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	  return 'dark';
	}

	return 'light';
  });

  useEffect(() => {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('pomodoro-theme', theme);
	// Keep the iOS status bar / browser chrome in step with the theme.
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
	  meta.setAttribute('content', theme === 'dark' ? '#0b1920' : '#f4f7f7');
	}
  }, [theme]);

  const toggleTheme = () => {
	setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
	<ThemeContext.Provider value={{ theme, toggleTheme }}>
	  {children}
	</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
	throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
