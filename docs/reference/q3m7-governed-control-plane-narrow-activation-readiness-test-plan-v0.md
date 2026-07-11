# Q3M7 Governed Control Plane Narrow Activation-Readiness Test Plan v0

## Role

Role: JAI::DEV::BUILDER

## 1. Test plan scope

A30 plans a narrow local-only route-boundary test plan using A29 code/test/optimization evidence.

A30 is test-plan-only. A30 does not implement tests, change source, change existing tests, run activation behavior, route broad activation-readiness planning, or recommend activation.

A30 plans future local-only tests for operator persistence route boundaries, provider-gated / manual inference route boundaries, motion intake route boundaries, passalong persistence route boundaries, route response posture, provider-disabled cases, mock-default behavior, persistence-unavailable behavior, safe local persistence behavior, non-authority response fields, and ZERO GATES preservation.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A29 as completed and routed A30 as `Governed Control Plane Narrow Activation-Readiness Test Plan v0`.

CONTROL_THREAD did not authorize implementation, source changes, test changes, runtime activation, JAI_control_thread runtime activation, JAI Council activation, JAI Agent activation, provider/model/API dispatch, live provider calls, GitHub mutation, GitHub API mutation, Linear mutation, target-repo mutation/import, accepted-code import, deployment, production gates, source-of-truth transfer, public launch, DNS change, registrar action, renewal/payment action, billing action, funding commitment, hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, activation, checklist execution, acceptance authority transfer, execution authority transfer, CONTROL_THREAD acceptance transfer, or broad activation-readiness planning.

## 3. Accepted A29 evidence baseline

A29 completed a governed control-plane code, test, validation, and optimization review before any company-ready closeout handoff or activation-readiness route.

A29 GitHub verification recorded PR 354, lane commit `b43279602184a3d36ab9a815da9ce749bfee021f`, squash merge commit `3f8ee35b16adade0432cb135ce3be677a3fa9fbc`, and changed file `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md`.

A29 accepted validation evidence:

- `pnpm -C portal lint`: passed
- `pnpm -C portal typecheck`: passed
- focused company asset/domain registry test: passed
- focused JAI_control_thread motion proposal test: passed
- focused Work/Waves taxonomy test: passed
- focused sandbox receipt return display test: passed
- focused sandbox packet control surface test: passed
- focused sandbox.nexus surface test: passed
- focused JAI Palette sandbox agent draft test: passed
- `git diff --check`: passed
- `git diff --cached --check`: passed

A29 found no `must-fix` blockers. A29 classified operator route-boundary test planning, package test posture, and focused test command discoverability as `should-improve`. A29 classified repeated boundary copy, hardcoded UI/status language, and stale docs chain risk as `safe-but-inefficient`. A29 concluded the current governed control-plane codebase is not ready for broad activation-readiness planning yet and recommended a narrow route-boundary test plan before any broad activation-readiness planning.

## 4. Inspection methodology

A30 inspected repo-local artifacts with read-only commands only. A30 inspected the accepted A29 review artifact, package scripts, target route handlers, threadMemory helpers, motionKernel helpers, focused control-plane tests, and route/source discovery output.

A30 did not run route handlers, tests, dev server, browser/e2e tests, database-backed integration tests, migrations, Prisma commands, provider/model/API calls, GitHub APIs, Linear APIs, target-repo actions, deployment commands, DNS/registrar/payment/billing/funding commands, or checklist execution.

## 5. Files inspected

