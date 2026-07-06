# Q3M7 sandbox.nexus Experimental Surface Definition v0

## Role

Role: JAI::DEV::BUILDER

## 1. Definition scope

B14 defines an experimental v0 surface for `sandbox.nexus` inside `dev.jai.nexus`.

B14 is a docs/reference definition lane. It defines product framing, surface modules, state vocabulary, capability posture, safe activation ladder, drift/hallucination control model, relationships to JAI Palette and `sandbox-nexus`, blocked gates, and the recommended B15 route.

B14 is app-local, non-authoritative, experimental, advisory-output-only, human-supervised, and non-executing. B14 does not authorize DNS changes, deployment, live domain activation, sandbox runtime activation, sandbox task execution, executable runner behavior, provider/model/API dispatch, autonomous JAI Agent execution, target-repo mutation/import, accepted-code import, production gates, source-of-truth transfer, or hidden/background automation.

## 2. Accepted B13 baseline

B14 records the CONTROL_THREAD-provided accepted B13 baseline:

- `sandbox-nexus` now has a static repo-local `.nexus` substrate for JAI Palette relationship, candidate sandbox agents, route-packet fixtures, sandbox guardrails, advisory closeout shapes, static stress-test scenarios, and docs/reference substrate tracking.
- B13 confirmed no `.nexus/motions` ledger.
- B13 confirmed no executable runner.
- B13 confirmed no runtime handler.
- B13 confirmed no sandbox runtime activation.
- B13 confirmed no sandbox task execution.
- B13 confirmed no autonomous JAI Agent execution.
- B13 confirmed no provider/model/API dispatch.
- B13 confirmed no target-repo mutation/import.
- B13 confirmed no accepted-code import.
- B13 confirmed no deployment or production gates.
- B13 confirmed no source-of-truth transfer.
- B13 confirmed no hidden/background automation.

B14 records a cross-repo evidence boundary: B13 artifacts are not present in this `dev-jai-nexus` repo-local docs set at the time of B14. B14 uses the accepted B13 baseline supplied by CONTROL_THREAD and does not invent unavailable `sandbox-nexus` artifact content.

## 3. Product and repo framing

B14 uses this framing:

- `sandbox-nexus` is the repo.
- `sandbox.nexus` is the product/domain concept.
- `dev.jai.nexus` is the control surface where `sandbox.nexus` can be designed, inspected, and operated experimentally.
- `sandbox.nexus` should become the controlled experimental surface where JAI NEXUS drafts, stages, stress-tests, reviews, and closes out sandbox-bound agent coverage without live runtime authority.

B14 distinguishes product/domain design from repo state and from runtime authority. A `sandbox.nexus` display inside `dev.jai.nexus` is not a DNS change, not deployment, not live domain activation, not sandbox runtime activation, and not source-of-truth transfer.

## 4. Strategic premise

B14 records the strategic premise that JAI needs to become its own governed entity because ordinary assistant behavior can hallucinate, drift, over-infer, misroute, or collapse authority boundaries.

The `sandbox.nexus` experimental surface should make those boundaries visible before any runtime exists. It should separate:

- CONTROL_THREAD authority
- `dev.jai.nexus` control-plane state
- `sandbox-nexus` experimental substrate
- `JAI::DEV::AGENTS` candidates
- `JAI::SANDBOX::AGENTS` candidates

The surface should make drift visible as a first-class control-plane concern. It should not hide authority assumptions inside generated text, UI labels, or inferred state.

## 5. Required questions answered

