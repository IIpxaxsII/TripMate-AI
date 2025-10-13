import { useState, useEffect } from 'react';

interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large: string;
    large2x: string;
    medium: string;
    small: string;
  };
  alt: string;
}

interface UsePexelsImageResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop';

export function usePexelsImage(query: string): UsePexelsImageResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setImageUrl(FALLBACK_IMAGE);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Pexels API error: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          if (data.photos && data.photos.length > 0) {
            const photo: PexelsPhoto = data.photos[0];
            setImageUrl(photo.src.large);
          } else {
            setImageUrl(FALLBACK_IMAGE);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching Pexels image:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch image');
          setImageUrl(FALLBACK_IMAGE);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return { imageUrl, loading, error };
}