| Area | Files / paths inspected | Notes |
|------|-------------------------|-------|
| A29 evidence baseline | `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md` | Accepted code/test/optimization review used as A30 basis. |
| Package scripts | `portal/package.json` | Scripts inspected for safe local test command posture and unsafe/runtime/deployment scripts. |
| Passalong collection route | `portal/src/app/operator/control-thread/passalongs/route.ts` | Present; `GET` lists persisted passalongs and `POST` persists bounded passalong input when persistence is available. |
| Passalong detail route | `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts` | Present; `PATCH` updates persisted passalong records and `GET` returns a 405 non-authorizing boundary response. |
| Manual inference route | `portal/src/app/operator/motion-control/manual-inference/route.ts` | Present; supports mock default and env-gated provider path, then persists advisory deliberation history. |
| Motion intake route | `portal/src/app/operator/motion-control/motion-intake/route.ts` | Present; `GET` lists recent intake records and `POST` persists bounded motion intake draft metadata when persistence is available. |
| Thread memory helpers | `portal/src/lib/controlPlane/threadMemory/**` | Present; includes passalong persistence, boundary copy, router, sample data, and focused local-boundary test. |
| Motion kernel helpers | `portal/src/lib/controlPlane/motionKernel/**` | Present; includes provider connector, server provider config, motion intake persistence, deliberation history, sample motions, and normalization helpers. |
| Focused control-plane tests | `portal/src/lib/controlPlane/**/*.test.ts` | Present for static helper areas; no matching focused route-boundary tests for target route handlers were found in A29 evidence. |
| Broader control-plane helpers | `portal/src/lib/controlPlane/**` | Present; inspected by discovery for source context only. |

## 6. Files changed

| File | Change type | Boundary |
|------|-------------|----------|
| `docs/reference/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0.md` | Added A30 test-plan artifact | Docs/reference test-plan only; not implementation, source, test, package, lockfile, schema, migration, runtime, deployment, provider, GitHub API, Linear, target-repo, DNS, registrar, payment, billing, or funding change. |

## 7. Package scripts inspected

| Script / package area | Present? | A30 use | Notes |
|-----------------------|----------|---------|-------|
| `lint` | Yes | Inspected only | Safe validation script exists, but A30 is not a source validation lane. |
| `typecheck` | Yes | Inspected only | Safe validation script exists, but A30 does not run source validation unless source files change. |
| `test` | Yes | Classified as placeholder | Script is `echo "Error: no test specified" && exit 1`; not a safe discoverable route-boundary test command. |
| Focused `tsx` test invocation | Available through `pnpm -C portal exec tsx ...` | Planning context only | A29 used this for helper tests; A30 does not run tests. |
| Route-boundary test command | Not currently discoverable | Planning gap | A30 plans a future local-only route-boundary test implementation lane. |
| `dev`, `start`, `build`, `build:local`, `start:local` | Yes | Forbidden in A30 | Not run; dev/server/build behavior is outside test-plan-only scope. |
| Prisma scripts | Yes | Forbidden in A30 | Not run; migration/generate/status/studio/db push commands remain outside A30. |
| Operational scripts | Yes | Forbidden in A30 | Repo, wave, sync, audit, emit, ingest, export, and DCT scripts are not route-boundary planning commands and were not run. |
| Repo-local docs/static validation | Not found in inspected scripts | Unavailable-script | No dedicated docs/static validation script found in `portal/package.json`. |

## 8. Route-boundary test categories planned

