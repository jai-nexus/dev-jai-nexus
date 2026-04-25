# Challenge: Motion Contender Queue and Draft Promotion v0

**Motion:** motion-0159

---

## 1. Key risks

- Promotion could accidentally look like generalized motion orchestration instead of one
  bounded DRAFT package writer.
- The deployed path could fall back to local filesystem writes, which are not durable on
  Vercel.
- The promotion path could drift outside `.nexus/motions/<new-motion-id>/**`.
- A stale provisional motion id could be silently rewritten instead of forcing operator
  re-confirmation.
- The current admin email guard could be mistaken for generalized RBAC.

---

## 2. Required protections

- keep contender generation deterministic and preview-only until promotion
- require explicit typed confirmation for promotion
- use same-repo GitHub branch writes only
- never write directly to main/default branch
- never mutate existing motions
- keep the admin email check documented as a v0 guard, not generalized RBAC

---

## 3. Out of scope

- `.nexus/candidates/**`
- automatic PR creation
- voting or ratification
- dispatch, scheduler behavior, or orchestration
- readiness-threshold work
- DB writes
- runtime proof changes
