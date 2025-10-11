import { Bookmark, Settings, HelpCircle, Share2, MessageSquare, LogOut, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HamburgerMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { icon: Bookmark, label: "Saved Items", path: "/saved" },
  { icon: Settings, label: "Travel Preferences", path: "/preferences" },
  { icon: HelpCircle, label: "Help & Support", path: "/help" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Share2, label: "Share App", path: "#" },
  { icon: MessageSquare, label: "Feedback", path: "#" },
];

export const HamburgerMenu = ({ open, onOpenChange }: HamburgerMenuProps) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Slide-in Menu */}
      <div className="fixed right-0 top-0 h-full w-80 bg-background border-l z-50 animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col gap-1 mt-6 px-4">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
          
          <div className="my-4 border-t border-border"></div>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-destructive">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};
