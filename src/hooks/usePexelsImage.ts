import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large: string;
    large2x: string;
    medium: string;
    small: string;
    landscape: string;
  };
  alt: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop';

async function fetchPexelsImage(query: string): Promise<string> {
  if (!query || query.trim() === '') {
    return FALLBACK_IMAGE;
  }

  try {
    // Use Edge Function for secure API calls
    const { data, error } = await supabase.functions.invoke('getPexelsImage', {
      body: { query, perPage: 1 }
    });

    if (error) {
      console.warn('Edge function error:', error);
      return FALLBACK_IMAGE;
    }

    if (data?.photos && data.photos.length > 0) {
      const photo: PexelsPhoto = data.photos[0];
      return photo.src.landscape || photo.src.large || photo.src.medium || FALLBACK_IMAGE;
    }

    return FALLBACK_IMAGE;
  } catch (err) {
    console.error('Error fetching Pexels image:', err);
    return FALLBACK_IMAGE;
  }
}

export function usePexelsImage(query: string | undefined) {
  const searchQuery = query?.trim() || '';
  
  const result = useQuery({
    queryKey: ['pexels-image', searchQuery],
    queryFn: () => fetchPexelsImage(searchQuery),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
    enabled: searchQuery.length > 0,
  });

  return {
    imageUrl: result.data ?? (searchQuery ? null : FALLBACK_IMAGE),
    loading: result.isLoading,
    error: result.error?.message ?? null,
  };
}
