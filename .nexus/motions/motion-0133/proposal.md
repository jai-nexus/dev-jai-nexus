# Proposal: JAI Grid Post-Ingest Review Workflow v0

**Motion:** motion-0133
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-14
**Basis:** motion-0132 (JAI Grid Repo Ingest Workflow v0)

---

## Problem

Motion-0132 seals the ingest seam: `pnpm grid:ingest` parses, validates, and materializes
four motion package files under `.nexus/motions/<motion-id>/`. After the ingest script exits,
the operator path to `pnpm council:run` still has no structured pre-flight check:

1. No single command verifies that all four required files are still present (a `--force`
   ingest or manual edit could leave the directory incomplete)
2. No check that the directory name matches `motion_id` in `motion.yaml` (mismatch is
   possible if the directory was renamed or the file was edited post-ingest)
3. No `validate-motion` re-run on the current on-disk state — the inline post-write
   output from `grid:ingest` may be stale if files were edited afterward
4. No git working-tree summary — the operator doesn't know whether the directory is
   untracked, staged, or has unstaged changes before invoking the ratification path
5. `pnpm council:run` is the first structured gate, but it runs checks as a ratification
   attempt, not a pre-flight review — errors discovered there are harder to recover from

The gap is a **readiness signal gap**: no single command produces a named, actionable
`READY_FOR_COUNCIL_RUN` or `NOT_READY` verdict before the operator invokes council-run.

---

## Solution

Add `portal/scripts/grid-review-motion-package.mjs`: a read-only local script that:

1. Accepts `--motion <motion-id>` (e.g. `motion-0133`)
2. Runs five checks in sequence, stopping at first failure:
   - **DIR_EXISTS** — `.nexus/motions/<id>/` is present
   - **FILES_PRESENT** — all four required files exist
   - **ID_CONSISTENT** — `motion_id:` in `motion.yaml` matches the directory name
   - **VALIDATE_MOTION** — spawns `validate-motion.mjs`, captures result
   - **GIT_STATE** — runs `git status --short` on the directory (informational, not blocking)
3. Prints a structured per-check report
4. Prints a final named verdict: `READY_FOR_COUNCIL_RUN` (exit 0) or `NOT_READY (<reason>)`
   (exit 1)
5. Optionally emits machine-readable JSON via `--json`
6. **Writes nothing.** Read-only under all code paths.

Add `"grid:review": "node portal/scripts/grid-review-motion-package.mjs"` to root
`package.json`.

The complete operator flow after this motion:

```
pnpm grid:ingest --bundle /path/to/bundle.txt
  → .nexus/motions/motion-0133/ materialized (4 files)

pnpm grid:review --motion motion-0133
  → per-check report
  → READY_FOR_COUNCIL_RUN  ✅  (or NOT_READY with named reason)

[operator: git add / git commit if not already staged]

pnpm council:run motion-0133
  → ratification gates
```

---

## Design: read-only, stop-on-first-failure

All checks are read-only filesystem and subprocess operations. No file mutations occur
under any code path. Checks run in dependency order — DIR_EXISTS before FILES_PRESENT,
FILES_PRESENT before ID_CONSISTENT, etc. — so the first failure produces the most
actionable error message.

GIT_STATE is always reported but never blocks the READY verdict. Git state is informational:
the operator may have intentional reasons for an untracked or unstaged working tree (e.g.
reviewing before staging). Blocking on git state would impose an ordering constraint that
is not strictly required for `council:run` correctness.

---

## Design: reuse validate-motion.mjs, not a parallel validator

`validate-motion.mjs` is the repo-local schema gate used by council-run. The review script
spawns it as a subprocess and captures its exit code and output — the same execution path
used by `grid-ingest-bundle.mjs` (motion-0132). No parallel validation logic is introduced.

---

## Design: no auto-council-run

The review script exits 0 on READY but does not invoke `council:run`. The next-step
instruction is printed explicitly for the operator to run. This preserves the operator
mediation boundary that has been maintained across motion-0129 through motion-0132.

---

## Success criteria

- **SC-1** `pnpm grid:review --motion motion-0133` runs a per-check report for
  `.nexus/motions/motion-0133/`
- **SC-2** A fully valid package (4 files, ID consistent, validate-motion pass) → exit 0,
  `READY_FOR_COUNCIL_RUN`
- **SC-3** Missing any required file → exit 1, `NOT_READY (FILES_PRESENT)`, file named
- **SC-4** `motion_id` in `motion.yaml` does not match directory → exit 1,
  `NOT_READY (ID_MISMATCH)`, both values shown
- **SC-5** `validate-motion` fails → exit 1, `NOT_READY (VALIDATE_MOTION)`, output shown
- **SC-6** Directory absent → exit 1, `NOT_READY (DIR_MISSING)`
- **SC-7** GIT_STATE always reported (informational); does not affect READY/NOT_READY
- **SC-8** `--json` produces `{ ready: boolean, verdict: string, checks: [...] }`
- **SC-9** Script writes no files under any code path
- **SC-10** `pnpm -C portal typecheck` exits 0 — no TypeScript changes required

---

## Non-goals

- Writing, repairing, or modifying any files
- Auto-staging, auto-committing, or auto-PR
- Invoking `council:run` automatically
- Enforcing git staging state (reported only)
- Validating `validate-agency` from the review script (council-run owns that gate)
- Portal runtime changes
- Changes to `gridMotionDraft.ts`, `GridView.tsx`, `grid-ingest-bundle.mjs`,
  `council-run.mjs`, `validate-motion.mjs`, `validate-agency.mjs`, `motionLib.mjs`
- Live Ops, telemetry, notifications, collaboration, onboarding automation
- Cross-repo routing or database changes
