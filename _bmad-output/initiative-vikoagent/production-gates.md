# Production Gates Execution Plan

## Scope

Close six remaining gates for Vikoagent Phase 1 without enabling mainnet or real-fund execution.

## Build order

1. Neon PostgreSQL runtime
2. Live PumpPortal transport behind adapter boundary
3. Operator Dashboard epic formalization and implementation
4. Deployment topology
5. Security review
6. Verification and Release epic formalization and execution

## Dependency rules

- Neon runtime must precede live transport persistence.
- Live transport must remain PAPER-only and use existing source-health states.
- Dashboard consumes read models only.
- Deployment cannot enable signing or mainnet.
- Security review runs against source and running mock/PAPER app.
- Release gate closes only after all runtime safety tests pass.

## Explicit deferrals

- Mainnet execution
- Devnet wallet signing
- User funds, custody, staking, token contracts
- Production live trading

## Acceptance

- Neon repository passes integration tests when `DATABASE_URL` is supplied.
- PumpPortal transport has bounded reconnect, resubscribe, shutdown, and secret redaction tests.
- Dashboard epic has formal ticket breakdown and state coverage.
- Deployment documents safe environment variables and health checks.
- Security review reports no proven secret exposure or unsafe execution path.
- Release suite verifies ingestion → risk → paper ledger → receipts → dashboard.
