import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Calendar, Award, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "",
    memberSince: "January 2025",
    location: "San Francisco, CA",
    tripsCount: 12,
    countriesVisited: 8,
  };

  const badges = [
    { name: "Explorer", icon: "🌍", description: "Visited 5+ countries" },
    { name: "Adventurer", icon: "⛰️", description: "Completed 10 trips" },
    { name: "Culture Seeker", icon: "🎨", description: "Museum enthusiast" },
  ];

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" asChild>
              <Link to="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{user.tripsCount}</div>
            <div className="text-sm text-muted-foreground">Trips Completed</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{user.countriesVisited}</div>
            <div className="text-sm text-muted-foreground">Countries Visited</div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className="flex flex-col items-center text-center p-4 rounded-lg bg-accent/10 hover-scale cursor-pointer"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold mb-1">{badge.name}</h3>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Alex" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Johnson" disabled />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={user.location} disabled />
            </div>
          </div>
        </Card>

        {/* Travel Preferences Link */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Travel Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Customize your travel style and interests
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/preferences">Manage</Link>
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
