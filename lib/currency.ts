/**
 * Currency formatting utilities
 * 
 * Handles currency display based on locale
 * - English (en): USD with $ symbol
 * - Vietnamese (vi): VND with ₫ symbol
 */

export type SupportedLocale = 'en' | 'vi';

/**
 * Exchange rate from USD to VND
 * Update this periodically or fetch from an API
 */
const USD_TO_VND_RATE = 25000;

/**
 * Format currency amount based on locale
 * 
 * @param amount - Amount in USD (base currency)
 * @param locale - User's locale (en or vi)
 * @returns Formatted currency string with appropriate symbol
 * 
 * @example
 * formatCurrency(100, 'en') // "$100"
 * formatCurrency(100, 'vi') // "2.500.000₫"
 */
export function formatCurrency(amount: number, locale: SupportedLocale = 'en'): string {
  if (locale === 'vi') {
    // Convert USD to VND
    const vndAmount = Math.round(amount * USD_TO_VND_RATE);
    
    // Format with Vietnamese number formatting (dots as thousand separators)
    const formatted = vndAmount.toLocaleString('vi-VN');
    
    return `${formatted}₫`;
  }
  
  // Default to USD
  return `$${amount.toLocaleString('en-US')}`;
}

/**
 * Get currency symbol for locale
 * 
 * @param locale - User's locale
 * @returns Currency symbol
 */
export function getCurrencySymbol(locale: SupportedLocale = 'en'): string {
  return locale === 'vi' ? '₫' : '$';
}

/**
 * Get currency code for locale
 * 
 * @param locale - User's locale
 * @returns Currency code (USD or VND)
 */
export function getCurrencyCode(locale: SupportedLocale = 'en'): string {
  return locale === 'vi' ? 'VND' : 'USD';
}

/**
 * Convert USD amount to VND
 * 
 * @param usdAmount - Amount in USD
 * @returns Amount in VND
 */
export function convertToVND(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_VND_RATE);
}

/**
 * Convert VND amount to USD
 * 
 * @param vndAmount - Amount in VND
 * @returns Amount in USD
 */
export function convertToUSD(vndAmount: number): number {
  return Math.round(vndAmount / USD_TO_VND_RATE);
}
