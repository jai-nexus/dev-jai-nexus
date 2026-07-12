# Q3M7 Governed Control Plane Local Route-Handler Seam Design v0

## Role

Role: JAI::DEV::BUILDER

## 1. Design scope

A34 designs a local-only route-handler seam / harness for governed control-plane route-boundary testing before implementation.

A34 is docs/reference design-only. A34 does not implement source, implement tests, change package files, run tests, run route handlers, run package scripts, run a dev server, activate runtime behavior, activate JAI_control_thread runtime, activate JAI Council, activate JAI Agents, dispatch providers/models/APIs, call live providers, mutate GitHub APIs, mutate Linear, mutate target repos, deploy, open production gates, create a PR, merge, delete branches, or accept itself.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A33 as completed planning-only evidence and routed A34 as `Governed Control Plane Local Route-Handler Seam Design v0`.

CONTROL_THREAD did not authorize source implementation, test implementation, runtime activation, provider/model/API dispatch, live provider calls, GitHub API mutation, Linear mutation, target-repo mutation/import, deployment, production gates, checklist execution, or authority transfer.

## 3. Accepted A33 baseline

A33 created a docs/reference planning-only artifact for a safe local-only route-handler test seam / harness before broader activation-readiness planning.

A33 GitHub basis supplied by CONTROL_THREAD:

- PR 358 merged.
- Changed file: `docs/reference/q3m7-governed-control-plane-route-test-seam-harness-planning-v0.md`
- Lane commit: `55264ce632964ab54eb44934cac134940129fc3c`
- Squash merge commit: `21ec68ec89517e86454b40d64048765bca0624ae`

A33 findings carried forward:

- A31/A32 limitations are carried forward.
- Static route/source assertions are useful narrow evidence.
- Static assertions do not replace live route-handler execution.
- Safe local persistence route execution remains unproven.
- Provider-disabled and mock-default route execution remain planned, not implemented.
- Broad activation-readiness planning remains premature.
- Activation remains unauthorized.

## 4. Files inspected

| Area | Files / paths inspected | A34 use |
|------|-------------------------|---------|
| A33 planning artifact | `docs/reference/q3m7-governed-control-plane-route-test-seam-harness-planning-v0.md` | Accepted planning baseline and route coverage targets. |
| A32 review artifact | `docs/reviews/A32_GOVERNED_CONTROL_PLANE_NARROW_ROUTE_BOUNDARY_TEST_REVIEW_V0.md` | A31 limitation and follow-up seam need. |
| A31 test evidence | `portal/src/lib/controlPlane/governedRouteBoundary.test.ts` | Existing static source assertion style and coverage. |
| A30 test plan | `docs/reference/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0.md` | Local-only test posture and forbidden behavior. |
| A29 review | `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md` | Prior route-test gap and package validation context. |
| Package scripts | `package.json`, `portal/package.json` | Runtime/build/migration/provider-risk script posture; no docs/static script found. |
| Passalong collection route | `portal/src/app/operator/control-thread/passalongs/route.ts` | Future route-handler harness target. |
| Passalong detail route | `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts` | Future route-handler harness target. |
| Manual inference route | `portal/src/app/operator/motion-control/manual-inference/route.ts` | Future provider-disabled and mock-default harness target. |
| Motion intake route | `portal/src/app/operator/motion-control/motion-intake/route.ts` | Future persistence-unavailable and request/response harness target. |
| Thread memory helpers | `portal/src/lib/controlPlane/threadMemory/**` | Passalong validation and persistence seam context. |
| Motion kernel helpers | `portal/src/lib/controlPlane/motionKernel/**` | Provider, motion intake, deliberation history, and persistence seam context. |

## 5. Files changed

| File | Change type | Boundary |
|------|-------------|----------|
| `docs/reference/q3m7-governed-control-plane-local-route-handler-seam-design-v0.md` | Added A34 design artifact | Docs/reference design-only; not source, test, package, lockfile, schema, migration, runtime config, deployment config, provider, GitHub API, Linear, target-repo, deployment, production, or authority change. |

## 6. Route-handler seam design goals

The later seam should allow local route-handler request/response evidence without activating runtime behavior or external systems.

Design goals:

- invoke route handler exports with synthetic `Request` objects
- capture response status and JSON body deterministically
- make `server-only` import handling explicit
- force provider-disabled and provider-config-missing outcomes without live provider calls
- prove mock-default manual inference behavior
- force persistence-unavailable outcomes without deployed database access
- leave persistence-available testing behind an explicit CONTROL_THREAD decision
- keep fixtures synthetic and secret-free
- make external network calls fail closed
- preserve no GitHub, Linear, target-repo, runtime, deployment, production, activation, checklist, and authority-transfer boundaries

## 7. Local-only harness boundary

