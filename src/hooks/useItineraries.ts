import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Activity {
  id: string;
  itinerary_id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  cost?: number | null;
  order_index?: number | null;
  category?: string | null;
  created_at: string;
}

export interface Itinerary {
  id: string;
  trip_id: string;
  day_number: number;
  date?: string | null;
  notes?: string | null;
  created_at: string;
  activities?: Activity[];
}

async function fetchItineraries(tripId: string) {
  const { data, error } = await supabase
    .from('itineraries')
    .select(`
      *,
      activities (*)
    `)
    .eq('trip_id', tripId)
    .order('day_number', { ascending: true });
    
  if (error) throw error;
  return (data ?? []) as Itinerary[];
}

export function useItineraries(tripId: string) {
  return useQuery({
    queryKey: ['itineraries', tripId],
    queryFn: () => fetchItineraries(tripId),
    enabled: !!tripId,
  });
}

export function useGenerateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      trip, 
      promptOverrides 
    }: { 
      trip: {
        id: string;
        title: string;
        description?: string | null;
        start_date?: string | null;
        end_date?: string | null;
        budget?: number | null;
      };
      promptOverrides?: string;
    }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            trip: {
              id: trip.id,
              title: trip.title,
              description: trip.description,
              start_date: trip.start_date,
              end_date: trip.end_date,
              budget: trip.budget,
            },
            promptOverrides,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate itinerary');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itineraries', variables.trip.id] });
      toast.success('Itinerary generated successfully!');
    },
    onError: (error) => {
      console.error('Generate itinerary error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate itinerary');
    },
  });
}

export function useAddActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      itineraryId, 
      activity 
    }: { 
      itineraryId: string;
      activity: Omit<Activity, 'id' | 'itinerary_id' | 'created_at'>;
    }) => {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          itinerary_id: itineraryId,
          ...activity,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      toast.success('Activity added!');
    },
    onError: (error) => {
      console.error('Add activity error:', error);
      toast.error('Failed to add activity');
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      activityId, 
      updates 
    }: { 
      activityId: string;
      updates: Partial<Activity>;
    }) => {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', activityId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      toast.success('Activity updated!');
    },
    onError: (error) => {
      console.error('Update activity error:', error);
      toast.error('Failed to update activity');
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      toast.success('Activity deleted!');
    },
    onError: (error) => {
      console.error('Delete activity error:', error);
      toast.error('Failed to delete activity');
    },
  });
}
