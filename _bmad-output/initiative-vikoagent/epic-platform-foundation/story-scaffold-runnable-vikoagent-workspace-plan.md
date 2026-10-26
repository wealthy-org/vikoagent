---
title: 'Scaffold runnable Vikoagent workspace'
type: 'feature'
ticket: '1'
created: '2026-10-26'
status: done
baseline_revision: 'HEAD'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick-inline']
review_loop_iteration: 0
context:
  - '_bmad-output/architecture-vikoagent/architecture-vikoagent.md'
  - '_bmad-output/ux-vikoagent/DESIGN.md'
  - '_bmad-output/ux-vikoagent/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Vikoagent has planning artifacts but no runnable application workspace. Without a thin vertical path, UI fidelity and domain boundaries cannot be validated early.

**Approach:** Create a minimal Node/Next workspace with web, API, worker, and shared contract boundaries. Add fixture data and a reference-inspired dashboard shell that displays one normalized Token Event through the application boundary.

## Boundaries & Constraints

**Always:** Solana Devnet only; Paper mode default; UI reads through application boundary; fixture output must be deterministic; persistent `DEVNET` and `PAPER MODE` labels; use DESIGN.md and EXPERIENCE.md tokens; no secrets in fixture data.

**Never:** No mainnet, wallet signing, user funds, staking, token contract, profit sharing, direct DB access from UI, or LLM authority over approval/signing.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Fixture happy path | One valid fixture Token Event | API/application boundary returns normalized event; dashboard renders scanner row | No error |
| Empty event list | Fixture source returns no events | Dashboard shows explicit empty state | No false live claim |
| Malformed fixture | Missing required event field | Boundary rejects payload with stable error | UI shows non-destructive error state |
| Narrow viewport | Width below 768px | Panels stack without horizontal overflow | Preserve mode labels and readable IDs |

</frozen-after-approval>

## Code Map

- `vikoagent.md` -- project brief, scope guardrails, and reference constraints; reuse as product source.
- `_bmad-output/architecture-vikoagent/architecture-vikoagent.md` -- layered boundaries and adapter isolation; do not bypass application/read model boundary.
- `_bmad-output/ux-vikoagent/DESIGN.md` -- visual tokens, panel, typography, orb, and safety-label contract.
- `_bmad-output/ux-vikoagent/EXPERIENCE.md` -- information architecture, state patterns, responsive behavior, accessibility floor.
- `_bmad-output/spec-vikoagent/spec-vikoagent.md` -- CAP-1 and CAP-5 capability expectations.
- `kivo-clone-full.html` -- visual reference only; do not import as application source.
- `assets/index-BgM68OKQ.css` -- reference asset only; reuse no application behavior.

## Tasks & Acceptance

**Execution:**
- [ ] `package.json`, `tsconfig.json`, `next.config.ts`, `app/` -- create runnable Next/TypeScript workspace and scripts -- establish web application boundary.
- [ ] `packages/domain/src/token-event.ts`, `packages/contracts/src/index.ts` -- define normalized Token Event contract -- keep domain data reusable across worker, API, and UI.
- [ ] `apps/api/src/fixtures/token-event.ts`, `apps/api/src/read-model.ts` -- expose deterministic fixture read path -- prove application boundary without provider or DB access.
- [ ] `apps/web/app/page.tsx`, `apps/web/app/globals.css` -- render scanner shell, orb, health, `DEVNET`, `PAPER MODE`, and empty/error states -- implement UX tracer surface.
- [ ] `apps/web/components/*` -- split reusable `GlassPanel`, `StatusBadge`, `AgentOrb`, and scanner row primitives -- prevent visual drift.
- [ ] `tests/fixture-boundary.test.ts`, `tests/ui-contract.test.ts` -- verify normalization, malformed input rejection, safety labels, and responsive contract -- make tracer behavior repeatable.

**Acceptance Criteria:**
- Given clean install, when `npm run build` runs, then workspace builds without unresolved imports.
- Given fixture command, when one token event is requested, then normalized event includes stable ID, source, mint, timestamp, and status.
- Given dashboard load, when fixture exists, then scanner row renders through application/read-model data and shows `DEVNET` plus `PAPER MODE`.
- Given empty or malformed fixture, when dashboard loads, then explicit empty/error state appears without claiming live data.
- Given viewport below 768px, when dashboard renders, then core panels stack without horizontal overflow and safety labels remain visible.

## Implementation Notes

- Built minimal Next.js/TypeScript workspace with shared domain normalization, fixture read model, and reference-inspired dashboard shell.
- Added `type: module` after Vitest config required ESM loading.
- `npm run build` produced `.next/BUILD_ID`; `npx vitest run --reporter=dot` passed 2 tests.

## Plan Change Log

## Review Triage Log

- false — `npm run build` and Vitest verification passed; no acceptance failure found in inspected implementation.
- medium / defer — `npm run lint` remains unresolved because Next 16 no longer provides the prior lint command behavior; verify with a configured ESLint command before release.

## Design Notes

Use hybrid cinematic operations: preserve Kivo-inspired dark glass, violet glow, orb identity, and panel rhythm while presenting Vikoagent scanner telemetry. Keep first slice narrow; no backend provider integration.

## Verification

**Commands:**
- `npm run build` -- expected: production build succeeds.
- `npm test` -- expected: fixture normalization, rejection, and UI contract tests pass.
- `npm run lint` -- expected: no lint errors.

**Manual checks:**
- Open dashboard at desktop and narrow viewport. Confirm reference-inspired shell, readable scanner fixture, persistent `DEVNET`/`PAPER MODE`, no horizontal overflow, and no real-money CTA.
