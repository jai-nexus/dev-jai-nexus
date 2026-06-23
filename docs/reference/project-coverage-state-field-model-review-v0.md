# Project Coverage State Field Model Review v0

## 1. Purpose

This docs/reference artifact reviews candidate field models for project coverage state in the operator control plane.

Field review only; not implementation authority.

This review covers project coverage, domain coverage, JAI::AGENT coverage, artifact coverage, gate coverage, risk coverage, readiness states, NHID hierarchy display, and JAI Grid presets before any UI implementation, parser, runtime, API, DB, persistence, Agent activation, Agent dispatch, provider/model dispatch, route-state mutation, motion-state mutation, receipt/canon mutation, or gate behavior.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Accepted baseline

Accepted prior dev-jai-nexus input:

- Q3M7 Project Coverage State Operator Planning v0

Accepted planning artifact:

- `docs/reference/project-coverage-state-operator-planning-v0.md`

Accepted profile/context inputs:

- `jai-format / project-coverage-state/v0`
- `jai-format / domain-coverage-state/v0`
- `jai-format / jai-agent-coverage-state/v0`
- `jai-format / nhid/v0`
- `orchestrator-nexus / Q3M7 Project Coverage State + NHID Work-Wave Spine v0`

The accepted baseline is planning-only and static-only.

## 3. Files/surfaces inspected

Inspected references and surfaces:

- `docs/reference/project-coverage-state-operator-planning-v0.md`
- `docs/reference/operator-domain-engine-workspace-librarian-reference-v0.md`
- `docs/reference/operator-domain-engine-workspace-jai-format-alignment-planning-v0.md`
- `docs/reference/operator-domain-engine-workspace-route-packet-work-wave-field-review-v0.md`
- `portal/src/app/operator/work/_components/OperatorDomainEngineWorkspace.tsx`
- `/operator/work`
- `/operator/agents`
- `/operator/grid`
- `/operator/registry/coverage`

No UI, route, API, DB, Prisma, runtime, or persistence files are changed by this field review.

## 4. Field model review scope

This field model review classifies candidate fields into:

- fields that should remain local UI affordances
- fields that may belong to future `jai-format` profiles
- fields that may belong to `orchestrator-nexus` compatibility artifacts
- fields not ready for implementation
- candidate rename notes
- human approval and CONTROL_THREAD acceptance implications
- authority-boundary implications

Coverage state measures readiness; it does not approve readiness.

Coverage display is not activation.

## 5. Project coverage fields

Candidate project coverage fields:

- `project_id`
- `project_name`
- `project_scope`
- `project_status`
- `coverage_state`
- `coverage_summary`
- `coverage_gaps`
- `readiness_state`
- `risk_state`
- `gate_state`
- `decision_refs`
- `acceptance_refs`
- `last_reviewed_at`
- `review_owner`

Field review:

- `project_id`, `project_name`, and `project_scope` may belong to future `jai-format / project-coverage-state/v0`.
- `project_status`, `coverage_state`, `readiness_state`, `risk_state`, and `gate_state` may belong to future `jai-format` fields if controlled vocabularies are accepted.
- `coverage_summary` and `coverage_gaps` may remain local UI affordances until a structured evidence model is accepted.
- `decision_refs` and `acceptance_refs` may need receipt/control lineage review before implementation.
- `last_reviewed_at` and `review_owner` may belong to orchestrator compatibility artifacts if review cadence becomes operational.

Do not implement these fields in this route.

## 6. Domain coverage fields

Candidate domain coverage fields:

- `domain_engine_id`
- `domain_engine_name`
- `domain_scope`
- `domain_coverage_state`
- `assigned_repo_lanes`
- `assigned_agent_roles`
- `artifact_refs`
- `risk_refs`
- `gate_refs`
- `coverage_gaps`

Field review:

- `domain_engine_id`, `domain_engine_name`, and `domain_scope` may belong to `jai-format / domain-coverage-state/v0`.
- `domain_coverage_state` should use the shared readiness state vocabulary if accepted.
- `assigned_repo_lanes` may need `repo-lane/v0` compatibility.
- `assigned_agent_roles` may need `jai-agent-coverage-state/v0` compatibility.
- `artifact_refs`, `risk_refs`, and `gate_refs` may belong to future profile reference arrays.
- `coverage_gaps` may remain local until gap reason fields are standardized.

