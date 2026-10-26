---
name: Vikoagent
status: final
sources:
  - ../prd-vikoagent/prd-vikoagent.md
  - ../architecture-vikoagent/architecture-vikoagent.md
updated: 2026-10-26
---

# Vikoagent — Experience Spine

## Foundation

Responsive web dashboard for internal developers. Desktop-first; narrow viewports remain usable for inspection. Dashboard consumes API read models and one live-update transport abstraction. `DESIGN.md` owns visual identity and tokens.

## Information Architecture

| Surface | Purpose | Entry |
|---|---|---|
| Header / Health | Identity, network, mode, worker health, last event | App open |
| Scanner | Token Events, filters, source, progress, age | Header / app open |
| Mind Stream | Decisions, Agent Reasoning, rule references, timestamps | Scanner row / app open |
| Treasury | NAV, PnL, win rate, positions, paper label | App open |
| Receipts | Paper execution history and linked Decisions | App open / trade row |
| System State | Ingestion, risk, persistence, and errors | Header health / app open |

## Voice and Tone

Microcopy is concise, factual, and operational.

| Do | Don't |
|---|---|
| `PAPER MODE · NO BROADCAST` | `Trade now` |
| `REJECT · DEV HOLD 35%` | `Bad token` |
| `Feed stale · last event 42s ago` | `Everything looks good` |
| `Evaluating liquidity and holder concentration` | `AI is thinking...` |
| `Receipt recorded` | `Success!!!` |

## Component Patterns

| Component | Behavioral rules |
|---|---|
| Scanner row | Selecting row opens decision detail; selected state persists on refresh; row exposes source and age. |
| Filter tabs | `ALL`, `PUMP.FUN`, `METEORA DBC`, `MIGRATED`; filter updates list without losing mode labels. |
| Mind stream event | New events append chronologically; action, reason, mint, and timestamp visible; stale stream state remains explicit. |
| Treasury metric | Values show unit and mode; simulated values never appear as real funds. |
| Receipt row | Opens immutable detail; links receipt to Decision and Token Event. |
| Health badge | Displays healthy, stale, reconnecting, or error; text and icon accompany color. |
| Detail drawer | One level deep; Escape closes; preserves originating surface context. |

## State Patterns

| State | Treatment |
|---|---|
| Initial load | Skeletons match scanner, mind stream, and treasury geometry. |
| No events | Explain `No token events yet`; show source and connection state. |
| Evaluating | Orb has restrained activity; text says `Evaluating`; no fake action promise. |
| Reconnecting | Warning badge shows retry state and last successful event. |
| Stale data | Banner and timestamps identify stale source; no `LIVE` claim. |
| Error | Explain affected boundary, preserve prior records, provide retry where safe. |
| Empty treasury | Show starting paper balance and `No paper trades recorded`. |
| Reduced motion | Disable orb pulse, feed animation, and nonessential transitions. |

## Interaction Primitives

- Keyboard focus reaches scanner filters, rows, stream events, and receipt details in reading order.
- `Enter` opens selected record; `Escape` closes detail drawer.
- Tab filters are keyboard-operable and expose selected state.
- Refresh never clears current filter or selected record unless record no longer exists.
- Live updates append without forcing scroll when developer is reading older events.
- Copy actions for mint, receipt ID, and transaction signature provide text confirmation.

## Accessibility Floor

- WCAG 2.2 AA target.
- Every status has text/icon in addition to color.
- Focus indicators remain visible on dark surfaces.
- Live stream uses restrained `aria-live` announcements and does not announce every low-value event.
- Tables and data lists expose column/label relationships.
- Motion honors `prefers-reduced-motion`.
- Touch targets remain usable on narrow viewports.

## Responsive & Platform

| Viewport | Behavior |
|---|---|
| `>= 1200px` | Three-column operational dashboard; receipts and system state full width. |
| `768px–1199px` | Scanner and mind stream share width; treasury moves below or into a side drawer. |
| `< 768px` | Single-column stack: health, scanner, mind stream, treasury, receipts, system state. Detail opens full-screen. |

## Inspiration & Anti-patterns

- Adopt Kivo's clear status language, utility-card discipline, privacy/trust emphasis, and responsive app-like structure.
- Adapt Kivo's visual direction to Vikoagent's violet orb and trading telemetry.
- Reject staking, token, claim, farm, and profit-sharing flows from the reference.
- Reject dashboards that imply real-money execution while in Paper mode.
- Reject infinite auto-scroll, unreadable neon text, and hover-only actions.

## Key Flows

### Flow 1 — Raka verifies a token decision

1. Raka opens dashboard and sees `DEVNET` and `PAPER MODE` in header.
2. Scanner receives token event and shows source, age, and status.
3. Raka selects row; Mind Stream highlights matching Decision.
4. Detail shows action, rule reference, Agent Reasoning, timestamp, and mint.
5. **Climax:** Raka can explain why Vikoagent accepted or rejected token without reading worker logs.
6. Failure: feed becomes stale; header and scanner show last event time and stale state.

### Flow 2 — Raka verifies paper receipt

1. Raka opens approved Decision.
2. System records Paper Trade without blockchain broadcast.
3. Receipt appears with simulated fill, amount, fees, and receipt ID.
4. Treasury updates NAV, position, and PnL.
5. **Climax:** Raka confirms receipt and Treasury agree while `PAPER MODE` remains visible.
6. Failure: duplicate command returns existing receipt rather than duplicate trade.

### Flow 3 — Raka diagnoses worker health

1. Header changes worker badge to `RECONNECTING`.
2. Raka opens System State and sees affected source, retry count, last event, and error class.
3. Existing records remain readable.
4. **Climax:** Raka identifies whether issue belongs to provider adapter, risk engine, or persistence without secret access.
