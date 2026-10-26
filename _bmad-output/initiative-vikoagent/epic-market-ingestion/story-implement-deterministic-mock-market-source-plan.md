---
title: 'Implement deterministic mock market source'
type: 'feature'
ticket: '2'
created: '2026-10-27'
status: 'built'
baseline_revision: 'ceb2dab77a23a6d0f4961c8160a76edb0f67f9aa'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Provide local deterministic market events through the adapter port so development and tests do not depend on external provider availability.

## Boundaries & Constraints

Always emit fixed ordered fixtures, explicit source health, and no network calls. Never simulate signing, execution, or real market claims.

## Tasks & Acceptance

- [ ] `packages/ingestion/src/mock-adapter.ts` -- implement deterministic adapter lifecycle -- prove source behavior.
- [ ] `packages/ingestion/src/mock-fixtures.ts` -- define stable ordered events -- keep tests reproducible.
- [ ] `tests/mock-adapter.test.ts` -- verify order, health, stop, and no mutation -- protect local source.

## Acceptance Criteria

- Given mock adapter start, when subscribed, then events emit in fixed order.
- Given start lifecycle, when callbacks run, then source reports `HEALTHY` and event timestamps remain stable.
- Given stop, when called, then no further events emit and adapter reports stopped behavior without throwing.

## Implementation Notes

- Added frozen two-event deterministic fixture set.
- Added `DeterministicMockAdapter` with explicit `HEALTHY` callback and stop flag.
- No network calls or provider SDK dependencies.
## Plan Change Log
## Review Triage Log
## Verification
- `npm test` -- expected: all tests pass.
- `npm run build` -- expected: production build passes.
- `npm run lint` -- expected: lint passes.
