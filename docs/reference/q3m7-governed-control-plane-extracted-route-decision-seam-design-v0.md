# Q3M7 Governed Control Plane Extracted Route Decision Seam Design v0

## Role

Role: JAI::DEV::BUILDER

## 1. Design scope

A39 designs how a future source/test implementation could extract or isolate governed control-plane route decision logic into import-safe helpers while preserving Next route wiring and `server-only` protections.

A39 is docs/reference design-only. It does not implement source, implement tests, change route files, change package files, change lockfiles, change schemas, change migrations, run route handlers, run route-export integration tests, run a dev server, run browser/e2e tests, activate runtime behavior, dispatch providers/models/APIs, access deployed databases, mutate GitHub APIs, mutate Linear, mutate target repos, deploy, open production gates, or transfer authority.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A38 as completed route export import boundary design and routed A39 as extracted route decision seam design.

A39 must carry forward the A38 finding that direct route export import is not yet proven safe. A39 must design a safer source/test seam for future review without implementing it.

## 3. Accepted A38 baseline

A38 created `docs/reference/q3m7-governed-control-plane-route-export-import-boundary-design-v0.md`.

A38 GitHub basis supplied by CONTROL_THREAD:

- PR 363 merged.
- Changed file: `docs/reference/q3m7-governed-control-plane-route-export-import-boundary-design-v0.md`.
- Lane commit: `011dcc23b57aadbac801898bc4e0a2388dca3e66`.
- Squash merge commit: `95cf8342a7760e8e892307f258c227ce6a7c64dc`.

A38 findings carried forward:

- Direct route export import is not yet proven safe.
- Candidate route modules have top-level paths into `server-only` persistence/provider modules.
- Candidate route modules may transitively touch Prisma paths.
- Candidate route modules may transitively touch provider config and `openai` behind server-side config.
- Ambient `process.env` behavior must not be trusted as a test boundary.
- Weakening or bypassing `server-only` is not acceptable.
- Route-file changes remain blocked by default.
- Extracted decision-logic seam design is safer than direct route import at this stage.
- Provider readiness remains unproven.
- Durable persistence readiness remains unproven.
- Deployed runtime readiness remains unproven.
- Broad activation-readiness planning remains premature.
- Activation remains unauthorized.

## 4. Files inspected