| Category | Purpose | Boundary |
|----------|---------|----------|
| Operator persistence route boundaries | Plan local-only assertions for route responses that persist bounded advisory metadata. | Test planning only; not persistence implementation or production DB mutation. |
| Passalong persistence route boundaries | Plan tests for passalong `GET`, `POST`, validation failure, persistence unavailable, and safe local persistence cases. | Future tests must not send, route, execute, or approve passalongs. |
| Passalong read/detail route boundaries | Plan tests for detail `PATCH` bounded status updates and `GET` 405 non-authorizing response. | Future tests must not create route authority or CONTROL_THREAD acceptance. |
| Provider-gated / manual inference route boundaries | Plan tests for mock default, provider-disabled, provider-config-missing, and non-authority response fields. | Provider-disabled testing is not provider dispatch. |
| Motion intake route boundaries | Plan tests for missing draft, bounded draft persistence, read/list response, and persistence fallback. | Motion intake response is not approval, routed work, or execution authority. |
| Route response non-authority boundaries | Plan shared assertions over response bodies. | Response testing is not route execution authority. |
| Provider-disabled / no-provider behavior | Plan assertions that no live key or provider call is required. | No live provider/model/API call. |
| Mock-default behavior | Plan assertions that mock mode remains default unless explicitly changed by local test fixture. | Mock default is not runtime activation. |
| Persistence-unavailable behavior | Plan fallback assertions when DB/table is unavailable. | Persistence limitation display is not production DB mutation. |
| Safe local persistence behavior | Plan tests only with local adapter or safe local test database if separately routed. | No deployed database and no migration application. |
| No-secret / no-external-call behavior | Plan assertions that fixtures and responses contain no secrets and tests make no external calls. | No provider keys, production database URLs, GitHub tokens, Linear tokens, or private data. |
| No-GitHub / no-Linear / no-target-repo behavior | Plan assertions that no mutation authority appears in responses or test setup. | No GitHub API, Linear mutation, target-repo mutation, or target-repo import. |
| No-runtime / no-deployment / no-production behavior | Plan assertions that no runtime, deployment, production gate, public launch, DNS, registrar, payment, billing, or funding action occurs. | Activation-readiness test planning is not activation readiness. |
| No-automatic-route-execution behavior | Plan assertions that routes do not auto-route, auto-deliver, or execute work. | No automatic route execution or automatic delivery. |
| No-authority-transfer behavior | Plan assertions that responses preserve CONTROL_THREAD authority. | No acceptance, execution, or CONTROL_THREAD authority transfer. |

## 9. Target route / surface list

| Target route / surface | Presence classification | A30 planning role | Boundary |
|------------------------|-------------------------|-------------------|----------|
| `portal/src/app/operator/control-thread/passalongs/route.ts` | Present | Plan passalong list/create route-boundary tests. | Planning only; no route execution in A30. |
| `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts` | Present | Plan passalong detail/update route-boundary tests. | Planning only; no route execution in A30. |
| `portal/src/app/operator/motion-control/manual-inference/route.ts` | Present | Plan mock-default and provider-disabled route-boundary tests. | Planning only; no live provider calls. |
| `portal/src/app/operator/motion-control/motion-intake/route.ts` | Present | Plan motion intake persistence and missing-draft route-boundary tests. | Planning only; no persistence mutation in A30. |
| `portal/src/lib/controlPlane/threadMemory/**` | Present | Plan future fixture and persistence-boundary assertions. | Planning only; no source/test changes. |
| `portal/src/lib/controlPlane/motionKernel/**` | Present | Plan future fixture, provider-disabled, persistence fallback, and response-boundary assertions. | Planning only; no provider/model/API dispatch. |
| Relevant existing focused tests under `portal/src/lib/controlPlane/**` | Present | Planning context for future test style; helper tests exist but target route-boundary tests are not discoverable. | Planning only; A30 does not run or implement tests. |

## 10. Allowed local-only test posture

| Allowed posture | Purpose | Boundary |
|-----------------|---------|----------|
| Local test runner only | Keep future route-boundary tests confined to repo-local execution. | No deployed runtime or external service. |
| Fixtures, mocks, and stubs only | Simulate request bodies, provider states, and persistence states safely. | No real secrets, providers, deployed DBs, GitHub, Linear, target repos, or production systems. |
| Provider disabled by default | Verify disabled/no-provider paths without live calls. | Provider-disabled testing is not provider dispatch. |
| Mock mode default | Verify manual inference default remains mock. | Mock behavior is advisory and non-authorizing. |
| Local-only persistence adapter or test DB only if separately routed | Allow safe future coverage for persistence-available behavior. | No deployed DB, no migrations, no production data. |
| Response-body assertions | Verify non-authority and ZERO GATES response copy. | Response inspection is not route authority. |
| No external network calls | Prevent provider/model/API, GitHub, Linear, or target-repo access. | No external-call behavior. |
| No runtime activation | Keep tests as unit/route-boundary tests. | No dev server, browser/e2e, runtime activation, deployment, or production gates. |

