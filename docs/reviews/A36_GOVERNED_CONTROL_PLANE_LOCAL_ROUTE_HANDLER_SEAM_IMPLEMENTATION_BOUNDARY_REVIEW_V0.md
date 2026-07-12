# A36 Governed Control Plane Local Route-Handler Seam Implementation Boundary Review v0

## Role

Role: JAI::DEV::BUILDER

## 1. Review scope

A36 reviews the accepted A35 local route-handler seam / harness implementation before any route-export integration testing lane.

A36 is docs/reviews review-only. It does not modify source, tests, route files, package files, lockfiles, schemas, migrations, runtime config, deployment config, provider config, GitHub workflow files, Linear integration files, target-repo files, or README/index files.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A35 as completed narrow source/test implementation evidence and routed A36 as a review-only implementation boundary review.

A36 evaluates whether A35 is sufficient as local helper/test-only seam evidence, whether it remains insufficient for broad activation-readiness planning, and whether a future local route-export integration lane is safe to route.

## 3. A35 GitHub basis reviewed

| Artifact / source | Verification posture | Role in A36 | Boundary |
|-------------------|----------------------|-------------|----------|
| PR 360 | CONTROL_THREAD-supplied merged PR basis; repo-local `main` contains the A35 squash commit. | Establish accepted A35 implementation baseline. | Evidence only; A36 does not use GitHub APIs or create a PR. |
| Lane commit `81bde9358b0988cd658179d4fbd83e9571cba265` | CONTROL_THREAD-supplied lane commit. | Confirms intended A35 source/test work. | Not re-accepted by A36. |
| Squash merge `b58341300ddddb3ece954e21b7f1304f1d60505b` | Present in local `git log` on updated `main`. | Current repo-local basis for review. | Does not authorize further implementation. |
| A35 changed-file set | Five helper/test files present on `main`. | Primary review target. | Helper/test seam evidence only. |

## 4. Accepted A35 baseline

A35 added a local-only route-handler harness foundation:

- route response helpers
- synthetic request fixtures
- provider-disabled and provider-config-missing seams
- persistence-unavailable seams
- focused local boundary test

A35 did not change route files, package files, lockfiles, schemas, migrations, runtime config, deployment config, provider config, GitHub workflow files, Linear integration files, target-repo files, or README/index files.

## 5. Files inspected

