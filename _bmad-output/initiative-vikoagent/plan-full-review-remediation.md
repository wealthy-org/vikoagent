---
title: 'Remediate Full Review & Scan Findings across Persistence, Domain, API, and Ingestion'
type: 'refactor'
ticket: ''
created: '2026-10-28'
status: 'built'
baseline_revision: '1274ef250a92ac1a462ad98f56be5e2901c413fb'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['adversarial', 'edge-case-hunter', 'verification-gap']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Full review revealed numeric string concatenation risks in Neon persistence (`NUMERIC` columns returned as strings), NaN evaluation bypass in risk evaluation, unhandled DDL in public API endpoints, raw error leakages, socket reconnect dead-ends, and unverified execution paths in tests.

**Approach:** Apply strict numeric parsing (`Number()`) in persistence and domain guards, eliminate runtime DDL in the API route, sanitize API error responses with `toApiError`, implement reconnect socket factory support, securely remove workspace credential dumps, and extend Vitest tests to cover verified paths.

</frozen-after-approval>

## Implementation Notes

Comprehensive remediation executed across all layers:
1. `packages/persistence/src/neon-repositories.ts`: Coerced Postgres `NUMERIC` values (`cash`, `nav`, `realizedPnl`, `positions`, `quantity`, `price`) to JS numbers in `get()`, `getTrade()`, and `upsertTrade()`.
2. `packages/domain/src/risk.ts`: Added strict `Number.isFinite` and non-negative guards; non-finite or negative inputs immediately return `action: 'REJECT'` with `reason: 'INVALID_NUMERIC_RISK_METRICS'`.
3. `packages/domain/src/paper-ledger.ts`: Added `Number.isFinite` parameter validation and converted state amounts with `Number()` to guarantee arithmetic safety against string concatenation and NaN poisoning.
4. `app/api/record-token/route.ts`: Removed runtime `CREATE TABLE` DDL on every request; sanitized errors with `toApiError`.
5. `app/api/analyze-token/route.ts`: Integrated `toApiError` to redact Authorization headers and API keys from error outputs.
6. `app/api/solana-status/route.ts`: Added RPC URL inspection to reject `mainnet` URLs with `UNSAFE_NETWORK_BLOCKED` and sanitized errors.
7. `packages/ingestion/src/pumpportal-transport.ts`: Added socket factory support to re-instantiate WebSockets during reconnect loops.
8. `apps/worker/src/index.ts`: Hardened `marketCapSol` and `approxLiqUsd` with `Number.isFinite` checks and added exponential reconnect backoff.
9. Purged `kredensial.md` from the project workspace.
10. Added new unit and integration tests across 6 test suites, increasing passing tests from 79 to 90.

## Review Triage Log

- `high` / patch: Postgres NUMERIC string coercion in `neon-repositories.ts` patched with explicit `Number()` conversion.
- `high` / patch: NaN risk evaluation bypass in `risk.ts` patched with `Number.isFinite` guards.
- `medium` / patch: Runtime DDL in `app/api/record-token/route.ts` removed.
- `medium` / patch: Raw exception leak in `/api/analyze-token` patched with `toApiError` redaction.
- `medium` / patch: Mainnet configuration bypass in `/api/solana-status` patched with URL boundary validation.
- `medium` / patch: Dead socket reconnect in `pumpportal-transport.ts` patched with factory function re-creation.
- `low` / patch: Worker NaN market cap patched with finite fallback.
- `high` / patch: Workspace root credential file `kredensial.md` purged.
