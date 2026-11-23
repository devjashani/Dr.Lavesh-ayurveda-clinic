# Information Placeholders Pending from Dr. Lavesh Bohra (TODO.md)

The following verified facts are actively applied across the **VANKAL AYURVEDA** website:
- **Doctor:** Dr. Lavesh Bohra
- **Qualification:** BAMS, 2026
- **Institution:** SMIAS, Gujarat Ayurved University
- **Status:** Registered Ayurvedic Practitioner
- **Clinical Focus:** Individual Ayurvedic consultations and personalized lifestyle care (diet/Ahara, daily routine/Dinacharya, seasonal routine/Ritucharya)
- **Consultation Mode:** Online Video Consultation (Single service, server constant ₹499 / 49,900 paise)

---

## 1. Placeholders Needing Real Information Before Production Launch

| # | Item | Current Site Value / Placeholder | Locations Used | Action Required |
|---|---|---|---|---|
| 1 | **AYUSH Registration Number** | `Registration No.: to be added` | Doctor Profile (`/doctors`), Home Doctor Section, Footer, Receipt Voucher, Templates | Supply official state/central board registration number once allotted. |
| 2 | **Real OPD Consultation Slot Length & Timings** | `Placeholder: 10:00–13:00 & 17:00–19:00 (20-min slots)` | Schedule config (`schedule.ts`), Slots API (`/api/slots`), Booking Calendar | Confirm exact clinical hours, weekly off-days, and duration per video consultation with Dr. Bohra (e.g., 20 mins vs 30 mins vs 45 mins for initial consultations). |
| 3 | **Cancellation & Refund Policy Window** | `[Refund window: to be confirmed by clinic]` | Refund Policy (`/refund-policy`), Terms (`/terms`), Review Page | Confirm exact patient cancellation window (e.g. up to 24 hours prior) and refund fee processing terms. |
| 4 | **Agora RTC Video Credentials & Free-Minutes Alert** | `NEXT_PUBLIC_AGORA_APP_ID`, `AGORA_APP_CERTIFICATE` | Agora RTC Token Builder (`/api/call/token`), Client (`agora-rtc-sdk-ng`) | 1. Create project in [Agora Console](https://console.agora.io/) with "App ID + Token" mode.<br>2. **Free Minutes Check:** Agora grants 10,000 free minutes/month across audio/video.<br>3. Set up **Usage Alerts** at 8,000 minutes in Agora Console to prevent unexpected charges. |
| 5 | **Doctor New-Booking Alert Channel** | `Console "New" Badge + Server Log` | Payment Verify & Webhook Handlers (`/api/payments/*`) | Confirm whether Dr. Bohra prefers real-time new booking alerts via **WhatsApp message** (Twilio/WhatsApp Cloud API) or **Transactional Email** (Resend/SendGrid). |
| 6 | **Report-Upload Storage Configuration** | `Supabase Bucket: medical-reports` (4MB limit, PDF/JPG/PNG max 3) | Booking Page (`/book`), Storage Policies | Provision production Supabase Storage bucket with signed URL access, RLS policies, and 30-day retention auto-cleanup. |
| 7 | **Privacy Policy: Zero-Recording & Ephemeral Media** | Active in `/privacy` (TLS 1.3 & AES-256) | Privacy Policy (`/privacy`), Terms (`/terms`) | Stated clearly: *"Video consultations are conducted peer-to-peer via Agora RTC with zero audio/video recording or server storage. Live consultation streams are strictly ephemeral and never retained."* |
| 8 | **Clinic Physical Address** | `Address: to be added` | Contact Page (`/contact`), Footer, Receipt Voucher, Google SEO JSON-LD | Supply physical location (city, area, address, landmarks) for in-clinic OPD references. |
| 9 | **Clinic Official Email & Phone** | `Phone: +91 9016432576` · `Email: care@vankalayurveda.com` | Header, Footer, Contact Page, Support Desks | Verify primary customer-facing calling number and clinical support email inbox. |
| 10 | **Doctor Clinical Portrait Photo** | Monogrammed SVG Arch Placeholder (`/images/doctors/dr-lavesh-bohra.jpg`) | Home Doctor Section, Doctor Profile (`/doctors`), Hero Preview | Supply high-resolution professional portrait of Dr. Lavesh Bohra. |

---

## 2. Go-Live Technical Checklist

### A. Razorpay Live Account Activation
- [ ] Complete KYC verification on [Razorpay Merchant Dashboard](https://dashboard.razorpay.com/).
- [ ] Switch dashboard mode from **Test Mode** to **Live Mode**.
- [ ] Generate Live API Keys: `rzp_live_...` and secret.
- [ ] Set `RAZORPAY_KEY_ID`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` in production Vercel environment.
- [ ] Register Webhook in Razorpay Live Dashboard:
  - **URL:** `https://vankalayurveda.com/api/payments/webhook`
  - **Secret:** Must match `RAZORPAY_WEBHOOK_SECRET`
  - **Events:** `payment.captured`, `order.paid`, `payment.failed`

### B. Agora RTC Production Video Setup
- [ ] Create an Agora project at [console.agora.io](https://console.agora.io/).
- [ ] Authentication mode: select **Secured Mode: App ID + Token** (never App ID only).
- [ ] Copy **App ID** (32-char hex) to `NEXT_PUBLIC_AGORA_APP_ID`.
- [ ] Copy **Primary Certificate** (32-char hex) to `AGORA_APP_CERTIFICATE` (server-side only, NEVER in client code or logs).
- [ ] Verify Agora 10,000 free minutes/month threshold and configure usage alert webhook/email at 8,000 minutes.
- [ ] Confirm no Cloud Recording or Media Storage add-on is enabled (zero-recording policy).

### C. Doctor Console Credentials (/admin)
- [ ] Confirm official doctor sign-in email: `DOCTOR_EMAIL` (configured: `laveshbohra@gmail.com`).
- [ ] Generate a production bcrypt password hash for Dr. Lavesh Bohra using:
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('YourChosenDoctorPassword', 10))"
  ```
- [ ] Set `DOCTOR_PASSWORD_HASH` and `DOCTOR_JWT_SECRET` (32+ character random string) in Vercel.

### D. Supabase Production Database Migrations
- [ ] Execute `supabase/migrations/20261122000000_vankal_booking_schema.sql` in the Supabase SQL Editor:
  - Creates `public.bookings` table with status checks (`PENDING_PAYMENT`, `CONFIRMED`, `COMPLETED`, `NO_SHOW`, `CANCELLED`, `EXPIRED`).
  - Creates partial unique index `uq_active_doctor_slot` to prevent double-booking.
  - Creates atomic `acquire_slot_hold` RPC function for 10-minute payment holds.
  - Grants schema privileges and creates `medical-reports` private storage bucket.
- [ ] Execute `supabase/migrations/20261122010000_vankal_agora_call_schema.sql`:
  - Adds call lifecycle columns (`doctor_joined_at`, `patient_joined_at`, `call_started_at`, `call_ended_at`, `last_patient_ping_at`, `last_doctor_ping_at`).
  - Updates status checks to include `COMPLETED` and `NO_SHOW`.

### E. Vercel Environment Variables
Add the following in **Vercel Project Settings → Environment Variables** (Production & Preview):

| Variable Name | Environment | Description / Example |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Production & Preview | `https://vankalayurveda.com` |
| `NEXT_PUBLIC_SITE_NAME` | Production & Preview | `VANKAL AYURVEDA` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production | `rzp_live_...` (Live key for client Razorpay popup) |
| `RAZORPAY_KEY_ID` | Production | `rzp_live_...` (Live key for server order creation) |
| `RAZORPAY_KEY_SECRET` | Production | Live Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Production | Custom secret registered in Razorpay Webhooks |
| `NEXT_PUBLIC_AGORA_APP_ID` | Production | 32-character hexadecimal Agora App ID |
| `AGORA_APP_CERTIFICATE` | Production | 32-character hexadecimal Agora Primary Certificate |
| `DOCTOR_EMAIL` | Production | `laveshbohra@gmail.com` (Doctor login email) |
| `DOCTOR_PASSWORD_HASH` | Production | Bcrypt hash generated for Dr. Bohra's password |
| `DOCTOR_JWT_SECRET` | Production | 32+ character random secret for signing doctor session cookies |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | `https://<project-id>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase Anonymous Client Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Supabase Service Role Secret Key (Server-only) |
| `NEXT_PUBLIC_CLINIC_PHONE` | Production | `+919016432576` |
| `NEXT_PUBLIC_CLINIC_WHATSAPP` | Production | `+919016432576` |
| `NEXT_PUBLIC_CLINIC_EMAIL` | Production | `care@vankalayurveda.com` |
