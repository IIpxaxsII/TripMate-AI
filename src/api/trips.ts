import { supabase } from '@/integrations/supabase/client';

export interface Trip {
  id: string;
  title: string;
  user_id: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
  budget?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTripInput {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status?: string;
}

export interface UpdateTripInput {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status?: string;
}

export async function fetchUserTrips(): Promise<Trip[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true });
    
  if (error) throw error;
  return data ?? [];
}

export async function fetchTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      start_date: input.start_date,
      end_date: input.end_date,
      budget: input.budget,
      status: input.status || 'draft',
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}
