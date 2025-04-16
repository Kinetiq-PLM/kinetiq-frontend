// src/utils/utils.js

/**
 * Formats a date string to a localized date and time display
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time in the formatted output
 * @return {string} Formatted date string or placeholder if dateString is falsy
 */
export const formatDate = (dateString, includeTime = true) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '—';
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    
    return date.toLocaleDateString(undefined, options);
  };
  
  /**
   * Formats a phone number to a standard format
   * @param {string} phone - Phone number string
   * @return {string} Formatted phone number or original if not valid
   */
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '—';
    
    // This is a simple implementation - customize based on your country's phone format
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
      // For Philippines format starting with 0
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 11)}`;
    }
    
    return phone; // Return original if format doesn't match known patterns
  };
  
  /**
   * Converts camelCase or snake_case strings to Title Case
   * @param {string} str - Input string in camelCase or snake_case
   * @return {string} Title Case formatted string
   */
  export const formatFieldName = (str) => {
    if (!str) return '';
    
    // First, handle camelCase
    const fromCamelCase = str.replace(/([A-Z])/g, ' $1');
    
    // Then handle snake_case
    const fromSnakeCase = fromCamelCase.replace(/_/g, ' ');
    
    // Capitalize first letter of each word
    return fromSnakeCase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  /**
   * Deep clones an object (useful for editing forms)
   * @param {object} obj - Object to clone
   * @return {object} Cloned object
   */
  export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  /**
   * Compares two objects to see if they're different (useful for detecting form changes)
   * @param {object} obj1 - First object
   * @param {object} obj2 - Second object
   * @return {boolean} True if objects are different
   */
  export const hasChanges = (obj1, obj2) => {
    return JSON.stringify(obj1) !== JSON.stringify(obj2);
  };