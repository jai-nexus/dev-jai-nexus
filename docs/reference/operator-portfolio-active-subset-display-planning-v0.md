# Operator Portfolio Active Subset Display Planning v0

## 1. Purpose

This docs/reference artifact plans how `dev.jai.nexus` should eventually display the accepted full portfolio, local active subset, dirty-state overlay, branch-state evidence, branch-drift evidence, missing-local posture, domain-engine relationship, and owner-review posture.

Operator display planning is not UI implementation.

This is display planning only. It does not implement UI, runtime behavior, parser behavior, API behavior, DB behavior, Prisma behavior, persistence, Codex automation by app, cleanup authorization, clone/delete/archive authorization, branch repair authorization, Agent activation, Agent dispatch, provider/model dispatch, GitHub/API automation, browser/desktop control, `.jai` parser/runtime behavior, `.nexus` active runtime semantics, `JAI_Control_Thread` authority activation, `JAI_<repo>` runtime-agent activation, route-state mutation, motion-state mutation, receipt creation as authority, or gate behavior.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

The operator control plane needs a future display model that can show the whole `jai-nexus` GitHub portfolio while distinguishing the smaller local active subset used for near-term Q3M7 work.

The display should make committed-state portfolio evidence, working-state local checkout evidence, branch-drift evidence, dirty-state evidence, missing-local posture, parked/inactive/unknown posture, and owner-review prompts visible without authorizing cleanup or repair.

The display should also connect repos to domain engines, project coverage state, `.nexus` substrate posture, and CONTROL_THREAD decision points. These relationships are planning context only.

`Codex_Control_Thread` extends visibility; it does not extend authority.

`ChatGPT_Control_Thread` remains current acceptance authority unless explicitly superseded.

ZERO GATES GRANTED.

## 3. Accepted baseline

Accepted baseline inputs include:

- `dev-jai-nexus / Q3M7 Project Coverage State Operator Planning v0`
- `dev-jai-nexus / Q3M7 Project Coverage State Field Model Review v0`
- `dev-jai-nexus / Q3M7 Control Thread Slot Architecture Planning v0`
- prior Operator Domain Engine Workspace planning, verifier, librarian, and field-review artifacts
- prior Operator Agent Registry and Operator Work Packet Composer surfaces

Accepted aggregate facts:

- GitHub `jai-nexus` portfolio count: 68 repos.
- Local Git directories: 39.
- Unique local GitHub remotes: 37.
- GitHub-only / missing-local repos: 31.
- Dirty local repos: 20.
- Clean local repos: 19.

Near-term Q3M7 active portfolio subset:

- `dev-jai-nexus`
- `jai-nexus`
- `audit-nexus`
- `orchestrator-nexus`
- `jai-format`
- `jai`
- `jai-vscode`
- `jai-pilot`
- `jai-edge`
- `nexus-core`
- `sot-nexus`
- `datacontracts-nexus`
- `docs-nexus`

These facts are accepted evidence inputs for display planning only. This artifact does not re-run inventory, query GitHub, repair branches, classify inactivity, or mutate local repos.

## 4. Evidence inputs

Accepted evidence inputs cited for lineage:

- `Codex_Control_Thread / Q3M7 GitHub Full Portfolio Inventory + Local Active Subset Reconciliation v1`
- `Codex_Control_Thread / Q3M7 Polyrepo Dirty State + Branch Drift Inventory v0`
- `orchestrator-nexus / Q3M7 Full GitHub Portfolio + Local Active Subset Evidence Packet v0`
- `orchestrator-nexus / Q3M7 Full GitHub Portfolio Repo-Level Table v0`, if available
- `orchestrator-nexus / Q3M7 Local HEAD vs Remote Default Evidence Packet v0`, if available
- `audit-nexus / Q3M7 Full GitHub Portfolio Reconciliation Authority Boundary Review v0`
- `dev-jai-nexus / Q3M7 Project Coverage State Operator Planning v0`
- `dev-jai-nexus / Q3M7 Project Coverage State Field Model Review v0`
- `dev-jai-nexus / Q3M7 Control Thread Slot Architecture Planning v0`

These are evidence inputs only. They do not grant new authority, do not authorize app automation, and do not create route, cleanup, clone, archive, branch repair, Agent, or gate authority.

## 5. Operator display concept

The future operator-facing display should show a portfolio table or grouped surface with separate overlays for:

- full GitHub portfolio membership
- local checkout status
- local active subset membership
- missing-local posture
- dirty-state posture
- branch-state and branch-drift evidence
- local HEAD vs remote default evidence
- owner-review prompts
- active Q3M7 subset membership
- parked / inactive / unknown posture
- domain-engine relationship
- `.nexus` substrate observation
- coverage-state relationship
- CONTROL_THREAD decision points

The display should be explicit that visibility is evidence, not authority.

Portfolio inventory display is committed-state visibility only.

Local checkout display is working-state evidence only.

## 6. Full portfolio display concept

A future full portfolio display may represent all 68 GitHub `jai-nexus` repos and distinguish GitHub membership from local checkout status.

Candidate display fields:

- `repo_name`
- `github_owner`
- `github_repo`
- `github_portfolio_membership`
- `local_checkout_state`
- `local_path_known`
- `local_remote_url`
- `local_remote_unique`
- `missing_local_state`
- `owner_review_state`
- `domain_engine_refs`
- `coverage_state_refs`
- `evidence_packet_refs`

Portfolio inventory display is committed-state visibility only.

It does not authorize clone, deletion, archival, cleanup, branch repair, GitHub/API automation, or repo classification changes.

## 7. Local active subset display concept

A future local active subset display may show the repos currently present locally and identify which ones are part of the near-term Q3M7 active subset.

Candidate display fields:

- `local_git_directory_count`
- `unique_local_remote_count`
- `local_subset_membership`
- `active_q3m7_subset_membership`
- `working_state`
- `branch_state`
- `dirty_state`
- `owner_review_needed`
- `repo_lane_refs`

Accepted aggregate local facts:

- Local Git directories: 39.
- Unique local GitHub remotes: 37.
- Dirty local repos: 20.
- Clean local repos: 19.

Local checkout display is working-state evidence only.

Local active subset display does not authorize cleanup, branch repair, local deletion, branch switching, or repo mutation.

## 8. Missing-local display concept

A future missing-local display may show GitHub-only repos and distinguish missing-local evidence from lifecycle decisions.

Candidate display fields:

- `github_only_state`
- `missing_local_reason`
- `clone_authorized`
- `archive_authorized`
- `delete_authorized`
- `owner_review_required`

Accepted aggregate fact:

- GitHub-only / missing-local repos: 31.

Missing-local display does not authorize clone, deletion, archival, or inactivity classification.

Missing-local posture should remain `owner_review_required` unless CONTROL_THREAD explicitly accepts a clone/archive/delete/inactive decision in a separate route.

## 9. Dirty-state overlay display concept

A future dirty-state overlay may make dirty working trees visible across local repos.

Candidate display fields:

- `dirty_state`
- `dirty_summary`
- `dirty_file_count`, only if evidence supports it
- `dirty_evidence_ref`
- `cleanup_authorized`
- `owner_review_required`

Accepted aggregate facts:

- Dirty local repos: 20.
- Clean local repos: 19.

Dirty-state display does not authorize cleanup.

Dirty-state visibility should prompt owner review and scoped cleanup routes only after CONTROL_THREAD acceptance.

## 10. Branch-drift display concept

A future branch-drift display may show whether a local checkout appears aligned with its remote default branch or requires owner review.

Candidate display fields:

- `current_branch`
- `remote_default_branch`
- `local_head_ref`
- `remote_default_ref`
- `ahead_behind_state`, only if evidence supports it
- `branch_drift_state`
- `branch_repair_authorized`
- `owner_review_required`

Branch-drift display does not authorize branch repair.

Branch-drift visibility should distinguish evidence from action. It should not checkout branches, create branches, delete branches, rebase, merge, fetch, pull, push, or repair refs.

## 11. Local HEAD vs remote default display concept

A future local HEAD vs remote default display may show whether each local checkout has evidence comparing current local HEAD to the remote default reference.

Candidate display fields:

- `repo_name`
- `local_head_ref`
- `remote_default_ref`
- `remote_default_branch`
- `comparison_evidence_ref`
- `comparison_state`
- `owner_review_required`
- `stale_evidence_note`

Local HEAD vs remote default display is evidence display only.

It does not authorize fetch, checkout, reset, merge, rebase, branch repair, push, or cleanup.

## 12. Owner-review posture display concept

A future owner-review posture display may surface where human review is needed before any action.

