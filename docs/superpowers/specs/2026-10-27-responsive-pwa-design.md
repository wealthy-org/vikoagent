# Specification: Responsive Across All Devices & Professional PWA Support

## 1. Overview & Objectives

This specification defines the responsive design system and Progressive Web App (PWA) implementation for Vikoagent across all pages (`/` and `/docs`).

### Core Objectives:
1. **Zero Collision & Overflow Invariant**: Eliminate any instances of elements colliding, cramped typography, stacked layout breakage, or horizontal viewport overflow across all screen sizes (320px mobile to 4K ultrawide).
2. **Professional Mobile Widget UX**: Structure mobile components into purpose-built touch-friendly widgets with comfortable 44px tap targets, momentum scrolling for timelines, and adaptive card representations.
3. **Full Progressive Web App (PWA) Support**: Enable installation on Android, iOS, and desktop browsers with a Web App Manifest, Service Worker caching, app icons, and safe-area support.
4. **Safety & Policy Invariants**: Retain all Devnet paper-trading guarantees (`DEVNET`, `PAPER MODE`, read-only telemetry, zero mainnet execution).

---

## 2. Responsive Breakpoints & Viewport Policy

| Device Class | Viewport Range | Layout Strategy |
|---|---|---|
| **Compact Mobile** | 320px – 480px | Single-column fluid stack, compact 2-line token widgets, horizontal swipeable timeline chips, compact pill nav |
| **Phablet / Foldable** | 481px – 640px | Single-column with expanded card padding, side-by-side header pills |
| **Tablet Portrait** | 641px – 768px | 2-column hero transitions, sticky section pills on `/docs` |
| **Tablet Landscape / Small Laptop** | 769px – 1024px | 2-column hero, 2-column Mind Stream, side-by-side scanner & receipts |
| **Standard Desktop** | 1025px – 1440px | Full 2-column sovereign trader layout matching kivoagent reference |
| **Ultrawide** | > 1440px | Centered container max-width 1200px with soft ambient blur margins |

### Root Viewport Invariants:
```css
html, body {
  max-width: 100vw;
  overflow-x: clip; /* completely prevents horizontal blowout */
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100%;
}
```

---

## 3. Component-by-Component Mobile & Responsive Specifications

### A. Floating Capsule Navbar (`.nav-capsule`)
- **Current Issue**: Below 768px, navbar stacked vertically into a bulky 3-line column.
- **New Mobile Spec**:
  - Maintained as a single horizontal floating glass capsule.
  - Brand orb (28px) + `vikoagent` title on the left.
  - Center "thinking" spinner reduced to a subtle pulsating iris indicator.
  - Right actions: `Docs` and `Connect` pill buttons placed side-by-side with compact 4px 10px padding and 11px font size.

### B. Treasury Card (`#treasury-section`)
- **Desktop (>= 640px)**:
  - Left: `TREASURY` label, `1D 1W 1M ALL` switcher, `$3,380.23` Big NAV, single-line pills (`+$5.88 · +0.17% trading +$2,376 fees in`).
  - Right: 4 Inset Stat Tiles in a 2x2 grid (`TRADES`, `WIN RATE`, `REALIZED`, `PAPER FARMED`).
- **Mobile (< 640px)**:
  - Top line: `TREASURY` on left, `1D 1W 1M ALL` switcher on right.
  - Second line: Big NAV `$3,380.23`.
  - Third line: Horizontal pill badges with `white-space: nowrap; overflow-x: auto; scrollbar-width: none`.
  - Fourth block: 4 Inset Stat Tiles in a 2x2 grid with equal 50% width and 8px touch spacing.
  - Chart area: SVG Stepped Staircase Chart with `viewBox="0 0 520 205"`, `width: 100%`, `height: auto`, maintaining all fee nodes, dashed lines, and black `$2,534` badge.

### C. Mind Stream Section (`#mind-stream`)
- **Header**:
  - `(🌐) MIND` iris badge and status headline. Price badges (`🟠 79,614.5`, `🟣 2,304.65`) wrapped cleanly on mobile without overlapping title.
- **Rounds Track (14 dots)**:
  - Wrapped with horizontal momentum scrolling (`overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;`).
  - Subtle edge masks indicate horizontal scrollability.
