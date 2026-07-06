# Q3M7 sandbox.nexus Static Operator Surface Data-Wiring Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

B17 plans local static data wiring between the B15 `sandbox.nexus` static operator surface constants and existing local JAI Palette constants in `dev-jai-nexus`.

B17 is planning-only and docs/reference-only. B17 does not implement data wiring, does not modify source or tests, and does not authorize any future implementation by itself.

B17 preserves app-local, non-authoritative, display-only, candidate-metadata-only, advisory-output-only posture. B17 also preserves no external import, no `sandbox-nexus` calls, no automatic sync, no API routes, no database migration, no runtime activation, no sandbox task execution, no executable runner, no autonomous JAI Agent execution, no provider/model/API dispatch, no target-repo mutation/import, no accepted-code import, no DNS change, no deployment, no production gates, no source-of-truth transfer, and no hidden/background automation.

## 2. Accepted B16 baseline

B17 records the accepted B16 baseline:

- B16 reviewed the B15 static `sandbox.nexus` operator surface prototype.
- B16 confirmed B15 remains app-local, static, display-only, non-authoritative, advisory-output-only, human-supervised, and non-executing.
- B16 confirmed B15 displays required modules, state vocabulary, state-boundary copy, blocked gates, safe activation ladder, drift / hallucination control model, required relationships, and next-route posture.
- B16 found no blocker before a separately routed B17 data-wiring planning lane.

B17 uses that baseline as evidence for planning only. B17 does not treat B16 acceptance as implementation authority.

## 3. Files inspected

B17 inspected:

- `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.ts`
- `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.test.ts`
- `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.ts`
- `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.test.ts`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `docs/reference/q3m7-sandbox-dot-nexus-experimental-surface-definition-v0.md`
- `docs/reviews/B16_SANDBOX_DOT_NEXUS_STATIC_OPERATOR_SURFACE_BOUNDARY_REVIEW_V0.md`
- `portal/src/lib/controlPlane/`
- `portal/src/app/operator/`
- `docs/reference/`
- `docs/reviews/`

B17 found the expected B15 and B16 files present on current `main`. No expected B15/B16 evidence file was absent, renamed, or undiscoverable from repo-local evidence.

## 4. B15 static surface data inventory

| Data area | Current source | Current use | Candidate for reuse? | Boundary |
|-----------|----------------|-------------|----------------------|----------|
| Surface posture | `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.ts` | Defines `sandbox.nexus`, `sandbox-nexus`, `dev.jai.nexus`, CONTROL_THREAD authority, and advisory posture. | Keep owned by `sandboxNexusSurface`; may consume shared authority copy later. | Display-only and non-authoritative. |
| Boundary copy | `sandboxNexusSurface.ts` | Displays no-DNS, no-deployment, no-runtime, no-dispatch, no-mutation/import, no-production, and no-background-automation copy. | Candidate for partial reuse from shared blocked-authority vocabulary. | Must remain negated boundary copy only. |
| Modules | `sandboxNexusSurface.ts` | Drives the ten displayed `sandbox.nexus` modules. | Keep owned by `sandboxNexusSurface`. | Surface layout data only; not behavior. |
| State vocabulary | `sandboxNexusSurface.ts` | Displays `drafted`, `candidate`, `reviewed`, `accepted`, `executable`, `activated`, `authoritative`, `held`, and `blocked` with boundary copy. | Candidate for shared vocabulary planning only; JAI Palette statuses overlap partially. | State labels do not grant acceptance, execution, activation, or authority. |
| State-boundary copy | `sandboxNexusSurface.ts` | Prevents state vocabulary collapse. | Keep owned by surface or future shared boundary module. | Must preserve distinct authority boundaries. |
| Blocked gates | `sandboxNexusSurface.ts` | Displays blocked gates in the B15 panel. | Candidate for local shared blocked-authority constants. | Gates remain blocked until separate CONTROL_THREAD route. |
| Safe activation ladder | `sandboxNexusSurface.ts` | Displays ten-step ladder from reference definition through production gate. | Keep owned by `sandboxNexusSurface`. | Ladder display is not progression. |
| Drift / hallucination risks | `sandboxNexusSurface.ts` | Displays risk class, meaning, required evidence, hold/block trigger, and CONTROL_THREAD decision. | Keep owned by `sandboxNexusSurface`; may consume shared blocked terms later. | Risk display is advisory and does not self-resolve. |
| Relationship entries | `sandboxNexusSurface.ts` | Displays relationships among `sandbox.nexus`, `sandbox-nexus`, `dev.jai.nexus`, JAI Palette, fixture/stress/closeout, and agent candidates. | Candidate for local JAI Palette relationship text reuse only. | No import, sync, mutation, activation, execution, or source-of-truth transfer. |
| Next-route posture | `sandboxNexusSurface.ts` | Displays B16 boundary review recommendation in B15 UI. | Keep lane-specific in `sandboxNexusSurface`; update only under separate route. | Advisory route posture only. |

