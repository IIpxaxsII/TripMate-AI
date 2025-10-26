import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Calendar, MapPin, MoreVertical, Edit, Trash, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const Trips = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const upcomingTrips = [
    { id: 1, name: "Paris Adventure", destination: "Paris, France", startDate: "2025-11-15", endDate: "2025-11-22", status: "confirmed" },
    { id: 2, name: "Tokyo Discovery", destination: "Tokyo, Japan", startDate: "2025-12-01", endDate: "2025-12-10", status: "draft" },
  ];

  const pastTrips = [
    { id: 3, name: "Bali Retreat", destination: "Bali, Indonesia", startDate: "2025-08-10", endDate: "2025-08-20", status: "completed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-accent text-accent-foreground";
      case "draft": return "bg-muted text-muted-foreground";
      case "completed": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted";
    }
  };

  const TripCard = ({ trip }: { trip: any }) => (
    <Card className="p-4 hover-scale cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{trip.name}</h3>
            <Badge className={getStatusColor(trip.status)}>
              {trip.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{trip.destination}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span>
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/itinerary/${trip.id}`}>View Itinerary</Link>
        </Button>
      </div>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Trips</h1>
            <p className="text-muted-foreground">Manage your travel plans</p>
          </div>
          <Button asChild>
            <Link to="/plan">
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Trips Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingTrips.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastTrips.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No upcoming trips</p>
                <Button asChild>
                  <Link to="/plan">Plan Your First Trip</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastTrips.length > 0 ? (
              pastTrips.map(trip => <TripCard key={trip.id} trip={trip} />)
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No past trips</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Trips;