| Area | Files / paths inspected | Notes |
|------|-------------------------|-------|
| A39 packet | `/Users/jerryingram/.codex/attachments/d52b6ce3-2812-4570-a061-32dd353b5bfc/pasted-text.txt` | Routed A39 design-only instructions and validation boundary. |
| A38 design | `docs/reference/q3m7-governed-control-plane-route-export-import-boundary-design-v0.md` | Accepted import-boundary baseline and A39 recommendation. |
| A37 planning | `docs/reference/q3m7-governed-control-plane-local-route-handler-export-integration-planning-v0.md` | Candidate route exports and prior integration goals. |
| A36 review | `docs/reviews/A36_GOVERNED_CONTROL_PLANE_LOCAL_ROUTE_HANDLER_SEAM_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md` | A35 helper/seam sufficiency and limitations. |
| A35 focused test | `portal/src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | Local helper/seam evidence; no production route import or execution. |
| A35 route harness | `portal/src/lib/controlPlane/routeHarness/fixtures.ts`, `portal/src/lib/controlPlane/routeHarness/persistence-seam.ts`, `portal/src/lib/controlPlane/routeHarness/provider-seam.ts`, `portal/src/lib/controlPlane/routeHarness/route-response.ts` | Synthetic fixtures, provider-disabled/config-missing seams, persistence-unavailable seams, and response assertions. |
| A34/A33 design and planning | `docs/reference/q3m7-governed-control-plane-local-route-handler-seam-design-v0.md`, `docs/reference/q3m7-governed-control-plane-route-test-seam-harness-planning-v0.md` | Prior local seam and route harness boundary. |
| A32/A30/A29 context | `docs/reviews/A32_GOVERNED_CONTROL_PLANE_NARROW_ROUTE_BOUNDARY_TEST_REVIEW_V0.md`, `portal/src/lib/controlPlane/governedRouteBoundary.test.ts`, `docs/reference/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0.md`, `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md`, `portal/package.json` | Static route-boundary evidence, route test gaps, package posture, and activation separation. |
| Route exports | `portal/src/app/operator/control-thread/passalongs/route.ts`, `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`, `portal/src/app/operator/motion-control/manual-inference/route.ts`, `portal/src/app/operator/motion-control/motion-intake/route.ts` | Candidate future route wiring and response shapes; inspected only. |
| Thread memory helpers | `portal/src/lib/controlPlane/threadMemory/**` | Passalong validation, non-authorizations, passalong persistence, and `server-only` context. |
| Motion kernel helpers | `portal/src/lib/controlPlane/motionKernel/**` | Motion intake, manual inference, provider connector, provider config, persistence, deliberation history, and `server-only` context. |
| Package scripts | `package.json`, `portal/package.json` | Script posture and docs/static validation availability. |

## 5. Files changed

| File | Change type | Boundary |
|------|-------------|----------|
| `docs/reference/q3m7-governed-control-plane-extracted-route-decision-seam-design-v0.md` | Added A39 design artifact. | Docs/reference design-only; no source, test, route, package, lockfile, schema, migration, runtime, provider, deployment, GitHub API, Linear, target-repo, production, or authority change. |

## 6. A38 limitations carried forward

| Limitation | Design consequence | Classification |
|------------|--------------------|----------------|
| Direct route export import is not yet proven safe. | Future implementation should prefer import-safe decision helpers over direct route module imports. | `safe-for-future-design` |
| Candidate route modules traverse `server-only` persistence/provider modules. | Decision helpers must not import Next route modules, server-only persistence, server-only provider config, provider connector, or Prisma-backed modules. | `candidate-for-future-implementation` |
| Candidate route modules may transitively touch Prisma paths. | Persistence must be adapterized and injected into decision helpers. | `candidate-for-future-implementation` |
| Candidate route modules may transitively touch provider config and `openai`. | Provider status and connector output must be adapterized and injected into decision helpers. | `candidate-for-future-implementation` |
| Ambient `process.env` behavior is not a safe test boundary. | Future tests must use explicit provider-disabled/config-missing adapters, not operator-machine environment. | `safe-for-future-design` |
| `server-only` protections must not be weakened. | Server-only modules remain behind route-file production wiring and adapters. | `safe-for-future-design` |
| Route-file changes remain blocked by default. | A40 implementation may touch route files only if CONTROL_THREAD explicitly authorizes minimal wiring changes. | `route-file-change-conditional` |
| Provider readiness and durable persistence readiness remain unproven. | Future evidence must stay local-only and not claim provider or persistence readiness. | `out-of-scope` |
| Broad activation-readiness remains premature. | A39 and candidate A40 stay route-decision seam scoped. | `out-of-scope` |

## 7. Extracted route decision seam goals

The future extracted route decision seam should:

- move pure request-body normalization, validation, adapter result mapping, and response-body construction into import-safe helper modules
- keep `NextResponse`, route exports, `runtime`, `dynamic`, request JSON parsing, and route params in Next route files
- keep `server-only` provider and persistence modules outside import-safe helper modules
- require explicit provider and persistence adapters as inputs
- preserve existing response body shapes, status selection rules, and non-authorization copy
- make provider-disabled and provider-config-missing outcomes deterministic without reading ambient credentials
- make persistence-unavailable outcomes deterministic without deployed database access
- reuse A35 response, fixture, provider, and persistence helpers in future tests
- produce local-only source/test evidence only if future implementation is routed
- stop before any provider/model/API dispatch, deployed database access, runtime activation, or authority transfer

## 8. Candidate route decision functions

| Candidate seam | Route surface | Future purpose | Boundary |
|----------------|---------------|----------------|----------|
| `decidePassalongCollectionList` | Passalong collection `GET` | Map a passalong list adapter result into `{ ok, records, persistence, nonAuthorizations }`. | `candidate-for-future-implementation`; adapter supplies unavailable/persisted result. |
| `decidePassalongCollectionCreate` | Passalong collection `POST` | Validate body input, return validation-blocked `400` body, or map persistence adapter result into current response shape. | `candidate-for-future-implementation`; no DB access inside helper. |
| `decidePassalongDetailMethodNotAllowed` | Passalong detail `GET` | Return current `405` response body and non-authorizations without importing persistence. | `candidate-for-future-implementation`; no mutation. |
| `decidePassalongDetailPatch` | Passalong detail `PATCH` | Map update adapter result into current `{ ok, record, errors, persistence, nonAuthorizations }` shape and status rule. | `candidate-for-future-implementation`; adapter supplies update result. |
| `decideMotionIntakeList` | Motion intake `GET` | Map intake records plus motion-basis builder into current list response shape. | `candidate-for-future-implementation`; no Prisma in helper. |
| `decideMotionIntakeCreate` | Motion intake `POST` | Return missing-draft `400` body or map build/persist adapter result into current response shape. | `candidate-for-future-implementation`; no DB write in helper. |
| `decideManualInferenceRun` | Manual inference `POST` | Normalize motion, role slots, model slot, requested mode, provider decision, aggregate ratification, history persistence result, and response body. | `candidate-for-future-implementation`; provider/history adapters required. |
| `buildManualInferenceHistoryInput` | Manual inference history | Construct non-authorizing history record input from participant outputs and provider status. | `candidate-for-future-implementation`; persistence remains adapterized. |
| `routeDecisionNonAuthorizations` | Shared route decision constants | Centralize route-decision non-authorization copy used by decision helpers. | `candidate-for-future-implementation`; copy only, no authority. |

## 9. Import-safe helper module boundary

Import-safe route decision helpers should live under `portal/src/lib/controlPlane/routeDecisions/` or another explicitly routed import-safe control-plane folder.

Allowed imports for future implementation:

- Type-only imports from existing route/body/domain types where safe.
- Import-safe validation helpers, such as passalong boundary validation and motion-intake normalization, if they do not import `server-only`, Prisma, provider connector, or ambient provider config.
- Import-safe constants for non-authorizations.
- Import-safe mock/default helper functions that do not read ambient provider credentials or call providers.

Forbidden imports for future implementation:

- `next/server` and `NextResponse`
- route modules under `portal/src/app/**/route.ts`
- modules beginning with `import "server-only"`
- `@/lib/prisma` or Prisma client/runtime modules
- `provider-connector.ts`
- `server-provider-config.ts`
- modules that read provider credentials, raw `.env`, or `process.env` as the test boundary
- `openai`, `fetch`, `axios`, `octokit`, GitHub/Linear clients, target-repo commands, deployment clients, timers, polling, cron, or webhooks

If an apparently import-safe helper currently reaches a server-only module through a barrel export, future implementation must stop and either narrow the import path or route another design/review lane.

## 10. Route-file wiring boundary

Future route files should remain thin wiring if source implementation is routed.

Route files may keep:

- `runtime = "nodejs"`
- `dynamic = "force-dynamic"`
- exported `GET`, `POST`, and `PATCH` functions
- `Request` JSON parsing
- dynamic route params
- `NextResponse.json`
- production adapter construction that calls current server-only persistence/provider functions

Decision helpers should receive:

- parsed request body
- route params such as `passalongId`
- provider adapter result or provider adapter function
- persistence adapter result or persistence adapter function
- import-safe domain helpers required to build response bodies

Route files should not move server-only dependencies into import-safe helpers. They should call server-only provider/persistence paths only through production adapters in the route layer or a separate server-only adapter layer.

## 11. Provider-disabled / provider-config-missing adapter boundary

Provider behavior must be explicit, injected, and local-only in future tests.

Future provider adapter design:

- expose provider status values equivalent to `provider_disabled`, `provider_config_missing`, and any safe mock/default posture
- expose participant outputs or connector statuses without live provider dispatch
- expose `providerDispatchAttempted: false` and `networkAccessRequired: false` in test adapters
- keep configured-provider behavior out of scope unless separately routed
- keep `openai` unreachable in provider-disabled and provider-config-missing tests
- keep provider credential checks in server-only production wiring, not in import-safe decision helpers

Future production route wiring may continue to use current server-only provider config and connector modules. Future tests must use A35 provider seams or equivalent explicit adapters instead.

## 12. Persistence-unavailable adapter boundary

Persistence behavior must be explicit, injected, and local-only in future tests.

Future persistence adapter design:

- represent passalong list, create, and update results without touching a deployed database
- represent motion intake list and create results without touching a deployed database
- represent deliberation history persistence as blocked/staged unless a separate persistence lane is routed
- expose `available: false` or `status: "blocked"` for unavailable cases
- preserve safe advisory messages and non-authorizations
- avoid Prisma, `DATABASE_URL`, migrations, schema changes, deployed DB reads, deployed DB writes, cleanup jobs, retries, or background work

Future production route wiring may continue to call current server-only persistence modules. Future tests must use A35 persistence seams or equivalent explicit adapters instead.

## 13. Response-shape preservation rules

Future implementation must preserve current route response contracts unless CONTROL_THREAD explicitly routes a response contract change.

Required preservation:

- Passalong collection `GET`: `{ ok, records, persistence: { available, safeMessage }, nonAuthorizations }`
- Passalong collection `POST` invalid payload: status `400`, validation-blocked error text, errors, and passalong non-authorizations
- Passalong collection `POST` persistence path: `{ ok, record, errors, persistence, nonAuthorizations }` with current status rule `result.record ? 200 : 400`
- Passalong detail `GET`: status `405`, current method-not-allowed non-authorizing error text, and passalong non-authorizations
- Passalong detail `PATCH`: `{ ok, record, errors, persistence, nonAuthorizations }` with current status rule `result.record ? 200 : 400`
- Motion intake `GET`: `{ ok: true, records, motionBases, nonAuthorizations }`
- Motion intake `POST` missing draft: status `400`, current missing-draft error text, and route non-authorizations
- Motion intake `POST` valid draft: `{ ok: true, record, motionBasis, nonAuthorizations }`
- Manual inference `POST`: `{ ok, persisted, operatorTriggeredOnly, providerStatus, persistence, connectorStatuses, participantOutputs, aggregateRatification, evidencePointers, nonAuthorizations }`

Future helper tests should assert both response body shape and status where the status is explicit.

## 14. Non-authorization assertion rules

Future implementation tests must assert:

- response bodies include expected `nonAuthorizations`
- response bodies and adapter outputs exclude forbidden positive authority claims
- provider outputs remain advisory only
- persistence output remains app-local, blocked, unavailable, or non-authoritative unless separately routed
- no response claims route authority, execution authority, acceptance authority, CONTROL_THREAD acceptance transfer, source-of-truth transfer, deployment authority, production gate opening, public launch, provider dispatch authority, GitHub mutation authority, Linear mutation authority, target-repo mutation/import authority, automatic route execution, automatic delivery, checklist execution, or activation
- errors and fallback messages do not expose secrets, provider keys, raw `.env`, connection strings, production telemetry, private reasoning, target repo source, or deployed DB details

A35 `assertNoForbiddenAuthorityClaims`, `assertNoExternalMutationAuthority`, and `assertRouteResponseHasNonAuthorizations` remain required future guards.

## 15. A35 helper/seam reuse requirements

| A35 helper/seam | Required future use | Boundary |
|-----------------|---------------------|----------|
| `createJsonRequest` | Build synthetic `http://local.test` request objects when route wiring tests are later authorized. | No network access. |
| Synthetic passalong fixtures | Exercise valid and invalid passalong decision inputs. | No real passalong, route, delivery, or approval. |
| Synthetic motion intake fixtures | Exercise missing-draft and draft-shape decision inputs. | No routed work or durable persistence proof. |
| Synthetic manual inference fixtures | Exercise mock-default, provider-disabled, and provider-config-missing decision inputs. | No provider dispatch. |
| `readRouteResponse` | Inspect route `Response` objects only if route wiring tests are later authorized. | Response inspection only. |
| `jsonRouteResponse` | Build local response snapshots in decision/helper tests where route export import remains out of scope. | No production route proof by itself. |
| `assertRouteResponseStatus` | Assert current status rules such as `400` and `405`. | No deployed runtime claim. |
| `assertRouteResponseHasNonAuthorizations` | Require non-authorization arrays in response bodies. | Negative authority assertion only. |
| `assertNoExternalMutationAuthority` / `assertNoForbiddenAuthorityClaims` | Reject forbidden positive authority claims across decision outputs and adapter outputs. | No authority transfer. |
| Provider seams | Supply provider-disabled and provider-config-missing adapters. | No live provider/model/API calls. |
| Persistence seams | Supply unavailable/blocked persistence adapters. | No deployed database access. |
| `assertFixturesAreSecretFree` | Guard future fixture additions. | No secrets or production data in fixtures. |