## 5. JAI Palette local constants inventory

| JAI Palette data area | Current source | Current use | Candidate for wiring? | Boundary |
|-----------------------|----------------|-------------|-----------------------|----------|
| Sandbox agent classes | `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.ts` | Powers B11 agent draft class selector and tests all required `JAI::SANDBOX::AGENTS` classes. | Yes, for `JAI Palette Drafts` and `Agent Coverage Map` display. | Candidate metadata only; no executable agents. |
| Sandbox agent class profiles | `sandboxAgentDraft.ts` | Provides default name, domain, purpose, coverage responsibility, fixture role, and closeout contribution per class. | Yes, for coverage map and relationship summaries. | Static local profile data only. |
| Agent draft field model | `sandboxAgentDraft.ts` interfaces and builders | Defines draft metadata shape and export helpers. | Yes, for future display schema alignment. | Metadata shape only; no runtime. |
| Activation status vocabulary | `JAI_PALETTE_AGENT_ACTIVATION_STATUSES` | Limits agent draft activation status to `draft` and `candidate`. | Partial; can inform surface candidate/drafted display. | Does not imply activated/live status. |
| Review status vocabulary | `JAI_PALETTE_AGENT_REVIEW_STATUSES` | Limits review status to `pending`, `held`, and `reviewed`. | Partial; can inform surface reviewed/held display. | Review status does not equal CONTROL_THREAD acceptance. |
| Blocked authorities | `JAI_PALETTE_BLOCKED_AUTHORITIES` | Included in every draft and tested for no runtime/dispatch/mutation/import/deployment posture. | Yes, candidate for blocked-gate vocabulary reuse. | Negated guardrail copy only. |
| Route-packet compatibility fields | `JaiPaletteRoutePacketCompatibility` and default draft builder | Captures manual route-packet source/posture, expected inputs, and non-execution statements. | Yes, for Fixture Intake and JAI Palette relationship display. | Compatibility does not imply route execution. |
| Sandbox-nexus fixture compatibility fields | `JaiPaletteSandboxFixtureCompatibility` and default draft builder | Captures fixture/manual intake posture, scenario role, closeout/evidence/guardrail contribution, and no-runtime/no-task/no-mutation copy. | Yes, for Fixture Intake, Stress-Test Plan, and Closeout Review display. | Fixture compatibility does not imply runtime or task execution. |
| CONTROL_THREAD authority copy | `JAI_PALETTE_CONTROL_THREAD_AUTHORITY` | Included in drafts and tests. | Yes, for future shared authority copy consideration. | CONTROL_THREAD remains review/accept/hold authority. |
| Advisory/non-authoritative copy | `JAI_PALETTE_ADVISORY_STATEMENT` | Included in drafts and tests. | Yes, for future shared advisory copy consideration. | App-local, non-authoritative candidate metadata only. |
| JSON export helper | `buildJaiPaletteSandboxAgentDraftJson` | Creates manual JSON export text for draft composer. | No direct B15 surface wiring planned; display may reference export shape. | Export is manual and not delivery proof. |
| Markdown export helper | `buildJaiPaletteSandboxAgentDraftMarkdown` | Creates manual Markdown export text for draft composer. | No direct B15 surface wiring planned; display may reference export shape. | Export is manual and not dispatch. |

