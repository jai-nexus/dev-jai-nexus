# Execution: Corpus V1 Closeout and Corpus Model v0

**Motion:** motion-0196
**Role:** BUILDER
**Date:** 2026-05-15
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: corpus canon additions, one motion package, and one bundled snapshot
refresh. No runtime behavior, persistence, or authority change.

---

## Boundary confirmation

This motion must not:

- open Corpus V2
- reset motion numbering yet
- rename or rewrite Corpus V1 motion files
- mutate older Corpus V1 records except through explicit hygiene fixes
- add live provider/model calls
- add backend runtime execution
- add branch-write, PR, merge, scheduler, or automation authority
- add API or DB mutation
- add hidden persistence

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-15T18:10:00.000Z`

### 2. Implementation shape

- added a corpus model canon artifact
- added a Corpus V1 closeout canon artifact
- defined Corpus identity fields and era policy
- defined that a new Corpus may restart numbering at `motion-0001` without
  rewriting prior history
- preserved Corpus V2 as gated and unopened
- refreshed the bundled motion snapshot through `motion-0196`

### 3. Files changed

- `.nexus/canon/corpus/corpus-model-v0.md`
- `.nexus/canon/corpus/corpus-v1-closeout.md`
- `.nexus/motions/motion-0196/**`
- `portal/src/lib/motion/motionSnapshot.json`

### 4. Corpus model added

The new corpus model defines:

- Corpus as a first-class governance era
- corpus identity fields
- era-local motion numbering policy
- historical preservation rules for prior corpora
- Corpus V1 as manual-governance era
- Corpus V2 as future agent-operable era

### 5. Corpus V1 closeout framing

Corpus V1 remains:

- active in closing posture
- manual-governance in character
- preserved as historical canon, training record, and audit record
- mutable only through explicit hygiene fixes

PR `#151` is recorded as a hygiene fix only and consumed no motion.

### 6. Authority posture preserved

- no provider/model calls
- no backend runtime execution
- no branch-write, PR, or merge authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no runtime corpus switching

### 7. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0196/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
pnpm -C portal build
```

### 8. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `194`
  - latest bundled motion: `motion-0195`
- bundled snapshot after refresh:
  - motion count: `195`
  - latest bundled motion: `motion-0196`

### 9. Acceptance checks

- acceptance-01 pass: Corpus model is implemented as canon
- acceptance-02 pass: Corpus V1 is defined as manual-governance corpus
- acceptance-03 pass: Corpus V2 is defined as future agent-operable corpus
- acceptance-04 pass: motion numbering reset policy is explicit and not active yet
- acceptance-05 pass: Corpus V1 historical preservation policy is explicit
- acceptance-06 pass: Corpus V2 remains unopened

### 10. Ratification closeout

Motion-0196 is ratified as a corpus-era model and closeout framing seam only.
