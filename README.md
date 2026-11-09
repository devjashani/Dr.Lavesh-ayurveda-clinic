# Aarogyam Ayurveda (आरोग्यम् आयुर्वेद)
### Classical Vaidya Chikitsalaya & Modern Clinical Sanctuary

> **Design Direction:** *"Calm clinical meets classical Ayurveda"* — Grounded in traditional Samhitas (Charaka, Sushruta, Ashtanga Hridaya) with precision contemporary clinical rigor. Strictly zero neon, zero violet gradients, zero generic glassmorphism cards, and zero emoji as icons.

---

## 🌿 Technical Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19, TypeScript)
- **Styling:** Tailwind CSS v4 with custom theme tokens & CSS variables
- **Motion & Smooth Scrolling:**
  - **Lenis Smooth Scroll** synced frame-by-frame with **GSAP ScrollTrigger**
  - **Framer Motion** for tranquil page transitions (`[0.22, 1, 0.36, 1]` deceleration)
- **Typography:**
  - `Fraunces` (Headings, Display, with optical sizing `opsz 9..144`)
  - `DM Sans` (Body, UI controls, clinical tables)
  - `Tiro Devanagari Hindi` (Sanskrit epigraphs, traditional shlokas, Vaidya titles)
- **Icons:** `lucide-react` (refined 1.25-1.5px stroke weight, used exclusively for micro UI cues)
- **Texture:** Native SVG subtle fractal paper grain overlay (`0.032` opacity)

---

## 🎨 Design System Palette

Every color token is anchored in authentic Ayurvedic materia medica and classical mineral pigments:

| Token | CSS Variable | Hex | Role & Clinical Context |
| :--- | :--- | :--- | :--- |
| **paper** | `--color-paper` | `#F6F1E7` | Primary canvas background; warm tactile parchment tone |
| **cream** | `--color-cream` | `#FBF8F1` | Elevated surface; cards, inputs, secondary panels |
| **forest** | `--color-forest` | `#1F3D2B` | Brand structure; secondary borders, botanical dividers |
| **deep-forest** | `--color-deep-forest` | `#14291C` | Primary buttons, deep contrast editorial titles, footer |
| **sage** | `--color-sage` | `#8FA68A` | Healing accent; Vata soothing tags, tranquil indicators |
| **turmeric** | `--color-turmeric` | `#D99A2B` | Therapeutic gold; active highlights, key CTAs, scroll line |
| **clay** | `--color-clay` | `#B5603A` | Terracotta earth; Pitta markers, alerts, active warnings |
| **ink** | `--color-ink` | `#1B1B18` | Primary body typography; high legibility dark charcoal |
| **mist** | `--color-mist` | `#E4EADF` | Subtle wash; container fills and soft dividing states |

---

## 🏛️ Architectural Features & Components

### Reusable UI Library (`src/components/ui/`)
- `Button`: Primary (deep forest), Secondary (forest outline), Turmeric accent, Text link with animated underline, Ghost.
- `SectionHeading`: Fluid clamp typography, optional Sanskrit shloka subtitle, alignment modes (`left`, `center`, `asymmetric`).
- `ArchImage`: Traditional Indian haveli & temple arches (`rounded-t-[140px]`, `rounded-t-full`, `ogee`, `organic`).
- `BotanicalDivider`: Inline SVG botanical separators (delicate leaf, classical lotus, flourish, minimal).
- `Badge`: Constitutional Dosha tags (`Vata`, `Pitta`, `Kapha`, `Tridoshic`) with status dots and AYUSH certifications.
- `Form Controls`: Clinical `Input`, `Select` (with Sanskrit labels), and `Textarea` with validation and error states.
- `Container`: Fluid responsive container with customizable widths (`narrow`, `default`, `wide`).

### Global Layout & Shell (`src/components/layout/`)
- `Navbar`: Classical leaf/mudra mark, wordmark, bilingual toggle (`EN | हिं`), scroll auto-hide and solid paper background reveal, full-screen mobile menu with staggered reveal.
- `Footer`: 4 columns (Brand + mission, Therapies, Quick links, Clinic info & hours), AYUSH registration line, social links, newsletter, medical disclaimer, and big faded watermark.
- `ScrollProgress`: 2px hairline tracker in `--color-turmeric` at the top viewport edge.
- `FloatingActions`: WhatsApp consultation button with calm pulse ring + mobile sticky bottom bar (`Call` and `Book`).
- `PageTransition`: Framer Motion upward fade on route changes.
- `SmoothScrollProvider`: Lenis smooth scroll wired to GSAP ticker.

---

## 🗺️ Complete Route Manifest

Every required route is created, registered, and styled:

- `/` — Sanctuary Home
- `/design-system` — **Living Design System Review Page**
- `/about` — Clinic Heritage, Lineage & Philosophy
- `/treatments` — Classical Therapies Directory
- `/treatments/[slug]` — Individual Therapy Protocol (e.g. `/treatments/shirodhara`, `/treatments/panchakarma`, `/treatments/abhyanga`)
- `/conditions` — Chronic Conditions & Root-Cause Care
- `/doctors` — Faculty of Vaidyas
- `/doctors/[slug]` — Physician Profile (e.g. `/doctors/dr-aditya-bohra`, `/doctors/dr-ananya-sharma`)
- `/dosha-quiz` — Prakriti Self-Assessment
- `/planner` — Dinacharya & Circadian Lifestyle Planner
- `/book` — Consultation & Panchakarma Booking Desk
- `/blog` — Wisdom & Clinical Research Journal
- `/blog/[slug]` — Article & Herbal Monograph Detail
- `/testimonials` — Verified Patient Stories & Case Reports
- `/faq` — Patient Guides & Pre-Consultation FAQs
- `/contact` — Jaipur Clinic Directions, Helpline & Visiting Hours
- `/portal` — Patient Health Records & Refills
- `/admin` — Vaidya & Clinic Management Console
- `/privacy` — Privacy & Health Data Policy
- `/terms` — Terms of Clinical Care
- `/disclaimer` — Statutory AYUSH Medical Disclaimer
- `404` (`not-found.tsx`) — Branded Serene 404 Recovery Page

---

## 🚀 Running the Project

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 2. Design System Review
Navigate directly to:
```
http://localhost:3000/design-system
```
Here you can interact with all colors, typography clamps, buttons, form controls, arch images, and motion benchmarks.

### 3. Production Build
```bash
npm run build
npm start
```
