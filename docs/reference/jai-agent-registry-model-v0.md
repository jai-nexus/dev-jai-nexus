# JAI_AGENT_REGISTRY_MODEL_V0

## 1. Status

Artifact location: `docs/reference`.

Artifact type: Agent registry model.

Domain-engine model included: yes.

Voting model included: yes.

Runtime posture: non-executing.

Activation posture: no activation.

Gate posture: zero gates granted.

JAI Agents are staged, not executing.

Agent registry entries do not execute.

Agent lanes do not execute.

ZERO GATES GRANTED.

This artifact defines a durable JAI Agent Registry before any Agent activation.
It is doctrine/reference only and does not implement runtime behavior, execution
behavior, UI behavior, route behavior, backend behavior, API behavior,
DB/Prisma behavior, provider/model behavior, GitHub/tool behavior, receipt
creation, canon update, or gate opening.

## 2. Agent Definition

A JAI Agent is a governed, versioned, registry-backed operating profile that can
be assigned to staged lanes to produce bounded work artifacts under authority,
evidence, validation, receipt, and gate constraints.

A registry-backed Agent profile includes:

- Stable identity: durable `agent_id`, `object_id`, `nhID`, namespace, and
  version.
- Role: intended operating role and Agent type.
- Capability envelope: capability classes, allowed mode, blocked mode, allowed
  actions, blocked actions, and authority ceiling.
- Context requirements: required sources, source posture, freshness posture,
  privacy posture, and `.jai` dependencies.
- Allowed outputs: bounded artifacts such as summaries, review notes,
  proposals, classifications, draft handoff text, risk notes, validation plans,
  and rollback plans.
- Blocked actions: execution, dispatch, tool invocation, file/repo mutation,
  branch/PR creation, receipt creation, canon update, and gate evaluation.
- Review requirements: peer review, human review, dissent preservation,
  contradiction review, and CONTROL_THREAD review.
- Gate requirements: security gate, execution gate, tool gate, repo gate,
  model/provider gate, and domain gate prerequisites.
- Receipt requirements: future lineage and acceptance records required before
  lifecycle progression.
- Provenance: source artifact, authoring context, review context, lineage, and
  related receipts when they exist.
- Lifecycle status: proposed, reviewed, staged, accepted read-only,
  accepted compose-only, suspended, revoked, deprecated, superseded, or retired.

A JAI Agent is a registry-backed operating profile. A JAI Agent is not
automatically a runtime actor. A JAI Agent does not execute in v0. A JAI Agent
does not gain authority by being registered. Registry presence is not
activation. Lane assignment is not execution.

## 3. Non-Agent Distinctions

These objects are not JAI Agents:

- Model provider: a model provider may supply model capability, but it is not a
  governed JAI Agent.
- Model slot: a model slot may represent a model position, but it is not an
  Agent identity.
- Council participant: a Council participant may contribute advisory review,
  but it is not automatically a registry-backed Agent.
- Route: a route displays or organizes workflow, but it is not an Agent.
- Workflow: a workflow may coordinate work, but it is not an Agent.
- Tool: a tool may be required by future capabilities, but it is not an Agent.
- Permission: a permission is a governance object, not an Agent.
- Execution gate: an execution gate is a governance object, not an Agent.
- Receipt: a receipt records lineage or acceptance evidence, but it is not an
  Agent.
- Human operator: a human operator is not a JAI Agent.
- Raw prompt template: a raw prompt template is not a registry-backed Agent.

Permission, gate, and receipt objects can constrain Agents, but they do not
become Agents. Routes and workflows can show Agent posture, but display does not
create Agent authority.

## 4. Registry Object Model

Required registry entry fields:

- `agent_id`
- `namespace`
- `object_id`
- `nhID`
- `display_name`
- `version`
- `status`
- `description`
- `intended_role`
- `allowed_mode`
- `blocked_mode`
- `capability_classes`
- `tool_classes`
- `model_provider_requirements`
- `source_context_requirements`
- `scope`
- `authority_scope`
- `gate_requirements`
- `receipt_requirements`
- `validation_requirements`
- `rollback_requirements`
- `risk`
- `allowed_outputs`
- `forbidden_outputs`
- `allowed_actions`
- `blocked_actions`
- `.jai dependencies`
- `evidence_requirements`
- `review`
- `lineage`
- `provenance`

Required v0 defaults:

```yaml
authority_state: representational_only
current_gate_state: closed
enabled_tools: []
execution_authorized: false
```

Allowed v0 actions are limited to:

- `represent`
- `stage`
- `draft`
- `review`
- `summarize`
- `propose`
- `classify`
- `request human review`

