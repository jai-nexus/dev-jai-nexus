# Q4M11Y26-P2:A3 Security Boundary, Drill and Reach v0

| Field | Value |
| -- | -- |
| Program / lane | `Q4M11Y26-P2:A3` (JAI-277) — Least-Privilege, CI, Inference and Kill-Switch Boundaries |
| Packets | A3-G governance guardrails, A3-I manual-inference gates, A3-C residual spend locks and credential-reach drill, A3-D runtime slot dispatch lock and A3 exit reconciliation |
| A3-G baseline | `jai-nexus/dev-jai-nexus@002a2f7256c593d57a7840066cb4b5010a2b14a2` |
| A3-G route | `PING-Q4M11Y26-P2-A3G-EXEC-V1` (B9-CLASS-004) |
| A3-G author | `JAI::DEV::VERIFIER` (Claude), exclusive steward of `.github/workflows/**` and `roles/rolemap.json` |
| A3-G cross-verifier | `JAI::COUNCIL::BUILDER` (ChatGPT), B9-CLASS-006; no self-verification |
| A3-C baseline | `jai-nexus/dev-jai-nexus@7ce8f669aa5a03650a341944de9a39f046093149` (A3-I merge) |
| A3-C route | `PING-Q4M11Y26-P2-A3C-EXEC-V1` (B9-CLASS-004 / B9-CLASS-010); author `JAI::DEV::VERIFIER` (Claude); cross-verifier `JAI::COUNCIL::BUILDER` (ChatGPT) |
| A3-D baseline | `jai-nexus/dev-jai-nexus@cef4863e7ded74059b5c5341d39bdfc53098bcdc` (A3-C squash merge of PR #452 at `2026-11-21T01:59:05Z`; parent `7ce8f669`; tree `464caefb`, identical to the cross-verified PR head) |
| A3-D route | `PING-Q4M11Y26-P2-A3D-EXEC-V1` (B9-CLASS-004); author `JAI::DEV::VERIFIER` (Claude); cross-verifier `JAI::COUNCIL::BUILDER` (ChatGPT) |
| Merge | Human only (B9-CLASS-007). `merge_authorized: false` for every AI seat |

## 1. Packets

- **A3-G:** repository-enforced guardrails. That means the rolemap, the
  `role_guardrails` and `portal_guardrails` workflows, CODEOWNERS, a pinned required-test
  manifest, and CI enforcement of the A2 offline Prisma wrapper.
- **A3-I:** runtime inference and kill-switch gates on the
  manual-inference route (ADMIN, budget and provider checks), plus the observed drills.
  The Builder executed the local drills below under `PING-Q4M11Y26-P2-A3I-EXEC-V1`. Independent verification belongs to Claude.
- **A3-C:** closes A3-I verification advisories V-1a (wave planner), V-1b (`motion-factory.mjs`)
  and V-5 (runner fixtures on Node 22.14; 34th manifest pin), and runs the V-6
  credential-reach drill. See sections 5A and 5B.
- **A3-D:** locks `runtime/slotDispatch.ts` (advisory V-1c), registers its regression suite in
  `portal_guardrails`, audits the whole repository for provider call sites, and records the
  CONTROL_THREAD ruling on CRED-1. See sections 5A, 5C and 5D.

## 2. Defects closed by A3-G

| # | Before (at `002a2f7`) | After | Regression test |
| -- | -- | -- | -- |
| D1 | `verifierBypassAllowedRoles ?? true`: with the key absent, any PR declaring VERIFIER skipped every path rule. | Bypass only when the value is literally `true` (`Boolean(policy.verifierBypassAllowedRoles === true)`). `roles/rolemap.json` sets it to `false` explicitly. A non-boolean value invalidates the policy. | `role-guardrails-policy.test.cjs`, test 1 |
| D2 | The workflow read `roles/rolemap.json` from the PR's own checkout, so a PR could edit the rolemap to authorize itself. | The workflow fetches `roles/rolemap.json` at `pr.base.sha` through the GitHub contents API. A missing, unreadable, non-file, invalid-JSON or schema-invalid policy fails the check. | tests 3, 11, 13 |
| D3 | The role parser took the first `Role:` line, ignored any later conflicting ones, rewrote typos such as `JAI:DEV::X`, and did not understand Markdown. | Exactly one declaration is required. Plain, backticked, `**Role:**`, `**Role**:`, bulleted and CRLF forms are accepted. Missing, duplicate, conflicting, malformed, unknown or wrong-prefix roles are rejected. Lines inside fenced code blocks and HTML comments are ignored. | tests 5–7 |
| D4 | The Evidence regex ended on `\Z`. JavaScript has no `\Z`, so it matched a literal `Z`: a final `## Evidence` section was found only if a capital Z appeared later in the body. | `## Evidence` ends at the next `## ` (H2) heading or at the end of the body. H3 subsections stay inside it, and a heading inside a code fence does not end it. Empty or placeholder-only sections are rejected when a rule requires evidence. | tests 8–9 |
| D5 | Renames were checked only at their new path, so a workflow could be moved out of `.github/workflows/` unchecked. | Both `filename` and `previous_filename` are checked against blocked paths and role rules. | test 4 |
| D6 | CI ran whatever `*.test.ts` files it discovered. No minimum count was enforced (apart from one special case), and skipped tests went unnoticed. | `control-plane-required-tests-v0.json` pins all 33 current files with a floor of 32. `--check` verifies schema, floor, unique sorted safe paths, and that every pinned file exists and is discovered. `--run` executes every discovered file, pinned or not, and fails on non-zero exit, signal, timeout, or skipped/todo `node:test` results. | `run-required-control-plane-tests.test.mjs` |
| D7 | A2 advisory A-1: CI did not run `prisma-offline.mjs` or its test. | `portal_guardrails` runs `node --test portal/scripts/prisma-offline.test.mjs` and `node portal/scripts/prisma-offline.mjs validate`. | CI step |
| D8 | `.github/CODEOWNERS` did not exist, and that path fell back to `defaultAllowedRoles` (BUILDER, VERIFIER). | The file names `JerryIngram` as the human owner of `*`, `/.github/**`, `/roles/**` and `/.nexus/**`. The rolemap rule `github-codeowners` makes it VERIFIER-only, with evidence required. | test 12 |

An additional least-privilege rule is not a defect fix but closes the same class of gap.
`ci-guardrail-scripts` makes the five A3-G policy, runner and manifest files VERIFIER-only, with
evidence required. Without it they would fall under `scripts-and-workspace`, which BUILDER may
edit. All other rules (`roles/`, `portal/src/**`, `portal/scripts/**`, `docs/`) are unchanged, so
an A3-I PR declared as BUILDER on manual-inference route files still passes (test 12).

## 3. What enforces what

### 3.1 Repository-enforced (runs on every PR)

| Check | Required by ruleset? | A3-G content |
| -- | -- | -- |
| `portal_guardrails` | **Yes** | Policy regressions; runner regressions; manifest `--check`; offline Prisma test and validate; type check; CI-B; required control-plane `--run`; build |
| `role_guardrails` | **Yes** (B9-CLASS-010, section 3.2) | Policy regressions; trusted-base role, path and evidence evaluation |

### 3.2 External GitHub state (observed, not changed)

Historical A3-G observation from the GitHub REST API at `2026-11-20T21:32:20Z`:

- Ruleset `11506548` (`main-protection`) is `active` on `~DEFAULT_BRANCH` and has no bypass actors.
  - Rules: `non_fast_forward`, `deletion`, `pull_request`, `required_status_checks`.
  - `pull_request`: `required_approving_review_count: 0`, `require_code_owner_review: false`,
    `dismiss_stale_reviews_on_push: true`, `required_review_thread_resolution: true`.
  - `required_status_checks` (strict): `portal_guardrails`, `Vercel`, `Vercel Preview Comments`.
    **`role_guardrails` was not yet required**, so a failing `role_guardrails` did not block a
    merge at that observation.
- `rules/branches/main` returns the same four rule types.
- Not observable from this session: classic branch protection (HTTP 403), Actions permission
  settings (proxy 403) and organization rulesets (not repository-scoped). This document claims
  nothing about them.

**B9-CLASS-007 integration.** GitHub records the human-accepted A3-G PR as merged to main at `2026-11-20T22:31:18Z`. Its merge commit and the verified A3-I base are `5189469e500aa0346fc33cd4f89c139b21c975cb`. [PR #450](https://github.com/jai-nexus/dev-jai-nexus/pull/450)

**Human operator Vercel environment audit (B9-CLASS-010; supplied by the operator, not
observed by this session).** On 2026-11-20 Jerry Ingram reviewed the Vercel project for all
environments, values redacted, and reported exactly nine variables: `SOT_INGEST_TOKEN`,
`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL`, `JAI_INTERNAL_API_BASE`, `NEXTAUTH_SECRET`,
`JAI_CONTEXT_API_KEY`, `JAI_INTERNAL_API_TOKEN` and `NODE_ENV`. No AI provider key
(`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `JAI_MODEL_SLOT_*`) is configured. This session has no
Vercel access and records the audit as reported.

**B9-CLASS-010 ruleset observation.** During A3-I, a read of `repos/jai-nexus/dev-jai-nexus/rulesets/11506548` returned active enforcement on the default branch. The required contexts are `role_guardrails`, `portal_guardrails`, `Vercel`, and `Vercel Preview Comments`. The pull-request rule reports `require_code_owner_review: false`. [main-protection](https://github.com/jai-nexus/dev-jai-nexus/rules/11506548)

## 4. Residual limits (true after A3-G)

1. **The `pull_request` trigger runs the PR's own workflow definition and the PR's own
   policy module.** Reading the rolemap from the base SHA stops a PR from granting itself
   permissions through *data*. It does not stop a PR that rewrites
   `.github/workflows/role-guardrails.yml` or `role-guardrails-policy.cjs` from switching the
   check off for itself. The rolemap marks those paths VERIFIER-only, but `role_guardrails`
   itself enforces that, so the protection is circular. The real backstops are human-only merge
   (B9-CLASS-007), cross-verification (B9-CLASS-006), and the required `portal_guardrails`.
   The required check still evaluates PR-supplied workflow code. That needs a design that runs
   base-revision code only, without executing PR code under `pull_request_target`, and it needs
   its own route.
2. **The role is a self-asserted line in the PR body, not an identity.** The check enforces
   that the declared role matches the changed paths; it cannot tell who wrote the PR. Keeping
   identities separate depends on seat discipline and B9-CLASS-006.
3. **Manifest floor:** a PR that deletes a test and its manifest entry still passes while at
   least 32 remain. Manifest edits are VERIFIER-only, with the same circularity as item 1.
4. **Skip detection covers `node:test` output only.** 31 of the 34 pinned files are plain-assert
   scripts. An early `return` or `process.exit(0)` inside them cannot be detected.
5. **CODEOWNERS is advisory** while `require_code_owner_review` is `false`.
6. **The session credential is the human owner's identity, scoped only by the session proxy**
   (section 5B). Within `dev-jai-nexus` it holds `admin`. Rulesets without bypass actors still
   apply to admins, but an admin can edit the ruleset itself, so human-only merge for AI seats
   (B9-CLASS-007) rests on seat discipline, not on credential scope. CONTROL_THREAD accepted this
   posture for A3 under ruling CRED-1 (section 5D); the technical fact is unchanged.
7. **Provider-path coverage is search-based** (section 5C). The audit matches SDK imports,
   provider API hosts and provider credential names. A provider endpoint assembled at runtime
   from configuration, or a new SDK added later, would not be found by these patterns. The
   per-file regression suites only cover the call sites that exist today.

## 5. B9-CLASS-002 local A3-I drills

The Builder exercised the manual-inference POST and provider connector with synthetic server sessions, a fake provider credential, an SDK import spy, and an in-memory persistence spy. No provider or database was contacted by these drills.

| Input or change | Observed result |
| --- | --- |
| Missing session, including caller-supplied ADMIN hints | HTTP 401 before reading the body. Zero participants and writes. |
| AGENT, missing role, or ADMIN with blank email | HTTP 403 before reading the body. Zero participants and writes. |
| ADMIN requests provider mode with live enablement, a fake key and a positive spend value | HTTP 403, `provider_spend_not_authorized`. Zero participants, provider calls and writes. Direct connector invocation with a simulated configured status also reached neither credential access nor SDK import. |
| ADMIN requests mock with kill switch ON or malformed | HTTP 503 before deliberation. Zero writes. |
| After mock deliberation, kill switch flips ON or writes flip to false | HTTP 503 with the corresponding disabled code and `persisted: false`. Zero calls to persist the prepared record. |
| ADMIN requests mock with kill switch OFF and writes enabled | HTTP 200. One mock participant and one advisory history write to the spy. Human approval remains required. |

The code-level Layer 2 ceiling is **USD 0.00**. The gates cover future dispatch through the in-repo manual-inference path and the call to persist `DeliberationRunHistory`. The write check reads the process environment immediately before persistence. Operational reach ends at that boundary. External provider account revocation, cancellation of already-in-flight network packets or writes, and enforcement of cross-repository credentials were outside the drill.

## 5A. A3-C residual Layer 2 spend locks and runner fix

A repository search for provider SDK imports and provider API hosts at the A3-C baseline
found four paid paths. Status after A3-C and A3-D:

| Path | Lock | Regression |
| --- | --- | --- |
| Manual-inference route and provider connector | A3-I gates (USD 0.00 ceiling, kill switch, write flag) | `a3-inference-gates.test.ts` (pinned #34) |
| `POST /api/internal/agents/plan-wave` and `planWaveWithAgent()` (V-1a) | Internal token kept at entry. The OpenAI SDK import and client were removed; the planner returns only a deterministic offline stub, labelled not provider-generated, with `generation.layer2ApiSpendUsd: "0.00"`. `providerMode: "live_provider"` gets HTTP 403 from the route, and the planner throws `PlannerSpendLockError` on its own. | `portal/src/lib/waves/agentPlanner.test.ts` |
| `portal/scripts/motion-factory.mjs` (V-1b) | Paid modes (`draft`/`promote` without `--no-api`, `revise`, `evidence`, including `--preview`) exit 3 at command dispatch before any key is read. `requireApiKey` and all four provider call sites (three OpenAI Responses, one shared Anthropic Messages) repeat the check. `status` reports dispatch disabled independently of key presence. `context`, `status` and `--no-api` modes stay offline. | `portal/scripts/motion-factory.test.mjs` |
| `runtime/slotDispatch.ts` via `runtime/run-slot-dispatch.ts` (V-1c, A3-D) | `dispatchSlot()` throws `SlotDispatchSpendLockError` (`PROVIDER_SPEND_NOT_AUTHORIZED`) where live dispatch would begin, and `dispatchOpenAI()` repeats the lock as its first statement, before `OPENAI_API_KEY` is read or the request is sent. The lock throws instead of returning a failure, so the CLI exits non-zero before it writes an output artifact or appends a run-ledger entry. Slot resolution and the existing selector and unsupported-provider refusals still work offline. | `runtime/slotDispatch.test.ts` |

All three suites (planner, motion-factory, slot dispatch) run with fake keys, an env attempt to
raise the ceiling (`JAI_LAYER2_AUTHORIZED_API_SPEND_USD`), and network traps with positive
controls, and all three run in `portal_guardrails`. The ceiling is a code constant in each file;
no environment variable can raise it. The slot dispatch suite also proves `process.env` holds
no read of the key, and runs the real CLI end to end in a temporary repository to show it
writes no output and no ledger entry; it leaves no files behind.

V-5: `run-required-control-plane-tests.test.mjs` now runs its `.test.ts` fixtures under `tsx`, as
production `--run` does. With Node's type stripping turned off (the Node 22.14 default) the old
suite passed 8/10 and the new one passes 10/10. The manifest pins
`motionKernel/a3-inference-gates.test.ts` as its 34th entry (`required=34 discovered=34 unpinned=0`).

## 5B. A3-C credential-reach drill (B9-CLASS-010, advisory V-6)

Authorized non-destructive probe from this session's `dev-jai-nexus`-scoped Git path. Ref:
`refs/heads/drill/b9-class-010-deny-probe`. Secrets redacted; HTTP status lines only were captured.

| UTC | Target | Action | Observed |
| --- | --- | --- | --- |
| 2026-11-21T01:40:57Z | `jai-nexus/jai-nexus-legacy` (parked, unauthorized) | `git push --dry-run` | First request `GET …/info/refs?service=git-receive-pack` returned **HTTP 403** from the session git proxy ("not in this session's authorized repository set"; no credential injected). Git exit 128. |
| 2026-11-21T01:40:57Z | `jai-nexus/dev-jai-nexus` (positive control) | `git push --dry-run` | Receive-pack and upload-pack **HTTP 200**; dry run reported the branch would be created. Afterwards `ls-remote` shows the probe ref absent. |
| 2026-11-21T01:41:10Z | both, read-only API | `GET repos/jai-nexus/{repo}` | `jai-nexus-legacy`: **HTTP 403** from the session layer. `dev-jai-nexus`: permissions `admin, maintain, push, triage, pull` = true. `GET /user` resolves to `JerryIngram` (User). |

The A3-C branch itself was then pushed to `dev-jai-nexus` through the same path.

**Disposition: PASS at the session boundary.** This session cannot write to, or read,
`jai-nexus-legacy`, while `dev-jai-nexus` push works. The enforcement point is the session's
Git/API proxy, not a single-repository credential: the underlying credential is the human
owner's user identity. Its reach outside this session cannot be observed from here and should
be assumed org-wide. Within `dev-jai-nexus` it is `admin`, so least privilege is **not** met.
Moving AI seats to a dedicated repository-scoped credential (contents and pull requests
write, no admin) is a separate human B9-CLASS-010 decision.

## 5C. A3-D full-repository provider call-site audit

Read-only search of the A3-D tree (baseline `cef4863e` plus the A3-D change), excluding
`node_modules`, the generated motion snapshot, `.nexus/` and Markdown.

- Required patterns over `portal/**`, `runtime/**` and `scripts/**`: `api.openai.com`,
  `api.anthropic.com`, `from "openai"`, `import("openai")`, `@anthropic-ai`, `OPENAI_API_KEY`,
  `ANTHROPIC_API_KEY`. Result: 34 matches in 8 files, none in `scripts/`.
- Broader sweep over the whole repository: other provider SDK packages (Google, Mistral, Groq,
  Cohere, Vercel AI SDK, Replicate, Together), other provider hosts (Google Generative Language,
  Mistral, Groq, OpenRouter, Together, Cohere, Replicate, Bedrock, Azure OpenAI), and other
  provider credential names. Result: no additional call site.

| Network dispatch site | Lock |
| --- | --- |
| `portal/scripts/motion-factory.mjs`: three OpenAI Responses `fetch` calls and one Anthropic Messages `fetch` | A3-C spend lock in each helper and at command dispatch |
| `portal/src/lib/controlPlane/motionKernel/provider-connector.ts`: `import("openai")` | A3-I `provider_dispatch` gate (always denied) before credential access |
| `runtime/slotDispatch.ts`: OpenAI Responses `fetch` | A3-D spend lock in `dispatchSlot()` and `dispatchOpenAI()` |

The other matches are credential reads that run only after those locks (`requireApiKey`,
`generateNarrativeWithOpenAI`, `dispatchOpenAI`); `motion-factory status` key-presence booleans,
which never dispatch; the A3-I-gated `JAI_MODEL_SLOT_API_KEY` connector credential; comments
and messages; and fake-key test fixtures. **Result: zero unlocked paid Layer 2 call sites among
the identified in-repository code paths** (limit: section 4, item 7).

## 5D. CONTROL_THREAD ruling on CRED-1

**Ruling:** `ACCEPTED_SOLO_OPERATOR_SESSION_PROXY_POSTURE`, issued by Jerry Ingram via
CONTROL_THREAD on 2026-11-20 and recorded here by A3-D.

**Technical facts, unchanged by the ruling.** The `jai-nexus/jai-nexus-legacy` HTTP 403
(section 5B) proves single-repository write isolation at the managed AI session Git proxy layer.
The credential behind that proxy, described by CONTROL_THREAD as the GitHub OAuth connector,
authenticates as the human owner `JerryIngram` and holds `admin` on `dev-jai-nexus`. It is not
repository-scoped.

**What CONTROL_THREAD accepts.** For `Q4M11Y26-P2:A3` (JAI-277), under the USD 0.00
solo-founder operating model, this three-layer control boundary satisfies the
one-repository write exit item:

1. the session proxy's single-repository enforcement (HTTP 403 outside the authorized set);
2. ruleset `11506548` (`main-protection`), with no bypass actors, requiring `role_guardrails`
   and `portal_guardrails`;
3. B9-CLASS-007 human-only merge adjudication.

Layer 1 lives outside the repository. Layer 2 can be edited by an `admin` credential. Layer 3 is
procedural. The ruling accepts these properties; it does not remove them.

**Standing requirement.** A dedicated credential (fine-grained personal access token or GitHub
App, scoped to this repository's contents and pull requests, without admin) is required
before any unattended or non-proxy CLI automation is authorized.

## 6. A3 checkable exit coverage

| JAI-277 exit item | Evidence |
| --- | --- |
| Required manifest floor and skip detection | A3-G runner regression suite; 34 pinned since A3-C, Node 22.14-compatible fixtures |
| Protected branch settings and CODEOWNERS | B9-CLASS-010 ruleset observation in section 3.2. CODEOWNERS remains advisory. |
| One-repository write permission against an unauthorized repository | **PASS at the session boundary** (section 5B): HTTP 403 for `jai-nexus-legacy`, push permitted for `dev-jai-nexus`. Enforced by the session proxy; the credential is not repository-scoped and is `admin` on `dev-jai-nexus`. Accepted for A3 by CONTROL_THREAD ruling CRED-1 (section 5D), with a dedicated credential required before unattended or non-proxy automation. |
| Non-ADMIN, provider and unauthorized spend paths | **PASS for all identified in-repository code paths** (section 5C): manual-inference (A3-I), wave planner and motion-factory (A3-C), runtime slot dispatch (A3-D), all locked at USD 0.00 with CI regression suites. Vercel holds no provider keys (operator audit, section 3.2). Coverage is search-based (section 4, item 7). |
| Kill switch before manual-inference persistence | B9-CLASS-002 mid-request flip in section 5 |

## 7. Authority boundary

These records grant zero execution, provider-spend, routing or acceptance authority. Independent B9-CLASS-006 verification and human B9-CLASS-007 acceptance remain separate decisions for A3-I, A3-C and A3-D.
