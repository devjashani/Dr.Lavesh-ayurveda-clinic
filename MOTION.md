# Central Motion System — Aarogyam Ayurveda

A centralized, performant, and dignified motion design system for **Aarogyam Ayurveda**. All animations follow a unified clinical aesthetic (*"Calm clinical meets classical Ayurveda"*). Random one-off animations are strictly forbidden in favor of shared tokens, standard primitives, and guaranteed accessibility compliance.

---

## 1. Core Tokens & Constants (`@/lib/motion`)

```typescript
export const MOTION_TOKENS = {
  // Bespoke calm deceleration curve (rapid initial rise with silky Ayurvedic deceleration)
  ease: [0.22, 1, 0.36, 1] as const,
  easeCss: 'cubic-bezier(0.22, 1, 0.36, 1)',

  // Purpose-driven durations
  durations: {
    fast: 0.3,  // Micro-interactions, hover shifts, tooltips, tags
    base: 0.7,  // Standard card reveals, text masks, section headings
    slow: 1.2,  // Hero editorial reveals, count-up counters, image clip-paths
  },

  // Stagger timing between sequential child elements
  stagger: 0.08,
} as const;
```

---

## 2. Reusable Primitives (`@/components/motion`)

### 1. `<Reveal>`
Scroll-triggered blur-reveal for cards, paragraphs, badge groups, and asymmetric sections.
- **Initial:** `opacity: 0`, `translateY: 28px` (or `x: ±28px`), `filter: blur(12px)`.
- **Target:** `opacity: 1`, `y: 0`, `blur: 0px`.
- **Trigger:** Fires once when **15%** of the element enters the viewport.

```tsx
import { Reveal } from '@/components/motion';

<Reveal delay={0.1} direction="up" blur={true}>
  <TreatmentCard item={treatment} />
</Reveal>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `delay` | `number` | `0` | Delay in seconds before triggering |
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'none'` | `'up'` | Initial offset direction |
| `distance` | `number` | `28` | Offset distance in pixels |
| `blur` | `boolean` | `true` | Whether to apply the subtle 12px blur-in |
| `duration` | `number` | `0.7` | Animation duration in seconds |
| `as` | `'div' \| 'section' \| 'p' \| ...` | `'div'` | Rendered HTML tag |

---

### 2. `<RevealText>`
Splits headings into lines (not letters). Each line is wrapped in an `overflow: hidden` mask and slides up with a gentle blur-in.

```tsx
import { RevealText } from '@/components/motion';

<RevealText
  as="h1"
  lines={[
    "Classical Ayurveda · Panchakarma",
    "Rooted in Charaka Samhita"
  ]}
  delay={0.1}
  stagger={0.08}
  className="font-display text-display-h1 text-deep-forest"
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lines` | `string[]` | `undefined` | Array of text strings rendered line-by-line |
| `children` | `React.ReactNode` | `undefined` | Multiline string (split by `\n`) or elements |
| `as` | `'h1' \| 'h2' \| 'h3' \| 'p'` | `'h2'` | Heading level tag |
| `stagger` | `number` | `0.08` | Stagger offset between sequential lines |
| `delay` | `number` | `0` | Base initial delay |

---

### 3. `<RevealImage>`
Clip-path inset reveal (arch, rectangle, circle, or bottom-left notch) with the image slowly scaling from `1.15` down to `1.0`.

```tsx
import { RevealImage } from '@/components/motion';

<RevealImage
  src="/images/treatments/shirodhara.jpg"
  alt="Shirodhara clinical therapy"
  shape="arch"
  aspectRatio="aspect-[4/5]"
  delay={0.2}
  duration={1.2}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | — | Image URL |
| `alt` | `string` | — | Image accessible alt description |
| `shape` | `'arch' \| 'rect' \| 'circle' \| 'bl-arch'` | `'rect'` | Botanical clip-path geometry |
| `duration`| `number` | `1.2` | Slow cinematic duration |
| `delay` | `number` | `0` | Initial delay |

---

### 4. `<CountUp>`
Smooth numerical increment counter utilizing `requestAnimationFrame` and the analytical `cubic-bezier(0.22, 1, 0.36, 1)` easing curve.

```tsx
import { CountUp } from '@/components/motion';

<CountUp
  target={18500}
  prefix=""
  suffix="+"
  duration={1.2}
  formatIndian={true}
  className="font-display text-4xl text-deep-forest"
