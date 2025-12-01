import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type SavedItem = {
  id: string;
  user_id: string;
  destination_id: string | null;
  trip_id: string | null;
  item_type: string;
  notes?: string | null;
  created_at: string;
};

async function fetchSavedItems() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data ?? [];
}

export function useSavedItems() {
  return useQuery({
    queryKey: ['saved_items'],
    queryFn: fetchSavedItems,
  });
}

export function useToggleSave() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ destinationId, isSaved }: { destinationId: string; isSaved: boolean }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) throw new Error('Not authenticated');
      
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', userId)
          .eq('destination_id', destinationId);
          
        if (error) throw error;
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_items')
          .insert({
            user_id: userId,
            destination_id: destinationId,
            item_type: 'destination',
          });
          
        if (error) throw error;
      }
    },
    onSuccess: (_, { isSaved }) => {
      queryClient.invalidateQueries({ queryKey: ['saved_items'] });
      toast.success(isSaved ? 'Removed from saved' : 'Added to saved');
    },
    onError: (error) => {
      console.error('Toggle save error:', error);
      toast.error('Failed to update saved items');
    },
  });
}