## 11. Forbidden test behavior

| Forbidden behavior | Reason | Boundary |
|--------------------|--------|----------|
| Real provider/model/API keys | Secret and dispatch risk. | No live provider calls. |
| Provider/model/API dispatch | A30 only plans disabled/mock behavior. | No provider/model/API dispatch. |
| GitHub API calls | A30 is local-only. | No GitHub API mutation. |
| Linear mutation | A30 is local-only. | No Linear mutation, issue creation, status change, or automation. |
| Target-repo writes/imports | Route-boundary tests must not mutate target repos. | No target-repo mutation/import. |
| Deployed database connections | Persistence tests must be local-only if later routed. | No deployed DB mutation. |
| Migration application | Migration behavior is outside A30. | No schema or database migration. |
| Deployment or production commands | Route-boundary tests are local-only. | No deployment or production gate. |
| Public launch, DNS, registrar, renewal/payment, billing, or funding actions | These are outside route-boundary testing. | No public launch or asset-provider action. |
| JAI_control_thread runtime activation | A30 is not activation readiness. | No runtime activation. |
| JAI Council activation | A30 is not Council activation planning. | No Council activation. |
| JAI Agent activation | A30 is not Agent activation planning. | No Agent activation. |
| Hidden automation, timers, polling, background jobs | Tests must be deterministic and local. | No hidden automation. |
| Automatic route execution or delivery | Route-boundary tests inspect response posture only. | No automatic route execution or automatic delivery. |
| Acceptance, execution, or CONTROL_THREAD authority transfer | CONTROL_THREAD remains authority. | No authority transfer. |

## 12. Fixture / mock posture

| Fixture / mock class | Purpose | Boundary |
|----------------------|---------|----------|
| Mock provider disabled response | Exercise provider-disabled manual inference posture. | No provider/model/API call. |
| Mock missing provider key / no-provider response | Exercise config-missing provider fallback. | No live key required or read from fixture. |
| Mock persistence unavailable response | Exercise DB/table unavailable fallback. | No production DB mutation. |
| Mock safe local persistence adapter | Exercise persistence-available response only if separately routed safe local test harness exists. | No deployed DB, no migration, no production data. |
| Mock passalong payloads | Exercise valid and invalid passalong route inputs. | No real passalong delivery, route execution, or approval. |
| Mock motion intake payloads | Exercise missing and valid motion intake drafts. | No routed work or acceptance. |
| Mock manual inference payloads | Exercise mock mode and env-gated disabled behavior. | No provider dispatch. |
| Mock non-authority response bodies | Assert response boundaries consistently. | No source-of-truth transfer. |
| Mock error paths without external calls | Exercise parse, validation, and fallback behavior. | No automatic retry, polling, background job, or external call. |
| Secret-free fixtures | Keep fixtures non-sensitive. | No provider keys, production database URLs, GitHub/Linear tokens, customer data, or private data. |

## 13. Provider-disabled / no-provider test expectations

| Future test expectation | Evidence basis | Boundary |
|-------------------------|----------------|----------|
| Route returns bounded non-authorizing response | A29 inspected `manual-inference/route.ts` response non-authorizations. | Future test is not CONTROL_THREAD acceptance. |
| No provider/model/API call occurs | A29 found mock default and provider-disabled fallback need coverage. | No live provider dispatch. |
| No live key is required | `server-provider-config` and A29 evidence identify provider status as env-gated. | No secret dependency. |
| No activation language is emitted | Manual inference response includes non-authorizations. | No runtime, Council, or Agent activation. |
| Manual/operator-only posture is preserved | A29 classified manual inference as operator-triggered and advisory. | No automatic route execution. |
| CONTROL_THREAD-review-required posture is preserved | Response copy preserves human / CONTROL_THREAD approval. | No authority transfer. |

## 14. Persistence-unavailable test expectations