## 16. Future implementation candidate files

| Candidate file | Candidate purpose | Boundary |
|----------------|-------------------|----------|
| `portal/src/lib/controlPlane/routeDecisions/passalongRouteDecisions.ts` | Import-safe passalong collection/detail decision helpers and response body builders. | `candidate-for-future-implementation`; no Next, no `server-only`, no Prisma. |
| `portal/src/lib/controlPlane/routeDecisions/motionIntakeRouteDecisions.ts` | Import-safe motion intake list/create decision helpers and response body builders. | `candidate-for-future-implementation`; persistence injected. |
| `portal/src/lib/controlPlane/routeDecisions/manualInferenceRouteDecisions.ts` | Import-safe manual inference normalization, provider adapter mapping, history input, and response body builders. | `candidate-for-future-implementation`; provider/history adapters injected. |
| `portal/src/lib/controlPlane/routeDecisions/types.ts` | Shared adapter, result, and response body types. | `candidate-for-future-implementation`; type-only where possible. |
| `portal/src/lib/controlPlane/governedRouteDecisionSeam.test.ts` | Focused local test for extracted decision helpers using A35 seams. | `candidate-for-future-implementation`; no route export execution. |
| `portal/src/lib/controlPlane/governedRouteExportIntegration.test.ts` | Optional later route wiring test if route-file changes and import safety are separately authorized. | `requires-additional-review`; stronger evidence, higher boundary risk. |
| `portal/src/app/operator/control-thread/passalongs/route.ts` | Minimal future wiring to call passalong decision helper and production adapter. | `route-file-change-conditional`; only if A40 explicitly authorizes. |
| `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts` | Minimal future wiring to call passalong detail decision helper and production adapter. | `route-file-change-conditional`; only if A40 explicitly authorizes. |
| `portal/src/app/operator/motion-control/motion-intake/route.ts` | Minimal future wiring to call motion intake decision helper and production adapter. | `route-file-change-conditional`; only if A40 explicitly authorizes. |
| `portal/src/app/operator/motion-control/manual-inference/route.ts` | Minimal future wiring to call manual inference decision helper and production adapters. | `route-file-change-conditional`; only if A40 explicitly authorizes. |

