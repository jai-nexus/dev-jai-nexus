# Execution: Motion Contender Queue and Draft Promotion v0

**Motion:** motion-0159
**Kind:** builder-proof
**Program:** q2-motion-contender-draft-promotion-v0
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/src/lib/motion/motionContenders.ts`
- `portal/src/lib/motion/motionDraftPackage.ts`
- `portal/src/lib/motion/motionPromotion.ts`
- `portal/src/app/operator/motions/page.tsx`
- `portal/src/app/operator/motions/PromoteContenderForm.tsx`
- `portal/src/app/api/operator/motions/promote/route.ts`
- `.nexus/motions/motion-0159/**`

---

## Ratified evidence record

The implemented feature is bounded to contender preview and explicit DRAFT package promotion only.

- contender generation is deterministic and preview-only
- generated output is a DRAFT/open motion package only
- the promotion route runs in node runtime
- promotion is same-repo only and branch-only
- promotion never writes directly to main/default branch
- promotion does not create a PR
- promotion does not vote or ratify
- promotion does not dispatch
- promotion does not schedule work
- promotion does not add readiness scoring
- promotion does not add DB writes
- promotion does not change runtime proof files
- promotion does not mutate existing motions

---

## Guard behavior

The promotion path is guarded by:

- authenticated operator session
- the current v0 admin email check: `session.user.email === "admin@jai.nexus"`
- feature flag `JAI_ENABLE_MOTION_PROMOTION=1`
- required GitHub env/config
- same-repo allow-listing to `jai-nexus/dev-jai-nexus`
- explicit typed confirmation of the provisional motion id
- server-side recomputation of the latest motion id at promotion time

If the feature flag or GitHub env is missing, promotion remains disabled and preview-only mode still works.

---

## Acceptance evidence

Acceptance checks `P-01` through `P-20` passed, including:

- `P-01` auth/session gate exists and unauthenticated users cannot access write controls
- `P-02` non-admin users can inspect but cannot promote
- `P-03` missing feature flag or GitHub env keeps promotion disabled and preview-only
- `P-04` contender generation writes nothing
- `P-05` multiple contenders can exist in a session-local queue
- `P-06` preview shows provisional motion id, provisional branch, and exact 8-file package
- `P-07` promotion requires explicit typed confirmation
- `P-08` promotion writes to a new same-repo branch, never main/default branch
- `P-09` promotion writes only `.nexus/motions/<new-motion-id>/**`
- `P-10` existing motions remain unchanged
- `P-11` no `.nexus/candidates/**` writes occur
- `P-12` no DB writes occur
- `P-13` no runtime proof files change
- `P-14` no PR is created automatically
- `P-15` generated DRAFT `motion.yaml` shape passes local fixture validation
- `P-16` `/operator/motions` still renders correctly in both live and snapshot read modes
- `P-17` `pnpm -C portal typecheck` passed
- `P-18` `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0159/motion.yaml` passed
- `P-19` `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed
- `P-20` stale provisional motion id returns `409` and requires re-confirmation

Final gates passed:

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0159/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

---

## Caveats

- No live GitHub branch promotion was executed because the feature flag/token are intentionally absent in this local environment.
- Promotion is correctly preview-only in the current local environment.
- No browser/manual UI smoke test was run in this turn.
- The admin email guard is v0-only and is not generalized RBAC.

---

## No-touch boundaries

- `runtime/**`
- `surfaces/agent-ops/**`
- existing `.nexus/motions/motion-0001` through `.nexus/motions/motion-0158`
- `portal/prisma/**`
- `.github/workflows/**`
- `package.json`
