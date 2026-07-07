# Q3M7 Sandbox Packet Control Surface Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

B28 plans the `dev.jai.nexus` operator-facing control surface needed to draft, inspect, export, and later supervise sandbox-local packets for `sandbox-nexus`.

B28 is docs/reference planning-only. B28 does not implement a control surface, packet generator, packet executor, receipt ingestion path, sandbox runtime, API route, database migration, provider/model dispatch, GitHub API mutation, target-repo mutation/import, accepted-code import, deployment, production gate, hidden automation, timer, polling, or background job.

B28 preserves app-local, non-authoritative, advisory display/export planning only. CONTROL_THREAD remains the review/accept/hold authority.

## 2. Accepted route baseline

B28 uses the accepted local `sandbox.nexus` planning/display chain as baseline:

- The existing `sandbox.nexus` operator surface is app-local, local-static, display-only, non-authoritative, advisory-output-only, candidate-metadata-only, and human-supervised.
- Fixture Intake, Stress-Test Plan, and Closeout Review display modules exist as static display metadata.
- B22 confirmed those displays remain non-executing and non-generating.
- JAI Palette constants provide local sandbox agent classes, candidate metadata primitives, blocked authorities, route-packet compatibility posture, fixture compatibility posture, CONTROL_THREAD authority copy, and advisory/non-authoritative copy.
- `sandbox-nexus` remains future sandbox-local target posture only; no calls, imports, sync, runtime activation, sandbox task execution, target-repo mutation/import, accepted-code import, or source-of-truth transfer are authorized.

## 3. Files inspected

B28 inspected:

- `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.ts`
- `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.test.ts`
- `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.ts`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `docs/reference/q3m7-sandbox-dot-nexus-fixture-stress-closeout-display-planning-v0.md`
- `docs/reviews/B22_SANDBOX_DOT_NEXUS_FIXTURE_STRESS_CLOSEOUT_DISPLAY_BOUNDARY_REVIEW_V0.md`
- `docs/reference/q3m7-sandbox-dot-nexus-static-operator-surface-data-wiring-planning-v0.md`
- `portal/src/lib/controlPlane/`
- `portal/src/app/operator/control-thread/`
- `docs/reference/`
- `docs/reviews/`

B28 found the expected prior B-lane files discoverable on current `main`. No evidence limitation was found for the required sources.

## 4. Operator surface purpose

B28 plans a future app-local sandbox packet control surface that lets an operator:

- select a sandbox motion candidate
- select a fixture candidate
- select a sandbox role/class candidate
- inspect allowed input categories
- inspect blocked authorities
- preview a sandbox packet draft shape
- manually export a sandbox packet draft
- display a future receipt posture if separately routed
- hand the packet/receipt posture to CONTROL_THREAD for review, accept, or hold

B28 distinguishes packet drafting/export planning from packet execution. The planned surface must not execute motions, ingest fixtures automatically, call `sandbox-nexus`, dispatch providers/models/APIs, mutate GitHub or target repos, import accepted code, deploy, open production gates, or transfer source-of-truth authority.

## 5. Sandbox motion selection planning

| Motion field | Planned display meaning | Allowed posture | Blocked behavior |
|--------------|--------------------------|-----------------|------------------|
| Motion id | Stable local identifier for the selected sandbox motion candidate. | Display-only selection metadata. | No motion execution. |
| Motion name | Human-readable operator label. | Advisory label only. | No route authority or runtime authority. |
| Motion category | Classification such as fixture review, stress planning, closeout review, guardrail review, or escalation planning. | Planning taxonomy only. | No automatic route execution. |
| Motion purpose | Text explaining why the packet is being drafted. | Operator-readable planning copy. | No provider/model/API-assisted generation. |
| Required fixture class | Fixture class needed by the motion. | Compatibility display only. | No fixture ingestion or validation as source of truth. |
| Required sandbox role/class | Sandbox role or `JAI::SANDBOX::AGENTS` class expected to inspect the packet later if separately routed. | Candidate role/class relationship only. | No JAI Agent activation or autonomous execution. |
| Allowed input categories | Motion-specific allowed metadata categories. | Display guidance only. | No parser authority or schema enforcement authority. |
| Blocked authority categories | Motion-specific blocked authority summary. | Required boundary copy. | No capability represented as allowed when blocked. |
| Draft/export eligibility | Whether the selected motion is eligible for manual draft/export. | Operator review flag only. | No automatic send or sandbox-nexus call. |
| CONTROL_THREAD review status placeholder | Placeholder such as pending, held, or reviewed. | Handoff display only. | Placeholder is not CONTROL_THREAD acceptance. |

