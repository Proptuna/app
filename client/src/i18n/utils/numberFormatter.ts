import i18n from '../index';

/**
 * Format a number according to the current locale
 * 
 * @param value - Number to format
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string
 * 
 * @example
 * // Format a number with default options
 * formatNumber(1234.56); // "1,234.56" in en-US, "1 234,56" in fr-FR
 * 
 * @example
 * // Format with custom options
 * formatNumber(1234.56, { 
 *   maximumFractionDigits: 0 
 * }); // "1,235" in en-US, "1 235" in fr-FR
 */
export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format a currency value according to the current locale
 * 
 * @param value - Number to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted currency string
 * 
 * @example
 * // Format a currency with default options
 * formatCurrency(1234.56, 'USD'); // "$1,234.56" in en-US, "1 234,56 $US" in fr-FR
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  options: Intl.NumberFormatOptions = {}
): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options
  }).format(value);
};

/**
 * Format a percentage according to the current locale
 * 
 * @param value - Number to format (0-1)
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted percentage string
 * 
 * @example
 * // Format a percentage with default options
 * formatPercent(0.1234); // "12.34%" in en-US, "12,34 %" in fr-FR
 */
export const formatPercent = (
  value: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...options
  }).format(value);
};

/**
 * Format a number as a unit according to the current locale
 * 
 * @param value - Number to format
 * @param unit - Unit to use (e.g., 'meter', 'liter')
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted unit string
 * 
 * @example
 * // Format a unit with default options
 * formatUnit(1234.56, 'meter'); // "1,234.56 m" in en-US, "1 234,56 m" in fr-FR
 */
export const formatUnit = (
  value: number,
  unit: string,
  options: Intl.NumberFormatOptions = {}
): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    ...options
  }).format(value);
};
