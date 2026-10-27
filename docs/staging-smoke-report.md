# Staging Smoke Report

## Evidence source

Reported by Antigravity browser/terminal session. Secret values intentionally omitted. Workspace does not contain raw provider logs or credentials.

## Neon staging

- Project: `vikoagent-staging`
- Branch: `smoke-test`
- Disposable expiration: reported yes
- Old credential revoked: reported yes
- New credential created: reported yes
- Secret displayed: reported no
- Connection configured locally: reported yes
- Migration: reported passed
- Tables: reported verified
- Restart/idempotency: reported passed

Expected tables:

```text
decisions
paper_trades
receipts
token_events
treasury_snapshots
```

## Local verification

Reported passed:

```text
npm test
npm run lint
npm run build
npm audit --omit=dev
```

## Trust boundary

This report is external evidence, not locally reproduced evidence. Do not treat it as production certification. Re-run through approved CI or deployment logs before production release.

## Safety

No mainnet, signing, broadcast, real funds, or PumpPortal trade/write operation approved.