Domain-engine coverage is not domain-engine runtime activation.

## 7. JAI::AGENT coverage fields

Candidate JAI::AGENT coverage fields:

- `agent_role`
- `agent_candidate_ref`
- `agent_coverage_state`
- `assignment_recommendation_ref`
- `activation_request_ref`
- `blocked_authority`
- `required_review_refs`
- `coverage_gap_reason`

Field review:

- `agent_role` and `agent_candidate_ref` may belong to `jai-format / jai-agent-coverage-state/v0`.
- `agent_coverage_state` should use the shared readiness state vocabulary if accepted.
- `assignment_recommendation_ref` may reference staged recommendation context only.
- `activation_request_ref` must remain blocked unless future gates authorize activation request handling.
- `blocked_authority` should be explicit where Agent coverage is visible.
- `required_review_refs` may belong to future review/evidence linkage.
- `coverage_gap_reason` may remain local until gap taxonomy is accepted.

JAI::AGENT coverage is not Agent creation, activation, assignment, or dispatch.

## 8. Artifact coverage fields

Artifact coverage should review fields for:

- work packets
- route packets
- work waves
- validation reports
- closeouts
- acceptance receipts
- decisions
- motions
- transcripts
- panels
- repo/toolchain components

Candidate artifact fields:

- `artifact_type`
- `artifact_ref`
- `artifact_state`
- `artifact_owner`
- `artifact_required`
- `artifact_missing_reason`
- `artifact_last_reviewed_at`
- `artifact_staleness_note`
- `artifact_authority_boundary`

Field review:

- `artifact_type`, `artifact_ref`, and `artifact_state` may belong to future `jai-format` artifact coverage fields.
- `artifact_owner`, `artifact_last_reviewed_at`, and `artifact_staleness_note` may belong to orchestrator compatibility artifacts.
- `artifact_missing_reason` may remain local until gap taxonomy is accepted.
- `artifact_authority_boundary` should remain explicit if formalized.

Artifact coverage does not create receipts, mutate canon, or approve work.

## 9. Gate coverage fields

Candidate gate coverage fields:

- `gate_id`
- `gate_name`
- `gate_state`
- `gate_required`
- `gate_blocker_reason`
- `gate_authority`
- `gate_evidence_refs`

Field review:

- `gate_id`, `gate_name`, and `gate_required` may belong to future `jai-format` gate coverage posture.
- `gate_state` should use a controlled vocabulary separate from route state or readiness approval.
- `gate_blocker_reason` may belong to risk/gap compatibility.
- `gate_authority` must identify decision authority without granting it.
- `gate_evidence_refs` may belong to evidence linkage.

Gate coverage does not open gates.

ZERO GATES GRANTED.

## 10. Risk coverage fields

Candidate risk coverage fields:

- `risk_id`
- `risk_category`
- `risk_level`
- `risk_state`
- `mitigation_refs`
- `blocked_routes`
- `stale_assumptions`

Field review:

- `risk_id`, `risk_category`, `risk_level`, and `risk_state` may belong to future risk coverage profiles.
- `mitigation_refs` may reference validation reports, closeouts, or human review notes.
- `blocked_routes` may remain local until route-profile linkage is accepted.
- `stale_assumptions` may belong to orchestrator compatibility artifacts if review cadence becomes operational.

Risk coverage does not resolve risk or authorize action.

## 11. Readiness state fields

Readiness states under review:

- `missing`
- `proposed`
- `staged`
- `blocked`
- `review-ready`
- `accepted`
- `active` only if future gates authorize it
- `deprecated`
- `stale`

Candidate readiness fields:

- `coverage_state`
- `readiness_state`
- `readiness_reason`
- `readiness_evidence_refs`
- `readiness_blockers`
- `readiness_review_required`
- `readiness_authority_boundary`

Coverage state measures readiness.

Coverage state does not approve readiness.

Readiness display is not approval.

`active` remains unavailable unless future gates authorize it.

## 12. NHID display fields

NHID means Numerical Hierarchy ID.

