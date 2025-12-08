import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Destination = {
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
};

async function fetchDestinations(search?: string) {
  let query = supabase
    .from('destinations')
    .select('*')
    .order('name', { ascending: true });

  if (search && search.trim()) {
    const searchTerms = search.split(',').map(s => s.trim()).filter(Boolean);
    
    if (searchTerms.length === 1) {
      // Single term - search across name, country, city, and category
      const pattern = `%${searchTerms[0]}%`;
      query = query.or(`name.ilike.${pattern},country.ilike.${pattern},city.ilike.${pattern},category.ilike.${pattern}`);
    } else {
      // Multiple terms (categories) - use IN-like filter with OR
      const categoryFilters = searchTerms.map(term => `category.ilike.%${term}%`).join(',');
      query = query.or(categoryFilters);
    }
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
