import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Star, X, Loader2 } from "lucide-react";
import { useSavedDestinations, useToggleSaveDestination } from "@/hooks/useSavedDestinations";
import { usePexelsImage } from "@/hooks/usePexelsImage";

interface SavedDestinationCardProps {
  item: {
    id: string;
    destination?: {
      id: string;
      name: string;
      country: string;
      rating?: number | null;
      category?: string | null;
      image_url?: string | null;
    } | null;
  };
  onRemove: (destinationId: string) => void;
  isRemoving: boolean;
}

const SavedDestinationCard = ({ item, onRemove, isRemoving }: SavedDestinationCardProps) => {
  const destination = item.destination;
  const { imageUrl, loading: imageLoading } = usePexelsImage(destination?.name || '');

  if (!destination) return null;

  return (
    <Card className="overflow-hidden group">
      <div className="aspect-video relative">
        {imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : imageUrl || destination.image_url ? (
          <img
            src={imageUrl || destination.image_url || ''}
            alt={`${destination.name}, ${destination.country}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => onRemove(destination.id)}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{destination.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{destination.country}</p>
        <div className="flex items-center justify-between">
          {destination.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="text-sm font-medium">{destination.rating}</span>
            </div>
          )}
          <Button size="sm" variant="outline" asChild>
            <Link to={`/destinations/${destination.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Saved = () => {
  const { data: savedItems = [], isLoading } = useSavedDestinations();
  const toggleSave = useToggleSaveDestination();

  const handleRemove = (destinationId: string) => {
    toggleSave.mutate({ destinationId, isSaved: true });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Saved Destinations</h1>
          <p className="text-muted-foreground">Your favorite places to explore</p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : savedItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.map((item) => (
              <SavedDestinationCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                isRemoving={toggleSave.isPending}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved destinations yet</h2>
            <p className="text-muted-foreground mb-4">
              Start exploring and save your favorite destinations!
            </p>
            <Button asChild>
              <Link to="/destinations">Explore Destinations</Link>
            </Button>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Saved;
