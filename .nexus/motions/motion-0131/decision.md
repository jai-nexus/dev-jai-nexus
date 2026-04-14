# Decision: motion-0131 — JAI Grid Draft Package Ergonomics v0

**Status:** RATIFIED
**Date:** 2026-04-14
**Motion:** motion-0131
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop

---

## Gate results

| Gate | Result | Exit | Timestamp |
|---|---|---|---|
| validate_motion | PASS | 0 | 2026-04-14T18:09:45.891Z |
| validate_agency | PASS | 0 | 2026-04-14T18:09:46.229Z |
| typecheck | PASS | 0 | 2026-04-14T18:09:50.925Z |

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

Two commits deliver the complete motion-0131 ergonomics surface:

| Commit | File | Description |
|---|---|---|
| `be6d5ff` | `portal/src/lib/grid/gridMotionDraft.ts` | Slice 1: pure ID helpers (+28 lines) |
| `0e6849b` | `portal/src/app/operator/grid/GridView.tsx` | Slice 2: MotionDraftModal ergonomics (+57/-10) |

**Modified module:**
- `portal/src/lib/grid/gridMotionDraft.ts` — adds `MOTION_ID_PATTERN` (`/^motion-\d{4}$/`),
  `isValidMotionId(id): boolean`, and `substituteMotionId(scaffold, motionId): MotionDraftScaffold`;
  pure, no new imports, input not mutated

**Modified component:**
- `portal/src/app/operator/grid/GridView.tsx` — `MotionDraftModal` gains: motion ID input field
  with format validation, amber→green status banner, live `substituteMotionId` application
  across all four tabs, and a 5th `bundle.txt` tab with `=== <filename> ===` delimited
  concatenation for single-copy delivery; footer path updates to real motion ID when valid

---

## Properties

- **No runtime writes.** All output remains in React state and clipboard. No `.nexus/` writes.
- **Typecheck clean.** `pnpm -C portal typecheck` exits 0 with both updated files in place.
- **Pure helpers.** `gridMotionDraft.ts` remains two `import type` only; three new exports
  have no side effects and are deterministic.
- **Operator mediation preserved.** Motion ID is entered manually; no auto-increment; no
  auto-creation of motion directories; bundle tab is additive, not a bypass of per-file review.
- **Bounded scope.** Two files changed, no other grid lib modules touched, no governance
  scripts touched.
- **Risk score:** 0.15 (max 0.20 threshold). No escalation triggered. `escalation_state: null`.

---

## Before → After

Before motion-0131: `MotionDraftModal` showed four tabs with per-tab copy buttons. Every
tab's content contained the literal string `motion-XXXX`. Operator had to manually find-and-
replace `motion-XXXX` in four separate paste operations.

After motion-0131: `MotionDraftModal` shows a motion ID input field at the top of the header:
- Amber banner while empty or invalid (`motion-XXXX` still visible in all content)
- Green banner + live substitution once a valid `motion-\d{4}` ID is entered
- All four file tabs and the bundle tab reflect the substituted ID
- Footer path shows `.nexus/motions/<entered-id>/<filename>` when valid
- Bundle tab (5th) delivers all four files in a single copy — one operation covers the full
  scaffold package