## 6. Overlap / duplication analysis

| Overlap area | B15 source | JAI Palette source | Duplication risk | Planning finding |
|--------------|------------|--------------------|------------------|------------------|
| `JAI::SANDBOX::AGENTS` classes | Module and relationship text reference sandbox agent coverage. | `JAI_SANDBOX_AGENT_CLASSES` and `JAI_SANDBOX_AGENT_CLASS_PROFILES`. | B15 may drift from JAI Palette class list or coverage profile names. | Future local wiring should consider importing the class list/profiles for coverage display. |
| Candidate metadata posture | `JAI Palette Drafts` module and relationship entries. | Draft schema, `draftKind`, `executableRuntime`, advisory statement. | Surface copy may diverge from draft schema semantics. | Future local wiring can reuse draft metadata primitives without importing exported drafts. |
| Activation / review vocabulary | Surface states include `drafted`, `candidate`, `reviewed`, `held`, and broader ladder states. | Activation statuses `draft`/`candidate`; review statuses `pending`/`held`/`reviewed`. | Terms are related but not identical; unsafe unification could collapse surface state and draft status. | Reuse should be mapped, not blindly merged. |
| Blocked authority copy | `SANDBOX_NEXUS_BLOCKED_GATES` and boundary copy. | `JAI_PALETTE_BLOCKED_AUTHORITIES`. | Wording drift across panels could confuse operators. | Future shared blocked-authority vocabulary may reduce drift if routed carefully. |
| Route-packet compatibility | Fixture Intake module references B5 route-packet compatibility. | `JaiPaletteRoutePacketCompatibility` default fields. | Surface may understate no-route-execution copy. | Future wiring can consume local compatibility labels for display only. |
| Sandbox-nexus fixture compatibility | Fixture, Stress-Test, and Closeout modules. | `JaiPaletteSandboxFixtureCompatibility` default fields. | Surface may overclaim fixture readiness or miss no-runtime/no-task copy. | Future wiring can map fixture compatibility fields into display summaries. |
| CONTROL_THREAD authority copy | `SANDBOX_NEXUS_SURFACE_POSTURE.authority` and state boundaries. | `JAI_PALETTE_CONTROL_THREAD_AUTHORITY`. | Slight wording drift could imply different authority scope. | Future shared authority copy could be considered, but CONTROL_THREAD remains source of authority. |
| Advisory/non-authoritative copy | `SANDBOX_NEXUS_SURFACE_POSTURE.advisory` and boundary copy. | `JAI_PALETTE_ADVISORY_STATEMENT`. | Surface and draft composer may diverge on app-local/non-authoritative posture. | Future shared advisory copy could reduce drift if it preserves surface-specific context. |

## 7. Candidate shared data ownership model

