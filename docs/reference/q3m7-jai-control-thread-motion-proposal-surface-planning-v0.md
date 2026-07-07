# Q3M7 JAI Control Thread Motion Proposal Surface Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

A2 plans the `dev.jai.nexus` surface for a governed motion proposal flow:

Human operator -> JAI_control_thread -> motion proposal -> JAI Council / advisory agent review -> CONTROL_THREAD decision -> adaptive Program / Batch / Wave / Lane planning.

A2 is planning-only and docs/reference-only. A2 does not authorize implementation, actual JAI_control_thread runtime activation, JAI Council activation, JAI Agent activation, model/provider/API dispatch, GitHub mutation, target-repo mutation/import, accepted-code import, deployment, production gates, source-of-truth transfer, hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, acceptance authority transfer, execution authority transfer, PR creation, merge, or CONTROL_THREAD acceptance.

## 2. CONTROL_THREAD decision baseline

A2 records that CONTROL_THREAD routed A2 as the `JAI Control Thread Motion Proposal Surface Planning v0` lane.

A2 records that this A2 route is the current active route. A2 does not implement the prior A1 recommended A2 company asset/domain registry display model route in this lane.

A2 preserves CONTROL_THREAD as the routing, acceptance, hold, reject, and route-to-planning authority.

## 3. Strategic target

A2 plans a non-authoritative operator surface where:

- the operator talks to JAI_control_thread through human-authored prompt/intake context;
- JAI_control_thread drafts a structured motion proposal as display/draft metadata only;
- the proposal can be prepared for JAI Council and advisory agent review as a candidate handoff;
- Council/advisory review remains advisory and non-binding;
- CONTROL_THREAD later decides whether to accept, hold, reject, or route the motion into Program / Batch / Wave / Lane planning;
- all runtime/provider/agent/execution gates remain closed.

## 4. Files and surfaces inspected

A2 inspected these repo-local files and surfaces without modifying source:

- `portal/src/app/operator/control-thread/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `portal/src/app/operator/control-thread/passalongs/route.ts`
- `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`
- `portal/src/app/operator/motion-control/page.tsx`
- `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx`
- `portal/src/app/operator/motion-control/ManualDeliberationAction.tsx`
- `portal/src/app/operator/motion-control/MotionApprovalDraftSurface.tsx`
- `portal/src/app/operator/motion-control/motion-intake/route.ts`
- `portal/src/app/operator/motion-control/manual-inference/route.ts`
- `portal/src/app/operator/work/page.tsx`
- `portal/src/app/operator/waves/page.tsx`
- `portal/src/lib/controlPlane/motionKernel/types.ts`
- `portal/src/lib/controlPlane/motionKernel/motion-intake.ts`
- `portal/src/lib/controlPlane/motionKernel/manual-deliberation.ts`
- `portal/src/lib/controlPlane/motionKernel/lifecycle.ts`
- `portal/src/lib/controlPlane/motionKernel/role-slots.ts`
- `portal/src/lib/controlPlane/motionKernel/model-slots.ts`
- `portal/src/lib/controlPlane/routePackets/supervisedRoutePacket.ts`
- `portal/src/lib/controlPlane/workWavesProgramTaxonomy.ts`
- `portal/src/lib/controlPlane/agentGovernanceSandbox.ts`
- `docs/reference/control-thread-slot-architecture-planning-v0.md`
- `docs/reference/q3m7-motion-intake-environment-definition-plan-v0.md`
- `docs/reference/q3m7-work-waves-program-taxonomy-alignment-planning-v0.md`
- `docs/reviews/B41_WORK_WAVES_TAXONOMY_DISPLAY_REVIEW_V0.md`
- `docs/reference/q3m7-company-asset-domain-registry-reconciliation-planning-v0.md`
- related motion, council, agent, route-packet, passalong, evidence, receipt, and governance references discovered through targeted search

A2 records that a dedicated JAI_control_thread motion proposal surface is not present as a distinct current surface. Current repo-local evidence includes a passalong-oriented `/operator/control-thread` surface and a separate `/operator/motion-control` surface with motion intake, advisory votes/ratification display, manual deliberation preview, and provider-slot boundary copy.

## 5. Current JAI_control_thread / control-thread surface inventory

| Observed item | Current representation | Motion-proposal relevance | Gap / risk | Evidence |
|---------------|------------------------|---------------------------|------------|----------|
| `/operator/control-thread` page | Server page loading thread memory, passalongs, queues, sandbox targets, authority findings, non-authorizations, and persisted passalong records | Existing operator control-thread surface for passalong routing context | Not a dedicated motion proposal surface; passalong persistence must not be conflated with motion approval | `portal/src/app/operator/control-thread/page.tsx` |
| Passalong router prototype | Client UI for thread memory, queues, route packet draft, sandbox packet control, sandbox receipt display, JAI Palette draft, and static sandbox.nexus modules | Useful pattern for manual copy/export, boundary copy, and CONTROL_THREAD handoff | Existing scope is passalong/route/sandbox, not motion proposal drafting | `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx` |
| Passalong API routes | Existing app-local passalong persistence/read behavior | Shows that some control-thread persistence already exists | A2 must not add persistence or broaden route/API behavior | `portal/src/app/operator/control-thread/passalongs/route.ts` |
| Native motion-control page | Manual internal motion deliberation, voting, ratification kernel preview, motion intake composer, provider status, and recent run surfaces | Closest current motion proposal/intake implementation context | Contains manual inference/deliberation preview paths that A2 must not activate or extend | `portal/src/app/operator/motion-control/page.tsx` |
| Native motion intake composer | Operator-created motion fields, local stage action, explicit save action, selected motion basis, and non-authorizing copy | Existing operator prompt/intake pattern | A2 plan should not treat current motion intake as JAI_control_thread activation | `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx` |
| Motion intake model | Draft/record fields for title, proposer, target thread, repo target, purpose, scope, requested outcome, risks, constraints, evidence pointers, and non-authorizations | Reusable field posture for motion proposal planning | Current field shape does not include full Council/advisory handoff, asset/domain references, or Program/Batch/Wave/Lane seed mapping | `portal/src/lib/controlPlane/motionKernel/motion-intake.ts` |
| Motion kernel role slots | JAI role slots including `JAI_CONTROL_THREAD`, orchestrator, dev, audit, format, and generic repo slots | Candidate advisory reviewer vocabulary | Role-slot output is advisory display only; must not become JAI Agent activation | `portal/src/lib/controlPlane/motionKernel/role-slots.ts` |
| Motion kernel model slots | Mock, env-gated live placeholder, and disabled model slots | Shows provider/model slot posture | Live placeholder exists but disabled; A2 must not dispatch provider/model/API calls | `portal/src/lib/controlPlane/motionKernel/model-slots.ts` |
| Manual deliberation preview | Creates operator-triggered run preview and aggregate advisory ratification | Provides advisory review/vote precedent | A2 must not execute manual deliberation or create binding votes | `portal/src/lib/controlPlane/motionKernel/manual-deliberation.ts` |
| Motion lifecycle/non-authorizations | Lifecycle, vote, ratification, human approval vocabulary and no-authority copy | Useful vocabulary for proposal status and decision posture | Existing ratification/advisory terms may be mistaken for CONTROL_THREAD acceptance unless boundary copy is visible | `portal/src/lib/controlPlane/motionKernel/lifecycle.ts` |
| Work/Waves taxonomy helper | Program/batch/wave/lane/thread/repo/scope/mode/role/status/evidence/closeout/decision vocabulary | Downstream mapping target for accepted motion proposals | Work/Waves remains display-only and does not route itself | `portal/src/lib/controlPlane/workWavesProgramTaxonomy.ts` |
| A1 company asset/domain plan | Separates domain assets, domain concepts, engine groups, repo bindings, environments, readiness, and renewal risk | Reference model for affected assets/domains/repos | Proposal references must not mutate registry records or authorize DNS/registrar/deploy actions | `docs/reference/q3m7-company-asset-domain-registry-reconciliation-planning-v0.md` |
| Agent governance sandbox model | Static fixture-only motion draft, vote/ratification, failure trace, and gate evidence posture | Useful review-only vocabulary for Council/advisory handoff | Fixture traces are not live Council or Agent activation | `portal/src/lib/controlPlane/agentGovernanceSandbox.ts` |
| Control thread slot planning | Distinguishes current CONTROL_THREAD, future JAI_Control_Thread, repo agents, role slots, packet/closeout flow | Establishes staged JAI_Control_Thread posture | JAI_Control_Thread is future architecture, not active authority | `docs/reference/control-thread-slot-architecture-planning-v0.md` |

## 6. Proposed motion proposal field model

| Field | Meaning | Required? | Source / input posture | Boundary |
|-------|---------|-----------|------------------------|----------|
| `motion_id` | Stable draft/proposal identifier | Yes | Generated or operator-provided draft metadata | Identifier is not acceptance |
| `motion_title` | Human-readable proposal title | Yes | Operator prompt and JAI_control_thread draft summary | Title is not route authority |
| `initiating_thread` | Thread that initiated the motion | Yes | Operator-selected or current CONTROL_THREAD context | Thread selection is not execution authority |
| `operator_request_summary` | Summary of human operator request | Yes | Human-authored prompt/intake context | Summary is not parser authority |
| `proposed_purpose` | Purpose of proposed motion | Yes | Drafted from operator intent | Purpose is not implementation authorization |
| `scope` | Proposed scope boundary | Yes | Operator/JAI_control_thread draft field | Scope display is not route execution |
| `intended_program` | Program candidate if known | Recommended | Candidate mapping to program taxonomy | Program candidate is not program creation |
| `intended_domain` | Domain or governance area candidate | Recommended | Candidate planning label | Domain label is not domain-engine activation |
| `affected_asset_ids` | Candidate affected asset identifiers | Recommended | A1-compatible candidate references | Asset reference is not registry mutation |
| `affected_domain_assets` | Candidate domain asset references | Recommended | A1 domain asset model posture | No DNS, registrar, or renewal authority |
| `affected_domain_concepts` | Candidate product/surface concepts | Recommended | A1 domain concept posture | Concept is not deployed app |
| `affected_engine_groups` | Candidate engine group references | Recommended | A1 engine group posture | Engine group is not repository or runtime activation |
| `affected_repos` | Candidate repo references | Recommended | Operator-selected/repo-local display metadata | Repo reference is not GitHub or target-repo mutation |
| `affected_environments` | Candidate environment references | Recommended | A1 environment posture | Environment reference is not deployment authority |
| `proposed_council_reviewers` | Candidate Council reviewer labels | Recommended | Operator/JAI_control_thread proposed reviewer set | Reviewer label is not Council activation |
| `proposed_advisory_agent_roles` | Candidate advisory role slots | Recommended | Static role-slot labels | Role label is not JAI Agent activation |
| `required_evidence` | Evidence required before review/decision | Yes | Operator/JAI_control_thread checklist | Requirement is not evidence receipt |
| `evidence_refs` | Evidence references already available | Recommended | Repo-local or passalong-grounded references | Reference is not verification |
| `risks` | Known risks | Yes | Operator/JAI_control_thread draft | Risk display is not blocker resolution |
| `blockers` | Known blockers or missing evidence | Yes | Operator/JAI_control_thread draft | Blocker display is not hold decision |
| `non_authorizations` | Explicit blocked behaviors | Yes | Static boundary copy plus proposal-specific copy | Copy preserves no-authority posture |
| `requested_control_thread_decision` | Requested decision type | Yes | Operator-selected request | Request is not decision |
| `recommended_next_planning_seed` | Candidate Program/Batch/Wave/Lane seed | Recommended | Draft mapping only | Planning seed is not route execution |
| `status` | Draft, ready for review, advisory received, held, etc. | Yes | Display status vocabulary | Status display is not acceptance |
| `authority_boundary_summary` | Concise authority boundary | Yes | Static boundary copy | No runtime/provider/agent/execution authority |

## 7. JAI_control_thread surface requirements

| Surface requirement | Purpose | Allowed posture | Blocked behavior |
|---------------------|---------|-----------------|------------------|
| Operator prompt area | Capture human-authored motion request context | Draft/display input only | Parser authority, provider dispatch, runtime activation |
| Structured motion proposal preview | Show normalized proposal fields | Local-static/draft preview | Acceptance, route execution, source-of-truth transfer |
| Proposal completeness checklist | Show required/missing fields and evidence | Advisory checklist | Gate opening, automated validation authority |
| Affected asset/domain/repo selector posture | Reference candidate assets/domains/repos/environments | Candidate reference display | Registry mutation, DNS change, target-repo mutation |
| Council/advisory reviewer candidate display | Show proposed reviewers and roles | Candidate handoff metadata | JAI Council activation, JAI Agent activation |
| Evidence requirement display | Show what review needs | Evidence-request display | Evidence verification or acceptance |
| Risk/blocker display | Show known risks and blockers | Advisory display | Hold/reject decision authority |
| Non-authorization display | Keep blocked authorities visible | Required boundary copy | Capability grants |
| Requested CONTROL_THREAD decision display | Show requested accept/hold/reject/route posture | Request only | CONTROL_THREAD decision replacement |
| Recommended next planning seed display | Prepare downstream planning shape | Draft seed only | Program/lane creation or route execution |
| Manual copy/export posture | Let operator copy draft text manually if later implemented | Manual operator export only | Automatic send, API submission, GitHub mutation |
| Review handoff posture | Prepare Council/advisory review packet shape | Candidate/advisory handoff | Binding vote, activation, dispatch |

## 8. Operator prompt / intake posture

| Intake item | Meaning | Allowed posture | Boundary |
|-------------|---------|-----------------|----------|
| Operator prompt text | Raw human-authored request context | Human-supervised input | Not parser authority |
| Operator intent summary | Human/JAI_control_thread summary of intent | Draft summary | Not route authority |
| Operator-provided constraints | Scope, mode, boundaries, and limits | Draft constraints | Not execution authority |
| Affected domains/assets/repos | Candidate references to governed objects | Candidate metadata | Not registry, DNS, GitHub, or repo mutation |
| Proposed review targets | Candidate Council reviewers or advisory roles | Review request planning | Not Council/JAI Agent activation |
| Evidence supplied by operator | References or notes | Evidence reference display | Not evidence verification |
| Missing evidence | Required evidence not yet present | Checklist display | Not blocker decision by itself |
| Draft-only status | Status marker for unaccepted proposal | Local display status | Not CONTROL_THREAD acceptance |

## 9. Council / advisory review handoff model

| Handoff item | Meaning | Candidate recipient | Boundary |
|--------------|---------|--------------------|----------|
| Proposal id | Identifier for the draft motion proposal | Council reviewer / advisory role | Identifier is not route authority |
| Proposal summary | Concise motion summary | Council reviewer / advisory role | Summary is not acceptance |
| Requested review type | Architecture, audit, domain, repo, format, or readiness review | Candidate reviewer | Review request is not activation |
| Proposed Council reviewers | Candidate human or Council slots | JAI Council candidate | No JAI Council runtime activation |
| Proposed advisory agent roles | Candidate role slots | JAI role-slot candidate | No JAI Agent activation |
| Review questions | Questions for reviewers | Candidate reviewer | Questions do not dispatch models |
| Required evidence | Evidence needed for review | Candidate reviewer | Evidence request is not verification |
| Risk questions | Risks/blockers to evaluate | Candidate reviewer | Risk question is not hold decision |
| Non-authorizations to preserve | Required blocked capabilities | Candidate reviewer | No authority grant |
| Expected review output shape | Expected advisory findings, risks, vote candidate, recommendation | Candidate reviewer | Output is advisory only |
| CONTROL_THREAD decision dependency | Explicit dependency on CONTROL_THREAD | CONTROL_THREAD | Review cannot bypass CONTROL_THREAD |

## 10. Agent vote / review candidate posture

| Candidate review item | Meaning | Allowed posture | Must not imply |
|-----------------------|---------|-----------------|---------------|
| Candidate reviewer | Proposed reviewer or role slot | Candidate metadata | Activated reviewer runtime |
| Advisory review requested | Review has been requested conceptually | Planning/display status | Provider/model/API dispatch |
| Advisory vote candidate | Non-binding vote candidate label | Advisory label | Acceptance, route authority, execution authority |
| Review pending | Review has not been received | Status display | Timer, polling, or background job |
| Review received | Advisory output is available | Evidence/reference display | Accepted review or CONTROL_THREAD decision |
| Disagreement / blocker | Review indicates conflict or blocker | Advisory risk display | Automatic hold/reject |
| Consensus candidate | Advisory outputs align | Candidate summary | Binding vote or ratification |
| CONTROL_THREAD decision required | Final decision remains external to review | Required boundary posture | Bypass of CONTROL_THREAD |

## 11. Motion-to-program planning handoff requirements

| Handoff field | Planning use | Required downstream mapping | Boundary |
|---------------|--------------|-----------------------------|----------|
| Proposed program id/name | Seed future program planning | Program taxonomy | Does not create a program |
| Batch candidate | Seed batch grouping | Batch taxonomy | Does not create a batch |
| Wave candidate | Seed sequencing/grouping | Wave taxonomy | Does not create a wave |
| Lane candidates | Seed lane list | Lane taxonomy | Does not create lanes or branches |
| Thread targets | Identify future thread contexts | Thread taxonomy | Thread target is not route authority |
| Repo targets | Identify candidate repos | Repo taxonomy | Repo target is not GitHub/target-repo mutation |
| Scope per lane | Draft lane scope | Scope taxonomy | Scope is not implementation authorization |
| Mode per lane | Draft authority boundary | Mode taxonomy | Mode is not runtime activation |
| Role per lane | Draft actor/role posture | Role taxonomy | Role is not JAI Agent activation |
| Evidence requirements | Required evidence before routing | Evidence taxonomy | Requirement is not received evidence |
| Review requirements | Required review before route | Review/decision posture | Review need is not acceptance |
| Non-authorizations | Blocked capabilities per seed | Boundary taxonomy | No authority transfer |
| Expected closeout artifacts | Candidate closeout expectations | Closeout taxonomy | Closeout expectation is not closeout generation |

## 12. Evidence / receipt expectations

| Evidence / receipt item | Expected meaning | Required posture | Boundary |
|-------------------------|------------------|------------------|----------|
| Operator prompt | Human-authored request context | Stored or displayed only if separately implemented | Prompt is not parser authority |
| Motion proposal draft | Structured proposal preview | Draft-only | Proposal draft is not accepted motion |
| Council/advisory review candidates | Proposed reviewers/roles | Candidate metadata | Not Council/JAI Agent activation |
| Advisory review outputs | Advisory findings, risks, vote candidates, recommendations | Advisory evidence | Advisory review is not accepted review |
| Risks/blockers | Known issues | Advisory status | Not automatic hold/reject |
| Non-authorization list | Explicit blocked authorities | Required boundary copy | No capability grant |
| CONTROL_THREAD decision receipt | Future accepted/held/rejected/routed receipt | Required for acceptance | Receipt is not implementation authority |
| Planning seed artifact | Future Program/Batch/Wave/Lane planning seed | Draft/candidate until routed | Planning seed is not routed lane |
| Closeout or passalong references | Future evidence pointers | Reference display | Reference is not source-of-truth transfer |

## 13. CONTROL_THREAD decision posture

| Decision posture | Meaning | Required copy | Boundary |
|------------------|---------|---------------|----------|
| Draft | Proposal is being drafted | Motion proposal display is not acceptance. | No acceptance authority |
| Ready for review | Proposal appears complete enough for review | Ready for review is not CONTROL_THREAD accepted. | No route authority |
| Council/advisory review requested | Candidate review handoff is prepared/requested | Advisory review request does not activate Council or Agents. | No runtime/agent activation |
| Advisory review received | Advisory output exists | Advisory review is not acceptance. | No binding vote |
| CONTROL_THREAD review required | Final review remains required | CONTROL_THREAD remains routing/acceptance/hold authority. | No bypass |
| Accepted | CONTROL_THREAD accepted the motion | Acceptance requires explicit CONTROL_THREAD decision. | UI cannot self-accept |
| Held | CONTROL_THREAD held the motion | Hold requires explicit CONTROL_THREAD decision. | UI cannot self-hold |
| Rejected | CONTROL_THREAD rejected the motion | Rejection requires explicit CONTROL_THREAD decision. | UI cannot self-reject |
| Routed to program planning | CONTROL_THREAD routed downstream planning | Planning seed is not route execution. | No implementation authorization |
| Routed to batch/wave/lane planning | CONTROL_THREAD routed specific planning | Program/lane proposal is not implementation authorization. | No automatic route execution |

## 14. Authority-boundary copy requirements

| Boundary copy item | Where displayed | Reason | Non-authorization preserved |
|--------------------|-----------------|--------|----------------------------|
| CONTROL_THREAD remains routing/acceptance/hold authority | Header and decision panel | Prevents proposal/review from becoming final authority | No acceptance authority transfer |
| Motion proposal display is not acceptance | Proposal preview | Keeps draft status clear | No CONTROL_THREAD bypass |
| Advisory review is not acceptance | Review handoff and review output panels | Prevents Council/advisory output overclaim | No binding review authority |
| Council/advisory vote is not binding | Vote/review candidate panel | Prevents vote-as-ratification confusion | No binding vote |
| Planning seed is not route execution | Motion-to-program seed panel | Prevents seed from becoming work route | No automatic route execution |
| Program/lane proposal is not implementation authorization | Downstream mapping panel | Prevents lane proposal from becoming repo work | No implementation authority |
| No actual JAI_control_thread runtime activation | Surface header | JAI_control_thread remains planned surface posture | No runtime activation |
| No JAI Council activation | Review handoff panel | Council recipients are candidates only | No Council runtime activation |
| No JAI Agent activation | Advisory role panel | Role slots are display/candidate metadata | No Agent activation |
| No provider/model/API dispatch | Prompt, review, and vote panels | Prevents review request from becoming inference dispatch | No provider/model/API dispatch |
| No GitHub or target-repo mutation/import | Affected repos and planning seed panels | Repo references are candidates only | No GitHub or target-repo mutation/import |
| No accepted-code import | Downstream planning panel | Accepted motion is not code import | No accepted-code import |
| No deployment or production gates | Program/domain readiness panels | Motion planning is not production authority | No deployment or production gates |
| No source-of-truth transfer | Evidence and receipt panels | References remain evidence/display | No source-of-truth transfer |
| No hidden automation, timers, polling, or background jobs | Status/review pending panels | Pending statuses must not imply watchers | No hidden/background automation |

## 15. Relationship to Work / Waves taxonomy

A2 plans that accepted motion proposals may later seed Program / Batch / Wave / Lane planning only after separate CONTROL_THREAD routing.

A2 maps proposal fields to the B39/B40/B41 Work/Waves taxonomy:

- `motion_id` and `motion_title` map to Motion.
- `intended_program` maps to Program.
- downstream `batch_candidate`, `wave_candidate`, and `lane_candidates` map to Batch, Wave, and Lane.
- `initiating_thread` and `thread_targets` map to Thread.
- `affected_repos` and `repo_targets` map to Repo.
- `scope`, `mode`, and `role` map to lane planning fields.
- `required_evidence`, `evidence_refs`, and expected closeout artifacts map to Evidence and Closeout.
- `requested_control_thread_decision`, `status`, and decision receipt posture map to CONTROL_THREAD decision posture.

A2 preserves that Work/Waves taxonomy remains display-only and non-authoritative unless separately routed. The motion proposal surface must avoid duplicating Work/Waves execution, closeout, or DB-backed route behavior.

## 16. Relationship to company asset / domain registry governance

A2 plans that motion proposals may reference company assets and domains using the A1 corrected governance model without mutating the registry.

A proposal may reference:

- affected domain assets;
- affected domain concepts;
- affected engine groups;
- affected repos;
- affected environments;
- public-readiness posture;
- renewal/expiration risks.

A2 preserves:

- affected asset/domain references are candidate references;
- registry display is not source-of-truth transfer;
- proposal does not mutate registry records;
- proposal does not authorize DNS, registrar, renewal, deployment, public launch, or production gates;
- domain concepts and engine groups must not be treated as repositories;
- repository bindings may be many-to-many and remain candidate metadata.

## 17. Rejected implementation paths

| Rejected path | Reason rejected | Risk avoided |
|---------------|-----------------|--------------|
| Implementing in A2 | A2 is planning-only | Scope breach |
| Activating JAI_control_thread runtime | This lane is docs/reference planning | Runtime activation |
| Activating JAI Council runtime | Council handoff is candidate/advisory only | Council activation |
| Activating JAI Agents | Role slots are candidate metadata | JAI Agent activation |
| Dispatching provider/model/API calls | Review handoff is non-executing | Provider/model/API dispatch |
| Creating binding agent votes | Advisory votes are non-binding | Acceptance bypass |
| Turning advisory review into acceptance | CONTROL_THREAD remains authority | Acceptance authority transfer |
| Turning motion proposal into route execution | Proposal is draft/display metadata | Automatic route execution |
| Turning planning seed into implementation authority | Planning seed requires separate route | Implementation authority |
| Adding GitHub mutation | Repo references are candidate metadata | GitHub mutation |
| Adding target-repo mutation/import | A2 does not touch target repos | Target-repo mutation/import |
| Adding accepted-code import | Motion proposal is not code import | Accepted-code import |
| Adding deployment | Deployment is outside A2 | Deployment authority |
| Adding production gates | Program/lane proposal is not production readiness | Production authority |
| Adding source-of-truth transfer | Evidence/receipt references are non-authoritative | Source-of-truth transfer |
| Adding hidden automation | Human-supervised posture required | Hidden automation |
| Adding timers, polling, or background jobs | Pending/review statuses are static display posture | Background automation |

## 18. Risks and interpretive guardrails

A2 identifies these risks and guardrails:

- Current `/operator/control-thread` is passalong-oriented; a future motion proposal surface should not be mistaken for passalong acceptance or route execution.
- Current `/operator/motion-control` includes motion intake, persistence, manual deliberation, and model-slot/provider status concepts; A2 does not activate or extend those behaviors.
- Advisory review and vote vocabulary can be overread as ratification; the future surface must state that Council/advisory vote is not binding.
- A planning seed can be overread as a routed program/lane; the future surface must state that planning seed is not route execution.
- Asset/domain references can be overread as registry updates; the future surface must state that proposal references do not mutate registry, DNS, registrar, renewal, deployment, or production state.
- Evidence references can be overread as verified evidence; the future surface must distinguish evidence requested, evidence received, passalong-grounded evidence, repo-local evidence, and accepted evidence.

## 19. Recommended A3 implementation route

A2 recommends, if CONTROL_THREAD accepts A2 and no blocker is identified:

`A3 JAI Control Thread Motion Proposal Surface Implementation v0`

Recommended branch:

`feature/q3m7-jai-control-thread-motion-proposal-surface-v0`

Recommended posture:

- app-local source implementation;
- local-static display/draft metadata only;
- non-authoritative;
- human-supervised;
- manual operator export/copy only;
- no actual JAI_control_thread runtime activation;
- no JAI Council activation;
- no JAI Agent activation;
- no provider/model/API dispatch;
- no GitHub mutation;
- no target-repo mutation/import;
- no accepted-code import;
- no deployment;
- no production gates.

Recommended A3 scope:

- add local-static motion proposal field model;
- add operator prompt/intake display metadata;
- add structured motion proposal preview;
- add Council/advisory review handoff preview;
- add advisory vote/review candidate posture display;
- add motion-to-program planning seed preview;
- add authority-boundary copy;
- add focused local tests if source helpers/constants are added.

## 20. Recommended A4 review route

A2 recommends:

`A4 JAI Control Thread Motion Proposal Surface Boundary Review v0`

Recommended posture:

- review-only;
- confirm A3 remains app-local and local-static;
- confirm proposal drafting remains display/draft-only;
- confirm no JAI_control_thread runtime activation;
- confirm no JAI Council activation;
- confirm no JAI Agent activation;
- confirm no provider/model/API dispatch;
- confirm no GitHub mutation;
- confirm no target-repo mutation/import;
- confirm no accepted-code import;
- confirm no deployment;
- confirm no production gates;
- confirm no source-of-truth transfer.

## 21. Validation

A2 requires safe docs-only validation:

- `git diff --check`;
- `git diff --cached --check` if the artifact is staged;
- repo-local docs/static validation only if available;
- targeted non-authorization scan over changed files and relevant docs/source paths.

A2 does not run source validation unless source files are accidentally changed. A2 does not run migration tests, apply migrations, run Prisma migration commands, connect to deployed databases, call APIs, call providers/models, activate JAI_control_thread runtime, activate JAI Council, activate JAI Agents, mutate GitHub, mutate target repos, import accepted code, or deploy.

## 22. Authority boundary

A2 preserves:

- planning-only;
- docs/reference-only;
- app-local;
- non-authoritative;
- human-supervised;
- no implementation;
- no actual JAI_control_thread runtime activation;
- no JAI Council activation;
- no JAI Agent activation;
- no model/provider/API dispatch;
- no GitHub mutation;
- no target-repo mutation/import;
- no accepted-code import;
- no deployment;
- no production gates;
- no source-of-truth transfer;
- no hidden automation;
- no timers;
- no polling;
- no background jobs;
- no automatic route execution;
- no automatic delivery;
- no acceptance authority transfer;
- no execution authority transfer.

## 23. Repo-lane closeout

A2 records this planning artifact as the only intended lane output:

- Artifact: `docs/reference/q3m7-jai-control-thread-motion-proposal-surface-planning-v0.md`
- Branch: `docs/q3m7-jai-control-thread-motion-proposal-surface-planning-v0`
- Posture: docs/reference planning-only
- Recommended next route: `A3 JAI Control Thread Motion Proposal Surface Implementation v0`
- Recommended review route: `A4 JAI Control Thread Motion Proposal Surface Boundary Review v0`

A2 does not authorize implementation, actual JAI_control_thread runtime activation, JAI Council activation, JAI Agent activation, model/provider/API dispatch, GitHub mutation, target-repo mutation/import, accepted-code import, deployment, production gates, source-of-truth transfer, hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, acceptance authority transfer, execution authority transfer, PR creation, merge, or CONTROL_THREAD acceptance.
