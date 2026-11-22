# Clinical & Content Audit Report (Protected Pages)

**Date**: November 22, 2026  
**Status**: Read-only content audit (Pages untouched per Step 1, Rule 5: Treatments, Conditions, Dosha Quiz, Doctor, About).

---

## 1. Executive Summary
Under the latest project overrides, all active booking services are streamlined into a single **Video Consultation** (₹499 / 49,900 paise) auto-assigned to **Dr. Lavesh Bohra**, and all booking files have been updated accordingly.

Per instruction 5, the following audit catalogs claims, pricing estimates, location mentions, and registration placeholders identified across the protected marketing and informational pages:
- **Treatments** (`/treatments`, `/treatments/[slug]`, `src/lib/data/treatments.ts`)
- **Conditions** (`/conditions`, `/conditions/[slug]`, `src/lib/data/conditions.ts`)
- **Doctor** (`/doctor`, `src/app/doctor/DoctorProfileClient.tsx`)
- **About** (`/about`, `src/app/about/page.tsx`)
- **Dosha Quiz** (`/quiz`, `src/lib/data/quizQuestions.ts`)

---

## 2. Identified Claims & Placeholders by Page

### A. About Page (`src/app/about/page.tsx`)
1. **Regulatory Registration**:
   - Line 47: `code: 'Registration No.: to be added'` inside `Regulatory Status` credential card.
2. **Location Placeholder**:
   - Line 134: `<span>Location: to be added</span>` in clinical location badge.
3. **Experience / Credentials**:
   - Degree: BAMS (2026), SMIAS, Gujarat Ayurved University.

### B. Treatments & Therapies (`src/lib/data/treatments.ts` & `/treatments/[slug]`)
1. **Therapy In-Person Price Estimates**:
   - Vamana Bio-Cleansing: `priceRange: '₹14,000 – ₹18,000'`, `priceEstimate: '₹16,000'`
   - Virechana Bio-Cleansing: `priceRange: '₹12,500 – ₹16,500'`, `priceEstimate: '₹14,500'`
   - Basti Therapy (Yoga Basti): `priceRange: '₹16,000 – ₹24,000'`, `priceEstimate: '₹18,000'`
   - Nasya Karma: `priceRange: '₹1,200 – ₹1,800 per session / ₹8,500 (7-Day Course)'`
   - Raktamokshana: `priceRange: '₹2,500 – ₹4,000 per sitting'`
   - Shirodhara: `priceRange: '₹2,400 – ₹3,200 per session / ₹15,000 (7-Day Program)'`
   - Kati Basti: `priceRange: '₹1,500 – ₹2,200 per session'`
   - Janu Basti: `priceRange: '₹1,600 – ₹2,400 per session'`
   - Greeva Basti: `priceRange: '₹1,500 – ₹2,200 per session'`
   - Netra Tarpana: `priceRange: '₹1,500 – ₹2,200 per session'`
2. **Geographical & Clinic References**:
   - `src/app/treatments/[slug]/page.tsx`: Line 53, 58, 432 reference "Jaipur Clinic", "Classical Therapy Jaipur", "Ayurveda therapy Jaipur".
3. **Purity & Marketing Claims**:
   - Line 483 in `treatments/[slug]/page.tsx`: `<span>100% Classical single-source herbal oils</span>`.

### C. Conditions Directory (`src/lib/data/conditions.ts` & `/conditions/[slug]`)
1. **Clinical Prognosis Language**:
   - Discusses multi-week clinical management (e.g. "4 to 12 weeks of Shamana therapy", "reversal of chronic Ama accumulation").
   - Recommended therapies map directly to classical Panchakarma procedures.
2. **References**:
   - Cites classical Ayurvedic texts (Charaka Samhita Chikitsa Sthana, Sushruta Samhita, Ashtanga Hridaya).

### D. Doctor Profile Page (`src/app/doctor/DoctorProfileClient.tsx`)
1. **Credentials & Academic Affiliation**:
   - BAMS (2026), SMIAS, Gujarat Ayurved University.
   - 0 years post-graduation clinical establishment noted in data models.
2. **OPD Consultation Language**:
   - Lists in-person physical clinical focus areas (radial pulse diagnosis, Ashtavidha Pariksha) alongside lifestyle & dietary counseling.

### E. Dosha Quiz (`/quiz`, `src/lib/data/quizQuestions.ts`)
1. **Prakriti Diagnostic Claims**:
   - 21-question classical constitution questionnaire based on Sharira and Manasa Lakshana.
   - Provides instant doshic breakdown (Vata, Pitta, Kapha percentage) and suggests tailored lifestyle adjustments.
2. **Medical Disclaimer**:
   - Correctly includes disclaimer that the quiz provides educational constitutional insight and is not a formal medical diagnosis.

---

## 3. Recommended Actions for Future Review
1. **Clinic Location**: Update the generic `Jaipur Clinic` mentions in treatment metadata once the real clinic address is finalized.
2. **Therapy Price List**: Verify whether in-clinic therapy packages (e.g. Panchakarma 7-day cycles) should remain as educational estimates or be disabled until in-person OPD commences.
3. **AYUSH Registration Number**: Populate the doctor's official state AYUSH board registration number across `about/page.tsx` once granted.
