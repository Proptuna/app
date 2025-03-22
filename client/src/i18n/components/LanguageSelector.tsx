import React from 'react';
import { useI18n } from '../I18nProvider';
import { useTranslation } from 'react-i18next';
import { GlobeIcon } from 'lucide-react';

// Language data with flags, names and full names
const languageData: Record<string, { flag: string; name: string; fullName: string }> = {
  en: { flag: '🇺🇸', name: 'EN', fullName: 'English' },
  fr: { flag: '🇫🇷', name: 'FR', fullName: 'Français' },
};

interface LanguageSelectorProps {
  className?: string;
  variant?: 'minimal' | 'compact' | 'full';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '',
  variant = 'compact'
}) => {
  const { language, setLanguage, languages } = useI18n();
  const { t } = useTranslation();

  // Different UI variants
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <GlobeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {Object.keys(languages).map((code) => (
            <button
              key={code}
              onClick={() => setLanguage(code as keyof typeof languages)}
              className={`px-2 py-1 text-xs ${
                language === code 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label={`${t('common:switch_to')} ${languageData[code].fullName}`}
            >
              {languageData[code].flag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <GlobeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {Object.keys(languages).map((code) => (
            <button
              key={code}
              onClick={() => setLanguage(code as keyof typeof languages)}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${
                language === code 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label={`${t('common:switch_to')} ${languageData[code].fullName}`}
            >
              <span>{languageData[code].flag}</span>
              <span>{languageData[code].name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${className}`}>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
          <GlobeIcon className="h-4 w-4" />
          {t('common:language')}
        </label>
        <div className="flex flex-col rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {Object.keys(languages).map((code) => (
            <button
              key={code}
              onClick={() => setLanguage(code as keyof typeof languages)}
              className={`px-4 py-2 text-left flex items-center gap-2 ${
                language === code 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label={`${t('common:switch_to')} ${languageData[code].fullName}`}
            >
              <span className="text-lg">{languageData[code].flag}</span>
              <span>{languageData[code].fullName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
