import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Trip = {
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
};

async function fetchTrips() {
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

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
  });
}
