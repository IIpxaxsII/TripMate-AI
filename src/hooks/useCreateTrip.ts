import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface CreateTripInput {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status?: string;
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: CreateTripInput) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id: userId,
          title: input.title,
          description: input.description || null,
          start_date: input.start_date || null,
          end_date: input.end_date || null,
          budget: input.budget || null,
          status: input.status || 'draft',
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip created successfully!');
      navigate(`/itinerary/${data.id}`);
    },
    onError: (error) => {
      console.error('Create trip error:', error);
      toast.error('Failed to create trip');
    },
  });
}
