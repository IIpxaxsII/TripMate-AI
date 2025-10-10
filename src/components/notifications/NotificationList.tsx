import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Calendar, Info, Trash2 } from "lucide-react";
import type { Notification } from "@/pages/Notifications";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NotificationList = ({ notifications, onMarkAsRead, onDelete }: NotificationListProps) => {
  const getIcon = (category: Notification["category"]) => {
    switch (category) {
      case "trip":
        return <Bell className="h-5 w-5 text-primary" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-secondary" />;
      case "reminder":
        return <Calendar className="h-5 w-5 text-accent" />;
      case "update":
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No notifications</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 transition-all ${
            !notification.read ? "border-primary/50 bg-primary/5" : ""
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {getIcon(notification.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm">{notification.title}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {notification.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <div className="flex gap-2 mt-3">
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
