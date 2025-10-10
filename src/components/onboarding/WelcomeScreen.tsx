import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Bot, Map, Heart } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Bot,
    title: "AI Travel Assistant",
    description: "Get personalized recommendations from your AI travel coach",
  },
  {
    icon: Map,
    title: "Smart Itineraries",
    description: "Auto-generated trip plans tailored to your preferences",
  },
  {
    icon: Heart,
    title: "Mood-Based Suggestions",
    description: "Find destinations that match your current travel mood",
  },
];

export const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-scale-in">
            <Plane className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Welcome to TripMate AI</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your personal AI-powered travel planning assistant
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-2 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="pt-6 space-y-2">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button size="lg" onClick={onGetStarted} className="mt-8">
        Get Started
      </Button>
    </div>
  );
};
