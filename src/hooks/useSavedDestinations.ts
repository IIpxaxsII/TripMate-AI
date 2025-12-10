import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSavedDestinations, toggleSaveDestination, type SavedDestination } from '@/api/saved';
import { toast } from 'sonner';

export { type SavedDestination } from '@/api/saved';

export function useSavedDestinations() {
  return useQuery({
    queryKey: ['saved_destinations'],
    queryFn: fetchSavedDestinations,
  });
}

export function useToggleSaveDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ destinationId, isSaved }: { destinationId: string; isSaved: boolean }) => {
      await toggleSaveDestination(destinationId, isSaved);
    },
    onSuccess: (_, { isSaved }) => {
      queryClient.invalidateQueries({ queryKey: ['saved_destinations'] });
      queryClient.invalidateQueries({ queryKey: ['saved_items'] });
      toast.success(isSaved ? 'Removed from saved' : 'Added to saved');
    },
    onError: (error) => {
      console.error('Toggle save error:', error);
      toast.error('Failed to update saved items');
    },
  });
}
