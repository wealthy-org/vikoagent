---
title: 'Refactor sweep'
type: 'refactor'
ticket: '5'
created: '2026-10-26'
status: 'built'
baseline_revision: 'ef7dda7210529de70a32fc23f40e2c146b8e9b75'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
---

## Intent

Audit foundation boundaries, test coverage, secret hygiene, and developer commands before downstream epics consume them. Fix only concrete foundation defects; defer larger redesign.

## Scope

Always preserve Devnet/Paper safety, provider isolation, read-model boundary, and deterministic tests. Never alter product scope or add live execution.

## Tasks & Acceptance

- [ ] Add modern ESLint configuration and script compatible with Next 16.
- [ ] Add `.gitignore` coverage for build output, dependencies, and secret files.
- [ ] Add boundary and safety regression tests.
- [ ] Run search excluding visual reference files; document intentional reference-only matches.
- [ ] Run build, test, lint, and status checks.

## Verification

- Modern ESLint flat config added for Next 16-compatible linting.
- Existing `.gitignore` verified for `node_modules`, `.next`, and env files.
- Reference-only mainnet strings remain isolated in `kivo-clone-full.html`, excluded from source safety scan.

- `npm test` -- all tests pass.
- `npm run build` -- production build passes.
- `npm run lint` -- lint passes.
- `git status --short --branch` -- clean after commit.
