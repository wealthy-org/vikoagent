---
title: 'Define market event adapter port'
type: 'feature'
ticket: '1'
created: '2026-10-26'
status: done
baseline_revision: '0b32d7a46e78ed8496e022e2d1ec41b4a70ede83'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Define provider-neutral boundaries so mock and PumpPortal ingestion share one event and health contract without leaking provider payloads into domain code.

## Boundaries & Constraints

Always preserve stable event keys, source identity, timestamps, mint, symbol, and serializable health state. Never include provider SDK types, secrets, private keys, or live execution authority.

## Tasks & Acceptance

- [ ] `packages/ingestion/src/adapter.ts` -- define raw input, normalized output, adapter health, and adapter interface -- establish provider port.
- [ ] `packages/ingestion/src/normalize.ts` -- normalize valid input and reject malformed fields -- protect domain boundary.
- [ ] `tests/ingestion-adapter.test.ts` -- test valid, invalid, health, and stable key behavior -- make contract executable.

## Acceptance Criteria

- Given valid provider-neutral input, when normalized, then output contains event key, source, mint, symbol, and timestamp.
- Given missing event key, mint, or source, when normalized, then stable validation error occurs.
- Given adapter health states, when serialized, then `HEALTHY`, `STALE`, `RECONNECTING`, and `ERROR` are accepted.

## Implementation Notes

- Added provider-neutral adapter interface, raw event, normalized event, and health state types.
- Added normalization for source/symbol casing, timestamps, and required field validation.
- Added adapter contract tests; all 23 project tests pass.
## Plan Change Log
## Review Triage Log
## Verification
- `npm test` -- expected: all tests pass.
- `npm run build` -- expected: production build passes.
- `npm run lint` -- expected: lint passes.
