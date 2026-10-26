---
title: 'Expose scanner read model and source health'
type: 'feature'
ticket: '5'
created: '2026-10-27'
status: done
baseline_revision: '6500dfb01304d2409eae7b1c5205fe80ae21ed3a'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Expose typed scanner events and ingestion health through application read-model functions. UI consumes this boundary, never repository or provider directly.

## Tasks & Acceptance

- [ ] `apps/api/src/read-model.ts` -- return scanner event view and source health -- establish API boundary.
- [ ] `packages/contracts/src/models.ts` -- add scanner and ingestion health types -- share serializable contract.
- [ ] `tests/read-model.test.ts` -- verify event age/source/status and health states -- protect dashboard contract.

## Acceptance Criteria

- Scanner view returns event key, source, mint, symbol, timestamp, and status.
- Source health distinguishes `HEALTHY`, `STALE`, `RECONNECTING`, and `ERROR`.
- Read model types remain serializable and provider-neutral.

## Implementation Notes

- Added serializable scanner and ingestion health contracts.
- Read model now exposes event identity, source, mint, symbol, timestamp, age, liquidity, status, and source health.
- Existing dashboard and foundation contracts preserved through additive fields.
## Plan Change Log
## Review Triage Log
## Verification
- `npm test`
- `npm run build`
- `npm run lint`
