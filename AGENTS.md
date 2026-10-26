<!-- bmad:context -->
<!-- Verified 2026-10-27 against b6a613d. Managed by bmad-project-context. -->

## Vikoagent

Vikoagent is a TypeScript/Next.js Solana Devnet paper-trading telemetry product. Keep domain decisions and paper mutations deterministic; planning artifacts live under `_bmad-output/`.

## Policy

- Never enable mainnet, wallet signing, or real-fund execution.
- Keep provider code behind adapter boundaries; domain code must not import provider SDKs.
- Keep secrets and private keys server-side; never place them in browser payloads, logs, or reasoning prompts.

## Where things are

- Runtime UI: `app/`; architecture target surfaces: `apps/api/` and `apps/web/`.
- Domain logic: `packages/domain/`; shared contracts: `packages/contracts/`.
- Ingestion adapters: `packages/ingestion/`; persistence ports: `packages/persistence/`.
- Requirements and tickets: `_bmad-output/`.

## Running and verifying

- Run `npm test`, `npm run lint`, and `npm run build` before declaring work complete.
- Use deterministic fixtures for local development; live PumpPortal transport remains separate from parser boundaries.

## Conventions that differ from defaults

- Use `ACCEPT`, `REJECT`, and `WATCH` for decisions; do not add execution authority to LLM output.
- Use idempotency keys for event, decision, and paper-trade writes.
- Use exact timestamps in ISO 8601 UTC format and preserve `DEVNET` / `PAPER MODE` labels.

## Known pitfalls

- Root `app/` is current runtime entry; do not move dashboard work to `apps/web/` without updating build ownership.
- In-memory repositories prove contracts only; Neon persistence still needs integration verification.

<!-- /bmad:context -->
