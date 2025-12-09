import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const PushManager = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast({
        title: 'Not supported',
        description: 'Push notifications are not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Request notification permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        toast({
          title: 'Permission denied',
          description: 'Enable notifications in your browser settings.',
          variant: 'destructive',
        });
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      // For now, use a placeholder VAPID key
      // In production, fetch this from your server or environment
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        console.log('VAPID public key not configured, skipping push subscription');
        toast({
          title: 'Notifications enabled',
          description: 'You will receive in-app notifications.',
        });
        setIsSubscribed(true);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      // Save subscription to server
      if (user) {
        await supabase.functions.invoke('save-push-subscription', {
          body: { subscription: subscription.toJSON() },
        });
      }

      setIsSubscribed(true);
      toast({
        title: 'Notifications enabled',
        description: 'You will receive trip reminders and updates.',
      });
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast({
        title: 'Subscription failed',
        description: 'Could not enable notifications. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      toast({
        title: 'Notifications disabled',
        description: 'You will no longer receive push notifications.',
      });
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      toast({
        title: 'Error',
        description: 'Could not disable notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!('Notification' in window)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about trip reminders, travel deals, and updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {permission === 'denied' ? (
          <div className="text-sm text-muted-foreground">
            <BellOff className="h-4 w-4 inline mr-2" />
            Notifications are blocked. Enable them in your browser settings.
          </div>
        ) : isSubscribed ? (
          <Button 
            variant="outline" 
            onClick={unsubscribeFromPush}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Disable Notifications
          </Button>
        ) : (
          <Button 
            onClick={subscribeToPush}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enable Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