Candidate display fields:

- `owner_review_state`
- `owner_review_reason`
- `decision_needed`
- `control_thread_prompt`
- `blocked_routes`
- `accepted_decision_refs`

Owner-review posture prompts review; it does not self-accept.

CONTROL_THREAD decision points are prompts for review; they do not self-accept.

## 13. Active Q3M7 subset display concept

The near-term Q3M7 active portfolio subset should be displayed distinctly from the full portfolio:

- `dev-jai-nexus`
- `jai-nexus`
- `audit-nexus`
- `orchestrator-nexus`
- `jai-format`
- `jai`
- `jai-vscode`
- `jai-pilot`
- `jai-edge`
- `nexus-core`
- `sot-nexus`
- `datacontracts-nexus`
- `docs-nexus`

Candidate display fields:

- `repo_name`
- `active_q3m7_subset_membership`
- `active_subset_reason`
- `domain_engine_refs`
- `repo_lane_refs`
- `coverage_state_refs`
- `owner_review_required`

Active subset display is advisory until accepted by CONTROL_THREAD.

Active subset display does not authorize repo mutation, Agent activation, branch repair, cleanup, clone, archive, deletion, or production behavior.

## 14. Parked / inactive / unknown display concept

A future display may need posture labels for repos that are not in the active Q3M7 subset.

Candidate display states:

- `parked`
- `inactive`
- `unknown`
- `missing-local`
- `needs-owner-review`
- `stale-evidence`

Parked / inactive / unknown display does not equal deprecation.

Parked, inactive, unknown, and missing-local states should remain evidence or review posture unless CONTROL_THREAD explicitly accepts lifecycle classification.

## 15. Domain-engine relationship display concept

Repos may eventually be displayed as pluggable portfolio pieces connected to domain engines and product/control engines.

Candidate display fields:

- `domain_engine_refs`
- `domain_engine_relationship_state`
- `dev_jai_nexus_relationship`
- `jai_nexus_relationship`
- `coverage_state_refs`
- `repo_lane_refs`

Domain-engine display is planning context only; not domain-engine activation.

Domain-engine relationship display should help show whether a repo belongs to `dev.jai.nexus`, `jai.nexus`, infra, framework, audit, docs, edge, product, or format planning contexts without activating runtime domain-engine behavior.

## 16. `.nexus` substrate display concept

A future display may show whether repo-local or portfolio-level `.nexus` substrate exists as coordination context.

Candidate display fields:

- `nexus_substrate_state`
- `nexus_directory_observed`
- `nexus_artifact_refs`
- `nexus_motion_refs`
- `nexus_coordination_notes`
- `nexus_runtime_authority`

`.nexus` substrate display is observation only; not runtime authority.

`.nexus` directories are coordination substrate, not runtime authority.

## 17. Coverage-state relationship display concept

The portfolio display should connect to accepted project coverage planning.

Coverage relationships may include:

- project coverage state
- domain coverage state
- JAI::AGENT coverage state
- artifact coverage
- gate coverage
- risk coverage
- NHID display, if relevant

Coverage-state display measures readiness/visibility; it does not approve readiness.

Coverage display is not activation.

## 18. CONTROL_THREAD decision-point display concept

Future displays should separate review prompts from accepted decisions.

Candidate display fields:

- `control_thread_prompt`
- `decision_needed`
- `decision_scope`
- `review_owner`
- `accepted_decision_refs`
- `blocked_routes`
- `non_authorizations`

CONTROL_THREAD decision points are prompts for review; they do not self-accept.

`ChatGPT_Control_Thread` remains current acceptance authority unless explicitly superseded.

`Codex_Control_Thread` extends visibility; it does not extend authority.

## 19. Fields that should remain local UI affordances

Fields that should remain local UI affordances until separately accepted:

- `dirty_summary`
- `owner_review_needed`
- `owner_review_reason`
- `control_thread_prompt`
- `active_subset_reason`
- `stale_evidence_note`
- `domain_engine_relationship_state`
- `nexus_coordination_notes`
- `decision_needed`
- `blocked_routes`

These fields help operators scan evidence and review posture. They should not become parser-ready schema or authority-bearing state through this planning artifact.

## 20. Fields that may require future `jai-format` profile support

Fields that may require future `jai-format` profile support:

- `repo_name`
- `github_owner`
- `github_repo`
- `github_portfolio_membership`
- `local_checkout_state`
- `missing_local_state`
- `active_q3m7_subset_membership`
- `dirty_state`
- `branch_state`
- `branch_drift_state`
- `domain_engine_refs`
- `coverage_state_refs`
- `repo_lane_refs`
- `evidence_packet_refs`
- `accepted_decision_refs`

Future `jai-format` support would require separate profile acceptance. This artifact does not define canonical schema and does not mutate `jai-format` canon.

## 21. Fields that may require `orchestrator-nexus` evidence packet support

Fields that may require `orchestrator-nexus` evidence packet support:

- `local_git_directory_count`
- `unique_local_remote_count`
- `local_remote_url`
- `local_remote_unique`
- `local_path_known`
- `dirty_file_count`, only if evidence supports it
- `dirty_evidence_ref`
- `current_branch`
- `remote_default_branch`
- `local_head_ref`
- `remote_default_ref`
- `ahead_behind_state`, only if evidence supports it
- `comparison_evidence_ref`
- `comparison_state`

These fields depend on evidence capture posture. They should not imply live GitHub/API automation, branch repair, fetch, checkout, cleanup, or persistence inside `dev.jai.nexus`.

## 22. Fields not ready for implementation

Fields not ready for implementation:

- `cleanup_authorized`
- `clone_authorized`
- `archive_authorized`
- `delete_authorized`
- `branch_repair_authorized`
- `nexus_runtime_authority`
- `jai_control_thread_authority_state`
- `jai_repo_agent_activation_state`
- `gate_open_state`
- `receipt_creation_authority`

These fields are authority-bearing or easily confused with authority-bearing behavior. They require separate CONTROL_THREAD acceptance and should remain absent from any near-term display implementation.

## 23. Non-authorized behaviors

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

## 24. Risks

- Risk: full portfolio visibility may be mistaken for permission to clone or archive missing repos. Mitigation: missing-local display does not authorize clone, deletion, archival, or inactivity classification.
- Risk: dirty-state overlays may be mistaken for cleanup authorization. Mitigation: dirty-state display does not authorize cleanup.
- Risk: branch-drift labels may be mistaken for branch repair authority. Mitigation: branch-drift display does not authorize branch repair.
- Risk: active subset labels may be mistaken for accepted lifecycle state. Mitigation: active subset display is advisory until accepted by CONTROL_THREAD.
- Risk: parked / inactive / unknown labels may be mistaken for deprecation. Mitigation: parked / inactive / unknown display does not equal deprecation.
- Risk: domain-engine relationship display may be mistaken for runtime activation. Mitigation: domain-engine display is planning context only; not domain-engine activation.
- Risk: coverage-state display may be mistaken for approval. Mitigation: coverage-state display measures readiness/visibility; it does not approve readiness.
- Risk: `Codex_Control_Thread` visibility may be mistaken for authority. Mitigation: `Codex_Control_Thread` extends visibility; it does not extend authority.

## 25. Recommended follow-up routes

Recommended next route:

- `Q3M7 Operator Portfolio Display Field Ownership Review v0`

Alternative follow-up routes:

- `Q3M7 Operator Active Subset Evidence Table Sketch v0`
- `Q3M7 Portfolio Dirty-State Overlay Authority Review v0`
- `Q3M7 Branch Drift Evidence Display Boundary Review v0`
- `Q3M7 Missing-Local Repo Review Queue Planning v0`
- `Q3M7 Domain Engine Portfolio Relationship Field Review v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 26. Verification notes

Verification notes:

- All 27 required sections are present.
- Accepted aggregate facts are preserved.
- The near-term Q3M7 active portfolio subset is listed.
- Accepted evidence inputs are cited by name as evidence inputs only.
- Full portfolio, local active subset, missing-local, dirty-state, branch-drift, local HEAD vs remote default, owner-review, active subset, parked/inactive/unknown, domain-engine, `.nexus`, coverage-state, and CONTROL_THREAD decision-point display concepts are separated.
- Field groups are separated into local UI affordances, future `jai-format` support, `orchestrator-nexus` evidence support, and fields not ready for implementation.
- No UI, runtime, parser, API, DB, Prisma, persistence, automation, dispatch, activation, route-state, motion-state, receipt-authority, policy, or gate behavior is added.

## 27. ZERO GATES GRANTED

ZERO GATES GRANTED.
