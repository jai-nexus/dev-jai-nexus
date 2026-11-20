# Q4M11Y26-P2:A3 Security Boundary, Drill and Reach v0

| Field | Value |
| -- | -- |
| Program / lane | `Q4M11Y26-P2:A3` (JAI-277) — Least-Privilege, CI, Inference and Kill-Switch Boundaries |
| This document | Packet **A3-G** (Governance, Rolemap and CI Guardrails) |
| Baseline | `jai-nexus/dev-jai-nexus@002a2f7256c593d57a7840066cb4b5010a2b14a2` |
| Route | `PING-Q4M11Y26-P2-A3G-EXEC-V1` (B9-CLASS-004) |
| Author seat | `JAI::DEV::VERIFIER` (Claude), exclusive steward of `.github/workflows/**` and `roles/rolemap.json` |
| Cross-verifier | `JAI::COUNCIL::BUILDER` (ChatGPT), B9-CLASS-006; no self-verification |
| Merge | Human only (B9-CLASS-007). `merge_authorized: false` for every AI seat |

## 1. Two-packet split

- **A3-G (this packet):** repository-enforced guardrails. That means the rolemap, the
  `role_guardrails` and `portal_guardrails` workflows, CODEOWNERS, a pinned required-test
  manifest, and CI enforcement of the A2 offline Prisma wrapper.
- **A3-I (later, separate route):** runtime inference and kill-switch gates on the
  manual-inference route (ADMIN, budget and provider checks), plus the observed drills.
  A3-I is not started. Nothing in this document claims an A3-I result.

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
| `role_guardrails` | **No** (see 3.2) | Policy regressions; trusted-base role, path and evidence evaluation |

### 3.2 External GitHub state (observed, not changed)

Read through the GitHub REST API from this session at `2026-11-20T21:32:20Z`:

- Ruleset `11506548` (`main-protection`) is `active` on `~DEFAULT_BRANCH` and has no bypass actors.
  - Rules: `non_fast_forward`, `deletion`, `pull_request`, `required_status_checks`.
  - `pull_request`: `required_approving_review_count: 0`, `require_code_owner_review: false`,
    `dismiss_stale_reviews_on_push: true`, `required_review_thread_resolution: true`.
  - `required_status_checks` (strict): `portal_guardrails`, `Vercel`, `Vercel Preview Comments`.
    **`role_guardrails` is not a required check**, so a failing `role_guardrails` does not block a
    merge today.
- `rules/branches/main` returns the same four rule types.
- Not observable from this session: classic branch protection (HTTP 403), Actions permission
  settings (proxy 403) and organization rulesets (not repository-scoped). This document claims
  nothing about them.

**Queued for a B9-CLASS-010 human operator ruleset update (not done by A3-G):** add
`role_guardrails` to the required status checks. Do **not** turn on
`require_code_owner_review` while there is only one human author. GitHub does not let authors
approve their own PRs, so it would block every solo-author PR. CODEOWNERS stays advisory until
that decision changes.

## 4. Residual limits (true after A3-G)

1. **The `pull_request` trigger runs the PR's own workflow definition and the PR's own
   policy module.** Reading the rolemap from the base SHA stops a PR from granting itself
   permissions through *data*. It does not stop a PR that rewrites
   `.github/workflows/role-guardrails.yml` or `role-guardrails-policy.cjs` from switching the
   check off for itself. The rolemap marks those paths VERIFIER-only, but `role_guardrails`
   itself enforces that, so the protection is circular. The real backstops are human-only merge
   (B9-CLASS-007), cross-verification (B9-CLASS-006), and the required `portal_guardrails`.
   Making `role_guardrails` required (3.2) would not close this. That needs a design that runs
   base-revision code only, without executing PR code under `pull_request_target`, and it needs
   its own route.
2. **The role is a self-asserted line in the PR body, not an identity.** The check enforces
   that the declared role matches the changed paths; it cannot tell who wrote the PR. Keeping
   identities separate depends on seat discipline and B9-CLASS-006.
3. **Manifest floor:** a PR that deletes a test and its manifest entry still passes while at
   least 32 remain. Manifest edits are VERIFIER-only, with the same circularity as item 1.
4. **Skip detection covers `node:test` output only.** 31 of the 33 pinned files are plain-assert
   scripts. An early `return` or `process.exit(0)` inside them cannot be detected.
5. **CODEOWNERS is advisory** while `require_code_owner_review` is `false`.

## 5. Pending A3-I drills (not performed in A3-G)

None of the following has been executed, observed or claimed:

- non-ADMIN and unauthorized budget/provider requests to the manual-inference route failing;
- kill-switch drill preventing further writes within the exact drill scope;
- a one-repository lane write permission failing against an unauthorized repository;
- independently observed credential or branch-setting external effects (B9-CLASS-010 evidence).

A3-G changed no credentials, tokens, GitHub settings or rulesets, called no providers, and
spent no money.

## 6. A3 checkable exit coverage

| JAI-277 exit item | Status after A3-G |
| -- | -- |
| Required manifest covers ≥ 32 files and rejects missing/skipped checks | **Covered** (D6) |
| Protected branch / CODEOWNERS settings observed, not merely documented | **Partial**: ruleset observed (3.2); CODEOWNERS present; code-owner review off by design |
| One-repository write permission fails against an unauthorized repository | A3-I / external |
| Non-ADMIN and unauthorized budget/provider paths fail | A3-I |
| Kill switch prevents future writes within exact drill scope | A3-I |

## 7. Non-authorizations

No `.nexus/**`, `portal/prisma/**`, `portal/package.json`, lockfile or manual-inference
runtime change. No ledger files. No merge, branch deletion, ruleset change, credential
operation, provider call or Layer 2 spend. This document grants no authority.
