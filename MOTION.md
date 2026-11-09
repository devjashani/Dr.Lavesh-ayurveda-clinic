# Motion Design Principles — Aarogyam Ayurveda

> "Calm clinical meets classical Ayurveda"

The motion language of Aarogyam Ayurveda mirrors the restorative cadence of classical Ayurvedic healing: deliberate, grounded, breath-paced, and devoid of hurried modern digital artifacts (such as nervous bounces, spring overshoots, or flashy neon transitions).

---

## 1. Core Timing & Easing Curves

All interface animations adhere to a serene decelerating curve that eases smoothly into rest, evoking a sense of stillness and precision.

| Property | Value | Description |
| :--- | :--- | :--- |
| **Primary Easing** | `cubic-bezier(0.22, 1, 0.36, 1)` | Quintic-style calm deceleration. Fast initial response, graceful soft landing. |
| **Micro-interaction Easing** | `cubic-bezier(0.25, 1, 0.5, 1)` | Gentle ease-out for hover states, button glows, and underlines. |
| **Page Transition Easing** | `cubic-bezier(0.16, 1, 0.3, 1)` | Cinematic, spacious page transitions with zero visual jarring. |

### Duration Hierarchy

- **Micro-interactions (Buttons, Links, Inputs):** `240ms – 360ms`
- **Component Reveals (Modals, Drawers, Mobile Menu):** `500ms – 750ms`
- **Hero & Content Line Reveals:** `800ms – 1200ms`
- **Page Transitions:** `600ms – 800ms`

---

## 2. Animation Rules & Constraints

1. **NO Bouncing or Spring Jitter:**
   Strictly avoid elastic springs, physics bounces, or oscillatory damping. Ayurvedic healing is steady and pacifying (Vata-pacifying motion).
2. **Text Reveals by Line:**
   Headings and editorial titles reveal upward line-by-line (`translateY(24px)` to `0`, with opacity from `0` to `1`), masked cleanly with `overflow: hidden` line wrappers.
3. **Soft Fades with Directional Drift:**
   Elements transition with a soft fade accompanied by a subtle upward shift (`12px` to `20px` maximum). Large leaps across the screen are prohibited.
4. **Stagger Intervals:**
   When listing items (treatment cards, doctors, nav links), stagger delay is between `0.06s` and `0.1s` per item to avoid sensory overload.
5. **Respect `prefers-reduced-motion`:**
   When the user has reduced motion enabled in their OS, all translational movement collapses to zero (`translateY: 0`) and animations fall back to instantaneous or simple gentle opacity fades (`150ms`).

---

## 3. Smooth Scroll Architecture (Lenis + GSAP ScrollTrigger)

The website integrates **Lenis** smooth scrolling orchestrated with **GSAP ScrollTrigger**:

- **Lenis Configuration:**
  - `lerp: 0.085` (relaxed, fluid momentum without feeling detached from the pointer)
  - `duration: 1.2`
  - `smoothWheel: true`
  - `syncTouch: false` (native touch behavior preserved on mobile devices)
- **GSAP ScrollTrigger Sync:**
  Lenis ticker updates `ScrollTrigger.update()` on every frame, ensuring pinned sections, parallax layers, and progress indicators stay in sub-pixel lockstep.

---

## 4. Navigation & Global Layout Motion

- **Top Scroll Progress Line:**
  A 2px hairline tracker pinned to the viewport ceiling reflects current scroll depth smoothly using `--color-turmeric` (#D99A2B).
- **Navbar Auto-hide / Reveal:**
  - Pinned transparent state over the initial viewport.
  - Transitions to solid `paper` (#F6F1E7) with a fine 1px border when scrolled past 40px.
  - Hides smoothly (`translateY(-100%)`) on continuous downward scroll; gently slides back (`translateY(0%)`) immediately upon upward scroll.
- **Mobile Menu Overlay:**
  Full-viewport backdrop fade with staggered vertical cascade for each navigation item, completed by a delicate botanical divider reveal.
- **Floating WhatsApp Button:**
  Anchored bottom-right with an ambient, slow concentric pulse ring (3.6s cycle, opacity 0.4 to 0, scale 1.0 to 1.35) that does not distract the reader.

