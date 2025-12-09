import React, { useEffect, useCallback } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { getQueue, removeFromQueue, incrementRetry, getQueueLength } from '@/utils/offlineQueue';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const syncQueue = useCallback(async () => {
    const queue = getQueue();
    if (queue.length === 0) return;

    console.log('[Offline Sync] Starting sync of', queue.length, 'actions');
    
    let successCount = 0;
    let failCount = 0;

    for (const action of queue) {
      try {
        switch (action.type) {
          case 'create_trip': {
            const { error } = await supabase
              .from('trips')
              .insert(action.payload as any);
            if (error) throw error;
            break;
          }
          case 'update_trip': {
            const { id, ...updates } = action.payload as { id: string };
            const { error } = await supabase
              .from('trips')
              .update(updates)
              .eq('id', id);
            if (error) throw error;
            break;
          }
          case 'save_destination': {
            const { error } = await supabase
              .from('saved_items')
              .insert(action.payload as any);
            if (error) throw error;
            break;
          }
          case 'unsave_destination': {
            const { user_id, destination_id } = action.payload as { user_id: string; destination_id: string };
            const { error } = await supabase
              .from('saved_items')
              .delete()
              .eq('user_id', user_id)
              .eq('destination_id', destination_id);
            if (error) throw error;
            break;
          }
        }
        
        removeFromQueue(action.id);
        successCount++;
      } catch (error) {
        console.error('[Offline Sync] Failed to sync action:', action.id, error);
        const canRetry = incrementRetry(action.id);
        if (!canRetry) failCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: 'Synced successfully',
        description: `${successCount} offline action${successCount > 1 ? 's' : ''} synced.`,
      });
    }
    
    if (failCount > 0) {
      toast({
        title: 'Sync partially failed',
        description: `${failCount} action${failCount > 1 ? 's' : ''} could not be synced.`,
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && getQueueLength() > 0) {
      syncQueue();
    }
  }, [isOnline, syncQueue]);

  return {
    syncQueue,
    pendingCount: getQueueLength(),
    isOnline,
  };
}
