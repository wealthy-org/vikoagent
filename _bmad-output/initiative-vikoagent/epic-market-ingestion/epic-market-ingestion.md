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

## References
- `_bmad-output/spec-vikoagent/integrations.md`
- `_bmad-output/architecture-vikoagent/architecture-vikoagent.md`
