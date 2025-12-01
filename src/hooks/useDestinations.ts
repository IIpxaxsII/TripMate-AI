import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Destination = {
  id: string;
  name: string;
  country: string;
  rating?: number;
  price?: string;
  category?: string;
  description?: string | null;
  image_url?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

async function fetchDestinations(search?: string) {
  let query = supabase
    .from('destinations')
    .select('*')
    .order('name', { ascending: true });

  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`;
    query = query.or(`name.ilike.${pattern},country.ilike.${pattern},city.ilike.${pattern}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export function useDestinations(search?: string) {
  return useQuery({
    queryKey: ['destinations', search],
    queryFn: () => fetchDestinations(search),
  });
}