| Data class | Proposed owner | Proposed consumers | Authority boundary | Implementation status |
|------------|----------------|--------------------|--------------------|-----------------------|
| Sandbox agent class taxonomy | JAI Palette helper (`jaiPalette/sandboxAgentDraft.ts`) | JAI Palette draft composer; future `sandbox.nexus` coverage display. | Taxonomy is candidate metadata only. | Planned only; no wiring implemented by B17. |
| Agent class profiles | JAI Palette helper | Future coverage map, fixture intake, stress-test, and closeout displays. | Profiles do not create executable agents. | Planned only. |
| Surface module layout | `sandboxNexusSurface.ts` | `SandboxNexusStaticSurfacePanel`. | Layout data is display-only. | Existing B15 owner remains. |
| Surface state vocabulary | `sandboxNexusSurface.ts`, with possible future shared mapping only after review. | `sandbox.nexus` surface; possibly JAI Palette status mapping docs. | State labels do not grant authority. | Planned only. |
| Blocked authority vocabulary | Candidate shared local constants under `portal/src/lib/controlPlane/` if separately routed. | JAI Palette drafts; `sandbox.nexus` blocked gates and boundary copy. | Negated guardrails only; no behavior. | Planned only. |
| Route-packet compatibility primitives | JAI Palette helper and B5 route-packet helper. | Future Fixture Intake and JAI Palette relationship display. | Compatibility does not imply execution. | Planned only. |
| Fixture compatibility primitives | JAI Palette helper | Future Fixture Intake, Stress-Test Plan, and Closeout Review display. | Fixture compatibility does not imply runtime activation or sandbox task execution. | Planned only. |
| CONTROL_THREAD authority copy | Candidate shared local copy only if routed; CONTROL_THREAD remains actual authority. | Surface and draft composer display copy. | Copy is not acceptance. | Planned only. |
| Next-route posture | Lane-specific surface constant. | `sandbox.nexus` surface only. | Recommendation is advisory and not route authority. | Existing B15 owner remains. |

## 8. Module-to-data mapping

| sandbox.nexus module | Current B15 data source | Candidate shared/local source | Wiring posture | Blocked behavior |
|----------------------|-------------------------|-------------------------------|----------------|------------------|
| Sandbox Overview | `SANDBOX_NEXUS_SURFACE_POSTURE` | Keep local; possibly reuse shared authority/advisory copy later. | Keep surface-owned. | No DNS change, deployment, live domain activation, or runtime authority. |
| JAI Palette Drafts | `SANDBOX_NEXUS_SURFACE_MODULES` and relationship copy | `JAI_SANDBOX_AGENT_CLASSES`, draft schema, advisory/authority constants. | Candidate for local import from JAI Palette constants. | No executable agent runtime or JAI Agent activation. |
| Agent Coverage Map | `SANDBOX_NEXUS_SURFACE_MODULES` | `JAI_SANDBOX_AGENT_CLASSES` and `JAI_SANDBOX_AGENT_CLASS_PROFILES`. | Candidate for local static mapping. | Coverage display is not activation. |
| Fixture Intake | `SANDBOX_NEXUS_SURFACE_MODULES` and relationship copy | `JaiPaletteRoutePacketCompatibility` and `JaiPaletteSandboxFixtureCompatibility` defaults. | Candidate for local display summary mapping. | No automatic intake, no route execution, no sandbox task execution. |
| Stress-Test Plan | `SANDBOX_NEXUS_SURFACE_MODULES` | Class profiles and fixture compatibility closeout/evidence/guardrail fields. | Candidate for planning display only. | No live sandbox runtime and no executable runner. |
| Closeout Review | `SANDBOX_NEXUS_SURFACE_MODULES` | `closeoutContribution` fields from class profiles/default drafts. | Candidate for local summary reuse. | Closeout display is not CONTROL_THREAD acceptance. |
| Blocked Gates | `SANDBOX_NEXUS_BLOCKED_GATES` | `JAI_PALETTE_BLOCKED_AUTHORITIES` or future shared local blocked-authority vocabulary. | Candidate for shared vocabulary after boundary review. | Gates remain blocked. |
| Safe Activation Ladder | `SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER` | Keep surface-owned. | Keep local to surface. | Ladder display is not progression. |
| Drift / Hallucination Control Panel | `SANDBOX_NEXUS_DRIFT_RISKS` | Keep surface-owned; may reference shared blocked terms later. | Keep local to surface. | Risk display does not self-resolve. |
| Next Route Panel | `SANDBOX_NEXUS_NEXT_ROUTE` | Keep lane-specific surface constant. | Keep local and update only by routed implementation. | Recommendation is not route authority. |

## 9. State vocabulary reuse plan

B17 distinguishes `sandbox.nexus` surface state vocabulary from JAI Palette draft status vocabulary.

