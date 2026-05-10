# Challenge: Sync Runs Repair/Reframe v0

**Motion:** motion-0181

---

## Risks

### Risk 1: Treating one generic schema as one settled product meaning

`SyncRun` is structurally generic. Overstating it as only an agent-edit queue or
only a global heartbeat would both be too absolute.

### Risk 2: Solving stale root IA by quietly implementing a dashboard

The product temptation is to replace root `/` immediately. That would exceed the
assessment seam and blur motion scope discipline.

### Risk 3: Recommending repair without proving a producer path

A “repair later” answer is only credible if the current producer set is actually
inspected. Otherwise it is just abstraction.

### Risk 4: Breaking operator comprehension

If the copy shifts too far toward “legacy” without preserving the useful
agent-edit review meaning, the remaining operator flow becomes harder to read.

---

## Challenger standard

Approve only if:

- the schema, producers, and consumers are named concretely
- root `/` and sync-run review semantics are distinguished clearly
- the compared options are real product options, not disguised implementation work
- the recommendation is explicit
- any UI change is copy-only or IA-only
- no producer, automation, or authority is introduced

---

## Required gates

- validate_motion
- validate_agency
- typecheck

Optional supporting gate:

- build

---

## Risk score

risk_score: 0.07
