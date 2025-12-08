import { Sparkles, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HeroTilesProps {
  onChat: () => void;
  onExplore: () => void;
}

export const HeroTiles = ({ onChat, onExplore }: HeroTilesProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card
        role="button"
        tabIndex={0}
        aria-label="Open AI Chat for personalized travel advice"
        onClick={onChat}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChat(); } }}
        className="p-6 hover-scale cursor-pointer bg-gradient-to-br from-primary to-primary/80 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
      >
        <Sparkles className="w-8 h-8 mb-3" />
        <h3 className="font-semibold mb-1 text-lg">AI Chat</h3>
        <p className="text-sm opacity-90">Get personalized advice</p>
      </Card>
      
      <Card
        role="button"
        tabIndex={0}
        aria-label="Explore travel destinations"
        onClick={onExplore}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onExplore(); } }}
        className="p-6 hover-scale cursor-pointer bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
      >
        <MapPin className="w-8 h-8 mb-3" />
        <h3 className="font-semibold mb-1 text-lg">Explore</h3>
        <p className="text-sm opacity-90">Discover destinations</p>
      </Card>
    </div>
  );
};
