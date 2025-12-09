/**
 * Offline queue for TripMate AI
 * Stores actions when offline and syncs when back online
 */

interface QueuedAction {
  id: string;
  type: 'create_trip' | 'update_trip' | 'save_destination' | 'unsave_destination';
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'tripmate_offline_queue';
const MAX_RETRIES = 3;

export function getQueue(): QueuedAction[] {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedAction[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueueAction(
  type: QueuedAction['type'],
  payload: Record<string, unknown>
): string {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const action: QueuedAction = {
    id,
    type,
    payload,
    timestamp: Date.now(),
    retries: 0,
  };
  
  const queue = getQueue();
  queue.push(action);
  saveQueue(queue);
  
  console.log('[Offline Queue] Action enqueued:', type, id);
  return id;
}

export function removeFromQueue(id: string): void {
  const queue = getQueue().filter(action => action.id !== id);
  saveQueue(queue);
}

export function incrementRetry(id: string): boolean {
  const queue = getQueue();
  const action = queue.find(a => a.id === id);
  
  if (action) {
    action.retries += 1;
    if (action.retries >= MAX_RETRIES) {
      // Remove after max retries
      saveQueue(queue.filter(a => a.id !== id));
      console.warn('[Offline Queue] Max retries reached, removing action:', id);
      return false;
    }
    saveQueue(queue);
    return true;
  }
  return false;
}

export function getQueueLength(): number {
  return getQueue().length;
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}
