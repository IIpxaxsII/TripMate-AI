import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { WifiOff, RefreshCw, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const { syncQueue, pendingCount } = useOfflineSync();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 py-2 px-4 text-center text-sm font-medium z-50 transition-colors",
        isOnline 
          ? "bg-secondary text-secondary-foreground" 
          : "bg-destructive text-destructive-foreground"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-3">
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4" aria-hidden="true" />
            <span>You're offline. Changes will sync when you reconnect.</span>
          </>
        ) : pendingCount > 0 ? (
          <>
            <CloudOff className="h-4 w-4" aria-hidden="true" />
            <span>{pendingCount} pending action{pendingCount > 1 ? 's' : ''} to sync</span>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={syncQueue}
              className="h-6 text-xs"
              aria-label="Sync pending changes now"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync Now
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};
