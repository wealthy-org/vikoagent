# Task Breakdown Record Template

> **Official BMAD-Compliant Template for Append-Only Task & Progress Logging**  
> **Target Document:** `Task Breakdown Record.md` (or your project's progress log)  
> **Core Principle:** Append-only progress log. Every new progress entry adds a new block at the end of the file. Existing blocks are **NEVER** overwritten or modified.

---

## 1. Operating Rules for AI Agents

All AI coding agents (Pi, Claude Code, Cursor, Windsurf, Codex, etc.) working on this repository **MUST** adhere to the following non-negotiable rules:

1. **Mandatory Logging:**  
   After completing any feature, story, bug fix, refactor, UI/UX polish, or security hardening task, you **MUST** append a new progress block to `Task Breakdown Record.md` before concluding your response or declaring work complete.
2. **Append-Only Invariant:**  
   Existing blocks in `Task Breakdown Record.md` represent immutable historical audit trails. **NEVER** overwrite, reorder, truncate, or edit prior blocks. Always append to the very end of the file.
3. **Sequential 3-Digit Block Numbering:**  
   Block headers must follow the format:  
   `## Progress Block {NNN} — {Task / Milestone Title}`  
   Where `{NNN}` is a 3-digit zero-padded integer incremented from the previous block (e.g., `Progress Block 001`, `Progress Block 002`, ..., `Progress Block 069`, `Progress Block 070`).
4. **Verifiable Truth & Evidence:**  
   The `Verification` field must reflect actual commands executed during the session (e.g. test suite runs, linters, production builds, browser inspections) and their exact numeric results (e.g. `{N} test files passed ({M} tests passed, 100%)`, `Linter clean (0 errors, 0 warnings)`, `Production build passed`). Never fabricate or assume test results.
5. **Project Safety & Architectural Invariants:**  
   Every entry must verify and state adherence to project safety rules and domain boundaries (e.g. environment restrictions, non-production safeguards, credential protection, parameterization, and zero-leakage policies).
6. **Divider Separation:**  
   Each block must be separated from the previous and subsequent blocks by a markdown thematic break (`---`).

---

## 2. Field Specifications Reference

| Field | Necessity | Format / Acceptable Values | Description |
|---|---|---|---|
| **Timestamp** | Mandatory | `YYYY-MM-DD HH:MM:SS TZ` or `YYYY-MM-DD HH:MM TZ` | The exact date, time, and timezone when the task was verified and completed. |
| **Status** | Mandatory | `Completed` \| `Built` \| `Verified` \| `In Progress` \| `Local Scope Complete; Live Gate Blocked` | Current execution status of the task. |
| **Task** | Mandatory | String (1-2 sentences) | Clear, concise description of the user request, story goal, or assignment. |
| **Skill** | Mandatory | String (`bmad-build`, `bmad-ux`, `bmad-review`, `bmad-ticket`, `verification-before-completion`, `systematic-debugging`, etc.) | BMAD skill(s) or development skill(s) invoked to execute the work. |
| **Scope** | Mandatory | Comma-separated file / directory / route paths | Exact list of source files, components, tests, configurations, or packages modified or added. |
| **Problem Identified** / **Root Cause** | Required for Bug Fixes & Refactors | Structured text / bullet points | Detailed technical explanation of what was broken, missing, desynchronized, or sub-optimal prior to this work. |
| **Actions Taken** / **Actions** | Mandatory | Numbered or structured bullet points | Explicit list of implementation details, architectural adjustments, CSS changes, and logic added. |
| **Verification** | Mandatory | Concrete command & test outputs | Exact proof of verification: test runner file and test counts, linter status, build compilation status, and manual/browser checks. |
| **Safety** / **Security & Safety** | Mandatory | Compliance statement | Confirmation that project invariants, environment constraints, safety rules, and secret protection remain intact. |
| **Result** | Mandatory | String (1-2 sentences) | High-level summary of the outcome, current visual/functional fidelity, and operational readiness. |
| **Next Step** | Mandatory | String (1 sentence) | Immediate subsequent task, dependent story, or handoff directive. |
| **Commit** | Optional | Git commit SHA (e.g. `0b32d7a46e78...`) | Hash of the commit if changes were staged and committed during the task. |
| **Plan** | Optional | Relative markdown path | Story plan or ticket plan file created during planning/inception. |
| **Browser Telemetry** | Optional / UI Tasks | Viewport sizes and DOM verification | Specific viewports tested (e.g. `375x667`, `768x1024`, `1280x800`) and console error status. |
| **Limitations / Blockers** | Optional | String | Any environmental dependencies, missing external credentials, or deferred scope. |

---

## 3. Ready-to-Copy Markdown Templates

### Template A: Standard Feature / Story Implementation Block

```markdown
---

## Progress Block {NNN} — {Feature / Story Title}

| Field | Record |
|---|---|
| Timestamp | {YYYY-MM-DD HH:MM TZ} |
| Status | Completed |
| Task | {Concise summary of the task objective} |
| Skill | `bmad-build`, `verification-before-completion` |
| Scope | `{path/to/file1}`, `{path/to/file2}`, `{tests/path/to/test.ts}` |
| Actions | 1) {First key implementation detail}; 2) {Second key implementation detail}; 3) {Third key implementation detail} |
| Verification | {Test suite files and count passed}; Linter clean (0 errors, 0 warnings); Production build passed |
| Safety | Adherence to project safety rules; non-production safeguards active; zero private key / credential leakage |
| Result | {Summary of the delivered capability and system state} |
| Next Step | {Next task or subsequent milestone} |
```

---

### Template B: Bug Fix & Systematic Debugging Block

```markdown
---

## Progress Block {NNN} — {Bug Fix Title}

| Field | Record |
|---|---|
| Timestamp | {YYYY-MM-DD HH:MM TZ} |
| Status | Completed |
| Task | {Concise summary of the bug reported or behavior to fix} |
| Skill | `bmad-build`, `systematic-debugging`, `verification-before-completion` |
| Scope | `{path/to/file1}`, `{path/to/file2}` |
| Root Cause | {Technical explanation of why the defect or unexpected behavior occurred} |
| Fix | 1) {How the root cause was eliminated}; 2) {Defensive guards or regression tests added} |
| Verification | Test suite ({N} test files / {M} tests passed, 100%); Linter clean (0 errors, 0 warnings); Production build passed |
| Safety | Project safety invariants verified; zero credential leaks; safe error handling |
| Result | {Confirmation that the defect is completely eliminated with zero regressions} |
| Next Step | {Subsequent task or review} |
```

---

### Template C: UI/UX Parity & Responsive Polish Block

```markdown
---

## Progress Block {NNN} — {UI/UX Milestone Title}

| Field | Record |
|---|---|
| Timestamp | {YYYY-MM-DD HH:MM TZ} |
| Status | Completed |
| Task | {Visual, interactive, or responsive target to match} |
| Skill | `bmad-ux`, `bmad-build`, `verification-before-completion` |
| Scope | `{components/path}`, `{styles/path}`, `{pages/path}` |
| Problem Identified | 1) {Discrepancy in typography, color, spacing, or layout}; 2) {Mobile responsiveness or text wrapping collision}; 3) {Missing interactive animation or widget} |
| Actions Taken | 1) {CSS / layout refactoring}; 2) {Component markup adjustments}; 3) {Animation or interactive state implementation}; 4) {Cross-device styling synchronization} |
| Browser Telemetry | Browser inspection across Mobile ({375x667}), Tablet ({768x1024}), and Desktop ({1280x800}); zero console errors; smooth animations |
| Verification | Test suite ({N} files / {M} tests passed); Linter clean (0 errors, 0 warnings); Production build passed |
| Safety | Purely presentation and telemetry; core domain contracts and safety invariants preserved |
| Result | {Visual alignment outcome, responsive fidelity achieved} |
| Next Step | {Subsequent design section or user review} |
```

---

### Template D: Architectural, Security & Release Hardening Block

```markdown
---

## Progress Block {NNN} — {Hardening / Release Milestone Title}

| Field | Record |
|---|---|
| Timestamp | {YYYY-MM-DD HH:MM TZ} |
| Status | Verified |
| Task | {Audit, hardening, or release readiness objective} |
| Skill | `bmad-review`, `bmad-build`, `verification-before-completion` |
| Scope | `{packages/...}`, `{src/...}`, `{tests/...}`, `{docs/...}` |
| Audit Findings & Fixes | 1) {Vulnerability or edge case diagnosed and remediated}; 2) {Database resiliency or fallback added}; 3) {Rate limiting, timeout, or sanitization implemented} |
| Verification | Full test suite ({N} files / {M} tests passed); Linter clean; Production build passed; Dependency audit clean |
| Security & Safety | Zero private keys/secrets leaked; safe environment enforced; query parameterization verified; sanitization guards active |
| Result | {System hardening level achieved, release gate readiness} |
| Next Step | {Next release gate, deployment phase, or operational handoff} |
```

---

## 4. Canonical Examples

Below are standard reference examples illustrating each block type:

### Example 1 (Feature / Worker Service Implementation)
```markdown
## Progress Block 024 — Standalone Background Stream Ingestion Worker Built

| Field | Record |
|---|---|
| Timestamp | 2026-10-27 15:35 UTC |
| Status | Completed |
| Task | Build persistent background ingestion worker for streaming provider events directly into primary database |
| Skill | `bmad-build`, `verification-before-completion` |
| Scope | `apps/worker/src/index.ts`, `apps/worker/tsconfig.json`, `package.json`, `docs/worker-deployment-guide.md` |
| Actions | 1) Created standalone WebSocket client listening to upstream market events; 2) Implemented direct persistent ingestion into database with auto-reconnection on socket drops; 3) Configured build/start commands in `package.json` |
| Verification | Worker compiles cleanly with TypeScript; test suite (31 files / 78 tests) 100% green; Linter clean; Production build passed |
| Safety | Ingestion strictly read-only; no trade or signing credentials; fail-closed connection policy |
| Result | Stream ingestion can now run 24/7 in background cloud environment completely headless |
| Next Step | Run integration test in staging environment |
```

### Example 2 (Bug Fix & Systematic Debugging)
```markdown
## Progress Block 025 — Client-Server Hydration Mismatch in Locale Formatter Resolved

| Field | Record |
|---|---|
| Timestamp | 2026-10-27 13:30 UTC |
| Status | Completed |
| Task | Fix React SSR hydration mismatch caused by client/server locale divergence in number formatting |
| Skill | `bmad-build`, `systematic-debugging` |
| Scope | `apps/web/components/data-table.tsx` |
| Root Cause | `value.toLocaleString()` produced `14,250` on server (US locale) but `14.250` on client browser in regional locales, causing SSR hydration warning |
| Fix | Replaced with deterministic regex-based comma formatter and added defensive hydration suppressors on dynamic countdown elements |
| Verification | Test suite (30 files / 71 tests passed); Linter clean; Production build passed |
| Safety | Purely presentation formatting; zero business logic or state mutations |
| Result | Hydration warning completely eliminated across all client browser locales |
| Next Step | Continue dashboard performance audit |
```

### Example 3 (UI/UX Parity & Responsive Polish)
```markdown
## Progress Block 026 — Interactive Chart & Stepped Curve Parity Implemented

| Field | Record |
|---|---|
| Timestamp | 2026-10-27 17:45 UTC |
| Status | Completed |
| Task | Overhaul telemetry equity chart to achieve pixel-perfect fidelity, stepped curve path, and dynamic crosshair tracking |
| Skill | `bmad-ux`, `bmad-build`, `verification-before-completion` |
| Scope | `apps/web/styles/globals.css`, `apps/web/components/chart-card.tsx` |
| Problem Identified | 1) Equity curve rendered as smooth slope instead of authentic stepped event segments; 2) Missing horizontal grid guides and dynamic Y-axis price badge; 3) Cards wrapped awkwardly on viewports under 640px |
| Actions Taken | 1) Replaced smooth polyline with mathematically exact SVG stepped staircase path; 2) Implemented animated crosshair cursor following mouse position with dynamic tooltip; 3) Enforced single-line layout on metric badges with responsive grid collapsing |
| Browser Telemetry | Browser inspection across Mobile (375x667), Tablet (768x1024), and Desktop (1280x800); verified zero layout collisions and 60fps chart hover transitions |
| Verification | Test suite (31 files / 78 tests passed); Linter clean (0 errors, 0 warnings); Production build passed |
| Safety | Read-only chart telemetry; domain safety and test suites unaffected |
| Result | Telemetry chart matches target design with fluid interactive tracking |
| Next Step | Proceed to review with product owner |
```

---

## 5. Agent Verification Protocol (Before Appending)

Before appending a block to `Task Breakdown Record.md`, the AI agent must run and verify project quality checks:

```bash
# 1. Run full unit and integration test suite
npm test  # or pytest / cargo test / go test depending on stack

# 2. Run codebase linting
npm run lint

# 3. Run production build
npm run build
```

Then:
1. Open `Task Breakdown Record.md` and inspect the final block to find the highest block number (`Progress Block {NNN}`).
2. Calculate the next block number: `{NNN} + 1` (formatted with 3 digits, e.g. `001`, `002`, ..., `070`).
3. Fill in the appropriate template from Section 3 above.
4. Append the block to the very bottom of `Task Breakdown Record.md`.
5. Ensure the file ends with a clean newline and all existing historical blocks remain untouched.