The B15 surface vocabulary is broader:

- `drafted`
- `candidate`
- `reviewed`
- `accepted`
- `executable`
- `activated`
- `authoritative`
- `held`
- `blocked`

The JAI Palette activation status vocabulary is narrower:

- `draft`
- `candidate`

The JAI Palette review status vocabulary is:

- `pending`
- `held`
- `reviewed`

B17 identifies safe future reuse as a mapping layer, not a direct replacement. A future implementation may map JAI Palette `draft` to a surface `drafted` display, JAI Palette `candidate` to surface `candidate`, JAI Palette `reviewed` to surface `reviewed`, and JAI Palette `held` to surface `held`. It must not infer surface `accepted`, `executable`, `activated`, or `authoritative` from JAI Palette statuses.

B17 does not authorize implementing this mapping.

## 10. Blocked-gate reuse plan

B17 identifies overlap between `SANDBOX_NEXUS_BLOCKED_GATES` and `JAI_PALETTE_BLOCKED_AUTHORITIES`.

Safe future reuse could normalize blocked-authority terms locally so that B15 surface display and JAI Palette draft exports use consistent labels for:

- executable agent runtime
- autonomous execution
- provider/model/API dispatch
- sandbox runtime activation
- sandbox task execution
- target-repo mutation
- target-repo import
- accepted-code import
- GitHub automation
- PR automation
- deployment
- production gates
- source-of-truth transfer
- hidden/background automation

The B15 surface also includes `DNS change`, `live domain activation`, `automatic intake`, and `automatic route execution`, which are surface-specific blocked gates and may remain owned by `sandboxNexusSurface`.

B17 does not authorize creating shared blocked-gate constants.

## 11. Safe activation ladder reuse plan

B17 identifies the safe activation ladder as surface-owned data.

The ladder represents control-plane progression from reference definition to production gate. It should not be owned by JAI Palette because JAI Palette draft status does not control runtime readiness, runtime activation, agent activation, DNS change, deployment, or production gates.

Future local data wiring should preserve `SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER` as `sandbox.nexus` surface data. JAI Palette status data may be displayed inside ladder step 3 or adjacent candidate metadata panels, but it must not advance ladder status.

B17 does not authorize ladder implementation changes.

## 12. Drift / hallucination control reuse plan

B17 identifies drift / hallucination control as surface-owned data with possible future references to shared blocked terms.

Future wiring should preserve these controls:

- authority drift should check that JAI Palette draft status does not imply CONTROL_THREAD acceptance.
- source-of-truth drift should check that local constants and draft exports remain non-authoritative.
- state vocabulary drift should check mapped status labels do not collapse `drafted`, `candidate`, `reviewed`, `accepted`, `executable`, `activated`, and `authoritative`.
- repo/domain confusion should check local wiring does not imply `sandbox-nexus` import or live `sandbox.nexus` activation.
- capability overclaim risks should check class profiles remain candidate metadata only.
- runtime, provider/model/API, mutation, import, deployment, and production overclaim risks should remain visible wherever shared data is displayed.

B17 does not authorize automated drift detection or enforcement.

## 13. Boundary-preserving wiring options

| Option | Description | Benefits | Required future authority | Boundary |
|--------|-------------|----------|---------------------------|----------|
| Local import from JAI Palette constants into `sandboxNexusSurface` | A future implementation imports `JAI_SANDBOX_AGENT_CLASSES`, class profiles, statuses, and blocked-authority constants directly from local JAI Palette helper into the local `sandbox.nexus` surface model. | Reduces duplication for class coverage and candidate metadata display while staying app-local. | B18 implementation route plus validation and boundary review if needed. | No external import, no `sandbox-nexus` call, no runtime, no API route. |
| Small shared local constants module under `portal/src/lib/controlPlane/` | A future implementation extracts common blocked-authority or authority/advisory copy into a local shared constants module consumed by JAI Palette and `sandboxNexusSurface`. | Reduces wording drift across control-plane surfaces. | Separate implementation route and likely shared-constants boundary review. | Shared constants remain static display metadata only. |
| Keep duplication intentionally | Leave B15 surface constants and JAI Palette constants separate until stronger coupling is needed. | Avoids premature coupling and preserves clear ownership. | No implementation authority needed unless future edits are routed. | Duplicated copy must continue to be reviewed for drift. |
| Local mapping helper | A future implementation adds a pure local mapping helper that converts JAI Palette classes/profiles into display rows for the `sandbox.nexus` surface. | Keeps source ownership clear while reducing UI-specific duplication. | B18 implementation route and focused local tests. | Pure function only; no network, runtime, persistence, or dispatch behavior. |

