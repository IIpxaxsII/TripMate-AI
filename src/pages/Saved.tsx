import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MapPin, Star, X } from "lucide-react";

const Saved = () => {
  const [savedDestinations] = useState([
    { id: 1, name: "Paris", country: "France", rating: 4.8, category: "Culture" },
    { id: 2, name: "Santorini", country: "Greece", rating: 4.9, category: "Romantic" },
    { id: 3, name: "Bali", country: "Indonesia", rating: 4.7, category: "Beach" },
  ]);

  const [savedActivities] = useState([
    { id: 1, name: "Eiffel Tower Visit", location: "Paris, France", duration: "3h" },
    { id: 2, name: "Sunset Cruise", location: "Santorini, Greece", duration: "2h" },
  ]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Saved Items</h1>
          <p className="text-muted-foreground">Your favorite destinations and activities</p>
        </div>

        <Tabs defaultValue="destinations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="destinations">
              Destinations ({savedDestinations.length})
            </TabsTrigger>
            <TabsTrigger value="activities">
              Activities ({savedActivities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="destinations" className="space-y-4">
            {savedDestinations.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedDestinations.map((destination) => (
                  <Card key={destination.id} className="overflow-hidden group">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-primary/40" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{destination.country}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-secondary text-secondary" />
                          <span className="text-sm font-medium">{destination.rating}</span>
                        </div>
                        <Button size="sm" variant="outline">Plan Trip</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved destinations yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            {savedActivities.length > 0 ? (
              <div className="space-y-3">
                {savedActivities.map((activity) => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                          <span>•</span>
                          <span>{activity.duration}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Add to Trip</Button>
                        <Button size="icon" variant="ghost">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved activities yet</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Saved;
