-- ==============================================================================
-- VANKAL AYURVEDA — PATIENT AUTHENTICATION & MY BOOKINGS SCHEMA MIGRATION
-- ==============================================================================

-- 1. Add email_normalized column to bookings table and index
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS email_normalized TEXT;

-- Backfill existing patient_email into email_normalized if any
UPDATE public.bookings
  SET email_normalized = LOWER(TRIM(patient_email))
  WHERE patient_email IS NOT NULL AND (email_normalized IS NULL OR email_normalized = '');

-- Index for fast lookup by normalized email and slot_start
CREATE INDEX IF NOT EXISTS idx_bookings_email_slot
  ON public.bookings (email_normalized, slot_start);

-- 2. Create auth_challenges table for OTP codes and magic links
CREATE TABLE IF NOT EXISTS public.auth_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  link_token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_hash TEXT NOT NULL
);

-- Indexes for performance, rate limiting, and verification lookups
CREATE INDEX IF NOT EXISTS idx_auth_challenges_email ON public.auth_challenges (email_normalized, created_at);
CREATE INDEX IF NOT EXISTS idx_auth_challenges_ip ON public.auth_challenges (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_auth_challenges_link_token ON public.auth_challenges (link_token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_challenges_expires ON public.auth_challenges (expires_at);

-- Grant permissions for service role
GRANT ALL ON TABLE public.auth_challenges TO postgres, service_role;
ALTER TABLE public.auth_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on auth_challenges" ON public.auth_challenges;
CREATE POLICY "Service role full access on auth_challenges"
ON public.auth_challenges FOR ALL TO service_role
USING (true) WITH CHECK (true);
