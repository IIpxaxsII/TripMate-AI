import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { usePexelsImage } from "@/hooks/usePexelsImage";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/track";
import type { Destination } from "@/hooks/useDestinations";

interface TrendingCardProps {
  destination: Destination;
}

const TrendingCard = ({ destination }: TrendingCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { imageUrl, loading: imageLoading } = usePexelsImage(destination.name);

  const handlePrefetch = () => {
    // Prefetch destination details
    queryClient.prefetchQuery({
      queryKey: ['destination', destination.id],
      queryFn: async () => {
        const { data } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', destination.id)
          .single();
        return data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Prefetch hotels for this destination
    queryClient.prefetchQuery({
      queryKey: ['hotels', destination.name],
      queryFn: async () => {
        const response = await supabase.functions.invoke('hotel-search', {
          body: { destination: destination.name }
        });
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleClick = () => {
    trackEvent('trending_card_click', { 
      destinationId: destination.id, 
      destinationName: destination.name 
    });
    navigate(`/destinations/${destination.id}`);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Explore ${destination.name}, ${destination.country}`}
      onClick={handleClick}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') { 
          e.preventDefault(); 
          handleClick(); 
        } 
      }}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      className="overflow-hidden hover-scale cursor-pointer group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <div className="relative aspect-video bg-muted">
        {imageLoading ? (
          <Skeleton className="w-full h-full" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`${destination.name}, ${destination.country}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-semibold text-lg">Explore</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold group-hover:text-primary transition-colors">{destination.name}</h3>
        <p className="text-xs text-muted-foreground">{destination.country || 'Explore now'}</p>
      </div>
    </Card>
  );
};

interface TrendingGridProps {
  destinations: Destination[];
  isLoading: boolean;
}

export const TrendingGrid = ({ destinations, isLoading }: TrendingGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No destinations found for the selected moods.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {destinations.map((destination) => (
        <TrendingCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
};
