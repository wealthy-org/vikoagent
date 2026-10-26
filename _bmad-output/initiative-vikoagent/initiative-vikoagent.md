---
type: initiative
id: initiative-vikoagent
title: Vikoagent Phase 1
created: 2026-10-26
updated: 2026-10-26
---

# Vikoagent Phase 1

## Intent

Build a standalone Solana Devnet paper-trading telemetry product that lets internal developers verify market ingestion, deterministic risk decisions, paper execution, and dashboard observability without real capital.

## Outcome

A developer can run the Vikoagent pipeline in Devnet/Paper mode, observe a token event move through evaluation into a recorded receipt, and verify reasoning, portfolio impact, and system health from the dashboard.

## Done when

- The platform foundation runs with validated Devnet/Paper safety configuration.
- Market events are normalized, deduplicated, persisted, and visible.
- Deterministic decisions and paper receipts update Treasury consistently.
- Dashboard exposes scanner, Mind Stream, Treasury, receipts, and health states.
- Automated verification covers vertical slice, safety, idempotency, and responsive core surfaces.

## Boundaries

- Mainnet execution, staking, token contracts, custody, deposits, and profit sharing excluded.
- `apps/web`, `apps/api`, `workers/market-ingestor`, and `packages/*` are owned by relevant epics below.
- Existing `kivo-clone-full.html` is visual reference only.

## Known decisions

- Solana Devnet only; Paper mode default.
- Domain engine owns decision and portfolio mutations.
- Neon PostgreSQL is source of truth.
- External providers use adapters.
- LLM creates explanation text only.

## References

- `_bmad-output/spec-vikoagent/spec-vikoagent.md`
- `_bmad-output/architecture-vikoagent/architecture-vikoagent.md`
- `_bmad-output/prd-vikoagent/prd-vikoagent.md`
- `_bmad-output/ux-vikoagent/DESIGN.md`
- `_bmad-output/ux-vikoagent/EXPERIENCE.md`
