import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { useDestinations } from "@/hooks/useDestinations";
import { useDebounce } from "@/hooks/useDebounce";

const Destinations = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { data: destinations = [], isLoading } = useDestinations(debouncedSearch);

  const categories = ["All", "Beach", "Mountain", "City", "Adventure", "Culture", "Romantic"];

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
            <button className="border rounded-md bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="flex rounded-lg border">
              <button
                className={cn("h-10 w-10 rounded-md hover:bg-accent flex items-center justify-center", viewMode === "grid" && "bg-accent")}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                className={cn("h-10 w-10 rounded-md hover:bg-accent flex items-center justify-center", viewMode === "list" && "bg-accent")}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </button>
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
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className={cn(
                  "w-full",
                  viewMode === "grid" ? "h-48" : "h-32"
                )} />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : destinations.length > 0 ? (
            destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                viewMode={viewMode}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? `No destinations found matching "${searchQuery}"` : 'No destinations available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Destinations;