The later implementation lane should be local unit / route-boundary testing only.

Allowed if separately routed:

- synthetic `Request` construction
- direct route export invocation
- response status/body assertions
- fixture-only request payloads
- test-only provider and persistence seams
- network-call guard assertions
- non-authorization response assertions

Forbidden:

- `next dev`, `next start`, browser/e2e, or deployed runtime
- migrations, Prisma Studio, `db push`, deployed DB reads/writes, or production data
- provider/model/API dispatch or live provider calls
- GitHub API, `gh`, Linear, target-repo writes/imports
- deployment, production gates, DNS, registrar, renewal/payment, billing, or funding actions
- hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, activation, checklist execution, or authority transfer

## 8. `server-only` limitation handling

Direct local `tsx` route-handler execution remains blocked or unreliable when route imports reach helper modules containing `import "server-only"`.

A34 design preference:

1. Keep route handlers unchanged until a later source/test lane is explicitly routed.
2. Add a future test-only route harness that imports a narrow seam rather than reaching `server-only` modules accidentally.
3. If source changes are needed, route a narrow source seam that extracts route decision logic into testable functions while route files keep Next response wiring.
4. Keep server-only persistence/provider modules behind adapters that future tests can replace with disabled/unavailable fixtures.

A later implementation should not patch around `server-only` by weakening runtime boundaries globally.

## 9. Synthetic Request / Response strategy

Future route tests should use synthetic request objects only.

Required shape:

- `GET` calls may invoke exported `GET()` functions directly when no request object is needed.
- `POST` / `PATCH` calls should use `new Request("http://local.test/...", { method, body, headers })`.
- Dynamic route context for passalong detail should use a synthetic `params: Promise.resolve({ passalongId })` context.
- Response assertions should inspect `response.status` and `await response.json()`.
- Shared helpers should assert `ok`, `error`, `persistence`, `providerStatus`, `connectorStatuses`, `nonAuthorizations`, and advisory fields without claiming approval or execution.

Synthetic request URLs must use local placeholder hosts only and must not trigger network access.

## 10. Provider-disabled and provider-config-missing seam

The future provider seam should prevent live dispatch before route invocation.

Provider-disabled design:

- clear or force `JAI_MODEL_SLOT_LIVE_INFERENCE_ENABLED` to a disabled state
- clear provider/model/credential values
- assert provider status `mode: "provider_disabled"`
- assert mock fallback or advisory response text
- assert no provider key persistence, exposure, or storage

Provider-config-missing design:

- set enabled state without a complete provider/model/credential set only through a test seam or controlled environment wrapper
- assert provider status `mode: "provider_config_missing"`
- assert connector output remains advisory and blocked/revision-oriented
- assert no `await import("openai")` live-call path is reached

The future lane should prefer explicit dependency injection over relying on ambient machine environment.

## 11. Mock-default seam

The manual inference route should remain mock by default.

Future tests should assert:

- omitted or invalid `mode` normalizes to mock
- `model-slot-mock-deliberator` remains the fallback model slot
- mock participant output is returned
- the non-authority disclaimer states no provider connector call was made
- persisted deliberation history is either blocked safely or routed through an explicitly approved local adapter
- response text does not claim approval, route authority, execution authority, production gate authority, source-of-truth transfer, or CONTROL_THREAD acceptance

Mock-default evidence is local route-boundary evidence only. It is not provider readiness or activation readiness.

## 12. Persistence-unavailable seam

Persistence-unavailable behavior should be the first implementation target.

Future seam design should force or observe unavailable persistence for:

- passalong list/create/update paths
- motion intake list/create paths
- manual deliberation history persistence

Required assertions:

- response remains non-authoritative
- safe advisory message is visible
- no record is treated as source-of-truth canon
- no route authority, acceptance authority, execution authority, production gate authority, or source-of-truth transfer is created
- no migration, deployed DB, production DB, retry loop, polling, background job, or cleanup job is introduced

## 13. Optional safe local persistence adapter decision boundary

Persistence-available testing is optional and remains blocked until CONTROL_THREAD explicitly routes it.

Acceptable future options:

- test-only in-memory adapter
- test-only repository interface for passalong and motion persistence
- isolated local test database only if setup, schema, cleanup, and no-deployed-DB guarantees are separately routed

Decision boundary:

- no migration or schema change unless explicitly routed
- no production or deployed database
- no production data
- no ambient `DATABASE_URL` reliance
- deterministic setup and cleanup
- synthetic records only
- persisted records remain app-local, advisory, and non-authoritative

If those conditions cannot be guaranteed, persistence-available coverage should be deferred.

## 14. Secret-free fixture rules

Future fixtures must contain no secrets or sensitive data.

Forbidden fixture content:

