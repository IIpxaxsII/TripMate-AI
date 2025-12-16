/**
 * Currency formatting and conversion utilities
 * Default currency: INR (Indian Rupees)
 */

export const DEFAULT_CURRENCY = import.meta.env.VITE_DEFAULT_CURRENCY || 'INR';
export const DEFAULT_LOCALE = 'en-IN';

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CURRENCY_OPTIONS: { value: SupportedCurrency; label: string }[] = [
  { value: 'INR', label: '₹ INR - Indian Rupee' },
  { value: 'USD', label: '$ USD - US Dollar' },
  { value: 'EUR', label: '€ EUR - Euro' },
  { value: 'GBP', label: '£ GBP - British Pound' },
];

/**
 * Format a monetary value with locale-aware formatting
 * Uses Indian numbering system by default (e.g., ₹1,23,456.78)
 */
export function formatMoney(
  value: number | null | undefined,
  currency: SupportedCurrency = 'INR',
  locale: string = currency === 'INR' ? 'en-IN' : 'en-US'
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return `${CURRENCY_SYMBOLS[currency] || currency}0.00`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    // Fallback for unsupported currencies
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${value.toFixed(2)}`;
  }
}

/**
 * Format a compact money value (e.g., ₹1.2L, ₹50K)
 */
export function formatMoneyCompact(
  value: number | null | undefined,
  currency: SupportedCurrency = 'INR'
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return `${CURRENCY_SYMBOLS[currency] || currency}0`;
  }

  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  if (currency === 'INR') {
    // Indian numbering: Lakhs and Crores
    if (value >= 10000000) {
      return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `${symbol}${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(1)}K`;
    }
  } else {
    // Western numbering: Millions and Thousands
    if (value >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(1)}K`;
    }
  }

  return `${symbol}${Math.round(value)}`;
}

/**
 * Convert amount from one currency to another using exchange rate
 */
export function convertAmount(
  amount: number,
  rate: number
): number {
  return amount * rate;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: SupportedCurrency): string {
  return CURRENCY_SYMBOLS[currency] || currency;
}
