# Challenge: Operator Motions Snapshot Refresh Automation v0

**Motion:** motion-0162

---

## 1. Key risks

- the refreshed snapshot could still be non-deterministic, causing noisy diffs
- `--check` could fail without useful drift detail, reducing operator confidence
- the seam could accidentally widen into runtime refresh or deployment orchestration
- snapshot regeneration could mutate anything outside the bundled snapshot artifact

---

## 2. Required protections

- keep generation deterministic for unchanged canon
- restrict mutation to `portal/src/lib/motion/motionSnapshot.json`
- make `--check` exit nonzero on drift and print clear summary details
- preserve the current snapshot schema consumed by `/operator/motions`
- keep the canonical reference read-only

---

## 3. Out of scope

- runtime GitHub fetch
- Vercel config restructuring
- CI workflow changes
- promotion enablement
- PR creation, voting, ratification, dispatch, scheduler behavior, or readiness scoring
- DB writes
- mutation of existing motions
