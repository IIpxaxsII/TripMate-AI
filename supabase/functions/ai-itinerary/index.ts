import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ItineraryDay {
  day_number: number;
  activities: {
    start_time: string;
    title: string;
    description: string;
    estimated_duration_minutes: number;
    location: string;
    category?: string;
    cost?: number;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tripId, destination, startDate, endDate, preferences, budget } = await req.json();

    if (!tripId || !destination) {
      return new Response(
        JSON.stringify({ error: 'tripId and destination are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user owns this trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, user_id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip || trip.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Trip not found or unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate number of days
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000);
    const numDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;

    console.log(`Generating ${numDays}-day itinerary for ${destination}`);

    const prompt = `Generate a detailed ${numDays}-day travel itinerary for ${destination}.
${preferences ? `Travel preferences: ${preferences}` : ''}
${budget ? `Budget: $${budget}` : ''}

Return ONLY a valid JSON array with the following structure (no markdown, no explanation):
[
  {
    "day_number": 1,
    "activities": [
      {
        "start_time": "09:00",
        "title": "Activity name",
        "description": "Brief description",
        "estimated_duration_minutes": 120,
        "location": "Location name",
        "category": "sightseeing|food|culture|adventure|relaxation",
        "cost": 0
      }
    ]
  }
]

Include 4-6 activities per day. Make it realistic and practical.`;

    // Use tool calling for structured output
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a travel itinerary generator. Always respond with valid JSON only, no markdown or explanation.'
          },
          { role: 'user', content: prompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'create_itinerary',
              description: 'Create a detailed travel itinerary',
              parameters: {
                type: 'object',
                properties: {
                  days: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        day_number: { type: 'number' },
                        activities: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              start_time: { type: 'string' },
                              title: { type: 'string' },
                              description: { type: 'string' },
                              estimated_duration_minutes: { type: 'number' },
                              location: { type: 'string' },
                              category: { type: 'string' },
                              cost: { type: 'number' }
                            },
                            required: ['start_time', 'title', 'description', 'location']
                          }
                        }
                      },
                      required: ['day_number', 'activities']
                    }
                  }
                },
                required: ['days']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'create_itinerary' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate itinerary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    console.log('AI response:', JSON.stringify(aiData).substring(0, 500));

    let itineraryDays: ItineraryDay[] = [];

    // Parse tool call response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        itineraryDays = parsed.days || [];
      } catch (e) {
        console.error('Failed to parse tool call arguments:', e);
      }
    }

    // Fallback: try parsing content directly
    if (itineraryDays.length === 0) {
      const content = aiData.choices?.[0]?.message?.content;
      if (content) {
        try {
          const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
          itineraryDays = JSON.parse(cleaned);
        } catch (e) {
          console.error('Failed to parse content:', e);
        }
      }
    }

    if (!itineraryDays || itineraryDays.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate valid itinerary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert itineraries and activities into database
    let totalActivities = 0;
    const createdItineraries: string[] = [];

    for (const day of itineraryDays) {
      const itineraryDate = new Date(start);
      itineraryDate.setDate(itineraryDate.getDate() + day.day_number - 1);

      const { data: itinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          trip_id: tripId,
          day_number: day.day_number,
          date: itineraryDate.toISOString().split('T')[0],
          notes: `AI-generated itinerary for ${destination}`
        })
        .select()
        .single();

      if (itineraryError || !itinerary) {
        console.error('Failed to create itinerary:', itineraryError);
        continue;
      }

      createdItineraries.push(itinerary.id);

      // Insert activities
      const activities = day.activities.map((activity, index) => ({
        itinerary_id: itinerary.id,
        title: activity.title.substring(0, 200),
        description: activity.description?.substring(0, 500),
        location: activity.location?.substring(0, 200),
        start_time: activity.start_time,
        category: activity.category,
        cost: activity.cost || 0,
        order_index: index
      }));

      const { error: activitiesError } = await supabase
        .from('activities')
        .insert(activities);

      if (activitiesError) {
        console.error('Failed to insert activities:', activitiesError);
      } else {
        totalActivities += activities.length;
      }
    }

    // Log AI request
    await supabase
      .from('ai_requests')
      .insert({
        user_id: user.id,
        function_name: 'ai-itinerary',
        tokens_used: 1000,
        cost_estimate: 0.001
      });

    return new Response(
      JSON.stringify({
        success: true,
        itinerary_ids: createdItineraries,
        days_created: createdItineraries.length,
        activities_created: totalActivities,
        destination
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-itinerary:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
