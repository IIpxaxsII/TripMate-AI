import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
  };
  duration: string;
  price: number;
  currency: string;
  cabinClass: string;
  stops: number;
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers?: number;
}

export function useFlightSearch() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async (params: FlightSearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        date: params.date,
        passengers: String(params.passengers || 1),
      });

      const { data, error: fnError } = await supabase.functions.invoke('flights-search', {
        body: null,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Use fetch for GET request with query params
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/flights-search?${queryParams}`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search flights');
      }

      const result = await response.json();
      setFlights(result.flights || []);
      return result.flights;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search flights';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    flights,
    searchFlights,
    isLoading,
    error,
  };
}