NHID is a hierarchical coordination identifier for broad objectives, batches, lanes, work waves, work packets, route packets, closeouts, acceptance receipts, and related planning artifacts.

Candidate NHID display fields:

- `nhid`
- `nhid_parent`
- `nhid_path`
- `nhid_level`
- `nhid_sequence`
- `nhid_scope_type`
- `nhid_related_artifact_refs`

Field review:

- `nhid` may belong to `jai-format / nhid/v0`.
- `nhid_parent`, `nhid_path`, `nhid_level`, and `nhid_sequence` may belong to hierarchy display.
- `nhid_scope_type` may classify objective, batch, lane, wave, packet, closeout, receipt reference, or related planning artifact.
- `nhid_related_artifact_refs` may link hierarchy position to artifacts without executing them.

NHID identifies position, nesting, sequence, and relationship inside a work hierarchy.

NHID identifies hierarchy; it does not execute work.

NHID does not execute work, route work, mutate state, approve work, accept work, activate Agents, open gates, or grant authority.

## 13. JAI Grid preset fields

Candidate JAI Grid preset fields:

- `grid_preset_id`
- `grid_preset_name`
- `grid_scope`
- `grid_panel_refs`
- `grid_workflow_template_refs`
- `grid_required_gates`
- `grid_coverage_state`

Field review:

- `grid_preset_id`, `grid_preset_name`, and `grid_scope` may remain local planning fields until Grid profile ownership is accepted.
- `grid_panel_refs` may belong to UI display planning only.
- `grid_workflow_template_refs` should remain planning-only and must not imply workflow execution.
- `grid_required_gates` may belong to gate coverage display only.
- `grid_coverage_state` should use readiness state vocabulary if accepted.

JAI Grid presets are planning concepts only unless separately authorized.

## 14. Fields that should remain local UI affordances

Fields that should remain local UI affordances until separately accepted:

- `coverage_summary`
- `coverage_gaps`
- `coverage_gap_reason`
- `artifact_missing_reason`
- `blocked_routes`
- `grid_panel_refs`
- `grid_workflow_template_refs`
- `review_owner`
- display labels
- local sort/group/filter affordances
- stale coverage review labels

Local UI affordances support scanability and operator review. They are not canonical profile fields.

## 15. Fields that may belong to future jai-format profiles

Fields that may belong to future `jai-format` profiles:

- `project_id`
- `project_name`
- `project_scope`
- `coverage_state`
- `domain_engine_id`
- `domain_scope`
- `domain_coverage_state`
- `agent_role`
- `agent_candidate_ref`
- `agent_coverage_state`
- `assignment_recommendation_ref`
- `gate_id`
- `gate_state`
- `risk_id`
- `risk_state`
- `artifact_type`
- `artifact_ref`
- `nhid`
- `nhid_parent`
- `nhid_path`
- `nhid_level`
- `nhid_sequence`

Future `jai-format` fields require separate acceptance. This artifact does not create profile schema.

## 16. Fields that may belong to orchestrator-nexus compatibility artifacts

Fields that may belong to `orchestrator-nexus` compatibility artifacts:

- `last_reviewed_at`
- `review_owner`
- `artifact_last_reviewed_at`
- `artifact_staleness_note`
- `stale_assumptions`
- `blocked_routes`
- `nhid_related_artifact_refs`
- `assigned_repo_lanes`
- `assigned_agent_roles`
- `mitigation_refs`
- `gate_evidence_refs`

These fields may support review cadence, stale-state review, and work-wave compatibility. They do not authorize scheduler behavior, autonomous loops, route-state mutation, Agent dispatch, or gate opening.

## 17. Fields not ready for implementation

Fields not ready for implementation:

- `active`, because it is only valid if future gates authorize it.
- `activation_request_ref`, because activation request handling is blocked in this planning route.
- `gate_authority`, until authority representation is accepted without granting authority.
- `acceptance_refs`, until receipt/control lineage expectations are settled.
- `grid_workflow_template_refs`, until Grid workflow template posture is defined as non-executing.
- any field that implies live state, live verification, route-state mutation, motion-state mutation, automatic scoring, automatic synthesis, Agent dispatch, provider/model dispatch, or gate opening.

No field in this review is implemented by this artifact.

