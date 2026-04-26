# Proposal: Deployed Motion Operations Guardrail Verification v0

**Motion:** motion-0161
**Kind:** evidence-proof
**Program:** q2-motion-operations-guardrail-verification
**Basis:** motion-0160

---

## 1. Problem statement

Motion-0160 established the contender-first operator motions surface, but it was merged
without a complete deployed guardrail verification pass. Motion-0161 closes that gap by
recording a bounded deployed verification of the live `/operator/motions` surface after
the stale snapshot contender-id fix from #110.

This motion is evidence-only. It does not add product capability.

---

## 2. Scope

In scope:

- verify deployed `/operator/motions` on `dev.jai.nexus`
- confirm contender-first and canonical-reference boundaries in deployed UI
- confirm snapshot-backed preview no longer claims an existing canonical motion id
- confirm promotion remains disabled/guarded when env is unavailable
- record `GV-01` through `GV-19`
- `.nexus/motions/motion-0161/**`

Not in scope:

- portal implementation changes
- live branch promotion
- GitHub env enablement
- PR creation
- voting or ratification by the feature
- dispatch, scheduler behavior, or readiness scoring
- DB writes
- runtime proof changes
- mutation of existing motions

---

## 3. Acceptance criteria

- deployed `/operator/motions` is reachable and auth-gated correctly
- authenticated deployed admin evidence confirms contender-first UI boundaries
- snapshot-backed preview shows `assigned at promotion` instead of an existing canonical motion id
- promotion remains blocked/guarded when env is missing
- no PR, vote, ratify, dispatch, or run controls are exposed
- required local gates pass

---

## 4. Non-goals

No feature expansion, no write-path expansion, no snapshot refresh automation, and no
status-label redesign are included here.
