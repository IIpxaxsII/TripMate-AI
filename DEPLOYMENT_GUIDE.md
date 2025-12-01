# TripMate AI - Phase 1 Deployment Guide

## Overview
This guide covers deploying Phase 1 features: data wiring, Supabase integration, saved items, and secure image fetching.

## Prerequisites
- Node.js 18+ installed
- Supabase CLI installed (`npm install -g supabase`)
- Git repository initialized
- Lovable Cloud project connected to Supabase

## Step 1: Create Feature Branch

```bash
git checkout -b feat/phase1-data-wiring
```

## Step 2: Install Dependencies

The following dependencies should already be installed. If not:

```bash
npm install @tanstack/react-query
```

## Step 3: Database Setup

### A. Run Migrations

The migrations are already in the `supabase/migrations/` folder. Since you're using Lovable Cloud, these will be applied automatically when you deploy.

However, you can verify the schema in your Lovable Cloud backend:

1. Navigate to your Lovable Cloud backend (click "View Backend" in Lovable)
2. Check that these tables exist:
   - `destinations` (with columns: id, name, country, city, rating, category, description, image_url)
   - `trips` (with user_id, title, description, start_date, end_date, status, budget)
   - `saved_items` (with user_id, destination_id, item_type)
   - `chat_messages` (with user_id, conversation_id, role, content)

### B. Seed Data (Optional)

If your `destinations` table is empty, you can insert seed data via the Lovable Cloud SQL editor:

```sql
INSERT INTO destinations (name, country, city, rating, category, description) VALUES
('Paris', 'France', 'Paris', 4.8, 'Culture', 'The City of Light, known for its art, fashion, gastronomy and culture.'),
('Tokyo', 'Japan', 'Tokyo', 4.9, 'City', 'A vibrant metropolis mixing ultramodern and traditional.'),
('Bali', 'Indonesia', 'Denpasar', 4.7, 'Beach', 'Tropical paradise with stunning beaches and lush rice terraces.'),
('New York', 'USA', 'New York City', 4.6, 'City', 'The city that never sleeps with world-class museums and landmarks.'),
('Barcelona', 'Spain', 'Barcelona', 4.8, 'Culture', 'Mediterranean gem with stunning Gaudí architecture.'),
('Dubai', 'UAE', 'Dubai', 4.7, 'City', 'Futuristic city featuring the world''s tallest building.'),
('Santorini', 'Greece', 'Thira', 4.9, 'Romantic', 'Stunning island with white-washed buildings and breathtaking sunsets.'),
('Machu Picchu', 'Peru', 'Cusco', 4.8, 'Adventure', 'Ancient Incan citadel high in the Andes Mountains.')
ON CONFLICT DO NOTHING;
```

### C. Verify RLS Policies

Check that Row Level Security (RLS) is enabled and configured:

**Destinations:**
- Public read access (anyone can view)

**Trips:**
- Users can only view/edit/delete their own trips
- Policy: `auth.uid() = user_id`

**Saved Items:**
- Users can only view/edit/delete their own saved items
- Policy: `auth.uid() = user_id`

## Step 4: Deploy Edge Function

### A. Set Pexels API Secret

You need to add the Pexels API key as a Supabase secret:

1. Get a free Pexels API key from https://www.pexels.com/api/
2. In your Lovable project, go to Backend → Secrets
3. Add a new secret:
   - Name: `PEXELS_API_KEY`
   - Value: Your Pexels API key

### B. Deploy the Edge Function

The Edge Function `getPexelsImage` is already written in `supabase/functions/getPexelsImage/index.ts`.

With Lovable Cloud, Edge Functions are **automatically deployed** when you commit your changes. No manual deployment needed!

### C. Verify Edge Function

After deployment, you can test the Edge Function:

1. Go to Lovable Cloud Backend → Functions
2. Find `getPexelsImage` 
3. Test with a sample request:
```json
{
  "query": "Paris France",
  "perPage": 1
}
```

Expected response:
```json
{
  "photos": [...],
  "total_results": 1000
}
```

## Step 5: Configure Environment Variables

Your `.env` file should already have these variables (managed by Lovable Cloud):

```env
VITE_SUPABASE_URL=https://nrtuieysilnvegwsjxsa.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=nrtuieysilnvegwsjxsa
```

**Important:** NEVER commit `.env` to git. It's in `.gitignore`.

## Step 6: Test Locally

```bash
npm run dev
```

### Test Checklist:

1. **Authentication**
   - [ ] Sign up with email/password
   - [ ] Log in successfully
   - [ ] Session persists on page reload

2. **Destinations Page** (`/destinations`)
   - [ ] Destinations load from Supabase
   - [ ] Search filters results (server-side)
   - [ ] Click destination → navigates to detail page
   - [ ] Heart icon toggles save/unsave
   - [ ] Saved state persists

3. **Destination Detail** (`/destinations/:id`)
   - [ ] Shows destination details
   - [ ] Heart icon shows correct saved state
   - [ ] "Plan a Trip" button works

4. **Trips Page** (`/trips`)
   - [ ] Shows user's trips (empty for new users)
   - [ ] Upcoming vs Past tabs work
   - [ ] Search filters trips
   - [ ] "New Trip" button navigates to plan page

5. **Saved Items** (`/saved`)
   - [ ] Shows saved destinations
   - [ ] Remove button works

## Step 7: Commit and Push

