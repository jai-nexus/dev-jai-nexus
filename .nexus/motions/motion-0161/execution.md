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

## Evidence sources

Agent-captured evidence:

- unauthenticated route headers
- redirected login page HTML
- failed deployed credential attempts using repo-discoverable seeded admin and agent passwords

Operator-provided authenticated evidence:

- authenticated admin login to deployed `dev.jai.nexus` succeeded manually
- deployed canonical reference renders motion data
- deployed canonical reference shows `157` canonical motions
- local branch live mode shows `161` canonical motions because branch-local live mode includes `motion-0161`
- deployed canonical list includes `motion-0157` and earlier ratified motions
- canonical reference is visually separate from the contender area
- current canonical status badge text displays `settled`

---

## Captures and observations

Text capture from the deployed unauthenticated route:

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

Operator observations from authenticated admin inspection:

- deployed `/operator/motions` is reachable after admin login
- canonical motion reference is visually separate from the contender area
- deployed canonical reference renders motion data instead of showing an empty state
- deployed canonical reference shows `157` canonical motions
- deployed canonical list includes `motion-0157` and earlier ratified motions
- deployed snapshot-backed canonical state does not automatically include branch-local `motion-0161`
- current status badge text displays `settled`

No write action, promotion action, branch creation, PR creation, vote, ratification, or dispatch was executed in this pass.

---

## GV matrix

- `GV-01` PASS: deployed `/operator/motions` loads and auth-redirects correctly
- `GV-02` PASS: unauthenticated users redirect to `/login?next=%2Foperator%2Fmotions`
- `GV-03` PASS: authenticated admin/operator can reach `/operator/motions` based on operator-provided deployed evidence
- `GV-04` BLOCKED: the top contender section was not directly captured in the authenticated deployed evidence provided here, so the primary queue could not be independently verified as generated contenders
- `GV-05` BLOCKED: preview-only / non-canonical contender labels were not directly captured in the authenticated deployed evidence provided here
- `GV-06` PASS: canonical motions are rendered in a separate read-only reference section based on operator-provided authenticated deployed evidence
- `GV-07` PASS: deployed behavior is consistent with bundled snapshot fallback; deployed canonical reference shows `157` motions while local branch live mode shows `161`
- `GV-08` PASS: canonical reference renders expected motion data, including `motion-0157` and earlier ratified motions
- `GV-09` BLOCKED: deployed surfacing of the `motion-0151` mismatch was not visible in the authenticated evidence provided here
- `GV-10` BLOCKED: disabled-promotion state under missing env, or equivalent guarded-admin copy, was not directly captured in the authenticated deployed evidence provided here
- `GV-11` UNVERIFIED: no non-admin deployed session was available; prior repo-discoverable non-admin seeded credentials returned `CredentialsSignin`
- `GV-12` BLOCKED: admin / feature / env guard copy inside the motions page was not directly captured in the authenticated deployed evidence provided here
- `GV-13` PASS (bounded): normal page use in this pass created no branch/write and executed no promotion path
- `GV-14` BLOCKED: no authenticated deployed evidence was captured for absence of PR creation controls
- `GV-15` BLOCKED: no authenticated deployed evidence was captured for absence of vote/ratify controls
- `GV-16` BLOCKED: no authenticated deployed evidence was captured for absence of dispatch/run controls
- `GV-17` PASS: `pnpm -C portal typecheck`
- `GV-18` PASS: `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml`
- `GV-19` PASS: `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`

---

## Follow-up observations only

These observations do not block guardrail verification on their own and are not fixed under motion-0161:

- snapshot refresh gap:
  - deployed bundled snapshot shows `157` canonical motions
  - local branch live mode shows `161`
  - likely follow-up seam: snapshot refresh/build automation
- status label alignment:
  - current badge text displays `settled`
  - operator preference is `ratified` unless `settled` has a distinct governance meaning
  - likely follow-up seam: status label alignment review

---

## Final gates

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0161/motion.yaml` passed
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed
- `pnpm -C portal typecheck` passed

---

## Caveats

- This pass includes operator-provided authenticated admin observations, but the agent did not gain direct authenticated browser/session access.
- Repo-discoverable seeded admin and agent credentials still returned `401 CredentialsSignin` on the deployed environment.
- No browser/manual UI smoke test was performed by the agent.
- No live GitHub branch promotion was executed.
- Several required authenticated in-page guardrail checks remain blocked because the supplied authenticated evidence did not include the contender preview area or disabled-control surfaces.

---

## Current disposition

No concrete blocker defect was identified from the evidence actually collected here.

Motion-0161 remains DRAFT because authenticated deployed verification is still incomplete: `GV-04`, `GV-05`, `GV-09`, `GV-10`, `GV-11`, `GV-12`, `GV-14`, `GV-15`, and `GV-16` are not fully verified from authenticated deployed evidence.

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
