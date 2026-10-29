# Design Spec: Responsive Multi-Device Overhaul, Professional Mobile Trader Widgets & PWA Hardening

- **Date:** 2026-10-29
- **Status:** Approved
- **Author:** BMAD Party Mode Team (Sally, Winston, John, Mary, Amelia)
- **Approved by:** Kevin (Project Owner)
- **Target Surfaces:** `app/page.tsx`, `apps/web/components/dashboard.tsx`, `app/docs/page.tsx`, `app/cli/page.tsx`, `app/globals.css`, `public/manifest.json`, `public/sw.js`, `app/layout.tsx`

---

## 1. Executive Summary & Objective

Vikoagent is an autonomous Solana Devnet paper-trading telemetry dashboard designed with a high-fidelity light claymorphism aesthetic. As the platform matures with live Binance candlestick data, radar token scanning, and agent reasoning streams, the user interface must deliver flawless responsiveness across all modern screen form factors.

This specification details the structural overhaul to eliminate five visual failure modes across all devices:
1. **Rusak (Broken / Clipped Elements)**
2. **Berdempetan (Cramped / Colliding Spacing)**
3. **Menumpuk (Awkward Stacking / Overlapping Z-Index)**
4. **Bertabrakan (Element Collisions & Font Truncation)**
5. **Hancur (Layout Disintegration & Horizontal Viewport Leaks)**

In addition, this specification defines a **professional mobile trader experience** complete with a floating glassmorphic Mobile Bottom App Dock, mobile widget tab segmentation, touch-first ergonomics (≥44px touch targets), and hardened Progressive Web App (PWA) capabilities.

---

## 2. The 5 Anti-Defect Invariants

| Defect | Root Cause in Current Codebase | Structural Resolution |
| :--- | :--- | :--- |
| **1. Rusak** | Monospace ASCII art in `/cli` breaks characters when wrapped via `wordBreak: break-all`; SVG chart widths in `ActivePositionDesk` overflow fixed bounding containers on narrow viewports (<400px). | Wrap ASCII banners in a scrollable horizontal container with fluid clamp font (`clamp(7px, 1.8vw, 11px)`); set all SVGs to `viewBox` dynamic auto-scaling with `preserveAspectRatio="xMidYMid meet"`. |
| **2. Berdempetan** | Static margins and paddings (`gap: 16px`, `padding: 24px`) cramp numbers in Treasury stats and `/cli` header buttons on small screens. | Implement fluid CSS clamp spacing (`padding: clamp(10px, 2.5vw, 24px)`, `gap: clamp(6px, 1.5vw, 14px)`); organize 4-metric stats into a clean 2×2 grid under 480px. |
| **3. Menumpuk** | Timeframe buttons (1m, 5m, 15m, 1h) and BTC/SOL asset switches in the Active Position Desk stack awkwardly on top of the candlestick price header; step pills in Mind Stream wrap without vertical clearance. | Refactor desk controls into a dedicated flex-wrap control bar with clear z-index hierarchy and minimum line-height clearances; add scroll-snap horizontal containment for step pills on mobile. |
| **4. Bertabrakan** | In Token Scanner rows, audit tags (`Zero Freeze`, `DBC Tier 2`), bonding curve progress bars, and Dev Hold percentages collide below 1100px before the 1024px breakpoint triggers. | Adopt container-aware flex-wrap and responsive column hiding (e.g. prioritizing Name + Price + Action on mobile, moving audit details to secondary metadata rows). |
| **5. Hancur** | Fixed 44-character Solana base58 contract addresses in `/docs` tables push viewport width beyond 100vw, triggering horizontal scroll blowout across the entire page body. | Apply `overflow-x: auto` containers with soft fade borders to all tables, coupled with `word-break: break-all` and copy-to-clipboard pills. Enforce `max-width: 100vw; overflow-x: hidden;` on `html, body`. |

---

## 3. Responsive Breakpoint Architecture

