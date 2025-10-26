import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  MapPin, Clock, DollarSign, Edit, Share2, Download, 
  Plus, CheckCircle2, Circle, ChevronDown, ChevronUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Itinerary = () => {
  const { tripId } = useParams();
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const trip = {
    name: "Paris Adventure",
    destination: "Paris, France",
    dates: "Nov 15 - Nov 22, 2025",
    budget: 3500,
    spent: 1250,
  };

  const itinerary = [
    {
      day: 1,
      date: "Nov 15, 2025",
      activities: [
        { time: "9:00 AM", title: "Arrive at Charles de Gaulle Airport", location: "CDG Airport", duration: "2h", completed: true },
        { time: "12:00 PM", title: "Check-in at Hotel", location: "Le Marais District", duration: "1h", completed: true },
        { time: "2:00 PM", title: "Lunch at Local Café", location: "Café de Flore", duration: "1.5h", completed: false },
        { time: "4:00 PM", title: "Walk along Seine River", location: "Seine Riverbank", duration: "2h", completed: false },
      ]
    },
    {
      day: 2,
      date: "Nov 16, 2025",
      activities: [
        { time: "9:00 AM", title: "Visit Eiffel Tower", location: "Champ de Mars", duration: "3h", completed: false },
        { time: "1:00 PM", title: "Lunch at Bistro", location: "7th Arrondissement", duration: "1.5h", completed: false },
        { time: "3:00 PM", title: "Explore Louvre Museum", location: "Louvre", duration: "4h", completed: false },
      ]
    },
    {
      day: 3,
      date: "Nov 17, 2025",
      activities: [
        { time: "10:00 AM", title: "Visit Notre-Dame", location: "Île de la Cité", duration: "2h", completed: false },
        { time: "2:00 PM", title: "Shopping at Champs-Élysées", location: "8th Arrondissement", duration: "3h", completed: false },
      ]
    },
  ];

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleDragStart = (activityId: number) => {
    setDraggedItem(activityId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    toast({
      title: "Activity reordered",
      description: "Your itinerary has been updated"
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{trip.dates}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Budget Tracker */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Budget Tracker
              </h3>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">${trip.spent} / ${trip.budget}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${(trip.spent / trip.budget) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                ${trip.budget - trip.spent} remaining
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="itinerary" className="flex-1">Daily Itinerary</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="space-y-4">
            {/* Daily Timeline */}
            {itinerary.map((dayData) => (
              <Card key={dayData.day} className="overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/5 transition-colors"
                  onClick={() => toggleDay(dayData.day)}
                >
                  <div>
                    <h3 className="font-semibold">Day {dayData.day}</h3>
                    <p className="text-sm text-muted-foreground">{dayData.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">
                      {dayData.activities.length} activities
                    </Badge>
                    {expandedDays.includes(dayData.day) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedDays.includes(dayData.day) && (
                  <div className="border-t p-4 space-y-4">
                    {dayData.activities.map((activity, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {activity.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          {idx < dayData.activities.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border my-2" />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <p className="text-sm text-muted-foreground">{activity.time}</p>
                              <h4 className={cn(
                                "font-medium",
                                activity.completed && "line-through text-muted-foreground"
                              )}>
                                {activity.title}
                              </h4>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {activity.duration}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Add Activity
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Trip Notes</h3>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">Remember to book restaurant reservations at least 2 days in advance.</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">Metro pass can be purchased at any station - get the week pass for best value.</p>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Add Note
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Itinerary;