Blocked v0 actions include:

- `execute`
- `dispatch`
- `invoke_tool`
- `write_file`
- `mutate_repo`
- `create_branch`
- `open_pr`
- `merge`
- `deploy`
- `create_receipt`
- `update_canon`

Illustrative non-executable registry entry:

```yaml
agent_id: JAI-AGENT-DEV-BUILDER-0001
namespace: JAI::DEV::BUILDER
object_id: jai.agent.registry.dev.builder
nhID: jai.agent.dev.builder
display_name: DEV Builder
version: 0.0.0-reference
status: staged
description: Drafts bounded development proposals for human review.
intended_role: development draft producer
allowed_mode:
  - represent
  - stage
  - draft
  - summarize
  - propose
blocked_mode:
  - execute
  - dispatch
  - invoke_tool
capability_classes:
  - implementation_planning
  - diff_summary
tool_classes: []
model_provider_requirements: []
source_context_requirements:
  - labeled_read_only_context
scope: dev.jai.nexus development work
authority_scope: representational_only
authority_state: representational_only
current_gate_state: closed
enabled_tools: []
execution_authorized: false
gate_requirements:
  - security_gate_future
  - execution_gate_future
receipt_requirements:
  - agent_registry_acceptance_receipt_future
validation_requirements:
  - verifier_review
rollback_requirements:
  - rollback_note_required
risk: medium
allowed_outputs:
  - implementation_plan_draft
  - validation_checklist_draft
forbidden_outputs:
  - executable_patch_application
  - receipt_creation
allowed_actions:
  - draft
  - summarize
  - request human review
blocked_actions:
  - execute
  - mutate_repo
  - open_pr
.jai dependencies:
  - agent-registry-entry/v0
evidence_requirements:
  - source_labels
  - dissent_visibility
review:
  required_peer_reviews:
    - VERIFIER
    - CHALLENGER
lineage:
  receipt_ref: null
provenance:
  artifact: JAI_AGENT_REGISTRY_MODEL_V0
```

This example is illustrative and non-executable.

## 5. Domain Engine Model

A JAI domain engine is a governed registry scope that defines how a JAI NEXUS
domain organizes staged Agents, advisory votes, work artifacts, collaboration
roles, blocked capabilities, and future gate requirements.

Recommended first domain engines:

- `DEV`
- `DOCS`
- `FORMAT`
- `EDGE`
- `AUDIT`
- `SECURITY`
- `OPS`
- `CUSTOMER`
- `COUNCIL`
- `BILLING`

Domain engine fields:

- `domain_engine_id`
- `namespace`
- `display_name`
- `version`
- `status`
- `description`
- `scope`
- `authority`
- `agent_classes`
- `workflow`
- `voting`
- `gates`
- `context`
- `grid`
- `lineage`
- `provenance`

Domain engines define governed namespaces and collaboration semantics. Domain
engines do not execute. Domain engines do not grant authority. Domain engines do
not open gates. Domain engines do not create receipts. Domain engines do not
update canon. Domain engines do not dispatch Agents.

## 6. Namespace Model

Namespace syntax:

`JAI::<DOMAIN>::<ROLE>`

Examples:

- `JAI::DEV::BUILDER`
- `JAI::DEV::LIBRARIAN`
- `JAI::DEV::VERIFIER`
- `JAI::DEV::CHALLENGER`
- `JAI::DOCS::SYNTHESIZER`
- `JAI::DOCS::ARCHIVIST`
- `JAI::FORMAT::PROFILE_DESIGNER`
- `JAI::FORMAT::COMPATIBILITY_GUARD`
- `JAI::AUDIT::RISK_REVIEWER`
- `JAI::SECURITY::GATE_REVIEWER`

Required distinction:

- `namespace` = stable human-facing canonical name.
- `object_id` = durable object identity.
- `nhID` = coordinate/location in JAI structure.
- `version` = revision.
- `status` = lifecycle state.
- `receipt_ref` = decision lineage.

Do not encode version or status directly in namespace.

## 7. Agent Type Taxonomy

Type assignment does not grant execution authority. Type assignment does not
grant tool authority. Type assignment does not decide routes. Type assignment
does not create receipts. Type assignment does not update canon.

