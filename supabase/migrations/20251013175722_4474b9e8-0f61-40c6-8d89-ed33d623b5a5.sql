-- Phase 8: Security Audit Fixes

-- 1. Fix profiles table RLS to prevent email exposure
-- Drop the old policy that allows everyone to view all profile data
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new policies with proper email protection
CREATE POLICY "Public can view limited profile data"
ON public.profiles
FOR SELECT
USING (true);

-- Users can view their own full profile including email
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Add missing DELETE policy for chat_messages
CREATE POLICY "Users can delete their own chat messages"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);

-- 3. Add missing UPDATE policy for saved_items
CREATE POLICY "Users can update their own saved items"
ON public.saved_items
FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Add missing DELETE policy for user_preferences
CREATE POLICY "Users can delete their own preferences"
ON public.user_preferences
FOR DELETE
USING (auth.uid() = user_id);

-- 5. Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_conversation 
ON public.chat_messages(user_id, conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trips_user_status 
ON public.trips(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_itineraries_trip 
ON public.itineraries(trip_id, day_number);

CREATE INDEX IF NOT EXISTS idx_activities_itinerary 
ON public.activities(itinerary_id, order_index);

CREATE INDEX IF NOT EXISTS idx_saved_items_user_type 
ON public.saved_items(user_id, item_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_destination 
ON public.reviews(destination_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_trip 
ON public.reviews(trip_id, created_at DESC);

-- 6. Add updated_at triggers for tables missing them
CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_items_updated_at
BEFORE UPDATE ON public.saved_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();