import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, TrendingUp, Calendar } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Ready to plan your next adventure?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 hover-scale cursor-pointer bg-gradient-to-br from-primary to-primary/80 text-white">
            <Sparkles className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">AI Chat</h3>
            <p className="text-sm text-white/80">Get personalized advice</p>
          </Card>
          
          <Card className="p-4 hover-scale cursor-pointer bg-gradient-to-br from-secondary to-secondary/80 text-white">
            <MapPin className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-1">Explore</h3>
            <p className="text-sm text-white/80">Discover destinations</p>
          </Card>
        </div>

        {/* Mood-Based Suggestions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              How are you feeling today?
            </h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["🌴 Relaxed", "🏔️ Adventurous", "🎨 Cultural", "💑 Romantic", "🏖️ Beachy"].map((mood) => (
              <Button key={mood} variant="outline" className="whitespace-nowrap">
                {mood}
              </Button>
            ))}
          </div>
        </div>

        {/* Trending Destinations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trending Destinations
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Paris", "Tokyo", "Bali", "New York", "Barcelona", "Dubai"].map((city) => (
              <Card key={city} className="overflow-hidden hover-scale cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20"></div>
                <div className="p-3">
                  <h3 className="font-semibold">{city}</h3>
                  <p className="text-xs text-muted-foreground">Explore now</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Trips
          </h2>
          
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No trips planned yet</p>
            <Button>Plan Your First Trip</Button>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