| # | Question | B14 answer | Boundary |
|---|----------|------------|----------|
| 1 | What is `sandbox.nexus`? | `sandbox.nexus` is the product/domain concept for a controlled experimental surface where JAI NEXUS drafts, stages, stress-tests, reviews, and closes out sandbox-bound agent coverage. | Experimental concept only; no DNS change, deployment, or live domain activation. |
| 2 | What is `sandbox-nexus`? | `sandbox-nexus` is the repo containing the static `.nexus` substrate accepted in B13. | Repo-local substrate only; not runtime authority. |
| 3 | What belongs on `dev.jai.nexus` versus `sandbox.nexus`? | `dev.jai.nexus` hosts the control-plane inspection and operator surface; `sandbox.nexus` is the product/domain surface being designed and staged for sandbox-bound evidence. | Display/design distinction only; no source-of-truth transfer. |
| 4 | What data does the `sandbox.nexus` surface need from the B11 JAI Palette composer? | Candidate agent class, agent draft metadata, activation/review status, route-packet compatibility, fixture compatibility, closeout contribution, guardrails, blocked authorities, CONTROL_THREAD authority statement, and advisory/non-authoritative statement. | Candidate-only metadata; no executable agent runtime. |
| 5 | What data does the `sandbox.nexus` surface need from the B13 `sandbox-nexus` `.nexus` substrate? | Static substrate references for candidate sandbox agents, route-packet fixtures, guardrails, advisory closeout shapes, stress-test scenarios, and substrate tracking. | Cross-repo evidence boundary; no automatic import. |
| 6 | What should the surface display before sandbox runtime exists? | Static/planning state for overview, drafts, coverage, fixture intake, stress-test plan, closeout shape, blocked gates, safe activation ladder, drift risks, and next route recommendation. | Non-executing and advisory-output-only. |
| 7 | How should the surface distinguish drafted, reviewed, accepted, executable, activated, and authoritative states? | By using explicit state vocabulary and showing that each state requires separate authority before moving to the next. | State labels do not grant authority. |
| 8 | How should drift or hallucination risk be surfaced? | As visible risk classes with required evidence, hold/block triggers, and CONTROL_THREAD decision needs. | Risk display is advisory and does not self-resolve. |
| 9 | What should remain blocked? | DNS changes, deployment, live domain activation, runtime activation, task execution, executable runner, automatic intake, automatic route execution, provider/model/API dispatch, autonomous JAI Agent execution, target-repo mutation/import, accepted-code import, GitHub/PR automation, production gates, source-of-truth transfer, hidden/background automation. | Each blocked gate requires a separate CONTROL_THREAD route. |
| 10 | What would make `sandbox.nexus` useful for a first supervised stress test? | A static operator surface that can display route-packet relationships, candidate agent coverage, fixture intake readiness, blocked gates, drift risks, closeout shape, and next-route recommendations before runtime exists. | Still no sandbox runtime activation. |
| 11 | What should B15 implement or review? | B15 should implement a static operator surface prototype if CONTROL_THREAD routes it. | Display-only, app-local, non-authoritative, non-executing. |

## 6. Surface module map

