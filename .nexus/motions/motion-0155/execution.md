# Execution: Single-Slot Preflight Admissibility Enforcement v0

**Motion:** motion-0155
**Kind:** builder-proof
**Program:** q2-proof-hardening-preflight-admissibility
**Status:** RATIFIED

---

## Touched files

Implementation was confined to:

- `runtime/runLedger.ts`
- `runtime/run-slot-dispatch.ts`

Ratification edits were confined to:

- `.nexus/motions/motion-0155/**`

---

## Required gate results

Recorded verification evidence:

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0155/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

---

## Acceptance and smoke evidence

- `P-01` through `P-12` all passed.
- `node --experimental-strip-types runtime/run-slot-dispatch.ts --help` includes the updated `--supersedes` lineage requirement.

Fail-fast evidence:

- no ledger mutation on preflight failure; the fail-fast smoke check kept the live ledger hash unchanged
- no dispatch on inadmissible rerun; a mismatched `--supersedes` target exited with a preflight failure before any provider work began

Ratification is based on the bounded two-file runtime diff plus passed acceptance checks.

No orchestration widening was introduced.

---

## Boundary confirmation

No-touch boundaries held for:

- `runtime/slotDispatch.ts`
- `runtime/taskContract.ts`
- `runtime/mark-run-reviewed.ts`
- `portal/**`
- `package.json`

Motion-0155 ratifies only bounded preflight admissibility enforcement for the existing
single-slot proof path. It does not ratify new runtime tools, live proof-only ledger
writes, orchestration generalization, retry behavior, controller logic, or scope widening
outside the declared touch list.
