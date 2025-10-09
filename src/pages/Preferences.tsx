import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Preferences = () => {
  const { toast } = useToast();
  const [interests, setInterests] = useState<string[]>(["Culture", "Food", "Nature"]);
  const [budgetRange, setBudgetRange] = useState([1000, 5000]);
  const [travelStyle, setTravelStyle] = useState("balanced");

  const interestOptions = [
    "Adventure", "Culture", "Food", "Nature", "Shopping",
    "Nightlife", "Relaxation", "Photography", "History", "Beach",
    "Wildlife", "Architecture", "Sports", "Art", "Music"
  ];

  const travelStyles = [
    { id: "budget", name: "Budget Traveler", description: "Value-conscious, local experiences" },
    { id: "balanced", name: "Balanced", description: "Mix of comfort and adventure" },
    { id: "luxury", name: "Luxury", description: "Premium experiences and comfort" },
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your travel preferences have been updated successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Travel Preferences</h1>
            <p className="text-muted-foreground">
              Customize your travel recommendations
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Interests */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Interests</h2>
            <p className="text-sm text-muted-foreground">
              Select your travel interests to get personalized recommendations
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <Badge
                key={interest}
                variant={interests.includes(interest) ? "default" : "outline"}
                className="cursor-pointer hover-scale text-sm py-2 px-4"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Travel Style */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Travel Style</h2>
            <p className="text-sm text-muted-foreground">
              How do you prefer to travel?
            </p>
          </div>

          <div className="grid gap-3">
            {travelStyles.map((style) => (
              <div
                key={style.id}
                onClick={() => setTravelStyle(style.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary ${
                  travelStyle === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{style.name}</h3>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      travelStyle === style.id
                        ? "border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {travelStyle === style.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Budget Range */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Budget Range</h2>
            <p className="text-sm text-muted-foreground">
              Typical budget per trip (USD)
            </p>
          </div>

          <div className="space-y-4">
            <Slider
              value={budgetRange}
              onValueChange={setBudgetRange}
              min={500}
              max={10000}
              step={100}
              className="py-4"
            />
            <div className="flex justify-between text-sm">
              <span className="font-medium">${budgetRange[0].toLocaleString()}</span>
              <span className="font-medium">${budgetRange[1].toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Accessibility & Special Needs */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Accessibility & Special Needs</h2>
            <p className="text-sm text-muted-foreground">
              Help us tailor recommendations to your needs
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="wheelchair" className="flex-1">
                Wheelchair Accessible
              </Label>
              <Switch id="wheelchair" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dietary" className="flex-1">
                Dietary Restrictions
              </Label>
              <Switch id="dietary" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="family" className="flex-1">
                Family-Friendly Options
              </Label>
              <Switch id="family" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="pet" className="flex-1">
                Pet-Friendly Accommodations
              </Label>
              <Switch id="pet" />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Preferences;
