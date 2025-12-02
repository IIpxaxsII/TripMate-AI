import { useQuery } from '@tanstack/react-query';

export interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  image_url: string;
  amenities: string[];
  provider: string;
}

export interface HotelSearchParams {
  destination: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
}

async function searchHotels(params: HotelSearchParams): Promise<{ hotels: Hotel[]; total: number }> {
  const queryParams = new URLSearchParams({
    q: params.destination,
    ...(params.checkin && { checkin: params.checkin }),
    ...(params.checkout && { checkout: params.checkout }),
    ...(params.guests && { guests: params.guests.toString() }),
  });

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hotel-search?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to search hotels');
  }

  return response.json();
}

export function useHotelSearch(params: HotelSearchParams | null) {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => searchHotels(params!),
    enabled: !!params?.destination,
  });
}
