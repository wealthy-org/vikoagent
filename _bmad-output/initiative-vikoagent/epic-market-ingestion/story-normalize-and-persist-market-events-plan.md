---
title: 'Normalize and persist market events'
type: 'feature'
ticket: '3'
created: '2026-10-27'
status: 'built'
baseline_revision: 'd5e225e080446258c8affa2b7fcf690a81c858d2'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Connect adapter events to normalization and Token Event repository upsert. Duplicate provider events must remain one durable record.

## Tasks & Acceptance

- [ ] `packages/ingestion/src/ingest.ts` -- provide ingestion service -- normalize and persist each event.
- [ ] `tests/ingest.test.ts` -- verify duplicate and malformed event behavior -- protect idempotency.

## Acceptance Criteria

- Two equivalent source events create one repository record.
- Normalized source and symbol values persist in canonical form.
- Malformed event fails before repository mutation.

## Implementation Notes

- Added `ingestMarketEvent` service: normalize first, then repository upsert.
- Added canonical record mapping with stable event-key ID.
- Duplicate and malformed event tests protect idempotency and mutation ordering.
## Plan Change Log
## Review Triage Log
## Verification
- `npm test`
- `npm run build`
- `npm run lint`
