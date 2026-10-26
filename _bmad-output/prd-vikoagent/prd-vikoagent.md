---
title: Vikoagent Phase 1
created: 2026-10-26
updated: 2026-10-26
status: final
---

# PRD: Vikoagent Phase 1

## 0. Document Purpose

This PRD defines the internal developer product for observing and validating Vikoagent's autonomous Solana Devnet paper-trading pipeline. It converts the approved spec and architecture spine into user-facing requirements, testable functional requirements, guardrails, and MVP boundaries.

## 1. Vision

Vikoagent gives developers one trustworthy surface for watching token discovery, risk evaluation, agent explanation, paper execution, and treasury telemetry. It makes every decision inspectable without exposing real capital.

The product is standalone. It uses Devnet and paper mode while the team validates ingestion, deterministic risk rules, persistence, and dashboard behavior. Visual identity follows dark obsidian surfaces, violet accents, and a purple eye orb.

## 2. Target User

### 2.1 Jobs To Be Done

- Verify market events arrive and are deduplicated.
- Understand why each token is watched or rejected.
- Confirm paper trades change portfolio state correctly.
- Detect stale feeds, failed workers, and unsafe runtime configuration.
- Review execution receipts and decision history during development.

### 2.2 Non-Users (v1)

- Public investors.
- Mainnet traders.
- Stakers or token holders.
- Users depositing or withdrawing funds.

### 2.3 Key User Journeys

- **UJ-1. Developer validates a discovered token.** Developer opens dashboard in `DEVNET` / `PAPER MODE`, sees token in scanner, opens decision detail, and verifies rule reason and timestamp.
- **UJ-2. Developer validates paper execution.** Developer selects an approved event, observes paper receipt, then confirms position, NAV, and PnL update.
- **UJ-3. Developer diagnoses pipeline health.** Developer sees stale or disconnected feed status, inspects event history, and identifies the failing boundary without accessing provider credentials.

## 3. Glossary

- **Token Event** — normalized market launch or migration event.
- **Decision** — deterministic result: `WATCH`, `REJECT`, `BUY`, or `SELL`.
- **Paper Trade** — simulated execution with no blockchain broadcast.
- **Execution Receipt** — immutable record of a paper or later Devnet execution.
- **Treasury** — simulated portfolio value, positions, NAV, PnL, and win rate.
- **Risk Rule** — deterministic condition used to evaluate a Token Event.
- **Agent Reasoning** — human-readable explanation; never an execution authority.

## 4. Features

### 4.1 Market Scanner

**Description:** Developer sees normalized Token Events from configured source adapters with source, mint, market data, bonding progress, and time. Duplicate source events do not create duplicate records. Real provider and mock source can share one adapter contract.

**Functional Requirements:**

#### FR-1: Display Token Events

System must display recent normalized Token Events with mint, name, symbol, source, market cap, timestamp, and status. Realizes UJ-1.

**Consequences (testable):**
- A valid event appears in scanner within the configured read-model refresh window.
- Replaying same source event does not create another token record.

#### FR-2: Show Feed Health

System must display connection state, last event time, and error state for each ingestion source. Realizes UJ-3.

**Consequences (testable):**
- Stale heartbeat changes status from healthy to stale using configured threshold.
- Provider credential values never appear in UI or API response.

### 4.2 Deterministic Risk Decisions

**Description:** Risk engine evaluates Token Events using configured Risk Rules. Same input and rule configuration produce same Decision. Agent Reasoning may explain result but cannot change it.

#### FR-3: Evaluate Events

System must create one Decision for each evaluated Token Event using `WATCH`, `REJECT`, `BUY`, or `SELL`. Realizes UJ-1.

**Consequences (testable):**
- Identical fixture input returns identical decision and rule reason.
- Decision stores event reference, action, confidence if used, reason, and timestamp.

#### FR-4: Explain Decisions

System must display concise Agent Reasoning linked to Decision. Realizes UJ-1.

**Consequences (testable):**
- Missing reasoning does not alter deterministic action.
- LLM path has no signing or order-approval capability.

### 4.3 Paper Execution and Treasury

**Description:** Approved decisions create Paper Trades and update Treasury. Every mutation has an immutable receipt and source Decision reference.

#### FR-5: Record Paper Trade

System must record paper buy and sell executions with mint, amount, mode, simulated fill, fees, timestamp, and receipt identifier. Realizes UJ-2.

**Consequences (testable):**
- Paper mode does not broadcast a Solana transaction.
- Repeated command with same idempotency key creates one receipt.

#### FR-6: Update Treasury

System must calculate positions, NAV, realized PnL, and win rate from recorded paper trades. Realizes UJ-2.