## 14. Rejected wiring options

| Rejected option | Reason rejected | Risk avoided |
|-----------------|-----------------|--------------|
| Direct `sandbox-nexus` import | Cross-repo import would blur repo boundaries and may imply external substrate authority. | External import, source-of-truth transfer, automatic dependency on `sandbox-nexus`. |
| Runtime `sandbox-nexus` call | Runtime calls are outside B17 and would imply live intake or runtime availability. | Sandbox runtime activation, sandbox task execution, network dependency. |
| Automatic sync | Sync would imply hidden/background automation and possible source-of-truth transfer. | Automatic sync, background automation, drift caused by unseen changes. |
| File-system watcher | Watchers would create background behavior and possible implicit import. | Hidden/background automation and automatic import. |
| API route | API routes would add server behavior outside planning and display-only scope. | API route behavior, external call surface, runtime coupling. |
| Database-backed wiring | Database-backed state would require schema/persistence decisions outside B17. | Database migration, deployed database risk, persistence authority ambiguity. |
| Runtime wiring | Runtime wiring would imply executable behavior or activation path. | Runtime activation, executable runner, sandbox task execution. |
| Provider/model/API-assisted wiring | Provider/model/API assistance would add external dispatch and credential risk. | Provider/model/API dispatch and secret exposure. |
| GitHub-based import | GitHub import would add automation and external repository authority ambiguity. | GitHub automation, PR automation, target-repo import risk. |
| Target-repo import | Target-repo import would exceed display-only local planning. | Target-repo mutation/import authority collapse. |
| Accepted-code import | Accepted-code import is not part of static display planning. | Accepted-code import without route authority. |
| Deployment/DNS wiring | Deployment or DNS wiring would misread `sandbox.nexus` as live domain work. | DNS change, deployment, live domain activation, production gate risk. |

## 15. Data authority model

B17 identifies this future data authority model:

- JAI Palette owns sandbox agent draft taxonomy, class profiles, candidate metadata primitives, activation/review draft statuses, draft export helpers, route-packet compatibility fields, sandbox-nexus fixture compatibility fields, and JAI Palette candidate-specific authority/advisory copy.
- `sandboxNexusSurface` owns `sandbox.nexus` surface layout, module grouping, state vocabulary display, surface-specific blocked gates, safe activation ladder, drift / hallucination risk model, relationship grouping, and next-route posture.
- A future shared local constants module may own common blocked-authority vocabulary only if CONTROL_THREAD separately routes implementation and boundary review.
- CONTROL_THREAD remains authority over accepted state, route decisions, activation posture, source-of-truth status, and production gates.
- Local constants are evidence and display metadata only; they are not execution authority, route authority, acceptance authority, or source of truth.

B17 does not create shared constants and does not transfer ownership.

## 16. Drift-control implications

B17 identifies these drift-control implications for any future implementation route:

- Local data wiring can reduce copy drift for `JAI::SANDBOX::AGENTS` classes and blocked-authority wording.
- Local data wiring can also introduce coupling drift if surface state vocabulary is forced to match JAI Palette draft statuses.
- Future implementation should add focused local tests that prove all required surface modules remain present after wiring.
- Future implementation should test that no `sandbox.nexus` display treats JAI Palette candidate metadata as accepted, executable, activated, or authoritative.
- Future implementation should test that blocked gates remain displayed and blocked after any reuse.
- Future implementation should test that no forbidden metadata appears in the static model, including endpoints, webhooks, provider keys, GitHub tokens, `fetch(`, `axios`, `octokit`, timers, deployment commands, or DNS records.
- Future implementation should keep B15 drift / hallucination risk classes visible after wiring.

