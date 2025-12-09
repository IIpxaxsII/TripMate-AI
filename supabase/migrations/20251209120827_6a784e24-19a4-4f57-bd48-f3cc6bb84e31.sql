-- Phase 5: AI and External API tracking tables

-- Create ai_requests table for logging AI usage and rate-limiting
CREATE TABLE IF NOT EXISTS public.ai_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  function_name TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for efficient rate-limit queries
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_created ON public.ai_requests(user_id, created_at);

-- Enable RLS on ai_requests
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_requests
CREATE POLICY "Users can view their own AI requests"
  ON public.ai_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI requests"
  ON public.ai_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create external_requests table for logging third-party API calls
CREATE TABLE IF NOT EXISTS public.external_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  api_name TEXT NOT NULL,
  request_payload JSONB,
  response_status INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for external_requests
CREATE INDEX IF NOT EXISTS idx_external_requests_user_created ON public.external_requests(user_id, created_at);

-- Enable RLS on external_requests
ALTER TABLE public.external_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for external_requests
CREATE POLICY "Users can view their own external requests"
  ON public.external_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own external requests"
  ON public.external_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);