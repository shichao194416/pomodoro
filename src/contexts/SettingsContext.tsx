import { createContext, useContext, useState, useEffect } from "react"; 
import type { ReactNode } from "react";

interface Settings {
  workDuration: number; // in seconds
  breakDuration: number; // in seconds
  soundEnabled: boolean;
}

interface SettingsContextType extends Settings {
  setWorkDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  clearAllData: ()=> void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'pomodoro_settings';

const defaultSettings: Settings = {
  workDuration: 25 * 60, // 25 minutes
  breakDuration: 5 * 60, // 5 minutes
  soundEnabled: true,
};

function loadSettings(): Settings {
  try {
	const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
	if ( stored ) {
	  return {...defaultSettings, ...JSON.parse(stored)};
	}
  } catch (error) {
	console.error('Failed to load settings',error);
  }
  return defaultSettings;
}

function saveSettings(settings: Settings) {
  try {
	localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
	console.error('Failed to save settings:', error)
  }
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({children}: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
  	saveSettings(settings);
  }, [settings]);

  const setWorkDuration = (duration: number) => {
	setSettings(prev => ({...prev, workDuration: duration}));
  };

  const setBreakDuration = (duration: number) => {
	setSettings(prev => ({...prev, breakDuration: duration}));
  };

  const setSoundEnabled = (enabled: boolean) => {
	setSettings(prev => ({ ...prev, soundEnabled: enabled }));
  };

  const clearAllData = () => {
	localStorage.removeItem('pomodoro_state');
	localStorage.removeItem(SETTINGS_STORAGE_KEY);
	setSettings(defaultSettings);
	window.location.reload();
  };

  return (
	<SettingsContext.Provider value={{
	  ...settings,
	  setWorkDuration,
	  setBreakDuration,
	  setSoundEnabled,
	  clearAllData,
	  }}>
	  {children}
	  </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
	throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
