import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Star, MapPin, Heart } from 'lucide-react';
import { useSavedItems, useToggleSave } from '@/hooks/useSavedItems';

export default function DestinationDetail() {
  const { id } = useParams();
  const { data: savedItems } = useSavedItems();
  const toggleSave = useToggleSave();
  
  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const isSaved = savedItems?.some(item => item.destination_id === id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      toggleSave.mutate({ destinationId: id, isSaved: !!isSaved });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-32 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!destination) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
          <Button asChild>
            <Link to="/destinations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link to="/destinations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Link>
        </Button>

        {/* Hero Section */}
        <Card className="overflow-hidden">
          <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20">
            {destination.image_url && (
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Save Button */}
            <button
              onClick={handleToggleSave}
              className="absolute top-4 right-4 h-12 w-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isSaved ? 'fill-destructive text-destructive' : ''}`}
              />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {destination.name}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">
                      {destination.city ? `${destination.city}, ` : ''}
                      {destination.country}
                    </span>
                  </div>
                </div>
                {destination.category && (
                  <Badge variant="secondary" className="text-sm">
                    {destination.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Rating */}
            {destination.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span className="font-medium">{destination.rating}</span>
                </div>
              </div>
            )}

            {/* Description */}
            {destination.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {destination.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" asChild>
                <Link to="/plan">Plan a Trip</Link>
              </Button>
              <Button variant="outline" className="flex-1">
                View on Map
              </Button>
            </div>
          </div>
        </Card>

        {/* TODO: Future sections */}
        {/* - Nearby hotels/accommodations */}
        {/* - Popular activities */}
        {/* - User reviews */}
        {/* - Photo gallery */}
      </div>
    </MainLayout>
  );
}