| Agent type | Purpose | Allowed outputs | Blocked actions | Voting role | Likely domain engines | Safe v0 posture | Required gates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `EXECUTOR_CANDIDATE` | Represents a possible future execution lane participant | Execution plan draft, risk note, rollback note | execute, dispatch, invoke tools | May comment; may not approve execution | DEV, OPS, EDGE | Staged only | Future execution gate, security gate |
| `VOTER` | Issues advisory vote evidence | Vote record, rationale, evidence links | decide, approve, progress routes | May vote | All | Advisory only | None for display; future receipt for accepted vote records |
| `REVIEWER` | Reviews artifacts and evidence | Review note, revision request | mutate, accept, create receipts | May vote or comment | All | Read-only review | Review receipt future |
| `BUILDER` | Drafts work artifacts | Plan, patch summary, PR body draft | write files, open PRs | May vote on readiness with evidence | DEV, EDGE, OPS | Compose-only | Repo/tool gates future |
| `VERIFIER` | Checks claims and validation evidence | Verification note, validation checklist | execute validation automatically | May vote on evidence sufficiency | DEV, AUDIT, SECURITY | Read-only review | Validation evidence gate future |
| `LIBRARIAN` | Checks lineage and source posture | Lineage note, source map | update canon | May raise lineage blockers | DEV, DOCS, FORMAT | Read-only review | Canon/receipt gates future |
| `SYNTHESIZER` | Prepares handoff from evidence | Summary, passalong, reconciliation draft | decide, hide dissent | May comment; may vote where domain allows | DOCS, COUNCIL, AUDIT | Compose-only | Receipt gate future |
| `CHALLENGER` | Attacks assumptions and surfaces dissent | Dissent, contradiction, risk flag | block automatically | May raise blocker recommendations | DEV, COUNCIL, SECURITY | Advisory dissent | Human review gate future |
| `ROUTER` | Proposes route/workflow placement | Route recommendation, scope note | mutate route state | May comment | DEV, OPS, COUNCIL | Advisory only | Route decision future |
| `STEWARD` | Maintains domain health and review cadence | Registry hygiene note, review schedule | activate Agents | May vote on registry hygiene | OPS, CUSTOMER, BILLING | Read-only governance | Registry receipt future |
| `AUDITOR` | Reviews evidence, authority, and risk | Audit finding, risk note | enforce policy automatically | May raise blockers | AUDIT, SECURITY | Read-only review | Audit receipt future |
| `SAFETY_GUARD` | Checks blocked capabilities and abuse cases | Safety review, blocked-class note | open gates | May raise blockers | SECURITY, DEV, CUSTOMER | Read-only review | Security gate future |
| `CONTEXT_CURATOR` | Labels and scopes context | Context packet, source posture note | retrieve automatically, inject context | May comment | DOCS, FORMAT, DEV | Compose-only | Context/privacy gate future |
| `RECEIPT_DRAFTER` | Drafts receipt request text | Receipt draft, lineage expectation | create receipts | May comment | DOCS, AUDIT, COUNCIL | Compose-only | Receipt authority future |
| `ROLLBACK_PLANNER` | Plans rollback and revocation | Rollback note, revocation plan | execute rollback | May vote on rollback adequacy | DEV, EDGE, OPS, SECURITY | Compose-only | Execution/rollback gate future |

## 8. Executor-Candidate Model

EXECUTOR_CANDIDATE is the only safe v0 executor-related term.

An executor candidate is a registry-backed profile that may later be evaluated
for a tightly gated execution role, but only after doctrine, gates, receipts,
validation, rollback, security, and audit are accepted.

An executing Agent is a live runtime actor with dispatch and tool authority. An
executing Agent does not exist in v0 because no execution gates, tool gates,
model gates, repo gates, receipt authorities, or runtime authorities are open.

Allowed executor-candidate outputs:

- Execution readiness note.
- Scope proposal.
- Required gate list.
- Risk assessment.
- Rollback requirement.
- Human handoff draft.

Blocked executor-candidate actions:

- execute
- dispatch
- invoke_tool
- mutate_repo
- write_file
- create_branch
- open_pr
- create_receipt
- update_canon
- schedule work
- run autonomously

Evidence required before future execution-gated consideration:

- Accepted registry entry.
- Accepted domain engine.
- Security gate design.
- Execution gate design.
- Tool gate design.
- Receipt design.
- Validation evidence requirements.
- Rollback plan.
- Audit review.
- CONTROL_THREAD acceptance.

Required safe labels:

- `EXECUTOR_CANDIDATE`
- `NOT EXECUTING`
- `COMPOSE-ONLY`
- `GATED FUTURE CAPABILITY`
- `ZERO GATES GRANTED`

Forbidden labels:

- `EXECUTOR`
- `ACTIVE EXECUTOR`
- `RUNNER`
- `AUTONOMOUS AGENT`
- `LIVE AGENT`

