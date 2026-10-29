# Responsive Multi-Device Overhaul, Professional Mobile Trader Widgets & PWA Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a flawless responsive layout across all device sizes (<400px, 400-640px, 641-768px, 769-1024px, 1025-1440px, >1440px) eliminating the 5 defect classes (rusak, berdempetan, menumpuk, bertabrakan, hancur), adding a floating glassmorphic Mobile Bottom Dock, mobile segmented widget controls, touch-friendly trader ergonomics, and hardened PWA support.

**Architecture:** 
1. Centralized CSS responsive tokens in `app/globals.css` and `apps/web/app/globals.css` with fluid clamp spacing, typography scaling, safe-area insets, and strict horizontal overflow containment.
2. Lightweight, decoupled `MobileDock` and `PwaInstallPill` components embedded in `apps/web/components/dashboard.tsx`.
3. Responsive refactoring of `ActivePositionDesk` SVG viewBox and touch crosshair handlers to adapt fluidly from 320px up to 4K displays.
4. Segmented mobile tab switcher for Mind Stream vs Token Radar on viewports <1024px.
5. Table scroll containment and ASCII banner containment across `/docs` and `/cli`.
6. PWA manifest and service worker update with offline fallback and app shortcuts.

**Tech Stack:** Next.js 16.4.1 (App Router), React 19.1.0, TypeScript, CSS3 Media Queries & Clamps, Vitest, JSDOM.

## Global Constraints
- Devnet only; zero real funds; paper trading invariants preserved.
- Preserve existing light claymorphism styling tokens and palette.
- Do not break existing 94 Vitest tests.
- Minimum touch target size ≥ 44×44px on interactive controls.
- Prevent horizontal scroll blowout (`overflow-x: hidden` on root, `max-width: 100vw`).

---

### Task 1: Global CSS Hardening & Responsive Breakpoints

**Files:**
- Modify: `app/globals.css`
- Modify: `apps/web/app/globals.css`
- Test: `tests/responsive-css-contract.test.ts`

**Interfaces:**
- Consumes: Root claymorphism design tokens in `app/globals.css`.
- Produces: CSS utility classes and media queries for `.mobile-only`, `.desktop-only`, `.table-scroll-container`, `.cli-banner-container`, `.segmented-control`, `.dock-bottom-spacer`, and fluid clamp containers.

- [ ] **Step 1: Write failing contract test for responsive CSS tokens**

Create `tests/responsive-css-contract.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Responsive CSS Contract', () => {
  const cssPath = path.resolve(__dirname, '../app/globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  it('defines safe area tokens and root overflow containment', () => {
    expect(css).toContain('--safe-bottom');
    expect(css).toContain('overflow-x: hidden');
  });

  it('defines mobile widget classes and table scroll containment', () => {
    expect(css).toContain('.table-scroll-container');
    expect(css).toContain('.cli-banner-container');
    expect(css).toContain('.mobile-bottom-dock');
    expect(css).toContain('.segmented-control');
  });

  it('provides media queries covering mobile, tablet, and desktop tiers', () => {
    expect(css).toContain('@media (max-width: 480px)');
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('@media (max-width: 1024px)');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/responsive-css-contract.test.ts`
Expected: FAIL (missing `.table-scroll-container`, `.mobile-bottom-dock`, etc.)

- [ ] **Step 3: Implement responsive CSS additions in `app/globals.css` & `apps/web/app/globals.css`**

Add responsive utilities, mobile dock rules, segmented controls, table containment, and media queries for `<480px`, `<768px`, and `<1024px`. Ensure `app/globals.css` and `apps/web/app/globals.css` remain in sync.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/responsive-css-contract.test.ts`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add app/globals.css apps/web/app/globals.css tests/responsive-css-contract.test.ts
git commit -m "style(css): add responsive tokens, dock styles, and overflow containment"
```

---

### Task 2: PWA Web App Manifest & Service Worker Hardening

**Files:**
- Modify: `public/manifest.json`
- Modify: `public/sw.js`
- Modify: `app/layout.tsx`
- Test: `tests/pwa-manifest-sw.test.ts`

