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
| 2 | **OPD Consultation Timings** | `Placeholder: 10:00–13:00 & 17:00–19:00 (20-min slots)` | Schedule config (`schedule.ts`), Slots API (`/api/slots`), Booking Calendar | Confirm exact clinical hours, weekly off-days, and duration per video consultation. |
| 3 | **Cancellation & Refund Policy Window** | `[Refund window: to be confirmed by clinic]` | Refund Policy (`/refund-policy`), Terms (`/terms`), Review Page | Confirm exact patient cancellation window (e.g. up to 24 hours prior) and refund fee processing terms. |
| 4 | **Video Platform Integration** | `Google Meet Room Placeholder (meet.google.com/lookup/vankal-dr-bohra)` | Video Link Endpoint (`/api/bookings/[id]/video-link`), Confirmed Page (`/book/confirmed`) | Choose automated video provider (Google Meet Workspace API, Daily.co REST API, or Jitsi Meet) and supply API credentials. |
| 5 | **Notification Channels (WhatsApp / SMS / Email)** | Dispatch Templates (`appointment-confirmation-whatsapp.txt`, `appointment-confirmation-email.txt`) | Post-booking webhook / verify handler | Connect an automated WhatsApp Business BSP (e.g. Twilio, Gupshup, or AiSensy) and transactional email provider (e.g. Resend / SendGrid) to send video links 10 minutes prior. |
| 6 | **Report-Upload Storage Configuration** | `Supabase Bucket: medical-reports` (4MB limit, PDF/JPG/PNG max 3) | Booking Page (`/book`), Storage Policies | Provision production Supabase Storage bucket with signed URL access, RLS policies, and 30-day retention auto-cleanup. |
| 7 | **Claim Wording for Report Privacy** | *"Optional. Shared only with your doctor for this consultation."* | Booking Page (`/book`), Privacy Policy (`/privacy`) | Validate clinical privacy notice wording with Dr. Lavesh Bohra regarding data confidentiality under AYUSH telemedicine guidelines. |
| 8 | **Clinic Physical Address** | `Address: to be added` | Contact Page (`/contact`), Footer, Receipt Voucher, Google SEO JSON-LD | Supply physical location (city, area, address, landmarks) for in-clinic OPD references. |
| 9 | **Clinic Official Email & Phone** | `Phone: +91 9016432576` · `Email: to be added` | Header, Footer, Contact Page, Support Desks | Verify primary customer-facing calling number and clinical support email inbox. |
| 10 | **Doctor Clinical Portrait Photo** | Monogrammed SVG Arch Placeholder (`/images/doctors/dr-lavesh-bohra.jpg`) | Home Doctor Section, Doctor Profile (`/doctors`), Hero Preview | Supply high-resolution professional portrait of Dr. Lavesh Bohra. |

---

## 2. Go-Live Technical Checklist

### A. Razorpay Live Account Activation
- [ ] Complete KYC verification on [Razorpay Merchant Dashboard](https://dashboard.razorpay.com/).
- [ ] Switch dashboard mode from **Test Mode** to **Live Mode**.
- [ ] Generate Live API Keys: `rzp_live_...` and secret.
- [ ] Set `RAZORPAY_KEY_ID`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` in production.

### B. Vercel Environment Variables
Set the following environment variables in **Vercel Project Settings → Environment Variables** (Production & Preview):
- `NEXT_PUBLIC_APP_URL` = `https://vankalayurveda.com`
- `NEXT_PUBLIC_SITE_NAME` = `VANKAL AYURVEDA`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_live_...`
- `RAZORPAY_KEY_ID` = `rzp_live_...`
- `RAZORPAY_KEY_SECRET` = `<live_razorpay_secret>`
- `RAZORPAY_WEBHOOK_SECRET` = `<strong_random_webhook_secret>`
- `NEXT_PUBLIC_SUPABASE_URL` = `https://<project-id>.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<supabase_anon_key>`
- `SUPABASE_SERVICE_ROLE_KEY` = `<supabase_service_role_key>`
- `NEXT_PUBLIC_CLINIC_PHONE` = `+919016432576`
- `NEXT_PUBLIC_CLINIC_WHATSAPP` = `+919016432576`
- `NEXT_PUBLIC_CLINIC_EMAIL` = `care@vankalayurveda.com`

### C. Razorpay Webhook Registration
- [ ] In the Razorpay Live Dashboard under **Settings → Webhooks**:
  - **Webhook URL:** `https://vankalayurveda.com/api/payments/webhook`
  - **Secret:** Must match `RAZORPAY_WEBHOOK_SECRET` exactly.
  - **Events subscribed:**
    - `payment.captured`
    - `order.paid`
    - `payment.failed`

### D. Supabase Production Migration
- [ ] Run migration `supabase/migrations/20261122000000_vankal_booking_schema.sql` in production SQL Editor to ensure `bookings` table, partial index `uq_active_doctor_slot`, and `acquire_slot_hold` RPC are active.
- [ ] Verify `medical-reports` storage bucket permissions.
