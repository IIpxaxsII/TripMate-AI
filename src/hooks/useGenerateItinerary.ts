import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GenerateItineraryParams {
  tripId: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  preferences?: string;
  budget?: number;
}

interface GenerateItineraryResult {
  success: boolean;
  itinerary_ids: string[];
  days_created: number;
  activities_created: number;
}

export function useGenerateItinerary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateItinerary = async (params: GenerateItineraryParams): Promise<GenerateItineraryResult | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-itinerary', {
        body: params
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Itinerary Generated!',
        description: `Created ${data.days_created} days with ${data.activities_created} activities.`,
      });

      return data as GenerateItineraryResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate itinerary';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: message,
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateItinerary,
    isGenerating,
    error
  };
}