- **24 Holds Timeline**:
  - Horizontal chip track enabled for smooth finger-swiping.
- **Accordion Checklists**:
  - Expanding details have minimum 44px tap target height with animated rotating chevrons (`⌄`).

### D. Token Scanner & Audit Receipts (`.bottom-two-col`)
- **Category Tabs**:
  - Horizontal swipeable tabs with active indicator pill.
- **Token Scanner Rows**:
  - On desktop: 1-line tabular layout.
  - On mobile (< 600px): Transforms into a 2-tier card widget:
    - Tier 1: Token name, symbol, dev hold %, and age.
    - Tier 2: Bonding curve progress trough (flex-1) + status pill (`ACCEPTED` / `WATCHING` / `REJECTED`).
  - Eliminates horizontal text crushing.
- **Receipts Audit Rows**:
  - Displays token, timestamp, trade type, and Devnet explorer link with proper word-breaking.

### E. Mountains Footer Watermark
- Giant `VIKOAGENT` background text constrained to `max-width: 100%; overflow: hidden;` so it cannot cause horizontal scrollbars on mobile.
- Glass footer capsule converts into a clean vertical stack on mobile: Brand on top, action buttons wrapped neatly, Devnet safety disclaimer at bottom.

### F. Documentation Page (`/docs`)
- **Mobile Sticky Section Pill Bar**:
  - On screens < 1024px where the sidebar is hidden, render a sticky horizontal bar with category pills:
    `[In one minute] [The agent] [Step by step] [Where it trades] [House rules]...`
  - Allows mobile readers to jump to any section with a single tap.
- **Tables & Flowcards**:
  - Wrapped in `.docs-table-wrapper` with horizontal scroll to prevent overflow.
  - StepFlow arrows wrapped in flex container so arrows and step pills never truncate.

---

## 4. Progressive Web App (PWA) Architecture

### Files & Assets:
1. **`public/manifest.json`**:
   - `name`: "Vikoagent - Sovereign Devnet Paper Trader"
   - `short_name`: "Vikoagent"
   - `start_url`: "/"
   - `display`: "standalone"
   - `background_color`: "#f8fafc"
   - `theme_color`: "#0b0e14"
   - `icons`:
     - 192x192 PNG (`/brand/pwa-icon-192.png`)
     - 512x512 PNG (`/brand/pwa-icon-512.png`)
     - 180x180 PNG (`/brand/apple-touch-icon.png`)
2. **`public/sw.js` (Service Worker)**:
   - Cache static assets (`/brand/viko-orb.jpeg`, `/globals.css`, font files).
   - Network-first strategy for live telemetry and PumpPortal endpoints.
   - Offline fallback shell so app opens reliably even with weak mobile signal.
3. **`app/layout.tsx` Header Meta**:
   - `<link rel="manifest" href="/manifest.json" />`
   - `<meta name="theme-color" content="#0b0e14" />`
   - `<meta name="apple-mobile-web-app-capable" content="yes" />`
   - `<meta name="apple-mobile-web-app-status-bar-style" content="default" />`
   - Service worker registration client script.

---

## 5. Verification & Test Plan

1. **Vitest Unit Test Suite**: Execute `npm test` to verify all 78 unit tests pass without regression.
2. **ESLint Code Quality**: Run `npm run lint` to guarantee zero errors or warnings.
3. **Next.js Production Build**: Run `npm run build` to verify clean production compilation.
4. **Multi-Device Browser Subagent Verification**:
   - iPhone SE / Pixel (375x667 & 390x844): Verify zero horizontal overflow, single-row capsule nav, 2x2 treasury tiles, responsive stepped chart, token cards.
   - iPad / Tablet (768x1024): Verify smooth 2-column / 1-column responsive transition.
   - Desktop (1280x800 & 1440x900): Verify pixel-perfect parity with reference.
   - Documentation `/docs`: Verify mobile sticky section navigator.
   - PWA Manifest & Service Worker: Verify `manifest.json` and `sw.js` load with HTTP 200 and valid JSON.
5. **Task Progress Logging**: Append Progress Block 059 to `Task Breakdown Record.md`.
