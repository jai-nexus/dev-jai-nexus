# Project Coverage State Operator Planning v0

## 1. Purpose

This docs/reference artifact plans how `dev.jai.nexus` should eventually represent project coverage state, domain-engine coverage, JAI::AGENT coverage, artifact coverage, gate coverage, risk coverage, NHID work hierarchy, batch/wave hierarchy, and JAI Grid workflow presets.

This is planning only. It does not implement UI, runtime behavior, API behavior, DB behavior, persistence, Agent activation, Agent dispatch, provider/model dispatch, `.jai` parser/runtime behavior, `.nexus` active runtime semantics, JAI Grid runtime behavior, route-state mutation, motion-state mutation, receipt/canon mutation, policy enforcement, or gate behavior.

Coverage state measures readiness; it does not approve readiness.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic intent

The current CONTROL_THREAD repo/project workflow should eventually become native to JAI NEXUS through model slots, domain engines, JAI::AGENT specialization, gated execution, human approval checkpoints, and CONTROL_THREAD acceptance.

The polyrepo should be treated as pluggable pieces that connect into domain engines. Those domain engines should connect into:

- `dev.jai.nexus` as the internal operator/control engine
- `jai.nexus` as the primary product/customer engine

This planning artifact keeps that strategic intent representational. It does not make the polyrepo runtime-active, does not bind model slots, does not activate Agents, and does not open gates.

## 3. Accepted baseline

Accepted baseline includes:

- `/operator/agents` read-only Agent Registry surface
- Agent Vote Review surface
- Palette Agent Recommendation surface
- Agent Registry Local Surface Navigation
- `/operator/agents` dashboard-state-index/v0 Sketch
- `/operator/agents` route/v0 Sketch
- `/operator/work` Operator Work Packet Composer
- Operator Work Packet Composer QA + Density
- Q3M7 Operator Domain Engine Workspace v0
- Q3M7 Operator Domain Engine Workspace QA + Density v0
- Q3M7 Operator Domain Engine Workspace Profile Sketch v0
- Q3M7 Operator Domain Engine Workspace Profile Object Draft v0
- Q3M7 Operator Domain Engine Workspace Verifier Review v0
- Q3M7 Operator Domain Engine Workspace Librarian Reference v0
- Q3M7 Operator Domain Engine Workspace jai-format Alignment Planning v0
- Q3M7 Operator Domain Engine Workspace route-packet/work-wave Field Review v0

All accepted baseline items remain static, read-only, compose-only, or planning-only unless separately authorized.

## 4. Files/surfaces inspected

Inspected surfaces and references:

- `portal/src/app/operator/work/_components/OperatorDomainEngineWorkspace.tsx`
- `docs/reference/operator-domain-engine-workspace-librarian-reference-v0.md`
- `docs/reference/operator-domain-engine-workspace-jai-format-alignment-planning-v0.md`
- `docs/reference/operator-domain-engine-workspace-route-packet-work-wave-field-review-v0.md`
- `docs/reference/STATIC_JAI_CONTEXT_VISIBILITY_REVIEW_V0.md`
- `/operator/work`
- `/operator/agents`
- `/operator/grid`
- `/operator/registry/coverage`

No UI, route, API, DB, Prisma, runtime, or state files are changed by this planning artifact.

## 5. Project coverage state concept

Project coverage state is a planning/readiness representation of how completely a project is covered by domain engines, JAI::AGENT roles, Agent candidates, artifacts, gates, risks, and human approval checkpoints.

Coverage states to consider:

- `missing`: required coverage is absent.
- `proposed`: coverage is proposed but not reviewed.
- `staged`: coverage is represented and awaiting review.
- `blocked`: coverage cannot proceed due to missing evidence, risk, gate, or authority.
- `review-ready`: coverage appears ready for human review.
- `accepted`: CONTROL_THREAD has accepted the coverage posture or artifact.
- `active` only if future gates authorize it: active status must remain unavailable unless future accepted gates authorize it.
- `deprecated`: coverage remains for lineage but should not be used for new planning.
- `stale`: coverage may be outdated and needs review.

Coverage state measures readiness.

Coverage state does not approve readiness.

## 6. Domain-engine coverage concept

Domain-engine coverage should represent whether operating domains have appropriate engine definitions, namespaces, repo mappings, Agent role coverage, artifact expectations, gate posture, and risk treatment.

Domain-engine coverage areas may include:

- `dev.jai.nexus`
- `jai.nexus`
- `framework.nexus`
- `infra.nexus`
- repo/domain lanes
- future work/wave lanes
- product/customer engines
- audit/security engines
- format/profile engines

