import { supabase } from '@/integrations/supabase/client';

export interface SavedItem {
  id: string;
  user_id: string;
  destination_id: string | null;
  trip_id: string | null;
  item_type: string;
  notes?: string | null;
  created_at: string;
}

export interface SavedDestination extends SavedItem {
  destination?: {
    id: string;
    name: string;
    country: string;
    rating?: number | null;
    category?: string | null;
    image_url?: string | null;
  };
}

export async function fetchSavedItems(): Promise<SavedItem[]> {
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

export async function fetchSavedDestinations(): Promise<SavedDestination[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('saved_items')
    .select(`
      *,
      destination:destinations (
        id,
        name,
        country,
        rating,
        category,
        image_url
      )
    `)
    .eq('user_id', userId)
    .eq('item_type', 'destination');
    
  if (error) throw error;
  return (data ?? []) as SavedDestination[];
}

export async function saveDestination(destinationId: string): Promise<SavedItem> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('saved_items')
    .insert({
      user_id: userId,
      destination_id: destinationId,
      item_type: 'destination',
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function unsaveDestination(destinationId: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('user_id', userId)
    .eq('destination_id', destinationId);
    
  if (error) throw error;
}

export async function toggleSaveDestination(destinationId: string, isSaved: boolean): Promise<void> {
  if (isSaved) {
    await unsaveDestination(destinationId);
  } else {
    await saveDestination(destinationId);
  }
}
