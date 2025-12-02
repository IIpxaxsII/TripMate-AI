import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  image_url: string;
  amenities: string[];
  provider: string;
}

// Mock hotel data for when no API key is available
function generateMockHotels(destination: string, checkin: string, checkout: string): Hotel[] {
  const hotelNames = [
    `Grand ${destination} Hotel`,
    `${destination} Plaza Resort`,
    `The ${destination} Inn`,
    `${destination} Boutique Suites`,
    `Comfort Stay ${destination}`,
  ];

  const amenities = [
    ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant'],
    ['WiFi', 'Pool', 'Breakfast', 'Parking'],
    ['WiFi', 'Breakfast', 'Air Conditioning'],
    ['WiFi', 'Pool', 'Gym', 'Room Service', 'Bar'],
    ['WiFi', 'Breakfast', 'Parking', 'Pet Friendly'],
  ];

  return hotelNames.map((name, index) => ({
    id: `mock-hotel-${index + 1}`,
    name,
    price: Math.floor(Math.random() * 200) + 80,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    location: `${destination} City Center`,
    image_url: `https://images.pexels.com/photos/${1134176 + index * 100}/pexels-photo-${1134176 + index * 100}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    amenities: amenities[index],
    provider: 'mock',
  }));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const destination = url.searchParams.get('q') || url.searchParams.get('destination');
    const checkin = url.searchParams.get('checkin');
    const checkout = url.searchParams.get('checkout');
    const guests = url.searchParams.get('guests') || '2';

    if (!destination) {
      return new Response(
        JSON.stringify({ error: 'Destination is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Hotel search: ${destination}, ${checkin} to ${checkout}, ${guests} guests`);

    // Check for hotel API key
    const HOTEL_API_KEY = Deno.env.get('HOTEL_API_KEY');

    let hotels: Hotel[];

    if (HOTEL_API_KEY) {
      // TODO: Implement real hotel API integration (e.g., Amadeus, Booking.com)
      // For now, return mock data even when key is present
      console.log('Hotel API key found, but using mock data for now');
      hotels = generateMockHotels(destination, checkin || '', checkout || '');
    } else {
      // Return mock data
      console.log('No hotel API key, returning mock data');
      hotels = generateMockHotels(destination, checkin || '', checkout || '');
    }

    // Sort by rating (best first)
    hotels.sort((a, b) => b.rating - a.rating);

    return new Response(
      JSON.stringify({ 
        hotels,
        total: hotels.length,
        destination,
        checkin,
        checkout,
        guests: parseInt(guests),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in hotel-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