| Future test expectation | Evidence basis | Boundary |
|-------------------------|----------------|----------|
| Route returns bounded unavailable / held / evidence-required posture | A29 inspected persistence fallback messages in threadMemory and motionKernel. | Limitation display is not failure-to-authorize execution. |
| No production DB mutation occurs | A29 found Prisma/raw SQL paths but did not execute them. | Future tests must use mocks/stubs or safe local adapter only. |
| No migration occurs | Package scripts include Prisma migration commands not used by A29/A30. | No migration application. |
| No source-of-truth transfer occurs | Route non-authorizations state persistence is advisory only. | No canon transfer. |
| Response makes limitation visible | A29 identified persistence-unavailable behavior as required coverage. | Limitation visibility is not acceptance. |
| No automatic retry/polling/background job is created | A29 hidden-risk scan found no focused helper background jobs. | No hidden automation. |

## 15. Persistence-available local test expectations

| Future test expectation | Evidence basis | Boundary |
|-------------------------|----------------|----------|
| Local-only adapter or test DB only | A29 found persistence paths but did not run them. | No deployed DB connection. |
| No migration application | Package migration scripts are forbidden for A30 and future local route-boundary tests unless separately routed. | No Prisma migration. |
| No production data | Fixtures must be synthetic and non-secret. | No customer/private data. |
| No authority transfer | Persisted passalong, motion intake, and deliberation history responses remain advisory. | No route authority, execution authority, or CONTROL_THREAD acceptance. |
| Bounded response posture | Future tests should assert `nonAuthorizations`, persistence status, and safe advisory messages. | Response posture is not source-of-truth canon. |
| Cleanup is local-only | If a safe adapter creates state, cleanup must be local and deterministic. | No background cleanup job, polling, deployed DB cleanup, or production mutation. |

## 16. Response-body boundary assertions

| Future assertion | Purpose | Boundary |
|------------------|---------|----------|
| Response does not claim route authority | Prevent persisted or inferred records from becoming routed work. | No route authority. |
| Response does not claim activation | Prevent manual inference or passalong results from implying runtime/Council/Agent activation. | No activation. |
| Response does not claim acceptance | Preserve CONTROL_THREAD acceptance boundary. | No CONTROL_THREAD acceptance transfer. |
| Response does not claim execution | Prevent work-packet or route execution implication. | No execution authority. |
| Response does not claim delivery | Prevent automatic delivery implication. | No automatic delivery. |
| Response does not claim source-of-truth canon | Preserve advisory metadata boundary. | No source-of-truth transfer. |
| Response does not claim public-ready or production-ready posture | Preserve company-ready/public/production separation. | No public launch, deployment, or production gate. |
| Response does not authorize provider/model/API dispatch | Verify mock/disabled posture. | No provider/model/API dispatch. |
| Response does not authorize GitHub/Linear mutation | Verify no external workflow authority. | No GitHub API mutation or Linear mutation. |
| Response does not authorize target-repo mutation/import | Verify target repo stays untouched. | No target-repo mutation/import. |

## 17. No-secret / no-provider / no-external-call assertions

| Future assertion | Purpose | Boundary |
|------------------|---------|----------|
| Fixtures contain no provider keys | Prevent secret leakage. | No live provider calls. |
| Fixtures contain no production database URLs | Prevent deployed DB access. | No production DB mutation. |
| Fixtures contain no GitHub or Linear tokens | Prevent external API mutation. | No GitHub API or Linear mutation. |
| Fixtures contain no customer/private data | Keep tests synthetic and safe. | No privacy or source-of-truth transfer. |
| Provider connector is stubbed or disabled | Keep manual inference local-only. | No provider/model/API dispatch. |
| Network calls are rejected or absent | Verify local-only posture. | No external calls. |
| Error paths do not reveal secrets | Verify response safety. | No secret exposure. |

## 18. No-GitHub / no-Linear / no-target-repo assertions