Domain-engine coverage is not domain-engine runtime activation.

Domain engines define governed namespaces and planning semantics only unless separately authorized.

## 7. JAI::AGENT coverage concept

JAI::AGENT coverage should represent staged coverage across role templates, domain-specialized roles, Agent candidates, review roles, and future gated roles.

JAI::AGENT coverage may include:

- role template coverage
- domain Agent role coverage
- project-scoped candidate coverage
- Builder, Verifier, Challenger, Librarian, Auditor, Safety Guard, Context Curator, Receipt Drafter, Router, Steward, and Executor Candidate representation
- missing or duplicated role coverage
- human review expectations
- blocked activation posture

JAI::AGENT coverage is not Agent creation, activation, or dispatch.

Coverage display is not activation.

## 8. Artifact coverage concept

Artifact coverage should show whether expected coordination artifacts exist, are staged, need review, are stale, or are blocked.

Artifact coverage areas should include:

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
- JAI Grid presets
- repos/toolchain components
- docs/reference artifacts
- profile drafts

Artifact coverage is evidence posture. It does not approve, execute, dispatch, or accept work.

## 9. Gate coverage concept

Gate coverage should represent which gates are required, missing, proposed, staged, blocked, accepted, deprecated, or stale.

Gate coverage may include:

- execution gate coverage
- Agent activation gate coverage
- provider/model dispatch gate coverage
- GitHub/tool integration gate coverage
- customer-data gate coverage
- production behavior gate coverage
- receipt/canon gate coverage
- policy enforcement gate coverage
- JAI Grid runtime gate coverage

Gate coverage does not open gates.

Gate coverage does not grant authority.

ZERO GATES GRANTED.

## 10. Risk coverage concept

Risk coverage should show whether known risks have owners, review posture, mitigation posture, evidence, blockers, validation expectations, and closeout expectations.

Risk coverage areas may include:

- activation risk
- dispatch risk
- stale static data risk
- missing validation risk
- missing closeout risk
- missing receipt risk
- customer-data boundary risk
- GitHub/tool automation risk
- model/provider dispatch risk
- `.nexus` runtime-semantics confusion risk
- JAI Grid runtime confusion risk

Risk coverage is readiness evidence. It does not approve readiness or accept risk.

## 11. NHID / batch / wave display concept

NHID means Numerical Hierarchy ID.

NHID is a hierarchical coordination identifier for broad objectives, batches, lanes, work waves, work packets, route packets, closeouts, acceptance receipts, and related planning artifacts.

NHID identifies position, nesting, sequence, and relationship inside a work hierarchy.

NHID identifies work; it does not execute work.

NHID does not execute work, route work, mutate state, approve work, accept work, activate Agents, open gates, or grant authority.

Potential NHID display levels:

- broad objective
- batch
- lane
- domain engine
- repo lane
- work wave
- work packet
- route packet
- validation report
- closeout
- acceptance receipt reference

Batch and wave display should show relationship and sequence only. It should not imply scheduler behavior, autonomous loops, route-state mutation, execution, or approval.

## 12. JAI Grid preset relationship

JAI Grid presets may eventually represent reusable planning views for coverage state.

Potential JAI Grid workflow presets:

- Project Coverage Overview
- Domain Engine Coverage
- JAI::AGENT Coverage
- Artifact Coverage
- Gate Coverage
- Risk Coverage
- NHID Batch/Wave Coverage
- Human Approval Checkpoints
- Stale Coverage Review

JAI Grid presets are planning concepts only unless separately authorized.

JAI Grid preset display is not JAI Grid runtime behavior, policy enforcement, Agent activation, Agent dispatch, or gate opening.

## 13. Relationship to `.nexus` directories

`.nexus` directories are coordination substrate, not runtime authority.

Potential `.nexus` relationships:

- domain-engine planning references
- batch and lane planning references
- work-wave planning references
- work packet and route packet references
- validation and closeout references
- acceptance receipt references
- risk and gate coverage references
- JAI Grid preset references

`.nexus` directories do not create runtime semantics, dispatch Agents, mutate route state, mutate motion state, create receipts, update canon, or open gates.

## 14. Relationship to Operator Domain Engine Workspace

The Operator Domain Engine Workspace currently represents `.nexus` domain-engine planning, staged Agent assignment recommendations, work/wave planning, copy-ready handoff output, and human approval checkpoints.

Project coverage state planning should build on that workspace by adding representational coverage views for:

- domain-engine lane coverage
- staged Agent coverage
- artifact coverage
- gate coverage
- risk coverage
- NHID batch/wave hierarchy
- JAI Grid preset planning

