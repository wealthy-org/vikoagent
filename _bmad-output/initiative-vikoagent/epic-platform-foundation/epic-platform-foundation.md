---
type: epic
id: 1
title: Platform foundation and safety
covers: [CAP-1, CAP-2, CAP-3, CAP-4, CAP-5]
---

# Platform foundation and safety

## Intent

Create runnable project boundaries, validated configuration, database baseline, shared contracts, and safety controls.

## Outcome

All later epics build against stable module boundaries and cannot start unsafe Phase 1 runtime.

## Done when

- Project scaffold runs with one fixture path through layers.
- Devnet/Paper validation rejects unsafe configuration.
- DB migration and repository contracts exist.
- Shared domain/read-model contracts are tested.
- Foundation refactor, security, and vertical-slice checks pass.

## Requirements

- CAP-1, CAP-2, CAP-3, CAP-4, CAP-5 foundation concerns.
- Architecture decisions AD-1 through AD-8.
- PRD NFR-1 through NFR-6.

## Notes

- Decision: first story is tracer bullet through workspace, application boundary, and fixture event.
- Decision: safety configuration precedes persistence consumers because unsafe mode must fail before runtime access.
- Decision: refactor sweep closes foundation because more than three entries exist.
- Decision: final vertical-slice verification closes the epic after refactor.

## References

- `_bmad-output/spec-vikoagent/spec-vikoagent.md`
- `_bmad-output/architecture-vikoagent/architecture-vikoagent.md`
- `_bmad-output/prd-vikoagent/prd-vikoagent.md`
- `_bmad-output/ux-vikoagent/DESIGN.md`
- `_bmad-output/ux-vikoagent/EXPERIENCE.md`
