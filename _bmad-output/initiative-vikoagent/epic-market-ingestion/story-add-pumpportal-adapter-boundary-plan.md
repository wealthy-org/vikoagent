---
title: 'Add PumpPortal adapter boundary'
type: 'feature'
ticket: '4'
created: '2026-10-27'
status: done
baseline_revision: '7cee91e3fe5723e3dd8d27a45bf63e64a63cf110'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Add PumpPortal event parsing behind existing adapter boundary without coupling domain code to WebSocket SDKs or exposing credentials.

## Safety

Subscribe only to free `subscribeNewToken`. No trade/account subscriptions, wallet, signing, or execution. API key stays in transport configuration and never enters event payload, logs, or errors.

## Tasks & Acceptance

- [ ] `packages/ingestion/src/pumpportal.ts` -- parse new-token messages and represent connection health -- isolate provider shape.
- [ ] `tests/pumpportal.test.ts` -- verify valid, malformed, and health transitions -- prove boundary behavior.

## Implementation Notes

- Added provider payload parser for free `subscribeNewToken` events.
- Added explicit PumpPortal health mapper and stable event key generation.
- Transport remains injected; no WebSocket connection or API key handling added.
- Research confirmed one persistent WebSocket and reconnect/resubscribe requirement for future transport story.
## Plan Change Log
## Review Triage Log
## Verification
- `npm test`
- `npm run build`
- `npm run lint`