**Consequences (testable):**
- Receipt and Treasury read model agree after each accepted trade.
- Dashboard explicitly labels simulated values.

### 4.4 Dashboard and Audit Stream

**Description:** Dashboard combines scanner, decision stream, Treasury, execution receipts, system state, and safety labels in one responsive surface.

#### FR-7: Show Safety State

System must always show network and operating mode in the primary dashboard view. Realizes UJ-1 and UJ-3.

**Consequences (testable):**
- `DEVNET` and `PAPER MODE` are visible without opening settings.
- Startup rejects unsupported mainnet configuration for Phase 1.

#### FR-8: Show Audit History

System must allow chronological inspection of Token Events, Decisions, Paper Trades, and system errors. Realizes UJ-3.

**Consequences (testable):**
- Each displayed record links to its preceding event or Decision where applicable.
- Event IDs and timestamps remain stable across refreshes.

## 5. Non-Goals (Explicit)

- Mainnet execution.
- Native token, staking, farming, or profit-sharing.
- User deposits, withdrawals, custody, or investment accounts.
- LLM approval, signing, or direct transaction execution.
- Rebuilding Kivo remote-access functionality.

## 6. MVP Scope

### 6.1 In Scope

- Mock event adapter for vertical-slice testing.
- Pump.fun launch and migration adapter contract.
- Deterministic risk engine.
- Neon persistence model.
- Paper execution ledger.
- Treasury telemetry.
- Dashboard read model and live-update abstraction.
- Devnet/Paper safety validation.
- Violet dark-glass dashboard shell.

### 6.2 Out of Scope for MVP

- Live Devnet signing; defer until paper mode passes safety validation.
- Meteora integration; defer behind adapter.
- Final live transport choice; keep abstraction until load and UX tests decide.
- Public user accounts and permissions.

## 7. Cross-Cutting NFRs

- **NFR-1 Security:** Private keys and provider secrets remain server-side; never enter browser payloads, logs, or LLM prompts.
- **NFR-2 Determinism:** Risk evaluation is repeatable for identical input and configuration.
- **NFR-3 Reliability:** Ingestion retries with bounded exponential backoff and deduplicates events.
- **NFR-4 Auditability:** Decisions and receipts are append-only and retain source references.
- **NFR-5 Observability:** Worker health, last event time, errors, and request/event IDs are visible to developers.
- **NFR-6 Usability:** Network and mode state are visible in primary view; interface remains usable on desktop and narrow viewport.

## 8. Constraints and Guardrails

- Runtime default: `SOLANA_NETWORK=devnet`, `AGENT_MODE=PAPER`.
- Domain engine owns decision and portfolio mutations.
- Neon PostgreSQL owns persisted state.
- External providers enter through adapters.
- Existing `kivo-clone-full.html` is reference material, not application source.

## 9. Information Architecture

- Header: Vikoagent identity, network, mode, worker health.
- Scanner: Token Events and filters.
- Mind stream: Decisions and Agent Reasoning.
- Treasury: NAV, PnL, win rate, positions.
- Receipts: Paper Trade history and event links.
- System state: ingestion, risk engine, persistence, and errors.

## 10. Success Metrics

**Primary**

- **SM-1:** 100% of fixture Token Events receive deterministic repeatable decisions. Validates FR-3.
- **SM-2:** 100% of accepted paper trades produce one auditable receipt and consistent Treasury update. Validates FR-5, FR-6.
- **SM-3:** Developer can identify network, mode, latest decision, and Treasury state from one dashboard view. Validates FR-7.

**Secondary**

- **SM-4:** Duplicate provider events produce zero duplicate domain records. Validates FR-1.
- **SM-5:** Secret scanning finds zero private keys or provider credentials in client bundle, logs, and persisted reasoning. Validates NFR-1.

**Counter-metrics**

- **SM-C1:** Do not optimize for trade count; safety and decision auditability outrank execution volume.
- **SM-C2:** Do not optimize LLM prose length; explanation must remain concise and non-authoritative.

## 11. Open Questions

1. What initial Risk Rules and thresholds are approved?
2. What starting Paper Trade balance and valuation convention are approved?
3. Should first deployment enable mock events only, live PumpPortal events only, or a controlled toggle?
4. Which live-update transport passes first UX and load validation?
5. Which developer roles require access once public deployment begins?

## 12. Assumptions Index

- `[ASSUMPTION]` Source adapter contract supports mock and PumpPortal implementations.
- `[ASSUMPTION]` Neon PostgreSQL remains persistence target for MVP.
- `[ASSUMPTION]` OpenRouter reasoning is optional and cannot block deterministic Decision creation.
