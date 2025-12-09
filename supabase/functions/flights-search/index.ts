import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Mock flight data
function generateMockFlights(origin: string, destination: string, date: string): Flight[] {
  const airlines = ['United', 'Delta', 'American', 'Southwest', 'JetBlue'];
  const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];
  
  return airlines.map((airline, index) => {
    const departureHour = 6 + index * 3;
    const flightDuration = 2 + Math.floor(Math.random() * 6);
    const arrivalHour = (departureHour + flightDuration) % 24;
    
    return {
      id: `flight-${index + 1}`,
      airline,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${100 + index * 50}`,
      departure: {
        airport: origin.toUpperCase().substring(0, 3),
        city: origin,
        time: `${date}T${String(departureHour).padStart(2, '0')}:00:00`
      },
      arrival: {
        airport: destination.toUpperCase().substring(0, 3),
        city: destination,
        time: `${date}T${String(arrivalHour).padStart(2, '0')}:30:00`
      },
      duration: `${flightDuration}h 30m`,
      price: Math.floor(150 + Math.random() * 500),
      currency: 'USD',
      cabinClass: cabinClasses[Math.floor(Math.random() * cabinClasses.length)],
      stops: Math.random() > 0.6 ? 1 : 0
    };
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const origin = url.searchParams.get('origin');
    const destination = url.searchParams.get('destination');
    const departureDate = url.searchParams.get('date');
    const passengers = url.searchParams.get('passengers') || '1';

    if (!origin || !destination || !departureDate) {
      return new Response(
        JSON.stringify({ error: 'origin, destination, and date are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Flight search: ${origin} → ${destination} on ${departureDate}`);

    // Check for flight API key (Amadeus or alternative)
    const AMADEUS_CLIENT_ID = Deno.env.get('AMADEUS_CLIENT_ID');
    const AMADEUS_CLIENT_SECRET = Deno.env.get('AMADEUS_CLIENT_SECRET');

    let flights: Flight[];

    if (AMADEUS_CLIENT_ID && AMADEUS_CLIENT_SECRET) {
      // TODO: Implement real Amadeus API integration
      console.log('Amadeus API keys found, but using mock data for now');
      flights = generateMockFlights(origin, destination, departureDate);
    } else {
      console.log('No flight API keys, returning mock data');
      flights = generateMockFlights(origin, destination, departureDate);
    }

    // Sort by price
    flights.sort((a, b) => a.price - b.price);

    // Log external request if user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } },
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('external_requests').insert({
            user_id: user.id,
            api_name: 'flights-search',
            request_payload: { origin, destination, date: departureDate, passengers },
            response_status: 200
          });
        }
      } catch (e) {
        console.error('Failed to log request:', e);
      }
    }

    return new Response(
      JSON.stringify({
        flights,
        total: flights.length,
        origin,
        destination,
        departureDate,
        passengers: parseInt(passengers)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in flights-search:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
