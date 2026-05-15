# Execution: Static Vote/Ratification Trace Fixture v0

**Motion:** motion-0213
**Role:** BUILDER
**Date:** 2026-05-15
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one local fixture, one small UI model update, one motion package, and
one bundled snapshot refresh. No live voting or autonomous ratification is
introduced.

---

## Boundary confirmation

This motion must not:

- enable live voting
- enable autonomous ratification
- dispatch providers or models
- add runtime execution
- open Corpus V2
- reset numbering

---

## Evidence log

### 1. Final ratification timestamp

- `2026-05-15T23:00:00.000Z`

### 2. Implementation shape

- added a simulated vote and ratification trace fixture
- used canonical governance voter identities only
- included evidence refs, human intervention, and a blocked example

### 3. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `211`
  - latest bundled motion: `motion-0212`
- bundled snapshot after refresh:
  - motion count: `212`
  - latest bundled motion: `motion-0213`

### 4. Ratification closeout

Motion-0213 is ratified as a static vote/ratification fixture seam only.
