# Execution: Operator Surface for Corpus Transition v0

**Motion:** motion-0198
**Role:** BUILDER
**Date:** 2026-05-15
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one small static control-plane model, one root overview card, one motion
package, and one bundled snapshot refresh. No runtime state or authority
change.

---

## Boundary confirmation

This motion must not:

- add runtime corpus switching
- add route/query/local/session state
- add API or DB mutation
- add live heartbeat semantics
- add provider/model calls
- add backend runtime execution
- add branch-write, PR, merge, scheduler, or automation authority
- open Corpus V2 or reset numbering

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-15T18:54:00.000Z`

### 2. Implementation shape

- added a static corpus transition model under `portal/src/lib/controlPlane/**`
- surfaced a small read-only corpus transition card on the root overview
- exposed current Corpus V1 posture, future Corpus V2 posture, and unresolved blockers
- linked the card text to the canon artifact paths by safe static reference
- refreshed the bundled motion snapshot through `motion-0198`

### 3. Files changed

- `portal/src/lib/controlPlane/corpusStatus.ts`
- `portal/src/lib/controlPlane/rootOperatorOverview.ts`
- `portal/src/app/page.tsx`
- `.nexus/motions/motion-0198/**`
- `portal/src/lib/motion/motionSnapshot.json`

### 4. Operator surface added

The new root overview card shows:

- current corpus: `Corpus V1`
- governance posture: manual governance
- status: active/closing posture
- latest Corpus V1 motion on this branch: `motion-0198`
- future corpus: `Corpus V2`
- status: gated/not open
- unresolved blockers before Corpus V2 opening
- explicit note that there is no opening, numbering reset, or runtime switching

### 5. Authority posture preserved

- read-only card only
- no API route
- no DB model
- no route/query/local/session state
- no provider/model calls
- no backend runtime execution
- no branch-write, PR, or merge authority
- no scheduler or automation

### 6. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0198/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
pnpm -C portal build
```

### 7. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `196`
  - latest bundled motion: `motion-0197`
- bundled snapshot after refresh:
  - motion count: `197`
  - latest bundled motion: `motion-0198`

### 8. Acceptance checks

- acceptance-01 pass: operator corpus transition surface is read-only
- acceptance-02 pass: Corpus V1 posture is visible
- acceptance-03 pass: Corpus V2 gated posture is visible
- acceptance-04 pass: blockers are visible without implying enablement
- acceptance-05 pass: no runtime state or authority expansion was introduced

### 9. Ratification closeout

Motion-0198 is ratified as a read-only corpus transition surface only.
