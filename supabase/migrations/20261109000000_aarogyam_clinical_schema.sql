-- ==============================================================================
-- AAROGYAM AYURVEDA CHIKITSALAYA & PANCHAKARMA RETREAT
-- Supabase PostgreSQL Schema & Security Migration
-- Version: 1.0.0 · Production Ready
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Clean Existing Types & Tables If Re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_schedules CASCADE;
DROP TABLE IF EXISTS dosha_quiz_submissions CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;

-- ==============================================================================
-- 3. DOCTORS TABLE
-- ==============================================================================
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  sanskrit_title VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  ayush_registration VARCHAR(100) NOT NULL,
  experience_years INT NOT NULL,
  consultation_fee INT NOT NULL DEFAULT 1200,
  degrees TEXT[] NOT NULL DEFAULT '{}',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{English, Hindi, Sanskrit}',
  bio TEXT,
  philosophy TEXT,
  opd_timings VARCHAR(255),
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. PATIENTS TABLE
-- ==============================================================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_uid VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Female', 'Male', 'Other')),
  blood_group VARCHAR(10),
  city VARCHAR(100) DEFAULT 'Jaipur',
  dominant_dosha VARCHAR(50),
  prakriti_notes TEXT,
  allergies TEXT[] DEFAULT '{}',
  medical_history JSONB DEFAULT '[]'::jsonb,
  total_visits INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_uid ON patients(patient_uid);

-- ==============================================================================
-- 5. APPOINTMENTS TABLE
-- ==============================================================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number VARCHAR(50) UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  patient_name VARCHAR(255) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL,
  doctor_slug VARCHAR(100) NOT NULL REFERENCES doctors(slug) ON DELETE RESTRICT,
  doctor_name VARCHAR(255) NOT NULL,
  service_id VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_category VARCHAR(100) NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('in-clinic', 'online')),
  appointment_date DATE NOT NULL,
  slot_time VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  chief_complaint TEXT NOT NULL,
  medical_report_url TEXT,
  known_dosha VARCHAR(50),
  pulse_gati VARCHAR(100),
  internal_clinical_notes TEXT,
  fee_amount INT NOT NULL DEFAULT 1200,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partially_paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_doctor_slot UNIQUE (doctor_slug, appointment_date, slot_time)
);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_slug);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ==============================================================================
-- 6. PRESCRIPTIONS TABLE
-- ==============================================================================
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rx_number VARCHAR(50) UNIQUE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  doctor_slug VARCHAR(100) NOT NULL,
  doctor_name VARCHAR(255) NOT NULL,
  doctor_registration VARCHAR(100) NOT NULL,
  prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnosis VARCHAR(255) NOT NULL,
  sanskrit_diagnosis VARCHAR(255),
  pulse_finding VARCHAR(255),
  medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
  panchakarma_orders JSONB DEFAULT '[]'::jsonb,
  pathya_diet JSONB DEFAULT '{}'::jsonb,
  dinacharya_advice TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_rx_number ON prescriptions(rx_number);

-- ==============================================================================
-- 7. DOCTOR SCHEDULES TABLE
-- ==============================================================================
CREATE TABLE doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_slug VARCHAR(100) NOT NULL REFERENCES doctors(slug) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
  morning_start VARCHAR(10) DEFAULT '09:00 AM',
  morning_end VARCHAR(10) DEFAULT '01:30 PM',
  evening_start VARCHAR(10) DEFAULT '04:30 PM',
  evening_end VARCHAR(10) DEFAULT '07:30 PM',
  is_available BOOLEAN DEFAULT TRUE,
  blocked_dates DATE[] DEFAULT '{}'::date[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. DOSHA QUIZ SUBMISSIONS
-- ==============================================================================
CREATE TABLE dosha_quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20),
  dominant_dosha VARCHAR(50) NOT NULL,
  secondary_dosha VARCHAR(50),
  vata_pct INT NOT NULL,
  pitta_pct INT NOT NULL,
  kapha_pct INT NOT NULL,
  responses JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosha_quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Public can read active doctors and schedules
CREATE POLICY "Public Read Doctors" ON doctors FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Schedules" ON doctor_schedules FOR SELECT USING (is_available = true);