**Interfaces:**
- Consumes: Standard Web App Manifest & Service Worker specification.
- Produces: Enhanced `manifest.json` with shortcuts and display overrides; updated `sw.js` with offline fallback.

- [ ] **Step 1: Write test for PWA manifest and service worker configuration**

Create `tests/pwa-manifest-sw.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('PWA Configuration and Manifest', () => {
  it('has comprehensive web app manifest with shortcuts and categories', () => {
    const manifestPath = path.resolve(__dirname, '../public/manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifest.short_name).toBe('Viko');
    expect(manifest.display).toBe('standalone');
    expect(manifest.categories).toContain('finance');
    expect(manifest.shortcuts).toBeDefined();
    expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(2);
  });

  it('has service worker caching static assets and providing offline json fallback', () => {
    const swPath = path.resolve(__dirname, '../public/sw.js');
    const sw = fs.readFileSync(swPath, 'utf-8');

    expect(sw).toContain('vikoagent-cache');
    expect(sw).toContain('/api/');
    expect(sw).toContain('Offline mode active');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/pwa-manifest-sw.test.ts`
Expected: FAIL (missing `shortcuts` in manifest)

- [ ] **Step 3: Update `public/manifest.json` and `public/sw.js`**

Add `shortcuts` (`Live Terminal` pointing to `/cli`, `Documentation` pointing to `/docs`, `Token Radar` pointing to `/#radar-scan`), `display_override`, and ensure `sw.js` handles offline fallbacks cleanly.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/pwa-manifest-sw.test.ts`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add public/manifest.json public/sw.js tests/pwa-manifest-sw.test.ts
git commit -m "feat(pwa): expand web app manifest shortcuts and service worker resilience"
```

---

### Task 3: Mobile Bottom App Dock & PWA Install Component

**Files:**
- Create: `apps/web/components/mobile-dock.tsx`
- Modify: `apps/web/components/dashboard.tsx`
- Test: `tests/mobile-dock.test.ts`

**Interfaces:**
- Consumes: Navigation anchors (`#top`, `#mind-stream`, `#radar-scan`, `/cli`, `/docs`).
- Produces: `<MobileDock />` component with active tab highlighting and smooth scrolling; `<PwaInstallPill />` prompt for mobile install.

- [ ] **Step 1: Write test for MobileDock component**

Create `tests/mobile-dock.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MobileDock } from '../apps/web/components/mobile-dock';

describe('MobileDock Component', () => {
  it('renders 5 primary navigation destinations with icons', () => {
    const html = renderToString(React.createElement(MobileDock));
    expect(html).toContain('Dashboard');
    expect(html).toContain('Mind');
    expect(html).toContain('Radar');
    expect(html).toContain('Terminal');
    expect(html).toContain('Docs');
  });

  it('includes proper semantic navigation role and accessibility label', () => {
    const html = renderToString(React.createElement(MobileDock));
    expect(html).toContain('role="navigation"');
    expect(html).toContain('aria-label="Mobile Bottom Dock"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/mobile-dock.test.ts`
Expected: FAIL (module `../apps/web/components/mobile-dock` does not exist)

- [ ] **Step 3: Create `apps/web/components/mobile-dock.tsx`**

Implement `<MobileDock />` with glassmorphic styling, smooth scroll listeners, and safe-area inset spacing. Export it for inclusion in the dashboard.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/mobile-dock.test.ts`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add apps/web/components/mobile-dock.tsx tests/mobile-dock.test.ts
git commit -m "feat(ui): create glassmorphic MobileDock navigation component"
```

---

### Task 4: Main Dashboard Responsive Overhaul (`dashboard.tsx`)

**Files:**
- Modify: `apps/web/components/dashboard.tsx`
- Test: `tests/dashboard-responsive.test.ts`

**Interfaces:**
- Consumes: `MobileDock`, `ActivePositionDesk`, `MOCK_SCANNED_TOKENS`.
- Produces: Flawless responsive layout across all device widths without clipping, collisions, or overlapping elements.

- [ ] **Step 1: Write test verifying responsive containers and segmented tab presence**

