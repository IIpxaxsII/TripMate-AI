// Simple analytics tracking utility
// Logs events to console and optionally posts to /api/track

export function trackEvent(name: string, props?: Record<string, unknown>) {
  try {
    // Log to console for debugging
    console.log('[track]', name, props || {});
    
    // Non-blocking POST to tracking endpoint (if available)
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({ 
        name, 
        props,
        timestamp: new Date().toISOString() 
      }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {
      // Silently ignore tracking failures
    });
  } catch {
    // Silently ignore any tracking errors
  }
}
