# Operator Domain Engine Workspace jai-format Alignment Planning v0

## 1. Purpose

This docs/reference artifact maps the current `/operator/work` Operator Domain Engine Workspace profile object draft to accepted `jai-format` Q3M7 profile vocabulary.

Alignment planning only; not implementation authority.

Profile object draft only; not parser/runtime.

Static representation only; not API/DB-backed state.

Local UI object shape is not canonical schema.

`jai-format` alignment planning does not mutate `jai-format` canon.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Accepted baseline

Accepted prior dev-jai-nexus lanes:

- Q3M7 Operator Domain Engine Workspace v0
- Q3M7 Operator Domain Engine Workspace QA + Density v0
- Q3M7 Operator Domain Engine Workspace Profile Sketch v0
- Q3M7 Operator Domain Engine Workspace Profile Object Draft v0
- Q3M7 Operator Domain Engine Workspace Verifier Review v0
- Q3M7 Operator Domain Engine Workspace Librarian Reference v0

Accepted lineage remains static, local, representational, copy-handoff oriented, and human-approval based.

Planning only; not execution.

Recommendation only; not routing authority.

Request only; not activation.

Assignment only; not activation.

## 3. Files inspected

Inspected files:

- `docs/reference/operator-domain-engine-workspace-librarian-reference-v0.md`
- `docs/reference/operator-domain-engine-workspace-verifier-review-v0.md`
- `portal/src/app/operator/work/_components/OperatorDomainEngineWorkspace.tsx`

No UI file changes are authorized or required by this alignment planning artifact.

## 4. Current workspace object-shape summary

The workspace currently includes a local static profile object draft built inside `OperatorDomainEngineWorkspace.tsx`.

The draft represents:

- selected `.nexus` domain lane
- `agent-domain-engine/v0` namespace posture
- staged Agent assignment recommendations
- blocked `agent-activation-request/v0` posture
- work-wave sequence from Work Packet to CONTROL_THREAD acceptance
- repo-lane display context
- authority boundary rail

The object shape is useful for operator reasoning and copy-handoff, but it is not canonical schema.

## 5. Current accepted object keys

Accepted current workspace object keys:

- `profile_object_draft_id`
- `object_status`
- `source_route`
- `profile_refs`
- `domain_engine_assignment_v0`
- `agent_assignment_recommendation_v0`
- `agent_activation_request_v0`
- `work_wave_v0`
- `repo_lane_v0`
- `control_thread_acceptance`
- `authority_boundary`

These keys are planning inputs only. They do not create `jai-format` objects, parser-ready schemas, profile records, receipts, canon updates, or gates.

## 6. Mapping to jai-format profile vocabulary

Candidate mapping:

| Current key or workspace concept | Accepted vocabulary | Alignment posture |
| --- | --- | --- |
| `profile_object_draft_id` | profile object identity candidate | local draft identifier; needs future profile decision |
| `object_status` | profile status candidate | aligns conceptually; controlled values unresolved |
| `source_route` | `route/v0` | aligns as source route reference, not route creation |
| `profile_refs` | profile dependency references | aligns as reference list, not imports/runtime |
| `domain_engine_assignment_v0` | `domain-engine-assignment/v0` | clean semantic alignment |
| nested `agent_domain_engine_v0` | `agent-domain-engine/v0` | clean semantic alignment, but not listed as target profile in this route |
| `agent_assignment_recommendation_v0` | `agent-assignment-recommendation/v0` | clean semantic alignment |
| `agent_activation_request_v0` | `agent-activation-request/v0` | aligns only as blocked future request posture |
| `work_wave_v0` | `work-wave/v0` | clean semantic alignment |
| work-wave stage `work-packet/v0` | `work-packet/v0` | clean semantic alignment |
| work-wave stage `route/v0` | `route/v0` or `route-packet/v0` | may need route-packet distinction |
| work-wave stage `validation-report/v0` | `validation-report/v0` | clean semantic alignment |
| work-wave stage `closeout-packet/v0` | `closeout-packet/v0` | clean semantic alignment |
| `repo_lane_v0` | `repo-lane/v0` | clean semantic alignment |
| `control_thread_acceptance` | acceptance checkpoint | should likely remain dev-jai-nexus-local or map to receipt/control lineage later |
| `authority_boundary` | non-authority boundary fields | should be required posture if formalized |

