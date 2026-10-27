# Responsive Across All Devices & Professional PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide zero-collision, non-overflowing responsive layouts across mobile, tablet, and desktop for the Dashboard and Docs pages, paired with professional mobile widget UX and full PWA support (Manifest, Service Worker, and icons).

**Architecture:** Pure Vanilla CSS responsive overhaul with mobile-first widget adaptations and fluid typography, accompanied by standard Web App Manifest, Service Worker caching for offline resilience, and client-side registration.

**Tech Stack:** Next.js 16.4.1 (Turbopack), TypeScript, Vanilla CSS (tokens and claymorphism), Service Worker API, Web App Manifest.

## Global Constraints

- Never enable mainnet, wallet signing, or real-fund execution.
- Maintain `DEVNET` and `PAPER MODE` labels in DOM.
- Pure Vanilla CSS only; no Tailwind CSS classes.
- All 78 Vitest unit tests across 31 test files must pass.
- ESLint must remain clean with 0 errors and 0 warnings.
- Production build (`npm run build`) must compile cleanly.
- Append progress to `Task Breakdown Record.md` (append-only).

---

### Task 1: Viewport & Core Responsive CSS Protection

**Files:**
- Modify: `apps/web/app/globals.css:1-60`
- Test: `tests/ui-contract.test.ts`

**Interfaces:**
- Consumes: Root HTML element styling.
- Produces: `overflow-x: clip`, safe-area insets, fluid typography variables.

- [x] **Step 1: Inspect and update root viewport rules**
  In `apps/web/app/globals.css`, add root overflow-x protection and safe-area custom properties:
  ```css
  :root {
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --safe-left: env(safe-area-inset-left, 0px);
    --safe-right: env(safe-area-inset-right, 0px);
  }

  html, body {
    max-width: 100vw;
    overflow-x: clip;
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
  }
  ```

- [x] **Step 2: Run tests to ensure no regressions**
  Run: `npm test`
  Expected: All 78 tests pass.

- [x] **Step 3: Run linter**
  Run: `npm run lint`
  Expected: Clean.

---

### Task 2: Floating Capsule Navbar Mobile Responsive Overhaul

**Files:**
- Modify: `apps/web/app/globals.css:215-280` and `apps/web/components/dashboard.tsx:470-510`
- Test: `tests/ui-contract.test.ts`

**Interfaces:**
- Consumes: `.nav-capsule`, `.nav-brand-wrap`, `.nav-center-pill`, `.nav-right-actions`.
- Produces: Single-line compact floating capsule on all viewports without multi-line wrapping.

- [x] **Step 1: Update Navbar CSS for compact mobile representation**
  Update `.nav-capsule` in `apps/web/app/globals.css`:
  ```css
  .nav-capsule {
    position: sticky;
    top: max(16px, var(--safe-top));
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-radius: var(--radius-pill);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 4px 20px rgba(17, 19, 24, 0.05);
  }

  @media (max-width: 640px) {
    .nav-capsule {
      padding: 6px 12px;
      gap: 8px;
    }
    .nav-brand-title {
      font-size: 13px;
    }
    .nav-orb-img {
      width: 24px;
      height: 24px;
    }
    .nav-center-pill {
      display: none; /* Hide verbose text, show icon or clean flow */
    }
    .nav-pill-btn {
      padding: 4px 10px;
      font-size: 11px;
    }
  }
  ```

- [x] **Step 2: Verify in dashboard.tsx**
  Ensure navbar elements maintain accessible labels while staying compact.

- [x] **Step 3: Run test suite and lint**
  Run: `npm test && npm run lint`
  Expected: PASS.

---

### Task 3: Treasury & Stepped Chart Adaptive Mobile Widget

**Files:**
- Modify: `apps/web/app/globals.css:370-510`
- Modify: `apps/web/components/dashboard.tsx:550-685`
- Test: `tests/ui-contract.test.ts`

**Interfaces:**
- Consumes: `.treasury-clay-card`, `.treasury-top-row`, `.treasury-tiles-grid`, `.chart-svg-element`.
- Produces: 2-column on desktop, clean stacked widget on mobile with 2x2 stat tiles and fluid SVG stepped chart.

