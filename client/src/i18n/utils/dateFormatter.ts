import i18n from '../index';

/**
 * Format a date according to the current locale
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * 
 * @example
 * // Format a date with default options
 * formatDate(new Date()); // "3/21/2025" in en-US, "21/3/2025" in fr-FR
 * 
 * @example
 * // Format with custom options
 * formatDate(new Date(), { 
 *   year: 'numeric', 
 *   month: 'long', 
 *   day: 'numeric' 
 * }); // "March 21, 2025" in en-US, "21 mars 2025" in fr-FR
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric' 
  }
): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const locale = i18n.language || 'en';
  
  return new Intl.DateTimeFormat(locale, options).format(dateObject);
};

/**
 * Format a time according to the current locale
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted time string
 * 
 * @example
 * // Format a time with default options
 * formatTime(new Date()); // "3:30 PM" in en-US, "15:30" in fr-FR
 */
export const formatTime = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: 'numeric'
  }
): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const locale = i18n.language || 'en';
  
  return new Intl.DateTimeFormat(locale, options).format(dateObject);
};

/**
 * Format a date and time according to the current locale
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date and time string
 * 
 * @example
 * // Format a date and time with default options
 * formatDateTime(new Date()); // "3/21/2025, 3:30 PM" in en-US
 */
export const formatDateTime = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric'
  }
): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const locale = i18n.language || 'en';
  
  return new Intl.DateTimeFormat(locale, options).format(dateObject);
};

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * 
 * @param date - Date to format (Date object or ISO string)
 * @returns Formatted relative time string
 * 
 * @example
 * // Format a relative time
 * formatRelativeTime(new Date(Date.now() - 86400000)); // "1 day ago" in en-US
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const locale = i18n.language || 'en';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObject.getTime()) / 1000);
  
  // Define time units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  // Create a formatter
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  // Determine the appropriate unit and value
  if (Math.abs(diffInSeconds) < minute) {
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  } else if (Math.abs(diffInSeconds) < hour) {
    return rtf.format(-Math.floor(diffInSeconds / minute), 'minute');
  } else if (Math.abs(diffInSeconds) < day) {
    return rtf.format(-Math.floor(diffInSeconds / hour), 'hour');
  } else if (Math.abs(diffInSeconds) < week) {
    return rtf.format(-Math.floor(diffInSeconds / day), 'day');
  } else if (Math.abs(diffInSeconds) < month) {
    return rtf.format(-Math.floor(diffInSeconds / week), 'week');
  } else if (Math.abs(diffInSeconds) < year) {
    return rtf.format(-Math.floor(diffInSeconds / month), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / year), 'year');
  }
};
