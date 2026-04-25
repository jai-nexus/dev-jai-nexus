# Proposal: Motion Contender Queue v0

**Motion:** motion-0160
**Kind:** builder-proof
**Program:** q2-motion-contender-queue-v0
**Basis:** motion-0159

---

## 1. Problem statement

`/operator/motions` can now generate contender previews and promote them into guarded
DRAFT motion packages, but the page still presents canonical motions as the primary queue.
That blurs the boundary that contenders are not motions and makes the queue read like a
governance surface instead of a preview surface.

Motion-0160 corrects that information architecture:

- generated contenders become the primary queue
- contender previews remain session-local and preview-only
- canonical motions move into a clearly labeled read-only reference section
- motion-0159 promotion guardrails remain intact

---

## 2. Scope

In scope:

- `portal/src/app/operator/motions/page.tsx`
- `portal/src/app/operator/motions/PromoteContenderForm.tsx`
- `portal/src/lib/motion/motionContenders.ts`
- optional small UI refactors inside `portal/src/app/operator/motions/**` only if needed
- `.nexus/motions/motion-0160/**`

Not in scope:

- new write powers
- modification of promotion guardrails from motion-0159
- direct writes to main/default branch
- automatic PR creation
- voting or ratification
- dispatch, scheduler behavior, or orchestration
- readiness scoring
- DB writes
- runtime proof changes
- mutation of existing motions
- `.nexus/candidates/**`

---

## 3. Implementation

### 3.1 Contender-first queue

Make the primary queue on `/operator/motions` represent generated contenders only. Each row
must make the boundary explicit:

- preview only
- not a motion package yet
- promotion creates the first real DRAFT package

### 3.2 Canonical motion reference

Move the existing `.nexus/motions/**` browser/detail into a separate read-only reference
section. Canonical motions remain visible and searchable, but they are no longer presented
as the primary queue.

### 3.3 Guardrail preservation

Keep motion-0159 guardrails unchanged:

- authenticated session required
- current v0 admin email guard
- feature flag and GitHub env gating
- same-repo branch-only write
- DRAFT package creation only
- no PR creation

---

## 4. Acceptance criteria

- primary queue shows contenders, not canonical motions
- contender rows and previews are explicitly labeled preview-only and non-canonical
- canonical motions remain available in a separate read-only reference section
- motion-0159 guarded promotion behavior remains intact
- live and snapshot-backed canonical reference both continue to render
- required gates pass

---

## 5. Non-goals

No PR creation, no voting, no ratification, no dispatch, no scheduler behavior, no
readiness scoring, no DB writes, no runtime proof changes, and no mutation of existing
motion packages.
