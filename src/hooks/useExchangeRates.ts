import { useQuery } from '@tanstack/react-query';

interface ExchangeRatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
  fetched_at: string;
  cached?: boolean;
  fallback?: boolean;
}

async function fetchExchangeRates(base: string, symbols: string[]): Promise<ExchangeRatesResponse> {
  const symbolsParam = symbols.join(',');
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exchange-rates?base=${base}&symbols=${symbolsParam}`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates');
  }

  return response.json();
}

/**
 * Hook to fetch exchange rates from the edge function
 * Caches results for 1 hour (aligned with server cache)
 */
export function useExchangeRates(base: string = 'USD', symbols: string[] = ['INR', 'EUR', 'GBP']) {
  return useQuery({
    queryKey: ['exchange-rates', base, symbols.join(',')],
    queryFn: () => fetchExchangeRates(base, symbols),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours cache
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Get a specific exchange rate
 */
export function useExchangeRate(fromCurrency: string, toCurrency: string) {
  const { data, isLoading, error } = useExchangeRates(fromCurrency, [toCurrency]);
  
  return {
    rate: data?.rates?.[toCurrency] ?? null,
    isLoading,
    error,
    isFallback: data?.fallback ?? false,
  };
}