| Module | Purpose | Primary inputs | Displayed state | Operator action | Boundary |
|--------|---------|----------------|-----------------|-----------------|----------|
| Sandbox Overview | Summarize what `sandbox.nexus` is and where it sits relative to `dev.jai.nexus`, `sandbox-nexus`, and CONTROL_THREAD. | B14 definition, B13 baseline, B10-B12 JAI Palette evidence. | Experimental, app-local, advisory-output-only posture. | Inspect only. | No DNS change, deployment, live domain activation, or runtime authority. |
| JAI Palette Drafts | Display candidate sandbox agent drafts from the B11 composer and future B13 coverage-set evidence. | B11 draft fields, required `JAI::SANDBOX::AGENTS` classes, B13 accepted baseline. | Drafted/candidate/reviewed/held/blocked draft state. | Select/filter candidate metadata in a future static UI. | Candidate metadata only; no executable agent runtime. |
| Agent Coverage Map | Show required sandbox agent coverage across intake, fixture, guardrail, closeout, stress, mutation risk, provider risk, evidence, council, and escalation. | B10 coverage classes, B11 draft data, B13 static substrate summary. | Coverage present/missing/held/blocked. | Inspect coverage gaps and recommend route. | Coverage is not activation. |
| Fixture Intake | Show fixture/manual intake readiness for route packets and `.nexus` fixture candidates. | B5 route packet shape, B11 compatibility fields, B13 fixture substrate baseline. | Fixture candidate, missing evidence, blocked gates. | Mark future evidence needs in planning docs only. | No automatic intake or sandbox task execution. |
| Stress-Test Plan | Stage a supervised stress-test plan before runtime exists. | Static stress scenario metadata, route-packet scope, candidate agents, guardrails. | Drafted stress plan, reviewed plan, held/blocked plan. | Inspect plan and route next review. | No live sandbox runtime, no executable runner. |
| Closeout Review | Display expected advisory closeout shapes for supervised stress-test outputs. | B11 closeout contribution fields, B13 advisory closeout shapes, B5 expected output shape. | Closeout draft, evidence needs, CONTROL_THREAD review need. | Review closeout shape only. | Closeout display is not CONTROL_THREAD acceptance. |
| Blocked Gates | Make every blocked authority visible. | B14 blocked gate model and prior lane non-authorizations. | Blocked gates and future route requirements. | Inspect and hold. | Blocked gates remain blocked until separate CONTROL_THREAD authority. |
| Safe Activation Ladder | Display the step-by-step ladder from reference definition to production gate. | B14 ladder and future route plan. | Current step, held steps, blocked steps. | Inspect progression constraints. | B14 only defines the surface. |
| Drift / Hallucination Control Panel | Surface authority, source-of-truth, vocabulary, route, repo/domain, capability, runtime, dispatch, mutation, import, deployment, and production overclaims. | Generated copy, operator labels, state vocabulary, evidence references, route metadata. | Risk class, required evidence, hold/block trigger, CONTROL_THREAD decision need. | Flag risk for future review. | Risk display does not self-authorize correction. |
| Next Route Panel | Recommend the next CONTROL_THREAD route. | B14 findings, blocker status, validation evidence. | B15 recommendation and blocked authorities. | Review recommendation manually. | Recommendation is advisory only. |

## 7. State vocabulary

| State | Meaning | Does not mean | Authority requirement |
|-------|---------|---------------|-----------------------|
| `drafted` | A record, module, packet, fixture, or candidate has been drafted. | Reviewed, accepted, executable, activated, or authoritative. | Human review required before progression. |
| `candidate` | A drafted object is eligible for review as a candidate. | Accepted, executable, activated, or authoritative. | CONTROL_THREAD or routed review required before acceptance. |
| `reviewed` | A human or routed review has inspected the object. | Accepted, executable, activated, or authoritative. | Explicit CONTROL_THREAD acceptance required. |
| `accepted` | CONTROL_THREAD has accepted a specific artifact or route outcome. | Executable, activated, deployed, or authoritative by default. | Separate authority required for execution or activation. |
| `executable` | An implementation is capable of being run. | Activated, authorized, safe, or authoritative. | Runtime readiness and execution authority required. |
| `activated` | A runtime or agent path has been explicitly activated. | Authoritative or production-approved. | Explicit activation route and constraints required. |
| `authoritative` | CONTROL_THREAD has explicitly made something authority. | Implied by acceptance, execution, activation, or display. | Explicit CONTROL_THREAD authority is required. |
| `held` | Intentionally paused or not routed forward. | Failed, deleted, accepted, or blocked forever. | CONTROL_THREAD decides whether to resume, revise, or close. |
| `blocked` | Not authorized under current gates. | Impossible forever or technically unavailable. | Separate CONTROL_THREAD route required before unblocking. |

B14 distinguishes that `drafted` does not mean reviewed, `candidate` does not mean accepted, `reviewed` does not mean accepted, `accepted` does not mean executable, `executable` does not mean activated, `activated` does not mean authoritative, `authoritative` requires explicit CONTROL_THREAD authority, `held` means intentionally paused or not routed forward, and `blocked` means not authorized under current gates.

