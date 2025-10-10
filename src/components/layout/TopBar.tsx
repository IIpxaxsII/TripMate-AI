import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const navigate = useNavigate();
  const unreadCount = 2;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary">TripMate AI</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground relative"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="w-5 h-5" />
            <NotificationBadge count={unreadCount} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