The design enforces standard responsive tiers:

```
[Mobile Small]     0px   -  399px   (iPhone SE, Galaxy A series, compact Android)
[Mobile Regular] 400px   -  640px   (iPhone 13/14/15/16 Pro, Pixel, standard mobile)
[Tablet Small]   641px   -  768px   (iPad Mini, small foldables, portrait tablets)
[Tablet Medium]  769px   - 1024px   (iPad Air/Pro portrait, laptops in split screen)
[Desktop Standard] 1025px - 1440px  (MacBook, 1080p desktop)
[Desktop Ultrawide] > 1440px        (1440p, 4K monitors; clamped at max 1480px with auto-centering)
```

### Design Tokens & Layout Rules per Tier:
1. **Mobile (< 640px)**:
   - Layout is strictly **Single Column** (`1fr`).
   - Sticky top navigation is streamlined: Brand + Devnet status pill + Quick Action.
   - Persistent **Floating Mobile Bottom Dock**: Quick access to Dashboard, Mind Stream, Radar, Terminal, and Docs.
   - Mind Stream vs Radar Scanner switches via a segmented tab control (`[🧠 Agent Stream] | [📡 Devnet Radar]`) to avoid infinite vertical scrolling fatigue.
   - PnL and Candlestick chart containers expand to full container width with touch-friendly crosshair indicators.
   - Safe-area insets applied at all edges (`--safe-top`, `--safe-bottom`, `--safe-left`, `--safe-right`).

2. **Tablet (641px – 1024px)**:
   - Hero grid stacks cleanly: Treasury on top, Active Position Desk below with generous vertical margin (20px).
   - Mind Split Grid collapses into stacked cards with full width for the Token Scanner table (with horizontal scroll if needed).
   - Bottom Two-Col (Best Setup & House Rules) collapses into 1-column stack.

3. **Desktop (≥ 1025px)**:
   - Full 2-column asynchronous claymorphism grid.
   - Treasury card (left) + Active Position Desk (right) in 1:1 balance.
   - Mind Split Grid: Agent Thinking Stream (left, 52%) + Radar Token Scanner (right, 48%).
   - Bottom Two-Col: Best Setup (50%) + House Rules & Invariants (50%).

---

## 4. Mobile Layout & Professional Trader Widgets

### 4.1 Floating Mobile Bottom App Dock
- Displayed only on screens `< 768px`.
- Fixed to bottom of screen: `position: fixed; bottom: 0; left: 0; right: 0; z-index: 100`.
- Background: Glassmorphic claymorphism (`rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(16px)` and subtle top border `1px solid var(--color-line)`).
- Padding: `8px 12px calc(8px + env(safe-area-inset-bottom, 0px)) 12px`.
- 5 Core Navigation Items:
  1. **Dashboard** (`#top` / Hero)
  2. **Mind** (`#mind-stream` thoughts)
  3. **Radar** (`#radar-scan` tokens)
  4. **CLI** (`/cli` terminal)
  5. **Docs** (`/docs` whitepaper)
- Active indicator pill with micro-glow and spring transition.

### 4.2 Segmented Mobile View for Mind Stream & Radar
- On screens `< 1024px`, the `#mind-stream` section provides an interactive Segmented Control:
  - Tab 1: **Agent Mind & News Feed** (shows real-time reasoning logs, model tokens, incoming news)
  - Tab 2: **Live Token Radar** (shows scanned pump.fun & meteora tokens, bonding progress, decisions)
- Eliminates page clutter and gives traders focused visibility on mobile.

### 4.3 Mobile-Optimized Active Position Desk
- Candlestick SVG chart responds fluidly to touch:
  - Pinch/pan disabled to prevent page zoom disruption.
  - Single finger drag activates the crosshair price & timestamp tooltip.
  - Asset switch (`[BTC] [SOL]`) and Timeframe switches (`[1m] [5m] [15m] [1h]`) expand to a clean row with 44px min-height touch targets.
  - Risk slider provides large thumb handle (24px) with clear visual feedback.

