import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  travel_style?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  travel_style?: string;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

export async function updateUserProfile(input: UpdateProfileInput): Promise<UserProfile> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
