import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain, Palmtree, Building2, Heart, Camera, UtensilsCrossed } from "lucide-react";

interface PreferenceSelectorProps {
  preferences: {
    interests: string[];
    travelStyle: string;
    budget: string;
  };
  onPreferencesChange: (preferences: any) => void;
}

const interests = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "beach", label: "Beach & Relaxation", icon: Palmtree },
  { id: "culture", label: "Culture & History", icon: Building2 },
  { id: "romance", label: "Romance", icon: Heart },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "food", label: "Food & Culinary", icon: UtensilsCrossed },
];

const travelStyles = [
  { id: "luxury", label: "Luxury", description: "Premium experiences and comfort" },
  { id: "balanced", label: "Balanced", description: "Mix of comfort and value" },
  { id: "budget", label: "Budget-Friendly", description: "Cost-effective travel" },
];

export const PreferenceSelector = ({ preferences, onPreferencesChange }: PreferenceSelectorProps) => {
  const toggleInterest = (interestId: string) => {
    const newInterests = preferences.interests.includes(interestId)
      ? preferences.interests.filter((i) => i !== interestId)
      : [...preferences.interests, interestId];
    onPreferencesChange({ ...preferences, interests: newInterests });
  };

  const selectTravelStyle = (style: string) => {
    onPreferencesChange({ ...preferences, travelStyle: style });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Tell us about yourself</h2>
        <p className="text-muted-foreground">Help us personalize your experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What are your travel interests?</CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interests.map((interest) => {
              const Icon = interest.icon;
              const isSelected = preferences.interests.includes(interest.id);
              return (
                <Badge
                  key={interest.id}
                  variant={isSelected ? "default" : "outline"}
                  className="justify-start gap-2 cursor-pointer py-3 px-4 hover:bg-accent transition-colors"
                  onClick={() => toggleInterest(interest.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{interest.label}</span>
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What's your travel style?</CardTitle>
          <CardDescription>Choose one that fits you best</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {travelStyles.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  preferences.travelStyle === style.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => selectTravelStyle(style.id)}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground">{style.label}</h4>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
