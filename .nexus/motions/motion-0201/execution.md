# Execution: Corpus V2 Readiness Checklist v0

**Motion:** motion-0201
**Role:** BUILDER
**Date:** 2026-05-15
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one readiness-checklist canon artifact, one motion package, and one
bundled snapshot refresh. No UI, runtime behavior, persistence, or authority
change.

---

## Boundary confirmation

This motion must not:

- open Corpus V2
- reset numbering
- mutate historical outcomes, statuses, timestamps, results, or vote values
- rewrite older motion packages
- add live agent drafting, voting, or ratification enablement
- add provider/model calls
- add backend runtime execution
- add branch-write, PR, merge, scheduler, or automation authority
- add API or DB mutation
- add hidden persistence
- create a passalong index

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-15T21:34:00.000Z`

### 2. Implementation shape

- inspected existing corpus canon for model, closeout, readiness, schema
  hygiene, and archive posture
- added a Corpus V2 readiness checklist and tracker artifact
- represented readiness gates from `motion-0197` with explicit statuses
- recorded current evidence, missing requirements before V2, and authority
  notes for each gate
- preserved Corpus V1 immutability posture and Corpus V2 gating posture
- refreshed the bundled motion snapshot through `motion-0201`

### 3. Files changed

- `.nexus/canon/corpus/corpus-v2-readiness-checklist.md`
- `.nexus/motions/motion-0201/**`
- `portal/src/lib/motion/motionSnapshot.json`

### 4. Gate status model

The new checklist defines:

- `satisfied_by_canon`
- `partially_satisfied`
- `unmet_future`
- `blocked_by_authority`
- `deferred_until_v2_opening`

### 5. Readiness posture

The checklist records that:

- canonical governance voter identity shape exists, but live voting does not
- Corpus V1 historical preservation and numbering-reset policy are already
  documented by canon
- deterministic packaging and snapshot gates are partially present
- live drafting, live ratification, and runtime-capable workflow execution
  remain future work

### 6. Relationship to Corpus V1 archive/index

The checklist depends on the Corpus V1 archive and index seam:

- Corpus V1 remains preserved and searchable
- Corpus V1 remains immutable except through explicit hygiene fixes
- Corpus V2 readiness work does not reopen or rewrite Corpus V1

### 7. Authority posture preserved

- no provider/model calls
- no backend runtime execution
- no branch-write, PR, or merge authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no passalong index
- no live voting enablement
- no Corpus V2 opening

### 8. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0201/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
pnpm -C portal build
```

### 9. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `199`
  - latest bundled motion: `motion-0200`
- bundled snapshot after refresh:
  - motion count: `200`
  - latest bundled motion: `motion-0201`

### 10. Acceptance checks

- acceptance-01 pass: Corpus V2 readiness checklist artifact exists
- acceptance-02 pass: readiness gates from `motion-0197` are represented
- acceptance-03 pass: each gate uses the requested status model
- acceptance-04 pass: each gate records evidence, missing work, and authority
  note
- acceptance-05 pass: relationship to Corpus V1 archive/index is explicit
- acceptance-06 pass: Corpus V2 remains gated and unopened
- acceptance-07 pass: numbering is not reset
- acceptance-08 pass: no runtime or authority expansion was introduced

### 11. Ratification closeout

Motion-0201 is ratified as a docs-only Corpus V2 readiness checklist and
tracker seam.
