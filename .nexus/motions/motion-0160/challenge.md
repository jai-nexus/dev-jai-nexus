# Challenge: Motion Contender Queue v0

**Motion:** motion-0160

---

## 1. Key risks

- The contender queue could still visually masquerade as canonical governance state.
- Canonical motions could become harder to inspect if the reference section is buried or
  weakened.
- The UI change could accidentally widen motion-0159 promotion behavior instead of only
  reframing it.
- Session-local contender previews could be mistaken for durable repo state.

---

## 2. Required protections

- keep contenders explicitly labeled preview-only and non-canonical
- preserve canonical motion browsing as a separate read-only reference
- keep motion-0159 promotion guardrails unchanged
- keep all writes confined to explicit branch-only promotion
- avoid any new authority cues such as scheduler, readiness score, or governance status

---

## 3. Out of scope

- new promotion powers
- direct writes to main/default branch
- automatic PR creation
- voting or ratification
- dispatch, scheduler behavior, or orchestration
- readiness-threshold work
- DB writes
- runtime proof changes
- mutation of existing motions
