# Q3M7 Governed Control Plane Route Export Import Boundary Design v0

## Role

Role: JAI::DEV::BUILDER

## 1. Design scope

A38 designs the import boundary for a possible future local route-handler export integration test.

A38 is docs/reference design-only. It does not implement source, implement tests, change route files, change package files, change lockfiles, change schemas, change migrations, run route handlers, run route-export integration tests, run a dev server, run browser/e2e tests, activate runtime behavior, dispatch providers/models/APIs, access deployed databases, mutate GitHub APIs, mutate Linear, mutate target repos, deploy, open production gates, or transfer authority.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A37 as completed planning-only evidence and routed A38 as a narrower route-export import / `server-only` boundary design lane.

A38 must preserve the accepted A37 planning baseline, carry forward A35/A36 limitations, and determine whether a future A39 lane should attempt direct route export import first or design a safer seam before implementation.

## 3. Accepted A37 baseline

A37 created `docs/reference/q3m7-governed-control-plane-local-route-handler-export-integration-planning-v0.md`.

A37 GitHub basis supplied by CONTROL_THREAD:

- PR 362 merged.
- Changed file: `docs/reference/q3m7-governed-control-plane-local-route-handler-export-integration-planning-v0.md`.
- Lane commit: `00d1d1b838829a45b182bee7d416738c5710a8e7`.
- Squash merge commit: `576077d4d8e53a5948a48ef9958308fdabd39d83`.

A37 findings carried forward:

- A35 is helper/test seam evidence only.
- A35 does not prove route-export integration.
- A35 does not prove provider readiness.
- A35 does not prove durable persistence readiness.
- A35 does not prove deployed runtime behavior.
- A35 does not prove broad activation-readiness.
- A35 does not prove activation.
- A37 identified passalong collection, passalong detail, motion intake, and manual inference route exports as candidates for future local testing.
- A37 identified real `server-only` import risk.
- A37 did not authorize implementation.

## 4. Files inspected

