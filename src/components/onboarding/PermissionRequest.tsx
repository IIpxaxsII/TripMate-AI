import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PermissionRequest = () => {
  const { toast } = useToast();

  const requestLocation = async () => {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      if (permission.state === "granted") {
        toast({ title: "Location access granted" });
      } else {
        navigator.geolocation.getCurrentPosition(
          () => toast({ title: "Location access granted" }),
          () => toast({ title: "Location access denied", variant: "destructive" })
        );
      }
    } catch {
      toast({ title: "Location permission not available", variant: "destructive" });
    }
  };

  const requestNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast({ title: "Notifications enabled" });
      } else {
        toast({ title: "Notifications denied", variant: "destructive" });
      }
    } catch {
      toast({ title: "Notifications not available", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Enable features</h2>
        <p className="text-muted-foreground">Get the most out of TripMate AI</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Location Services</CardTitle>
                <CardDescription className="mt-1">
                  Get personalized recommendations based on your location and discover nearby attractions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={requestLocation} className="w-full">
              Enable Location
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Notifications</CardTitle>
                <CardDescription className="mt-1">
                  Receive travel alerts, reminders, and updates about your trips
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={requestNotifications} className="w-full">
              Enable Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        You can change these permissions anytime in your device settings
      </p>
    </div>
  );
};
