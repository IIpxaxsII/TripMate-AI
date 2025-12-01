import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePexelsImage } from "@/hooks/usePexelsImage";
import { Link } from "react-router-dom";
import { useSavedItems, useToggleSave } from "@/hooks/useSavedItems";
import type { Destination } from "@/hooks/useDestinations";

interface DestinationCardProps {
  destination: Destination;
  viewMode: "grid" | "list";
}

export const DestinationCard = ({ destination, viewMode }: DestinationCardProps) => {
  const { imageUrl, loading } = usePexelsImage(destination.name);
  const { data: savedItems } = useSavedItems();
  const toggleSave = useToggleSave();

  const isSaved = savedItems?.some(item => item.destination_id === destination.id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave.mutate({ destinationId: destination.id, isSaved: !!isSaved });
  };

  return (
    <Link to={`/destinations/${destination.id}`}>
      <Card
        className={cn(
          "overflow-hidden hover-scale cursor-pointer group",
          viewMode === "list" && "flex flex-row"
        )}
      >
        <div
          className={cn(
            "relative bg-muted",
            viewMode === "grid" ? "aspect-video" : "w-48 flex-shrink-0 aspect-square"
          )}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (imageUrl || destination.image_url) ? (
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
          
          <button 
            onClick={handleToggleSave}
            className="absolute top-2 right-2 h-10 w-10 rounded-md bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-colors z-10"
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-destructive text-destructive")} />
          </button>
        </div>

        <div className={cn("p-4", viewMode === "list" && "flex-1")}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {destination.name}
              </h3>
              <p className="text-sm text-muted-foreground">{destination.country}</p>
            </div>
            {destination.category && (
              <Badge variant="secondary">{destination.category}</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            {destination.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{destination.rating}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