Executor-candidate posture is representational. Executor-candidate posture does
not activate execution. Executor-candidate posture does not imply an Agent
runner. Executor-candidate posture does not imply tool use. Executor-candidate
posture does not imply autonomy.

## 9. Voting Model

Agent voting is advisory governance input.

Agent votes are evidence, not authority.

Agent votes do not decide.

CONTROL_THREAD decides.

No vote class triggers automatic progression. Even unanimous approval remains
advisory.

Agent types that may vote when assigned a domain `vote_role`:

- `VOTER`
- `REVIEWER`
- `BUILDER`
- `VERIFIER`
- `LIBRARIAN`
- `CHALLENGER`
- `AUDITOR`
- `SAFETY_GUARD`
- `ROLLBACK_PLANNER`

Agent types that may only comment by default:

- `EXECUTOR_CANDIDATE`
- `SYNTHESIZER`
- `ROUTER`
- `STEWARD`
- `CONTEXT_CURATOR`
- `RECEIPT_DRAFTER`

Agent types that may raise blockers:

- `CHALLENGER`
- `VERIFIER`
- `AUDITOR`
- `SAFETY_GUARD`
- `LIBRARIAN`
- `ROLLBACK_PLANNER`

Agent types that may create dissent:

- `CHALLENGER`
- `SAFETY_GUARD`
- `AUDITOR`
- Any assigned reviewer with contradictory evidence.

Agent types that may propose safe alternatives:

- `BUILDER`
- `SYNTHESIZER`
- `ROLLBACK_PLANNER`
- `SAFETY_GUARD`
- `CONTEXT_CURATOR`

Abstention records insufficient scope, insufficient evidence, or conflict of
role. `VETO_RECOMMENDATION` may be issued as advisory only. Use
`VETO_RECOMMENDATION`, not `VETO`.

Agent voting does not open gates. Agent voting does not approve execution. Agent
voting does not update canon. Agent voting does not create receipts. Agent
voting does not select the best Agent automatically. Agent voting does not
progress routes automatically.

## 10. Vote Taxonomy

Vote classes describe advisory evidence. Vote classes do not decide. Vote
classes do not trigger automatic route progression. Vote classes do not create
receipts. Vote classes do not open gates.

| Vote class | Meaning | Allowed issuers | Required evidence | Route readiness effect | CONTROL_THREAD review |
| --- | --- | --- | --- | --- | --- |
| `APPROVE_RECOMMENDATION` | Recommends proceeding based on evidence | Assigned voters | Evidence summary and scope | Positive readiness signal only | Required |
| `REJECT_RECOMMENDATION` | Recommends not proceeding | Assigned voters | Failure rationale | Negative readiness signal only | Required |
| `REQUEST_REVISION` | Requests changes before further review | Reviewers, voters | Specific revision request | Readiness incomplete | Required for acceptance |
| `BLOCKER_RAISED` | Identifies a blocking risk or missing prerequisite | Challenger, Safety Guard, Auditor, Verifier | Blocker evidence | Blocks readiness display until reviewed | Required |
| `RISK_FLAG` | Flags risk without full blocker posture | Any assigned reviewer | Risk note | Adds risk posture | Required for high risk |
| `ABSTAIN` | Declines vote due to scope/conflict/insufficient evidence | Any voter | Abstention reason | Quorum gap if role required | Required if quorum affected |
| `DISSENT` | Preserves disagreement | Any reviewer or voter | Dissent rationale | Must remain visible | Required |
| `CONTRADICTION_FOUND` | Identifies conflicting claims/evidence | Challenger, Verifier, Auditor, Librarian | Contradiction evidence | Blocks synthesis closure | Required |
| `SAFE_ALTERNATIVE_PROPOSED` | Offers lower-risk path | Builder, Synthesizer, Safety Guard, Rollback Planner | Alternative and tradeoff | Advisory alternative | Required if selected |
| `NEEDS_MORE_EVIDENCE` | Evidence is insufficient | Any reviewer or voter | Missing evidence list | Readiness incomplete | Required for progression |
| `OUT_OF_SCOPE` | Work exceeds assigned scope | Router, Steward, Reviewer, Auditor | Scope rationale | Route/scope review needed | Required |
| `DEFER` | Recommends waiting | Any voter | Deferral reason | No progression | Required if work continues |

## 11. Quorum Model

Quorum is readiness evidence, not approval.

Quorum fields:

- `required_roles`
- `optional_roles`
- `quorum_status`
- `automatic_approval: false`
- `no_consensus_state`
- `dissent_visibility`
- `risk_lane_requirements`

Recommended development quorum:

- `BUILDER`
- `VERIFIER`
- `CHALLENGER`

Recommended high-risk development quorum:

- `BUILDER`
- `VERIFIER`
- `CHALLENGER`
- `SAFETY_GUARD`
- `ROLLBACK_PLANNER`

Recommended docs/canon quorum:

- `SYNTHESIZER`
- `LIBRARIAN` or `ARCHIVIST`
- `CANON_BOUNDARY_REVIEWER`

Recommended security/gate quorum:

- `GATE_REVIEWER`
- `ABUSE_CASE_REVIEWER`
- `PRIVACY_BOUNDARY_REVIEWER`
- `AUDITOR`

Medium/high-risk lanes require a Challenger or dissent-preservation role.

Quorum complete does not equal approval. Quorum complete does not open gates.
Quorum complete does not update canon. Quorum complete does not create receipts.
Quorum incomplete does not automatically reject; it records readiness deficit.
Dissent must remain visible.

## 12. Collaboration Model

BUILDER drafts.

VERIFIER checks.

CHALLENGER attacks.

LIBRARIAN checks lineage.

SAFETY_GUARD checks blocked capabilities.

SYNTHESIZER prepares handoff.

CONTROL_THREAD decides.

Development work pattern:

- Builder drafts a plan, PR body, validation checklist, and rollback note.
- Verifier checks evidence and validation posture.
- Challenger attacks assumptions and preserves dissent.
- Librarian checks lineage when docs/canon/source posture is involved.
- Safety Guard checks blocked capabilities for medium/high-risk work.
- Synthesizer prepares manual handoff.

Docs/canon work pattern:

- Synthesizer drafts the reference shape.
- Librarian or Archivist checks lineage.
- Canon Boundary Reviewer checks what is and is not canon.
- Challenger preserves contradictions.
- CONTROL_THREAD decides whether any canon route proceeds.

Security/gate work pattern:

- Gate Reviewer names the gate requirement.
- Abuse Case Reviewer attacks bypass paths.
- Privacy Boundary Reviewer checks customer-data and privacy boundaries.
- Auditor records evidence gaps.
- CONTROL_THREAD decides whether a future gate design route proceeds.

Handoff representation should include source posture, vote posture, dissent,
contradictions, blockers, safe alternatives, required gates, required receipts,
and unresolved questions. Conflict preservation is required.

Collaboration produces evidence and artifacts. Collaboration does not decide.
Collaboration does not execute. Collaboration does not mutate repos.
Collaboration does not create receipts. Collaboration does not update canon.

## 13. Initial Domain-Specific Agent Sets

### DEV

Agents:

- `JAI::DEV::BUILDER`
- `JAI::DEV::VERIFIER`
- `JAI::DEV::CHALLENGER`
- `JAI::DEV::LIBRARIAN`
- `JAI::DEV::RELEASE_PLANNER`
- `JAI::DEV::ROLLBACK_PLANNER`

Expected artifacts: implementation plan draft, diff summary draft, validation
checklist draft, PR body draft, rollback note, release note. V0 posture:
compose-only and read-only. Allowed outputs: plans, summaries, checklists,
handoffs, dissent. Blocked actions: repo mutation, file mutation, branch/PR
automation, commit automation, execution. Likely voting participation: Builder,
Verifier, Challenger, Librarian, Rollback Planner. Gate/receipt prerequisites:
repo gate, execution gate, validation evidence, rollback receipt future.

### DOCS

Agents:

- `JAI::DOCS::SYNTHESIZER`
- `JAI::DOCS::ARCHIVIST`
- `JAI::DOCS::CONSISTENCY_REVIEWER`
- `JAI::DOCS::CANON_BOUNDARY_REVIEWER`

Expected artifacts: reference draft, source map, consistency note, canon
boundary note. V0 posture: read-only and compose-only. Allowed outputs: docs
drafts, lineage notes, contradictions. Blocked actions: canon update, receipt
creation, hidden synthesis, route progression. Likely voting participation:
Archivist, Consistency Reviewer, Canon Boundary Reviewer. Gate/receipt
prerequisites: canon receipt future, docs acceptance receipt future.

### FORMAT

Agents:

- `JAI::FORMAT::PROFILE_DESIGNER`
- `JAI::FORMAT::SCHEMA_REVIEWER`
- `JAI::FORMAT::COMPATIBILITY_GUARD`
- `JAI::FORMAT::EXAMPLE_CURATOR`

