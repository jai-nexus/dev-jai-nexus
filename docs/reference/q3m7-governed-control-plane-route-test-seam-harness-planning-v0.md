# Q3M7 Governed Control Plane Route Test Seam / Harness Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

A33 plans a safe local-only route-handler seam / harness for governed control-plane route-boundary testing before broader activation-readiness planning.

A33 is docs/reference planning-only. A33 does not implement source, implement tests, change package files, run tests, run route handlers, run a dev server, activate runtime behavior, activate JAI_control_thread runtime, activate JAI Council, activate JAI Agents, dispatch providers/models/APIs, call live providers, mutate GitHub APIs, mutate Linear, mutate target repos, deploy, open production gates, create a PR, merge, delete branches, or accept itself.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A32 as completed and routed A33 as `Governed Control Plane Route Test Seam / Harness Planning v0`.

A32 GitHub basis supplied by CONTROL_THREAD:

- PR 357 merged.
- Changed file: `docs/reviews/A32_GOVERNED_CONTROL_PLANE_NARROW_ROUTE_BOUNDARY_TEST_REVIEW_V0.md`
- Lane commit: `3ce49cac0c5cce268da5f200d3c1eacd906ff39b`
- Squash merge commit: `945420f7126bf2f9772e89ba01ab7ab98dd9edaf`

## 3. Accepted A31/A32 limitations carried forward

| Limitation | A33 planning consequence |
|------------|--------------------------|
| A31 static route/source assertions are useful narrow evidence. | Preserve A31 as narrow evidence; do not repeat it as broad activation-readiness proof. |
| Direct route-handler execution remains blocked by `server-only` behavior in local `tsx`. | Plan a seam/harness before test implementation. |
| Static assertions do not replace live route-handler execution. | Future tests should exercise request/response outputs safely. |
| Safe local persistence route tests were not implemented. | Plan persistence-unavailable coverage first, and a bounded persistence-available option only if separately routed. |
| Provider-disabled/manual-inference coverage is static only. | Plan provider-disabled and provider-config-missing route execution without live calls. |
| Package `test` script is placeholder-only. | Future implementation lane may need explicit focused command documentation or a separately routed script lane. |

## 4. Files inspected

| Area | Files / paths inspected | A33 use |
|------|-------------------------|---------|
| A32 accepted review | `docs/reviews/A32_GOVERNED_CONTROL_PLANE_NARROW_ROUTE_BOUNDARY_TEST_REVIEW_V0.md` | Required baseline and limitation carry-forward. |
| A31 test evidence | `portal/src/lib/controlPlane/governedRouteBoundary.test.ts` | Existing static boundary coverage. |
| A30 test plan | `docs/reference/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0.md` | Prior target categories and local-only posture. |
| A29 review | `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md` | Prior code/test optimization and route-test gap evidence. |
| Repo package scripts | `package.json`, `portal/package.json` | Script posture and forbidden runtime/migration/provider commands. |
| Passalong collection route | `portal/src/app/operator/control-thread/passalongs/route.ts` | Future request/response harness target. |
| Passalong detail route | `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts` | Future request/response harness target. |
| Manual inference route | `portal/src/app/operator/motion-control/manual-inference/route.ts` | Future mock/provider-disabled harness target. |
| Motion intake route | `portal/src/app/operator/motion-control/motion-intake/route.ts` | Future motion intake and persistence fallback harness target. |
| Thread memory helpers | `portal/src/lib/controlPlane/threadMemory/**` | Passalong validation, persistence, and non-authorization context. |
| Motion kernel helpers | `portal/src/lib/controlPlane/motionKernel/**` | Provider config, provider connector, deliberation history, motion intake, and persistence context. |

## 5. A33 determinations

