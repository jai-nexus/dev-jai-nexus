# Challenge: Operator Motions Static Snapshot Fallback v0

**Motion:** motion-0158

---

## 1. Key risks

- The snapshot could drift from the live queue/detail shape and make deployment behavior
  inconsistent with local/dev.
- The fallback could silently normalize package defects instead of preserving them.
- The page could fail open to an empty queue instead of surfacing a real fallback path.
- The generator could widen into a broader export system instead of staying tightly scoped
  to the existing Operator Motions surface.

---

## 2. Required protections

- Keep live repo-root `.nexus/motions` preferred when available.
- Use the bundled snapshot only as fallback.
- Preserve the known `motion-0151` mismatch exactly as surfaced attention.
- Keep the fallback read-only.
- Avoid DB writes, API mutation, or runtime-proof changes.

---

## 3. Out of scope

- motion repair or normalization
- runtime proof behavior changes
- dispatch, voting, ratification, or scheduling behavior
- readiness-threshold work
- orchestration widening
