# Execution: Motion Governance Schema Hygiene v0

**Motion:** motion-0199
**Role:** BUILDER
**Date:** 2026-05-15
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one corpus canon artifact, one motion package, and one bundled snapshot
refresh. No runtime behavior, persistence, or authority change.

---

## Boundary confirmation

This motion must not:

- open Corpus V2
- reset numbering
- mutate historical outcomes, statuses, timestamps, results, or vote values
- rewrite older motion packages
- add live voting enablement
- add provider/model calls
- add backend runtime execution
- add branch-write, PR, merge, scheduler, or automation authority
- add API or DB mutation
- add hidden persistence

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-15T20:06:00.000Z`

### 2. Implementation shape

- inspected representative Corpus V1 motion schema eras
- documented NHID-style motion fields
- documented role/lens assignment fields in `motion.yaml`
- documented role-slot vote records and recent `voter`-field records
- documented PR `#151` as the post-motion voter-identity hygiene fix
- clarified current canonical governance voter identities for recent motion
  voting posture
- refreshed the bundled motion snapshot through `motion-0199`

### 3. Files changed

- `.nexus/canon/corpus/motion-governance-schema-hygiene-v0.md`
- `.nexus/motions/motion-0199/**`
- `portal/src/lib/motion/motionSnapshot.json`

### 4. Corpus V1 schema-era findings

Observed representative schema eras:

- NHID-style `motion.yaml` fields with `proposer_nh_id` and `council_nh_id`
- role/lens assignment style in `motion.yaml` using `ARCHITECT`, `VERIFIER`,
  and `OPERATOR`
- mid-era unanimous-consent role-slot vote records using `votes[].role`
- recent unanimous-consent voter-field records using `votes[].voter`
- post-PR-151 canonical governance voters:
  - `jai-proposer`
  - `jai-challenger`
  - `jai-arbiter`

### 5. PR #151 relationship

Recorded in canon:

- PR `#151` corrected motions `0191` through `0195`
- corrected mappings:
  - `ARCHITECT` -> `jai-proposer`
  - `VERIFIER` -> `jai-challenger`
  - `OPERATOR` -> `jai-arbiter`
- no motion number was consumed
- no outcomes, statuses, timestamps, or result fields were changed

### 6. Corpus V2 inheritance guardrails

The new canon states that Corpus V2 must:

- use explicit canonical governance voter identities
- distinguish governance voters, execution/lens participants, and human
  intervention
- avoid inheriting Corpus V1 ambiguity as active behavior
- remain gated until readiness conditions are met

### 7. Authority posture preserved

- no provider/model calls
- no backend runtime execution
- no branch-write, PR, or merge authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no live voting enablement
- no Corpus V2 opening

### 8. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0199/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
pnpm -C portal build
```

### 9. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `197`
  - latest bundled motion: `motion-0198`
- bundled snapshot after refresh:
  - motion count: `198`
  - latest bundled motion: `motion-0199`

### 10. Acceptance checks

- acceptance-01 pass: Corpus V1 schema-era findings are documented
- acceptance-02 pass: known historical schema variants are identified
- acceptance-03 pass: role/lens assignments are distinguished from canonical
  governance voter identities
- acceptance-04 pass: PR `#151` is documented correctly
- acceptance-05 pass: Corpus V2 inheritance guardrails are explicit
- acceptance-06 pass: backward-compatibility posture is explicit
- acceptance-07 pass: no historical outcomes were changed
- acceptance-08 pass: no runtime or authority expansion was introduced

### 11. Ratification closeout

Motion-0199 is ratified as read-only motion-governance schema hygiene only.
