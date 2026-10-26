---
title: 'Create persistence and repository baseline'
type: 'feature'
ticket: '3'
created: '2026-10-26'
status: done
baseline_revision: '7e08e9657d206767e8a2946acff07da897bcb262'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '_bmad-output/architecture-vikoagent/architecture-vikoagent.md'
  - '_bmad-output/spec-vikoagent/state-machines.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">
## Intent

**Problem:** Domain records have no durable schema or repository contract for later ingestion, risk, paper ledger, and dashboard work.

**Approach:** Add Neon PostgreSQL-compatible migrations and typed repository interfaces with deterministic idempotency keys. Keep provider and DB implementation behind ports.

## Boundaries & Constraints

**Always:** Token Events, Decisions, Paper Trades, Treasury, and audit records are persisted with stable IDs; duplicate event keys do not create duplicates; UI never accesses DB directly.

**Never:** No mainnet, live execution, private key persistence, or provider-specific logic in domain repositories.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| First insert | New event key | Record created | Return created record |
| Duplicate insert | Existing event key | Same record returned | No duplicate |
| Missing ID | Invalid record | Rejected | Stable validation error |
| Migration | Clean Neon database | All tables and unique constraints exist | Migration fails clearly |
</frozen-after-approval>

## Code Map
- `packages/domain/src/token-event.ts` -- normalized event shape.
- `packages/config/src/runtime-config.ts` -- safe runtime boundary.
- `_bmad-output/architecture-vikoagent/architecture-vikoagent.md` -- Neon source-of-truth decision.

## Tasks & Acceptance
**Execution:**
- [ ] `db/migrations/001_initial.sql` -- create core tables and uniqueness constraints -- establish source of truth.
- [ ] `packages/persistence/src/repositories.ts` -- define typed repository ports and idempotent insert result -- isolate DB implementation.
- [ ] `packages/persistence/src/in-memory-repositories.ts` -- provide deterministic test adapter -- verify behavior without external DB.
- [ ] `tests/persistence.test.ts` -- test first insert, duplicate, invalid record, and migration contract -- protect later consumers.

**Acceptance Criteria:**
- Given clean DB, when migration runs, then Token Events, Decisions, Paper Trades, Treasury, and audit records exist with required unique keys.
- Given duplicate event key, when repository inserts twice, then one record remains and same ID returns.
- Given missing record ID, when repository inserts, then stable validation error occurs.

## Implementation Notes

- Added Neon-compatible SQL migration for core source-of-truth tables.
- Added repository port and deterministic in-memory adapter with event-key deduplication.
- Added persistence tests; all 12 project tests pass.
## Plan Change Log
## Review Triage Log
## Verification
**Commands:**
- `npm test` -- expected: all persistence tests pass.
- `npm run build` -- expected: production build succeeds.
