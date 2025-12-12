import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

interface ExchangeRateCache {
  base: string;
  rates: Record<string, number>;
  fetched_at: string;
}

// In-memory cache for rates
let ratesCache: ExchangeRateCache | null = null;

async function fetchExchangeRates(base: string, symbols: string[]): Promise<Record<string, number>> {
  // Use exchangerate.host (free, no key required)
  const symbolsParam = symbols.join(',');
  const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${symbolsParam}`;
  
  console.log(`Fetching exchange rates from: ${url}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error('Exchange rate API error:', response.status);
    throw new Error(`Exchange rate API returned ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.success && data.success !== undefined) {
    // Try fallback to frankfurter.app (also free, no key)
    console.log('Trying fallback API: frankfurter.app');
    const fallbackUrl = `https://api.frankfurter.app/latest?from=${base}&to=${symbolsParam}`;
    const fallbackResponse = await fetch(fallbackUrl);
    
    if (!fallbackResponse.ok) {
      throw new Error('All exchange rate APIs failed');
    }
    
    const fallbackData = await fallbackResponse.json();
    return fallbackData.rates || {};
  }
  
  return data.rates || {};
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const base = url.searchParams.get('base') || 'USD';
    const symbolsParam = url.searchParams.get('symbols') || 'INR,EUR,GBP';
    const symbols = symbolsParam.split(',').map(s => s.trim());

    console.log(`Exchange rate request: base=${base}, symbols=${symbols.join(',')}`);

    // Check cache
    const now = new Date();
    if (
      ratesCache &&
      ratesCache.base === base &&
      (now.getTime() - new Date(ratesCache.fetched_at).getTime()) < CACHE_DURATION_MS
    ) {
      console.log('Returning cached rates');
      return new Response(JSON.stringify({
        base: ratesCache.base,
        date: now.toISOString().split('T')[0],
        rates: ratesCache.rates,
        fetched_at: ratesCache.fetched_at,
        cached: true,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch fresh rates
    const rates = await fetchExchangeRates(base, symbols);
    
    // Update cache
    ratesCache = {
      base,
      rates,
      fetched_at: now.toISOString(),
    };

    console.log('Fetched fresh rates:', rates);

    return new Response(JSON.stringify({
      base,
      date: now.toISOString().split('T')[0],
      rates,
      fetched_at: now.toISOString(),
      cached: false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Exchange rates error:', errorMessage);
    
    // Return fallback rates if API fails
    const fallbackRates: Record<string, number> = {
      INR: 83.5,
      EUR: 0.92,
      GBP: 0.79,
      USD: 1,
    };

    return new Response(JSON.stringify({
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      rates: fallbackRates,
      fetched_at: new Date().toISOString(),
      fallback: true,
      error: errorMessage,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
