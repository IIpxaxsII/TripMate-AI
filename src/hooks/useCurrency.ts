import { useMemo, useCallback } from 'react';
import { useUserPreferences } from './useUserPreferences';
import { useExchangeRates } from './useExchangeRates';
import { 
  formatMoney, 
  formatMoneyCompact, 
  convertAmount, 
  getCurrencySymbol,
  DEFAULT_CURRENCY,
  type SupportedCurrency 
} from '@/lib/currency';

interface UseCurrencyReturn {
  /** User's preferred currency (defaults to INR) */
  currency: SupportedCurrency;
  /** Format amount in user's preferred currency */
  format: (amount: number | null | undefined, fromCurrency?: SupportedCurrency) => string;
  /** Format amount in compact form */
  formatCompact: (amount: number | null | undefined, fromCurrency?: SupportedCurrency) => string;
  /** Convert amount to user's preferred currency (returns number) */
  convert: (amount: number, fromCurrency: SupportedCurrency) => number;
  /** Get the currency symbol */
  symbol: string;
  /** Whether rates are still loading */
  isLoading: boolean;
  /** Exchange rates data */
  rates: Record<string, number> | null;
}

/**
 * Central currency hook for the app
 * Handles conversion and formatting with user's preferred currency
 */
export function useCurrency(): UseCurrencyReturn {
  const { data: preferences } = useUserPreferences();
  const { data: exchangeData, isLoading } = useExchangeRates('USD', ['INR', 'EUR', 'GBP', 'USD']);
  
  // Get user's preferred currency or default to INR
  const currency = useMemo((): SupportedCurrency => {
    const pref = preferences?.budget_range; // We'll use a new field, but for now check existing
    // Check if user has a currency preference stored
    // For now, default to INR as requested
    return (DEFAULT_CURRENCY as SupportedCurrency) || 'INR';
  }, [preferences]);

  const rates = useMemo(() => {
    if (!exchangeData?.rates) return null;
    // Add USD rate (always 1 for USD base)
    return { ...exchangeData.rates, USD: 1 };
  }, [exchangeData]);

  const convert = useCallback((amount: number, fromCurrency: SupportedCurrency): number => {
    if (!rates || fromCurrency === currency) return amount;
    
    // Convert from source currency to USD first, then to target
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[currency] || 1;
    
    // If base is USD: amount in fromCurrency / fromRate = amount in USD
    // Then: amount in USD * toRate = amount in target currency
    const amountInUSD = fromCurrency === 'USD' ? amount : amount / fromRate;
    return amountInUSD * toRate;
  }, [rates, currency]);

  const format = useCallback((
    amount: number | null | undefined, 
    fromCurrency: SupportedCurrency = 'USD'
  ): string => {
    if (amount === null || amount === undefined) return formatMoney(0, currency);
    
    const converted = fromCurrency === currency ? amount : convert(amount, fromCurrency);
    return formatMoney(converted, currency);
  }, [convert, currency]);

  const formatCompact = useCallback((
    amount: number | null | undefined, 
    fromCurrency: SupportedCurrency = 'USD'
  ): string => {
    if (amount === null || amount === undefined) return formatMoneyCompact(0, currency);
    
    const converted = fromCurrency === currency ? amount : convert(amount, fromCurrency);
    return formatMoneyCompact(converted, currency);
  }, [convert, currency]);

  return {
    currency,
    format,
    formatCompact,
    convert,
    symbol: getCurrencySymbol(currency),
    isLoading,
    rates,
  };
}
