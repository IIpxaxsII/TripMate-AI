/**
 * Web Vitals monitoring for TripMate AI
 * Tracks Core Web Vitals metrics for performance optimization
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }
}

export function initWebVitals() {
  // Cumulative Layout Shift
  onCLS(sendToAnalytics);
  
  // Interaction to Next Paint (replaced FID in web-vitals v4)
  onINP(sendToAnalytics);
  
  // Largest Contentful Paint
  onLCP(sendToAnalytics);
  
  // First Contentful Paint
  onFCP(sendToAnalytics);
  
  // Time to First Byte
  onTTFB(sendToAnalytics);
}