This relationship is planning-only. The Operator Domain Engine Workspace remains local/static and non-executing.

## 15. Potential future UI panels

Potential future UI panels:

- Project Coverage Summary
- Domain Engine Coverage Matrix
- JAI::AGENT Role Coverage
- Agent Candidate Coverage
- Artifact Coverage Ledger
- Gate Coverage Ledger
- Risk Coverage Ledger
- NHID Batch/Wave Tree
- Human Approval Checkpoints
- JAI Grid Preset Planner
- Stale Coverage Review Queue

These are planning concepts only. This artifact does not implement UI.

## 16. Coverage state fields

Candidate coverage state fields:

- `coverage_id`
- `coverage_scope`
- `coverage_area`
- `coverage_state`
- `coverage_subject`
- `domain_engine_ref`
- `agent_role_ref`
- `agent_candidate_ref`
- `artifact_ref`
- `gate_ref`
- `risk_ref`
- `nhid`
- `batch_ref`
- `wave_ref`
- `repo_lane_ref`
- `grid_preset_ref`
- `source_artifacts`
- `evidence_refs`
- `missing_evidence`
- `human_review_required`
- `control_thread_acceptance_required`
- `authority_boundary`
- `staleness_note`

Candidate fields are planning-only and not parser-ready schema.

## 17. Coverage gaps and readiness states

Coverage gaps should distinguish absence, incompleteness, blockers, stale posture, and review readiness.

Readiness state interpretation:

- `missing`: no coverage exists yet.
- `proposed`: coverage is suggested but lacks review.
- `staged`: coverage is represented but not accepted.
- `blocked`: coverage is stopped by risk, missing evidence, or closed gates.
- `review-ready`: coverage can be reviewed by a human.
- `accepted`: CONTROL_THREAD has accepted the coverage posture.
- `active` only if future gates authorize it: active status remains future-gated and unavailable in this artifact.
- `deprecated`: coverage remains for lineage only.
- `stale`: coverage requires refresh or re-review.

Coverage state measures readiness; it does not approve readiness.

## 18. Human approval and CONTROL_THREAD acceptance points

Human approval and CONTROL_THREAD acceptance points should remain explicit for:

- accepting project coverage posture
- accepting domain-engine coverage posture
- accepting JAI::AGENT coverage posture
- accepting artifact coverage posture
- accepting gate coverage posture
- accepting risk coverage posture
- accepting NHID/batch/wave hierarchy posture
- accepting JAI Grid preset posture
- accepting stale coverage refresh

Human approval checkpoints do not execute work.

CONTROL_THREAD decides.

## 19. Non-authorized behaviors

This planning artifact does not authorize:

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

## 20. Risks

- Risk: coverage state may be mistaken for approval. Mitigation: preserve that coverage state measures readiness and does not approve readiness.
- Risk: coverage display may imply activation. Mitigation: preserve that coverage display is not activation.
- Risk: JAI::AGENT coverage may imply Agent creation or dispatch. Mitigation: preserve that JAI::AGENT coverage is not Agent creation, activation, or dispatch.
- Risk: domain-engine coverage may imply runtime activation. Mitigation: preserve that domain-engine coverage is not domain-engine runtime activation.
- Risk: NHID may be mistaken for execution control. Mitigation: preserve that NHID identifies work and does not execute work.
- Risk: JAI Grid presets may imply runtime behavior. Mitigation: preserve that presets are planning concepts unless separately authorized.
- Risk: `.nexus` directories may be mistaken for runtime authority. Mitigation: preserve that `.nexus` directories are coordination substrate, not runtime authority.

## 21. Recommended follow-up routes

Recommended next route:

- `Q3M7 Project Coverage State Field Model Review v0`

Alternative follow-up routes:

- `Q3M7 NHID Batch/Wave Display Planning v0`
- `Q3M7 JAI Grid Coverage Preset Planning v0`
- `Q3M7 Domain Engine Coverage Matrix Planning v0`
- `Q3M7 JAI::AGENT Coverage Readiness Planning v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 22. Verification notes

Verification notes:

- Correct NHID definition is used: NHID means Numerical Hierarchy ID.
- The artifact does not use the incorrect legacy NHID expansion.
- Required coverage states are defined.
- Required coverage areas are represented.
- Coverage/readiness display is separated from approval, activation, runtime, execution, dispatch, and gate authority.
- `.nexus` directories are identified as coordination substrate, not runtime authority.
- JAI Grid presets are identified as planning concepts only.
- Non-authorized behaviors remain blocked.

This artifact is docs/reference only.

CONTROL_THREAD decides.

ZERO GATES GRANTED.
