import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Booking {
  id: string;
  user_id: string;
  trip_id?: string | null;
  provider?: string | null;
  provider_booking_id?: string | null;
  hotel_name?: string | null;
  amount?: number | null;
  currency: string;
  status: string;
  check_in?: string | null;
  check_out?: string | null;
  created_at: string;
}

export interface CreateBookingInput {
  trip_id?: string;
  provider?: string;
  provider_booking_id?: string;
  hotel_name?: string;
  amount?: number;
  currency?: string;
  check_in?: string;
  check_out?: string;
}

async function fetchBookings(tripId?: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  
  if (!userId) return [];

  let query = supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (tripId) {
    query = query.eq('trip_id', tripId);
  }
    
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Booking[];
}

export function useBookings(tripId?: string) {
  return useQuery({
    queryKey: ['bookings', tripId],
    queryFn: () => fetchBookings(tripId),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      
      if (!userId) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          trip_id: input.trip_id || null,
          provider: input.provider || null,
          provider_booking_id: input.provider_booking_id || null,
          hotel_name: input.hotel_name || null,
          amount: input.amount || null,
          currency: input.currency || 'USD',
          status: 'pending',
          check_in: input.check_in || null,
          check_out: input.check_out || null,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created!');
    },
    onError: (error) => {
      console.error('Create booking error:', error);
      toast.error('Failed to create booking');
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled');
    },
    onError: (error) => {
      console.error('Cancel booking error:', error);
      toast.error('Failed to cancel booking');
    },
  });
}