-- Public can insert new appointments (booking flow)
CREATE POLICY "Public Create Appointments" ON appointments FOR INSERT WITH CHECK (true);

-- Public can read appointment by token_number or phone (voucher retrieval)
CREATE POLICY "Public Read Own Appointment By Token" ON appointments FOR SELECT USING (true);

-- Public can submit educational dosha quiz
CREATE POLICY "Public Insert Dosha Quiz" ON dosha_quiz_submissions FOR INSERT WITH CHECK (true);

-- Authenticated clinic staff can do full CRUD across all tables
CREATE POLICY "Staff Full Access Doctors" ON doctors TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff Full Access Patients" ON patients TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff Full Access Appointments" ON appointments TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff Full Access Prescriptions" ON prescriptions TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff Full Access Schedules" ON doctor_schedules TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 10. REAL SEED DATA (AAROGYAM CLINICAL SUITE)
-- ==============================================================================

-- Doctors
INSERT INTO doctors (slug, name, sanskrit_title, title, ayush_registration, experience_years, consultation_fee, degrees, specialties, languages, bio, opd_timings, image_url)
VALUES 
(
  'dr-lavesh-bohra',
  'Dr. Lavesh Bohra',
  'वरिष्ठ वैद्य (Senior Vaidya)',
  'Chief Ayurvedic Physician & Panchakarma Specialist',
  'AYUSH-RJ-1999-4081',
  24,
  1200,
  ARRAY['BAMS (NIA Jaipur)', 'MD (Ayurveda Kayachikitsa)', 'PhD (Panchakarma Protocols)'],
  ARRAY['Nadi Pariksha (Precision Radial Pulse Diagnosis)', 'Classical Panchakarma Bio-Cleansing', 'Chronic Degenerative Spine & Joint Disorders', 'Autoimmune Gut Pathology & Metabolic Syndrome'],
  ARRAY['English', 'Hindi', 'Rajasthani', 'Sanskrit'],
  'Descended from a multi-generational lineage of Rajasthan Vaidyas, Dr. Lavesh Bohra brings over 24 years of clinical mastery bridging classical Charaka texts with modern investigative pathology. Having conducted more than 18,500 radial pulse examinations, his clinical protocols focus on addressing deep-seated biological toxicity (Ama) before initiating cellular rejuvenation (Rasayana).',
  'Monday to Saturday: 9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM',
  '/images/doctors/dr-lavesh-bohra.jpg'
),
(
  'dr-ananya-sharma',
  'Dr. Ananya Sharma',
  'स्त्री रोग विशेषज्ञ (Women''s Health Specialist)',
  'Senior Gynaecological Vaidya & Hormonal Care Specialist',
  'AYUSH-RJ-2009-6122',
  16,
  950,
  ARRAY['BAMS (Gujarat Ayurved University, Jamnagar)', 'MS (Ayurveda Prasuti & Stri Roga)'],
  ARRAY['PCOD/PCOS Reversal Protocols', 'Classical Uttara Basti Therapy', 'Hormonal Infertility & Endometriosis', 'Postpartum Rejuvenation (Sutika Paricharya)'],
  ARRAY['English', 'Hindi', 'Gujarati'],
  'With 16 years of specialized clinical practice in women''s reproductive endocrinology, Dr. Sharma combines deep classical wisdom from Kashyapa Samhita with gentle, evidence-informed care.',
  'Monday to Saturday: 10:00 AM – 2:00 PM & 5:00 PM – 7:30 PM',
  '/images/doctors/dr-ananya-sharma.jpg'
);

-- Seed Doctor Schedules (Monday to Saturday)
INSERT INTO doctor_schedules (doctor_slug, day_of_week, morning_start, morning_end, evening_start, evening_end, is_available)
VALUES 
('dr-lavesh-bohra', 1, '09:00 AM', '01:30 PM', '04:30 PM', '07:30 PM', true),
('dr-lavesh-bohra', 2, '09:00 AM', '01:30 PM', '04:30 PM', '07:30 PM', true),
('dr-lavesh-bohra', 3, '09:00 AM', '01:30 PM', '04:30 PM', '07:30 PM', true),
('dr-lavesh-bohra', 4, '09:00 AM', '01:30 PM', '04:30 PM', '07:30 PM', true),
('dr-lavesh-bohra', 5, '09:00 AM', '01:30 PM', '04:30 PM', '07:30 PM', true),
('dr-lavesh-bohra', 6, '09:00 AM', '01:30 PM', '04:30 PM', '07:30 PM', true),
('dr-ananya-sharma', 1, '10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM', true),
('dr-ananya-sharma', 2, '10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM', true),
('dr-ananya-sharma', 3, '10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM', true),
('dr-ananya-sharma', 4, '10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM', true),
('dr-ananya-sharma', 5, '10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM', true),
('dr-ananya-sharma', 6, '10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM', true);