## 8. Capability map

| Capability | B14 status | Future route required? | Boundary |
|------------|------------|------------------------|----------|
| design and inspect sandbox agent coverage | Allowed as definition/planning | Yes for UI implementation | No executable agent runtime. |
| view JAI Palette draft coverage | Allowed as definition/planning | Yes for UI implementation or integration | Candidate metadata only. |
| map route-packet compatibility | Allowed as definition/planning | Yes for live integration | Manual handoff only. |
| map fixture intake readiness | Allowed as definition/planning | Yes for fixture simulation/intake | No automatic intake. |
| stage stress-test plan evidence | Allowed as definition/planning | Yes for dry-run execution or simulation | No sandbox runtime activation. |
| review closeout shapes | Allowed as definition/planning | Yes for runtime closeout capture | Advisory-output-only. |
| display blocked gates | Allowed in B14 | Yes to unblock any gate | Display does not grant authority. |
| display safe activation ladder | Allowed in B14 | Yes for each ladder progression | Ladder display is not progression. |
| display drift/hallucination risks | Allowed in B14 | Yes for automated detection or enforcement | Risk display is advisory. |
| recommend next route | Allowed in B14 | CONTROL_THREAD acceptance required | Recommendation is not route authority. |
| DNS change for `sandbox.nexus` | Blocked | Yes | No DNS change. |
| live sandbox runtime activation | Blocked | Yes | No live sandbox runtime. |
| provider/model/API dispatch | Blocked | Yes | No provider/model/API dispatch. |
| target-repo mutation/import | Blocked | Yes | No mutation/import authority. |
| accepted-code import | Blocked | Yes | No accepted-code import. |
| deployment/production gate | Blocked | Yes | No deployment or production gate. |

## 9. Safe activation ladder

| Step | Name | Meaning | B14 status | Required future authority |
|------|------|---------|------------|---------------------------|
| 1 | Reference definition | Define `sandbox.nexus` surface semantics and boundaries. | Current B14 step. | CONTROL_THREAD acceptance of B14 only. |
| 2 | Static UI sketch | Display modules, states, blocked gates, ladder, and drift risks in app-local UI. | Future planned. | Separate B15 route. |
| 3 | App-local draft/export | Compose/export app-local drafts or coverage sets. | Partially evidenced by B11/B13 baseline; future integration possible. | Separate implementation and review routes. |
| 4 | Fixture intake simulation | Simulate fixture/manual intake without runtime activation. | Blocked in B14. | Separate route and boundary review. |
| 5 | Manual supervised dry run | Run a supervised dry run under explicit human control. | Blocked in B14. | Separate route and dry-run authority. |
| 6 | Boundary review | Review outputs before any runtime progression. | Future required. | Separate review route. |
| 7 | Runtime readiness review | Assess readiness for runtime without activating it. | Blocked in B14. | Separate review route. |
| 8 | Runtime activation | Activate sandbox runtime. | Blocked in B14. | Explicit CONTROL_THREAD runtime activation authority. |
| 9 | Agent activation | Activate JAI Agents. | Blocked in B14. | Explicit CONTROL_THREAD agent activation authority. |
| 10 | Production gate | Open production gate or deploy production behavior. | Blocked in B14. | Explicit production gate authority. |

B14 only defines the surface. B14 does not advance to runtime readiness, runtime activation, agent activation, deployment, or production gates.

## 10. Drift / hallucination control model

