---
type: epic
id: 2
title: Market ingestion and event persistence
covers: [CAP-1]
---
# Market ingestion and event persistence

## Intent
Normalize mock and PumpPortal market events, deduplicate them, and persist source health.

## Outcome
A token launch or migration is reliably visible as one Token Event.

## Done when
- Mock source proves end-to-end ingestion.
- PumpPortal adapter implements same port.
- Reconnect and idempotency behavior are tested.

## Notes

- Decision: first story defines adapter contract; second story proves mock tracer path before live provider integration.
- Decision: PumpPortal remains behind adapter boundary and is blocked on transport/reconnect policy confirmation.
- Decision: refactor sweep and end-to-end verification close epic.
- Evidence: mock adapter → normalization → repository deduplication → scanner health verified in `tests/market-ingestion-e2e.test.ts`.
- Handoff: risk engine may consume provider-neutral persisted Token Events; live PumpPortal transport remains separate future work.

## References
- `_bmad-output/spec-vikoagent/integrations.md`
- `_bmad-output/architecture-vikoagent/architecture-vikoagent.md`