B28 preserves that motion selection is advisory display only and does not execute a motion.

## 6. Fixture selection planning

| Fixture field | Planned display meaning | Allowed posture | Blocked behavior |
|---------------|--------------------------|-----------------|------------------|
| Fixture id | Stable local identifier for the selected fixture candidate. | Display-only fixture reference. | No fixture execution. |
| Fixture name | Human-readable fixture label. | Advisory label only. | No source-of-truth designation. |
| Fixture category | Category such as fixture/manual intake, guardrail review, stress scenario, or closeout review. | Planning taxonomy only. | No automatic intake. |
| Source packet posture | Relationship to manual route-packet or sandbox packet export posture. | Manual/app-local reference only. | No route execution and no delivery proof. |
| Expected input fields | Non-secret metadata fields expected by the fixture. | Display guidance only. | No parser authority or schema enforcement authority. |
| Rejected field categories | Secret-bearing or unsafe categories that must not enter the packet. | Boundary copy. | No secret ingestion, endpoint capture, provider key capture, GitHub token capture, deployment data, or DNS record capture. |
| Blocked field categories | Runtime, task, runner, mutation/import, accepted-code import, production, and background automation fields. | Blocked display copy. | No runtime/task/execution/import/deployment metadata. |
| Guardrail status | Static status such as blocked authorities preserved. | Advisory status only. | No guardrail engine activation. |
| Compatibility posture | Fixture/manual compatibility with future sandbox-local handling. | Planning compatibility only. | No sandbox runtime activation or sandbox task execution. |
| No automatic intake | Explicit copy that packet/fixture intake is manual only. | Required boundary copy. | No automatic intake or hidden sync. |
| No sandbox execution | Explicit copy that fixture selection does not execute sandbox work. | Required boundary copy. | No sandbox task execution. |
| No route execution | Explicit copy that compatibility does not imply route execution. | Required boundary copy. | No automatic route execution. |

B28 preserves that fixture selection is advisory display only and does not ingest, execute, validate as source of truth, or route anything automatically.

## 7. Sandbox role / class selection planning

| Role/class field | Planned display meaning | Allowed posture | Blocked behavior |
|------------------|--------------------------|-----------------|------------------|
| Sandbox role/class id | Stable local identifier for selected role/class candidate. | Display-only candidate metadata. | No agent activation. |
| Role/class name | Human-readable role/class label. | Advisory label only. | No executable agent availability claim. |
| JAI role label | Relationship to `JAI::SANDBOX::AGENTS` or future `JAI::DEV::AGENTS` labels. | Candidate taxonomy display only. | No autonomous JAI Agent execution. |
| Candidate responsibility | Planned inspection or closeout contribution. | Coverage planning only. | No runtime task assignment. |
| Allowed packet fields | Packet fields the role/class may inspect later if separately routed. | Display guidance only. | No schema authority or parser authority. |
| Blocked packet fields | Unsafe fields the role/class must reject or display as blocked. | Boundary copy. | No credentials, runtime endpoints, execution commands, mutation/import commands, deployment data, or DNS records. |
| Authority limits | Explicit non-authorizations for the role/class. | Required boundary copy. | No acceptance, route, activation, executable, source-of-truth, closeout, or production authority. |
| Relationship to JAI Palette sandbox agent classes | Local relationship to `JAI_SANDBOX_AGENT_CLASSES` and class profiles. | Local static candidate metadata only. | No provider/model/API dispatch and no JAI Agent activation. |
| Candidate metadata only | Role/class is a draft/candidate display record. | Required posture. | No active, live, executing, accepted, or authoritative state. |
| No autonomous execution | Explicit copy that no autonomous execution occurs. | Required boundary copy. | No loops, jobs, schedulers, or agent executor. |

B28 preserves that role/class selection is candidate metadata only and does not activate an agent.

## 8. Allowed inputs display planning