Accepted `jai-format` profile vocabulary considered here:

- `route-packet/v0`
- `work-wave/v0`
- `domain-engine-assignment/v0`
- `agent-assignment-recommendation/v0`
- `agent-activation-request/v0`
- `work-packet/v0`
- `validation-report/v0`
- `closeout-packet/v0`
- `route/v0`
- `repo-lane/v0`

## 7. Keys that align cleanly

Keys that align cleanly with accepted profile vocabulary:

- `domain_engine_assignment_v0` maps to `domain-engine-assignment/v0`.
- `agent_assignment_recommendation_v0` maps to `agent-assignment-recommendation/v0`.
- `agent_activation_request_v0` maps to `agent-activation-request/v0` only as blocked request posture.
- `work_wave_v0` maps to `work-wave/v0`.
- `repo_lane_v0` maps to `repo-lane/v0`.
- `source_route` maps to a `route/v0` reference.

Related work-wave stage concepts align cleanly:

- Work Packet maps to `work-packet/v0`.
- Validation Report maps to `validation-report/v0`.
- Closeout Packet maps to `closeout-packet/v0`.

## 8. Keys that may need renaming

Keys or concepts that may need renaming before any future `jai-format` object draft:

- `profile_object_draft_id`: may need a specific object ID field such as `operator_workspace_profile_object_id` if a formal profile emerges.
- `object_status`: may need controlled status values distinct from UI display status.
- `profile_refs`: may need a clearer name such as `profile_references` or `profile_dependencies`.
- `source_route`: may need `route_ref` if it is only a route reference.
- work-wave stage `route/v0`: may need `route-packet/v0` where the meaning is a copy-handoff route packet rather than route profile.
- `control_thread_acceptance`: may need separation into `acceptance_checkpoint`, `decision_authority`, and possible future `receipt_ref`.
- `authority_boundary`: may need a standard non-authority posture block if shared across profiles.

No renaming is authorized by this artifact.

## 9. Keys that should remain dev-jai-nexus-local

Keys or fields that should remain dev-jai-nexus-local unless separately accepted:

- `profile_object_draft_id`, while it identifies a local draft surface.
- `source_route`, while it references `/operator/work` UI context.
- `control_thread_acceptance`, while it represents local human approval checkpoint language.
- `authority_boundary`, while it preserves local display boundary text.
- verifier finding summaries, while they remain review/context lineage.
- copy-handoff wording, while it is optimized for CONTROL_THREAD-to-repo passalong.

These fields may inform future profiles but should not be treated as canonical `jai-format` schema in this planning route.

## 10. Candidate future jai-format profile/object considerations

Future `jai-format` consideration areas:

- whether to create a dedicated operator workspace profile object
- whether `work-wave/v0` should own the packet sequence
- whether `route-packet/v0` should be distinct from `route/v0` in the workspace object
- whether `agent-activation-request/v0` should be allowed as a blocked placeholder field
- whether `domain-engine-assignment/v0` should include nested `agent-domain-engine/v0` references
- whether `agent-assignment-recommendation/v0` should require candidate IDs, namespace, role template, required reviews, and required gates
- whether all profile object drafts must include explicit `authority_boundary`
- whether future object drafts should include `receipt_ref` only as a lineage placeholder

Any future `jai-format` route must be accepted separately by CONTROL_THREAD.

## 11. Candidate future orchestrator-nexus compatibility considerations

Future `orchestrator-nexus` compatibility should consider:

- whether `work-wave/v0` maps to orchestrator planning queues without scheduling behavior
- whether `repo-lane/v0` needs stable repo IDs for cross-repo planning
- whether `route-packet/v0` should remain copy-handoff only
- whether validation and closeout packet references can be represented without acceptance authority
- whether CONTROL_THREAD acceptance checkpoints become explicit non-automation boundaries
- whether blocked activation requests should be visible to orchestrator planning without becoming executable work

