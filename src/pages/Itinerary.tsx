import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useItineraries, useGenerateItinerary, useAddActivity, useDeleteActivity } from "@/hooks/useItineraries";
import { useHotelSearch, type Hotel } from "@/hooks/useHotelSearch";
import { useCreateBooking } from "@/hooks/useBookings";
import { useCurrency } from "@/hooks/useCurrency";
import { 
  MapPin, Clock, DollarSign, Edit, Share2, Download, 
  Plus, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Sparkles, Loader2, Hotel as HotelIcon, Star, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Itinerary = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [showHotels, setShowHotels] = useState(false);
  const [newActivityDay, setNewActivityDay] = useState<string | null>(null);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityLocation, setNewActivityLocation] = useState("");
  const [newActivityTime, setNewActivityTime] = useState("");

  // Currency formatting
  const { format: formatCurrency } = useCurrency();

  // Fetch trip data
  const { data: trip, isLoading: tripLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });

  // Fetch itineraries
  const { data: itineraries = [], isLoading: itinerariesLoading } = useItineraries(tripId || '');
  
  // Generate itinerary mutation
  const generateItinerary = useGenerateItinerary();
  
  // Activity mutations
  const addActivity = useAddActivity();
  const deleteActivity = useDeleteActivity();

  // Hotel search
  const { data: hotelData, isLoading: hotelsLoading } = useHotelSearch(
    showHotels && trip ? {
      destination: trip.title,
      checkin: trip.start_date || undefined,
      checkout: trip.end_date || undefined,
    } : null
  );

  // Booking mutation
  const createBooking = useCreateBooking();

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleGenerateItinerary = () => {
    if (!trip) return;
    generateItinerary.mutate({ trip });
  };

  const handleAddActivity = (itineraryId: string) => {
    if (!newActivityTitle) return;
    
    addActivity.mutate({
      itineraryId,
      activity: {
        title: newActivityTitle,
        location: newActivityLocation || null,
        start_time: newActivityTime || null,
        order_index: 0,
      },
    });
    
    setNewActivityTitle("");
    setNewActivityLocation("");
    setNewActivityTime("");
    setNewActivityDay(null);
  };

  const handleBookHotel = (hotel: Hotel) => {
    if (!tripId) return;
    
    createBooking.mutate({
      trip_id: tripId,
      provider: hotel.provider,
      provider_booking_id: hotel.id,
      hotel_name: hotel.name,
      amount: hotel.price,
      currency: 'USD',
      check_in: trip?.start_date || undefined,
      check_out: trip?.end_date || undefined,
    });
  };

  if (tripLoading || !tripId) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!trip) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
          <p className="text-muted-foreground mb-4">This trip doesn't exist or you don't have access to it.</p>
          <Button asChild>
            <Link to="/trips">Back to Trips</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const budgetSpent = 0; // TODO: Calculate from activities and bookings

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {trip.description && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.description.split('\n')[0]}</span>
                  </div>
                )}
                {trip.start_date && trip.end_date && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
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
          {trip.budget && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Budget Tracker
                </h3>
                <Badge variant="secondary" className="text-xs">All amounts in INR (₹)</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">{formatCurrency(budgetSpent, 'USD')} / {formatCurrency(trip.budget, 'USD')}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${(budgetSpent / (trip.budget || 1)) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency((trip.budget || 0) - budgetSpent, 'USD')} remaining
                </div>
              </div>
            </Card>
          )}

          {/* Generate Itinerary Button */}
          <Button 
            onClick={handleGenerateItinerary}
            disabled={generateItinerary.isPending || !trip.start_date || !trip.end_date}
            className="w-full sm:w-auto"
          >
            {generateItinerary.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Itinerary
              </>
            )}
          </Button>
          {(!trip.start_date || !trip.end_date) && (
            <p className="text-sm text-muted-foreground">
              Set trip dates to generate an AI itinerary
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="itinerary" className="flex-1">Daily Itinerary</TabsTrigger>
            <TabsTrigger value="hotels" className="flex-1" onClick={() => setShowHotels(true)}>
              <HotelIcon className="w-4 h-4 mr-2" />
              Hotels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="space-y-4">
            {itinerariesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </Card>
              ))
            ) : itineraries.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No itinerary yet</p>
                <p className="text-sm text-muted-foreground">
                  Click "Generate AI Itinerary" to create a personalized travel plan
                </p>
              </Card>
            ) : (
              itineraries.map((dayData) => (
                <Card key={dayData.id} className="overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => toggleDay(dayData.day_number)}
                  >
                    <div>
                      <h3 className="font-semibold">Day {dayData.day_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dayData.date ? format(new Date(dayData.date), 'MMM d, yyyy') : 'Date TBD'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {dayData.activities?.length || 0} activities
                      </Badge>
                      {expandedDays.includes(dayData.day_number) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {expandedDays.includes(dayData.day_number) && (
                    <div className="border-t p-4 space-y-4">
                      {dayData.activities?.map((activity, idx) => (
                        <div key={activity.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            {idx < (dayData.activities?.length || 0) - 1 && (
                              <div className="w-0.5 flex-1 bg-border my-2" />
                            )}
                          </div>
                          
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                {activity.start_time && (
                                  <p className="text-sm text-muted-foreground">{activity.start_time}</p>
                                )}
                                <h4 className="font-medium">{activity.title}</h4>
                                {activity.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => deleteActivity.mutate(activity.id)}
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </div>
                            {activity.location && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {newActivityDay === dayData.id ? (
                        <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                          <Input
                            placeholder="Activity title"
                            value={newActivityTitle}
                            onChange={(e) => setNewActivityTitle(e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Time (e.g., 9:00 AM)"
                              value={newActivityTime}
                              onChange={(e) => setNewActivityTime(e.target.value)}
                            />
                            <Input
                              placeholder="Location"
                              value={newActivityLocation}
                              onChange={(e) => setNewActivityLocation(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAddActivity(dayData.id)}
                              disabled={!newActivityTitle}
                            >
                              Add
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setNewActivityDay(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          onClick={() => setNewActivityDay(dayData.id)}
                        >
                          <Plus className="w-4 h-4" />
                          Add Activity
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="hotels" className="space-y-4">
            {hotelsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))
            ) : hotelData?.hotels && hotelData.hotels.length > 0 ? (
              hotelData.hotels.map((hotel) => (
                <Card key={hotel.id} className="p-4">
                  <div className="flex gap-4">
                    <img 
                      src={hotel.image_url} 
                      alt={hotel.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{hotel.location}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{formatCurrency(hotel.price, 'USD')}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hotel.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        className="mt-3"
                        onClick={() => handleBookHotel(hotel)}
                        disabled={createBooking.isPending}
                      >
                        {createBooking.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Book Now'
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <HotelIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {showHotels ? 'No hotels found' : 'Click to search for hotels'}
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Itinerary;