Expected artifacts: `.jai` profile proposal, schema review, compatibility note,
example packet. V0 posture: doctrine/reference only. Allowed outputs: profile
drafts, schema notes, examples. Blocked actions: parser/runtime behavior,
profile validation, `.jai` execution, active semantics. Likely voting
participation: Schema Reviewer, Compatibility Guard. Gate/receipt prerequisites:
profile acceptance receipt future.

### AUDIT

Agents:

- `JAI::AUDIT::RISK_REVIEWER`
- `JAI::AUDIT::EVIDENCE_REVIEWER`
- `JAI::AUDIT::AUTHORITY_BOUNDARY_REVIEWER`

Expected artifacts: risk register, evidence review, authority boundary note. V0
posture: read-only. Allowed outputs: audit findings, risk flags, blocker
recommendations. Blocked actions: policy enforcement, gate opening, automatic
scoring. Likely voting participation: all listed. Gate/receipt prerequisites:
audit receipt future.

### SECURITY

Agents:

- `JAI::SECURITY::GATE_REVIEWER`
- `JAI::SECURITY::ABUSE_CASE_REVIEWER`
- `JAI::SECURITY::STEP_UP_REVIEWER`
- `JAI::SECURITY::PRIVACY_BOUNDARY_REVIEWER`

Expected artifacts: gate requirement note, abuse case review, step-up boundary
note, privacy boundary note. V0 posture: read-only and blocked. Allowed outputs:
security findings, blocker recommendations, safe alternatives. Blocked actions:
opening gates, auth/session changes, customer-data handling, privilege
escalation. Likely voting participation: all listed. Gate/receipt prerequisites:
security gate receipt future.

### COUNCIL

Agents:

- `JAI::COUNCIL::DELIBERATOR`
- `JAI::COUNCIL::DISSENT_PRESERVER`
- `JAI::COUNCIL::CONTRADICTION_FINDER`
- `JAI::COUNCIL::SYNTHESIS_REVIEWER`

Expected artifacts: deliberation note, dissent record, contradiction record,
synthesis review. V0 posture: advisory only. Allowed outputs: advisory notes,
dissent, contradictions, synthesis review. Blocked actions: model dispatch,
Council dispatch, automatic synthesis, canon update, receipt creation. Likely
voting participation: Dissent Preserver, Contradiction Finder, Synthesis
Reviewer. Gate/receipt prerequisites: council-return/v0 receipt future.

## 14. Registry Object Model Extensions

Additional registry fields:

- `namespace`
- `domain_engine`
- `agent_type`
- `vote_role`
- `work_role`
- `collaboration_roles`
- `quorum_requirements`
- `conflict_policy`
- `advisory_weight`
- `veto_recommendation_allowed`
- `required_peer_reviews`
- `domain_gate_requirements`
- `authority_ceiling`
- `activation_stage`
- `engine_scope`
- `related_domain_engines`

Advisory weight is not authority.

`advisory_weight` must not become:

- automatic scoring
- automatic ranking
- automatic best-agent selection
- automatic approval
- automatic route progression

Advisory weight may help represent evidence posture only. Advisory weight must
not decide. Advisory weight must not hide dissent. Advisory weight must not
replace CONTROL_THREAD.

## 15. Council Relationship

Agent voting and Council voting are separate. Agent votes feed Council as
evidence. Council review feeds CONTROL_THREAD as advisory evidence. A Council
participant and an Agent registry entry may correspond conceptually but remain
separate objects. Agent dissent and Council dissent must both be preserved.

Council agreement is not authority. Council synthesis does not decide. Council
review does not dispatch models. Council review does not update canon. Council
review does not create receipts unless separately authorized by a future
accepted route.

## 16. Palette/Grid Relationship

Palette may assemble vote evidence context. Palette may assemble labeled context
but does not grant authority.

Grid may show Agent readiness, vote posture, quorum status, blocked
capabilities, risk, review, required gates, dissent, and contradictions. Grid
displays vote/readiness posture; it does not decide.

Required Grid labels:

- `STAGED`
- `READ-ONLY READY`
- `COMPOSE-ONLY READY`
- `GATED`
- `BLOCKED IN V0`
- `QUORUM INCOMPLETE`
- `QUORUM COMPLETE  NOT APPROVAL`
- `DISSENT PRESENT`
- `BLOCKER RAISED`
- `CONTROL_THREAD REVIEW REQUIRED`
- `ZERO GATES GRANTED`

Palette context assembly does not grant authority. Grid display does not
decide. Grid display does not activate Agents. Grid display does not open gates.

## 17. Development Workflow Relationship

Agent voting can improve development quality without activating execution:

- Builder output should require Verifier vote evidence before development route
  progression is considered.
