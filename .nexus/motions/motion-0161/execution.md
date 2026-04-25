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

Text capture from attempted credential sign-in using repo-discoverable seeded passwords:

```text
HTTP/1.1 401 Unauthorized
{"url":"https://dev.jai.nexus/api/auth/error?error=CredentialsSignin&provider=credentials"}
```

Text capture from attempted non-admin credential sign-in using repo-discoverable seeded passwords:

```text
HTTP/1.1 401 Unauthorized
{"url":"https://dev.jai.nexus/api/auth/error?error=CredentialsSignin&provider=credentials"}
```

Confirmed from deployed observation:

- the deployed `/operator/motions` route exists
- unauthenticated access is redirected to `/login?next=%2Foperator%2Fmotions`
- the deployed surface remains behind the expected auth/session boundary
- repo-discoverable seeded credentials did not establish an authenticated deployed admin session
- repo-discoverable seeded credentials did not establish an authenticated deployed non-admin session
- no write action, promotion action, or PR action was executed in this pass

---

## GV matrix

- `GV-01` PASS: deployed `/operator/motions` loads and auth-redirects correctly
- `GV-02` PASS: unauthenticated users redirect to `/login?next=%2Foperator%2Fmotions`
- `GV-03` BLOCKED: authenticated operator could not reach the page because deployed session access was unavailable
- `GV-04` BLOCKED: primary queue could not be inspected on deployed because authenticated session access was unavailable
- `GV-05` BLOCKED: preview-only / non-canonical contender labels could not be inspected on deployed because authenticated session access was unavailable
- `GV-06` BLOCKED: canonical motions as a separate read-only reference could not be inspected on deployed because authenticated session access was unavailable
- `GV-07` BLOCKED: deployed source mode / snapshot fallback badge could not be inspected because authenticated session access was unavailable
- `GV-08` BLOCKED: canonical reference data rendering could not be inspected because authenticated session access was unavailable
- `GV-09` BLOCKED: deployed surfacing of the `motion-0151` mismatch could not be inspected because authenticated session access was unavailable
- `GV-10` BLOCKED: disabled-promotion state under missing env could not be inspected because authenticated session access was unavailable
- `GV-11` BLOCKED: non-admin cannot promote could not be inspected in-page because non-admin deployed session access was unavailable; repo-discoverable non-admin credentials returned `CredentialsSignin`
- `GV-12` BLOCKED: admin / feature / env guard copy inside the motions page could not be inspected because authenticated session access was unavailable
- `GV-13` PASS (bounded): normal page use in this pass created no branch/write and executed no promotion path
- `GV-14` BLOCKED: no authenticated deployed session was available to inspect whether PR creation controls are absent
- `GV-15` BLOCKED: no authenticated deployed session was available to inspect whether vote/ratify controls are absent
- `GV-16` BLOCKED: no authenticated deployed session was available to inspect whether dispatch controls are absent
- `GV-17` PASS: `pnpm -C portal typecheck`
- `GV-18` PASS: `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml`
- `GV-19` PASS: `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`

---

## Final gates

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml` passed
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed
- `pnpm -C portal typecheck` passed

---

## Caveats

- No authenticated deployed operator session was available in this pass.
- Bounded sign-in attempts using repo-discoverable seeded admin and agent credentials both returned `401 CredentialsSignin` on the deployed environment.
- No browser/manual UI smoke test was run.
- No live GitHub branch promotion was executed.
- Snapshot fallback was not directly visible in deployed UI because the motions page remained auth-gated in this pass.
- Branch-local repo state can validate current implementation and guardrails, but it is not substituted here for authenticated deployed evidence.

---

## Current disposition

No concrete defect was found from the bounded deployed verification performed here.

Motion-0161 remains DRAFT because authenticated deployed verification of the contender-first
surface was blocked by unavailable authenticated session access, so the evidence set is intentionally incomplete.

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
