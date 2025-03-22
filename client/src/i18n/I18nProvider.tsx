import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages, defaultLanguage } from './index';

// Type definitions
type LanguageCode = keyof typeof languages;
type I18nContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languages: typeof languages;
};

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageCode>(
    (localStorage.getItem('i18nextLng') as LanguageCode) || defaultLanguage
  );

  // Function to change language
  const setLanguage = (lang: LanguageCode) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  // Initialize language from localStorage or browser settings
  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng') as LanguageCode;
    if (storedLang && Object.keys(languages).includes(storedLang)) {
      setLanguage(storedLang);
    } else {
      // Use browser language if available and supported
      const browserLang = navigator.language.split('-')[0] as LanguageCode;
      const langToUse = Object.keys(languages).includes(browserLang) ? browserLang : defaultLanguage;
      setLanguage(langToUse);
    }
  }, []);

  // Context value
  const contextValue: I18nContextType = {
    language,
    setLanguage,
    languages,
  };

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

// Hook to use the i18n context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