| Area | Files / paths inspected | Notes |
|------|-------------------------|-------|
| A38 packet | `/Users/jerryingram/.codex/attachments/842d63b5-a392-4173-951a-e1247e12f2c9/pasted-text.txt` | Routed A38 design-only instructions and validation boundary. |
| A37 planning | `docs/reference/q3m7-governed-control-plane-local-route-handler-export-integration-planning-v0.md` | Accepted planning baseline, candidate exports, `server-only` risk, and A38 recommendation. |
| A36 review | `docs/reviews/A36_GOVERNED_CONTROL_PLANE_LOCAL_ROUTE_HANDLER_SEAM_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md` | A35 sufficiency/limitation review and future route-export risk notes. |
| A35 focused test | `portal/src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | Helper/seam evidence; no production route import or execution. |
| A35 route harness | `portal/src/lib/controlPlane/routeHarness/fixtures.ts`, `portal/src/lib/controlPlane/routeHarness/persistence-seam.ts`, `portal/src/lib/controlPlane/routeHarness/provider-seam.ts`, `portal/src/lib/controlPlane/routeHarness/route-response.ts` | Synthetic fixtures, unavailable persistence seams, provider-disabled/config-missing seams, and response assertions. |
| A34/A33 design and planning | `docs/reference/q3m7-governed-control-plane-local-route-handler-seam-design-v0.md`, `docs/reference/q3m7-governed-control-plane-route-test-seam-harness-planning-v0.md` | Prior route-handler seam and `server-only` handling context. |
| A32/A30/A29 context | `docs/reviews/A32_GOVERNED_CONTROL_PLANE_NARROW_ROUTE_BOUNDARY_TEST_REVIEW_V0.md`, `portal/src/lib/controlPlane/governedRouteBoundary.test.ts`, `docs/reference/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0.md`, `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md` | Static route-boundary evidence, local-only posture, package-script posture, and activation-readiness separation. |
| Route exports | `portal/src/app/operator/control-thread/passalongs/route.ts`, `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`, `portal/src/app/operator/motion-control/manual-inference/route.ts`, `portal/src/app/operator/motion-control/motion-intake/route.ts` | Candidate future route exports; inspected only. |
| Thread memory helpers | `portal/src/lib/controlPlane/threadMemory/**` | Passalong validation, non-authorizations, persistence, and `server-only` context. |
| Motion kernel helpers | `portal/src/lib/controlPlane/motionKernel/**` | Motion intake, manual inference, provider connector, provider config, persistence, deliberation history, and `server-only` context. |
| Package scripts | `package.json`, `portal/package.json` | Script posture and docs/static validation availability. |

## 5. Files changed

| File | Change type | Boundary |
|------|-------------|----------|
| `docs/reference/q3m7-governed-control-plane-route-export-import-boundary-design-v0.md` | Added A38 design artifact. | Docs/reference design-only; no source, test, route, package, lockfile, schema, migration, runtime, provider, deployment, GitHub API, Linear, target-repo, production, or authority change. |

## 6. A37 limitations carried forward

| Limitation | Design consequence | Classification |
|------------|--------------------|----------------|
| A35 does not import or execute production route exports. | A38 must not treat A35 as route-export evidence. | `requires-future-implementation-lane` |
| A35 provider seams do not prove production provider readiness. | Future tests must keep provider/model/API dispatch unreachable and assert disabled/config-missing posture only. | `safe-for-future-local-design` |
| A35 persistence seams do not prove durable persistence readiness. | Future tests must target unavailable/blocked persistence before any durable persistence claim. | `safe-for-future-local-design` |
| A37 identified route modules that import `server-only` persistence/provider helpers. | Direct route import is not yet proven safe and must be guarded by stop conditions. | `direct-import-not-yet-proven-safe` |
| Direct route imports may reach Prisma, `process.env` provider config, or `openai` behind server-side branches. | Future implementation must not rely on ambient environment, credentials, deployed DBs, or live provider configuration. | `requires-additional-design` |
| Route-file changes were not authorized by A37 or A38. | Route-file changes remain blocked by default and conditional only under a future explicit lane. | `route-file-change-blocked` |
| Broad activation-readiness planning remains premature. | A38 must stay import-boundary design only. | `out-of-scope` |

## 7. Route export import boundary goals

A future implementation lane should only proceed if it can preserve these goals:

- import or represent route-export behavior without weakening `server-only` protections
- keep route files unchanged unless CONTROL_THREAD separately authorizes a minimal conditional seam
- use synthetic `Request` objects only
- reuse A35 route response helpers, fixtures, provider seams, and persistence seams
- assert response status, response body, and `nonAuthorizations`
- keep provider/model/API dispatch unreachable
- keep deployed database access unreachable
- keep route responses non-authoritative
- avoid package, lockfile, schema, migration, runtime, deployment, provider config, GitHub API, Linear, target-repo, and production changes
- stop and report before any route-handler execution if the import boundary is not proven safe

## 8. Candidate import paths

| Candidate import target | Import risk | Future use | Boundary |
|-------------------------|-------------|------------|----------|
| `portal/src/app/operator/control-thread/passalongs/route.ts` | Top-level route import reaches `passalong-persistence`, which begins with `import "server-only"` and can dynamically import Prisma. | Candidate `GET` unavailable-list and `POST` validation/persistence-unavailable coverage. | `direct-import-candidate-with-stop-condition`; no deployed DB. |
| `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts` | Top-level route import reaches `updatePersistedPassalongRecord` from the same `server-only` persistence module even though `GET` itself is conceptually non-mutating. | Candidate `GET` 405 non-authorizing response and `PATCH` unavailable/no-record coverage. | `direct-import-candidate-with-stop-condition`; no route mutation claim. |
| `portal/src/app/operator/motion-control/motion-intake/route.ts` | Route imports the motion kernel barrel, which reaches `server-only` motion intake persistence and Prisma paths. | Candidate missing-draft `400`, read/list unavailable posture, and advisory response coverage. | `direct-import-candidate-with-stop-condition`; no durable persistence. |
| `portal/src/app/operator/motion-control/manual-inference/route.ts` | Route imports provider connector, server provider config, motion kernel barrel, and deliberation history persistence; these include `server-only`, `process.env`, Prisma, and `openai` behind config. | Candidate mock-default, provider-disabled, provider-config-missing, and blocked history persistence coverage. | `direct-import-candidate-with-stop-condition`; no provider dispatch. |
| Extracted import-safe decision functions | Requires future source design and later implementation to move pure request/response decisions away from server-only dependencies. | Preferred future design path if CONTROL_THREAD wants stronger testability without route import side effects. | `requires-additional-design`; source changes not authorized in A38. |
| Test-only adapter module | Avoids importing route files but mirrors expected route decisions using A35 helpers. | Useful fallback evidence when direct import is blocked. | `requires-future-implementation-lane`; weaker than actual route-export evidence. |

## 9. `server-only` boundary design

| Boundary item | Design finding | Classification | Stop condition |
|---------------|----------------|----------------|----------------|
| `import "server-only"` guards | Must be preserved; A38 must not weaken, alias, patch, or bypass these guards. | `safe-for-future-local-design` | Stop if a future test requires removing, mocking globally, or weakening `server-only`. |
| Passalong persistence | `passalong-persistence.ts` starts with `server-only` and uses Prisma/raw SQL paths behind runtime calls. | `direct-import-not-yet-proven-safe` | Stop if route import or invocation needs real Prisma, `DATABASE_URL`, migrations, or deployed DB access. |
| Motion intake persistence | `motion-intake-persistence.ts` starts with `server-only` and imports Prisma directly. | `direct-import-not-yet-proven-safe` | Stop if route import or invocation reaches deployed DB setup or requires schema/migration changes. |
| Deliberation history persistence | `deliberation-run-history.ts` starts with `server-only` and imports Prisma directly. | `direct-import-not-yet-proven-safe` | Stop if manual inference import or invocation requires durable history persistence. |
| Server provider config | `server-provider-config.ts` starts with `server-only` and reads `process.env`. | `requires-additional-design` | Stop if future tests rely on ambient operator-machine credentials or raw `.env` content. |
| Provider connector | `provider-connector.ts` starts with `server-only` and can dynamically import `openai` if configured. | `direct-import-not-yet-proven-safe` | Stop if any path can reach `await import("openai")`, network dispatch, provider credentials, or live model calls. |
| Motion kernel barrel | Motion route imports can traverse a barrel that exposes server-only persistence/history modules. | `requires-additional-design` | Stop if import order makes route-export testing depend on server-only modules before seams can be applied. |
| Route-file dependency seams | Could make testing safer but would modify route/source files. | `route-file-change-conditional` | Stop unless a future lane explicitly authorizes route/source changes. |

## 10. Direct route export invocation design

Direct route export invocation remains the strongest future evidence only if it can be done without weakening boundaries.

Allowed future posture if CONTROL_THREAD routes implementation:

- import a candidate route module only inside a focused local test command
- call exported `GET`, `POST`, or `PATCH` functions with synthetic local requests and params
- use A35 `createJsonRequest`, `readRouteResponse`, `assertRouteResponseStatus`, `assertRouteResponseHasNonAuthorizations`, `assertNoExternalMutationAuthority`, and `assertNoForbiddenAuthorityClaims`
- begin with the lowest-risk responses, such as invalid payload or method-not-allowed paths, only if module import itself is safe
- treat any provider-disabled, provider-config-missing, or persistence-unavailable result as local evidence only

Forbidden future posture:

- no route handler execution before import safety is established
- no dev server, browser/e2e, build, deployed runtime, or production runtime
- no live provider call, no provider/model/API dispatch, and no `openai` path
- no Prisma migration, Prisma Studio, `db push`, deployed database read/write, or `DATABASE_URL` dependency
- no package, lockfile, schema, migration, route-file, runtime config, provider config, deployment, GitHub workflow, Linear, or target-repo changes unless separately routed

A38 finding: direct route export import is not yet proven safe enough to be the preferred A39 implementation path. It can remain an implementation option only with stop conditions.

## 11. Extracted decision-logic seam design

An extracted decision-logic seam would move route decision logic into import-safe functions while preserving Next route files as thin wiring.

Candidate shape for a future design lane:

- define import-safe functions that accept parsed request bodies and explicit provider/persistence adapters
- keep `NextResponse` creation either in route files or in a narrow response adapter
- keep `server-only` provider and persistence modules outside the import-safe decision module
- make persistence-unavailable and provider-disabled outcomes injectable and deterministic
- preserve current route response body shape and non-authorization copy
- document exact route-file edits before any implementation lane changes source

This option is stronger than a test-only adapter because it can become production-adjacent decision logic, and safer than direct import because it avoids top-level route module traversal through `server-only` dependencies.

Classification: `requires-additional-design`.

## 12. Test-only adapter seam design

A test-only adapter seam would model route decisions in a test-local module using A35 fixtures and seams without importing production route files.

Useful evidence:

- validates A35 fixtures against intended candidate route response shapes
- proves non-authorization assertions, provider-disabled seams, and persistence-unavailable seams stay coherent
- can be implemented without route-file changes if separately routed
- keeps provider/model/API dispatch and deployed DB access unreachable

Limitations:

- does not prove actual production route export integration
- can drift from route files unless paired with static source assertions
- must be reported as adapter evidence only

Classification: `requires-future-implementation-lane` and weaker than route-export evidence.

## 13. Conditional route-file dependency seam design

Route-file dependency seams remain blocked by default.

A future route-file seam should be considered only if direct import fails and an extracted decision-logic seam cannot preserve response parity without minimal route edits.

Acceptable future properties if separately routed:

- minimal route/source changes
- no production semantic broadening
- no package or dependency changes
- explicit provider/persistence adapter interfaces
- default production path remains current `server-only` provider/persistence behavior
- tests supply disabled/unavailable local adapters only
- route files keep operator/manual-only and non-authorizing response posture

Classification: `route-file-change-conditional`.

## 14. Recommended A39 path

A38 recommends:

`A39 Governed Control Plane Extracted Route Decision Seam Design v0`

Recommended branch:

`docs/q3m7-governed-control-plane-extracted-route-decision-seam-design-v0`

Reason:

Direct route export import is not yet proven safe because route modules have top-level imports that can reach `server-only` persistence/provider modules, Prisma paths, `process.env` provider config, and `openai` behind server-side configuration. A39 should design the extracted decision-logic seam before implementation so CONTROL_THREAD can decide exactly which source seams, if any, are acceptable.

Do not route broad activation-readiness planning from A38.

## 15. A35 helper/seam reuse requirements

| A35 helper/seam | Required future use | Boundary |
|-----------------|---------------------|----------|
| `createJsonRequest` | Build synthetic `http://local.test` request objects for `POST`/`PATCH` cases. | No network access. |
| Synthetic passalong fixtures | Exercise valid and invalid passalong payload boundaries. | No real passalong, routing, delivery, or approval. |
| Synthetic motion intake fixtures | Exercise missing-draft and draft-shape boundaries. | No routed work or durable persistence proof. |
| Synthetic manual inference fixtures | Exercise mock default, provider-disabled, and provider-config-missing postures. | No provider dispatch. |
| `readRouteResponse` | Snapshot local `Response` status and JSON body. | Response inspection only. |
| `assertRouteResponseStatus` | Assert local status codes such as `400` and `405`. | No deployed runtime claim. |
| `assertRouteResponseHasNonAuthorizations` | Require non-authorization arrays where route contracts expect them. | Negative authority assertion only. |
| `assertNoExternalMutationAuthority` / `assertNoForbiddenAuthorityClaims` | Reject forbidden positive authority claims in responses and seams. | No authority transfer. |
| Provider seams | Force provider-disabled and provider-config-missing expectations. | No live provider/model/API calls. |
| Persistence seams | Force unavailable/blocked persistence expectations. | No deployed database access. |

## 16. Future stop-and-report conditions

| Condition | Required future action | Boundary |
|-----------|------------------------|----------|
| Importing a route module fails because of `server-only`. | Stop and report; do not weaken `server-only`. | `server-only` protections preserved. |
| Importing a route module reaches Prisma or requires `DATABASE_URL`. | Stop and report; do not access deployed DB or run migrations. | No durable persistence claim. |
| Importing or invoking manual inference can reach `await import("openai")`. | Stop and report; provider dispatch remains unreachable. | No provider/model/API dispatch. |
| Future test requires ambient provider credentials or raw `.env` reads. | Stop and report; require explicit disabled/config-missing seam design. | No secret dependency. |
| Future implementation requires route-file changes. | Stop and report unless a future lane explicitly authorizes minimal route/source changes. | Route-file changes blocked by default. |
| Future implementation requires package, lockfile, schema, migration, runtime config, provider config, deployment config, or workflow changes. | Stop and report. | Out of A38/A39 direct implementation scope. |
| Future local route output lacks expected non-authorizations or contains positive authority claims. | Stop and report; do not normalize it away without authorization. | CONTROL_THREAD remains authority. |
| Future test needs a dev server, browser/e2e, build, deployed runtime, or production system. | Stop and report. | No runtime activation. |
| Future test would mutate GitHub, Linear, target repos, DNS, registrar, renewal/payment, billing, or funding systems. | Stop and report. | No external mutation. |
| Future evidence would be overclaimed as activation readiness. | Stop and report; classify as local route-boundary evidence only. | Broad activation-readiness remains premature. |

## 17. Future allowed validation commands

| Command | Future lane use | Boundary |
|---------|-----------------|----------|
| `git diff --check` | Whitespace validation for docs/source/test changes. | Safe local git check. |
| `git diff --cached --check` | Staged whitespace validation before commit. | Safe local git check. |
| Targeted non-authorization scan | Scan changed files plus route/context surfaces for forbidden positive authority claims and risky imports. | Classification required; no mutation. |
| Repo-local docs/reference/static validation script | Run only if an actual docs/static script exists in package scripts. | Not found for A38. |
| `pnpm -C portal lint` | Future source/test lane validation only if separately routed. | No runtime activation. |
| `pnpm -C portal typecheck` | Future source/test lane validation only if separately routed. | No runtime activation. |
| `pnpm -C portal exec tsx src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | Future A35 seam regression only if separately routed. | Local helper/seam test only. |
| `pnpm -C portal exec tsx src/lib/controlPlane/governedRouteExportIntegration.test.ts` | Future implementation lane only if CONTROL_THREAD routes it. | Local-only; no dev server/browser/e2e/provider/deployed DB. |

## 18. Future forbidden behavior

Future A39 or later lanes must not do any of the following unless CONTROL_THREAD explicitly routes that exact behavior:

- weaken, bypass, or globally mock `server-only`
- run route handlers before import safety is established
- run route-export integration tests outside a routed implementation lane
- run package scripts in a design-only lane
- run builds, dev servers, browser/e2e tests, or deployed runtime
- run database-backed integration tests, migrations, Prisma Studio, `db push`, or deployed database commands
- call providers/models/APIs or dispatch live provider requests
- use `gh`, GitHub APIs, Linear commands, target-repo commands, or deployment commands
- change package files, lockfiles, schemas, migrations, route files, runtime config, provider config, deployment config, or workflows outside explicit authorization
- introduce hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, checklist execution, activation, or authority transfer

## 19. Sufficiency analysis

| Sufficiency question | A38 finding | Classification | Boundary |
|----------------------|-------------|----------------|----------|
| Is direct route export import safe enough to recommend as the preferred A39 implementation lane? | No. Candidate imports still traverse top-level `server-only` persistence/provider modules and real DB/provider paths. | `direct-import-not-yet-proven-safe` | Do not implement yet as preferred path. |
| Can direct route export import remain a future option? | Yes, only as a direct-import candidate with stop conditions and no route-file changes first. | `direct-import-candidate-with-stop-condition` | Stop before weakening boundaries. |
| Is extracted decision logic preferable? | Yes. It is the safest next design path because it can define import-safe decision seams before source/test implementation. | `requires-additional-design` | Docs/design first. |
| Is a test-only adapter useful? | Yes, but only as weaker adapter evidence. | `requires-future-implementation-lane` | Must not be overclaimed as route-export proof. |
| Should route-file changes remain blocked? | Yes. Route-file changes are conditional only under explicit future authorization. | `route-file-change-blocked` | A38 changes no source. |
| Are A35 helpers reusable? | Yes. Response helpers, fixtures, provider seams, and persistence seams should be reused in any future local route-boundary implementation. | `safe-for-future-local-design` | Local-only. |
| Does A38 authorize broad activation-readiness planning? | No. Route-export import design is narrower and non-authoritative. | `out-of-scope` | ZERO GATES preserved. |

## 20. Next necessary decision options

| Option | Route candidate | Purpose | Boundary |
|--------|-----------------|---------|----------|
| 1 | Accept A38 and route A39 local route-handler export integration implementation with direct-import stop conditions. | Attempt `portal/src/lib/controlPlane/governedRouteExportIntegration.test.ts` only if CONTROL_THREAD accepts direct-import uncertainty and hard stops. | Local-only source/test lane; no route-file changes first. |
| 2 | Accept A38 and route A39 extracted decision-logic seam design. | Define import-safe route decision seams before implementation. | Docs/reference design-only; recommended. |
| 3 | Accept A38 and route A39 test-only adapter seam implementation. | Add weaker adapter evidence without importing route files. | Local-only test/source lane; must not claim route-export proof. |
| 4 | Accept A38 and hold further source/test expansion. | Preserve planning/design evidence without implementation. | No further mutation. |
| 5 | Hold A38 pending additional route/source inspection. | Request deeper read-only inspection before choosing A39. | No implementation. |
| 6 | Reject A38 if CONTROL_THREAD finds the import-boundary design insufficient. | Require a replacement design artifact. | No acceptance assumed. |

## 21. Recommendation for CONTROL_THREAD

Accept A38 if CONTROL_THREAD agrees with the classifications, then route:

`A39 Governed Control Plane Extracted Route Decision Seam Design v0`

Recommended branch:

`docs/q3m7-governed-control-plane-extracted-route-decision-seam-design-v0`

A39 should define exact import-safe decision functions, adapter boundaries, route-file edit candidates, response parity requirements, and implementation stop conditions before any source/test implementation lane.

Do not route broad activation-readiness planning from A38.

## 22. Non-authorizations preserved

| Non-authorization | Preserved? | Design finding |
|-------------------|------------|----------------|
| No source implementation | Yes | A38 changes only this docs/reference artifact. |
| No test implementation | Yes | No tests are added or modified. |
| No route-file changes | Yes | Route files are inspected only. |
| No package or lockfile changes | Yes | Package files are inspected only. |
| No schema or migration changes | Yes | No schema/migration files or commands are changed or run. |
| No route-handler execution | Yes | A38 does not invoke route exports. |
| No route-export integration testing | Yes | A38 is design-only. |
| No runtime activation | Yes | No dev server, production server, browser/e2e, or build is run. |
| No provider/model/API dispatch | Yes | Provider paths are inspected only. |
| No live provider calls | Yes | No provider call occurs. |
| No deployed database access | Yes | Persistence paths are inspected only. |
| No GitHub API mutation | Yes | No GitHub API or `gh` is used. |
| No Linear mutation | Yes | No Linear command is used. |
| No target-repo mutation/import | Yes | No target repo is touched. |
| No accepted-code import | Yes | No accepted-code import occurs. |
| No deployment / production gates | Yes | No deploy or production action occurs. |
| No public launch / DNS / registrar / renewal / payment / billing / funding | Yes | No asset-provider or financial action occurs. |
| No hidden automation / timers / polling / background jobs | Yes | A38 adds no automation. |
| No automatic route execution / delivery | Yes | No automatic execution or delivery is added. |
| No checklist execution / activation | Yes | No activation behavior occurs. |
| No acceptance / execution / CONTROL_THREAD authority transfer | Yes | CONTROL_THREAD remains authority. |

## 23. Evidence limitations

A38 is design evidence only. It does not prove:

- route-export integration
- route-handler runtime behavior
- direct import compatibility with `server-only`
- provider readiness
- durable persistence readiness
- deployed database behavior
- production readiness
- activation readiness
- operator workflow readiness
- A39 implementation readiness without additional CONTROL_THREAD decision

## 24. Risks and blockers

No blocker found inside the A38 docs/reference design scope.

Risks:

- Direct route module imports may fail or become unsafe because of `server-only` module guards.
- Direct route module imports may traverse real persistence/provider modules before a local test can substitute seams.
- Manual inference import context includes a provider connector with an `openai` path behind server-side configuration.
- Passalong and motion persistence context includes Prisma/raw SQL paths.
- A test-only adapter is safe but weaker than actual route-export evidence.
- Route-file dependency seams could be safe only if separately routed and minimal.

Potential future blockers:

- Any implementation proposal that weakens `server-only`.
- Any implementation proposal that uses ambient provider credentials, provider/model/API dispatch, deployed database access, package/lock/schema/migration changes, route-file changes without explicit authorization, GitHub/Linear/target-repo mutation, deployment, production gates, or authority transfer.

## 25. Validation

A38 validation to complete before final commit/push:

- `git diff --check`
- `git diff --cached --check` after staging only this artifact
- targeted non-authorization scan over this artifact, A37/A36/A35 context, and route/context files

Repo-local docs/reference/static validation script:

- Not found in inspected `package.json` or `portal/package.json` scripts.

A38 does not run tests, package scripts, builds, dev servers, browser/e2e tests, route handlers, route-export integration tests, migrations, Prisma commands, provider/model/API calls, GitHub APIs, `gh`, Linear commands, target-repo commands, or deployment commands.

## 26. Evidence

Repo-local evidence:

- Updated `main` contains A37 squash merge `576077d`, A36 squash merge `6c099e4`, and A35 squash merge `b583413`.
- Required A37/A36/A35 files are present.
- The A38 branch was created from updated `origin/main` with no stacked commits or diff before authoring.
- Candidate route exports are present in the four target route files.
- `server-only` import context is present in passalong persistence, motion intake persistence, deliberation history, provider connector, and server provider config.
- A35 route harness helpers are import-local and reusable for future route-export, decision-seam, or adapter tests.
- No docs/static validation script is present in inspected package scripts.

## 27. Non-authorization scan

Targeted scan classification for A38:

- A38 artifact hits are expected design references, non-authorization copy, `server-only` boundary context, evidence limitations, forbidden-behavior descriptions, and future stop conditions.
- A37/A36/A35 context hits are expected non-authorization copy, negative assertions, provider-disabled seam references, persistence-unavailable seam references, `server-only` boundary context, and evidence limitations.
- Route/context hits are pre-existing source context and safe existing behavior, including provider connector `openai` import behind server-side config, `process.env` provider config reads, Prisma persistence paths, `server-only` module guards, UI-local fetch usage outside A38 changes, and existing non-authorization copy.

No blocker is introduced by the A38 artifact.

## 28. Authority boundary

A38 is evidence for CONTROL_THREAD review only.

A38 does not accept A37, accept A38, route A39, authorize implementation, authorize tests, authorize route-file changes, authorize route-handler execution, authorize route-export integration testing, authorize runtime activation, authorize provider/model/API dispatch, authorize deployed database access, authorize GitHub/Linear/target-repo mutation, authorize deployment, open production gates, transfer source-of-truth, transfer execution authority, transfer acceptance authority, or transfer CONTROL_THREAD acceptance.

## 29. Repo-lane closeout

Branch:

`docs/q3m7-governed-control-plane-route-export-import-boundary-design-v0`

Commit:

To be recorded after final commit.

Files changed:

- `docs/reference/q3m7-governed-control-plane-route-export-import-boundary-design-v0.md`

Recommendation:

Accept A38 if CONTROL_THREAD agrees, then route A39 as `A39 Governed Control Plane Extracted Route Decision Seam Design v0` before source/test implementation. Keep direct route export import as a future candidate only with hard stop conditions.
