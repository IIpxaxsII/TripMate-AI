import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Globe, Moon, Lock, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
      navigate('/auth');
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </h2>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex-1">
                Push Notifications
              </Label>
              <Switch id="push-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex-1">
                Email Notifications
              </Label>
              <Switch id="email-notifications" />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Language & Region
            </h2>
            
            <div className="flex items-center justify-between">
              <Label>Language</Label>
              <span className="text-sm text-muted-foreground">English</span>
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Currency</Label>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              Appearance
            </h2>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Privacy & Security
            </h2>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="location-services">Location Services</Label>
              <Switch id="location-services" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing">Data Sharing</Label>
              <Switch id="data-sharing" />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Subscription
            </h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">Basic features included</p>
              </div>
              <span className="text-sm text-accent font-medium">Active</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <button
              onClick={handleSignOut}
              className="w-full h-10 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