## 17. Future route-file change boundary

| Route-file question | A39 design finding | Classification | Boundary |
|---------------------|--------------------|----------------|----------|
| Are route-file changes authorized by A39? | No. A39 is design-only. | `route-file-change-blocked` | No source or route mutation in A39. |
| Are route-file changes likely needed for true extraction? | Yes. If route decisions are actually extracted, route files likely need minimal wiring imports and adapter calls. | `route-file-change-conditional` | Future explicit implementation lane required. |
| Can A40 begin without route-file changes? | Yes, if A40 first implements import-safe decision helpers and tests only. | `candidate-for-future-implementation` | Weaker than route wiring parity. |
| Should A40 include route-file wiring? | Only if CONTROL_THREAD wants production route files to consume the extracted seam immediately. | `route-file-change-conditional` | Keep changes minimal and response-shape-preserving. |
| What route-file changes remain forbidden? | Any semantic broadening, runtime activation, package dependency, provider config, persistence behavior expansion, or weakened `server-only` boundary. | `blocker` if proposed | Stop and report. |

## 18. Future stop-and-report conditions

| Condition | Required future action | Boundary |
|-----------|------------------------|----------|
| Import-safe helper needs to import a route module. | Stop and report; keep helper independent of `portal/src/app/**/route.ts`. | No direct route import. |
| Import-safe helper needs `next/server` or `NextResponse`. | Stop and report or keep that code in route wiring. | Route files own Next wiring. |
| Import-safe helper needs a module with `import "server-only"`. | Stop and report; adapterize instead. | `server-only` preserved. |
| Import-safe helper reaches Prisma, `@/lib/prisma`, `DATABASE_URL`, migrations, or deployed DB setup. | Stop and report; persistence must be injected. | No deployed DB access. |
| Provider helper reaches `openai`, provider credentials, raw `.env`, or ambient provider config. | Stop and report; provider must be injected as disabled/config-missing adapter. | No provider dispatch. |
| Future source change changes response body shape or status rules unexpectedly. | Stop and report unless CONTROL_THREAD explicitly routes a response contract change. | Response parity preserved. |
| Future test output lacks expected non-authorizations or includes positive authority claims. | Stop and report. | Authority boundary preserved. |
| Future implementation requires package, lockfile, schema, migration, runtime config, provider config, deployment config, workflow, GitHub/Linear/target-repo, or README/index changes. | Stop and report. | Out of narrow A40 scope. |
| Future validation needs tests, package scripts, builds, dev servers, browser/e2e, route handlers, or route-export integration tests not explicitly routed. | Stop and report. | No unauthorized execution. |
| Future work implies activation readiness, provider readiness, durable persistence readiness, production readiness, or CONTROL_THREAD acceptance. | Stop and report. | Evidence remains local-only and non-authoritative. |