B17 does not authorize test changes. These are future implementation requirements only.

## 17. B18 route options

| B18 option | Route type | When appropriate | Boundary |
|------------|------------|------------------|----------|
| `B18 sandbox.nexus Static Operator Surface Local Data-Wiring Implementation v0` | Implementation | Appropriate if CONTROL_THREAD wants app-local source implementation to reuse existing local JAI Palette constants where safe. | Local static data wiring only; no external import, no runtime, no API route. |
| `B18 sandbox.nexus Static Operator Surface Data-Wiring Boundary Review v0` | Review | Appropriate if CONTROL_THREAD wants another review before implementation. | Review-only; no implementation. |
| `B18 JAI Palette / sandbox.nexus Shared Constants Boundary Review v0` | Review/planning | Appropriate if shared constants ownership needs more scrutiny before any source change. | Review-only; no shared constants creation. |
| Hold | Hold | Appropriate if CONTROL_THREAD wants to pause surface wiring to pursue another lane. | No route progression. |

## 18. Recommended B18 route

B17 recommends:

`B18 sandbox.nexus Static Operator Surface Local Data-Wiring Implementation v0`

Recommended branch:

`feature/q3m7-sandbox-dot-nexus-static-operator-surface-local-data-wiring-v0`

Recommended posture:

- app-local source implementation
- local static data wiring only
- reuse existing local JAI Palette constants where safe
- preserve display-only behavior
- preserve non-authoritative posture
- preserve candidate metadata only
- no external import
- no `sandbox-nexus` calls
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

B17 does not authorize B18 implementation. CONTROL_THREAD acceptance and routing remain future.

## 19. Validation

B17 validation performed:

- `git diff --check`
- `git diff --cached --check`

B17 also ran the targeted non-authorization scan after the pre-push update against `origin/main`.

No source validation was run because B17 made no source or test changes.

## 20. Authority boundary

B17 does not authorize:

- PR creation
- implementation source changes
- test changes
- data wiring implementation
- external import
- `sandbox-nexus` calls
- automatic sync
- API routes
- database migration
- runtime activation
- sandbox task execution
- executable runner behavior
- autonomous JAI Agent execution
- provider/model/API dispatch
- target-repo mutation
- target-repo import
- accepted-code import
- DNS change
- deployment
- production gates
- source-of-truth transfer
- hidden/background automation
- CONTROL_THREAD acceptance

B17 is advisory-output-only until CONTROL_THREAD acceptance.

## 21. Repo-lane closeout

B17 inventories the B15 static surface data and the existing local JAI Palette constants.

B17 identifies overlap around `JAI::SANDBOX::AGENTS` classes, candidate metadata posture, activation/review vocabulary, blocked authority copy, route-packet compatibility, sandbox-nexus fixture compatibility, CONTROL_THREAD authority copy, and advisory/non-authoritative copy.

B17 distinguishes data ownership: JAI Palette should continue owning sandbox agent draft taxonomy and candidate metadata primitives, while `sandboxNexusSurface` should continue owning surface module layout, surface state display, safe activation ladder, drift-control model, relationships, and next-route posture.

B17 rejects unsafe wiring options including direct `sandbox-nexus` import, runtime `sandbox-nexus` calls, automatic sync, file watchers, API routes, database-backed wiring, runtime wiring, provider/model/API-assisted wiring, GitHub-based import, target-repo import, accepted-code import, and deployment/DNS wiring.

B17 recommends B18 as `sandbox.nexus Static Operator Surface Local Data-Wiring Implementation v0`, preserving app-local local static data wiring only and all blocked authorities.