| Input category | Allowed display meaning | Validation posture | Boundary |
|----------------|-------------------------|--------------------|----------|
| Selected motion id | References the operator-selected sandbox motion candidate. | Presence check planning only. | Not execution authority. |
| Selected fixture id | References the operator-selected fixture candidate. | Presence check planning only. | Not source-of-truth authority. |
| Selected role/class id | References the selected sandbox role/class candidate. | Presence check planning only. | Not JAI Agent activation. |
| Operator note | Human-authored non-secret note explaining context. | Manual review only. | Must exclude secrets, credentials, customer data, endpoint tokens, and production telemetry. |
| Packet purpose | Human-readable purpose for the packet draft. | Review copy only. | Not route authority. |
| Advisory expected output | Planned advisory output shape. | Display/export planning only. | Not closeout generation. |
| Review request | Manual request for CONTROL_THREAD review/accept/hold. | Handoff label only. | Not acceptance or approval. |
| Receipt placeholder | Optional placeholder for future receipt relationship. | Display-only placeholder. | Not receipt ingestion or delivery proof. |

Allowed input display must not become parser authority, schema enforcement authority, runtime execution authority, delivery proof, or source-of-truth authority.

## 9. Blocked authorities display planning

| Blocked authority | Applies to packet drafting? | Applies to packet export? | Applies to receipt display? | Boundary |
|-------------------|-----------------------------|---------------------------|-----------------------------|----------|
| Sandbox runtime activation | Yes | Yes | Yes | Runtime activation remains blocked. |
| Sandbox task execution | Yes | Yes | Yes | Packet display/export must not execute sandbox tasks. |
| Fixture execution | Yes | Yes | Yes | Fixture selection is display-only. |
| Stress-test execution | Yes | Yes | Yes | Stress planning is display-only. |
| Closeout generation | Yes | Yes | Yes | Receipt/closeout display must not generate closeouts. |
| Provider/model/API dispatch | Yes | Yes | Yes | No provider/model/API dispatch or credentials. |
| GitHub API mutation | Yes | Yes | Yes | No GitHub API mutation, PR automation, or repo mutation. |
| Target-repo mutation/import | Yes | Yes | Yes | No target-repo write/import path. |
| Accepted-code import | Yes | Yes | Yes | No accepted-code import bridge. |
| Automatic intake | Yes | Yes | Yes | No automatic packet or fixture intake. |
| Automatic route execution | Yes | Yes | Yes | No automatic route execution. |
| External import | Yes | Yes | Yes | No direct import from `sandbox-nexus` or other external repo. |
| `sandbox-nexus` calls | Yes | Yes | Yes | No runtime call, client, endpoint, or submission. |
| API routes | Yes | Yes | Yes | B28 does not plan an API route for implementation. |
| Database migration | Yes | Yes | Yes | No database-backed packet store in B28. |
| Deployment | Yes | Yes | Yes | No deployment path. |
| Production gates | Yes | Yes | Yes | No production readiness or gate opening. |
| Source-of-truth transfer | Yes | Yes | Yes | Packets and receipts remain advisory/non-authoritative. |
| Hidden/background automation | Yes | Yes | Yes | No hidden jobs, schedulers, or watchers. |
| Timers | Yes | Yes | Yes | No timer-based behavior. |
| Polling | Yes | Yes | Yes | No polling behavior. |
| Background jobs | Yes | Yes | Yes | No background job behavior. |

## 10. Sandbox packet draft shape

| Packet draft field | Planned meaning | Source relationship | Boundary |
|--------------------|-----------------|---------------------|----------|
| `packetId` | Local placeholder or generated draft id. | Future app-local implementation may generate client-side/local id. | Not delivery proof or authority. |
| `packetType` | Draft type such as `sandbox_packet_candidate`. | New local display/export metadata. | Not executable packet authority. |
| `selectedSandboxMotion` | Selected motion id/name/category/purpose. | Future local motion candidate list. | Motion selection does not execute. |
| `selectedFixture` | Selected fixture id/name/category/source posture. | Existing Fixture Intake display planning and future local fixture candidates. | Fixture selection does not ingest or execute. |
| `selectedSandboxRoleClass` | Selected role/class candidate. | JAI Palette sandbox agent classes/class profiles may inform options. | Does not activate JAI Agent. |
| `allowedInputsSummary` | Non-secret metadata fields included by operator. | Operator-entered/display-only fields. | Not parser/schema/runtime authority. |
| `blockedAuthoritiesSummary` | Blocked authorities visible in the packet. | `SANDBOX_NEXUS_BLOCKED_GATES`, JAI Palette blocked authorities, and B22 blocked posture. | Negated guardrail copy only. |
| `advisoryOutputRequest` | Requested advisory output shape. | Operator selection and existing stress/closeout display posture. | Not closeout generation. |
| `receiptExpectation` | Expected future receipt posture if separately routed. | Receipt display planning. | Not receipt ingestion or acceptance. |
| `controlThreadReviewHandoff` | Manual review/accept/hold handoff copy. | CONTROL_THREAD authority copy. | Not CONTROL_THREAD acceptance. |
| `exportMetadata` | Manual export format, timestamp placeholder, operator-reviewed label. | Future local export draft metadata. | No automatic send. |
| `nonAuthorizationCopy` | Explicit no-runtime/no-dispatch/no-mutation/no-import/no-deploy copy. | Existing blocked authorities and B22 review posture. | Packet is not execution authority. |

