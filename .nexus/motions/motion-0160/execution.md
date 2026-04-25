# Execution: Motion Contender Queue v0

**Motion:** motion-0160
**Kind:** builder-proof
**Program:** q2-motion-contender-queue-v0
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/src/app/operator/motions/page.tsx`
- `portal/src/app/operator/motions/PromoteContenderForm.tsx`
- `portal/src/lib/motion/motionContenders.ts`
- `.nexus/motions/motion-0160/**`

---

## Ratified evidence record

Motion-0160 is limited to an information-architecture correction only.

- the primary queue now represents generated contenders
- canonical motions are retained as a separate read-only reference
- contenders are explicitly labeled `preview only`
- contenders are explicitly labeled `not a motion package yet`
- promotion remains the only path from contender to the first real DRAFT motion package
- motion-0159 promotion guardrails were preserved unchanged
- no changes were made to `portal/src/lib/motion/motionPromotion.ts`
- no changes were made to `portal/src/app/api/operator/motions/promote/route.ts`

This seam does not add:

- new write power
- direct main/default-branch writes
- PR creation
- voting
- ratification by the feature
- dispatch
- scheduler behavior
- readiness scoring
- DB writes
- runtime proof changes
- mutation of existing motions

---

## Acceptance evidence

Acceptance checks `Q-01` through `Q-19` passed, including:

- `Q-01` primary queue shows contenders, not canonical motions
- `Q-02` empty contender queue state is explicit
- `Q-03` multiple session-local contenders render newest first
- `Q-04` contender preview shows provisional motion id, provisional branch, target repo, base branch, and exact 8-file package
- `Q-05` contender rows and previews are explicitly labeled preview-only and non-canonical
- `Q-06` canonical motions remain visible in a separate read-only reference section
- `Q-07` canonical reference still resolves in live mode
- `Q-08` canonical reference still resolves in snapshot fallback mode
- `Q-09` the motion-0151 mismatch remains surfaced in canonical reference state
- `Q-10` through `Q-13` motion-0159 promotion guard behavior remains intact and unchanged
- `Q-14` no `.nexus/candidates/**` writes occur
- `Q-15` no DB writes occur
- `Q-16` no existing motion packages were modified
- `Q-17` `pnpm -C portal typecheck` passed
- `Q-18` `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0160/motion.yaml` passed
- `Q-19` `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed

Final gates passed:

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0160/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

---

## Caveats

- No browser/manual UI smoke test was run in this turn.
- No live GitHub branch promotion was executed in this turn.
- Snapshot fallback remains at 157 motions, while branch-local live mode sees 160 because `.nexus/motions/motion-0160/**` exists on this branch.

---

## No-touch boundaries

- `runtime/**`
- `surfaces/agent-ops/**`
- existing `.nexus/motions/motion-0001` through `.nexus/motions/motion-0159`
- `portal/prisma/**`
- `.github/workflows/**`
- `package.json`
