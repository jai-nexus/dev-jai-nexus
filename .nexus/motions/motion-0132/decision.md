# Decision: motion-0132 — JAI Grid Repo Ingest Workflow v0

**Status:** RATIFIED
**Date:** 2026-04-14
**Motion:** motion-0132
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop

---

## Gate results

| Gate | Result | Exit | Timestamp |
|---|---|---|---|
| validate_motion | PASS | 0 | 2026-04-14T18:43:49.112Z |
| validate_agency | PASS | 0 | 2026-04-14T18:43:49.112Z |
| typecheck | PASS | 0 | 2026-04-14T18:43:49.112Z |

All required gates pass. `required_ok: true`. `failed_required_gates: []`.

---

## Vote outcome

| Role | Vote |
|---|---|
| proposer | yes |
| challenger | yes |
| arbiter | yes |

Vote mode: `unanimous_consent` — all required roles present, all yes.
Result: **PASS** → **RATIFIED**

---

## Deliverables

One commit delivers the complete ingest surface:

| Commit | File | Description |
|---|---|---|
| `85fe862` | `portal/scripts/grid-ingest-bundle.mjs` | New: validated bundle ingest script (309 lines) |
| `85fe862` | `package.json` | Modified: `grid:ingest` entry |

**New script:**
- `portal/scripts/grid-ingest-bundle.mjs` — `pnpm grid:ingest --bundle <path>` or `--stdin`;
  parses `=== <filename> ===` bundle format; runs 6 pre-write validations (section
  completeness, non-empty, placeholder absent, motion ID format, `parseMotionText` schema,
  directory conflict); writes exactly 4 files under `.nexus/motions/<id>/`; spawns
  `validate-motion` post-write; exits 0 on success

---

## Properties

- **No portal runtime writes.** `GridView.tsx` and `gridMotionDraft.ts` unchanged. Portal
  uses clipboard only. `git status` clean after any modal interaction.
- **Fail before first write.** All 6 validation checks run before `fs.mkdirSync()`. Any
  failure exits 1 with zero filesystem mutations.
- **Exactly 4 files written.** `motion.yaml`, `proposal.md`, `execution.md`, `challenge.md`.
  No `vote.json`, `policy.yaml`, `decision.yaml`, `verify.json` — those remain council-run's
  domain.
- **No commit, no PR.** Script ends at file materialization + next-step instructions. Operator
  reviews `git diff`, stages, and commits under normal governance.
- **Reuses motionLib.mjs.** Pre-write schema validation uses the same `parseMotionText()`
  called by `validate-motion.mjs` and `council-run.mjs`. No parallel validation path.
- **Typecheck clean.** No TypeScript changes. `pnpm -C portal typecheck` exits 0.
- **Risk score:** 0.12. No escalation triggered. `escalation_state: null`.

---

## Before → After

Before motion-0132: Operator copies bundle from `MotionDraftModal`, manually runs `mkdir
.nexus/motions/motion-XXXX/`, pastes four separately-named files, and discovers schema errors
only when `council:run` fails.

After motion-0132: Operator runs `pnpm grid:ingest --bundle /path/to/bundle.txt`. Script
validates structure and schema, fails fast with clear errors on any problem, and on success
materializes the four files with a post-write `validate-motion` confirmation and next-step
instructions for the normal governance path.
