import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserPreferences {
  id: string;
  user_id: string;
  interests: string[] | null;
  travel_style: string | null;
  budget_range: string | null;
  accessibility_needs: string[] | null;
  notification_preferences: Record<string, boolean> | null;
  created_at: string;
  updated_at: string;
}

async function fetchUserPreferences(): Promise<UserPreferences | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (error) throw error;
  return data as UserPreferences | null;
}

export function useUserPreferences() {
  return useQuery({
    queryKey: ['user_preferences'],
    queryFn: fetchUserPreferences,
  });
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      interests?: string[];
      travel_style?: string;
      budget_range?: string;
      accessibility_needs?: string[];
      notification_preferences?: Record<string, boolean>;
    }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) throw new Error('Not authenticated');
      
      // Check if preferences exist
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('user_preferences')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            ...updates,
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_preferences'] });
      toast.success('Preferences saved successfully!');
    },
    onError: (error) => {
      console.error('Update preferences error:', error);
      toast.error('Failed to save preferences');
    },
  });
}