B28 plans draft shape only. The draft shape must not become executable packet authority.

## 11. Sandbox packet export shape

| Export field | Planned meaning | Export posture | Boundary |
|--------------|-----------------|----------------|----------|
| `jsonExport` | Structured JSON packet draft content. | Future manual copy/export only. | No automatic send, upload, post, or sync. |
| `markdownExport` | Human-readable Markdown packet draft content. | Future manual copy/export only. | Not delivery proof. |
| `operatorReviewed` | Boolean/label indicating operator inspected the draft before export. | Manual operator display flag. | Not CONTROL_THREAD acceptance. |
| `advisoryOnlyLabel` | Explicit label that export is advisory and non-authoritative. | Required export copy. | No source-of-truth transfer. |
| `manualHandoffInstructions` | Text telling operator how to hand off manually if separately routed. | Display/export copy only. | No automatic route execution. |
| `noAutomaticSend` | Explicit no-send copy. | Required boundary copy. | No sandbox-nexus call. |
| `noSandboxNexusCall` | Explicit no `sandbox-nexus` call copy. | Required boundary copy. | No runtime/client/endpoint. |
| `noGitHubApiMutation` | Explicit no GitHub API mutation copy. | Required boundary copy. | No PR, issue, branch, or repo mutation automation. |
| `noTargetRepoMutation` | Explicit no target-repo mutation/import copy. | Required boundary copy. | No target-repo write/import path. |
| `noAcceptedCodeImport` | Explicit no accepted-code import copy. | Required boundary copy. | No accepted-code import bridge. |

B28 does not implement export.

## 12. Receipt display posture

| Receipt field | Planned meaning | Display posture | Boundary |
|---------------|-----------------|-----------------|----------|
| Receipt id placeholder | Future local display identifier for a receipt. | Placeholder only. | Not receipt ingestion implementation. |
| Packet id relationship | Relationship to manually exported packet id. | Advisory relationship display. | Not delivery proof. |
| Receipt source posture | Human-entered or separately routed receipt source description. | Display-only source label. | No `sandbox-nexus` call or automatic import. |
| Received status | Candidate received/rejected/held label. | Advisory display status only. | Not CONTROL_THREAD acceptance. |
| Accepted fields | Fields that appear usable in the receipt. | Display list only. | Not acceptance authority. |
| Rejected fields | Secret/unsafe/invalid fields rejected for display. | Boundary list. | No secret or credential ingestion. |
| Held fields | Fields requiring CONTROL_THREAD review. | Review queue label. | No automatic hold action. |
| Blockers | Static blocker list. | Advisory blocker display. | No gate opening or route execution. |
| Non-authorizations preserved | Explicit preserved blocked authority list. | Required display copy. | No runtime, execution, dispatch, mutation, import, deployment, production, or source-of-truth authority. |
| Recommendation | Advisory next-step copy. | Recommendation only. | CONTROL_THREAD decides. |
| CONTROL_THREAD review status placeholder | Pending/accepted/held/rejected placeholder. | Manual review label only. | Placeholder is not acceptance. |

Receipt display must not imply receipt acceptance, closeout generation, route authority, runtime authority, delivery proof, or source-of-truth transfer.

## 13. CONTROL_THREAD review / accept / hold handoff

B28 plans this manual handoff:

1. Operator selects a sandbox motion candidate.
2. Operator selects a fixture candidate.
3. Operator selects a sandbox role/class candidate.
4. Operator reviews allowed inputs and blocked authorities.
5. Operator previews the sandbox packet draft.
6. Operator exports the packet manually only if future implementation is separately routed.
7. Downstream sandbox-local handling happens only if separately routed.
8. Receipt display remains advisory until CONTROL_THREAD reviews it.
9. CONTROL_THREAD may accept, reject, or hold.
10. No automatic route execution, hidden automation, runtime activation, or sandbox task execution occurs.

