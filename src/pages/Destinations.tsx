import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Grid3x3, List, Star, Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const Destinations = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Beach", "Mountain", "City", "Adventure", "Culture", "Romantic"];
  
  const destinations = [
    { id: 1, name: "Paris", country: "France", rating: 4.8, price: "$$$", image: "paris", category: "Culture" },
    { id: 2, name: "Tokyo", country: "Japan", rating: 4.9, price: "$$$$", image: "tokyo", category: "City" },
    { id: 3, name: "Bali", country: "Indonesia", rating: 4.7, price: "$$", image: "bali", category: "Beach" },
    { id: 4, name: "New York", country: "USA", rating: 4.6, price: "$$$", image: "newyork", category: "City" },
    { id: 5, name: "Barcelona", country: "Spain", rating: 4.8, price: "$$$", image: "barcelona", category: "Culture" },
    { id: 6, name: "Dubai", country: "UAE", rating: 4.7, price: "$$$$", image: "dubai", category: "City" },
    { id: 7, name: "Santorini", country: "Greece", rating: 4.9, price: "$$$", image: "santorini", category: "Romantic" },
    { id: 8, name: "Machu Picchu", country: "Peru", rating: 4.8, price: "$$$", image: "machu", category: "Adventure" },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Destinations</h1>
          <p className="text-muted-foreground">Discover your next adventure</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            <div className="flex rounded-lg border">
              <Button
                variant="ghost"
                size="icon"
                className={cn(viewMode === "grid" && "bg-accent")}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(viewMode === "list" && "bg-accent")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Destinations Grid/List */}
        <div className={cn(
          "grid gap-4",
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className={cn(
                "overflow-hidden hover-scale cursor-pointer group",
                viewMode === "list" && "flex flex-row"
              )}
            >
              <div className={cn(
                "bg-gradient-to-br from-primary/20 to-accent/20 relative",
                viewMode === "grid" ? "aspect-video" : "w-48 flex-shrink-0"
              )}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-primary/40" />
                </div>
              </div>
              
              <div className={cn("p-4", viewMode === "list" && "flex-1")}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{destination.country}</p>
                  </div>
                  <Badge variant="secondary">{destination.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {destination.price}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Destinations;
