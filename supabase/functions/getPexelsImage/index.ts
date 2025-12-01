import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, perPage = 1 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!PEXELS_API_KEY) {
      console.error('PEXELS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Image service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching Pexels image for query: ${query}`);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: `Pexels API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      console.log(`Successfully fetched ${data.photos.length} image(s) for: ${query}`);
      return new Response(
        JSON.stringify({
          photos: data.photos,
          total_results: data.total_results,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.log(`No images found for query: ${query}`);
      return new Response(
        JSON.stringify({ 
          photos: [],
          total_results: 0,
          message: 'No images found' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in getPexelsImage function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