/>
```

---

### 5. `<Magnetic>`
Subtle magnetic attraction effect for interactive CTA buttons. The element follows the user's cursor within a strict **8px** radius using a damped spring.
- **Desktop Only:** Automatically disabled on touch screens (`(pointer: coarse)`).
- **Reduced Motion Safe:** Disabled when `prefers-reduced-motion` is active.

```tsx
import { Magnetic } from '@/components/motion';
import { Button } from '@/components/ui/Button';

<Magnetic strength={0.22} maxDistance={8}>
  <Button href="/book" variant="primary">
    Book Consultation
  </Button>
</Magnetic>
```

---

## 3. Performance & GPU Execution Rules

1. **Only Animate Composited Properties:**
   - Permitted: `transform`, `opacity`, and `filter: blur(...)`.
   - Prohibited: Never animate `width`, `height`, `margin`, `padding`, `top`, `left`, or `border-width`.
2. **Selective Blur Application:**
   - Blur is applied strictly to isolated text blocks and media containers.
   - Prohibited: Never apply `filter: blur(...)` to full-width `<section>` or `<body>` wrappers.
3. **Automatic `will-change` Cleanup:**
   - `will-change: transform, opacity, filter` is attached only during the active motion frame.
   - Handled automatically via `onAnimationComplete={() => setIsAnimating(false)}`, resetting `will-change` to `auto` to free up GPU texture memory.
4. **Once-Only Viewport Execution:**
   - `useInViewOnce(0.15)` uses `IntersectionObserver` to trigger the animation once and disconnect immediately.
   - Eliminates layout thrashing and scroll battery drain.
5. **Strict `prefers-reduced-motion` Standard:**
   - All components immediately render the final state (`opacity: 1`, `transform: none`, `filter: none`) with zero duration and zero delay when reduced motion is detected.

---

## 4. First-Load Intro & Micro-Interaction Language

### 1. First-Load Intro (Preloader)
- **Session Cache:** Executed once per session via `sessionStorage.getItem('aarogyam_intro_shown')`.
- **Duration:** 1.8s maximum duration with zero LCP penalty (all page DOM is pre-rendered underneath).
- **Choreography:**
  - `0.0s – 0.5s`: Botanical leaf/mudra mark draws via SVG pathLength (`strokeDashoffset`).
  - `0.4s – 0.8s`: "Aarogyam" fades up with "आरोग्यम्" in small italic beneath.
  - `0.7s – 1.1s`: Thin turmeric line expands from center.
  - `1.15s – 1.8s`: Overlay curtain lifts upward via curved clip-path `inset(0% 0% 100% 0% round 0 0 60% 60%)`, revealing the hero headline and arch image in seamless continuity.
  - `1.8s`: Component unmounts cleanly and fires `aarogyam-intro-done`.

### 2. Micro-Interaction Language
- **Nav Links:** Hairline underline draws from left to right on hover (`scaleX: 0 -> 1` with `origin-left`); active route features a centered turmeric dot (`layoutId="activeNavDot"`).
- **Primary Buttons:** Slower bottom-wipe background fill (`group-hover:translate-y-0`), right arrow translation by 4px (`group-hover:translate-x-1`), and desktop magnetic cursor attraction.
- **Card Systems (Treatments, Blog, Doctors):**
  - Card elevation: 4px lift (`hover:-translate-y-1`).
  - Border transition: Shifts from subtle forest to turmeric (`hover:border-turmeric/60`).
  - Image scaling: Slow 1.06 zoom (`group-hover:scale-[1.06]` over 0.7s).
  - Image tone: Grayscale-to-color lift on hover (`grayscale-[20%] group-hover:grayscale-0`).
  - Corner glyph: Corner arrow circle fades in (`opacity-0 group-hover:opacity-100`).
- **Form Inputs:** Floating labels (animating from placeholder to upper mono label), smooth border color transition on focus, and soft turmeric focus ring (`focus:ring-2 focus:ring-turmeric/25 focus:border-turmeric`).
- **Hero Cursor Glow:** Low-opacity turmeric radial glow tracking mouse movement exclusively on desktop (`pointer: fine`).
- **Pranayama Breathing Float:** Botanical SVG leaf elements perform a continuous 7s breathing oscillation (6px vertical travel, 1.5° rotation), reflecting yogic pranayama rhythms.
- **WhatsApp Capsule:** Subtle concentric pulse ring firing every 6 seconds; expands on hover from a circle into an elegant rounded pill revealing *"Chat with us"*.
- **Section Transitions:** GSAP ScrollTrigger smoothly interpolates background colors between paper (`#F6F1E7`) and deep forest (`#14291C`) across scroll thresholds, preventing sharp visual breaks.
