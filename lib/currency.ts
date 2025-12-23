/**
 * Currency formatting utilities
 *
 * Handles currency display based on locale
 * - English (en): USD with $ symbol
 * - Vietnamese (vi): VND with ₫ symbol
 */

export type SupportedLocale = "en" | "vi";

export function formatCurrency(amount: number): string {
  return `${(amount || 0).toLocaleString("vi-VN")}₫`;
}

export function getCurrencySymbol(locale: SupportedLocale = "en"): string {
  return "₫";
}

export function getCurrencyCode(locale: SupportedLocale = "en"): string {
  return "VND";
}
