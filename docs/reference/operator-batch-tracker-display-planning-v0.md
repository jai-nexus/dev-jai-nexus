# Operator Batch Tracker Display Planning v0

## 1. Purpose

This docs/reference artifact plans how `dev.jai.nexus` should eventually display the accepted portfolio batch tracker model.

Operator tracker display planning is not UI implementation.

This is display planning only. It does not implement UI, API, DB, persistence, runtime behavior, parser behavior, automation, route-state mutation, motion-state mutation, receipt authority, acceptance authority, cleanup authority, clone/delete/archive authority, branch repair authority, Agent activation, Agent dispatch, GitHub/API automation, or gate behavior.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

The operator control plane needs a future display model that can show portfolio work sequence, batch status, repo lane progress, closeout evidence, explicit CONTROL_THREAD decisions, dependencies, stale assumptions, blocked routes, held routes, superseded routes, next recommendations, NHID references, and ZERO GATES posture.

The tracker should help operators see batch progress without turning display state into execution, routing, acceptance, cleanup, branch repair, merge, or gate authority.

`Codex_Control_Thread` is visibility and evidence tracking only.

`ChatGPT_Control_Thread` remains current acceptance authority unless explicitly superseded.

ZERO GATES GRANTED.

## 3. Accepted baseline

Accepted baseline:

- A1 / Portfolio Batch Tracker Baseline v0 accepted by `ChatGPT_Control_Thread` as report-only baseline.
- Batch sequence restarts at Batch A.
- Prior accepted Q3M7 work remains historical accepted context.
- `Codex_Control_Thread` is a visibility and evidence tracker only.
- `CLOSEOUT_RECEIVED` does not equal `ACCEPTED`.
- `ACCEPTED` requires explicit `ChatGPT_Control_Thread` acceptance.
- Batch IDs and NHIDs are compatible but separate namespaces unless later unified.
- Operator portfolio display planning v0 is accepted planning context.
- NHID = Numerical Hierarchy ID.
- ZERO GATES GRANTED.

This baseline is display-planning context only. It does not create tracker persistence, app automation, API/DB-backed state, route-state mutation, motion-state mutation, acceptance authority, or gate authority.

## 4. Evidence inputs

Accepted evidence inputs cited for lineage:

- A1 / Portfolio Batch Tracker Baseline v0
- `orchestrator-nexus / Q3M7 Portfolio Batch Tracker Static Artifact v0`, if available
- `audit-nexus / Q3M7 Portfolio Batch Tracker Authority Boundary Review v0`, if available
- `dev-jai-nexus / Q3M7 Operator Portfolio + Active Subset Display Planning v0`
- `dev-jai-nexus / Q3M7 Control Thread Slot Architecture Planning v0`
- `dev-jai-nexus / Q3M7 Project Coverage State Operator Planning v0`
- `dev-jai-nexus / Q3M7 Project Coverage State Field Model Review v0`

These are evidence inputs only. They do not grant new authority, do not create tracker persistence, and do not authorize routing, merge, execution, closeout acceptance, cleanup, branch repair, Agent activation, GitHub/API automation, or gate opening.

## 5. Operator tracker display concept

A future operator tracker display may show:

- batches
- lanes
- sublanes
- statuses
- closeouts
- CONTROL_THREAD decisions
- dependencies
- stale assumptions
- blocked routes
- held routes
- superseded routes
- next recommendations
- NHID references
- ZERO GATES posture

The display should make batch posture visible without creating workflow state. It should preserve that repo-generated artifacts report evidence; they do not self-accept.

Tracker display does not create tracker persistence.

Tracker display does not create API/DB behavior.

Tracker display does not automate `Codex_Control_Thread`.

Tracker display does not mutate route state or motion state.

Tracker display does not authorize cleanup, clone/delete/archive, branch repair, routing, merge, execution, or gate opening.

## 6. Batch list display concept

A future batch list display may show the current batch sequence and historical batch posture.

Candidate display fields:

- `batch_id`
- `batch_sequence`
- `thread`
- `scope`
- `mode`
- `status`
- `historical_context_refs`
- `zero_gates_state`

Batch sequence restarts at Batch A.

Batch IDs and NHIDs are compatible but separate namespaces unless later unified.

Batch list display should show sequence and relationship only. It does not route work, mutate route state, execute work, or create acceptance.

## 7. Lane and sublane display concept

A future lane and sublane display may show repo-lane or work-lane breakdown inside a batch.

Candidate display fields:

- `lane_id`
- `sublane_id`
- `lane_title`
- `repo`
- `thread`
- `scope`
- `mode`
- `status`
- `dependency_refs`
- `blocked_route_refs`
- `nhid_ref`

Lane and sublane display is organizational visibility only. A repo lane must not self-accept.

Lane visibility does not authorize execution, routing, branch repair, merge, cleanup, Agent dispatch, or gate opening.

## 8. Status display concept

Required display states:

- `DRAFT`
- `ROUTED`
- `EXECUTING`
- `CLOSEOUT_RECEIVED`
- `ACCEPTED`
- `HELD`
- `BLOCKED`
- `SUPERSEDED`

