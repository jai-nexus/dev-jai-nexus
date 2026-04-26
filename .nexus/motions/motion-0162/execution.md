# Execution: Operator Motions Snapshot Refresh Automation v0

**Motion:** motion-0162
**Kind:** builder-proof
**Program:** q2-motion-snapshot-refresh-automation
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/scripts/build-motion-snapshot.mjs`
- `portal/src/lib/motion/motionSnapshot.json`
- `.nexus/motions/motion-0162/**`

No changes were made to:

- `runtime/**`
- `surfaces/agent-ops/**`
- `portal/src/lib/motion/motionSurface.ts`
- any existing `.nexus/motions/motion-0001` through `.nexus/motions/motion-0161`

---

## Ratified evidence record

Motion-0162 adds a deterministic refresh/check seam for the bundled motions snapshot.

The generator now supports:

- `node portal/scripts/build-motion-snapshot.mjs --write`
- `node portal/scripts/build-motion-snapshot.mjs --check`

`--write` regenerates `portal/src/lib/motion/motionSnapshot.json` from current
`.nexus/motions/**`.

`--check` exits `0` when the committed snapshot matches current canon and exits nonzero with
clear drift details when stale.

The generator no longer truncates bundled canon at `motion-0157`.

The snapshot schema consumed by `/operator/motions` remains unchanged, so snapshot mode
stays supported without changing the read-only canonical reference surface.

---

## Acceptance evidence

- `SR-01` PASS: snapshot regenerated from current `.nexus/motions/**`
- `SR-02` PASS: refreshed snapshot includes merged canon through `motion-0161`
- `SR-03` PASS: refreshed snapshot count equals current canonical motion count on this branch
- `SR-04` PASS: `motion-0161` appears in the refreshed snapshot
- `SR-05` PASS: the `motion-0151` status mismatch remains surfaced
- `SR-06` PASS: repeated `--write` is deterministic and produced no diff
- `SR-07` PASS: `--check` passes when the committed snapshot is current
- `SR-08` PASS: `--check` failed on a simulated stale snapshot with clear drift output
- `SR-09` PASS: the generator did not mutate `.nexus/motions/**`
- `SR-10` PASS: no runtime or proof files changed
- `SR-11` PASS: `/operator/motions` snapshot mode remains supported because the bundled snapshot schema stayed compatible and the consumer was unchanged
- `SR-12` PASS: `pnpm -C portal typecheck`
- `SR-13` PASS: `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0162/motion.yaml`
- `SR-14` PASS: `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`

Observed counts:

- snapshot count before refresh: `157`
- snapshot count after refresh: `162`

Observed presence:

- `motion-0161` appears in the refreshed snapshot
- `motion-0162` also appears because the current branch-local canonical tree includes this motion package

Observed drift-check behavior:

- current snapshot: `status: current`
- simulated stale snapshot: `status: stale`
- stale run exited with `check_exit_code: 1`

---

## Final gates

- `node portal/scripts/build-motion-snapshot.mjs --write` passed
- `node portal/scripts/build-motion-snapshot.mjs --check` passed when current
- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0162/motion.yaml` passed
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed
- `pnpm -C portal typecheck` passed

---

## Boundary confirmation

This seam does not add:

- runtime GitHub fetch
- Vercel config restructuring
- CI workflow changes
- DB writes
- API mutation
- promotion enablement
- PR creation, voting, ratification, dispatch, scheduler behavior, or readiness scoring

The canonical reference in `/operator/motions` remains read-only.
