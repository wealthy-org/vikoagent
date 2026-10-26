---
title: 'Foundation vertical-slice verification'
type: 'feature'
ticket: '6'
created: '2026-10-26'
status: done
baseline_revision: '5df4acd869fc6667f0a5fbbdfb85f345ea524d51'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Prove foundation outputs connect as one safe runnable path: fixture Token Event, validated runtime config, persistence deduplication, shared contracts, and dashboard read-model rendering.

## Scope

Always use Devnet/Paper fixtures, deterministic IDs, no external provider, no secret values, and API/read-model boundary. Never broadcast or access real funds.

## Tasks & Acceptance

- [ ] `tests/foundation-slice.test.ts` -- exercise fixture through config, repository, contracts, and read model -- prove handoffs.
- [ ] `apps/api/src/read-model.ts` -- expose typed scanner read model -- keep UI boundary explicit.
- [ ] `tests/ui-contract.test.ts` -- verify persistent safety labels and key surface text -- protect UX tracer.
- [ ] `README.md` -- document clean install, verification, and safe run commands -- make handoff reproducible.

## Acceptance Criteria

- Given safe defaults, when fixture flow runs, then normalized event persists once and read model returns it.
- Given duplicate fixture event, when flow runs twice, then repository count stays one.
- Given dashboard contract, when source is inspected, then `DEVNET`, `PAPER MODE`, Scanner, Mind Stream, Treasury, and Receipts remain present.
- Given verification commands, when clean workflow runs, then test, build, and lint pass.

## Verification

- Foundation integration test covers config, fixture normalization, persistence deduplication, read model, Decision guard, and Health guard.
- UI contract test checks persistent safety labels and all core dashboard surfaces.
- README documents safe local run and verification commands.

- `npm test` -- all tests pass.
- `npm run build` -- production build passes.
- `npm run lint` -- lint passes.