- Challenger dissent should be required for high-risk work.
- Librarian review should precede docs/canon update proposals.
- Safety Guard review should precede execution-gate proposals.
- PR body drafts may include vote summaries as compose-only text.
- Validation checklists should preserve disagreement and unresolved evidence.

Development vote summaries are advisory. PR body draft summaries are
compose-only. Validation checklists do not execute validation unless separately
performed. Validation is not acceptance.

This development workflow relationship does not authorize GitHub API, branch
creation, PR creation, push, merge, repo/file mutation, commit automation, or
execution.

## 18. Tool/Execution Relationship

Tool classes are represented requirements or blocked future capabilities only.

Represented tool classes:

- terminal
- browser
- desktop
- GitHub
- filesystem
- model
- network
- database
- scheduler
- memory

Registry v0 requires `enabled_tools: []`.

Blocked tool classes include terminal execution, browser/desktop control,
GitHub API, repo/file mutation, provider/model dispatch, network calls, DB
writes, scheduler behavior, and memory writes.

Every tool class requires a future gate before use. Tool class representation is
not tool authority. No tool invocation is authorized. No Agent execution is
authorized. No Agent dispatch is authorized. No terminal/browser/desktop/GitHub/
filesystem/model/network/database/scheduler/memory capability is enabled.

## 19. `.jai` Relationship

Agent registry entries should become `.jai` objects after
`JAI_CORE_OBJECT_MODEL_V0` is accepted.

Recommended future profiles:

- `agent-registry-entry/v0`
- `agent-vote/v0`
- `agent-lane-candidate/v0`
- `agent-output-review/v0`
- `agent-gate-requirement/v0`
- `agent-revocation/v0`

`.jai must not execute, dispatch an Agent, call a model, invoke a tool, mutate repo/file state, open a gate, grant authority, create receipt, update canon, select best Agent, run workflows, or schedule tasks.`

## 20. Receipt Relationship

Required future receipt classes:

- Agent proposal receipt.
- Agent registry acceptance receipt.
- Agent lane promotion receipt.
- Execution-gate grant receipt.
- Agent output review receipt.
- Rollback or revocation receipt.
- Deprecation/supersession receipt.

No receipt creation is authorized by this artifact. Receipt classes are future
requirements only. Receipt references are lineage expectations, not live receipt
creation. Receipts record; they do not decide.

## 21. Safety/Refusal Model

Blocked behavior register:

- autonomous execution
- tool invocation without gate
- model dispatch without gate
- GitHub mutation
- repo/file mutation
- browser/desktop control
- terminal execution
- customer-data access
- production deployment
- silent persistence
- hidden memory writes
- automatic canon update
- automatic receipt creation
- automatic best-agent selection
- automatic synthesis without review
- privilege escalation
- voting mistaken for authority
- quorum mistaken for approval
- executor naming implying execution

Safe alternatives:

- read-only display
- compose-only draft
- copy-only manual handoff
- staged candidate
- gated future capability
- doctrine requirement
- security gate requirement
- execution gate requirement
- receipt requirement
- rollback requirement
- human review

## 22. Registry Lifecycle

| Lifecycle step | Required evidence | Required decision authority | Allowed behavior | Blocked behavior | Required receipt |
| --- | --- | --- | --- | --- | --- |
| proposed | Proposal and source posture | CONTROL_THREAD review requested | Represent | Execute, dispatch | Proposal receipt future |
| reviewed | Peer review evidence | CONTROL_THREAD | Review, summarize | Activate | Review receipt future |
| staged | Registry staging evidence | CONTROL_THREAD | Stage, draft, classify | Execute, invoke tools | Staging receipt future |
| accepted as registry entry | Acceptance evidence | CONTROL_THREAD | Represent as accepted entry | Execute | Registry acceptance receipt future |
| accepted as read-only participant | Read-only participation scope | CONTROL_THREAD | Read-only review | Compose, execute | Participation receipt future |
| accepted as compose-only participant | Compose scope and boundaries | CONTROL_THREAD | Draft, summarize, propose | Submit, persist, dispatch | Compose acceptance receipt future |
| gated for limited execution | Future gates, validation, rollback, security, audit | Future explicit authority | Future-only limited execution design | Available in v0 | Execution-gate grant receipt future |
| suspended | Suspension rationale | CONTROL_THREAD | Hide from assignment | Use in new lanes | Suspension receipt future |
| revoked | Revocation evidence | CONTROL_THREAD | Record revocation | Reactivate silently | Revocation receipt future |
| deprecated | Replacement rationale | CONTROL_THREAD | Mark deprecated | Use as current | Deprecation receipt future |
| superseded | Supersession mapping | CONTROL_THREAD | Link successor | Silent replacement | Supersession receipt future |
| retired | Retirement rationale | CONTROL_THREAD | Archive | New assignment | Retirement receipt future |