| Risk class | Surface display | Required evidence | Hold/block trigger | CONTROL_THREAD decision |
|------------|-----------------|-------------------|--------------------|-------------------------|
| authority drift | Show any copy or state that implies authority not granted. | Exact CONTROL_THREAD route/acceptance reference. | State or copy implies acceptance, execution, activation, or authority without evidence. | Accept, revise, hold, or block. |
| source-of-truth drift | Show claims that a local artifact is canonical or authoritative. | Explicit source-of-truth designation. | App-local or advisory artifact is treated as source of truth. | Decide authority or require correction. |
| state vocabulary drift | Show unknown or overloaded states. | B14 state vocabulary mapping. | State labels collapse drafted/reviewed/accepted/executable/activated/authoritative boundaries. | Approve vocabulary change or hold. |
| route drift | Show route claims not backed by current lane. | Current route artifact and branch evidence. | Surface implies a future route is active or accepted. | Route, hold, or reject. |
| repo/domain confusion | Show confusion between `sandbox-nexus`, `sandbox.nexus`, and `dev.jai.nexus`. | Repo/product/control-surface framing evidence. | Repo content is treated as live domain activation or control surface authority. | Clarify route framing. |
| agent capability overclaim | Show claims that candidate agents can execute or act. | B10/B11/B12 evidence and executable-runtime evidence. | Candidate is described as active, runnable, approved, or live without authority. | Hold or route runtime review. |
| sandbox runtime overclaim | Show claims that sandbox runtime exists or is active. | Runtime readiness/activation artifact. | Surface implies live sandbox runtime. | Hold or route runtime readiness. |
| provider/model/API dispatch overclaim | Show claims that providers/models/APIs can be called. | Dispatch authorization and credential boundary evidence. | Any dispatch capability is implied without route authority. | Hold or route dispatch boundary review. |
| target-repo mutation overclaim | Show claims that target repos can be mutated. | Mutation authority and target repo boundary evidence. | Any write/import path is implied. | Hold or route mutation boundary review. |
| accepted-code import overclaim | Show claims that accepted code can be imported. | Explicit accepted-code import authority. | Import is implied by closeout, coverage, or fixture status. | Hold or route import review. |
| deployment/production overclaim | Show claims that deployment or production gates are available. | Deployment/production gate authority. | Surface implies deployability, production readiness, or gate opening. | Hold or route production gate review. |

## 11. JAI Palette relationship

B14 defines `sandbox.nexus` as a consumer/display surface for JAI Palette draft data from B11 and future coverage-set evidence from B13.

The surface may display:

- required `JAI::SANDBOX::AGENTS` class coverage
- agent id, name, class, sandbox domain, purpose, coverage responsibility
- allowed inputs and expected outputs
- required guardrails and blocked authorities
- route-packet compatibility
- sandbox-nexus fixture compatibility
- closeout contribution
- activation status and review status
- CONTROL_THREAD authority statement
- advisory/non-authoritative statement

The relationship preserves candidate-only and non-executable status. JAI Palette draft display does not create executable agents, activate agents, dispatch providers/models/APIs, activate sandbox runtime, mutate target repos, import accepted code, deploy, open gates, or transfer authority.

## 12. sandbox-nexus `.nexus` substrate relationship

B14 defines `sandbox.nexus` as a `dev.jai.nexus` control-plane surface that can reference the static `.nexus` substrate in `sandbox-nexus`.

The surface may display references to:

- candidate sandbox agents
- route-packet fixtures
- sandbox guardrails
- advisory closeout shapes
- static stress-test scenarios
- substrate tracking

B14 preserves cross-repo evidence boundaries. B14 does not automatically import `sandbox-nexus` files, does not mutate `sandbox-nexus`, does not activate sandbox runtime, does not execute sandbox tasks, and does not treat `sandbox-nexus` static substrate as source of truth for CONTROL_THREAD.

## 13. JAI::DEV::AGENTS candidate relationship

B14 records that future `JAI::DEV::AGENTS` candidates may support `dev.jai.nexus` control-plane workflows, such as drafting, inspection, review synthesis, evidence packaging, or operator-surface assistance.

B14 does not draft, implement, activate, or execute `JAI::DEV::AGENTS`. Any future `JAI::DEV::AGENTS` candidate remains app-local, non-authoritative, advisory-output-only, and non-executing unless separately routed and accepted by CONTROL_THREAD.