Status display should make current tracker posture visible without creating tracker persistence or route-state mutation.

`CLOSEOUT_RECEIVED` and `ACCEPTED` must be visually and semantically distinct.

`CLOSEOUT_RECEIVED` means a closeout has been returned or observed.

`ACCEPTED` means explicit `ChatGPT_Control_Thread` acceptance has occurred.

## 9. Closeout display concept

A future closeout display may show where closeout packets have been received and whether they are pending review or accepted.

Candidate display fields:

- `closeout_state`
- `closeout_ref`
- `closeout_received_at`
- `closeout_summary`
- `acceptance_state`
- `control_thread_decision_ref`

`CLOSEOUT_RECEIVED` does not equal `ACCEPTED`.

A closeout packet must not become an acceptance receipt unless `ChatGPT_Control_Thread` explicitly accepts it.

Tracker display does not make closeout receipt equivalent to acceptance.

## 10. CONTROL_THREAD decision display concept

A future CONTROL_THREAD decision display may show whether a batch, lane, sublane, closeout, or recommendation has an explicit decision.

Candidate display fields:

- `acceptance_state`
- `control_thread_decision_ref`
- `decision_owner`
- `decision_needed`
- `decision_summary`
- `accepted_at`, only if evidence supports it

`ACCEPTED` requires explicit `ChatGPT_Control_Thread` acceptance.

CONTROL_THREAD decision points are prompts for review; they do not self-accept.

Tracker display does not create acceptance authority.

## 11. Dependencies display concept

A future dependencies display may show what a batch, lane, or sublane depends on before review or next routing.

Candidate display fields:

- `dependency_refs`
- `dependency_state`
- `dependency_reason`
- `blocked_route_refs`
- `held_reason`
- `stale_assumptions`

Dependency display is evidence and planning context only. It does not route work, execute work, repair branches, merge, or open gates.

## 12. Stale assumptions display concept

A future stale assumptions display may show assumptions that need review before a route proceeds.

Candidate display fields:

- `stale_assumptions`
- `stale_assumption_reason`
- `last_evidence_ref`
- `review_required`
- `next_route_recommendation`

Stale assumption display is review posture only. It does not update evidence, fetch remotes, mutate route state, approve work, or self-accept.

## 13. Held / blocked / superseded display concept

A future held / blocked / superseded display may show why work should not proceed on a route.

Candidate display fields:

- `status`
- `held_reason`
- `blocked_route_refs`
- `blocked_reason`
- `superseded_by`
- `superseded_reason`
- `control_thread_decision_ref`

`HELD` should show a route is intentionally paused or awaiting decision.

`BLOCKED` should show that a route cannot proceed due to missing evidence, authority, dependency, or risk.

`SUPERSEDED` should show that another route or artifact replaced the current route.

These states do not authorize cleanup, deletion, branch repair, routing, merge, execution, or gate opening.

## 14. Next route recommendation display concept

A future next route recommendation display may show candidate next steps for review.

Candidate display fields:

- `next_route_recommendation`
- `recommendation_reason`
- `recommended_role`
- `dependency_refs`
- `blocked_route_refs`
- `control_thread_prompt`

Next route recommendation display is advisory. It does not route itself, dispatch Codex, mutate route state, create a branch, open a PR, merge, or execute work.

## 15. NHID reference display concept

A future NHID reference display may show how batch IDs and NHIDs relate without merging their namespaces.

Candidate display fields:

- `nhid_ref`
- `nhid_parent`
- `nhid_path`
- `nhid_level`
- `batch_id`
- `lane_id`
- `sublane_id`

NHID means Numerical Hierarchy ID.

NHID identifies hierarchy; it does not execute work.

Batch IDs and NHIDs are compatible but separate namespaces unless later unified.

NHID display does not route work, mutate state, approve work, accept work, activate Agents, open gates, or grant authority.

## 16. ZERO GATES display concept

A future ZERO GATES display should keep gate posture visible near the batch tracker summary and relevant lane details.

Candidate display fields:

- `zero_gates_state`
- `gate_posture`
- `blocked_authority`
- `non_authorizations`
- `control_thread_review_required`

ZERO GATES GRANTED.

ZERO GATES display does not open gates. It preserves that gates remain closed unless separately accepted through explicit CONTROL_THREAD authority.

## 17. Historical accepted context display concept

A future historical accepted context display may show prior accepted Q3M7 work while keeping Batch A as the new sequence start.

Candidate display fields:

- `historical_context_refs`
- `prior_accepted_context`
- `batch_sequence`
- `superseded_by`
- `control_thread_decision_ref`

Prior accepted Q3M7 work remains historical accepted context.

Historical context display does not re-open old routes, self-accept current closeouts, or create new acceptance.

## 18. Fields that should remain local UI affordances

Fields that should remain local UI affordances until separately accepted:

- `lane_title`
- `closeout_summary`
- `decision_needed`
- `decision_summary`
- `dependency_reason`
- `stale_assumption_reason`
- `blocked_reason`
- `superseded_reason`
- `recommendation_reason`
- `control_thread_prompt`

These fields help operators scan tracker posture. They should not become canonical schema, route-state, tracker persistence, or authority-bearing state through this planning artifact.