## 18. Candidate rename notes

Candidate rename notes:

- `project_status` may need separation from `coverage_state`.
- `coverage_state` and `readiness_state` may need convergence or explicit distinction.
- `risk_state` may need separation from `risk_level`.
- `gate_state` may need separation from `gate_required`.
- `acceptance_refs` may need `acceptance_receipt_refs` if receipt lineage is intended.
- `decision_refs` may need separation from acceptance refs.
- `grid_required_gates` may need `grid_required_gate_refs`.
- `nhid_scope_type` may need a controlled vocabulary.

No rename is authorized by this artifact.

## 19. Human approval and CONTROL_THREAD acceptance implications

Human approval and CONTROL_THREAD acceptance implications:

- `review_owner` may identify a reviewer but does not approve.
- `control_thread_acceptance_required` may represent required human decision posture.
- `acceptance_refs` may represent lineage only after accepted receipt/control posture exists.
- `accepted` readiness state requires CONTROL_THREAD acceptance.
- `review-ready` readiness state does not equal approval.
- coverage summaries should preserve dissent, blockers, stale assumptions, and missing evidence.

CONTROL_THREAD decides.

## 20. Authority-boundary implications

Authority-boundary implications:

- Field review only; not implementation authority.
- Coverage state measures readiness; it does not approve readiness.
- Coverage display is not activation.
- JAI::AGENT coverage is not Agent creation, activation, assignment, or dispatch.
- Domain-engine coverage is not domain-engine runtime activation.
- NHID means Numerical Hierarchy ID.
- NHID identifies hierarchy; it does not execute work.
- JAI Grid presets are planning concepts only unless separately authorized.
- `.nexus` directories are coordination substrate, not runtime authority.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

Future profiles should preserve these boundaries as explicit posture fields.

## 21. Non-authorized behaviors

This field review artifact does not authorize:

- parser
- runtime
- UI implementation
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
- JAI Grid runtime behavior
- policy enforcement
- gate opening
- automatic receipt creation
- canon mutation by the app
- route-state mutation
- motion-state mutation

ZERO GATES GRANTED.

## 22. Risks

- Risk: coverage state may be mistaken for approval. Mitigation: preserve that coverage state measures readiness and does not approve readiness.
- Risk: coverage display may be mistaken for activation. Mitigation: preserve that coverage display is not activation.
- Risk: JAI::AGENT coverage may imply Agent assignment or dispatch. Mitigation: preserve that JAI::AGENT coverage is not Agent creation, activation, assignment, or dispatch.
- Risk: domain-engine coverage may imply runtime activation. Mitigation: preserve that domain-engine coverage is not domain-engine runtime activation.
- Risk: NHID may be mistaken for workflow execution control. Mitigation: preserve that NHID identifies hierarchy and does not execute work.
- Risk: JAI Grid preset fields may imply runtime workflow templates. Mitigation: preserve that JAI Grid presets are planning concepts only unless separately authorized.
- Risk: future orchestrator compatibility may imply scheduler behavior. Mitigation: keep orchestration compatibility separate from implementation authority.

## 23. Recommended follow-up routes

Recommended next route:

- `Q3M7 Project Coverage State jai-format Profile Candidate Planning v0`

Alternative follow-up routes:

- `Q3M7 NHID Field Ownership Review v0`
- `Q3M7 JAI Grid Coverage Preset Field Review v0`
- `Q3M7 Project Coverage State Orchestrator Compatibility Review v0`
- `Q3M7 Project Coverage State Local UI Affordance Review v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 24. Verification notes

Verification notes:

- Accepted planning artifact was inspected.
- Required 24 sections are present.
- Candidate field groups are reviewed.
- Readiness states are reviewed.
- NHID uses the corrected definition: Numerical Hierarchy ID.
- The incorrect legacy NHID expansion is not used.
- Fields are separated into local UI affordances, future `jai-format` profile candidates, orchestrator compatibility candidates, and not-ready fields.
- Coverage/readiness display is separated from approval, activation, runtime, execution, dispatch, and gate authority.
- Non-authorized behaviors remain blocked.

This artifact is docs/reference only.

CONTROL_THREAD decides.

ZERO GATES GRANTED.
