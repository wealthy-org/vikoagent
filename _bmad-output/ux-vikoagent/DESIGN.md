---
name: Vikoagent
description: Internal Solana Devnet paper-trading telemetry dashboard.
colors:
  background: '#0B0813'
  surface: '#0F0C1B'
  surface-glass: 'rgba(26, 20, 42, 0.7)'
  border: 'rgba(139, 92, 246, 0.15)'
  primary: '#8B5CF6'
  primary-strong: '#7C3AED'
  accent: '#A855F7'
  success: '#10B981'
  danger: '#F43F5E'
  text: '#F5F3FF'
  text-muted: '#A8A0B8'
typography:
  display:
    fontFamily: 'Sora'
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.15'
  body:
    fontFamily: 'Inter'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data:
    fontFamily: 'JetBrains Mono'
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
components:
  glass-panel:
    background: '{colors.surface-glass}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  primary-button:
    background: '{colors.primary-strong}'
    foreground: '{colors.text}'
    radius: '{rounded.md}'
  status-badge:
    radius: '{rounded.full}'
  data-value:
    fontFamily: '{typography.data.fontFamily}'
---

## Brand & Style

Vikoagent is an observability instrument for an autonomous trader. It should feel precise, calm, and alive: dark glass surfaces provide depth, violet light marks active intelligence, and monospace data makes system state inspectable. The purple eye orb is identity and status signal, not decoration that competes with the operational content.

## Colors

- `{colors.background}` is the deep canvas.
- `{colors.surface}` separates primary regions from canvas.
- `{colors.surface-glass}` and `{colors.border}` create restrained glass panels.
- `{colors.primary}` and `{colors.primary-strong}` indicate active controls and selected state.
- `{colors.accent}` marks agent activity and attention, not generic decoration.
- `{colors.success}` means accepted/profitable/healthy.
- `{colors.danger}` means rejected/loss/error.
- Status must include text or icon alongside color.

## Typography

`{typography.display}` is reserved for dashboard title and high-level value headings. `{typography.body}` handles labels, explanations, and controls. `{typography.data}` handles mints, hashes, timestamps, balances, metrics, and event codes. Avoid long display-text wrapping.

## Layout & Spacing

Desktop uses a three-region dashboard: scanner, mind stream, and treasury. Header and system health remain full width. Receipts and system events follow as full-width audit sections. Use spacing tokens; maintain consistent panel gutters. Under 900px, stack regions in priority order: health, scanner, mind stream, treasury, receipts, system events.

## Elevation & Depth

Prefer tonal layering and thin violet borders over heavy shadows. Use soft violet glow only for active agent status, orb halo, and selected panel. No broad gradients behind text. Motion remains subtle and respects reduced-motion settings.

## Shapes

Use `{rounded.lg}` for major panels, `{rounded.md}` for controls, `{rounded.sm}` for compact data elements, and `{rounded.full}` only for status badges and progress indicators. Avoid excessive nested cards.

## Components

- **Agent header:** orb, `VIKOAGENT`, network badge, mode badge, scanner health, and last event timestamp.
- **Scanner panel:** filter tabs, token rows, bonding progress, source, age, and decision status.
- **Mind stream:** chronological event feed with action label, concise reasoning, mint, rule reference, and timestamp.
- **Treasury panel:** NAV, realized PnL, win rate, active positions, and explicit `PAPER` label.
- **Receipt row:** action, mint, simulated fill, amount, fees, receipt ID, and linked decision.
- **Status badge:** text plus icon; never color-only.
- **Orb:** idle, scanning, evaluating, healthy, warning, and error states; state remains understandable without animation.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Show `DEVNET` and `PAPER MODE` persistently | Hide network state in settings |
| Use monospace for hashes and metrics | Use proportional type for long IDs |
| Pair state color with text/icon | Convey state through color alone |
| Keep one clear action per panel | Add trading actions that imply mainnet execution |
| Use violet glow as controlled signal | Turn every border and card into neon |
| Make feed health and timestamps visible | Present stale data as live |
| Preserve orb identity as status signal | Let mascot dominate scanner data |
