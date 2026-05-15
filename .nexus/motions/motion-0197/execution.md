# Execution: Corpus V2 Readiness Gate v0

**Motion:** motion-0197
**Role:** BUILDER
**Date:** 2026-05-15
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one readiness-gate canon artifact, one motion package, and one bundled
snapshot refresh. No runtime behavior or authority change.

---

## Boundary confirmation

This motion must not:

- open Corpus V2
- reset motion numbering yet
- claim live JAI Agent voting exists today
- add provider/model calls
- add backend runtime execution
- add branch-write, PR, merge, scheduler, or automation authority
- add API or DB mutation
- add hidden persistence

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-15T18:32:00.000Z`

### 2. Implementation shape

- added a readiness-gate canon artifact for Corpus V2
- defined explicit gates, blockers, and non-authorizations
- preserved human override and approval boundary
- preserved the distinction between governance voters and execution/lens roles
- refreshed the bundled motion snapshot through `motion-0197`

### 3. Files changed

- `.nexus/canon/corpus/corpus-v2-readiness-gate.md`
- `.nexus/motions/motion-0197/**`
- `portal/src/lib/motion/motionSnapshot.json`

### 4. Readiness gates defined

The readiness gate now requires:

- internal motion drafting by JAI Agents
- canonical governance voting by JAI Agents
- visible ratification workflow
- workflow-ready outputs from ratified motions
- human override where required
- strict record distinction between governance voters, execution/lens roles, and
  human intervention
- deterministic and schema-valid motion package generation
- snapshot gate coverage
- numbering reset without Corpus V1 overwrite
- preserved historical immutability for Corpus V1
- separately authorized authority expansion only

### 5. Blockers remain explicit

Corpus V2 remains blocked on:

- live agent motion drafting
- live canonical voting
- ratification workflow
- motion package generation
- workflow trigger path
- authority boundaries

### 6. Authority posture preserved

- no provider/model calls
- no backend runtime execution
- no branch-write, PR, or merge authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no live Corpus V2 enablement

### 7. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0197/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
pnpm -C portal build
```

### 8. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `195`
  - latest bundled motion: `motion-0196`
- bundled snapshot after refresh:
  - motion count: `196`
  - latest bundled motion: `motion-0197`

### 9. Acceptance checks

- acceptance-01 pass: Corpus V2 readiness gates are explicit
- acceptance-02 pass: Corpus V2 remains gated and unopened
- acceptance-03 pass: numbering reset is not active yet
- acceptance-04 pass: no live agent voting is claimed
- acceptance-05 pass: no execution or write authority is introduced

### 10. Ratification closeout

Motion-0197 is ratified as a readiness-gate definition seam only.
