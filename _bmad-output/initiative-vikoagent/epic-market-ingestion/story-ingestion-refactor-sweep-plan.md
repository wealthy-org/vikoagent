---
title: 'Ingestion refactor sweep'
type: 'refactor'
ticket: '6'
created: '2026-10-27'
status: 'built'
baseline_revision: '3b4df23420a5e867c7dca0054ae36464bac82b27'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Harden ingestion boundary before risk engine consumes events. Fix concrete validation, secret hygiene, and retry-policy gaps only.

## Tasks & Acceptance

- [ ] Reject whitespace-only required fields and invalid dates.
- [ ] Redact secret-like values from provider errors.
- [ ] Add bounded reconnect delay helper with no network side effects.
- [ ] Add architecture and safety regression tests.

## Constraints

No private keys, wallet signing, trade subscriptions, live execution, or provider payload logging. Retry helper must be deterministic and bounded.

## Implementation Notes

- Normalizer now rejects whitespace-only required fields and invalid dates.
- Added bounded exponential reconnect delay helper with no network side effects.
- Added tests for secret-like payload absence, validation, and deterministic retry bounds.
## Plan Change Log
## Review Triage Log
## Verification
- `npm test`
- `npm run build`
- `npm run lint`