| Required determination | A33 finding |
|------------------------|-------------|
| What local-only seam/harness is needed? | A harness that can invoke target route handler exports with synthetic `Request` objects while safely controlling `server-only` helper imports, provider config, and persistence dependencies. |
| Is planning sufficient for a later implementation lane? | Yes, A33 defines enough required behaviors, boundaries, and forbidden behavior for CONTROL_THREAD to route a later implementation or seam-design lane. |
| Is direct implementation still premature? | Yes. A33 should not implement source or tests; CONTROL_THREAD should first choose between a module seam, dependency-injection seam, or dedicated harness adapter. |
| Which route behaviors need harness coverage? | Passalong collection/detail, motion intake, manual inference mock/default, provider-disabled, provider-config-missing, persistence-unavailable, and optional bounded persistence-available behavior. |
| Which behaviors remain forbidden? | Runtime activation, dev server, browser/e2e, provider/model/API dispatch, live provider calls, deployed DB access, migrations, GitHub/Linear/target-repo mutation, deployment, production gates, and authority transfer. |

## 6. Seam / harness planning findings

The future harness should be local-only and deterministic. It should not require `next dev`, a browser, a deployed database, provider credentials, GitHub, Linear, or target repo access.

Recommended harness shape for a later routed lane:

1. A route-handler invocation utility that creates synthetic `Request` objects and captures `Response` JSON/status output.
2. A dependency-control seam for persistence helpers so tests can force blocked/unavailable persistence without database access.
3. A provider-control seam that forces provider-disabled and provider-config-missing statuses without reading live secrets or reaching `openai`.
4. Fixture builders for passalong records, motion intake drafts, and manual inference requests with synthetic, non-secret data.
5. Shared assertions for non-authorizations, no authority transfer, no GitHub/Linear/target-repo mutation, no automatic execution, and no deployment/production claims.
6. A network-call guard or explicit module seam that prevents accidental provider/model/API dispatch.

A33 does not choose implementation details permanently. CONTROL_THREAD should decide whether the next lane is:

- test-harness planning refinement
- source seam design
- test implementation using existing source shape
- package script/test discoverability improvement

## 7. Local-only test boundary

Future route tests should remain local unit/route-boundary tests.

Allowed:

- synthetic `Request` and response inspection
- local module imports only if `server-only` behavior is safely handled
- synthetic fixtures
- provider-disabled and config-missing fixture states
- persistence-unavailable fixture states
- optional isolated local persistence adapter only if separately routed
- no-network assertions
- non-authorization response assertions

Forbidden:

- `next dev`, `next start`, browser/e2e, or deployed runtime
- migrations, Prisma Studio, `db push`, deployed DB reads/writes, or production data
- provider/model/API dispatch or live provider calls
- GitHub API, `gh`, Linear, target-repo writes/imports
- deployment, production gates, DNS/registrar/payment/billing/funding actions
- hidden automation, timers, polling, background jobs, automatic route execution, or automatic delivery

## 8. Route behavior coverage plan

| Route / surface | Required future coverage | Boundary |
|-----------------|--------------------------|----------|
| `passalongs/route.ts` `GET` | Persistence-unavailable list response; response includes safe persistence message and non-authorizations. | No DB required. |
| `passalongs/route.ts` `POST` invalid payload | Validation blocks persistence and returns non-authorizations. | No record saved, no route authority. |
| `passalongs/route.ts` `POST` valid payload | Only if a safe adapter is routed; assert non-authoritative response. | No deployed DB, no delivery, no approval. |
| `passalongs/[passalongId]/route.ts` `GET` | Returns 405 and states it does not send, route, execute, or approve passalongs. | No mutation. |
| `passalongs/[passalongId]/route.ts` `PATCH` missing record | Persistence-unavailable or no-record path stays non-authoritative. | No DB required unless safe adapter is routed. |
| `motion-intake/route.ts` `GET` | Persistence-unavailable preview record remains advisory and non-authoritative. | No migration or deployed DB. |
| `motion-intake/route.ts` `POST` missing draft | Returns 400 and states no motion was persisted, routed, approved, or executed. | No persistence write. |
| `motion-intake/route.ts` `POST` valid draft | Only with blocked persistence or safe adapter; response remains advisory. | No routed work or acceptance. |
| `manual-inference/route.ts` `POST` default mode | Mock mode remains default, no provider connector call is made, response remains advisory. | No provider dispatch. |
| `manual-inference/route.ts` `POST` env-gated provider disabled | Connector returns safe mock fallback when provider is disabled. | No live call. |
| `manual-inference/route.ts` `POST` provider config missing | Config-missing path returns advisory blocked/revision posture without secrets. | No live call. |