- [x] **Step 1: Update Treasury responsive layout rules in globals.css**
  ```css
  @media (max-width: 640px) {
    .treasury-clay-card {
      padding: 20px 16px;
    }
    .treasury-top-row {
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }
    .treasury-title-group {
      width: 100%;
      justify-content: space-between;
    }
    .treasury-big-nav {
      font-size: 34px;
    }
    .treasury-pills-row {
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      max-width: 100%;
    }
    .treasury-tiles-grid {
      width: 100%;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .stat-inset-tile {
      padding: 8px 10px;
      min-height: 48px;
    }
  }
  ```

- [x] **Step 2: Verify stepped SVG chart scalability**
  Ensure `chart-svg-element` has `width: 100%; height: auto; max-height: 220px; display: block;` and viewBox coordinates render identically across all screen widths.

- [x] **Step 3: Run test suite and lint**
  Run: `npm test && npm run lint`
  Expected: PASS.

---

### Task 4: Mind Stream, Timeline Strip & Checklists Mobile Enhancements

**Files:**
- Modify: `apps/web/app/globals.css:610-850`
- Modify: `apps/web/components/dashboard.tsx:750-950`
- Test: `tests/ui-contract.test.ts`

**Interfaces:**
- Consumes: `.mind-master-card`, `.mind-rounds-strip`, `.earlier-holds-strip`, `.mind-split-grid`.
- Produces: Touch-momentum horizontal scrollable strips and responsive 1-column card stack on mobile.

- [x] **Step 1: Update Mind Stream CSS for mobile swipe and touch**
  ```css
  .mind-rounds-strip {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    padding: 4px 0;
  }
  .mind-rounds-strip::-webkit-scrollbar {
    display: none;
  }

  .earlier-holds-strip {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
  .earlier-holds-strip::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    .mind-split-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  @media (max-width: 640px) {
    .mind-master-card {
      padding: 20px 16px;
    }
    .mind-headline-text {
      font-size: 18px;
    }
  }
  ```

- [x] **Step 2: Verify touch targets and accordion toggling**
  Verify `toggleStep`, `showWhy`, and `showEarlierHolds` work cleanly on touch devices.

- [x] **Step 3: Run test suite and lint**
  Run: `npm test && npm run lint`
  Expected: PASS.

---

### Task 5: Token Scanner & Audit Receipts Mobile Card Transformations

**Files:**
- Modify: `apps/web/app/globals.css:1460-1550`
- Modify: `apps/web/components/dashboard.tsx:1100-1280`
- Test: `tests/ui-contract.test.ts`

**Interfaces:**
- Consumes: `.scanner-token-row`, `.receipt-audit-row`, `.scanner-category-tabs`.
- Produces: 2-tier card layout on mobile preventing text squashing and horizontal collisions.

- [x] **Step 1: Add mobile responsive rules for token rows**
  ```css
  @media (max-width: 640px) {
    .scanner-token-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
    }
    .scanner-token-row-tier1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .scanner-token-row-tier2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 12px;
    }
    .bonding-bar-shell {
      flex: 1;
    }
    .receipt-audit-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding: 10px 12px;
    }
  }
  ```

- [x] **Step 2: Update markup in dashboard.tsx**
  Wrap token scanner rows with responsive tier structure so desktop remains tabular while mobile stacks into clean 2-tier cards.

- [x] **Step 3: Run test suite and lint**
  Run: `npm test && npm run lint`
  Expected: PASS.

---

### Task 6: Documentation Page (`/docs`) Mobile Sticky Section Navigator & Table Wrapper

**Files:**
- Modify: `apps/web/app/globals.css:1600-1950`
- Modify: `app/docs/page.tsx:1-120`
- Test: `tests/ui-contract.test.ts`

**Interfaces:**
- Consumes: `SECTIONS` array in `app/docs/page.tsx`.
- Produces: Sticky mobile category navigator with tap-to-jump on screens < 1024px, plus responsive table overflow wrappers.

