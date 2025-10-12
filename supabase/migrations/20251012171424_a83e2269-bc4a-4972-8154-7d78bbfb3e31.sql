-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  category TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itineraries table
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL,
  date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  start_time TIME,
  end_time TIME,
  location TEXT,
  cost DECIMAL(10, 2),
  booking_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  interests TEXT[],
  budget_range TEXT,
  travel_style TEXT,
  accessibility_needs TEXT[],
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved items table
CREATE TABLE public.saved_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('destination', 'trip', 'activity')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id),
  UNIQUE(user_id, trip_id)
);

-- Create chat messages table for AI conversations
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for destinations (public read, admin write)
CREATE POLICY "Destinations are viewable by everyone"
  ON public.destinations FOR SELECT
  USING (true);

-- RLS Policies for itineraries
CREATE POLICY "Users can view itineraries for their trips"
  ON public.itineraries FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can create itineraries for their trips"
  ON public.itineraries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can update itineraries for their trips"
  ON public.itineraries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()));

CREATE POLICY "Users can delete itineraries for their trips"
  ON public.itineraries FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()));

-- RLS Policies for activities
CREATE POLICY "Users can view activities for their itineraries"
  ON public.activities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.itineraries 
    JOIN public.trips ON trips.id = itineraries.trip_id 
    WHERE itineraries.id = activities.itinerary_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can create activities for their itineraries"
  ON public.activities FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.itineraries 
    JOIN public.trips ON trips.id = itineraries.trip_id 
    WHERE itineraries.id = activities.itinerary_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update activities for their itineraries"
  ON public.activities FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.itineraries 
    JOIN public.trips ON trips.id = itineraries.trip_id 
    WHERE itineraries.id = activities.itinerary_id AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete activities for their itineraries"
  ON public.activities FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.itineraries 
    JOIN public.trips ON trips.id = itineraries.trip_id 
    WHERE itineraries.id = activities.itinerary_id AND trips.user_id = auth.uid()
  ));

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for saved_items
CREATE POLICY "Users can view their own saved items"
  ON public.saved_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved items"
  ON public.saved_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved items"
  ON public.saved_items FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_itineraries_trip_id ON public.itineraries(trip_id);
CREATE INDEX idx_activities_itinerary_id ON public.activities(itinerary_id);
CREATE INDEX idx_reviews_destination_id ON public.reviews(destination_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX idx_chat_messages_user_conversation ON public.chat_messages(user_id, conversation_id);
CREATE INDEX idx_destinations_category ON public.destinations(category);

-- Triggers for updated_at
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for collaborative features
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.itineraries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;