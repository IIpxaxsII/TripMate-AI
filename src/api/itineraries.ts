import { supabase } from '@/integrations/supabase/client';

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

export async function fetchItinerariesForTrip(tripId: string): Promise<Itinerary[]> {
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

export async function createItinerary(tripId: string, dayNumber: number, date?: string): Promise<Itinerary> {
  const { data, error } = await supabase
    .from('itineraries')
    .insert({
      trip_id: tripId,
      day_number: dayNumber,
      date,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateItinerary(id: string, updates: { notes?: string; date?: string }): Promise<Itinerary> {
  const { data, error } = await supabase
    .from('itineraries')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteItinerary(id: string): Promise<void> {
  const { error } = await supabase
    .from('itineraries')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}

export async function addActivity(
  itineraryId: string,
  activity: Omit<Activity, 'id' | 'itinerary_id' | 'created_at'>
): Promise<Activity> {
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
}

export async function updateActivity(id: string, updates: Partial<Activity>): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}