- [x] **Step 1: Add mobile sticky section navigator in app/docs/page.tsx**
  Render a scrollable pill bar on mobile (< 1024px) linking directly to `#summary`, `#agent`, etc. with active scroll-spy highlight:
  ```tsx
  <nav className="docs-mobile-pill-bar" aria-label="Mobile section navigation">
    {SECTIONS.map(([id, label]) => (
      <a
        key={id}
        href={`#${id}`}
        className={`docs-mobile-pill ${activeSection === id ? 'active' : ''}`}
      >
        {label}
      </a>
    ))}
  </nav>
  ```

- [x] **Step 2: Add styles in globals.css for docs mobile navigation & table scroll**
  ```css
  .docs-mobile-pill-bar {
    display: none;
  }

  @media (max-width: 1024px) {
    .docs-mobile-pill-bar {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      position: sticky;
      top: 60px;
      z-index: 30;
      background: rgba(248, 250, 252, 0.95);
      backdrop-filter: blur(12px);
      padding: 8px 16px;
      margin: 0 -16px 24px;
      border-bottom: 1px solid var(--color-line);
    }
    .docs-mobile-pill {
      font-family: var(--font-mono);
      font-size: 11px;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      background: #ffffff;
      border: 1px solid var(--color-line);
      color: var(--color-ink-2);
      white-space: nowrap;
      text-decoration: none;
    }
    .docs-mobile-pill.active {
      background: var(--color-iris);
      color: #ffffff;
      border-color: var(--color-iris);
    }
    .docs-table-wrapper {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
  ```

- [x] **Step 3: Run test suite and lint**
  Run: `npm test && npm run lint`
  Expected: PASS.

---

### Task 7: PWA Support Implementation (Manifest, Icons, Service Worker, Safe-Area)

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js`
- Create/Verify: App icons in `public/brand/`
- Modify: `app/layout.tsx:1-25`
- Test: Service worker registration & manifest fetching

**Interfaces:**
- Consumes: App metadata, offline cache strategy.
- Produces: Installable PWA with offline shell resilience.

- [x] **Step 1: Create public/manifest.json**
  ```json
  {
    "name": "Vikoagent - Sovereign Devnet Paper Trader",
    "short_name": "Vikoagent",
    "description": "Autonomous AI Solana Devnet paper-trading telemetry system.",
    "start_url": "/",
    "display": "standalone",
    "orientation": "portrait-primary",
    "background_color": "#f8fafc",
    "theme_color": "#0b0e14",
    "icons": [
      {
        "src": "/brand/kivo-mark-128.png",
        "sizes": "128x128",
        "type": "image/png"
      },
      {
        "src": "/brand/kivo-mark-256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/brand/viko-orb.jpeg",
        "sizes": "512x512",
        "type": "image/jpeg",
        "purpose": "any maskable"
      }
    ]
  }
  ```

- [x] **Step 2: Create public/sw.js**
  Cache-first for static assets, network-first for live telemetry:
  ```javascript
  const CACHE_NAME = 'vikoagent-v1';
  const STATIC_ASSETS = [
    '/',
    '/docs',
    '/brand/viko-orb.jpeg',
    '/brand/kivo-mark-128.png',
    '/brand/kivo-mark-256.png',
    '/manifest.json'
  ];

  self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.pathname.startsWith('/api/')) {
      e.respondWith(fetch(e.request));
      return;
    }
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  });
  ```

- [x] **Step 3: Update app/layout.tsx with PWA meta & Service Worker registration**
  Add manifest link, apple meta tags, theme color, viewport fit, and client script registering `sw.js`.

- [x] **Step 4: Run test suite and lint**
  Run: `npm test && npm run lint`
  Expected: PASS.

---

### Task 8: Verification Across All Viewport Sizes & Progress Block 059 Logging

**Files:**
- Modify: `Task Breakdown Record.md` (append Progress Block 059)

- [x] **Step 1: Execute full test suite**
  Run: `npm test`
  Expected: 78/78 tests pass.

- [x] **Step 2: Execute linter**
  Run: `npm run lint`
  Expected: 0 errors, 0 warnings.

- [x] **Step 3: Run production build**
  Run: `npm run build`
  Expected: Successful compilation.

- [x] **Step 4: Multi-viewport browser visual inspection**
  Use `browser_subagent` to test:
  1. Mobile: 375x667 (iPhone SE)
  2. Phablet/Tablet: 600x900 and 768x1024
  3. Desktop: 1280x800
  Verify:
  - Zero horizontal overflow.
  - No text collisions or stacked awkwardness.
  - Manifest and service worker load cleanly.
  - `/docs` mobile section navigation works.

- [x] **Step 5: Append Progress Block 059 to Task Breakdown Record.md**
  Adhere to append-only logging requirement.