B28 preserves that packet draft/export/receipt posture is not CONTROL_THREAD acceptance.

## 14. Relationship to existing sandbox.nexus surface

B28 plans the packet control surface as an adjacent operator surface or section related to the existing `sandbox.nexus` modules:

- Sandbox Overview: provides product/domain framing and app-local/non-authoritative posture.
- JAI Palette Drafts: informs sandbox role/class candidate options.
- Agent Coverage Map: informs role/class coverage and packet inspection responsibility.
- Fixture Intake: informs fixture selection and expected input fields.
- Stress-Test Plan: informs motion categories, evidence requirements, and hold/block triggers.
- Closeout Review: informs receipt display posture and non-authorizations preserved.
- Blocked Gates: supplies blocked authority display.
- Safe Activation Ladder: keeps runtime activation, agent activation, deployment, and production gates separated from draft/export planning.
- Drift / Hallucination Control Panel: supplies overclaim risk classes for packet/receipt display.
- Next Route Panel: can display future B29 route recommendation only if separately implemented.

B28 does not implement UI changes.

## 15. Relationship to JAI Palette constants

B28 plans a possible local-only relationship to JAI Palette constants:

- sandbox agent classes may inform role/class selection options
- candidate metadata primitives may inform role/class descriptions
- blocked authorities may inform packet blocked-authority display
- CONTROL_THREAD authority copy may inform packet handoff copy
- advisory/non-authoritative copy may inform packet/export labels
- route-packet compatibility posture may inform motion and fixture compatibility display
- fixture compatibility posture may inform receipt expectation and closeout relationship display

B28 does not plan provider/model/API dispatch, JAI Agent activation, or autonomous execution.

## 16. Relationship to sandbox-nexus

B28 plans `sandbox-nexus` as a future sandbox-local target posture only.

B28 preserves:

- no `sandbox-nexus` calls
- no direct import from `sandbox-nexus`
- no automatic sync
- no file-system watcher
- no accepted-code import
- no source-of-truth transfer
- no target-repo mutation/import
- no runtime activation
- no sandbox task execution

Future packet export, if separately routed, remains manual operator handoff only.

## 17. Rejected implementation paths

| Rejected path | Reason rejected | Risk avoided |
|---------------|-----------------|--------------|
| Implementing the control surface in B28 | B28 is docs/reference planning-only. | Unauthorized source/UI changes. |
| Fixture execution | B28 plans fixture selection only. | Sandbox task execution and source-of-truth drift. |
| Stress-test execution | B28 plans stress-test packet metadata only. | Runtime activation and executable runner drift. |
| Closeout generation | B28 plans receipt display posture only. | Closeout authority and acceptance drift. |
| Automatic sandbox packet send | Manual handoff remains required. | Hidden route execution and sandbox-nexus call risk. |
| Direct `sandbox-nexus` import | Cross-repo import is not authorized. | External import and source-of-truth transfer. |
| Runtime `sandbox-nexus` call | Runtime calls imply sandbox availability. | Sandbox runtime activation and task execution. |
| Automatic sync | Sync would create background behavior. | Hidden automation and source drift. |
| File-system watcher | Watchers create implicit import/sync behavior. | Background automation and source-of-truth confusion. |
| API route | B28 does not plan server behavior. | Runtime/API surface expansion. |
| Database-backed packet store | Persistence/storage authority is not routed. | Database migration and authority ambiguity. |
| Runtime handler | Runtime handling would make packets executable. | Runtime activation and execution drift. |
| Provider/model/API-assisted packet generation | External generation is outside B28. | Provider/model/API dispatch and credential risk. |
| GitHub API mutation | GitHub mutation is blocked. | PR/repo mutation and automation risk. |
| Target-repo import | Target-repo import is blocked. | Target-repo mutation/import authority drift. |
| Accepted-code import | Accepted-code import is blocked. | Code import authority drift. |
| Deployment/DNS path | Deployment and DNS are blocked. | Live domain/deployment drift. |
| Production-gate path | Production gates are blocked. | Production authority drift. |
| Background job/timer/polling path | Background automation is blocked. | Hidden automation and unsupervised execution. |

## 18. Drift-control implications

B28 identifies these packet-control drift risks:

- Motion selection could be misread as motion execution.
- Fixture selection could be misread as fixture ingestion or source-of-truth validation.
- Role/class selection could be misread as JAI Agent activation.
- Allowed input display could be misread as schema enforcement or parser authority.
- Packet draft shape could be misread as executable packet authority.
- Export shape could be misread as delivery proof or automatic send.
- Receipt display could be misread as closeout generation or CONTROL_THREAD acceptance.
- `sandbox-nexus` relationship could be misread as runtime availability or external import.
- JAI Palette relationship could be misread as provider/model/API dispatch or autonomous agent behavior.

B28 plans mitigation through explicit blocked-authority display, advisory/non-authoritative labels, manual-only handoff copy, receipt placeholder copy, and CONTROL_THREAD review/accept/hold handoff.

## 19. B29 route options

| B29 option | Route type | When appropriate | Boundary |
|------------|------------|------------------|----------|
| `B29 Sandbox Packet Control Surface Implementation v0` | Implementation | Appropriate if CONTROL_THREAD wants a minimal app-local source implementation of draft/display/manual export metadata. | App-local, local-static display/export draft metadata only; no automatic send or runtime behavior. |
| `B29 Sandbox Packet Control Surface Boundary Review v0` | Review | Appropriate if CONTROL_THREAD wants another boundary review before implementation. | Review-only; no implementation. |
| `B29 Sandbox Packet Draft / Export Shape Receipt v0` | Docs/reference receipt | Appropriate if CONTROL_THREAD wants to record the planned packet/export/receipt shape before implementation. | Receipt-only; no source changes and no runtime authority. |
| Hold | Hold | Appropriate if CONTROL_THREAD wants to pause packet-surface work. | No route progression. |

## 20. Recommended B29 route

B28 recommends:

`B29 Sandbox Packet Control Surface Implementation v0`

Recommended branch:

`feature/q3m7-sandbox-packet-control-surface-v0`

Recommended posture:

- app-local source implementation
- local-static display/export draft metadata only
- manual operator export only
- no automatic send
- no sandbox runtime activation
- no sandbox task execution
- no provider/model/API dispatch
- no GitHub API mutation
- no target-repo mutation/import
- no accepted-code import
- no deployment
- no production gates

## 21. Validation

B28 validation required:

- `git diff --check`
- `git diff --cached --check` after staging

B28 does not require source validation because B28 should not change source files or tests. B28 did not run migration tests, did not apply migrations, did not run Prisma migration commands, did not connect to deployed databases, did not call APIs, did not call providers/models, did not execute `sandbox-nexus`, did not activate JAI Agents, did not mutate target repos, did not import accepted code, did not deploy, and did not perform DNS changes.

## 22. Authority boundary

B28 is a planning artifact only until CONTROL_THREAD acceptance.

B28 does not authorize implementation source changes, test changes, packet generation implementation, packet export implementation, receipt ingestion implementation, fixture execution, stress-test execution, closeout generation, external imports, `sandbox-nexus` calls, automatic sync, API routes, database migrations, runtime activation, sandbox task execution, executable runner behavior, autonomous JAI Agent execution, provider/model/API dispatch, GitHub API mutation, target-repo mutation/import, accepted-code import, DNS changes, deployment, production gates, source-of-truth transfer, hidden/background automation, timers, polling, background jobs, or CONTROL_THREAD acceptance.

## 23. Repo-lane closeout

B28 planning closeout:

- B28 plans sandbox motion selection, fixture selection, sandbox role/class selection, allowed input display, blocked authority display, sandbox packet draft shape, sandbox packet export shape, receipt display posture, and CONTROL_THREAD handoff.
- B28 distinguishes packet drafting/export planning from packet execution, sandbox runtime, sandbox task execution, provider/model/API dispatch, GitHub API mutation, target-repo mutation/import, accepted-code import, deployment, production gates, source-of-truth transfer, and hidden/background automation.
- B28 rejects unsafe implementation paths including fixture execution, stress-test execution, closeout generation, automatic send, direct `sandbox-nexus` import, runtime calls, sync/watchers, API routes, database-backed storage, runtime handlers, provider/model/API-assisted generation, GitHub API mutation, target-repo import, accepted-code import, deployment/DNS, production gates, and background jobs/timers/polling.
- B28 recommends B29 as `Sandbox Packet Control Surface Implementation v0` with app-local, local-static display/export draft metadata only and manual operator export only.