| Future assertion | Purpose | Boundary |
|------------------|---------|----------|
| No `octokit` or GitHub API client is invoked | Prevent GitHub mutation. | No GitHub API mutation. |
| No `gh` command is invoked | Keep future tests local-only. | No GitHub automation. |
| No Linear client or mutation path is invoked | Prevent Linear state changes. | No Linear mutation. |
| No target-repo filesystem or import path is invoked | Prevent target-repo mutation/import. | No target-repo mutation/import. |
| Response contains no PR creation, branch mutation, merge, or branch deletion authority | Preserve external workflow boundary. | No GitHub mutation. |
| Response contains no route delivery authority | Preserve manual operator boundary. | No automatic delivery. |

## 19. No-runtime / no-deployment / no-production assertions

| Future assertion | Purpose | Boundary |
|------------------|---------|----------|
| No dev server is required | Keep tests local unit/route-boundary only. | No runtime activation. |
| No browser/e2e harness is required | Avoid runtime behavior. | No JAI_control_thread runtime activation. |
| No deployment command is invoked | Preserve deployment boundary. | No deployment. |
| No production gate flag is changed | Preserve production boundary. | No production gates. |
| No DNS, registrar, renewal/payment, billing, or funding action is invoked | Preserve asset/provider and financial boundaries. | No public launch or asset/payment action. |
| No timer, polling, cron, or background worker is introduced | Preserve deterministic local testing. | No hidden automation. |
| No checklist execution is triggered | Keep readiness checklist separate. | No checklist execution. |

## 20. Activation-readiness separation matrix

| Separation | Preserved? | Test-plan finding |
|------------|------------|-------------------|
| Test planning is not test implementation | Yes | A30 plans future tests only and changes no test files. |
| Local-only test design is not runtime activation | Yes | A30 forbids dev server, browser/e2e, and runtime activation. |
| Provider-disabled testing is not provider dispatch | Yes | A30 plans disabled/mock assertions only. |
| Persistence boundary testing is not production DB mutation | Yes | A30 requires mocks/stubs or safe local adapter only if separately routed. |
| Route response testing is not route execution authority | Yes | A30 plans response assertions only. |
| Activation-readiness test planning is not activation readiness | Yes | A30 does not claim readiness; it plans a narrow future test implementation route. |
| Activation readiness is not activation | Yes | A30 does not recommend activation. |
| Activation is not deployment or production | Yes | A30 preserves no deployment, no production gates, and no public launch. |

## 21. Test result classification vocabulary

| Classification | Meaning | Allowed use | CONTROL_THREAD dependency | Boundary |
|----------------|---------|-------------|---------------------------|----------|
| `planned` | A test case is described but not implemented. | A30 and future planning artifacts. | CONTROL_THREAD must route implementation before code/test changes. | Does not imply execution or pass. |
| `not_implemented` | A planned test has no source/test implementation yet. | Future review of A30/A31 scope. | Requires separate implementation route to change. | Not a failure by itself. |
| `ready_for_test_implementation_route` | Plan is specific enough to route local-only test implementation. | CONTROL_THREAD decision candidate. | CONTROL_THREAD acceptance and routing required. | Not implementation authority by itself. |
| `not_run_with_reason` | Test was not run and reason is documented. | Future review/validation matrices. | CONTROL_THREAD may hold or route follow-up. | Not pass/fail. |
| `passed_local_only` | Future local-only test passed without external calls or activation. | Only after separately routed tests run. | CONTROL_THREAD still decides acceptance. | Does not authorize activation. |
| `failed_boundary` | Future test detected boundary violation or overclaim. | Future test implementation/review lane. | CONTROL_THREAD should hold or route fix. | Does not fix source by itself. |
| `failed_pre_existing` | Future test failed due to pre-existing behavior outside the current lane change. | Future review lane classification. | CONTROL_THREAD decides fix/hold route. | Do not silently fix in review-only lane. |
| `blocked` | Test cannot proceed due to missing safe fixture, unclear target, or unsafe behavior. | Future test planning/review. | CONTROL_THREAD clarification required. | No unsafe workaround. |
| `unavailable_script` | Required script is missing or placeholder-only. | Package validation posture. | CONTROL_THREAD may route script/test harness work. | Not a source change authorization. |
| `unsafe_to_run` | Test would require forbidden external/runtime/deployed behavior. | Future validation matrix. | CONTROL_THREAD must route a safer plan or hold. | Do not run. |
| `superseded` | Test plan or case has been replaced by a later accepted plan. | Lifecycle tracking only. | CONTROL_THREAD acceptance of replacement required. | Not deletion or archive by itself. |