## 19. Fields that may require future `jai-format` profile support

Fields that may require future `jai-format` profile support:

- `batch_id`
- `batch_sequence`
- `lane_id`
- `sublane_id`
- `repo`
- `thread`
- `scope`
- `mode`
- `status`
- `closeout_state`
- `acceptance_state`
- `dependency_refs`
- `blocked_route_refs`
- `superseded_by`
- `next_route_recommendation`
- `nhid_ref`
- `historical_context_refs`
- `zero_gates_state`

Future `jai-format` support would require separate profile acceptance. This artifact does not define canonical schema and does not mutate `jai-format` canon.

## 20. Fields that may require future `orchestrator-nexus` evidence packet support

Fields that may require future `orchestrator-nexus` evidence packet support:

- `closeout_ref`
- `closeout_received_at`
- `control_thread_decision_ref`
- `accepted_at`, only if evidence supports it
- `dependency_state`
- `held_reason`
- `stale_assumptions`
- `blocked_route_refs`
- `superseded_by`
- `nhid_parent`
- `nhid_path`
- `nhid_level`

These fields depend on evidence packet posture. They should not imply live orchestration, tracker persistence, API/DB-backed state, route-state mutation, or acceptance authority inside `dev.jai.nexus`.

## 21. Fields not ready for implementation

Fields not ready for implementation:

- `acceptance_authority`
- `receipt_creation_authority`
- `routing_authority`
- `merge_authority`
- `execution_authority`
- `cleanup_authorized`
- `clone_authorized`
- `delete_authorized`
- `archive_authorized`
- `branch_repair_authorized`
- `gate_open_state`
- `codex_automation_enabled`

These fields are authority-bearing or easily confused with authority-bearing behavior. They require separate CONTROL_THREAD acceptance and should remain absent from any near-term display implementation.

## 22. Non-authorized behaviors

This planning artifact does not authorize:

- UI implementation
- runtime activation
- parser implementation
- API behavior
- DB behavior
- Prisma behavior
- persistence
- Codex automation by app
- cleanup authorization
- clone authorization
- delete authorization
- archive authorization
- branch repair authorization
- routing authority
- merge authority
- execution authority
- Agent activation
- Agent dispatch
- Agent execution
- Agent creation
- automatic Agent assignment
- provider/model dispatch
- live model calls
- GitHub/API automation
- browser/desktop control
- terminal execution by the app
- scheduler
- autonomous loop
- telemetry
- customer-data handling
- `.jai` parser/runtime behavior
- `.nexus` active runtime semantics
- `JAI_Control_Thread` authority activation
- `JAI_<repo>` runtime-agent activation
- route-state mutation
- motion-state mutation
- receipt creation as authority
- policy enforcement
- gate opening

ZERO GATES GRANTED.

## 23. Risks

- Risk: `CLOSEOUT_RECEIVED` may be mistaken for `ACCEPTED`. Mitigation: preserve visual and semantic distinction and require explicit `ChatGPT_Control_Thread` acceptance.
- Risk: tracker display may be mistaken for tracker persistence. Mitigation: preserve that tracker display does not create tracker persistence.
- Risk: next route recommendations may be mistaken for routing authority. Mitigation: preserve advisory posture.
- Risk: `Codex_Control_Thread` tracker visibility may be mistaken for automation authority. Mitigation: preserve visibility/evidence-only posture.
- Risk: status labels may be mistaken for route-state mutation. Mitigation: preserve display-only posture.
- Risk: batch IDs and NHIDs may be merged prematurely. Mitigation: preserve compatible but separate namespaces unless later unified.
- Risk: ZERO GATES display may be mistaken for a gate control. Mitigation: preserve ZERO GATES GRANTED and no gate opening.

## 24. Recommended follow-up routes

Recommended next route:

- `Q3M7 Operator Batch Tracker Field Ownership Review v0`

Alternative follow-up routes:

- `Q3M7 Operator Batch Tracker Static Surface Sketch v0`
- `Q3M7 Batch Tracker Closeout Acceptance Boundary Review v0`
- `Q3M7 Batch Tracker NHID Mapping Review v0`
- `Q3M7 Batch Tracker Evidence Packet Alignment Review v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 25. Verification notes

Verification notes:

- All 26 required sections are present.
- Accepted baseline statements are preserved.
- Required display states are listed.
- `CLOSEOUT_RECEIVED` and `ACCEPTED` are visually and semantically distinct in the display model.
- Batch list, lane/sublane, status, closeout, CONTROL_THREAD decision, dependencies, stale assumptions, held/blocked/superseded, next recommendation, NHID reference, ZERO GATES, and historical accepted context concepts are separated.
- Field groups are separated into local UI affordances, future `jai-format` profile support, future `orchestrator-nexus` evidence packet support, and fields not ready for implementation.
- No UI, runtime, parser, API, DB, Prisma, persistence, automation, route-state, motion-state, receipt-authority, acceptance-authority, cleanup, clone/delete/archive, branch repair, Agent, GitHub/API, or gate behavior is added.

## 26. ZERO GATES GRANTED

ZERO GATES GRANTED.