## 9. Provider-disabled / no-provider strategy

Future tests should make provider behavior impossible to mistake for dispatch.

Required strategy:

- force `JAI_MODEL_SLOT_LIVE_INFERENCE_ENABLED` absent or false for provider-disabled cases
- ensure `JAI_MODEL_SLOT_API_KEY` is absent from fixtures
- assert `mode: "provider_disabled"` or `mode: "provider_config_missing"` as appropriate
- assert provider output remains advisory only
- assert no provider secret persistence, exposure, or storage
- assert no live provider import/call happens in disabled/config-missing cases
- use a seam or guard before any test can exercise `await import("openai")`

The future implementation lane should not rely on the operator machine's ambient environment.

## 10. Mock-default strategy

Manual inference route tests should prove mock mode remains default.

Required strategy:

- omit `mode` or pass a non-provider mode and assert it normalizes to mock behavior
- assert the response carries the mock non-authority disclaimer
- assert participant outputs are advisory and do not claim approval, route authority, execution authority, production gate authority, source-of-truth transfer, or CONTROL_THREAD acceptance
- assert persisted deliberation history is either safely blocked or isolated to a separately routed safe local adapter

Mock-default testing is not runtime activation and not provider dispatch.

## 11. Persistence-unavailable strategy

Persistence-unavailable behavior should be the first safe route execution target.

Required strategy:

- run with no deployed DB dependency
- force or observe blocked persistence paths without applying migrations
- assert blocked/unavailable responses remain non-authoritative
- assert safe advisory messages are visible
- assert no source-of-truth transfer, route authority, acceptance authority, or execution authority is created
- assert no automatic retry, polling, background job, or cleanup job is introduced

Persistence-unavailable evidence is sufficient for local route-boundary behavior only. It is not proof of durable persistence readiness.

## 12. Safe local persistence strategy

Safe local persistence coverage is optional and should not be implemented until CONTROL_THREAD routes it explicitly.

Acceptable options for a later lane:

- a dependency-injected in-memory adapter for passalong and motion persistence
- a test-only repository seam that returns deterministic persisted and blocked results
- an isolated local test database only if schema/setup/cleanup are explicitly routed and no deployed DB is reachable

Required boundaries:

- no production or deployed database
- no migration application unless separately routed
- no production data
- deterministic setup and cleanup
- synthetic records only
- persisted records remain app-local, advisory, non-authoritative metadata

If the seam cannot guarantee those boundaries, CONTROL_THREAD should defer persistence-available tests and route persistence-unavailable coverage first.

## 13. No-secret / no-external-call posture

Future fixtures and harness code must be secret-free.

Required posture:

- no provider keys, production database URLs, GitHub tokens, Linear tokens, customer data, raw `.env` content, private reasoning, target repo source, or production telemetry in fixtures
- no network access required for tests
- explicit failure if a provider/model/API call is attempted
- explicit failure if GitHub, Linear, target repo, DNS, registrar, payment, billing, or deployment access is attempted
- error paths must not echo secrets or connection strings

## 14. No-GitHub / no-Linear / no-target-repo posture

Future route tests must not mutate external workflow systems.

Required posture:

- no `gh` command
- no GitHub API client
- no Linear client or mutation path
- no target-repo filesystem writes or imports
- no PR creation, branch mutation, merge action, or branch deletion authority in responses
- response assertions must preserve manual operator and CONTROL_THREAD authority

