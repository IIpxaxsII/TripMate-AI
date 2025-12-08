import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Calendar, Briefcase } from "lucide-react";
import { HeroTiles } from "@/components/home/HeroTiles";
import { MoodChip } from "@/components/home/MoodChip";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { useDestinations } from "@/hooks/useDestinations";
import { useDebounce } from "@/hooks/useDebounce";
import { trackEvent } from "@/lib/track";

const MOOD_OPTIONS = [
  { label: "🌴 Relaxed", value: "relaxed", category: "Beach" },
  { label: "🏔️ Adventurous", value: "adventurous", category: "Adventure" },
  { label: "🎨 Cultural", value: "cultural", category: "Culture" },
  { label: "💑 Romantic", value: "romantic", category: "Romance" },
  { label: "🏖️ Beachy", value: "beachy", category: "Beach" },
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  
  // Convert selected moods to category search
  const searchCategories = useMemo(() => {
    if (selectedMoods.length === 0) return undefined;
    const categories = MOOD_OPTIONS
      .filter(m => selectedMoods.includes(m.value))
      .map(m => m.category);
    return [...new Set(categories)].join(',');
  }, [selectedMoods]);
  
  const debouncedSearch = useDebounce(searchCategories, 300);
  const { data: destinations = [], isLoading } = useDestinations(debouncedSearch);
  
  // Limit to 6 trending destinations
  const trendingDestinations = useMemo(() => destinations.slice(0, 6), [destinations]);

  const handleChatClick = useCallback(() => {
    trackEvent('hero_chat_click');
    navigate('/chat');
  }, [navigate]);

  const handleExploreClick = useCallback(() => {
    trackEvent('hero_explore_click');
    navigate('/destinations');
  }, [navigate]);

  const handleMoodToggle = useCallback((value: string) => {
    trackEvent('mood_chip_toggle', { mood: value });
    setSelectedMoods(prev => 
      prev.includes(value) 
        ? prev.filter(m => m !== value)
        : [...prev, value]
    );
  }, []);

  const handleClearMoods = useCallback(() => {
    trackEvent('mood_chip_clear');
    setSelectedMoods([]);
  }, []);

  const handlePlanTrip = useCallback(() => {
    trackEvent('quick_action_plan_trip');
    navigate('/plan');
  }, [navigate]);

  const handleMyTrips = useCallback(() => {
    trackEvent('quick_action_my_trips');
    navigate('/trips');
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Ready to plan your next adventure?</p>
        </div>

        {/* Hero Tiles */}
        <HeroTiles onChat={handleChatClick} onExplore={handleExploreClick} />

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handlePlanTrip}
            className="flex items-center gap-2"
            aria-label="Plan a new trip"
          >
            <Briefcase className="w-4 h-4" />
            Plan Trip
          </Button>
          <Button 
            variant="outline" 
            onClick={handleMyTrips}
            className="flex items-center gap-2"
            aria-label="View my trips"
          >
            <Calendar className="w-4 h-4" />
            My Trips
          </Button>
        </div>

        {/* Mood-Based Suggestions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              How are you feeling today?
            </h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <MoodChip 
              label="All" 
              value="all" 
              selected={selectedMoods.length === 0}
              onToggle={handleClearMoods}
            />
            {MOOD_OPTIONS.map((mood) => (
              <MoodChip
                key={mood.value}
                label={mood.label}
                value={mood.value}
                selected={selectedMoods.includes(mood.value)}
                onToggle={() => handleMoodToggle(mood.value)}
              />
            ))}
          </div>
        </div>

        {/* Trending Destinations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-primary" />
            {selectedMoods.length > 0 ? 'Destinations for Your Mood' : 'Trending Destinations'}
          </h2>
          
          <TrendingGrid destinations={trendingDestinations} isLoading={isLoading} />
        </div>

        {/* Upcoming Trips */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Trips
          </h2>
          
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No trips planned yet</p>
            <Button onClick={handlePlanTrip}>Plan Your First Trip</Button>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
