# Proposal: Motion Contender Queue and Draft Promotion v0

**Motion:** motion-0159
**Kind:** builder-proof
**Program:** q2-motion-contender-draft-promotion-v0
**Basis:** motion-0158

---

## 1. Problem statement

The Operator Motions surface can now inspect live and snapshot-backed motion state, but it
cannot stage a bounded follow-on motion candidate or promote one into a real DRAFT/open
motion package. That leaves a gap between operator review and the first formal governance
artifact for new work.

Motion-0159 closes that gap with one narrow write-capable seam:

- deterministic contender generation inside `/operator/motions`
- preview-only DRAFT package inspection
- explicit operator-confirmed promotion into `.nexus/motions/<new-motion-id>/**`
- same-repo GitHub branch write only

---

## 2. Scope

In scope:

- `portal/src/lib/motion/motionContenders.ts`
- `portal/src/lib/motion/motionDraftPackage.ts`
- `portal/src/lib/motion/motionPromotion.ts`
- `portal/src/app/operator/motions/page.tsx`
- `portal/src/app/operator/motions/PromoteContenderForm.tsx`
- `portal/src/app/api/operator/motions/promote/route.ts`
- `.nexus/motions/motion-0159/**`

Not in scope:

- modification of existing motion packages
- `.nexus/candidates/**`
- direct writes to main/default branch
- automatic PR creation
- voting or ratification
- dispatch, scheduler behavior, or orchestration
- DB writes
- runtime proof changes
- readiness scoring

---

## 3. Implementation

### 3.1 Pure contender and package builders

Add deterministic builders for:

- contender previews
- provisional motion ids and branch names
- exact 8-file DRAFT/open motion packages

These builders must perform no file writes, no DB access, and no LLM calls.

### 3.2 Session-local contender queue

Add a preview-only contender queue inside `/operator/motions`:

- multiple contenders allowed
- newest first
- session-local only
- no persistent contender storage

The preview must show:

- provisional motion id
- provisional branch name
- target repo
- base branch
- exact 8 files that would be written
- write root `.nexus/motions/<new-motion-id>/**`

### 3.3 Explicit branch-only promotion

Promotion must:

- require authenticated admin session using the current v0 email guard
- require `JAI_ENABLE_MOTION_PROMOTION=1`
- require GitHub write env/config
- target only `jai-nexus/dev-jai-nexus`
- write only to a new same-repo branch
- write only `.nexus/motions/<new-motion-id>/**`
- never create a PR automatically
- fail on stale provisional motion ids and require re-confirmation

---

## 4. Acceptance criteria

- contender generation remains preview-only and write-free
- multiple contenders can exist in a session-local queue
- promotion stays disabled when auth, feature flag, or GitHub env requirements are not met
- promotion requires typed confirmation
- promotion writes only to a new same-repo branch, never to main/default branch
- generated DRAFT package shape validates
- `/operator/motions` still renders correctly in both live and snapshot read modes
- required gates pass

---

## 5. Non-goals

No automatic PR creation, no voting, no ratification, no dispatch, no scheduler behavior,
no readiness scoring, no cross-repo writes, no DB writes, and no mutation of existing
motions.
