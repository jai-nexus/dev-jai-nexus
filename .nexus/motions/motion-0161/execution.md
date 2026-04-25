# Execution: Deployed Motion Operations Guardrail Verification v0

**Motion:** motion-0161
**Kind:** evidence-proof
**Program:** q2-motion-operations-guardrail-verification
**Status:** DRAFT

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

No portal implementation files were changed in this pass.

---

## Deployed target checked

- URL: `https://dev.jai.nexus/operator/motions`
- environment: deployed `dev.jai.nexus` on Vercel
- verification date: `2026-04-25`

---

## Confirmed deployed observations

Text capture from the deployed route:

```text
HTTP/1.1 307 Temporary Redirect
Location: /login?next=%2Foperator%2Fmotions
Server: Vercel
```

Text capture from the redirected login page:

```text
JAI NEXUS · Login
Sign in as admin@jai.nexus or agent@jai.nexus.
```

Confirmed from deployed observation:

- the deployed `/operator/motions` route exists
- unauthenticated access is redirected to `/login?next=%2Foperator%2Fmotions`
- the deployed surface remains behind the expected auth/session boundary
- no write action, promotion action, or PR action was executed in this pass

---

## GV matrix

- `GV-01` PASS: deployed `/operator/motions` responds and redirects to login instead of 404/500
- `GV-02` UNVERIFIED: contender-first queue not inspected on deployed because no authenticated session was used
- `GV-03` UNVERIFIED: deployed contender labels were not inspected because no authenticated session was used
- `GV-04` UNVERIFIED: deployed canonical read-only reference was not inspected because no authenticated session was used
- `GV-05` UNVERIFIED: deployed snapshot/source-mode badge was not inspected because no authenticated session was used
- `GV-06` UNVERIFIED: deployed canonical reference data was not inspected because no authenticated session was used
- `GV-07` UNVERIFIED: deployed surfacing of the `motion-0151` mismatch was not inspected because no authenticated session was used
- `GV-08` UNVERIFIED: deployed disabled-promotion state under missing env was not inspected because no authenticated session was used
- `GV-09` UNVERIFIED: no non-admin session was available for deployed verification
- `GV-10` UNVERIFIED: admin/feature/env guard copy inside the motions page was not inspected because no authenticated session was used
- `GV-11` PASS (bounded): normal unauthenticated page use caused a redirect only and no observed branch/write activity
- `GV-12` UNVERIFIED: no authenticated deployed session was used to inspect whether PR creation controls are absent
- `GV-13` UNVERIFIED: no authenticated deployed session was used to inspect whether vote/ratify controls are absent
- `GV-14` UNVERIFIED: no authenticated deployed session was used to inspect whether dispatch controls are absent
- `GV-15` PASS (bounded): this pass performed no DB, runtime, or proof mutation and executed no write-capable feature path
- `GV-16` PASS: `pnpm -C portal typecheck`
- `GV-17` PASS: `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml`
- `GV-18` PASS: `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`

---

## Final gates

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml` passed
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed
- `pnpm -C portal typecheck` passed

---

## Caveats

- No authenticated deployed operator session was used in this pass.
- No browser/manual UI smoke test was run.
- No live GitHub branch promotion was executed.
- Snapshot fallback was not directly visible in deployed UI because the motions page remained auth-gated in this pass.
- Branch-local repo state can validate current implementation and guardrails, but it is not substituted here for authenticated deployed evidence.

---

## Current disposition

No concrete defect was found from the bounded deployed verification performed here.

Motion-0161 remains DRAFT because authenticated deployed verification of the contender-first
surface was not completed, so the evidence set is intentionally incomplete.

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