## 14. JAI::SANDBOX::AGENTS candidate relationship

B14 records that future `JAI::SANDBOX::AGENTS` candidates remain draft/candidate/non-executing unless separately reviewed and activated.

The `sandbox.nexus` surface may display `JAI::SANDBOX::AGENTS` candidate coverage, but display does not mean:

- reviewed
- accepted
- executable
- activated
- authoritative
- provider/model/API-enabled
- sandbox-runtime-enabled
- target-repo mutation-enabled
- accepted-code import-enabled
- deployment-ready

## 15. Fixture / stress-test / closeout relationship

B14 defines fixture intake, stress-test planning, and closeout review as display/planning modules before runtime exists.

Fixture intake before runtime means a manual/static fixture candidate can be inspected for completeness, guardrails, evidence references, and blocked gates. It does not mean automatic intake, live sandbox runtime, or sandbox task execution.

Stress-test planning before runtime means the surface can display stress objectives, expected observations, hold points, and risk classes. It does not mean executable runner behavior, autonomous JAI Agent execution, provider/model/API dispatch, target-repo mutation, or deployment.

Closeout review before runtime means the surface can display expected advisory closeout shape and evidence requirements. It does not mean CONTROL_THREAD acceptance, source-of-truth transfer, accepted-code import, or production gate opening.

## 16. Blocked-gate display model

| Gate | B14 status | Display requirement | Future route required? |
|------|------------|---------------------|------------------------|
| DNS change | Blocked | Show `no DNS change`. | Yes |
| deployment | Blocked | Show `no deployment`. | Yes |
| live domain activation | Blocked | Show `no live domain activation`. | Yes |
| sandbox runtime activation | Blocked | Show `no live sandbox runtime`. | Yes |
| sandbox task execution | Blocked | Show `no sandbox task execution`. | Yes |
| executable runner | Blocked | Show `no executable runner`. | Yes |
| automatic intake | Blocked | Show `no automatic intake`. | Yes |
| automatic route execution | Blocked | Show `no automatic route execution`. | Yes |
| provider/model/API dispatch | Blocked | Show `no provider/model/API dispatch`. | Yes |
| autonomous JAI Agent execution | Blocked | Show `no autonomous JAI Agent execution`. | Yes |
| target-repo mutation | Blocked | Show `no target-repo mutation`. | Yes |
| target-repo import | Blocked | Show `no target-repo import`. | Yes |
| accepted-code import | Blocked | Show `no accepted-code import`. | Yes |
| GitHub automation | Blocked | Show `no GitHub automation`. | Yes |
| PR automation | Blocked | Show `no PR automation`. | Yes |
| production gates | Blocked | Show `no production gates`. | Yes |
| source-of-truth transfer | Blocked | Show `no source-of-truth transfer`. | Yes |
| hidden/background automation | Blocked | Show `no hidden/background automation`. | Yes |

## 17. Optional static operator surface sketch decision

B14 added a docs-only definition artifact.

B14 did not add the optional static operator surface sketch because this lane can fully define the surface in `docs/reference` without touching implementation source, tests, schema, migrations, route handlers, API behavior, runtime config, deployment config, or broad infrastructure.

B15 may implement or review a static operator surface prototype if CONTROL_THREAD routes it. A B15 UI prototype should be display-only, app-local, non-authoritative, experimental, advisory-output-only, human-supervised, and non-executing. It should display the required modules, state vocabulary, blocked gates, safe activation ladder, drift/hallucination control panel, JAI Palette relationship, and `sandbox-nexus` substrate relationship without send, dispatch, activation, execution, mutation, import, deployment, DNS, production, or background behavior.

## 18. Recommendation for B15

B14 recommends:

`B15 sandbox.nexus Static Operator Surface Prototype v0`

Recommended branch:

`feature/q3m7-sandbox-dot-nexus-static-operator-surface-prototype-v0`

