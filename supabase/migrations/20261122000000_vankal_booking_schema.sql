-- ==============================================================================
-- VANKAL AYURVEDA — CLINICAL BOOKING & CONCURRENCY SLOT HOLD SCHEMA
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing bookings table if recreating cleanly
DROP TABLE IF EXISTS public.bookings CASCADE;

-- 3. Bookings Table (Minimal, Strict & Atomic)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name VARCHAR(255) NOT NULL,
  patient_whatsapp VARCHAR(30) NOT NULL,
  patient_email VARCHAR(255),
  patient_age INT NOT NULL,
  patient_gender VARCHAR(20) NOT NULL CHECK (patient_gender IN ('Female', 'Male', 'Other')),
  primary_complaint TEXT NOT NULL,
  report_file_ids TEXT[] DEFAULT '{}'::TEXT[],
  service_id VARCHAR(100) NOT NULL DEFAULT 'video-consultation',
  doctor_id VARCHAR(100) NOT NULL DEFAULT 'dr-lavesh-bohra',
  doctor_name VARCHAR(255) NOT NULL DEFAULT 'Dr. Lavesh Bohra',
  consultation_mode VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (consultation_mode IN ('online')),
  appointment_date DATE NOT NULL,
  slot_start VARCHAR(10) NOT NULL, -- e.g. "10:00"
  slot_end VARCHAR(10) NOT NULL,   -- e.g. "10:20"
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT' 
    CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED')),
  hold_expires_at TIMESTAMPTZ,
  fee_amount INT NOT NULL DEFAULT 49900, -- ₹499 in paise
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_lookup ON public.bookings (doctor_id, appointment_date, slot_start);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (appointment_date);

-- Partial Unique Constraint for Active Bookings:
-- Guarantees at most ONE Confirmed or Active Pending Hold per slot
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_doctor_slot
ON public.bookings (doctor_id, appointment_date, slot_start)
WHERE status IN ('CONFIRMED', 'PENDING_PAYMENT');

-- 4. Atomic Slot Reservation & Concurrency Hold RPC Function
CREATE OR REPLACE FUNCTION public.acquire_slot_hold(
  p_doctor_id TEXT,
  p_appointment_date DATE,
  p_slot_start TEXT,
  p_slot_end TEXT,
  p_patient_name TEXT,
  p_patient_whatsapp TEXT,
  p_patient_email TEXT DEFAULT NULL,
  p_patient_age INT DEFAULT NULL,
  p_patient_gender TEXT DEFAULT NULL,
  p_primary_complaint TEXT DEFAULT NULL,
  p_report_file_ids TEXT[] DEFAULT '{}'::TEXT[],
  p_hold_duration_minutes INT DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_id UUID;
  v_new_id UUID;
  v_hold_expires TIMESTAMPTZ;
BEGIN
  -- A. Automatically expire any stale holds on this slot
  UPDATE public.bookings
  SET status = 'EXPIRED', updated_at = NOW()
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_appointment_date
    AND slot_start = p_slot_start
    AND status = 'PENDING_PAYMENT'
    AND hold_expires_at <= NOW();

  -- B. Check if slot is actively booked or held
  SELECT id INTO v_existing_id
  FROM public.bookings
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_appointment_date
    AND slot_start = p_slot_start
    AND (
      status = 'CONFIRMED'
      OR (status = 'PENDING_PAYMENT' AND hold_expires_at > NOW())
    )
  LIMIT 1
  FOR UPDATE;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'SLOT_UNAVAILABLE',
      'message', 'This time slot is already reserved or held by another patient.'
    );
  END IF;

  -- C. Compute hold expiration (e.g. 10 minutes)
  v_hold_expires := NOW() + (p_hold_duration_minutes || ' minutes')::INTERVAL;

  -- D. Insert the pending payment booking
  INSERT INTO public.bookings (
    patient_name,
    patient_whatsapp,
    patient_email,
    patient_age,
    patient_gender,
    primary_complaint,
    report_file_ids,
    service_id,
    doctor_id,
    doctor_name,
    consultation_mode,
    appointment_date,
    slot_start,
    slot_end,
    status,
    hold_expires_at,
    fee_amount
  ) VALUES (
    p_patient_name,
    p_patient_whatsapp,
    p_patient_email,
    p_patient_age,
    p_patient_gender,
    p_primary_complaint,
    p_report_file_ids,
    'video-consultation',
    p_doctor_id,
    'Dr. Lavesh Bohra',
    'online',
    p_appointment_date,
    p_slot_start,
    p_slot_end,
    'PENDING_PAYMENT',
    v_hold_expires,
    49900
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'booking_id', v_new_id,
    'hold_expires_at', v_hold_expires
  );
END;
$$;

-- 5. Grant Permissions (Solves Error 42501 Permission Denied)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 6. Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on bookings" ON public.bookings;
CREATE POLICY "Service role full access on bookings"
ON public.bookings FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read booking by id" ON public.bookings;
CREATE POLICY "Public read booking by id"
ON public.bookings FOR SELECT TO anon, authenticated
USING (true);

-- 7. Medical Reports Private Storage Bucket (Direct browser-to-storage upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-reports',
  'medical-reports',
  false,
  10485760, -- 10MB limit per file
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public upload to medical reports" ON storage.objects;
CREATE POLICY "Allow public upload to medical reports"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'medical-reports');

DROP POLICY IF EXISTS "Allow service role full access to storage" ON storage.objects;
CREATE POLICY "Allow service role full access to storage"
ON storage.objects FOR ALL TO service_role
USING (bucket_id = 'medical-reports')
WITH CHECK (bucket_id = 'medical-reports');