Lifecycle status does not bypass gates. Lifecycle progression requires accepted
authority and receipts where applicable. No lifecycle stage grants execution in
this artifact. `gated for limited execution` is future-only and unavailable in
v0.

## 23. Safe Activation Sequence

1. `JAI_AGENT_REGISTRY_MODEL_V0`
2. `JAI_AGENT_DOMAIN_ENGINE_MODEL_V0`, if split later
3. `JAI_AGENT_VOTING_MODEL_V0`, if split later
4. `dev-jai-nexus Agent Registry Read-Only Surface v0`
5. `dev-jai-nexus Agent Vote Review Surface v0`
6. `jai-format agent-registry-entry/v0 profile`
7. `jai-format agent-vote/v0 profile`
8. `jai-format agent-lane-candidate/v0 profile`
9. compose-only Agent collaboration packets
10. gated execution design much later

Sequencing rules:

- Registry before lane activation.
- Domain engine before Agent voting.
- Voting model before vote review surface.
- `.jai` profile after doctrine.
- Read-only surface before compose-only surface.
- Compose-only before execution design.
- Execution design after gates, receipts, validation, rollback, security, and
  audit are accepted.

## 24. Risks

| Risk | Mitigation / containment |
| --- | --- |
| Voting mistaken for authority | Repeat advisory-only doctrine and require CONTROL_THREAD review. |
| Executor naming implying execution | Use `EXECUTOR_CANDIDATE` only; reject runner/live labels. |
| Too many Agent types creating complexity | Start with domain-specific minimum sets and review cadence. |
| Advisory weights becoming automatic scoring | Keep advisory weight representational and prohibit ranking/approval. |
| Agent consensus hiding dissent | Require dissent and contradiction visibility. |
| Domain engines becoming silos | Record related domain engines and cross-domain review requirements. |
| Domain engines conflicting | Require conflict policy and CONTROL_THREAD review. |
| Automatic best-agent selection creeping in | Prohibit automatic ranking and best-agent selection. |
| Council and Agent voting collapsing into one authority | Keep Agent votes, Council review, and CONTROL_THREAD separate. |
| Registry sprawl | Require lifecycle status, review cadence, deprecation, and revocation. |
| Hidden privilege escalation | Require authority ceiling, gate requirements, and blocked action register. |

## 25. Unresolved Questions

- Should domain engine models become separate artifacts or remain sections
  inside the registry model?
- What is the first implementation scope after this doctrine?
- Should `agent_type` be single-valued or multi-valued?
- Is `VOTER` a type, a capability, or both?
- Is `EXECUTOR_CANDIDATE` a type or activation stage?
- Should `advisory_weight` exist at all?
- Should quorum be mandatory for every route or only risk-tagged routes?
- What is the minimum vote evidence shape?
- What is the minimum dissent-preservation shape?
- Is `VETO_RECOMMENDATION` too risky as terminology?
- When should CUSTOMER and BILLING domain engines be introduced?
- What review cadence should the Agent registry require?

## 26. Non-Authorizations

This artifact does not authorize execution, runtime activation, provider/model
dispatch, live model calls, Agent execution, Agent dispatch, tool invocation,
GitHub integration, GitHub API use, repo mutation, file mutation, branch
creation, PR creation, push, merge, commit automation, branch/PR automation,
browser/desktop control, terminal/command execution, scheduler, autonomous
loop, retrieval engine, automatic context injection, live memory writes, hidden
persistence, live settings mutation, new API routes, new server actions, DB
writes, Prisma changes, telemetry, auth/session changes, customer-data
handling, production behavior, `.jai` parser/runtime behavior, `.jai` execution
behavior, `.nexus` active semantics, policy enforcement, execution gates opened,
automatic scoring, automatic synthesis, automatic best-agent selection,
automatic gate evaluation, automatic profile validation, receipt creation,
canon update, route-state mutation, or motion-state mutation.

JAI Agents are staged, not executing.

Agent registry entries do not execute.

Agent lanes do not execute.

Agent votes are evidence, not authority.

Agent votes do not decide.

Quorum is readiness evidence, not approval.

EXECUTOR_CANDIDATE is the only safe v0 executor-related term.

Advisory weight is not authority.

Grid displays vote/readiness posture; it does not decide.

Palette may assemble labeled context but does not grant authority.

CONTROL_THREAD decides.

ZERO GATES GRANTED.