## 22. Future test implementation lane candidates

| Candidate lane | Target scope | Necessity basis | Boundary |
|----------------|--------------|-----------------|----------|
| `A31 Governed Control Plane Narrow Route-Boundary Test Implementation v0` | Implement local-only route-boundary tests for passalong, motion intake, and manual inference boundaries. | A29 found missing route-boundary tests and A30 defines safe plan. | Separate route required; A30 does not create tests. |
| Focused safe test script lane | Add a discoverable package script for governed control-plane focused tests. | A29 found `test` script placeholder and manual focused command discoverability issue. | Package/test changes require separate route. |
| Provider-disabled route-boundary refinement lane | Further narrow provider-disabled/missing-key fixture posture if ambiguity remains. | Needed only if CONTROL_THREAD finds provider fixture plan ambiguous. | Docs/test-plan refinement only. |
| Persistence adapter test harness lane | Design or implement local-only persistence adapter harness if direct route testing cannot be safe. | Needed only if A31 cannot safely test persistence-available behavior. | No deployed DB, no migration, no production data. |

## 23. Next necessary decision options

| Option | Route candidate | Purpose | Boundary |
|--------|-----------------|---------|----------|
| Accept A30 and route a narrow local route-boundary test implementation lane | `A31 Governed Control Plane Narrow Route-Boundary Test Implementation v0` | Implement local-only tests for planned route boundaries. | No activation, no provider calls, no deployed DB, no source-of-truth transfer, no external mutation. |
| Accept A30 and route narrower test-plan refinement | Follow-up A30 refinement | Clarify target routes or fixture posture if CONTROL_THREAD finds ambiguity. | Docs/reference planning only. |
| Hold A30 | No route | Wait for additional source inspection or route clarification. | No implementation or test changes. |
| Reject A30 | No route | Reject if test plan is insufficient or too broad. | CONTROL_THREAD retains authority. |

## 24. Recommended next CONTROL_THREAD decision

A30 recommends accepting A30 and routing `A31 Governed Control Plane Narrow Route-Boundary Test Implementation v0`.

Recommended branch:

`test/q3m7-governed-control-plane-narrow-route-boundary-tests-v0`

Recommended posture:

- local-only test implementation
- no runtime activation
- no provider/model/API dispatch
- no live provider calls
- no GitHub API mutation
- no Linear mutation
- no target-repo mutation/import
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

A30 does not create A31 and does not implement tests.

## 25. Non-authorizations preserved

