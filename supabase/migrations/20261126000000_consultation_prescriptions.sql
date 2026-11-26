-- ==============================================================================
-- VANKAL AYURVEDA — LIVE CONSULTATION PRESCRIPTIONS SCHEMA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.consultation_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
  clinical_advice TEXT NOT NULL DEFAULT '',
  updated_by VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_prescriptions_booking
  ON public.consultation_prescriptions (booking_id);

GRANT ALL ON TABLE public.consultation_prescriptions TO postgres, service_role;
ALTER TABLE public.consultation_prescriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on consultation_prescriptions" ON public.consultation_prescriptions;
CREATE POLICY "Service role full access on consultation_prescriptions"
ON public.consultation_prescriptions FOR ALL TO service_role
USING (true) WITH CHECK (true);
