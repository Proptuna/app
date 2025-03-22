import React, { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  i18nKey: string;
  ns?: string;
  values?: Record<string, any>;
  components?: Record<string, ReactNode> | Record<string, ReactNode>[];
  defaultValue?: string;
  className?: string;
}

/**
 * A component for translating text with variables and formatting
 * 
 * @example
 * // Simple usage
 * <TranslatedText i18nKey="common:welcome" />
 * 
 * @example
 * // With variables
 * <TranslatedText 
 *   i18nKey="properties:details.address" 
 *   values={{ city: property.city, state: property.state }} 
 * />
 * 
 * @example
 * // With HTML components
 * <TranslatedText 
 *   i18nKey="common:terms_agreement" 
 *   components={{ 
 *     bold: <strong />, 
 *     link: <a href="/terms" /> 
 *   }} 
 * />
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
  i18nKey,
  ns,
  values = {},
  components = {},
  defaultValue = '',
  className = '',
}) => {
  const { t } = useTranslation(ns);
  
  // If we have components, use Trans component
  if (Object.keys(components).length > 0) {
    return (
      <span className={className}>
        <Trans 
          i18nKey={i18nKey} 
          values={values} 
          components={components as any}
          defaults={defaultValue}
          ns={ns}
        />
      </span>
    );
  }
  
  // Otherwise use simpler t function
  return (
    <span className={className}>
      {t(i18nKey, { ...values, defaultValue })}
    </span>
  );
};

export default TranslatedText;
