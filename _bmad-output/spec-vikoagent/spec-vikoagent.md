---
id: SPEC-vikoagent
companions:
  - architecture.md
  - state-machines.md
  - integrations.md
sources:
  - vikoagent.md
---

# Vikoagent

## Why

Vikoagent makes autonomous Solana trading behavior observable and testable without exposing real capital. Internal developers need one standalone dashboard that discovers market events, explains deterministic risk decisions, records paper execution, and proves system state while development remains isolated on Solana Devnet.

## Capabilities

- **CAP-1**
  - **intent:** System discovers Pump.fun token launches and migration events for scanner visibility.
  - **success:** A received launch or migration event appears as a deduplicated token record with mint, source, timestamp, and market data.

- **CAP-2**
  - **intent:** System evaluates token events with deterministic risk rules and records `WATCH`, `REJECT`, `BUY`, or `SELL` decisions.
  - **success:** Given identical token input and rule configuration, system produces identical decision output and stores its rule reason.

- **CAP-3**
  - **intent:** System presents concise human-readable reasoning for agent decisions without granting LLM transaction-signing authority.
  - **success:** Dashboard displays reasoning linked to a decision while signing credentials remain unavailable to frontend and LLM execution paths.

- **CAP-4**
  - **intent:** System records paper execution receipts, positions, treasury telemetry, and PnL for dashboard display.
  - **success:** A paper trade creates an auditable receipt and updates position, NAV, realized PnL, and win-rate projections consistently.

- **CAP-5**
  - **intent:** Dashboard presents agent status, live scanner, decision stream, treasury performance, and execution receipts in Vikoagent violet dark-glass visual language.
  - **success:** Developer can identify network, operating mode, scanner state, latest decision, and treasury state from the primary dashboard view.

## Constraints

- Phase 1 runs exclusively on Solana Devnet.
- Paper trading is default and primary for Phase 1.
- Mainnet execution, real capital, staking, token contracts, yield farming, and profit-sharing are excluded.
- Vikoagent is standalone; core behavior cannot depend on Papertrade, Orbio, Levanto, or Mosh.
- Deterministic risk rules control order approval; LLM output cannot approve or sign transactions.
- Private keys remain backend-only, never frontend or LLM accessible.
- UI uses deep obsidian surfaces with electric violet accents and explicit `DEVNET` / `PAPER MODE` status.

## Non-goals

- Mainnet trading.
- Native Vikoagent token or staking contract.
- User deposits, custody, yield farming, or profit sharing.
- LLM-controlled transaction execution.
- Rebuilding Kivo's remote-access product flows.

## Success signal

A developer can run Vikoagent in Devnet paper mode, observe a token event move through risk evaluation into a recorded paper receipt, and verify the decision reason, portfolio impact, and system mode from the dashboard without real funds.

## Assumptions

- Initial market ingestion uses PumpPortal launch and migration feeds described in `vikoagent.md`.
- Neon PostgreSQL stores tokens, decisions, and trades.
- OpenRouter may generate explanation text, but deterministic rules remain authoritative.
- Existing `kivo-clone-full.html` is visual reference material, not maintainable application source.

## Open Questions

- Which exact risk thresholds and blacklist policy define the initial deterministic rule set?
- Should first dashboard release use mocked events, live PumpPortal events, or both behind an adapter?
- Which read-stream transport is required for first release: polling, SSE, or WebSocket?
- What paper portfolio starting balance and valuation convention should tests use?
