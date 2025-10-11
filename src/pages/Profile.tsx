import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Award, Settings as SettingsIcon, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  full_name: string;
  email: string;
  location: string;
  bio: string;
  travel_style: string;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{profile?.full_name || 'User'}</h1>
                <p className="text-muted-foreground">{profile?.email || user?.email}</p>
                {profile?.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2 justify-center sm:justify-start">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 justify-center sm:justify-start">
                  <Calendar className="w-4 h-4" />
                  Member since {profile?.created_at ? formatDate(profile.created_at) : 'Recently'}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/profile/edit"
                  className="h-10 w-10 rounded-md bg-background hover:bg-accent flex items-center justify-center border"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <Link
                  to="/settings"
                  className="h-10 w-10 rounded-md bg-background hover:bg-accent flex items-center justify-center border"
                >
                  <SettingsIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {profile?.bio && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trips Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Countries Visited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Travel Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{profile?.travel_style || 'Not set'}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Complete your first trip to unlock achievements!</p>
            </div>
          </CardContent>
        </Card>

        {/* Travel Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Travel Preferences</CardTitle>
              <Link
                to="/preferences"
                className="text-sm text-primary hover:underline"
              >
                Manage
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customize your travel preferences to get personalized recommendations
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