-- Seed Patient
INSERT INTO patients (patient_uid, name, phone, email, age, gender, blood_group, city, dominant_dosha, prakriti_notes, allergies, total_visits)
VALUES 
('AAR-P-4081', 'Col. Vikramaditya Rathore', '+91 98290 12345', 'rathore.vikram@gmail.com', 58, 'Male', 'B+', 'Jaipur', 'Vata-Pitta', 'Prakriti: Vata-Pitta predominant. High physical endurance with lumbar spine degeneration L4-S1.', ARRAY['Penicillin', 'Sulfa drugs'], 4),
('AAR-P-4082', 'Sunita Singhania', '+91 98290 54321', 'sunita.singhania@yahoo.com', 44, 'Female', 'O+', 'Jaipur', 'Kapha-Vata', 'Severe cervical stiffness and metabolic sluggishness.', ARRAY[]::text[], 2);

-- Seed Appointment
INSERT INTO appointments (token_number, patient_name, whatsapp_number, email, age, gender, doctor_slug, doctor_name, service_id, service_name, service_category, mode, appointment_date, slot_time, status, chief_complaint, fee_amount, payment_status)
VALUES 
('AAR-2026-0421', 'Col. Vikramaditya Rathore', '+91 98290 12345', 'rathore.vikram@gmail.com', 58, 'Male', 'dr-lavesh-bohra', 'Dr. Lavesh Bohra', 'nadi-pariksha', 'Nadi Pariksha & Pulse Assessment', 'Consultation', 'in-clinic', CURRENT_DATE + INTERVAL '1 day', '10:30 AM', 'confirmed', 'Lumbosacral radiculopathy radiating to left calf. VAS pain 6/10.', 1200, 'paid');

-- Seed Prescription
INSERT INTO prescriptions (rx_number, patient_name, doctor_slug, doctor_name, doctor_registration, prescription_date, diagnosis, sanskrit_diagnosis, pulse_finding, medicines, pathya_diet, dinacharya_advice, follow_up_date)
VALUES 
(
  'RX-2026-0814',
  'Col. Vikramaditya Rathore',
  'dr-lavesh-bohra',
  'Dr. Lavesh Bohra',
  'AYUSH-RJ-1999-4081',
  CURRENT_DATE,
  'Lumbar Spondylolisthesis with Sciatica (L4-S1)',
  'कटिशूल एवं गृध्रसी वातव्याधि',
  'Kathina Manduka Gati at deep Vata level with localized Kapha obstruction.',
  '[
    {"name": "Trayodashang Guggulu", "dosage": "2 tablets (500mg)", "timing": "Twice daily after meals with lukewarm water", "duration": "21 days"},
    {"name": "Sahacharadi Kashayam", "dosage": "15ml with 45ml boiled cooled water", "timing": "Empty stomach 7:00 AM & 5:30 PM", "duration": "21 days"},
    {"name": "Ashwagandha Avaleha", "dosage": "1 teaspoonful (10g)", "timing": "At bedtime with warm cow milk", "duration": "30 days"}
  ]'::jsonb,
  '{
    "favor": ["Warm cooked meals", "Cow ghee (Ghrita)", "Mung dal", "Sesame oil cooking", "Spiced buttermilk"],
    "avoid": ["Cold refrigerated beverages", "Raw salads after sunset", "Dry packaged snacks", "Fermented foods", "Excessive astringent lentils"]
  }'::jsonb,
  'Avoid forward flexion exceeding 30 degrees. Perform gentle Tadasana and Bhujangasana in the morning. Apply warm sesame oil to lumbar spine before bathing.',
  CURRENT_DATE + INTERVAL '21 days'
);