### 4.4 Mobile-Optimized Treasury Card
- 24h Performance Metrics (*Realized PnL, Win Rate, Total Trades, Devnet Fees*) adapt into a 2×2 symmetrical grid on mobile (< 480px).
- Timeframe pills (`1h | 24h | 7d | 30d | All`) scroll horizontally with smooth fade edge.
- PnL Area chart adjusts SVG viewBox dynamically without truncation.

---

## 5. PWA (Progressive Web App) Hardening

### 5.1 Web App Manifest (`public/manifest.json`)
- Ensure valid PWA standards:
  - `name`: "Viko - Sovereign Devnet Paper Trader"
  - `short_name`: "Viko"
  - `start_url`: "/"
  - `id`: "/"
  - `display`: "standalone"
  - `display_override`: ["window-controls-overlay", "standalone", "minimal-ui"]
  - `orientation`: "any"
  - `theme_color`: "#0b0e14"
  - `background_color`: "#f6f7f9"
  - `categories`: ["finance", "utilities", "productivity"]
  - Complete multi-size icons (128x128, 256x256, 512x512) and maskable purpose.
  - App shortcuts: "Live Terminal", "Radar Scanner", "Documentation".

### 5.2 Service Worker (`public/sw.js`)
- Static cache for core brand assets, fonts, and icons.
- Network-first caching strategy for dynamic API routes (`/api/*`) and Next.js static asset bundles (`/_next/*`).
- Offline fallback response for API routes and static pages when no internet is present.

### 5.3 In-App PWA Install Pill / Promotion
- A sleek, non-intrusive mobile install prompt component:
  - Listens for `beforeinstallprompt` event on supported mobile browsers.
  - Renders a floating pill or header button: `[📲 Install App]`.
  - Can be dismissed permanently or snoozed.

---

## 6. Page-by-Page Responsive Verification

### 6.1 Main Dashboard (`/` & `apps/web/components/dashboard.tsx`)
- Container padding: `clamp(10px, 3vw, 24px)`.
- Full elimination of fixed pixel widths in grid children.
- Safe margin at bottom to accommodate the Mobile Bottom Dock (`padding-bottom: 96px` on `< 768px`).

### 6.2 Documentation Page (`app/docs/page.tsx`)
- Mobile sticky horizontal pill bar with active indicator.
- All code blocks and contract address tables wrapped in `docs-table-wrapper` with `overflow-x: auto` and `word-break: break-all`.
- Typography scaled cleanly: `h1` at `clamp(24px, 5vw, 42px)`, body at `14px-15px`.

### 6.3 CLI Proof Engine (`app/cli/page.tsx`)
- Header buttons wrap into 2 lines on `< 540px` with gap spacing.
- ASCII Banner wrapped in `.cli-banner-container` with `overflow-x: auto` and fluid monospace font clamp.
- Terminal log window adapts height to screen viewport (`height: clamp(380px, 55vh, 600px)`).

---

## 7. Verification & Acceptance Criteria

1. **Deterministic Test Verification**: All 94 existing Vitest tests continue to pass without error.
2. **Lint & Build Verification**: `npm run lint` and `npm run build` succeed with zero errors.
3. **Multi-Device Inspection**:
   - iPhone SE / Mobile (375px width): Zero horizontal blowout, zero overlapping text, touch targets ≥ 44px.
   - Mobile Regular (414px width): Bottom dock renders cleanly, segmented tab switches smoothly between Mind Stream and Token Radar.
   - Tablet (768px - 1024px): Seamless transition from stacked to dual-column without colliding pills or clipped charts.
   - Desktop (1440px+): Preserves rich claymorphism, crisp shadows, and interactive hover crosshairs.
4. **PWA Invariant**: PWA audit in browser DevTools confirms valid manifest, registered service worker, and standalone display capability.