This planning artifact does not authorize orchestrator implementation, scheduler behavior, autonomous loops, Agent dispatch, branch/PR automation, or gate opening.

## 12. Copy-handoff implications

The current workspace handoff output should continue to include:

- selected domain lane
- domain engine reference
- repo/domain lane
- future work/wave lane
- profile vocabulary
- static profile object draft
- verifier findings
- staged Agent recommendation context
- blocked capability list
- human approval checkpoint
- validation and closeout expectations
- authority rail

Copy-handoff output should remain manually copied text. It must not send, submit, route, dispatch, persist, create branches, open PRs, create receipts, update canon, or open gates.

## 13. Authority-boundary implications

Authority-boundary implications for future alignment:

- Alignment planning only; not implementation authority.
- Profile object draft only; not parser/runtime.
- Static representation only; not API/DB-backed state.
- Local UI object shape is not canonical schema.
- `jai-format` alignment planning does not mutate `jai-format` canon.
- Planning only; not execution.
- Recommendation only; not routing authority.
- Request only; not activation.
- Assignment only; not activation.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

Future profiles should preserve these boundaries as first-class posture fields where appropriate.

## 14. Non-authorized behaviors

This alignment planning artifact does not authorize:

- parser
- runtime
- API behavior
- DB behavior
- Prisma behavior
- persistence
- Agent dispatch
- Agent activation
- Agent execution
- Agent creation
- automatic Agent assignment
- provider/model dispatch
- live model calls
- GitHub integration
- GitHub API use
- branch/PR automation by the app
- browser/desktop control
- terminal execution by the app
- scheduler
- autonomous loop
- telemetry
- customer-data handling
- `.jai` parser/runtime behavior
- `.nexus` active runtime semantics
- policy enforcement
- gate opening
- automatic receipt creation
- canon mutation by the app
- route-state mutation
- motion-state mutation

ZERO GATES GRANTED.

## 15. Risks

- Risk: local UI object shape may be mistaken for canonical `jai-format` schema. Mitigation: this artifact states local UI object shape is not canonical schema.
- Risk: alignment planning may be mistaken for `jai-format` canon mutation. Mitigation: this artifact states planning does not mutate `jai-format` canon.
- Risk: `agent-activation-request/v0` may imply activation. Mitigation: it is mapped only as blocked future request posture.
- Risk: `route/v0` and `route-packet/v0` may be conflated. Mitigation: this artifact flags the naming distinction for future review.
- Risk: copy-handoff may be mistaken for dispatch. Mitigation: this artifact preserves copy-only non-authority boundaries.
- Risk: orchestrator compatibility may imply scheduler behavior. Mitigation: this artifact explicitly blocks scheduler, autonomous loop, and gate behavior.

## 16. Recommended follow-up routes

Recommended next route:

- `Q3M7 Operator Domain Engine Workspace route-packet/work-wave Field Review v0`

Alternative follow-up routes:

- `Q3M7 Operator Domain Engine Workspace jai-format Object Candidate Decision v0`
- `Q3M7 Operator Domain Engine Workspace Orchestrator Compatibility Review v0`
- `Q3M7 Operator Domain Engine Workspace Copy-Handoff Profile Packet Review v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 17. Verification notes

Verification notes:

- Accepted lineage artifacts were inspected.
- Current workspace object keys were preserved and assessed.
- Accepted `jai-format` Q3M7 vocabulary was mapped.
- Cleanly aligned keys were separated from possible renames.
- dev-jai-nexus-local fields were identified.
- Future `jai-format` and `orchestrator-nexus` considerations were separated from current planning.
- Copy-handoff and authority-boundary implications were recorded.
- Non-authorized behaviors remain blocked.

This artifact is docs/reference only.

CONTROL_THREAD decides.

ZERO GATES GRANTED.
