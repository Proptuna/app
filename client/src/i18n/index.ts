import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import commonEN from './locales/en/common.json';
import sidebarEN from './locales/en/sidebar.json';
import aiEN from './locales/en/ai.json';
import propertiesEN from './locales/en/properties.json';

import commonFR from './locales/fr/common.json';
import sidebarFR from './locales/fr/sidebar.json';
import aiFR from './locales/fr/ai.json';
import propertiesFR from './locales/fr/properties.json';

// Namespaces
export const namespaces = {
  common: 'common',
  sidebar: 'sidebar',
  properties: 'properties',
  documents: 'documents',
  people: 'people',
  ai: 'ai',
  tasks: 'tasks',
};

// Supported languages
export const languages = {
  en: 'English',
  fr: 'Français',
};

// Default language
export const defaultLanguage = 'en';

// Resources object with all translations
const resources = {
  en: {
    common: commonEN,
    sidebar: sidebarEN,
    ai: aiEN,
    properties: propertiesEN,
    // We'll add these as they're created
    documents: {},
    people: {},
    tasks: {},
  },
  fr: {
    common: commonFR,
    sidebar: sidebarFR,
    ai: aiFR,
    properties: propertiesFR,
    // We'll add these as they're created
    documents: {},
    people: {},
    tasks: {},
  }
};

// Initialize i18next
i18n
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Detect user language
  .use(LanguageDetector)
  // Initialize i18next
  .init({
    // Resources contain all translations
    resources,
    // Default language
    fallbackLng: defaultLanguage,
    // Debug mode in development
    debug: import.meta.env.MODE === 'development',
    // Namespaces
    ns: Object.values(namespaces),
    defaultNS: namespaces.common,
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Language detector options
    detection: {
      // Order of detection
      order: ['localStorage', 'navigator'],
      // Cache language in localStorage
      caches: ['localStorage'],
      // localStorage key
      lookupLocalStorage: 'i18nextLng',
    },
    // React configuration
    react: {
      useSuspense: true,
    },
  });

export default i18n;
