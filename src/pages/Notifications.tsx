import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: "trip" | "alert" | "reminder" | "update";
}

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Trip Starting Soon",
      message: "Your trip to Paris starts in 3 days. Don't forget to check your itinerary!",
      time: "2 hours ago",
      read: false,
      category: "trip"
    },
    {
      id: 2,
      title: "Weather Alert",
      message: "Rain expected in Tokyo during your visit. Pack accordingly!",
      time: "5 hours ago",
      read: false,
      category: "alert"
    },
    {
      id: 3,
      title: "Packing Reminder",
      message: "Don't forget to pack your travel documents and medications",
      time: "1 day ago",
      read: true,
      category: "reminder"
    },
    {
      id: 4,
      title: "New Feature Available",
      message: "Try our new AI-powered mood-based recommendations!",
      time: "2 days ago",
      read: true,
      category: "update"
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All notifications marked as read"
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted"
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification(s)` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="trip">Trips</TabsTrigger>
            <TabsTrigger value="alert">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <NotificationList
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>

          <TabsContent value="unread">
            <NotificationList
              notifications={notifications.filter(n => !n.read)}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>

          <TabsContent value="trip">
            <NotificationList
              notifications={notifications.filter(n => n.category === "trip")}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>

          <TabsContent value="alert">
            <NotificationList
              notifications={notifications.filter(n => n.category === "alert")}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Notifications;
