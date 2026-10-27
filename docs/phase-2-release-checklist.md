# Phase 2 Release Checklist

## Local quality gates

- [x] `npm test`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm audit --omit=dev`
- [x] `git diff --check`
- [x] CI quality workflow committed
- [x] Secret pattern scan
- [x] Devnet/PAPER safety scan

## Persistence

- [x] Neon client boundary
- [x] Async repository boundary
- [x] Migration sequence
- [x] Idempotent decisions/trades/receipts
- [x] External staging smoke report
- [ ] CI-hosted Neon integration evidence
- [ ] Approved production deployment evidence

## Ingestion

- [x] PumpPortal parser boundary
- [x] WSS URL guard
- [x] Subscription boundary
- [x] Reconnect cap
- [x] Health states
- [ ] Approved live WebSocket smoke evidence
- [ ] Provider SLA/incident policy

## Dashboard

- [x] Scanner
- [x] Decision stream
- [x] Treasury
- [x] Receipts
- [x] Health states
- [x] Devnet/Paper labels
- [ ] Browser automation smoke evidence

## Release blockers

- Live PumpPortal URL not injected.
- Live provider connection not certified.
- Production deployment not approved.
- Mainnet, signing, broadcast, wallet, and real funds remain prohibited.

## Exit criteria

Phase 2 exits only when every unchecked item has evidence from approved staging/CI. Local green tests do not certify live provider or production deployment.