| Area | Files / paths inspected | Notes |
|------|-------------------------|-------|
| A35 focused test | `portal/src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | Reviewed test coverage, imports, and local-only execution posture. |
| A35 route response helper | `portal/src/lib/controlPlane/routeHarness/route-response.ts` | Reviewed response reading, JSON helper, and forbidden authority claim assertions. |
| A35 fixtures | `portal/src/lib/controlPlane/routeHarness/fixtures.ts` | Reviewed synthetic payloads, request builder, and secret-free fixture guard. |
| A35 provider seam | `portal/src/lib/controlPlane/routeHarness/provider-seam.ts` | Reviewed disabled/config-missing seam and no-dispatch assertions. |
| A35 persistence seam | `portal/src/lib/controlPlane/routeHarness/persistence-seam.ts` | Reviewed unavailable/blocked persistence seam outputs. |
| A34/A33 context | `docs/reference/q3m7-governed-control-plane-local-route-handler-seam-design-v0.md`, `docs/reference/q3m7-governed-control-plane-route-test-seam-harness-planning-v0.md` | Reviewed intended seam design and planned future route coverage. |
| A32/A30/A29 context | `docs/reviews/A32_GOVERNED_CONTROL_PLANE_NARROW_ROUTE_BOUNDARY_TEST_REVIEW_V0.md`, `docs/reference/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0.md`, `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md` | Reviewed prior limitations and activation-readiness separation. |
| Existing static route boundary test | `portal/src/lib/controlPlane/governedRouteBoundary.test.ts` | Reviewed prior source-text assertion posture. |
| Package scripts | `portal/package.json` | Reviewed validation and forbidden runtime/migration/provider scripts. |
| Route files | `portal/src/app/operator/control-thread/passalongs/route.ts`, `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`, `portal/src/app/operator/motion-control/manual-inference/route.ts`, `portal/src/app/operator/motion-control/motion-intake/route.ts` | Awareness-only review of route-export integration targets. |
| Context helpers | `portal/src/lib/controlPlane/threadMemory/**`, `portal/src/lib/controlPlane/motionKernel/**` | Awareness-only review of persistence/provider `server-only` context. |

## 6. Files changed

| File | Change type | Boundary |
|------|-------------|----------|
| `docs/reviews/A36_GOVERNED_CONTROL_PLANE_LOCAL_ROUTE_HANDLER_SEAM_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md` | Added A36 review artifact. | Docs/reviews only; no source, test, route, package, lockfile, schema, migration, runtime, provider, deployment, GitHub API, Linear, target-repo, production, or authority change. |

## 7. A35 changed-file set review

| File | A35 purpose | A36 finding | Classification |
|------|-------------|-------------|----------------|
| `portal/src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | Focused local seam test. | Exercises helper/fixture/provider/persistence seams and asserts non-authorization posture, but does not import or execute production route handlers. | `sufficient-with-limitation` |
| `portal/src/lib/controlPlane/routeHarness/route-response.ts` | Response snapshot and assertion helper. | Local helper only; no external calls or runtime activation. | `sufficient-for-local-seam-evidence` |
| `portal/src/lib/controlPlane/routeHarness/fixtures.ts` | Synthetic request payloads and secret-free fixture guard. | Fixtures are deterministic, local, and non-secret by construction. | `sufficient-for-local-seam-evidence` |
| `portal/src/lib/controlPlane/routeHarness/provider-seam.ts` | Provider disabled/config-missing seam. | Models safe provider statuses without importing or dispatching a provider connector. | `sufficient-for-local-seam-evidence` |
| `portal/src/lib/controlPlane/routeHarness/persistence-seam.ts` | Persistence unavailable/blocked seam. | Models safe unavailable persistence without deployed database access. | `sufficient-for-local-seam-evidence` |

## 8. Route response helper findings

| Review item | Finding | Classification | Boundary |
|-------------|---------|----------------|----------|
| JSON response reading | Reads only response status and JSON body from supplied `Response` objects. | `sufficient-for-local-seam-evidence` | Does not run route handlers or network calls. |
| Synthetic JSON response creation | Builds local `Response` objects with JSON content type. | `sufficient-for-local-seam-evidence` | Does not imply production route behavior. |
| Non-authorization assertion | Requires `nonAuthorizations` and checks forbidden positive authority claims. | `sufficient-with-limitation` | Useful local guard; does not prove every production response includes the same field. |
| Forbidden claim scan | Flattens values and rejects positive authority phrases. | `sufficient-for-local-seam-evidence` | Negative assertion only. |

## 9. Synthetic fixture findings

| Review item | Finding | Classification | Boundary |
|-------------|---------|----------------|----------|
| Passalong fixture | Uses deterministic synthetic passalong metadata with explicit CONTROL_THREAD-review posture. | `sufficient-for-local-seam-evidence` | No real passalong delivery, route execution, or approval. |
| Motion intake fixture | Uses synthetic draft metadata and explicit no-provider/no-persistence/no-mutation constraints. | `sufficient-for-local-seam-evidence` | No routed work or durable persistence proof. |
| Manual inference fixtures | Covers mock default, provider-disabled, and provider-config-missing shapes. | `sufficient-with-limitation` | Does not execute production manual inference route. |
| Request builder | Uses `http://local.test` synthetic URLs. | `sufficient-for-local-seam-evidence` | Local request object construction only; no network access implied. |
| Secret-free guard | Scans fixtures for obvious secret markers and production-data markers. | `sufficient-with-limitation` | Helpful guard, not a substitute for broader secret scanning. |

## 10. Provider-disabled / provider-config-missing seam findings

| Review item | Finding | Classification | Boundary |
|-------------|---------|----------------|----------|
| Provider disabled seam | Returns `liveInferenceEnabled: false`, `providerConfigured: false`, `providerKeyPresent: false`, no dispatch, no network requirement. | `sufficient-for-local-seam-evidence` | Safe provider-disabled model only. |
| Provider config missing seam | Returns enabled-but-unconfigured status with no dispatch and no network requirement. | `sufficient-for-local-seam-evidence` | Safe config-missing model only. |
| Provider import posture | A35 seam does not import `openai` or call `runSecureProviderDeliberationConnector`. | `sufficient-for-local-seam-evidence` | Does not prove production connector readiness. |
| No-dispatch assertion | Fails if dispatch/network/config/key flags appear. | `sufficient-for-local-seam-evidence` | Local seam assertion only. |

## 11. Persistence-unavailable seam findings

| Review item | Finding | Classification | Boundary |
|-------------|---------|----------------|----------|
| Passalong list/write unavailable seams | Return unavailable persistence, null/no records, and safe messages. | `sufficient-for-local-seam-evidence` | No deployed database access. |
| Motion intake unavailable seam | Returns non-authoritative advisory preview with blocked persistence. | `sufficient-for-local-seam-evidence` | Does not prove durable persistence. |
| Deliberation history unavailable seam | Returns blocked/staged persistence posture and `persisted: false`. | `sufficient-for-local-seam-evidence` | Does not prove provider or history persistence readiness. |
| Persistence assertion | Requires unavailable/blocked persistence shape. | `sufficient-for-local-seam-evidence` | Negative/local seam evidence only. |

## 12. Focused boundary test coverage findings

| Coverage item | A35 evidence | A36 finding | Classification |
|---------------|--------------|-------------|----------------|
| Synthetic request fixtures | Test asserts fixture secrecy, `POST` method, `local.test` host, and JSON payload round-trip. | Useful local fixture evidence. | `sufficient-for-local-seam-evidence` |
| Route response helper | Test asserts status `400`, non-authorizations, and no external mutation authority. | Useful local response-helper evidence. | `sufficient-for-local-seam-evidence` |
| Provider seams | Test asserts disabled/config-missing modes, no dispatch, no network, no config/key. | Useful local provider seam evidence. | `sufficient-for-local-seam-evidence` |
| Persistence seams | Test asserts unavailable/blocked results for passalong, motion intake, and deliberation history. | Useful local persistence seam evidence. | `sufficient-for-local-seam-evidence` |
| Production route-handler execution | Test does not import or invoke route exports. | Correct for A35 scope but still a limitation. | `insufficient-for-route-export-integration` |

## 13. Route-file change findings

| Route-file question | A36 finding | Classification | Boundary |
|---------------------|-------------|----------------|----------|
| Did A35 change route files? | No route-file changes were found in the A35 changed-file set. | `sufficient-for-local-seam-evidence` | Route behavior unchanged. |
| Were route-file changes required for A35? | No. Helper/test-only seam evidence was achievable without route changes. | `sufficient-for-local-seam-evidence` | Keeps runtime boundary intact. |
| Should route-file seam changes be broadly opened next? | No. Any route-export integration lane should keep route-file changes blocked unless a separately routed minimal seam proves necessary. | `safe-to-route-next-local-integration-review` | Conditional-only route-file posture. |
| Is actual route-export integration proven? | No. A35 does not invoke exported `GET`, `POST`, or `PATCH` handlers. | `insufficient-for-route-export-integration` | Needs future local-only lane. |

## 14. Package / lockfile / schema / migration findings

| Review item | A36 finding | Classification | Boundary |
|-------------|-------------|----------------|----------|
| Package files | A35 did not change `package.json` or related package metadata. | `sufficient-for-local-seam-evidence` | No package script or dependency change. |
| Lockfiles | No lockfile changes in A35. | `sufficient-for-local-seam-evidence` | No dependency graph mutation. |
| Schemas | No schema changes in A35. | `sufficient-for-local-seam-evidence` | No data model mutation. |
| Migrations | No migration changes or migration commands in A35. | `sufficient-for-local-seam-evidence` | No database migration. |

## 15. Runtime / provider / deployment / production findings

| Review item | A36 finding | Classification | Boundary |
|-------------|-------------|----------------|----------|
| Runtime activation | A35 was helper/test-only and did not start a dev server or production runtime. | `sufficient-for-local-seam-evidence` | No runtime activation. |
| Provider/model/API dispatch | A35 provider seam models no-dispatch states and does not call providers/models/APIs. | `sufficient-for-local-seam-evidence` | No live provider readiness proof. |
| Deployed database access | A35 persistence seam models unavailable persistence without DB access. | `sufficient-for-local-seam-evidence` | No durable persistence readiness proof. |
| Deployment / production | A35 did not change deployment config or open production gates. | `sufficient-for-local-seam-evidence` | No public launch or production action. |

## 16. Non-authorization assertion findings

| Assertion category | A35 evidence | A36 finding | Classification |
|--------------------|--------------|-------------|----------------|
| CONTROL_THREAD authority | Fixtures and non-authorization arrays preserve CONTROL_THREAD/human approval posture. | Useful and bounded. | `sufficient-for-local-seam-evidence` |
| No external mutation | Response helper rejects positive mutation/authority claims. | Useful negative assertion. | `sufficient-for-local-seam-evidence` |
| No provider dispatch | Provider seam returns dispatch/network false and no config/key. | Useful local provider guard. | `sufficient-for-local-seam-evidence` |
| No deployed persistence | Persistence seam returns unavailable/blocked states. | Useful local persistence guard. | `sufficient-for-local-seam-evidence` |
| No route execution/delivery | Fixtures include no automatic route execution/delivery posture. | Useful local guard, not production route proof. | `sufficient-with-limitation` |

## 17. Validation evidence findings

| Validation evidence | Accepted result | A36 finding | Classification |
|---------------------|-----------------|-------------|----------------|
| `pnpm -C portal lint` | Passed through `corepack pnpm -C portal lint`. | Safe validation completed with no source/test/package changes. | `sufficient-for-local-seam-evidence` |
| `pnpm -C portal typecheck` | Passed through `corepack pnpm -C portal typecheck`. | Safe validation completed with no source/test/package changes. | `sufficient-for-local-seam-evidence` |
| `pnpm -C portal exec tsx src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | Passed through `corepack pnpm -C portal exec tsx src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` after local `tsx` IPC permission; the first sandboxed run failed before test execution with `listen EPERM` on a local pipe. | Existing A35 focused seam test remains valid local evidence. | `sufficient-for-local-seam-evidence` |
| `git diff --check` | Passed after final pre-push update and A36 artifact validation update. | Whitespace validation passed. | `sufficient-for-local-seam-evidence` |
| `git diff --cached --check` | Required staged whitespace validation before commit. | Staging is limited to the A36 artifact; result is recorded in repo-lane closeout. | `sufficient-with-limitation` |
| Targeted non-authorization scan | Completed after final pre-push update and A36 artifact validation update. | Hits classified as negative assertions, non-authorization copy, safe test fixtures, pre-existing source context, provider-disabled seam, persistence-unavailable seam, and evidence limitations; no blocker found in the A36 artifact. | `sufficient-with-limitation` |

## 18. Sufficiency analysis

| Sufficiency question | A36 finding | Classification | Boundary |
|----------------------|-------------|----------------|----------|
| Is A35 sufficient as local helper/test-only seam evidence? | Yes. A35 provides a coherent local helper/test-only seam foundation. | `sufficient-for-local-seam-evidence` | Helper/test seam only. |
| Is A35 sufficient for broad activation-readiness planning? | No. It does not prove actual route exports, deployed runtime, providers, durable persistence, or operator workflow readiness. | `insufficient-for-broad-activation-readiness` | Do not route broad activation-readiness planning from A35 alone. |
| Is A35 safe enough to support a future local route-export integration lane? | Yes, if the next lane remains local-only and keeps route-file changes blocked or conditional. | `safe-to-route-next-local-integration-review` | Future lane must be separately routed. |
| Do route-file changes need to open now? | No. They should remain blocked unless a future lane proves a minimal injection/export seam is necessary. | `safe-to-route-next-local-integration-review` | Conditional-only. |
| Does A36 find a blocker? | No blocker found in A35 helper/test-only scope. | `sufficient-with-limitation` | Limitations remain. |

## 19. Next lane readiness analysis

| Candidate next lane | Evidence basis | Readiness classification | Boundary |
|---------------------|----------------|--------------------------|----------|
| A37 local route-handler export integration planning | A35 helper/test-only seam and A36 limitations. | `safe-to-route-next-local-integration-review` | Docs/reference planning-only. |
| A37 local route-handler export integration implementation | A35 helpers could support synthetic route-export tests, but exact `server-only` and route import boundary remains important. | `safe-to-route-next-local-integration-implementation` with limitation | Source/test changes only if separately routed; route-file changes blocked or conditional. |
| Broad activation-readiness planning | A35 does not prove route exports, runtime, provider readiness, durable persistence, or deployed behavior. | `insufficient-for-broad-activation-readiness` | Do not route from A35/A36 alone. |
| Route-file seam implementation | No current need proved by A35. | `follow-up-review-needed` | Separately routed only if route export integration cannot proceed without it. |

## 20. Next necessary decision options

| Option | Route candidate | Purpose | Boundary |
|--------|-----------------|---------|----------|
| 1 | Accept A36 and route A37 local route-handler export integration planning. | Clarify exact route-export import boundaries before source/test expansion. | Docs/reference planning-only; no source/test changes. |
| 2 | Accept A36 and route A37 local route-handler export integration implementation if CONTROL_THREAD decides boundaries are clear enough. | Add `portal/src/lib/controlPlane/governedRouteExportIntegration.test.ts` or equivalent focused local route-export test. | Local-only, no runtime, route-file changes blocked/conditional. |
| 3 | Accept A36 and hold further source/test expansion. | Preserve A35 as helper/test seam evidence without moving into route exports. | No further mutation. |
| 4 | Hold A36 pending additional A35 evidence. | Request more evidence if CONTROL_THREAD wants more detail before accepting A36. | No route expansion. |
| 5 | Reject A36 if CONTROL_THREAD finds this review insufficient. | Require a replacement review artifact. | No acceptance assumed. |

## 21. Recommendation for CONTROL_THREAD

Accept A36 if CONTROL_THREAD agrees that A35 is sufficient helper/test-only local seam evidence with clear limitations.

Recommended next route: A37 local route-handler export integration planning unless CONTROL_THREAD considers route-export import and `server-only` boundaries sufficiently clear for direct implementation. Do not recommend broad activation-readiness planning.

If implementation is selected, recommended candidate:

- Route: `A37 Governed Control Plane Local Route-Handler Export Integration Test v0`
- Branch: `test/q3m7-governed-control-plane-local-route-handler-export-integration-test-v0`
- Candidate test: `portal/src/lib/controlPlane/governedRouteExportIntegration.test.ts`
- Posture: local-only, route-export integration test only, no runtime activation, no dev server, no browser/e2e, no provider/model/API dispatch, no deployed database, no migrations, no GitHub API mutation, no Linear mutation, no target-repo mutation/import, no deployment, no production gates, no authority transfer.

If planning is selected, recommended candidate:

- Route: `A37 Governed Control Plane Local Route-Handler Export Integration Planning v0`
- Posture: docs/reference planning-only, no source/test changes, no runtime activation, no provider/model/API dispatch, no external side effects, no authority transfer.

## 22. Non-authorizations preserved

| Non-authorization | Preserved? | Review finding |
|-------------------|------------|----------------|
| No source implementation | Yes | A36 changes only this docs/reviews artifact. |
| No test implementation | Yes | A36 does not modify A35 or add tests. |
| No route-file changes | Yes | A36 does not modify route files. |
| No package or lockfile changes | Yes | A36 does not modify dependency metadata. |
| No schema or migration changes | Yes | A36 does not modify schema/migration files or run migration commands. |
| No runtime activation | Yes | A36 does not run a dev server or production runtime. |
| No JAI_control_thread runtime activation | Yes | No runtime is activated. |
| No JAI Council activation | Yes | No Council behavior is activated. |
| No JAI Agent activation | Yes | No Agent behavior is activated. |
| No provider/model/API dispatch | Yes | A36 does not dispatch providers/models/APIs. |
| No live provider calls | Yes | A36 does not call live providers. |
| No deployed database access | Yes | A36 does not access deployed databases. |
| No GitHub API mutation | Yes | A36 does not use GitHub APIs or `gh`. |
| No Linear mutation | Yes | A36 does not use Linear. |
| No target-repo mutation/import | Yes | A36 touches no target repo. |
| No accepted-code import | Yes | No accepted-code import occurred. |
| No deployment | Yes | A36 does not deploy. |
| No production gates | Yes | A36 opens no production gate. |
| No source-of-truth transfer | Yes | Review evidence remains non-authoritative. |
| No public launch | Yes | No launch action occurred. |
| No DNS / registrar / renewal / payment / billing / funding actions | Yes | No asset-provider or financial action occurred. |
| No hidden automation / timers / polling / background jobs | Yes | A36 adds no automation. |
| No automatic route execution or delivery | Yes | A36 adds no route execution/delivery. |
| No checklist execution | Yes | No checklist execution occurred. |
| No acceptance / execution / CONTROL_THREAD authority transfer | Yes | CONTROL_THREAD remains authority. |

## 23. Evidence limitations

A35 is helper/test seam evidence only. It does not prove:

- actual route-export integration
- Next route-handler runtime behavior
- provider readiness
- live provider safety in a configured environment
- durable persistence readiness
- deployed database behavior
- production readiness
- broad activation readiness
- operator workflow readiness

## 24. Risks and blockers

No blocker found in A36 scope.

Remaining risks:

- A35 does not execute production route exports.
- Future route-export integration may encounter `server-only` import boundaries.
- Provider connector source still contains real provider dispatch code behind server-side config; A35 correctly does not reach it.
- Persistence helpers still contain real DB paths when persistence is available; A35 correctly models unavailable/blocked seams only.
- Package `test` remains placeholder-only; focused tests still rely on explicit `pnpm -C portal exec tsx ...` commands.

## 25. Validation

Required validation recorded after the final pre-push update:

- `corepack pnpm -C portal lint`: passed.
- `corepack pnpm -C portal typecheck`: passed.
- `corepack pnpm -C portal exec tsx src/lib/controlPlane/governedRouteHandlerBoundary.test.ts`: passed after local `tsx` IPC permission; initial sandboxed run failed before test execution with `listen EPERM`, and the final focused run passed.
- `git diff --check`: passed.
- Targeted non-authorization scan: completed and classified; no blocker found in the A36 artifact.
- Repo-local docs/review/static validation script: not found in inspected package scripts.

Final staged `git diff --cached --check` is required after staging only this A36 artifact.

## 26. Evidence

Repo-local evidence reviewed:

- `git log --oneline -n 8` showed A35 squash merge `b583413` on `main`.
- A35 files were present on updated `main`.
- A35 changed-file set contained only the five expected helper/test files.
- A35 focused test imports only local harness helpers and does not import route files.
- A35 provider seam contains no provider connector import and no `openai` import.
- A35 persistence seam contains no Prisma, database URL, migration, or deployed DB access.

## 27. Non-authorization scan

Targeted scan completed over the A36 artifact, A35 changed files, and route/context surfaces.

Classifications:

- A36 artifact hits: non-authorization copy, evidence limitations, and negative assertions.
- A35 route harness hits: safe test fixture, provider-disabled seam, persistence-unavailable seam, and negative assertions.
- Route/context hits: pre-existing source context and safe existing behavior, including UI-local `fetch` calls, provider connector `openai` import behind server-side config, `process.env` provider config reads, Prisma persistence paths, and existing non-authorization copy.
- Broader control-plane hits from the suggested scan: pre-existing source context, safe existing tests, and non-authorization copy.

No blocker found in the A36 artifact. Pre-existing provider and persistence source paths remain limitations, not A36 changes.

## 28. Authority boundary

A36 is evidence for CONTROL_THREAD review only.

A36 does not accept A35, accept A36, route A37, approve implementation, authorize source/test expansion, authorize runtime activation, authorize provider/model/API dispatch, authorize GitHub/Linear/target-repo mutation, authorize deployment, open production gates, transfer source-of-truth, transfer execution authority, transfer acceptance authority, or transfer CONTROL_THREAD acceptance.

## 29. Repo-lane closeout

Branch:

`review/q3m7-governed-control-plane-local-route-handler-seam-implementation-boundary-review-v0`

Commit:

To be recorded after final commit.

Files changed:

- `docs/reviews/A36_GOVERNED_CONTROL_PLANE_LOCAL_ROUTE_HANDLER_SEAM_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md`

Recommendation:

Accept A36 if CONTROL_THREAD agrees, then route A37 local route-handler export integration planning or a separately bounded local route-export integration implementation lane. Do not route broad activation-readiness planning from A35/A36 alone.
