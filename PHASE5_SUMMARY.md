# Phase 5: AI Integration & External API Services

## Overview
Phase 5 implements robust AI integration with streaming chat, external API services for flights/hotels, rate limiting, and cost controls.

## Features Implemented

### 1. Streaming AI Chat (`ai-chat-stream`)
- Real-time streaming responses using SSE
- Rate limiting: 50 requests/hour per user
- Message validation (max 20 messages, 4000 chars each)
- Automatic request logging to `ai_requests` table
- Uses Lovable AI Gateway with `google/gemini-2.5-flash` model

### 2. AI Itinerary Generation (`ai-itinerary`)
- Generates structured day-by-day itineraries
- Uses tool calling for reliable JSON output
- Validates trip ownership before generation
- Saves itineraries and activities to database
- Logs usage to `ai_requests` table

### 3. Flight Search (`flights-search`)
- Mock data with realistic flight information
- Ready for Amadeus API integration (set `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET`)
- Logs requests to `external_requests` table

### 4. Hotel Search (updated `hotel-search`)
- Mock data with realistic hotel information
- Ready for real hotel API integration (set `HOTEL_API_KEY`)
- Logs requests to `external_requests` table

## Database Tables Added

### `ai_requests`
Tracks AI API usage for rate limiting and cost monitoring.
- `user_id`: User making the request
- `function_name`: Which AI function was called
- `tokens_used`: Estimated token count
- `cost_estimate`: Estimated cost in USD
- `created_at`: Timestamp

### `external_requests`
Tracks external API calls (flights, hotels).
- `user_id`: User making the request
- `api_name`: Which external API was called
- `request_payload`: Request parameters (JSONB)
- `response_status`: HTTP status code
- `created_at`: Timestamp

## Frontend Updates

### Streaming Chat (`src/pages/Chat.tsx`)
- Real-time token-by-token rendering
- Client-side rate limiting (2 second cooldown)
- Visual streaming indicator (cursor)
- Abort support for canceling requests

### New Hooks
- `useGenerateItinerary`: Generate AI itineraries for trips
- `useFlightSearch`: Search for flights

## Secrets Required

Set these via Supabase Secrets or Cloud settings:

| Secret | Required | Description |
|--------|----------|-------------|
| `LOVABLE_API_KEY` | Auto-configured | Lovable AI Gateway key |
| `AMADEUS_CLIENT_ID` | Optional | Amadeus API client ID |
| `AMADEUS_CLIENT_SECRET` | Optional | Amadeus API client secret |
| `HOTEL_API_KEY` | Optional | Hotel provider API key |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `ai-chat-stream` | 50 requests/hour per user |
| `ai-itinerary` | Logged, no hard limit |
| `flights-search` | No limit (mock data) |
| `hotel-search` | No limit (mock data) |

## Testing

### Test Streaming Chat
```bash
curl -X POST https://<project>.supabase.co/functions/v1/ai-chat-stream \
  -H "Authorization: Bearer <user-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Plan a trip to Paris"}], "conversationId": "test-123"}'
```

### Test Itinerary Generation
```bash
curl -X POST https://<project>.supabase.co/functions/v1/ai-itinerary \
  -H "Authorization: Bearer <user-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"tripId": "<trip-id>", "destination": "Paris", "startDate": "2024-03-01", "endDate": "2024-03-05"}'
```

### Test Flight Search
```bash
curl "https://<project>.supabase.co/functions/v1/flights-search?origin=NYC&destination=Paris&date=2024-03-01"
```

## Known Limitations

1. Flight and hotel searches return mock data until real API keys are configured
2. Token counting is estimated, not exact
3. Cost estimates are rough approximations

## Next Steps (Phase 6+)

- Add real Amadeus API integration
- Implement usage billing dashboard
- Add admin AI usage reporting endpoint
- Implement background sync for offline itinerary generation
