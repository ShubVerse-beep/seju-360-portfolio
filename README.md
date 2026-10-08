<div align="center">

# SEJAL RAI — PORTFOLIO

**A dark, motion-first personal site for an App Developer · XR Creator · Web Designer**

*Boot sequence → scroll-scrubbed 360° hero → horizontal project gallery → live payload contact form*

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![pnpm](https://img.shields.io/badge/pnpm-12-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

<br/>

[**Quick Start**](#-getting-started) · [**Content file**](./lib/content.ts) · [**Structure**](#-project-structure)

</div>

---

<div align="center">

## TABLE OF CONTENTS

[Overview](#-overview) · [Tech Stack](#-tech-stack) · [Design System](#-design-system) · [Features](#-feature-map) · [Animation Catalog](#-animation-catalog) · [Structure](#-project-structure) · [Getting Started](#-getting-started) · [Editing Content](#-editing-content) · [Accessibility](#-accessibility--performance) · [Frame Pipeline](#-hero-frame-pipeline)

</div>

---

## OVERVIEW

A single-page portfolio built with the **Next.js App Router**, engineered around one idea: *the page performs*. It opens with a scripted boot overlay, hands off to a pinned canvas sequence that rotates the subject 360° under scroll control, and continues through parallax, marquee, and horizontal-scroll sections before landing on a contact form that live-renders its own JSON payload.

| | |
|---|---|
| **Rendering** | Next.js 16 App Router, React 19 Server Components + `"use client"` islands |
| **Bundler** | Turbopack (dev), zero-config |
| **Motion** | GSAP 3.15 + ScrollTrigger + `@gsap/react` (`useGSAP`) |
| **Scrolling** | Lenis smooth-scroll, wired into the GSAP ticker |
| **Styling** | Tailwind CSS 4 (CSS-first `@theme`), shadcn/ui, `tw-animate-css` |
| **Analytics** | Vercel Analytics (production only) |

---

## TECH STACK

<table>
  <tr>
    <td width="50%">

### CORE

| Layer | Tool |
|---|---|
| Framework | **Next.js 16.4** (App Router, Turbopack) |
| UI library | **React 19** (`react`, `react-dom`) |
| Language | **TypeScript 5.7** (strict path aliases `@/*`) |
| Package manager | **pnpm 12** (workspace + lockfile) |

    </td>
    <td width="50%">

### STYLING

| Layer | Tool |
|---|---|
| Utility CSS | **Tailwind CSS 4** via `@tailwindcss/postcss` |
| Component kit | **shadcn/ui** + **Base UI React** |
| Variants | **class-variance-authority** |
| Class merging | **clsx** + **tailwind-merge** |
| Keyframe pack | **tw-animate-css** |

    </td>
  </tr>
  <tr>
    <td width="50%">

### MOTION & ICONS

| Layer | Tool |
|---|---|
| Animation | **GSAP 3.15** + `ScrollTrigger` |
| React binding | **@gsap/react** (`useGSAP`) |
| Smooth scroll | **Lenis 1.3** |
| Icons | **lucide-react** |

    </td>
    <td width="50%">

### FONTS & TOOLING

| Layer | Tool |
|---|---|
| Display font | **Space Grotesk** (`next/font/google`) |
| Mono font | **JetBrains Mono** (`next/font/google`) |
| Analytics | **@vercel/analytics** |
| Asset pipeline | **Python 3** — Pillow, NumPy, SciPy |

    </td>
  </tr>
</table>

---

## DESIGN SYSTEM

Everything is tokenised in [`app/globals.css`](./app/globals.css) as Tailwind 4 CSS variables — no `tailwind.config.ts` needed.

### Palette

| Token | Hex | Role |
|---|---|---|
| `--background` | `#07060B` | Near-black canvas, `themeColor` |
| `--foreground` | `#F2F0F7` | Primary text |
| `--accent` | `#A78BFA` | Violet highlight, focus ring, selection |
| `--status` | `#34D399` | "Open to opportunities" pulse dot |
| `--muted-foreground` | `#A6A1B8` | Secondary text |
| `--border` | `rgba(255,255,255,.1)` | Hairline dividers |

### Signature treatments

| Treatment | Implementation |
|---|---|
| **Aurora background** | `.bg-aurora` — layered violet radial gradients over `#07060b` |
| **Film grain** | `.grain::after` — inline SVG `feTurbulence` noise at 6% opacity |
| **Glassmorphism** | `.glass` — white/4 fill + `backdrop-blur(14px)` + hairline border |
| **Outlined type** | `.text-outline` — `-webkit-text-stroke` on the rotating hero roles |
| **Gradient wordmark** | Footer name at `19vw`, clipped gradient fading to transparent |
| **Radius scale** | `--radius: 1rem` → `sm…3xl` via `calc()` multipliers |

---

## FEATURE MAP

```
Experience   boot overlay · progress % · asset-gated loader · Lenis init
Nav         fixed glass pill · desktop links · mobile sheet · "Hire Me"
Hero        120-frame scroll-scrub canvas · 3D skill orbit · role rotator
About       3D photo card with scrubbed parallax · bio · stat tiles
TechMarquee two counter-rotating skill rows · pause on hover · edge mask
Expertise   4 numbered capability cards with stack chips
Projects    pinned horizontal gallery · perspective card emphasis
Journey     experience timeline · certification cards
Contact     form + live JSON payload preview · mailto dispatch
Footer      status grid · giant gradient name · back-to-top
```

### Section-by-section

<details>
<summary><b>1 · Experience — the boot sequence</b></summary>

<br/>

- Full-screen `role="status"` overlay with a percentage counter
- Minimum display time of **1800 ms**, capped at **90%** until the profile photo **and** web fonts resolve
- Initializes **Lenis** (`lerp: 0.09`, `smoothWheel`), paused until boot completes
- Exit: staggered item lift → overlay slides `-100%` on `expo.inOut` → dispatches `portfolio:ready` → `ScrollTrigger.refresh()`
- Intercepts in-page anchor clicks and routes them through `lenis.scrollTo(..., { duration: 1.4 })`

</details>

<details>
<summary><b>2 · Hero — scroll-scrubbed 360° canvas</b></summary>

<br/>

- `<canvas>` driven by **120 WebP frames** (`630 × 623`) preloaded by [`lib/frame-sequence.ts`](./lib/frame-sequence.ts)
- Section **pins** for `+260%` scroll on desktop (`+180%` mobile) with `scrub: 0.6`
- Simultaneously animates: frame playhead → skill ring `rotateY: -540°`, headline `scale: 1.25`, progress bar, stage fade-out
- **3D orbit** — 10 skill chips positioned with `rotateY(n) translateZ(var(--orbit-r))` under `preserve-3d`
- **Pointer rig** — `gsap.quickTo` parallax on `pointer:fine` devices only (±8° / ±5°)
- **RoleSwitcher** — cycles *App Developer / XR Creator / Web Designer* every 2.8 s with a masked vertical roll

</details>

<details>
<summary><b>3 · Projects — horizontal scroll gallery</b></summary>

<br/>

- Desktop: section pins, the card track translates by `scrollWidth - innerWidth` with `scrub: 1` + `invalidateOnRefresh`
- Each card is re-evaluated every frame — distance from viewport center drives `rotateY` (±28°), `scale`, and `opacity` for a coverflow-style emphasis
- Mobile: native `snap-x snap-mandatory` horizontal scrolling instead of pinning

</details>

<details>
<summary><b>4 · Contact — live payload preview</b></summary>

<br/>

- Controlled form (first/last name, email, message, consent checkbox)
- A `payload_preview.json` terminal panel re-renders on every keystroke with syntax-colored values
- Submit composes a `mailto:` URL with an encoded subject/body — no backend required

</details>

---

## ANIMATION CATALOG

| # | Effect | Where | Technique |
|---|---|---|---|
| 1 | Boot overlay exit | `experience.tsx` | GSAP timeline, staggered `y: -30` + `yPercent: -100` |
| 2 | Smooth scrolling | `experience.tsx` | Lenis RAF bound to `gsap.ticker`, synced via `ScrollTrigger.update` |
| 3 | Intro choreography | `hero.tsx` | `expo.out` timeline, gated on the `portfolio:ready` event |
| 4 | 360° frame scrub | `hero.tsx` | Pinned ScrollTrigger writing into a canvas playhead object |
| 5 | Skill orbit rotation | `hero.tsx` | `rotateY: -540°` on a `preserve-3d` ring |
| 6 | Pointer parallax | `hero.tsx` | `gsap.quickTo` on a 3D rig (fine pointers only) |
| 7 | Role rotator | `role-switcher.tsx` | CSS transforms + `cubic-bezier(0.16,1,0.3,1)` roll |
| 8 | Photo card settle | `about.tsx` | `fromTo` scrub — `rotateZ/rotateY/y` → rest |
| 9 | Skill marquees | `tech-marquee.tsx` | CSS keyframes, opposite directions, `animation-play-state: paused` on hover |
| 10 | Card coverflow | `projects.tsx` | Pinned horizontal track + per-frame distance math |
| 11 | Section reveals | `reveal-init.tsx` | `ScrollTrigger.batch` on `[data-reveal]`, 88% start, `once: true` |
| 12 | Status pulse | `globals.css` | `box-shadow` ring keyframe on the footer/about dot |

> **Every effect is disabled under `prefers-reduced-motion: reduce`** — the loader shortens to 300 ms and all GSAP/ScrollTrigger setup is skipped via `prefersReducedMotion()`.

---

## PROJECT STRUCTURE

```
Seju_portfolio/
├── app/
│   ├── layout.tsx           # Root layout · fonts · metadata · Vercel Analytics
│   ├── page.tsx             # Single page: section composition + skip link
│   └── globals.css          # Tailwind 4 @theme, tokens, utilities, keyframes
├── components/
│   ├── portfolio/
│   │   ├── experience.tsx   # Boot loader + Lenis initialization
│   │   ├── nav.tsx          # Fixed glass navigation pill
│   │   ├── hero.tsx         # Canvas frame sequence + 3D orbit
│   │   ├── role-switcher.tsx# Rotating job titles
│   │   ├── about.tsx        # Bio, stats, 3D photo card
│   │   ├── tech-marquee.tsx # Counter-scrolling skill rows
│   │   ├── expertise.tsx    # Capability cards
│   │   ├── projects.tsx     # Pinned horizontal gallery
│   │   ├── journey.tsx      # Timeline + certifications
│   │   ├── contact.tsx      # Form + JSON payload preview
│   │   ├── footer.tsx       # Status grid + gradient wordmark
│   │   ├── reveal-init.tsx  # Global ScrollTrigger reveal batch
│   │   └── section-tag.tsx  # Section eyebrow + Chip primitives
│   └── ui/
│       └── button.tsx       # shadcn/CVA button
├── lib/
│   ├── content.ts           # ← ALL site copy lives here
│   ├── frame-sequence.ts    # 120-frame canvas renderer
│   ├── gsap.ts              # Plugin registration + helpers
│   └── utils.ts             # cn() class merger
├── public/
│   ├── hero-frames/         # 000–119.webp (630×623 alpha sequence)
│   └── images/sejal.jpg     # Profile photo
├── scripts/
│   └── key-frames.py        # Video → masked WebP frame pipeline
├── app/globals.css          # Design tokens & utilities
├── next.config.mjs          # unoptimized images, ignored build errors
├── components.json          # shadcn/ui config
└── tsconfig.json            # TS 5.7 + @/* path alias
```

---

## GETTING STARTED

### Prerequisites

- **Node.js** ≥ 20
- **pnpm 12** (`corepack enable pnpm`)

### Install & run

```bash
pnpm install     # restore dependencies from lockfile
pnpm dev         # start dev server → http://localhost:3000
```

### Production

```bash
pnpm build       # optimized production build (Turbopack)
pnpm start       # serve the build
```

| Script | Purpose |
|---|---|
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |

### Deploy

Out-of-the-box **Vercel** deployment — push the repo and import it. `@vercel/analytics` activates automatically when `NODE_ENV === "production"`.

---

## EDITING CONTENT

You never need to touch component code to update the site. **Everything lives in [`lib/content.ts`](./lib/content.ts):**

```ts
export const profile    = { name, role, roles, tagline, bio, email, phone, linkedin, photo }
export const stats      = [{ value, label, sub }]
export const skillsRowA = ["Flutter", "Dart", ...]   // marquee row 1 + hero orbit
export const skillsRowB = ["AR / VR", "Unity", ...]  // marquee row 2
export const expertise  = [{ id, title, description, chips }]
export const projects   = [{ id, title, year, status, description, stack, liveUrl, repoUrl }]
export const experience = [{ role, org, period, points }]
export const certifications = [{ title, issuer, date }]
export const navLinks   = [{ href, label }]
```

> Project links: paste URLs into `liveUrl` / `repoUrl`. Leave them as `""` and the card renders a disabled **"· soon"** pill instead of a broken link.

To restyle globally, edit the CSS variables under `:root` in [`app/globals.css`](./app/globals.css) — accent, radius, and status colors cascade everywhere.

---

## ACCESSIBILITY & PERFORMANCE

**Accessibility**
- Skip-to-content link as the first focusable element
- Semantic `<section>`s with `aria-labelledby` heading wiring
- `aria-live` regions on the loader (`role="status"`) and contact form status
- Mobile menu exposes `aria-expanded` / `aria-controls`
- Decorative canvases, orbits, and ornaments marked `aria-hidden`
- Full `prefers-reduced-motion` fallback for every animation
- Keyboard-visible focus via `outline-ring` + accent focus rings

**Performance**
- Canvas frames preload asynchronously (`decoding="async"`), first frame paints immediately
- Loader gates completion on real asset readiness, not a fake timer alone
- `ScrollTrigger.refresh()` on `window.load` compensates for late layout shifts
- Google Fonts self-hosted through `next/font` (no render-blocking request)
- 120 WebP frames (~78 quality, alpha) — the only heavyweight payload, isolated to the hero
- Images set to `unoptimized` in [`next.config.mjs`](./next.config.mjs)

---

## HERO FRAME PIPELINE

The 360° hero sequence is generated offline by [`scripts/key-frames.py`](./scripts/key-frames.py):

```
raw video frames (.png)
   → luminance threshold + morphological cleanup (SciPy ndimage)
   → largest connected component → bounding-box crop (+24px pad)
   → feathered alpha (eroded core ∪ soft edge band, hole-filled)
   → LANCZOS downscale (0.6×) → WebP q78 / alpha q85
   → public/hero-frames/000.webp … 119.webp
```

```bash
pip install pillow numpy scipy
python scripts/key-frames.py ./public/hero-frames 0.6
```

Frame geometry is declared once in [`lib/frame-sequence.ts`](./lib/frame-sequence.ts):

```ts
export const FRAME_COUNT  = 120
export const FRAME_WIDTH  = 630
export const FRAME_HEIGHT = 623
```

---

<div align="center">

**BUILT WITH**

`Next.js` · `React 19` · `TypeScript` · `Tailwind CSS 4` · `shadcn/ui` · `GSAP + ScrollTrigger` · `Lenis` · `lucide-react` · `Vercel Analytics`

---

<sub>Designed & developed for Sejal Rai · Portfolio 2026 · Palghar, Mumbai, IN</sub>

</div>
# seju-360-portfolio
