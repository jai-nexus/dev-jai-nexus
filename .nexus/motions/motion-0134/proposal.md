# Proposal: JAI Grid Council-Run Preconditions v0

**Motion:** motion-0134
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-15
**Basis:** motion-0133 (JAI Grid Post-Ingest Review Workflow v0)

---

## Problem

Motion-0133 established a read-only local review gate for an ingested Grid motion package.
That closed the readiness signal gap, but the operator handoff from review readiness into
the canonical governance path is still mostly convention-driven:

1. `READY_FOR_COUNCIL_RUN` exists, but the exact preconditions for invoking
   `pnpm council:run <motion-id>` are not yet written as an explicit repo contract
2. The operator does not yet have a single, named definition of what counts as **blocked**
   versus **ready** at the handoff boundary
3. The local review step and the ratification step are intentionally separate, but the
   expected operator next actions between them are not yet encoded as repo policy
4. There is no motion-scoped articulation of which checks in this handoff must remain
   read-only and which actions are explicitly out of scope

The remaining gap is a **handoff contract gap**: the repo needs an explicit precondition
contract for when an operator may proceed from local review into the canonical
`council-run` path, without collapsing the distinction between them.

---

## Solution

Introduce an explicit council-run precondition contract for Grid-originated motion packages.
This motion opens the reviewable design package only; it does not implement scripts yet.

The resulting implementation motion slice should define:

1. Explicit preconditions for invoking `pnpm council:run <motion-id>`
2. Explicit named outcomes:
   - `READY_FOR_COUNCIL_RUN`
   - `BLOCKED_FOR_COUNCIL_RUN`
3. Read-only precondition checks only
4. Operator guidance for next steps after either outcome
5. Preservation of the current governance boundary:
   - `grid:review` remains read-only
   - `council-run` remains a separate explicit action
   - no portal-side writes
   - no file repair or mutation
   - no auto-commit
   - no auto-PR
   - no automatic `council-run`

This motion is intentionally limited to opening the package that frames that work in
repo-ready form.

---

## Design

### Preconditions to encode

The follow-on implementation must define a concrete precondition set for invoking
`pnpm council:run <motion-id>`, including at minimum:

1. Motion package directory exists
2. Required package files are present
3. `motion_id` matches the directory name
4. `validate-motion` passes on current on-disk state
5. The operator receives explicit next-step guidance for:
   - ready path
   - blocked path

### Outcome model

The handoff contract must distinguish:

- **READY**: the package satisfies the declared read-only preconditions and the operator
  may explicitly choose to run `pnpm council:run <motion-id>`
- **BLOCKED**: one or more declared preconditions fail, the blocking reason is named, and
  the operator is guided to correct the package before any ratification attempt

### Boundary preservation

This motion does not authorize:

- automatic invocation of `council-run`
- file mutation or repair as part of precondition checking
- portal-side writes
- auto-staging, auto-commit, or auto-PR
- widening into runtime telemetry, collaboration workflows, or Live Ops behavior

---

## Success criteria

- **SC-1** A repo-ready motion package for `motion-0134` exists under `.nexus/motions/`
- **SC-2** The package is tightly scoped to dev-jai-nexus and treats motion-0133 as settled
  merged baseline
- **SC-3** The package explicitly encodes council-run preconditions as a future
  implementation target
- **SC-4** The package explicitly encodes blocked/ready outcomes and operator next-step
  guidance as future implementation targets
- **SC-5** The package preserves the separation between read-only review and canonical
  ratification
- **SC-6** No implementation files are changed in this step
- **SC-7** `validate-motion` passes for `motion-0134`
- **SC-8** `validate-agency` passes for `dev.jai.nexus / dev-jai-nexus`

---

## Non-goals

- Implementing a new script in this step
- Modifying `grid:review`
- Modifying `council-run`
- Running `council-run`
- Repairing, mutating, or writing motion files as part of precondition checking
- Auto-commit, auto-PR, or automatic governance progression
- Portal runtime changes
- Database changes
- Cross-repo routing
- Generic cleanup or adjacent refactors