## 19. Future allowed validation commands

| Command | Future lane use | Boundary |
|---------|-----------------|----------|
| `git diff --check` | Whitespace validation for docs/source/test changes. | Safe local git check. |
| `git diff --cached --check` | Staged whitespace validation before commit. | Safe local git check. |
| Targeted non-authorization scan | Scan changed files plus route/context surfaces for forbidden positive authority claims and risky imports. | Classification required; no mutation. |
| Repo-local docs/reference/static validation script | Run only if an actual docs/static script exists in package scripts. | Not found for A39. |
| `pnpm -C portal lint` | Future source/test implementation validation only if separately routed. | No runtime activation. |
| `pnpm -C portal typecheck` | Future source/test implementation validation only if separately routed. | No runtime activation. |
| `pnpm -C portal exec tsx src/lib/controlPlane/governedRouteDecisionSeam.test.ts` | Candidate focused A40 decision seam test if implemented and routed. | Local-only helper test; no route handler execution. |
| `pnpm -C portal exec tsx src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | A35 seam regression if future implementation reuses A35 helpers. | Local helper/seam test only. |
| `pnpm -C portal exec tsx src/lib/controlPlane/governedRouteExportIntegration.test.ts` | Later route wiring/export integration test only if separately routed. | Local-only; no dev server/browser/e2e/provider/deployed DB. |

## 20. Future forbidden behavior

Future A40 or later lanes must not do any of the following unless CONTROL_THREAD explicitly routes that exact behavior:

- weaken, bypass, alias, or globally mock `server-only`
- import route modules into import-safe decision helpers
- import Next route wiring into decision helpers
- run route handlers or route-export integration tests outside a routed implementation lane
- run package scripts in a design-only lane
- run builds, dev servers, browser/e2e tests, deployed runtime, or production runtime
- run database-backed integration tests, migrations, Prisma Studio, `db push`, or deployed database commands
- call providers/models/APIs, import `openai` in tests, or dispatch live provider requests
- use `gh`, GitHub APIs, Linear commands, target-repo commands, deployment commands, DNS, registrar, renewal/payment, billing, or funding commands
- change package files, lockfiles, schemas, migrations, runtime config, provider config, deployment config, workflows, README/index files, or target-repo files outside explicit authorization
- introduce hidden automation, timers, polling, background jobs, webhooks, cron, automatic route execution, automatic delivery, checklist execution, activation, or authority transfer

## 21. Sufficiency analysis

| Sufficiency question | A39 finding | Classification | Boundary |
|----------------------|-------------|----------------|----------|
| Which route decisions can be extracted? | Validation, body normalization, adapter-result mapping, response-body construction, status selection, and non-authorization copy can be extracted. | `candidate-for-future-implementation` | No source change in A39. |
| Which decisions should remain in route files? | Request parsing, params, `NextResponse`, route exports, runtime/dynamic declarations, and production server-only adapter calls should remain route wiring. | `safe-for-future-design` | Route files stay thin. |
| Which dependencies must be adapterized? | Provider config/connector, passalong persistence, motion intake persistence, deliberation history persistence, and any Prisma-backed result. | `candidate-for-future-implementation` | No provider/deployed DB in helpers. |
| Are A35 helpers reusable? | Yes. They remain the local assertion and seam basis for future implementation. | `safe-for-future-design` | Local-only. |
| Are route-file changes authorized now? | No. A39 only designs future conditional route-file changes. | `route-file-change-blocked` | No route changes in A39. |
| Can A40 be implementation? | Yes, if CONTROL_THREAD explicitly authorizes narrow source/test changes with the candidate files and stop conditions above. | `candidate-for-future-implementation` | No broad activation or runtime. |
| Is another design/review lane still reasonable? | Yes, if CONTROL_THREAD wants file-path/diff granularity before source/test changes. | `requires-additional-review` | No implementation. |
| Does A39 prove route-export integration? | No. A39 is design evidence only. | `out-of-scope` | No route execution. |

## 22. Next necessary decision options

| Option | Route candidate | Purpose | Boundary |
|--------|-----------------|---------|----------|
| 1 | Accept A39 and route A40 extracted route decision seam implementation. | Add import-safe route decision helpers and focused local tests, with conditional minimal route wiring only if explicitly authorized. | Narrow source/test lane; recommended. |
| 2 | Accept A39 and route A40 implementation boundary review before source/test changes. | Review this design and candidate file set before implementation. | Docs/review only. |
| 3 | Accept A39 and route A40 narrower file-path/future-diff design. | Specify exact future source/test diff shape before implementation. | Docs/reference design-only. |
| 4 | Accept A39 and hold further source/test expansion. | Preserve design evidence without implementation. | No further mutation. |
| 5 | Hold A39 pending additional route/source inspection. | Request deeper read-only inspection before choosing A40. | No implementation. |
| 6 | Reject A39 if CONTROL_THREAD finds the seam design insufficient. | Require a replacement design artifact. | No acceptance assumed. |

## 23. Recommendation for CONTROL_THREAD

Accept A39 if CONTROL_THREAD agrees with the classifications, then route:

`A40 Governed Control Plane Extracted Route Decision Seam Implementation v0`

Recommended branch:

`feat/q3m7-governed-control-plane-extracted-route-decision-seam-implementation-v0`

Recommended A40 scope:

- add import-safe route decision helper modules under a new focused control-plane decision folder
- add a focused local decision seam test using A35 helpers/seams
- optionally include minimal route-file wiring only if CONTROL_THREAD explicitly authorizes route-file changes in A40
- keep provider and persistence behind explicit adapters
- preserve response shapes and non-authorizations
- run only separately authorized local validation commands

If CONTROL_THREAD wants one more safety step before source/test changes, route `A40 Governed Control Plane Extracted Route Decision Seam Implementation Boundary Review v0` instead.

Do not route broad activation-readiness planning from A39.

## 24. Non-authorizations preserved

| Non-authorization | Preserved? | Design finding |
|-------------------|------------|----------------|
| No source implementation | Yes | A39 changes only this docs/reference artifact. |
| No test implementation | Yes | No tests are added or modified. |
| No route-file changes | Yes | Route files are inspected only. |
| No package or lockfile changes | Yes | Package files are inspected only. |
| No schema or migration changes | Yes | No schema/migration files or commands are changed or run. |
| No route-handler execution | Yes | A39 does not invoke route exports. |
| No route-export integration testing | Yes | A39 is design-only. |
| No runtime activation | Yes | No dev server, production server, browser/e2e, or build is run. |
| No provider/model/API dispatch | Yes | Provider paths are inspected only. |
| No live provider calls | Yes | No provider call occurs. |
| No deployed database access | Yes | Persistence paths are inspected only. |
| No GitHub API mutation | Yes | No GitHub API or `gh` is used. |
| No Linear mutation | Yes | No Linear command is used. |
| No target-repo mutation/import | Yes | No target repo is touched. |
| No accepted-code import | Yes | No accepted-code import occurs. |
| No deployment / production gates | Yes | No deploy or production action occurs. |
| No source-of-truth transfer | Yes | A39 is non-authoritative design evidence. |
| No public launch / DNS / registrar / renewal / payment / billing / funding | Yes | No asset-provider or financial action occurs. |
| No hidden automation / timers / polling / background jobs | Yes | A39 adds no automation. |
| No automatic route execution / delivery | Yes | No automatic execution or delivery is added. |
| No checklist execution / activation | Yes | No activation behavior occurs. |
| No acceptance / execution / CONTROL_THREAD authority transfer | Yes | CONTROL_THREAD remains authority. |

## 25. Evidence limitations

A39 is design evidence only. It does not prove:

- route-export integration
- route-handler runtime behavior
- extracted seam implementation readiness beyond CONTROL_THREAD review
- direct import compatibility with `server-only`
- provider readiness
- durable persistence readiness
- deployed database behavior
- production readiness
- activation readiness
- operator workflow readiness

## 26. Risks and blockers

No blocker found inside the A39 docs/reference design scope.

Risks:

- Future implementation may reveal that a helper imported through a barrel reaches `server-only` code.
- Future route wiring may require more route-file edits than expected.
- Manual inference extraction may be more complex because provider, participant output, aggregate ratification, and history persistence are currently interleaved.
- Motion kernel imports may need narrower import paths to avoid server-only modules.
- Test-only decision helper evidence will remain weaker than route-export integration evidence until route wiring is separately tested.

Potential future blockers:

- Any implementation proposal that weakens `server-only`, imports server-only modules into import-safe helpers, uses ambient provider credentials, reaches `openai`, accesses deployed DBs, changes package/lock/schema/migration files, mutates GitHub/Linear/target repos, deploys, opens production gates, or transfers authority.

## 27. Validation

A39 validation to complete before final commit/push:

- `git diff --check`
- `git diff --cached --check` after staging only this artifact
- targeted non-authorization scan over this artifact, A38/A37/A36/A35 context, and route/context files

Repo-local docs/reference/static validation script:

- Not found in inspected `package.json` or `portal/package.json` scripts.

A39 does not run tests, package scripts, builds, dev servers, browser/e2e tests, route handlers, route-export integration tests, migrations, Prisma commands, provider/model/API calls, GitHub APIs, `gh`, Linear commands, target-repo commands, or deployment commands.

## 28. Evidence

Repo-local evidence:

- Updated `main` contains A38 squash merge `95cf834`, A37 squash merge `576077d`, A36 squash merge `6c099e4`, and A35 squash merge `b583413`.
- Required A38/A37/A36/A35 files are present.
- The A39 branch was created from updated `origin/main` with no stacked commits or diff before authoring.
- Candidate route exports are present in the four target route files.
- Passalong create/list/detail decision candidates are visible in passalong route files and passalong boundary/persistence helpers.
- Motion intake list/create decision candidates are visible in motion intake route and motion kernel helpers.
- Manual inference decision candidates are visible in manual inference route, provider connector/config, live-model-slot adapter, ratification, and deliberation history helpers.
- `server-only` import context is present in passalong persistence, motion intake persistence, deliberation history, provider connector, and server provider config.
- A35 route harness helpers are import-local and reusable for future route-decision seam tests.
- No docs/static validation script is present in inspected package scripts.

## 29. Non-authorization scan

Targeted scan classification for A39:

- A39 artifact hits are expected design references, non-authorization copy, `server-only` boundary context, evidence limitations, forbidden-behavior descriptions, and future stop conditions.
- A38/A37/A36/A35 context hits are expected non-authorization copy, negative assertions, provider-disabled seam references, persistence-unavailable seam references, `server-only` boundary context, and evidence limitations.
- Route/context hits are pre-existing source context and safe existing behavior, including provider connector `openai` import behind server-side config, `process.env` provider config reads, Prisma persistence paths, `server-only` module guards, UI-local fetch usage outside A39 changes, static forbidden-claim tests, and existing non-authorization copy.

No blocker is introduced by the A39 artifact.

## 30. Authority boundary

A39 is evidence for CONTROL_THREAD review only.

A39 does not accept A38, accept A39, route A40, authorize implementation, authorize tests, authorize route-file changes, authorize route-handler execution, authorize route-export integration testing, authorize runtime activation, authorize provider/model/API dispatch, authorize deployed database access, authorize GitHub/Linear/target-repo mutation, authorize deployment, open production gates, transfer source-of-truth, transfer execution authority, transfer acceptance authority, or transfer CONTROL_THREAD acceptance.

## 31. Repo-lane closeout

Branch:

`docs/q3m7-governed-control-plane-extracted-route-decision-seam-design-v0`

Commit:

To be recorded after final commit.

Files changed:

- `docs/reference/q3m7-governed-control-plane-extracted-route-decision-seam-design-v0.md`

Recommendation:

Accept A39 if CONTROL_THREAD agrees, then route A40 as `A40 Governed Control Plane Extracted Route Decision Seam Implementation v0` with narrow source/test scope, explicit adapter boundaries, response-shape preservation, and hard stop conditions. If CONTROL_THREAD wants another safety step before source/test changes, route A40 implementation boundary review instead.