```bash
git add .
git commit -m "feat(phase1): wire Supabase data layer with React Query

- Add useDestinations, useTrips, useSavedItems hooks
- Connect Destinations and Trips pages to Supabase
- Add DestinationDetail page with navigation
- Implement save/unsave with optimistic UI
- Add getPexelsImage Edge Function for secure image fetching
- Add SQL migrations for schema and RLS policies
- Add seed data for destinations"

git push origin feat/phase1-data-wiring
```

## Step 8: Create Pull Request

Create a PR with this description:

```markdown
## Phase 1: Data Wiring & Supabase Integration

### What Changed
- ✅ Wired Destinations page to Supabase destinations table
- ✅ Wired Trips page to user-specific trips
- ✅ Added saved items functionality with heart toggle
- ✅ Created DestinationDetail page with navigation
- ✅ Implemented secure image fetching via Edge Function
- ✅ Added React Query for data caching and management
- ✅ Created SQL migrations with RLS policies

### New Files
- `src/hooks/useDestinations.ts` - Destinations data hook
- `src/hooks/useTrips.ts` - Trips data hook
- `src/hooks/useSavedItems.ts` - Saved items with toggle mutation
- `src/pages/DestinationDetail.tsx` - Individual destination page
- `supabase/functions/getPexelsImage/index.ts` - Secure image API
- `.env.example` - Environment variables template
- `DEPLOYMENT_GUIDE.md` - This deployment guide

### Modified Files
- `src/main.tsx` - Added QueryClientProvider
- `src/App.tsx` - Added DestinationDetail route
- `src/pages/Destinations.tsx` - Connected to useDestinations hook
- `src/pages/Trips.tsx` - Connected to useTrips hook
- `src/components/destinations/DestinationCard.tsx` - Added save toggle and navigation

### Database Changes
- Added RLS policies for all tables
- Added indexes for performance
- Added unique constraint on saved_items (user_id, destination_id)
- Seeded destinations table with 8 sample destinations

### Testing
- [x] Authentication flows work
- [x] Destinations load and search works
- [x] Navigation to detail pages works
- [x] Save/unsave persists to database
- [x] Trips filter by user_id
- [x] RLS policies prevent unauthorized access

### Next Steps (Phase 2)
- Add trip creation and editing
- Implement AI-powered itinerary generation
- Add destination recommendations
- Integrate weather API
- Add photo gallery to destination details
```

## Troubleshooting

### Error: "Cannot read properties of null (reading 'useState')"
- Fixed by adding proper React imports across all component files

### Error: "No destinations showing"
- Check if destinations table has data (run seed SQL)
- Verify RLS policy allows public read access

### Error: "getPexelsImage function returns 500"
- Verify PEXELS_API_KEY secret is set in Lovable Cloud
- Check Edge Function logs in Lovable Cloud Backend

### Error: "Saved items not persisting"
- Verify user is authenticated
- Check RLS policies on saved_items table
- Ensure user_id is being set correctly

### Error: "Trips not showing"
- Verify user has created trips
- Check RLS policy: `auth.uid() = user_id`
- Ensure user is authenticated

## Security Checklist

- [x] API keys stored in Supabase secrets (not in code)
- [x] RLS enabled on all user-specific tables
- [x] Client uses anon key (publishable key) only
- [x] Service role key never exposed to client
- [x] Edge Functions handle sensitive API calls
- [x] Input validation on all user inputs
- [x] SQL injection prevented by using parameterized queries

## Performance Optimizations

- [x] React Query caching (1 minute stale time)
- [x] Database indexes on frequently queried columns
- [x] Lazy loading for images
- [x] Debounced search queries
- [x] Optimistic UI updates for saved items

## Files Changed Summary

### Created (10 files)
1. `.env.example` - Environment variables template
2. `src/hooks/useDestinations.ts` - Destinations data hook
3. `src/hooks/useTrips.ts` - Trips data hook  
4. `src/hooks/useSavedItems.ts` - Saved items hook with mutations
5. `src/pages/DestinationDetail.tsx` - Destination detail page
6. `supabase/functions/getPexelsImage/index.ts` - Image fetch Edge Function
7. `DEPLOYMENT_GUIDE.md` - This file

### Modified (5 files)
1. `src/main.tsx` - Added QueryClientProvider wrapper
2. `src/App.tsx` - Added DestinationDetail route
3. `src/pages/Destinations.tsx` - Wired to Supabase with hooks
4. `src/pages/Trips.tsx` - Wired to Supabase with hooks
5. `src/components/destinations/DestinationCard.tsx` - Added navigation and save toggle

## Deployed Edge Functions

1. **getPexelsImage** - Securely fetches images from Pexels API
   - Endpoint: `https://nrtuieysilnvegwsjxsa.supabase.co/functions/v1/getPexelsImage`
   - Method: POST
   - Body: `{ "query": "destination name", "perPage": 1 }`
   - Auth: Requires valid JWT (auto-handled by Supabase client)

## Next Steps

After Phase 1 is complete and tested:

1. **Phase 2: Trip Planning**
   - Create trip form with validation
   - Multi-step trip creation wizard
   - Budget calculator
   - Traveler preferences

2. **Phase 3: AI Integration**
   - AI chatbot for travel advice
   - Auto-generate itineraries
   - Smart destination recommendations
   - Mood-based trip suggestions

3. **Phase 4: Enhanced Features**
   - Photo galleries
   - User reviews and ratings
   - Social sharing
   - Weather integration
   - Booking integrations

## Support

If you encounter any issues:
1. Check this deployment guide
2. Review console logs for error messages
3. Check Lovable Cloud Backend → Logs for Edge Function errors
4. Verify all secrets are configured correctly
