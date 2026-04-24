# Execution: Single-Slot Execution Attempt Lineage and Supersession v0

**Motion:** motion-0154
**Kind:** builder-proof
**Program:** q2-proof-hardening-rerun-semantics
**Status:** RATIFIED

---

## Touched files

Implementation was confined to:

- `runtime/runLedger.ts`
- `runtime/run-slot-dispatch.ts`

Ratification edits were confined to:

- `.nexus/motions/motion-0154/**`

---

## Required gate results

Recorded verification evidence:

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0154/motion.yaml` -> PASS
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` -> PASS
- `pnpm -C portal typecheck` -> PASS

---

## Acceptance and smoke evidence

- `A-01` through `A-14` all passed.
- `node --experimental-strip-types runtime/run-slot-dispatch.ts --help` includes `--supersedes`.

No post-implementation live-ledger append was performed; ratification is based on bounded runtime diff plus passed A-01..A-14 acceptance checks.

The next natural dispatch on this runtime will materialize attempt / supersedes / superseded_by on live entries.

---

## Boundary confirmation

No-touch boundaries held for:

- `proposal.md`
- `challenge.md`
- `runtime/taskContract.ts`
- `runtime/slotDispatch.ts`
- `runtime/mark-run-reviewed.ts`
- `portal/**`
- `package.json`

Motion-0154 ratifies only the bounded two-file runtime hardening for attempt lineage and explicit supersession. It does not ratify any new orchestration behavior, retry automation, controller logic, or scope widening outside the declared touch list.
