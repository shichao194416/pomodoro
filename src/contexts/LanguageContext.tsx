import { createContext, useContext, useState, useEffect  } from 'react';
import type { ReactNode } from 'react';
import type { Language, Translations  } from '../utils/translations'; 
import {getTranslations, detectLanguage, LANGUAGES } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
} 

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({children}: LanguageProviderProps) {
  const [language, setLanguageState] =  useState<Language>(() => { 
	const saved = localStorage.getItem('pomodoro-language') as Language | null;
	if (saved && LANGUAGES.includes(saved)) return saved;
	// First run: follow the device locale so Chinese phones land on 简体中文.
	return detectLanguage();
  }); 

  useEffect(() => {
	localStorage.setItem('pomodoro-language', language);
  }, [language]);

  const translations = getTranslations(language);

  const setLanguage = (lang: Language) => {
	setLanguageState(lang);
  };

  return (
	<LanguageContext.Provider value={{ language, setLanguage, translations }}>
	  {children}
	</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
	throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