Create `tests/dashboard-responsive.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Dashboard } from '../apps/web/components/dashboard';

describe('Dashboard Responsive Overhaul', () => {
  it('renders dashboard with MobileDock and mobile segmented view support', () => {
    const html = renderToString(React.createElement(Dashboard));
    expect(html).toContain('Mobile Bottom Dock');
    expect(html).toContain('table-scroll-container');
    expect(html).toContain('radar-scan');
  });

  it('renders Treasury 24h metrics in responsive grid container', () => {
    const html = renderToString(React.createElement(Dashboard));
    expect(html).toContain('treasury-24h-grid');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/dashboard-responsive.test.ts`
Expected: FAIL

- [ ] **Step 3: Refactor `dashboard.tsx` for comprehensive responsiveness**
  - Embed `<MobileDock />` with bottom padding spacer.
  - Wrap Token Scanner in `<div className="table-scroll-container">`.
  - Add segmented control (`[🧠 Agent Stream] | [📡 Devnet Radar]`) on mobile for `#mind-stream`.
  - Ensure `ActivePositionDesk` SVG has `viewBox="0 0 540 280"` with width 100%, height auto, and touch drag events for mobile crosshair.
  - Refactor Treasury 24h stats container to `.treasury-24h-grid` (2×2 under 480px).
  - Add `id="radar-scan"` to Token Scanner section for direct dock linking.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/dashboard-responsive.test.ts`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add apps/web/components/dashboard.tsx tests/dashboard-responsive.test.ts
git commit -m "feat(dashboard): implement full responsive layout, mobile segmented view, and dock integration"
```

---

### Task 5: Documentation & CLI Responsive Overhauls (`/docs` & `/cli`)

**Files:**
- Modify: `app/docs/page.tsx`
- Modify: `app/cli/page.tsx`
- Test: `tests/docs-cli-responsive.test.ts`

**Interfaces:**
- Consumes: Existing documentation sections and CLI terminal simulation.
- Produces: Overflow-protected tables in `/docs` and responsive monospace ASCII art in `/cli`.

- [ ] **Step 1: Write test for docs and cli responsive containment**

Create `tests/docs-cli-responsive.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import DocsPage from '../app/docs/page';
import CliPage from '../app/cli/page';

describe('Docs and CLI Responsive Hardening', () => {
  it('docs page wraps contract tables in responsive table wrapper with break-all', () => {
    const html = renderToString(React.createElement(DocsPage));
    expect(html).toContain('docs-table-wrapper');
    expect(html).toContain('table-scroll-container');
  });

  it('cli page wraps ASCII banner in scrollable container with responsive font clamp', () => {
    const html = renderToString(React.createElement(CliPage));
    expect(html).toContain('cli-banner-container');
    expect(html).toContain('cli-header-bar');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/docs-cli-responsive.test.ts`
Expected: FAIL

- [ ] **Step 3: Update `app/docs/page.tsx` and `app/cli/page.tsx`**
  - In `app/docs/page.tsx`: add `table-scroll-container` to table wrappers and ensure address cells have `word-break: break-all` and copy actions.
  - In `app/cli/page.tsx`: wrap ASCII banner in `<div className="cli-banner-container">`, give terminal header `.cli-header-bar` with `flex-wrap: wrap`, and use fluid typography clamp so ASCII art does not distort on mobile screens.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/docs-cli-responsive.test.ts`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add app/docs/page.tsx app/cli/page.tsx tests/docs-cli-responsive.test.ts
git commit -m "feat(pages): harden responsive layouts for documentation and CLI terminal pages"
```

---

### Task 6: Multi-Device Test Suite & Verification

**Files:**
- Run test suites
- Run linting
- Run Next.js production build

- [ ] **Step 1: Run all unit and integration tests**

Run: `npm test`
Expected: All 98+ tests pass.

- [ ] **Step 2: Run code linter**

Run: `npm run lint`
Expected: Zero lint errors or warnings.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: Successful Next.js production build (`Compiled successfully`).

- [ ] **Step 4: Commit any final integration touches**

```bash
git add .
git commit -m "chore: complete responsive multi-device overhaul, mobile widgets, and PWA verification"
```
