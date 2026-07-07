# Q3M7 Work and Waves Program Taxonomy Alignment Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

B39 plans the minimum upgrade sweep for `/operator/work` and `/operator/waves` so both surfaces can display the current JAI NEXUS program taxonomy before Q3M7Y26 program-close planning.

B39 is planning-only and docs/reference-only. B39 does not authorize implementation, source changes, test changes, runtime behavior, packet execution, sandbox task execution, JAI Agent activation, provider/model/API dispatch, GitHub/API mutation, target-repo mutation/import, accepted-code import, deployment, production gates, source-of-truth transfer, hidden/background automation, timers, polling, background jobs, automatic route execution, automatic delivery, acceptance authority transfer, execution authority transfer, PR automation, merge, or CONTROL_THREAD acceptance.

## 2. CONTROL_THREAD decision baseline

B39 records that CONTROL_THREAD routed B39 as `Work and Waves Program Taxonomy Alignment Planning v0` before program closeout.

B39 records the reason: Agent live UI inspection found `dev.jai.nexus` broadly ready for program-close planning, but Work and Waves were not fully inspected and need clearer compatibility with the current JAI NEXUS program taxonomy before Q3M7Y26 closeout.

## 3. Accepted B38 baseline

B39 records that B38 created `docs/reference/q3m7-sandbox-receipt-return-display-receipt-v0.md` and preserved docs/reference receipt-only, app-local, local-static, advisory-display-only, CONTROL_THREAD-review-required posture.

B39 preserves the B38 non-authorization chain: no implementation, no receipt ingestion, no import/sync/runtime/automation behavior, and no source-of-truth transfer.

## 4. Agent inspection baseline

B39 records the Agent inspection baseline as CONTROL_THREAD-provided context, not repo-local evidence. B39 did not discover a repo-local Agent inspection passalong in `docs/reference` or `docs/reviews` during inspection.

B39 records the provided baseline:

- `dev.jai.nexus` operator surfaces are broadly non-authorizing, zero-gate, manual-handoff, and ready for program-close planning.
- Work and Waves surfaces were not fully inspected.
- UI clarity and authority-copy improvements may be needed before close.
- Program-close planning must not imply production gates, runtime activation, provider/API dispatch, target-repo mutation, or authority transfer.

## 5. Files and surfaces inspected

B39 inspected:

- `portal/src/app/operator/work/page.tsx`
- `portal/src/app/operator/work/new/page.tsx`
- `portal/src/app/operator/work/[id]/page.tsx`
- `portal/src/app/operator/work/_components/OperatorWorkPacketComposer.tsx`
- `portal/src/app/operator/work/_components/OperatorDomainEngineWorkspace.tsx`
- `portal/src/app/operator/waves/page.tsx`
- `portal/src/app/operator/waves/[sessionId]/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `portal/src/lib/continuity/types.ts`
- `portal/src/lib/continuity/waves.ts`
- `portal/src/lib/waves/types.ts`
- `portal/src/lib/controlPlane/**`
- `portal/src/lib/**`
- `docs/reference/q3m7-sandbox-receipt-return-display-receipt-v0.md`
- `docs/reference/q3m7-sandbox-packet-control-surface-planning-v0.md`
- `docs/reviews/B30_SANDBOX_PACKET_SURFACE_STATIC_REVIEW_V0.md`
- `docs/reviews/B37_SANDBOX_RECEIPT_RETURN_DISPLAY_BOUNDARY_REVIEW_V0.md`
- `docs/reference/operator-domain-engine-workspace-jai-format-alignment-planning-v0.md`
- `docs/reference/project-coverage-state-operator-planning-v0.md`
- `docs/reference/canonical-timeline-display-planning-v0.md`
- `docs/reference/` and `docs/reviews/` inventory

## 6. Current `/operator/work` surface inventory

| Observed item | Current representation | Taxonomy coverage | Gap / risk | Evidence |
|---------------|------------------------|-------------------|------------|----------|
| Work index page | Deterministic Agent Agenda, read-only derived agenda cards, active static loop candidate, copy-only prompt previews. | Repo, role, status, motion/source seam, target surface, evidence expectations, human gates. | Does not consistently display program, batch, wave, lane, thread, closeout refs, or CONTROL_THREAD decision posture as first-class taxonomy fields. | `portal/src/app/operator/work/page.tsx` |
| Work packet composer | Local client-side packet preview with source, repo, lane type, scope, mode, branch suggestion, validation, closeout requirements, and non-authorizations. | Scope, mode, repo, lane type, closeout requirements. | Uses lane type vocabulary but not full Motion/Program/Batch/Wave/Lane/Thread taxonomy. | `OperatorWorkPacketComposer.tsx` |
| Domain Engine Workspace | Static profile object draft with `work-wave/v0`, `repo-lane/v0`, `closeout-packet/v0`, CONTROL_THREAD acceptance, and blocked capabilities. | Repo lane, work wave, closeout packet, role/domain posture, CONTROL_THREAD copy. | Strong vocabulary bridge, but taxonomy is profile-oriented rather than program-close field model. | `OperatorDomainEngineWorkspace.tsx` |
| New work packet route | Authenticated server action creates work packet, inbox, queue, and SoT event rows through pre-existing mutation path. | NH ID, repo, execution role, assignee, status, queue/inbox tags. | Must be visually separated from display-only taxonomy alignment. B39 must not broaden this mutation path. | `portal/src/app/operator/work/new/page.tsx` |
| Work packet detail route | DB-backed detail reads work packet, inbox, events, motion artifacts, runtime/debug events, and can update packets, route actions, and write receipt artifacts through existing server actions. | Work packet status, repo, role, motion, evidence, operator decision, receipt status. | Current route contains live app-local mutation/file-write behavior; B40 alignment must not create new authority and should label pre-existing behavior distinctly. | `portal/src/app/operator/work/[id]/page.tsx` |
| Motion evidence read | Detail route reads `.nexus/motions/*` artifacts for governing motion state when tags include a motion id. | Motion, evidence, receipt, decision/handoff status. | Evidence read is not program taxonomy display and could be mistaken for source-of-truth transfer unless labeled. | `loadGoverningMotionState` in `[id]/page.tsx` |

## 7. Current `/operator/waves` surface inventory

| Observed item | Current representation | Taxonomy coverage | Gap / risk | Evidence |
|---------------|------------------------|-------------------|------------|----------|
| Waves index | Seeded fixture wave sessions from continuity data; read-only planning spine with wave id, status, repo, surface, project, motions, chats, work packets, next prompt preview, and NH node tree. | Wave, repo, surface, project, motion ids, work packet ids, status. | Does not display program, batch, lane, thread, evidence/closeout readiness, or CONTROL_THREAD decision posture as first-class fields. | `portal/src/app/operator/waves/page.tsx` |
| Wave artifact preview | Displays expected `.nexus/waves/<wave>/wave.yaml` and `plan.md` paths and uses `fs.existsSync` to show whether artifacts are present. | Evidence path preview, wave artifact status. | Presence check is local file evidence only; not acceptance, source-of-truth transfer, or runtime readiness. | `WaveCard` in `waves/page.tsx` |
| Wave node tree | NH ID hierarchy with node status, linked motions, chats, work packets, candidates, acceptance notes, and children. | Wave hierarchy, status, evidence links. | NH ID hierarchy needs mapping to program/batch/wave/lane/thread taxonomy. | `WaveNodeTree` and `WavePlan` |
| Wave detail route | Authenticated DB-read detail page for pilot session and latest plan action payload; displays tasks as read-only. | Session, project key, wave label, task status, target. | DB-read detail is not seeded fixture only; program taxonomy should label evidence source and read-only posture. | `portal/src/app/operator/waves/[sessionId]/page.tsx` |
| Blocked wave actions | Shows Run wave, Dispatch prompt, Create receipt, Dispatch wave, Mutate session, Update canon as blocked. | Authority boundary. | Boundary copy is strong but should be taxonomy-aware for program close. | `waves/page.tsx`, `waves/[sessionId]/page.tsx` |

## 8. Required JAI NEXUS program taxonomy

| Taxonomy field | Meaning | Required display posture | Boundary |
|----------------|---------|--------------------------|----------|
| Motion | CONTROL_THREAD-level intent, decision unit, or action frame. | Display linked motion id/label and decision state. | Motion display is not execution or acceptance. |
| Program | Top-level coordinated effort, such as `Q3M7Y26 JAI Motion Control Plane Activation v0`. | Display program id/name on Work and Waves. | Program display is not production readiness. |
| Batch | Program subdivision. | Display batch id where lane is grouped. | Batch grouping is not broad authority. |
| Wave | Batch grouping of coordinated lanes. | Display wave id and membership. | Wave grouping is not scheduler behavior. |
| Lane | Specific work/review/planning/receipt unit. | Display lane id/type/status. | Lane display is not route execution. |
| Thread | Conversational or operational context for a lane. | Display thread id/ref or passalong context. | Thread display is not source-of-truth transfer. |
| Repo | Repository receiving the lane. | Display repo owner/name. | Repo display is not target-repo mutation. |
| Scope | What the lane is about. | Display concise scope. | Scope display is not implementation authorization. |
| Mode | Active authority/operation boundary. | Display mode tokens and blocked capabilities. | Mode display does not grant capability. |
| Role | Actor/role posture, such as `JAI::DEV::BUILDER`. | Display role value. | Role display is not Agent activation. |
| Status | Queued, active, implemented, reviewed, accepted, held, blocked, closed, etc. | Display normalized status and source. | Status display is not CONTROL_THREAD acceptance unless accepted by CONTROL_THREAD. |
| Evidence | Artifacts, closeouts, reviews, receipts, tests, or passalong-grounded evidence. | Distinguish referenced, repo-local, reviewed, accepted, and passalong-grounded. | Evidence display is not verification unless verified. |
| Closeout | Lane completion summary, validations, evidence, non-authorizations, and recommended next route. | Display closeout refs and submitted/accepted distinction. | Closeout display is not acceptance. |
| CONTROL_THREAD decision posture | Routed, accepted, held, rejected, review-required, closeout-ready, or program-close-candidate. | Display explicit posture and required next decision. | CONTROL_THREAD remains routing/acceptance/hold authority. |

## 9. Taxonomy gap analysis

| Taxonomy field | `/operator/work` gap | `/operator/waves` gap | Program-close risk | Recommended alignment |
|----------------|----------------------|------------------------|--------------------|-----------------------|
| Motion | Present as source seam or tag-derived governing motion, not standardized. | Related motion ids present. | Motion context may not be comparable across surfaces. | Add normalized motion id/label field. |
| Program | Not first-class. | Not first-class. | Program-close chain cannot be reviewed at a glance. | Add program id/name header metadata. |
| Batch | Not first-class. | Not first-class. | Batch grouping is ambiguous. | Add batch id/display label. |
| Wave | Work references work-wave vocabulary but not current wave id consistently. | Wave id present. | Work and Waves may not align on same wave. | Display wave id on lane/work cards. |
| Lane | Work packet/lane type exists, but current B-lane taxonomy absent. | Nodes/tasks show NH/task ids, not lane ids. | Lane closeouts are hard to reconcile. | Add lane id/lane type fields. |
| Thread | Passalong/chat context is indirect. | Related chat ids present. | Thread evidence may be confused with repo-local evidence. | Add thread id/source posture. |
| Repo | Present. | Present. | Low risk, but target-repo mutation boundary must stay visible. | Keep repo display plus mutation boundary copy. |
| Scope | Present in composer and work detail, not normalized. | Surface/project summaries present. | Scope may be too narrative for closeout. | Add concise scope field. |
| Mode | Present in composer, not consistent elsewhere. | Boundary badges present, no mode field. | Authority posture may be fragmented. | Add mode token display. |
| Role | Work has roles/assignee; B-lane role absent. | No lane role. | Role posture may be mistaken for Agent activation. | Add role display and Agent activation blocked copy. |
| Status | Multiple status vocabularies. | Planned/active/done plus DB task statuses. | Reviewed vs accepted may blur. | Add taxonomy status mapping with source. |
| Evidence | Evidence expectations and events present; not consistently classified. | Artifact paths and links present. | Passalong-grounded vs repo-local may blur. | Add evidence status vocabulary. |
| Closeout | Closeout requirements in composer/profile, not lane closeout model. | No repo-lane closeout model. | Program close may lack lane evidence. | Add closeout refs/status fields. |
| CONTROL_THREAD posture | Copy exists but not normalized. | Copy exists but not normalized. | Closeout display could be mistaken for acceptance. | Add explicit decision posture field. |

## 10. Target taxonomy field model

| Field | Target model meaning | Required on Work? | Required on Waves? | Required on closeout? |
|-------|----------------------|-------------------|--------------------|-----------------------|
| `motion_id` or `motion_label` | Linked CONTROL_THREAD motion/action frame. | Yes | Yes | Yes |
| `program_id` | Stable program id. | Yes | Yes | Yes |
| `program_name` | Human-readable program name. | Yes | Yes | Yes |
| `batch_id` | Program subdivision. | Yes | Yes | Yes |
| `wave_id` | Batch wave grouping. | Yes | Yes | Yes |
| `lane_id` | Specific lane identifier. | Yes | Yes | Yes |
| `thread_id` | Conversational/operational thread ref. | Yes | Yes | Yes |
| `repo` | Target repo. | Yes | Yes | Yes |
| `scope` | Lane scope. | Yes | Yes | Yes |
| `mode` | Authority/operation boundary. | Yes | Yes | Yes |
| `role` | Actor/role posture. | Yes | Optional | Yes |
| `lane_type` | Implementation/review/planning/receipt/etc. | Yes | Yes | Yes |
| `status` | Normalized lane/work status. | Yes | Yes | Yes |
| `evidence_refs` | Evidence artifact refs. | Yes | Yes | Yes |
| `closeout_refs` | Closeout artifact refs. | Yes | Yes | Yes |
| `validation_summary` | Validation performed/result summary. | Yes | Optional | Yes |
| `non_authorizations` | Blocked capabilities. | Yes | Yes | Yes |
| `blockers` | Known blockers or caveats. | Yes | Yes | Yes |
| `recommended_next_route` | Proposed next lane. | Yes | Yes | Yes |
| `control_thread_decision_status` | Routed, accepted, held, blocked, etc. | Yes | Yes | Yes |
| `control_thread_decision_required` | Whether CONTROL_THREAD decision is still needed. | Yes | Yes | Yes |
| `authority_boundary_summary` | Concise non-authorization copy. | Yes | Yes | Yes |

## 11. Surface-to-taxonomy mapping

| Surface | Primary responsibility | Taxonomy fields displayed | Must not imply |
|---------|------------------------|---------------------------|-----------------|
| `/operator/work` | Lane/repo/thread/role/status/evidence/closeout detail-first view. | Motion, program, batch, wave, lane, thread, repo, scope, mode, role, lane type, status, evidence refs, closeout refs, validation, blockers, next route, CONTROL_THREAD posture. | Autonomous execution, target-repo mutation, provider dispatch, GitHub API mutation, acceptance authority. |
| `/operator/waves` | Program/batch/wave grouping, sequencing, readiness, and closeout-readiness view. | Program, batch, wave, lane membership, thread refs, repo grouping, status, evidence readiness, closeout readiness, CONTROL_THREAD posture. | Route execution, runtime activation, automatic scheduling, provider dispatch, GitHub mutation, production authority. |
| Shared taxonomy copy | Common vocabulary displayed consistently across Work/Waves. | Program, batch, wave, lane, thread, repo, scope, mode, role, status, evidence, closeout, CONTROL_THREAD decision posture. | Source-of-truth transfer or accepted state without CONTROL_THREAD acceptance. |
| Shared boundary copy | Non-authoritative advisory/human-supervised posture. | Non-authorizations and blocked capabilities. | Capability grant, hidden automation, execution authority transfer. |

## 12. `/operator/work` target representation

B39 plans `/operator/work` as the repo-lane and work-packet level coordination surface.

B39 plans Work to expose lane-level status, repo, role, scope, mode, evidence, closeout, validation summary, blockers, recommended next route, and CONTROL_THREAD decision posture. Work should help the operator inspect what work exists, what it belongs to, and whether it is queued, active, implemented, reviewed, accepted, held, blocked, or closed.

B39 plans B40 to keep current pre-existing mutation/detail routes clearly labeled as pre-existing app-local behavior and not broaden them. The taxonomy upgrade should preferably begin with display metadata and static/read-only presentation around existing Work views, not new database writes or execution controls.

## 13. `/operator/waves` target representation

B39 plans `/operator/waves` as the program/batch/wave grouping and sequencing surface.

B39 plans Waves to expose program, batch, wave, lane membership, thread relationships, surface readiness, evidence readiness, closeout readiness, and CONTROL_THREAD decision posture. Waves should help the operator understand work sequencing, grouping, program-close implications, and readiness gaps.

B39 plans B40 to preserve seeded fixture/index posture and DB-read detail posture without adding route execution, automatic scheduling, runtime activation, GitHub mutation, provider dispatch, or production authority.

## 14. Program / batch / wave / lane / thread distinction

| Concept | Display meaning | Work surface posture | Waves surface posture | Boundary |
|---------|-----------------|----------------------|-----------------------|----------|
| Program | Top-level coordinated effort. | Show program id/name per lane/work packet. | Show program id/name as wave header. | Program display is not production readiness. |
| Batch | Program subdivision. | Show batch id for lane grouping. | Group waves under batch id. | Batch grouping is not broad authority. |
| Wave | Coordinated group of lanes. | Show wave id membership for work item. | Primary grouping unit. | Wave is not scheduler. |
| Lane | Specific planning/implementation/review/receipt unit. | Primary work unit and closeout unit. | Lane membership under wave. | Lane display is not route execution. |
| Thread | Conversational/operational context. | Show thread/passalong/chat ref and evidence posture. | Show related thread/chat refs. | Thread reference is not source-of-truth transfer. |

## 15. Repo-lane closeout representation

| Closeout field | Display meaning | Evidence relationship | Boundary |
|----------------|-----------------|----------------------|----------|
| Branch | Routed repo branch. | Closeout-reported or repo-local. | Branch display is not branch creation authority. |
| Commit | Lane commit hash. | Closeout-reported or repo-local. | Commit display is not acceptance. |
| Files changed | Lane diff summary. | Closeout evidence. | File list is not source authorization. |
| Summary | Lane outcome. | Closeout prose. | Summary is not CONTROL_THREAD acceptance. |
| Validation performed | Commands/checks and results. | Closeout evidence. | Validation is not approval. |
| Non-authorization scan | Scan result/classification. | Closeout evidence. | Scan passing is not production readiness. |
| Clean PR history gate | Branch history/diff check. | Closeout evidence. | Clean history is not merge authority. |
| Push result | Branch publish result. | Closeout evidence. | Push is not PR/merge authority. |
| PR status | Not created, draft, open, etc. | Closeout or repo-local display. | PR display is not PR automation. |
| Evidence refs | Docs/reviews/receipts/tests. | Evidence links. | Refs distinguish repo-local vs passalong-grounded. |
| Recommendation | Suggested next route. | Closeout recommendation. | Recommendation is not routing authority. |
| Open risks | Remaining caveats. | Closeout risk section. | Risk display does not unblock work. |
| CONTROL_THREAD decision status | Routed, reviewed, accepted, held, etc. | CONTROL_THREAD decision copy. | CONTROL_THREAD remains authority. |

## 16. Evidence and closeout status display planning

| Evidence/status item | Display meaning | Allowed posture | Blocked interpretation |
|----------------------|-----------------|-----------------|------------------------|
| `missing` | Expected evidence absent. | Display gap. | Not blocker resolution. |
| `referenced` | Evidence is named or linked. | Display pointer. | Not verified evidence. |
| `passalong-grounded` | Evidence is supplied by CONTROL_THREAD/passalong context. | Display caveat. | Not repo-local evidence. |
| `repo-local` | Evidence is present in repo. | Display local artifact ref. | Not source-of-truth transfer. |
| `reviewed` | Review artifact exists. | Display reviewed state. | Not accepted unless CONTROL_THREAD accepted. |
| `accepted` | CONTROL_THREAD accepted. | Display accepted copy with source. | Not production readiness. |
| `held` | CONTROL_THREAD or review hold. | Display hold reason. | Not automatic pause/resume control. |
| `blocked` | Blocker exists. | Display blocker. | Not remediation. |
| `superseded` | Replaced by later lane. | Display lineage. | Not deletion authority. |
| `closeout-ready` | Closeout appears ready for review. | Display candidate status. | Not acceptance. |
| `program-close-candidate` | Candidate for program-close planning. | Display candidate status. | Not production readiness. |

## 17. CONTROL_THREAD decision posture display planning

| Decision posture item | Display meaning | Required copy | Boundary |
|-----------------------|-----------------|---------------|----------|
| Routed | CONTROL_THREAD routed lane. | `CONTROL_THREAD routed this lane.` | Routing display is not execution. |
| In progress | Work is underway. | `In progress is not accepted.` | Does not authorize runtime. |
| Closeout submitted | Lane closeout reported. | `Closeout display is not acceptance.` | No acceptance transfer. |
| Reviewed | Boundary/review complete. | `Reviewed is not accepted unless CONTROL_THREAD accepts.` | Review is not gate opening. |
| Accepted | CONTROL_THREAD accepted. | `Accepted by CONTROL_THREAD.` | Still not production readiness unless explicitly routed. |
| Held | CONTROL_THREAD held lane. | `Held pending CONTROL_THREAD direction.` | No automatic resume. |
| Blocked | Blocker prevents progress. | `Blocked status does not remediate itself.` | No automatic fix. |
| Rejected | CONTROL_THREAD rejected. | `Rejected by CONTROL_THREAD.` | No retry without route. |
| Review required | Needs review. | `CONTROL_THREAD review required.` | No self-approval. |
| Program close candidate | Candidate for program-close planning. | `Program-close candidate is not production readiness.` | No production gate. |

## 18. Authority-boundary copy requirements

| Boundary copy item | Where displayed | Reason | Non-authorization preserved |
|--------------------|----------------|--------|----------------------------|
| Non-authoritative display | Work and Waves headers. | Prevent display from becoming source of truth. | No source-of-truth transfer. |
| Advisory-only planning/status | Status and evidence panels. | Clarify planning posture. | No acceptance authority. |
| Human-supervised operation | Header/safety rail. | Preserve manual operator path. | No hidden automation. |
| CONTROL_THREAD decision authority | Decision posture panels. | Keep accept/hold/routing with CONTROL_THREAD. | No acceptance authority transfer. |
| No autonomous execution | Work packet and wave actions. | Prevent work/wave labels from implying execution. | No runtime or packet execution. |
| No provider/model/API dispatch | Work/role/Agent panels. | Role display could be mistaken for dispatch. | No provider/model/API dispatch. |
| No GitHub/API mutation | Repo/branch/PR panels. | Repo fields could be mistaken for mutation. | No GitHub/API mutation. |
| No target-repo mutation/import | Repo and closeout panels. | File/branch/commit display is evidence only. | No target-repo mutation/import. |
| No accepted-code import | Closeout/evidence panels. | Accepted code import requires separate route. | No accepted-code import. |
| No deployment/production gates | Program-close panels. | Program-close candidate is not production readiness. | No deployment or production gates. |
| No hidden/background automation | Header/safety rail. | Block timers, polling, jobs. | No hidden/background automation. |

## 19. What remains blocked

| Blocked capability | Applies to Work? | Applies to Waves? | Boundary rationale |
|--------------------|------------------|-------------------|--------------------|
| Implementation in B39 | Yes | Yes | B39 is planning-only. |
| Source changes | Yes | Yes | Docs/reference only. |
| Test changes | Yes | Yes | No source/test lane. |
| Runtime behavior | Yes | Yes | Taxonomy display is not runtime. |
| Packet execution | Yes | Yes | Work packets do not execute themselves. |
| Sandbox task execution | Yes | Yes | No sandbox task path. |
| JAI Agent activation | Yes | Yes | Role display is not activation. |
| Provider/model/API dispatch | Yes | Yes | No dispatch behavior. |
| GitHub/API mutation | Yes | Yes | Repo/branch/PR display is not mutation. |
| Target-repo mutation | Yes | Yes | No target repo changes. |
| Target-repo import | Yes | Yes | No code import. |
| Accepted-code import | Yes | Yes | No accepted-code path. |
| Deployment | Yes | Yes | Program close is not deployment. |
| Production gates | Yes | Yes | Candidate status is not readiness gate. |
| Source-of-truth transfer | Yes | Yes | Evidence display stays non-authoritative. |
| Hidden/background automation | Yes | Yes | No hidden loops or jobs. |
| Timers | Yes | Yes | No scheduled behavior. |
| Polling | Yes | Yes | No auto-refresh/polling. |
| Background jobs | Yes | Yes | No background job. |
| Automatic route execution | Yes | Yes | Route recommendation is manual. |
| Automatic delivery | Yes | Yes | No automatic send/delivery. |
| Acceptance authority transfer | Yes | Yes | CONTROL_THREAD decides. |
| Execution authority transfer | Yes | Yes | Display does not execute. |

## 20. Smallest useful B40 implementation

B39 recommends the smallest useful B40 implementation:

- Add or update local-static taxonomy helper/data model if useful.
- Align `/operator/work` display fields with program, batch, wave, lane, thread, repo, scope, mode, role, status, evidence, closeout, and CONTROL_THREAD posture.
- Align `/operator/waves` display fields with program, batch, wave, lane grouping, readiness, closeout status, evidence readiness, and CONTROL_THREAD posture.
- Add visible authority-boundary copy that says Work/Waves taxonomy display is non-authoritative, advisory, human-supervised, and CONTROL_THREAD-review-required.
- Add focused local tests if source is changed.
- Do not add runtime, dispatch, mutation, import, deployment, polling, background jobs, automatic execution, or new source-of-truth behavior.

## 21. B41 review recommendation

B39 recommends `B41 Work and Waves Program Taxonomy Alignment Boundary Review v0` after B40.

B41 should be review-only and confirm:

- B40 remains app-local and local-static.
- Work/Waves taxonomy fields are display-only.
- CONTROL_THREAD decision posture remains non-authoritative display.
- No runtime, dispatch, GitHub mutation, target-repo mutation/import, accepted-code import, deployment, production gates, source-of-truth transfer, timers, polling, or background jobs exist.

## 22. B42 closeout implications

B39 plans B42 candidate `B42 Q3M7 Work/Waves Program-Close Readiness Receipt v0`.

B42 should record whether Work/Waves taxonomy alignment is sufficient for Q3M7Y26 program-close planning. B42 must not imply production readiness, runtime activation, provider/API dispatch, GitHub mutation, target-repo mutation/import, deployment, production gates, source-of-truth transfer, or authority transfer.

## 23. Rejected implementation paths

| Rejected path | Reason rejected | Risk avoided |
|---------------|-----------------|--------------|
| Implementing in B39 | B39 is docs/reference planning-only. | Unauthorized source/test changes. |
| Adding live API-backed Work/Waves data | Not needed for taxonomy planning. | API behavior and source-of-truth confusion. |
| Adding database-backed taxonomy state | B39 cannot change schema/data. | Migration and persistence authority. |
| Adding automatic route execution | Work/Waves are display/planning surfaces. | Execution authority transfer. |
| Adding GitHub API mutation | Repo fields are display only. | GitHub mutation/PR automation. |
| Adding provider/model/API dispatch | Role/Agent fields are not dispatch. | Provider/model/API execution. |
| Adding target-repo mutation/import | Taxonomy alignment is app-local display. | Target-repo mutation/import. |
| Adding accepted-code import | Closeout acceptance is not code import. | Source-of-truth transfer. |
| Adding timers/polling/background jobs | Program taxonomy does not require automation. | Hidden/background automation. |
| Turning closeout display into acceptance authority | CONTROL_THREAD accepts. | Acceptance authority transfer. |
| Turning program-close candidate into production readiness | Program close planning is not production. | Production gate overclaim. |
| Treating passalong-grounded evidence as repo-local verified evidence | Evidence classes must remain distinct. | Evidence overclaim/source-of-truth transfer. |

## 24. Risks and interpretive guardrails

B39 identifies these risks:

- Work currently mixes read-only display surfaces with pre-existing DB mutation/detail routes; B40 must not blur them.
- Waves index is seeded fixture/read-only, while Wave detail is DB-read; B40 should label source posture per panel.
- Program-close candidate status may be mistaken for production readiness.
- Closeout display may be mistaken for CONTROL_THREAD acceptance.
- Passalong-grounded evidence may be mistaken for repo-local verified evidence.
- Motion/batch/wave/lane terms may be inconsistent unless Work and Waves share field labels.

B39 plans guardrails that distinguish display readiness from execution readiness, reviewed from accepted, closeout submitted from CONTROL_THREAD accepted, and program-close candidate from production readiness.

## 25. Recommended B40 route

B39 recommends `B40 Work and Waves Program Taxonomy Alignment Implementation v0`.

Recommended branch:

`feature/q3m7-work-waves-program-taxonomy-alignment-v0`

Recommended posture:

- app-local source implementation
- local-static display metadata only
- non-authoritative
- advisory display only
- human-supervised
- no runtime behavior
- no packet execution
- no sandbox task execution
- no JAI Agent activation
- no provider/model/API dispatch
- no GitHub/API mutation
- no target-repo mutation/import
- no accepted-code import
- no deployment
- no production gates

## 26. Validation

B39 validation:

- `git diff --check`
- `git diff --cached --check`
- targeted non-authorization scan over changed files and relevant docs/source paths

B39 found no repo-local docs/static validation script in package scripts. B39 did not run source validation because B39 made no source changes. B39 did not run migration tests, apply migrations, run Prisma migration commands, connect to deployed databases, call APIs, call providers/models, execute sandbox behavior, activate JAI Agents, mutate target repos, import accepted code, deploy, or perform DNS changes.

## 27. Authority boundary

B39 does not authorize implementation, source changes, test changes, runtime behavior, packet execution, sandbox task execution, JAI Agent activation, provider/model/API dispatch, GitHub/API mutation, target-repo mutation, target-repo import, accepted-code import, deployment, production gates, source-of-truth transfer, hidden/background automation, timers, polling, background jobs, automatic route execution, automatic delivery, acceptance authority transfer, execution authority transfer, PR automation, merge, or CONTROL_THREAD acceptance.

## 28. Repo-lane closeout

B39 records a planning-only path for aligning Work and Waves with the current JAI NEXUS program taxonomy.

B39 preserves:

- planning-only
- docs/reference-only
- app-local
- non-authoritative
- display-planning
- human-supervised
- no implementation
- no source changes
- no test changes
- no runtime behavior
- no packet execution
- no sandbox task execution
- no JAI Agent activation
- no provider/model/API dispatch
- no GitHub/API mutation
- no target-repo mutation/import
- no accepted-code import
- no deployment
- no production gates
- no source-of-truth transfer
- no hidden/background automation
- no timers
- no polling
- no background jobs
- no automatic route execution
- no automatic delivery
- no acceptance authority transfer
- no execution authority transfer

B39 recommends `B40 Work and Waves Program Taxonomy Alignment Implementation v0`.
