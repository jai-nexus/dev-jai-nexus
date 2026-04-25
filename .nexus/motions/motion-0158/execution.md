# Execution: Operator Motions Static Snapshot Fallback v0

**Motion:** motion-0158
**Kind:** builder-proof
**Program:** q2-motion-operations-static-snapshot
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/scripts/build-motion-snapshot.mjs`
- `portal/src/lib/motion/motionSnapshot.json`
- `portal/src/lib/motion/motionSurface.ts`
- `portal/src/app/operator/motions/page.tsx`

Governance packaging is confined to:

- `.nexus/motions/motion-0158/**`

---

## Ratified evidence record

Required checks passed:

- `node portal/scripts/build-motion-snapshot.mjs`
- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0158/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

Live-first behavior remains intact locally:

- live loader from repo root passes against repo-root `.nexus/motions`
- live loader from `portal/` cwd also passes against repo-root `.nexus/motions`

Bundled snapshot behavior remains fallback-only:

- bundled snapshot path is `portal/src/lib/motion/motionSnapshot.json`
- bundled snapshot count is `157`
- `motion-0157` is present in fallback mode
- the known `motion-0151` mismatch remains surfaced in fallback mode:
  `status mismatch: motion.yaml=open while decision.yaml=RATIFIED`

Simulated missing live source yields:

- `sourceMode: "snapshot"`
- `sourceLabel: "portal/src/lib/motion/motionSnapshot.json"`
- count `157`
- `motion-0157` present
- `motion-0151` mismatch preserved
- `warning: null`

Failure posture is explicit:

- no false successful `0` motions state occurs when live source is unavailable

Read-only and no-widening boundaries held:

- no `.nexus/motions/**` mutation
- no runtime proof changes
- no DB writes
- no API mutation
- no dispatch, vote, ratify, or scheduler behavior
- no readiness scoring
- no orchestration widening

---

## No-touch boundaries

- `runtime/**`
- `surfaces/agent-ops/**`
- existing `.nexus/motions/motion-0001` through `.nexus/motions/motion-0157`
- `portal/prisma/**`
- `.github/workflows/**`
- `package.json`
