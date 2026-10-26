---
title: 'Enforce Devnet and Paper safety configuration'
type: 'feature'
ticket: '2'
created: '2026-10-26'
status: 'built'
baseline_revision: '7e7d3e25b657cbed437c16fe7a41c30daf34044c'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '_bmad-output/architecture-vikoagent/architecture-vikoagent.md'
  - 'vikoagent.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Runtime configuration can drift into unsafe network or execution settings as implementation grows.

**Approach:** Add a typed environment configuration loader with safe defaults and fail-closed validation for network, agent mode, signing authority, and required secret boundaries.

## Boundaries & Constraints

**Always:** `SOLANA_NETWORK=devnet`; `AGENT_MODE=PAPER`; LLM cannot sign or approve; private keys remain backend-only; invalid safety combinations fail before application startup.

**Never:** No mainnet, live trading, wallet connection, user funds, staking, token contracts, or secret values in logs/errors.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Safe defaults | No env variables | Returns Devnet/Paper config | No error |
| Explicit safe config | `SOLANA_NETWORK=devnet`, `AGENT_MODE=PAPER` | Returns normalized config | No error |
| Mainnet attempt | `SOLANA_NETWORK=mainnet` | Startup rejected | Stable safety error, no secret echo |
| Live mode attempt | `AGENT_MODE=LIVE` | Startup rejected | Stable safety error |
| Signing authority attempt | `LLM_CAN_SIGN=true` | Startup rejected | Stable safety error |
| Malformed value | Unknown network or mode | Startup rejected | Stable validation error |

</frozen-after-approval>

## Code Map

- `package.json` -- test/build scripts and TypeScript runtime.
- `packages/domain/src/token-event.ts` -- existing domain boundary style.
- `apps/api/src/` -- backend-only application boundary.
- `vikoagent.md` -- Phase 1 safety constraints.

## Tasks & Acceptance

**Execution:**
- [ ] `packages/config/src/runtime-config.ts` -- implement safe defaults and fail-closed validation -- centralize runtime safety.
- [ ] `apps/api/src/startup-config.ts` -- expose backend startup configuration without leaking secrets -- ensure consumers use validated config.
- [ ] `tests/runtime-config.test.ts` -- cover every matrix row -- prove safety boundary.
- [ ] `.env.example` -- document safe variables only -- make setup repeatable without secrets.

**Acceptance Criteria:**
- Given no environment values, when config loads, then network is `devnet`, mode is `PAPER`, and LLM signing is false.
- Given mainnet, live mode, signing authority, or malformed values, when config loads, then it throws stable validation error before startup.
- Given an error containing secret-like environment values, when validation fails, then error text contains no secret value.
- Given API startup, when config loads, then only validated non-secret config is exposed.

## Implementation Notes

- Added fail-closed runtime loader with safe Devnet/Paper defaults.
- Added startup adapter and `.env.example` with no secret values.
- Added seven runtime safety tests; all 9 project tests pass.

## Plan Change Log

## Review Triage Log

- pending — quick review follows implementation; build and test verification passed.

## Verification

**Commands:**
- `npm test` -- expected: all runtime safety tests pass.
- `npm run build` -- expected: production build succeeds.
