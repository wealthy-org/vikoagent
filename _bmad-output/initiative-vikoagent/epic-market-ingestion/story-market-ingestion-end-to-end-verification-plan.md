---
title: 'Market ingestion end-to-end verification'
type: 'feature'
ticket: '7'
created: '2026-10-27'
status: done
baseline_revision: 'ceac38f14337392d27c9f1a379ee859a74733d2d'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Verify deterministic market ingestion as one safe vertical path and close Market Ingestion epic.

## Tasks & Acceptance

- [ ] `tests/market-ingestion-e2e.test.ts` -- run mock adapter through normalize, persist, deduplicate, health, and scanner read model -- prove handoff.
- [ ] Update epic evidence -- record verification commands and boundary limitations -- make downstream handoff explicit.

## Acceptance Criteria

- Mock adapter emits ordered events and healthy state.
- Every event normalizes and persists once.
- Replaying same event does not increase repository count.
- Scanner read model and health remain serializable.
- No live transport or execution path required for this verification.

## Implementation Notes

- Added end-to-end test covering mock adapter, normalization, repository deduplication, and source health.
- Replay of `mock:001` remains idempotent; repository count stays two.
- Verification intentionally excludes live WebSocket transport and execution paths.
## Plan Change Log
## Review Triage Log
## Verification
- `npm test`
- `npm run build`
- `npm run lint`
