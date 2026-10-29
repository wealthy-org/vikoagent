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
- Progress tracking: `Task Breakdown Record.md` (append-only ledger) and `Task Breakdown Record Template.md` (canonical spec and template).

## Running and verifying

- Run `npm test`, `npm run lint`, and `npm run build` before declaring work complete.
- Use deterministic fixtures for local development; live PumpPortal transport remains separate from parser boundaries.
- Mandatory Task Logging: After completing any task, story, bug fix, or milestone, append a new progress block to `Task Breakdown Record.md` following `Task Breakdown Record Template.md`.

## Conventions that differ from defaults

- Use `ACCEPT`, `REJECT`, and `WATCH` for decisions; do not add execution authority to LLM output.
- Use idempotency keys for event, decision, and paper-trade writes.
- Use exact timestamps in ISO 8601 UTC format and preserve `DEVNET` / `PAPER MODE` labels.
- Progress records are strictly append-only: never overwrite, edit, or truncate prior blocks in `Task Breakdown Record.md`; always increment the block counter (`Progress Block NNN — <Title>`), fill all mandatory fields, and verify all claims before writing.

## Known pitfalls

- Root `app/` is current runtime entry; do not move dashboard work to `apps/web/` without updating build ownership.
- In-memory repositories prove contracts only; Neon persistence still needs integration verification.

<!-- /bmad:context -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