## 15. No-runtime / no-deployment / no-production posture

Future route tests must remain local harness tests.

Required posture:

- no dev server
- no browser/e2e
- no runtime activation
- no JAI_control_thread runtime activation
- no Council or Agent activation
- no deployment command
- no production gate flag
- no public launch
- no DNS, registrar, renewal/payment, billing, or funding action
- no checklist execution

## 16. Direct implementation readiness

A33 finds direct implementation is still premature inside A33 itself because A33 is planning-only and because CONTROL_THREAD should decide the seam approach before code/test changes.

However, A33 finds planning is sufficient to route a later implementation lane if CONTROL_THREAD chooses:

- local-only test implementation
- no runtime activation
- no provider/model/API dispatch
- no deployed DB access
- persistence-unavailable coverage first
- optional persistence-available coverage only with a separately bounded adapter decision

## 17. Next necessary decision options

| Option | Fit | Boundary |
|--------|-----|----------|
| Accept A33 and route local route-handler seam implementation | Best fit if CONTROL_THREAD wants executable route-boundary evidence next. | Source/test changes separately authorized; local-only; no runtime/provider/deployed DB. |
| Accept A33 and route seam design refinement | Best fit if CONTROL_THREAD wants dependency approach decided before code/test implementation. | Docs/reference or narrow design artifact only. |
| Accept A33 and route package test discoverability lane | Useful if focused commands should become explicit before more tests. | Package/test script changes separately authorized. |
| Hold A33 | Fit if CONTROL_THREAD wants additional inspection before choosing a seam. | No implementation. |
| Reject A33 | Fit only if the planning boundary is too broad or insufficient. | CONTROL_THREAD retains authority. |

## 18. Recommended next CONTROL_THREAD decision

A33 recommends accepting A33 as a planning artifact and routing a follow-up local-only seam implementation or seam design lane before broad activation-readiness planning.

Suggested next lane:

`A34 Governed Control Plane Local Route-Handler Seam Design v0`

Recommended posture:

- local-only
- source/test changes only if explicitly routed
- no runtime activation
- no dev server
- no browser/e2e
- no provider/model/API dispatch
- no live provider calls
- no deployed database
- no migrations
- no GitHub API mutation
- no Linear mutation
- no target-repo mutation/import
- no deployment
- no production gates
- no authority transfer

## 19. Validation plan for A33 artifact

A33 requires docs/static-safe validation only:

- `git diff --check`
- `git diff --cached --check`
- targeted non-authorization scan over the A33 artifact

No repo-local docs/static validation script was found in inspected package scripts. A33 does not run tests, package scripts, builds, dev servers, browser/e2e tests, migrations, Prisma commands, route handlers, provider/model/API calls, GitHub APIs, Linear commands, or deployment commands.

## 20. Non-authorizations preserved

| Non-authorization | Preserved by A33? |
|-------------------|-------------------|
| No source implementation | Yes |
| No test implementation | Yes |
| No package or lockfile changes | Yes |
| No runtime activation | Yes |
| No JAI_control_thread runtime activation | Yes |
| No JAI Council activation | Yes |
| No JAI Agent activation | Yes |
| No provider/model/API dispatch | Yes |
| No live provider calls | Yes |
| No GitHub API mutation | Yes |
| No Linear mutation | Yes |
| No target-repo mutation/import | Yes |
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

## 21. Repo-lane closeout

Branch:

`docs/q3m7-governed-control-plane-route-test-seam-harness-planning-v0`

Required artifact:

`docs/reference/q3m7-governed-control-plane-route-test-seam-harness-planning-v0.md`

Files changed:

- `docs/reference/q3m7-governed-control-plane-route-test-seam-harness-planning-v0.md`

Recommended PR title draft:

`docs(reference): add A33 route test seam harness planning`

A33 does not create a PR, does not merge, does not delete branches, and does not accept itself.
