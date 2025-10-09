import { Bookmark, Settings, HelpCircle, Share2, MessageSquare, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col gap-1 mt-6">
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
      </SheetContent>
    </Sheet>
  );
};
