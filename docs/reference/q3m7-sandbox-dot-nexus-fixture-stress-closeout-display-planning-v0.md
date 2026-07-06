# Q3M7 sandbox.nexus Fixture / Stress / Closeout Display Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

B20 plans display-only fixture intake, stress-test plan, and closeout review module detail for the static `sandbox.nexus` operator surface in `dev-jai-nexus`.

B20 is docs/reference planning-only. B20 does not authorize implementation source changes, test changes, fixture execution, stress-test execution, closeout generation, data wiring, runtime behavior, provider/model/API dispatch, target-repo mutation/import, DNS changes, deployment, production gates, source-of-truth transfer, hidden/background automation, timers, polling, or background jobs.

B20 preserves app-local, local-static display, display-only, non-authoritative, advisory-output-only, candidate-metadata-only, human-supervised posture. B20 also preserves no external import, no sandbox-nexus call, no automatic sync, no API route, no database migration, no sandbox runtime activation, no sandbox task execution, no executable runner, no autonomous JAI Agent execution, no provider/model/API dispatch, no GitHub API call, no target-repo mutation/import, no accepted-code import, no DNS change, no deployment, and no production gate.

## 2. Accepted B19 baseline

B20 records the accepted B19 baseline:

- B19 reviewed the B18 local-static data wiring and found no blockers.
- B19 confirmed B18 remains app-local, local-static, display-only, non-authoritative, advisory-output-only, candidate-metadata-only, and human-supervised.
- B19 confirmed local JAI Palette constants are reused safely through local imports only.
- B19 confirmed `SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING` remains static display metadata only.
- B19 confirmed ownership split remains preserved.
- B19 confirmed blocked authorities remain visible and blocked.
- B19 confirmed CONTROL_THREAD remains review/accept/hold authority.

B20 uses the accepted B19 baseline for planning evidence only. B20 does not write as if B20 accepted itself, and CONTROL_THREAD acceptance remains future.

## 3. Files inspected

B20 inspected:

- `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.ts`
- `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.test.ts`
- `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.ts`
- `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.test.ts`
- `portal/src/app/operator/control-thread/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `portal/src/app/operator/control-thread/passalongs/route.ts`
- `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`
- `docs/reference/q3m7-sandbox-dot-nexus-static-operator-surface-data-wiring-planning-v0.md`
- `docs/reviews/B19_SANDBOX_DOT_NEXUS_STATIC_OPERATOR_SURFACE_LOCAL_DATA_WIRING_BOUNDARY_REVIEW_V0.md`
- `portal/src/lib/controlPlane/sandboxNexus/`
- `portal/src/lib/controlPlane/jaiPalette/`
- `portal/src/app/operator/control-thread/`
- `docs/reference/`
- `docs/reviews/`

B20 found the expected B18/B19 evidence files discoverable on current `main`. B20 found no `docs/reference/README.md` index convention requiring an update.

## 4. Fixture intake display scope

| Fixture display field | Planned meaning | Allowed display posture | Blocked behavior |
|-----------------------|-----------------|-------------------------|------------------|
| Fixture name/id | Human-readable candidate fixture identifier for static inspection. | Local-static candidate/display record only. | No fixture execution, no route execution, no source-of-truth transfer. |
| Fixture category | Display classification such as intake, guardrail, closeout, stress, mutation risk, provider risk, evidence, council, or escalation. | May align with local JAI Palette agent class coverage. | No JAI Agent activation, no autonomous execution. |
| Source packet posture | Manual route-packet reference posture and non-authoritative handoff context. | Display-only compatibility context. | No automatic intake, no automatic sync, no accepted-code import. |
| Expected input fields | Planned static list of packet id, scope, purpose, requested action, expected output shape, evidence references, guardrails, and non-authorizations. | Candidate metadata shape only. | No API route, no database-backed intake, no runtime handler. |
| Rejected field categories | Fields that should be visibly rejected from candidate intake, including secrets, credentials, endpoint URLs, provider keys, GitHub tokens, deployment data, and DNS records. | Static guardrail display. | No provider/model/API dispatch, no GitHub API call, no deployment, no DNS change. |
| Blocked field categories | Fields that would imply runtime activation, task execution, executable runners, target-repo mutation/import, accepted-code import, production gates, or background automation. | Static blocked-authority display. | No sandbox runtime activation, no sandbox task execution, no executable runner, no production gate. |
| Simulated intake status | Display label for candidate readiness such as candidate, evidence needed, held, or blocked. | Advisory status copy only. | No fixture execution, no automatic intake, no route execution. |
| Guardrail status | Visible preservation of required non-authorizations and blocked authorities. | Display-only boundary indicator. | No authority relaxation, no hidden/background automation, no timers, no polling, no background jobs. |
| Advisory-only closeout relationship | Planned link from candidate fixture record to expected advisory closeout shape. | Reference relationship only. | No closeout generation, no acceptance authority. |
| No sandbox execution | Explicit display copy stating fixture compatibility does not imply sandbox execution. | Required boundary copy. | No sandbox task execution, no runtime activation. |
| No automatic intake | Explicit display copy stating candidate fixture fields are not automatically ingested. | Required boundary copy. | No automatic sync, no file-system watcher, no background job. |
| No route execution | Explicit display copy stating route-packet compatibility does not execute a route. | Required boundary copy. | No route execution, no provider/model/API dispatch. |

## 5. Stress-test plan display scope

| Stress-test display field | Planned meaning | Allowed display posture | Blocked behavior |
|---------------------------|-----------------|-------------------------|------------------|
| Stress-test id/name | Human-readable candidate stress-test plan identifier. | Local-static candidate/display record only. | No stress-test execution, no executable runner. |
| Risk class | Display category aligned to drift, authority, runtime, dispatch, mutation, import, deployment, production, source-of-truth, or evidence risk. | Advisory risk classification only. | No automated drift enforcement, no runtime activation. |
| Scenario description | Static description of a future supervised scenario to review. | Planning text only. | No sandbox task execution, no test execution. |
| Evidence requirement | Static list of evidence references needed before future review. | Non-secret evidence reference display. | No external import, no sandbox-nexus call, no GitHub API call. |
| Hold/block trigger | Planned condition that should preserve hold or block status. | Advisory hold/block copy. | No automatic blocking engine, no route authority. |
| CONTROL_THREAD decision requirement | Placeholder showing CONTROL_THREAD must review, accept, hold, or block. | Authority reminder only. | No local acceptance authority, no activation authority. |
| Expected advisory output | Planned text shape for a future advisory finding. | Advisory-output-only candidate metadata. | No closeout generation, no production readiness claim. |
| No executable runner | Explicit display copy that no runner exists. | Required boundary copy. | No executable runner behavior. |
| No runtime activation | Explicit display copy that no runtime is active. | Required boundary copy. | No sandbox runtime activation. |
| No sandbox task execution | Explicit display copy that no sandbox task runs. | Required boundary copy. | No sandbox task execution. |
| No provider/model/API dispatch | Explicit display copy that no external dispatch occurs. | Required boundary copy. | No provider/model/API dispatch. |

## 6. Closeout review display scope

| Closeout display field | Planned meaning | Allowed display posture | Blocked behavior |
|------------------------|-----------------|-------------------------|------------------|
| Closeout id/name | Human-readable candidate closeout review identifier. | Local-static candidate/display record only. | No closeout generation, no accepted state. |
| Source packet id | Reference to the manual packet or fixture display record under review. | Static reference only. | No automatic intake, no route execution, no source-of-truth transfer. |
| Intake status | Display of candidate/evidence-needed/held/blocked posture. | Advisory status display. | No acceptance authority, no activation authority. |
| Accepted fields | Fields the display would treat as safe candidate metadata. | Candidate metadata only. | No accepted-code import, no authoritative source state. |
| Rejected fields | Fields visibly rejected from display consideration. | Guardrail display only. | No secret handling path, no provider/model/API dispatch. |
| Blocked fields | Fields that imply execution, activation, dispatch, mutation, import, deployment, production, or automation. | Blocked-authority display. | No runtime handler, no target-repo mutation/import, no production gate. |
| Simulated action summary | Static summary of what would have been reviewed in a future supervised lane. | Display-only simulation copy. | No action execution, no sandbox task execution. |
| Output artifact references | Planned non-secret references to docs or evidence artifacts. | Reference display only. | No external import, no GitHub API-assisted import. |
| Guardrail findings | Visible findings about preserved non-authorizations. | Advisory boundary copy. | No guardrail bypass, no authority relaxation. |
| Non-authorizations preserved | Explicit display of preserved blocked authorities. | Required boundary copy. | No fixture execution, stress-test execution, closeout generation, dispatch, mutation, import, deployment, or DNS change. |
| Blockers | Display of unresolved blockers needing future route or hold. | Advisory blocker list. | No automatic resolution, no background job. |
| Recommendation | Future route recommendation placeholder. | Recommendation is not route authority. | No CONTROL_THREAD acceptance, no PR automation. |
| CONTROL_THREAD review status placeholder | Placeholder for future review/accept/hold status. | Placeholder only. | No acceptance authority, no route authority. |
| Advisory/non-authoritative posture | Copy preserving advisory-output-only posture. | Required boundary copy. | No source-of-truth transfer, no production authority. |

## 7. Local-static display metadata shape

| Metadata group | Candidate fields | Source relationship | Authority boundary |
|----------------|------------------|---------------------|-------------------|
| Fixture display records | `fixtureId`, `fixtureName`, `fixtureCategory`, `sourcePacketPosture`, `expectedInputFields`, `rejectedFieldCategories`, `blockedFieldCategories`, `simulatedIntakeStatus`, `guardrailStatus`, `closeoutRelationship`, `boundaryCopy` | May reference local JAI Palette class coverage, route-packet compatibility posture, and fixture compatibility posture. | Candidate/display records only; no fixture execution, no automatic intake, no route execution. |
| Stress-test display records | `stressTestId`, `stressTestName`, `riskClass`, `scenarioDescription`, `evidenceRequirement`, `holdBlockTrigger`, `controlThreadDecisionRequirement`, `expectedAdvisoryOutput`, `boundaryCopy` | May reference existing drift risk classes, safe activation ladder, and blocked gates from `sandboxNexusSurface`. | Candidate/display records only; no test execution, runtime activation, sandbox task execution, executable runner, or dispatch. |
| Closeout review display records | `closeoutId`, `closeoutName`, `sourcePacketId`, `intakeStatus`, `acceptedFields`, `rejectedFields`, `blockedFields`, `simulatedActionSummary`, `outputArtifactReferences`, `guardrailFindings`, `nonAuthorizationsPreserved`, `blockers`, `recommendation`, `controlThreadReviewStatus`, `boundaryCopy` | May reference local closeout contribution copy from JAI Palette profiles and existing Closeout Review module posture. | Candidate/display records only; no closeout generation, acceptance authority, activation authority, executable authority, production authority, or source-of-truth authority. |
| Shared boundary references | `blockedAuthorities`, `controlThreadAuthority`, `advisoryStatement`, `nonAuthorizationCopy` | May reuse local JAI Palette blocked-authority and authority/advisory constants where safe. | Negated boundary copy only; no behavior. |
| Substrate evidence references | `substrateLabel`, `evidenceReference`, `crossRepoPosture`, `importBoundary` | May cite `sandbox-nexus` `.nexus` posture as static cross-repo evidence only. | No direct import, no sandbox-nexus call, no automatic sync, no file-system watcher, no target-repo mutation/import. |

## 8. Candidate metadata posture

B20 preserves candidate metadata posture:

- B20 plans fixture entries as candidate/display records only.
- B20 plans stress-test entries as candidate/display records only.
- B20 plans closeout entries as candidate/display records only.
- B20 distinguishes display fields from accepted source, executable task, runtime state, activation state, production state, and authoritative source-of-truth state.
- B20 does not authorize creating source constants, types, schemas, tests, UI implementation, API routes, database records, sync jobs, execution handlers, runtime handlers, imports, or provider/model/API dispatch.

## 9. JAI Palette constant relationship

B20 plans that future fixture/stress/closeout display metadata may relate to existing local JAI Palette constants through local imports only, if separately routed.

B20 identifies safe future relationships:

- agent class coverage may inform fixture category, stress risk ownership, and closeout contribution display.
- candidate metadata primitives may inform display labels without creating executable agent runtime.
- blocked authorities may remain visible in all fixture, stress-test, and closeout display groups.
- CONTROL_THREAD authority copy may remain visible as review/accept/hold authority copy only.
- advisory/non-authoritative copy may remain visible as display posture copy only.
- route-packet compatibility posture may inform source packet and expected input fields.
- fixture compatibility posture may inform fixture readiness, evidence, guardrail, and closeout relationship display.

B20 rejects external JAI Palette calls, provider/model/API dispatch, JAI Agent execution, autonomous execution, and any inference that JAI Palette candidate metadata is accepted, executable, activated, authoritative, or production-ready.

## 10. sandbox.nexus surface data relationship

B20 plans fixture/stress/closeout display metadata as optional future detail under existing `sandboxNexusSurface` ownership.

B20 preserves `sandboxNexusSurface` ownership over:

- Fixture Intake module grouping and display posture.
- Stress-Test Plan module grouping and display posture.
- Closeout Review module grouping and display posture.
- Blocked Gates visibility.
- Safe Activation Ladder display.
- Drift / Hallucination Control Panel display.
- Next Route Panel recommendation posture.
- surface layout, state vocabulary, relationships, and authority boundary copy.

B20 distinguishes module detail from behavior. Fixture Intake detail would remain no automatic intake and no sandbox task execution. Stress-Test Plan detail would remain no live sandbox runtime and no executable runner. Closeout Review detail would remain not CONTROL_THREAD acceptance and not closeout generation.

## 11. sandbox-nexus .nexus substrate relationship

B20 plans the relationship to the `sandbox-nexus` `.nexus` substrate as static cross-repo evidence only.

B20 preserves:

- no sandbox-nexus call
- no direct import from `sandbox-nexus`
- no automatic sync
- no file-system watcher
- no accepted-code import
- no source-of-truth transfer
- no target-repo mutation/import
- no runtime activation
- no sandbox task execution

B20 distinguishes `sandbox.nexus` as an experimental product/domain concept, `sandbox-nexus` as repo/substrate evidence, and `dev.jai.nexus` as the app-local control-plane surface.

## 12. Blocked authority preservation

| Blocked authority | Applies to fixture intake? | Applies to stress-test plan? | Applies to closeout review? | Boundary finding |
|-------------------|----------------------------|------------------------------|-----------------------------|------------------|
| Fixture execution | Yes | Yes | Yes | B20 preserves blocked fixture execution across all planned displays. |
| Stress-test execution | Yes | Yes | Yes | B20 preserves blocked stress-test execution and keeps stress plans display-only. |
| Closeout generation | Yes | Yes | Yes | B20 preserves blocked closeout generation and plans closeout review as candidate metadata only. |
| External import | Yes | Yes | Yes | B20 preserves no external import and local-static posture. |
| sandbox-nexus calls | Yes | Yes | Yes | B20 preserves no sandbox-nexus call and no direct substrate runtime relationship. |
| Automatic sync | Yes | Yes | Yes | B20 preserves no automatic sync, no watcher, and no background reconciliation. |
| API routes | Yes | Yes | Yes | B20 preserves no new API route for fixture, stress, or closeout display metadata. |
| Database migration | Yes | Yes | Yes | B20 preserves no database migration and no database-backed intake. |
| DNS change | Yes | Yes | Yes | B20 preserves no DNS change and no live domain activation. |
| Deployment | Yes | Yes | Yes | B20 preserves no deployment path. |
| Sandbox runtime activation | Yes | Yes | Yes | B20 preserves no sandbox runtime activation. |
| Sandbox task execution | Yes | Yes | Yes | B20 preserves no sandbox task execution. |
| Executable runner | Yes | Yes | Yes | B20 preserves no executable runner behavior. |
| Autonomous JAI Agent execution | Yes | Yes | Yes | B20 preserves no autonomous JAI Agent execution. |
| Provider/model/API dispatch | Yes | Yes | Yes | B20 preserves no provider/model/API dispatch. |
| GitHub API calls | Yes | Yes | Yes | B20 preserves no GitHub API call or automation. |
| Target-repo mutation/import | Yes | Yes | Yes | B20 preserves no target-repo mutation/import. |
| Accepted-code import | Yes | Yes | Yes | B20 preserves no accepted-code import. |
| Production gates | Yes | Yes | Yes | B20 preserves blocked production gates. |
| Source-of-truth transfer | Yes | Yes | Yes | B20 preserves no source-of-truth transfer. |
| Hidden/background automation | Yes | Yes | Yes | B20 preserves no hidden/background automation. |
| Timers | Yes | Yes | Yes | B20 preserves no timers. |
| Polling | Yes | Yes | Yes | B20 preserves no polling. |
| Background jobs | Yes | Yes | Yes | B20 preserves no background jobs. |

## 13. Rejected implementation paths

| Rejected path | Reason rejected | Risk avoided |
|---------------|-----------------|--------------|
| Fixture execution | Outside planning-only and display-only scope. | Sandbox task execution, route execution, runtime authority. |
| Stress-test execution | Stress-test plan is candidate/display metadata only. | Executable runner, runtime activation, production readiness overclaim. |
| Closeout generation | Closeout review display is not a generator or acceptance path. | Acceptance authority, source-of-truth transfer, closeout authority drift. |
| Direct `sandbox-nexus` import | Cross-repo import would blur substrate and app-local surface boundaries. | External import, source-of-truth transfer, target-repo import. |
| Runtime sandbox-nexus call | Runtime calls are not authorized and would imply live substrate behavior. | sandbox-nexus call, runtime activation, sandbox task execution. |
| Automatic sync | Sync would create implicit import and hidden state changes. | Automatic sync, background automation, source-of-truth drift. |
| File-system watcher | Watchers would create background behavior outside display-only planning. | Hidden/background automation, automatic import. |
| API route | API routes would add server behavior outside the docs/reference lane. | API route behavior, runtime coupling. |
| Database-backed intake | Persistence would require schema and authority decisions outside B20. | Database migration, authoritative-state ambiguity. |
| Runtime handler | Runtime handlers would imply executable behavior. | Runtime activation, sandbox task execution, executable runner. |
| Provider/model/API-assisted evaluation | External evaluation would require dispatch authority. | Provider/model/API dispatch and credential risk. |
| GitHub API-assisted import | GitHub API import would add external automation. | GitHub API call, target-repo import, PR automation risk. |
| Target-repo import | Target-repo import exceeds local-static display planning. | Target-repo mutation/import authority collapse. |
| Accepted-code import | Accepted-code import is not part of candidate display metadata. | Accepted-code import without route authority. |
| Deployment/DNS path | Deployment or DNS work would misread `sandbox.nexus` as live domain activation. | DNS change, deployment, production gate risk. |
| Production-gate path | Production readiness is not authorized by planning display. | Production gate opening and authority drift. |
| Background job/timer/polling path | Background behavior conflicts with static display posture. | Hidden/background automation, timers, polling, background jobs. |

## 14. Drift-control implications

B20 plans drift-control implications for future implementation:

- Fixture display detail must not drift from candidate metadata into fixture execution, automatic intake, route execution, accepted-code import, or source-of-truth transfer.
- Stress-test plan detail must not drift from advisory planning into test execution, executable runner behavior, runtime activation, sandbox task execution, provider/model/API dispatch, or production readiness.
- Closeout review detail must not drift from display review into closeout generation, acceptance authority, route authority, activation authority, executable authority, source-of-truth authority, or production authority.
- Local JAI Palette constant reuse must not collapse JAI Palette draft statuses with CONTROL_THREAD acceptance, executable state, activated state, authoritative state, or production state.
- `sandbox-nexus` substrate references must remain static cross-repo evidence only and must not become import, sync, call, watcher, mutation, or source-of-truth paths.
- Future implementation should keep blocked authorities visible wherever fixture, stress-test, and closeout display records appear.

## 15. B21 route options

| B21 option | Route type | When appropriate | Boundary |
|------------|------------|------------------|----------|
| `B21 sandbox.nexus Fixture / Stress / Closeout Display Implementation v0` | Implementation | Appropriate if CONTROL_THREAD wants app-local source implementation of the planned static display detail and no B20 blocker is found. | App-local, local-static display metadata only; no execution, no external import, no sandbox-nexus call, no runtime, no dispatch, no mutation/import, no deployment, no production gates. |
| `B21 sandbox.nexus Fixture / Stress / Closeout Display Boundary Review v0` | Review | Appropriate if CONTROL_THREAD wants a review before implementation. | Review-only; no implementation and no behavior. |
| `B21 sandbox.nexus Fixture / Stress / Closeout Display Acceptance Receipt v0` | Receipt | Appropriate only if CONTROL_THREAD wants to record acceptance of planning posture without implementation. | Receipt-only; no implementation and no runtime authority. |
| Hold | Hold | Appropriate if CONTROL_THREAD wants to pause the fixture/stress/closeout lane or resolve another blocker first. | No route progression. |

## 16. Recommended B21 route

B20 finds no blocker before a separately routed implementation lane.

B20 recommends:

`B21 sandbox.nexus Fixture / Stress / Closeout Display Implementation v0`

Recommended branch:

`feature/q3m7-sandbox-dot-nexus-fixture-stress-closeout-display-v0`

Recommended posture:

- app-local source implementation
- local-static display metadata only
- display-only fixture intake module detail
- display-only stress-test plan module detail
- display-only closeout review module detail
- preserve candidate metadata only
- preserve non-authoritative posture
- preserve CONTROL_THREAD review/accept/hold authority
- no fixture execution
- no stress-test execution
- no closeout generation
- no external import
- no sandbox-nexus call
- no automatic sync
- no API routes
- no database migration
- no runtime activation
- no sandbox task execution
- no executable runner
- no provider/model/API dispatch
- no target-repo mutation/import
- no accepted-code import
- no DNS change
- no deployment
- no production gates

B20 does not authorize B21 implementation. CONTROL_THREAD routing and acceptance remain future.

## 17. Validation

B20 validation performed:

- `git diff --check`
- `git diff --cached --check`
- targeted non-authorization scan across `docs/reference`, `docs/reviews`, `portal/src/lib/controlPlane`, and `portal/src/app/operator`

B20 did not run source validation because B20 made no source or test changes. B20 did not run migration tests, apply migrations, run Prisma migration commands, connect to deployed databases, call APIs, call providers/models, execute `sandbox-nexus`, activate JAI Agents, mutate target repos, import accepted code, deploy, or perform DNS changes.

## 18. Authority boundary

B20 preserves:

- docs/reference planning-only
- app-local
- local-static display
- display-only
- non-authoritative
- advisory-output-only
- candidate-metadata-only
- no implementation unless separately routed
- no external import
- no sandbox-nexus call
- no automatic sync
- no API routes
- no database migration
- no DNS change
- no deployment
- no sandbox runtime activation
- no sandbox task execution
- no executable runner
- no autonomous JAI Agent execution
- no provider/model/API dispatch
- no target-repo mutation/import
- no accepted-code import
- no production gates
- no source-of-truth transfer
- no hidden/background automation
- no timers
- no polling
- no background jobs

B20 does not authorize CONTROL_THREAD acceptance.

## 19. Repo-lane closeout

B20 plans display-only fixture intake module detail with fixture name/id, category, source packet posture, expected input fields, rejected and blocked field categories, simulated intake status, guardrail status, advisory-only closeout relationship, and explicit no sandbox execution, no automatic intake, and no route execution copy.

B20 plans display-only stress-test plan module detail with stress-test id/name, risk class, scenario description, evidence requirement, hold/block trigger, CONTROL_THREAD decision requirement, expected advisory output, and explicit no executable runner, no runtime activation, and no sandbox task execution copy.

B20 plans display-only closeout review module detail with closeout id/name, source packet id, intake status, accepted/rejected/blocked fields, simulated action summary, output artifact references, guardrail findings, non-authorizations preserved, blockers, recommendation, CONTROL_THREAD review status placeholder, and advisory/non-authoritative posture.

B20 plans a local-static display metadata shape only and preserves candidate metadata posture for fixture, stress-test, and closeout records.

B20 preserves the JAI Palette constant relationship as local reference/reuse planning only and preserves `sandboxNexusSurface` ownership of layout, modules, state display, blocked gates, safe activation ladder, drift model, relationships, and next-route posture.

B20 preserves the `sandbox-nexus` `.nexus` substrate relationship as static cross-repo evidence only.

B20 rejects unsafe paths including fixture execution, stress-test execution, closeout generation, direct `sandbox-nexus` import, runtime sandbox-nexus call, automatic sync, file-system watcher, API route, database-backed intake, runtime handler, provider/model/API-assisted evaluation, GitHub API-assisted import, target-repo import, accepted-code import, deployment/DNS path, production-gate path, and background job/timer/polling path.

B20 recommends B21 as `sandbox.nexus Fixture / Stress / Closeout Display Implementation v0` if CONTROL_THREAD routes implementation next.
