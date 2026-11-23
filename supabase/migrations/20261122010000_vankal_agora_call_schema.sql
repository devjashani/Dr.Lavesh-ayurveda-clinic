-- ==============================================================================
-- VANKAL AYURVEDA — AGORA VIDEO CALL SCHEMA MIGRATION
-- ==============================================================================

-- 1. Add Call Tracking Timestamps to bookings table
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS doctor_joined_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS patient_joined_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS call_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS call_ended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_patient_ping_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_doctor_ping_at TIMESTAMPTZ;

-- 2. Update Status Constraint to Include COMPLETED and NO_SHOW
-- Drop existing check constraint (named bookings_status_check by default in PostgreSQL)
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Re-add constraint with clinical call terminal statuses
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'COMPLETED', 'NO_SHOW'));

-- 3. Supplementary Index for Active Call Monitoring
CREATE INDEX IF NOT EXISTS idx_bookings_call_activity 
  ON public.bookings (id, status, last_patient_ping_at, last_doctor_ping_at);

-- NOTE: The partial unique constraint uq_active_doctor_slot remains UNTOUCHED
-- to preserve concurrency protection on slot reservations:
-- WHERE status IN ('CONFIRMED', 'PENDING_PAYMENT')
