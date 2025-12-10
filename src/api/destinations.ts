import { supabase } from '@/integrations/supabase/client';

export interface Destination {
  id: string;
  name: string;
  country: string;
  rating?: number;
  category?: string;
  description?: string | null;
  image_url?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export async function fetchDestinations(search?: string): Promise<Destination[]> {
  let query = supabase
    .from('destinations')
    .select('*')
    .order('name', { ascending: true });

  if (search && search.trim()) {
    const searchTerms = search.split(',').map(s => s.trim()).filter(Boolean);
    
    if (searchTerms.length === 1) {
      const pattern = `%${searchTerms[0]}%`;
      query = query.or(`name.ilike.${pattern},country.ilike.${pattern},city.ilike.${pattern},category.ilike.${pattern}`);
    } else {
      const categoryFilters = searchTerms.map(term => `category.ilike.%${term}%`).join(',');
      query = query.or(categoryFilters);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchDestinationById(id: string): Promise<Destination | null> {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

export async function fetchDestinationByName(name: string): Promise<Destination | null> {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .ilike('name', `%${name}%`)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}