| Non-authorization | Preserved? | Test-plan finding |
|-------------------|------------|-------------------|
| No implementation | Yes | A30 creates only a docs/reference test-plan artifact. |
| No source changes | Yes | A30 changes no source files. |
| No test changes | Yes | A30 changes no test files. |
| No package or lockfile changes | Yes | A30 changes no package or lockfile files. |
| No runtime activation | Yes | A30 runs no runtime and plans local-only tests only. |
| No JAI_control_thread runtime activation | Yes | A30 does not activate JAI_control_thread runtime. |
| No JAI Council activation | Yes | A30 does not activate Council behavior. |
| No JAI Agent activation | Yes | A30 does not activate Agent behavior. |
| No provider/model/API dispatch | Yes | A30 plans disabled/mock provider posture only. |
| No live provider calls | Yes | A30 makes no provider calls and forbids real provider keys. |
| No GitHub mutation beyond routed branch push | Yes | A30 permits only routed branch push at closeout. |
| No GitHub API mutation | Yes | A30 does not use GitHub APIs. |
| No Linear mutation | Yes | A30 does not use Linear. |
| No target-repo mutation/import | Yes | A30 does not touch target repos. |
| No accepted-code import | Yes | A30 imports no accepted code. |
| No deployment | Yes | A30 runs no deployment commands. |
| No production gates | Yes | A30 opens no production gates. |
| No source-of-truth transfer | Yes | A30 is non-authoritative planning. |
| No public launch | Yes | A30 does not launch public surfaces. |
| No DNS change | Yes | A30 changes no DNS. |
| No registrar action | Yes | A30 performs no registrar action. |
| No renewal/payment action | Yes | A30 performs no renewal or payment action. |
| No billing action | Yes | A30 performs no billing action. |
| No funding commitment | Yes | A30 makes no funding commitment. |
| No hidden automation | Yes | A30 adds no automation. |
| No timers, polling, or background jobs | Yes | A30 adds no code or jobs. |
| No automatic route execution | Yes | A30 plans response assertions only. |
| No automatic delivery | Yes | A30 adds no delivery mechanism. |
| No activation | Yes | A30 does not activate any system. |
| No checklist execution | Yes | A30 does not execute the readiness checklist. |
| No acceptance authority transfer | Yes | CONTROL_THREAD remains acceptance authority. |
| No execution authority transfer | Yes | A30 transfers no execution authority. |
| No CONTROL_THREAD acceptance transfer | Yes | A30 does not accept itself. |

## 26. Evidence limitations

- A30 did not run route handlers, tests, dev server, browser/e2e, migrations, Prisma commands, deployed database checks, providers/models/APIs, GitHub APIs, Linear APIs, target-repo actions, deployment commands, DNS/registrar/payment/billing/funding commands, or checklist execution.
- A30 did not inspect every line under `portal/src/lib/controlPlane/**`; it inspected the required targets and discovery output for planning context.
- A30 does not prove that future tests are implemented, runnable, or passing.
- A30 does not prove activation readiness.
- A30 records that a safe route-boundary test command is not currently discoverable from `portal/package.json`.

## 27. Risks and blockers

No A30 blocker was found within docs-only test-plan scope.

Remaining risks:

- Future route-boundary tests require a separately routed implementation lane.
- Safe local persistence-available testing may need a test adapter or isolated local test database design before implementation.
- Provider-disabled testing must avoid real provider keys and live provider calls.
- Package-level `test` script remains placeholder-only until a separately routed source/package/test lane changes it.

## 28. Validation

A30 validation is limited to docs/static-safe validation.

Required validation:

- `git diff --check`
- `git diff --cached --check` after staging
- targeted non-authorization scan over the A30 artifact and relevant source/context paths

A30 does not run source validation or tests because A30 is a test-plan lane and source/test files are not changed.

## 29. Authority boundary

A30 is a docs/reference test-plan-only artifact. A30 records a narrow future local-only route-boundary test plan, but does not implement, execute, or pass route-boundary tests.

A30 does not authorize broad activation-readiness planning. A30 does not authorize activation. A30 does not authorize runtime behavior, provider/model/API dispatch, live provider calls, persistence mutation, deployed database access, GitHub API mutation, Linear mutation, target-repo mutation/import, deployment, production gates, public launch, DNS/registrar/renewal/payment/billing/funding action, hidden automation, automatic route execution, automatic delivery, checklist execution, or authority transfer.

CONTROL_THREAD remains review, accept, hold, reject, route, and acceptance authority.

## 30. Repo-lane closeout

Branch: `docs/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0`

Files changed:

- `docs/reference/q3m7-governed-control-plane-narrow-activation-readiness-test-plan-v0.md`

Recommended next necessary decision:

- Accept A30 and route `A31 Governed Control Plane Narrow Route-Boundary Test Implementation v0`.

A30 does not create a PR, does not create A31, does not implement tests, and does not authorize CONTROL_THREAD acceptance.
