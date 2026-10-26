---
title: 'Define shared domain and read-model contracts'
type: 'feature'
ticket: '4'
created: '2026-10-26'
status: done
baseline_revision: 'b982811f17895dccf038c6d1d26ae3fbf8a41785'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '_bmad-output/architecture-vikoagent/architecture-vikoagent.md'
  - '_bmad-output/ux-vikoagent/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">
## Intent

**Problem:** Ingestion, risk, ledger, and UI need one stable vocabulary for records and API responses.

**Approach:** Centralize serializable TypeScript contracts and runtime-safe constructors for domain records, dashboard read models, health states, and errors.

## Boundaries & Constraints

**Always:** Contracts remain provider-neutral, paper-safe, serializable, and usable by server and UI. Every decision exposes action, reason, timestamp, token reference, and linked receipt when available.

**Never:** No direct DB types in UI, no provider payload leakage, no LLM authority field, no secret field.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Valid decision | Complete action and reason | Contract accepts record | No error |
| Missing reason | Decision without reason | Contract rejects | Stable validation error |
| Health state | Healthy, stale, reconnecting, error | Contract serializes state | Unknown state rejected |
| API error | Stable code and message | JSON-safe error response | No secret details |
</frozen-after-approval>

## Code Map
- `packages/domain/src/token-event.ts` -- existing normalized event contract.
- `packages/contracts/src/index.ts` -- existing contract export.
- `packages/persistence/src/repositories.ts` -- persistence records to keep separate from UI models.
- `apps/web/components/dashboard.tsx` -- current consumer of read-model event.

## Tasks & Acceptance
**Execution:**
- [ ] `packages/contracts/src/models.ts` -- define shared domain and read-model types -- establish one vocabulary.
- [ ] `packages/contracts/src/guards.ts` -- add runtime validation and JSON-safe error creation -- reject malformed boundaries.
- [ ] `packages/contracts/src/index.ts` -- export all contracts -- provide stable import surface.
- [ ] `tests/contracts.test.ts` -- cover valid and invalid contracts -- prevent drift.

**Acceptance Criteria:**
- Given valid event, decision, paper trade, Treasury, health, and API error data, when serialized, then contracts retain required fields.
- Given decision without reason or unknown health state, when validated, then stable contract error occurs.
- Given API error with secret-like input, when serialized, then secret value is absent.

## Implementation Notes

- Added shared models for Decision, Paper Trade, Treasury, health, and API errors.
- Added runtime guards and secret-redacting API error serializer.
- Export surface now separates provider-neutral contracts from persistence records.
- All 17 project tests pass.
## Plan Change Log
## Review Triage Log
## Verification
**Commands:**
- `npm test` -- expected: all contract tests pass.
- `npm run build` -- expected: production build succeeds.