Recommended posture:

- app-local static operator surface prototype
- displays required modules
- displays state vocabulary
- displays blocked gates
- displays safe activation ladder
- displays drift/hallucination control panel
- displays JAI Palette and `sandbox-nexus` substrate relationship
- no DNS change
- no deployment
- no live sandbox runtime
- no provider/model/API dispatch
- no autonomous JAI Agent execution
- no target-repo mutation/import
- no accepted-code import
- no production gates

## 19. Validation

Safe validation required for B14:

- `git diff --check`: passed.
- `git diff --cached --check`: passed after staging.

No source changes were made by B14, so `pnpm -C portal typecheck` and `pnpm -C portal lint` are not required for this docs-only lane.

No migration tests are authorized by B14. No migrations are applied. No Prisma migration commands are run. No deployed databases are contacted. No APIs, providers, or models are called. No sandbox-nexus execution occurs. No JAI Agent execution occurs. No target repos are mutated. No accepted code is imported. No deployment, DNS change, live domain activation, or production-gate action occurs.

## 20. Authority boundary

B14 is a docs/reference definition artifact only. B14 defines an experimental `sandbox.nexus` surface concept and recommends B15. B14 does not authorize DNS changes, deployment, live domain activation, sandbox runtime activation, sandbox task execution, executable runner behavior, automatic intake, automatic route execution, provider/model/API dispatch, autonomous JAI Agent execution, target-repo mutation, target-repo import, accepted-code import, GitHub automation, PR automation, production gates, source-of-truth transfer, or hidden/background automation.

CONTROL_THREAD remains review/accept/hold authority. B14 findings, surface module definitions, state vocabulary, capability map, safe activation ladder, drift/hallucination control model, relationship definitions, blocked-gate display model, and B15 recommendation are advisory outputs only until CONTROL_THREAD acceptance.

## 21. Repo-lane closeout

Files changed:

- `docs/reference/q3m7-sandbox-dot-nexus-experimental-surface-definition-v0.md`

sandbox.nexus definition:

- `sandbox.nexus` is the product/domain concept for a controlled experimental surface where JAI NEXUS drafts, stages, stress-tests, reviews, and closes out sandbox-bound agent coverage without live runtime authority.

sandbox-nexus repo relationship:

- `sandbox-nexus` is the repo containing the accepted static `.nexus` substrate baseline; B13 artifacts are cross-repo evidence and not present in this `dev-jai-nexus` docs set.

dev.jai.nexus surface relationship:

- `dev.jai.nexus` is the control surface where `sandbox.nexus` can be designed, inspected, and operated experimentally.

Surface modules defined:

- Sandbox Overview
- JAI Palette Drafts
- Agent Coverage Map
- Fixture Intake
- Stress-Test Plan
- Closeout Review
- Blocked Gates
- Safe Activation Ladder
- Drift / Hallucination Control Panel
- Next Route Panel

State vocabulary:

- `drafted`, `candidate`, `reviewed`, `accepted`, `executable`, `activated`, `authoritative`, `held`, `blocked`

Safe activation ladder:

- Reference definition
- Static UI sketch
- App-local draft/export
- Fixture intake simulation
- Manual supervised dry run
- Boundary review
- Runtime readiness review
- Runtime activation
- Agent activation
- Production gate

Drift / hallucination control model:

- authority drift
- source-of-truth drift
- state vocabulary drift
- route drift
- repo/domain confusion
- agent capability overclaim
- sandbox runtime overclaim
- provider/model/API dispatch overclaim
- target-repo mutation overclaim
- accepted-code import overclaim
- deployment/production overclaim

Optional UI sketch decision:

- Docs-only definition. No static UI sketch added by B14.

Validation:

- `git diff --check`: passed.

Non-authorization scan:

- Targeted non-authorization scan passed. Hits were classified as required boundary copy, negated/non-authorization copy, existing source/test assertions, surface definition language, safe local UI behavior, and existing historical control-plane documentation. No blocker was found.

