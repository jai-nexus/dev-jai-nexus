# Execution: Deployed Motion Operations Guardrail Verification v0

**Motion:** motion-0161
**Kind:** evidence-proof
**Program:** q2-motion-operations-guardrail-verification
**Status:** RATIFIED

---

## Verification scope

Motion-0161 is an evidence motion only. No product capability was added.

Touched files:

- `.nexus/motions/motion-0161/motion.yaml`
- `.nexus/motions/motion-0161/proposal.md`
- `.nexus/motions/motion-0161/challenge.md`
- `.nexus/motions/motion-0161/execution.md`
- `.nexus/motions/motion-0161/decision.yaml`
- `.nexus/motions/motion-0161/policy.yaml`
- `.nexus/motions/motion-0161/verify.json`
- `.nexus/motions/motion-0161/vote.json`

No portal implementation files were changed in this verification pass.

---

## Deployed target checked

- URL: `https://dev.jai.nexus/operator/motions`
- environment: deployed `dev.jai.nexus` on Vercel
- verification date: `2026-04-25`

---

## Post-#110 deployed observations

Authenticated admin deployed evidence confirmed:

- deployed `/operator/motions` is reachable after admin login
- the primary queue is the contender queue
- contenders are explicitly labeled `preview only`
- contenders are explicitly labeled `not a motion package yet`
- canonical motions are rendered in a separate read-only reference section
- deployed source mode is snapshot-backed and visibly separate from local live canonical state
- canonical reference renders motion data and shows `157` canonical motions
- deployed canonical list includes `motion-0157` and earlier ratified motions
- contender preview no longer claims an existing canonical motion id
- contender preview shows:
  - motion id preview: `assigned at promotion`
  - id resolution: `assigned at promotion`
  - queue state: `promotion_blocked`
  - write root preview: `.nexus/motions/<assigned-at-promotion>`
  - branch preview: `operator/motion-draft/<assigned-at-promotion>-...`
- explicit guard copy is visible:
  - snapshot-backed canonical data may be stale
  - real motion id is assigned only after server confirmation at promotion
  - exact DRAFT package preview uses placeholder paths
- no Create PR control is present
- no Vote or Ratify controls are present
- no Dispatch or Run controls are present

No live promotion, branch creation, PR creation, voting, ratification, dispatch, or run
action was executed in this pass.

---

## GV matrix

- `GV-01` PASS: deployed `/operator/motions` loads or auth-redirects correctly
- `GV-02` PASS: unauthenticated users redirect to login
- `GV-03` PASS: authenticated admin/operator reached `/operator/motions`
- `GV-04` PASS: primary queue is generated contenders
- `GV-05` PASS: contenders are labeled preview-only and non-canonical
- `GV-06` PASS: canonical motions are separate read-only reference
- `GV-07` PASS: deployed source mode / snapshot fallback is visible and correct
- `GV-08` PASS: canonical reference renders expected motion data
- `GV-09` UNVERIFIED/NON-BLOCKING: the `motion-0151` mismatch was not specifically re-captured in this pass, although the canonical reference itself rendered correctly
- `GV-10` PASS: promotion is disabled/blocked/guarded in snapshot mode and env-disabled mode
- `GV-11` UNVERIFIED/NON-BLOCKING: no non-admin deployed session was tested in this pass
- `GV-12` PASS: admin / feature / env / server-confirmation guard copy is visible
- `GV-13` PASS: normal page use created no branch/write
- `GV-14` PASS: no PR creation control exists in the observed UI
- `GV-15` PASS: no vote/ratify controls exist in the observed UI
- `GV-16` PASS: no dispatch/run controls exist in the observed UI
- `GV-17` PASS: `pnpm -C portal typecheck`
- `GV-18` PASS: `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml`
- `GV-19` PASS: `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`

---

## Final gates

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml` passed
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed
- `pnpm -C portal typecheck` passed

---

## Follow-up observations only

These items do not block motion-0161 ratification and are not fixed here:

- deployed bundled snapshot currently shows `157` canonical motions until snapshot refresh automation is added
- local branch live mode is ahead of deployed snapshot-backed canonical state
- canonical status badge currently displays `settled`
- operator preference is `ratified` unless `settled` has a distinct governance meaning

---

## Ratified evidence conclusion

Motion-0161 ratifies the deployed guardrail verification pass for the contender-first
Motion Operations surface.

- the stale snapshot contender-id defect is no longer present in deployed preview
- the preview no longer presents an existing canonical motion id as a valid new target
- promotion remains guarded and disabled when env is unavailable
- no new product capability, write power, or governance authority was introduced

---

## No-touch boundaries

- `portal/src/app/operator/motions/**`
- `portal/src/lib/motion/**`
- `runtime/**`
- `surfaces/agent-ops/**`
- existing `.nexus/motions/motion-0001` through `.nexus/motions/motion-0160`
- `portal/prisma/**`
- `.github/workflows/**`
- `package.json`
