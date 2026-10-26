# Deployment Smoke Checklist

Run only in approved non-production environment. Never commit credentials.

## Required variables

```text
SOLANA_NETWORK=devnet
AGENT_MODE=PAPER
LLM_CAN_SIGN=false
PERSISTENCE=neon
DATABASE_URL=<secret-managed Neon URL>
MIGRATE_ON_STARTUP=true
PUMPPORTAL_URL=<approved provider URL>
```

## Neon smoke test

1. Inject `DATABASE_URL` through secret manager.
2. Start with `PERSISTENCE=neon` and `MIGRATE_ON_STARTUP=true`.
3. Confirm migration completes.
4. Execute one fixture event through risk evaluation.
5. Confirm decision, paper trade, treasury snapshot, and receipt persist.
6. Restart process.
7. Confirm duplicate event/trade remains idempotent.
8. Remove `DATABASE_URL`; confirm startup fails with `DATABASE_URL_REQUIRED_FOR_NEON`.

## PumpPortal smoke test

1. Inject approved `PUMPPORTAL_URL` through secret manager.
2. Connect using new-token subscription only.
3. Confirm event normalization and `PUMPPORTAL` source health.
4. Confirm malformed payload becomes `ERROR` without process crash.
5. Confirm disconnect enters `RECONNECTING`.
6. Confirm retry delay stays between `250ms` and `10000ms`.
7. Confirm retry attempts stop after `8`.
8. Confirm transport cannot invoke trade or wallet APIs.

## Deployment credential validation

- Secret manager owns `DATABASE_URL` and provider URL.
- No credential appears in logs, browser payloads, test fixtures, or repository.
- CI uses secret scanning and dependency audit.
- Deployment rejects mainnet and non-PAPER values.
- Rollback keeps in-memory/PAPER fallback available.

## Release stop conditions

Stop release if any check fails, if network is not `devnet`, if mode is not `PAPER`, if signing capability is enabled, or if provider payload can reach execution authority.