Recommendation for B15:

- Route `B15 sandbox.nexus Static Operator Surface Prototype v0`.

PR description draft:

```md
## Role

Role: JAI::DEV::BUILDER

## Summary

Adds the B14 docs/reference definition for the experimental `sandbox.nexus` surface inside `dev.jai.nexus`.

## Files changed

- `docs/reference/q3m7-sandbox-dot-nexus-experimental-surface-definition-v0.md`

## sandbox.nexus definition

`sandbox.nexus` is the product/domain concept for a controlled experimental surface where JAI NEXUS drafts, stages, stress-tests, reviews, and closes out sandbox-bound agent coverage without live runtime authority.

## sandbox-nexus repo relationship

`sandbox-nexus` is the repo containing the accepted static `.nexus` substrate baseline. B14 records B13 as a cross-repo evidence boundary and does not automatically import or mutate `sandbox-nexus`.

## dev.jai.nexus surface relationship

`dev.jai.nexus` is the control surface where `sandbox.nexus` can be designed, inspected, and operated experimentally.

## Surface modules defined

B14 defines Sandbox Overview, JAI Palette Drafts, Agent Coverage Map, Fixture Intake, Stress-Test Plan, Closeout Review, Blocked Gates, Safe Activation Ladder, Drift / Hallucination Control Panel, and Next Route Panel.

## State vocabulary

B14 defines `drafted`, `candidate`, `reviewed`, `accepted`, `executable`, `activated`, `authoritative`, `held`, and `blocked`, preserving that each state has distinct authority requirements.

## Safe activation ladder

B14 defines a ten-step ladder from reference definition through production gate and preserves that B14 only defines the surface.

## Drift / hallucination control model

B14 defines risk classes for authority drift, source-of-truth drift, state vocabulary drift, route drift, repo/domain confusion, agent capability overclaim, sandbox runtime overclaim, provider/model/API dispatch overclaim, target-repo mutation overclaim, accepted-code import overclaim, and deployment/production overclaim.

## JAI Palette relationship

The surface may display B11/B13 JAI Palette draft coverage as candidate metadata only.

## sandbox-nexus .nexus substrate relationship

The surface may display static substrate references from `sandbox-nexus` while preserving cross-repo evidence boundaries and no automatic import.

## JAI::DEV::AGENTS candidate relationship

Future `JAI::DEV::AGENTS` candidates may support control-plane workflows, but B14 does not draft, implement, activate, or execute them.

## JAI::SANDBOX::AGENTS candidate relationship

Future `JAI::SANDBOX::AGENTS` candidates remain draft/candidate/non-executing unless separately reviewed and activated.

## Fixture / stress-test / closeout relationship

Fixture intake, stress-test planning, and closeout review are display/planning modules before runtime exists.

## Blocked-gate model

B14 keeps DNS change, deployment, live domain activation, sandbox runtime activation, sandbox task execution, executable runner, automatic intake, automatic route execution, provider/model/API dispatch, autonomous JAI Agent execution, target-repo mutation/import, accepted-code import, GitHub/PR automation, production gates, source-of-truth transfer, and hidden/background automation blocked.

## Validation

- `git diff --check`: passed
- `git diff --cached --check`: passed

## Non-authorization scan

Targeted scan passed. Hits were required boundary copy, negated/non-authorization copy, existing source/test assertions, surface definition language, safe local UI behavior, and existing historical control-plane documentation. No blocker was found.

## Risks / remaining blockers

Runtime activation, sandbox task execution, executable runner behavior, autonomous JAI Agent execution, provider/model/API dispatch, target-repo mutation/import, accepted-code import, deployment, DNS change, live domain activation, production gates, source-of-truth transfer, and hidden/background automation remain blocked.

## Recommended next route

Route `B15 sandbox.nexus Static Operator Surface Prototype v0`.
```