- provider API keys
- production database URLs
- GitHub tokens
- Linear tokens
- customer or private data
- raw `.env` content
- private reasoning
- target repo source
- production telemetry
- connection strings

Fixtures should use deterministic local IDs, local placeholder URLs, synthetic motion/passalong content, and explicit non-authorization text.

## 15. No-external-call guarantees

Future implementation should fail closed if external calls are attempted.

Required guarantees:

- provider/model/API imports or calls are blocked unless the specific disabled/config-missing seam proves no live call is reachable
- no `openai` live call path in provider-disabled or config-missing tests
- no network access needed for route tests
- no GitHub, Linear, target repo, DNS, registrar, payment, billing, funding, deployment, or production endpoint access
- no automatic retry, polling, hidden worker, timer, or background job

## 16. No-GitHub / no-Linear / no-target-repo side-effect posture

Future route-handler tests must not use external workflow systems.

Required posture:

- no `gh`
- no GitHub API client
- no Linear client
- no target-repo filesystem writes or imports
- no PR creation, branch mutation, merge action, or branch deletion
- no response claim that a route can mutate GitHub, Linear, or a target repo
- CONTROL_THREAD remains authority

## 17. No-runtime / no-deployment / no-production posture

Future route-handler tests must not activate runtime or production behavior.

Required posture:

- no dev server
- no browser/e2e
- no runtime activation
- no JAI_control_thread runtime activation
- no Council activation
- no Agent activation
- no deployment command
- no production gate
- no public launch
- no DNS, registrar, renewal/payment, billing, or funding action
- no checklist execution

## 18. Future implementation lane candidate files

A34 does not authorize changes to these files. It identifies candidates only if CONTROL_THREAD later routes implementation.

Likely candidate files:

| Candidate file | Candidate purpose | Boundary |
|----------------|-------------------|----------|
| `portal/src/lib/controlPlane/routeHarness/route-response.ts` | Test-only helper for reading response status/body and asserting non-authorizations. | New test helper only if routed. |
| `portal/src/lib/controlPlane/routeHarness/fixtures.ts` | Synthetic request payloads for passalong, motion intake, and manual inference. | Secret-free fixtures only. |
| `portal/src/lib/controlPlane/routeHarness/provider-seam.ts` | Provider-disabled/config-missing test seam. | No live provider calls. |
| `portal/src/lib/controlPlane/routeHarness/persistence-seam.ts` | Persistence-unavailable and optional local adapter seam. | No deployed DB. |
| `portal/src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | Future local route-handler seam test. | Test implementation only if routed. |
| `portal/src/app/operator/control-thread/passalongs/route.ts` | Only if minimal dependency-injection seam is required. | No behavior broadening. |
| `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts` | Only if minimal dependency-injection seam is required. | No behavior broadening. |
| `portal/src/app/operator/motion-control/manual-inference/route.ts` | Only if minimal dependency-injection seam is required. | No provider dispatch. |
| `portal/src/app/operator/motion-control/motion-intake/route.ts` | Only if minimal dependency-injection seam is required. | No persistence broadening. |

Package file changes remain out of scope unless CONTROL_THREAD separately routes test discoverability.

## 19. Future implementation forbidden behavior

A later implementation lane must still not:

- run runtime, dev server, browser/e2e, deployment, production, migration, Prisma Studio, or deployed DB behavior
- dispatch providers/models/APIs or call live providers
- read real provider keys or raw `.env` files
- mutate GitHub, Linear, or target repos
- create PRs, merge, delete branches, or open production gates
- add hidden automation, timers, polling, background jobs, automatic route execution, or automatic delivery
- treat route responses, persisted records, mock inference, provider fallback, or fixture evidence as CONTROL_THREAD acceptance
- claim broad activation-readiness or activation

## 20. Sufficiency analysis

A34 design is enough for CONTROL_THREAD to route a later implementation lane if CONTROL_THREAD accepts:

- route-handler invocation through synthetic requests
- explicit server-only handling
- provider-disabled/config-missing seams
- mock-default assertions
- persistence-unavailable coverage first
- optional persistence-available coverage only by separate decision
- secret-free fixtures and no external calls

Additional planning is optional, not required, unless CONTROL_THREAD wants to choose exact source file names before allowing implementation.

Source/test implementation remains blocked until A35 or later because A34 is design-only.

## 21. Next necessary decision options

| Option | Fit | Boundary |
|--------|-----|----------|
| Accept A34 and route A35 local route-handler seam implementation | Best fit if CONTROL_THREAD wants executable local route-boundary evidence next. | Source/test changes separately authorized; local-only. |
| Accept A34 and route A35 narrower seam-file design | Fit if CONTROL_THREAD wants exact candidate file paths finalized before implementation. | Docs/reference only. |
| Accept A34 and route package test discoverability | Fit if focused route tests should become package-script discoverable. | Package changes separately authorized. |
| Hold A34 | Fit if more inspection is desired before source/test implementation. | No implementation. |
| Reject A34 | Fit only if design is too broad or insufficient. | CONTROL_THREAD retains authority. |

## 22. Recommendation for CONTROL_THREAD

A34 recommends accepting A34 as design-only evidence and routing `A35 Governed Control Plane Local Route-Handler Seam Implementation v0` only if CONTROL_THREAD is ready to authorize narrow source/test changes.

Recommended A35 posture:

- local-only source/test implementation
- route-handler seam only
- persistence-unavailable coverage first
- provider-disabled/config-missing coverage without live calls
- mock-default coverage
- no runtime activation
- no deployed DB
- no migrations
- no provider/model/API dispatch
- no GitHub API mutation
- no Linear mutation
- no target-repo mutation/import
- no deployment
- no production gates
- no authority transfer

## 23. Non-authorizations preserved

| Non-authorization | Preserved by A34? |
|-------------------|-------------------|
| No source implementation | Yes |
| No test implementation | Yes |
| No package or lockfile changes | Yes |
| No schema or migration changes | Yes |
| No runtime config or deployment config changes | Yes |
| No runtime activation | Yes |
| No JAI_control_thread runtime activation | Yes |
| No JAI Council activation | Yes |
| No JAI Agent activation | Yes |
| No provider/model/API dispatch | Yes |
| No live provider calls | Yes |
| No GitHub API mutation | Yes |
| No Linear mutation | Yes |
| No target-repo mutation/import | Yes |
| No accepted-code import | Yes |
| No deployment | Yes |
| No production gates | Yes |
| No source-of-truth transfer | Yes |
| No public launch | Yes |
| No DNS/registrar/renewal/payment/billing/funding actions | Yes |
| No hidden automation | Yes |
| No automatic route execution | Yes |
| No automatic delivery | Yes |
| No activation | Yes |
| No checklist execution | Yes |
| No authority transfer | Yes |

## 24. Evidence limitations

- A34 does not execute route handlers.
- A34 does not prove request/response runtime behavior.
- A34 does not prove persistence-available behavior.
- A34 does not prove provider-disabled/config-missing route execution behavior.
- A34 does not implement a seam, harness, fixtures, source changes, tests, or package scripts.
- A34 does not authorize broad activation-readiness planning or activation.

## 25. Risks and blockers

No A34 blocker was found within docs/reference design-only scope.

Remaining risks:

- Future implementation could accidentally rely on ambient environment unless provider/persistence seams are explicit.
- Future persistence-available tests could touch a deployed DB unless blocked by design.
- Future provider tests could reach `openai` if provider-configured path is not guarded.
- `portal` package `test` script remains placeholder-only.
- Direct route-handler testing remains unimplemented until A35 or later.

## 26. Validation

A34 validation is docs/static-safe only.

Required validation:

- `git diff --check`
- `git diff --cached --check`
- targeted non-authorization scan over the A34 artifact

No repo-local docs/static validation script was found in inspected package scripts. A34 does not run tests, package scripts, builds, dev servers, browser/e2e tests, migrations, Prisma commands, route handlers, provider/model/API calls, GitHub APIs, Linear commands, or deployment commands.

## 27. Non-authorization scan

A34 artifact includes explicit preservation of:

- no source implementation
- no test implementation
- no runtime activation
- no JAI_control_thread runtime activation
- no Council or Agent activation
- no provider/model/API dispatch
- no live provider calls
- no GitHub API mutation
- no Linear mutation
- no target-repo mutation/import
- no accepted-code import
- no deployment
- no production gates
- no source-of-truth transfer
- no public launch
- no DNS/registrar/renewal/payment/billing/funding actions
- no hidden automation
- no automatic route execution
- no automatic delivery
- no activation
- no checklist execution
- no authority transfer

## 28. Authority boundary

A34 is non-authoritative design evidence for CONTROL_THREAD review.

A34 does not accept itself, does not accept A33, does not route A35, does not authorize implementation, and does not transfer CONTROL_THREAD acceptance or execution authority.

CONTROL_THREAD remains review, accept, hold, reject, route, and acceptance authority.

## 29. Repo-lane closeout

Branch:

`docs/q3m7-governed-control-plane-local-route-handler-seam-design-v0`

Required artifact:

`docs/reference/q3m7-governed-control-plane-local-route-handler-seam-design-v0.md`

Files changed:

- `docs/reference/q3m7-governed-control-plane-local-route-handler-seam-design-v0.md`

Recommended PR title draft:

`docs(reference): add A34 local route handler seam design`

A34 does not create a PR, does not merge, does not delete branches, and does not accept itself.
