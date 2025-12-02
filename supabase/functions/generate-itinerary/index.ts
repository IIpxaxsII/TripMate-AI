import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TripData {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  preferences?: {
    interests?: string[];
    travel_style?: string;
  };
}

interface GeneratedActivity {
  day: number;
  time: string;
  title: string;
  description: string;
  location: string;
  duration_minutes: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trip, promptOverrides } = await req.json() as { trip: TripData; promptOverrides?: string };
    
    // Validate input
    if (!trip || !trip.id || !trip.start_date || !trip.end_date) {
      return new Response(
        JSON.stringify({ error: 'Invalid trip data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user owns the trip
    const { data: tripData, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', trip.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (tripError || !tripData) {
      return new Response(
        JSON.stringify({ error: 'Trip not found or unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating itinerary for trip:', trip.id);

    // Calculate trip duration
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Limit to reasonable duration
    if (tripDays > 14) {
      return new Response(
        JSON.stringify({ error: 'Trip duration exceeds maximum of 14 days' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try GEMINI first, then OpenAI
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'No AI API key configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the prompt
    const interests = trip.preferences?.interests?.join(', ') || 'general sightseeing';
    const travelStyle = trip.preferences?.travel_style || 'balanced';
    const budgetInfo = trip.budget ? `Budget: $${trip.budget}` : '';

    const systemPrompt = `You are TripMate AI, an expert travel planner. Generate a detailed day-by-day itinerary for the user's trip. 
Return your response as a valid JSON array of activities. Each activity must have these exact fields:
- day: number (1 to ${tripDays})
- time: string (e.g., "9:00 AM")
- title: string (activity name)
- description: string (brief description)
- location: string (specific location)
- duration_minutes: number (estimated duration)

Generate 3-5 activities per day. Make the itinerary realistic and consider travel time between locations.`;

    const userPrompt = `Create a ${tripDays}-day itinerary for a trip to "${trip.title}".
Trip details:
- Dates: ${trip.start_date} to ${trip.end_date}
- Interests: ${interests}
- Travel style: ${travelStyle}
${budgetInfo}
${promptOverrides ? `Additional preferences: ${promptOverrides}` : ''}

Return ONLY the JSON array, no additional text.`;

    let aiResponse: string;

    if (GEMINI_API_KEY) {
      // Use Gemini
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error('Gemini API error');
      }

      const geminiData = await geminiResponse.json();
      aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      // Use OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error('OpenAI API error');
      }

      const openaiData = await openaiResponse.json();
      aiResponse = openaiData.choices?.[0]?.message?.content || '';
    }

    console.log('AI Response received, parsing...');

    // Parse the AI response
    let activities: GeneratedActivity[];
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = aiResponse.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();
      
      activities = JSON.parse(jsonStr);
      
      if (!Array.isArray(activities)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', aiResponse);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse AI response',
          ai_text: aiResponse 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create itineraries for each day
    const itineraryIds: string[] = [];
    
    for (let day = 1; day <= tripDays; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day - 1);
      
      // Check if itinerary for this day already exists
      const { data: existingItinerary } = await supabase
        .from('itineraries')
        .select('id')
        .eq('trip_id', trip.id)
        .eq('day_number', day)
        .maybeSingle();

      let itineraryId: string;

      if (existingItinerary) {
        itineraryId = existingItinerary.id;
        // Delete existing activities for this itinerary
        await supabase
          .from('activities')
          .delete()
          .eq('itinerary_id', itineraryId);
      } else {
        // Create new itinerary
        const { data: newItinerary, error: itinError } = await supabase
          .from('itineraries')
          .insert({
            trip_id: trip.id,
            day_number: day,
            date: date.toISOString().split('T')[0],
          })
          .select()
          .single();

        if (itinError) {
          console.error('Error creating itinerary:', itinError);
          continue;
        }
        itineraryId = newItinerary.id;
      }

      itineraryIds.push(itineraryId);

      // Insert activities for this day
      const dayActivities = activities
        .filter(a => a.day === day)
        .map((activity, index) => ({
          itinerary_id: itineraryId,
          title: activity.title,
          description: activity.description,
          location: activity.location,
          start_time: activity.time,
          order_index: index,
          category: 'activity',
        }));

      if (dayActivities.length > 0) {
        const { error: actError } = await supabase
          .from('activities')
          .insert(dayActivities);

        if (actError) {
          console.error('Error inserting activities:', actError);
        }
      }
    }

    console.log('Itinerary generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        itineraryIds,
        itemsCount: activities.length,
        ai_text: aiResponse,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-itinerary function:', error);
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
