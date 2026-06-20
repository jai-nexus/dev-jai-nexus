# JAI_AGENT_REGISTRY_MODEL_V0

## 1. Status

Artifact location: `docs/reference`.

Artifact type: Agent registry model.

Included models:

- role-template model
- domain-engine model
- advisory voting model
- Palette Agent-set recommendation model

Runtime posture: non-executing.

Activation posture: no activation.

Gate posture: zero gates granted.

JAI Agents are staged, not executing.

Agent registry entries do not execute.

Agent lanes do not execute.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

This artifact is doctrine/reference only. It does not implement Agent
activation, runtime behavior, execution behavior, UI behavior, route behavior,
backend behavior, API behavior, DB/Prisma behavior, provider/model behavior,
GitHub/tool behavior, receipt creation, canon update, or gate opening.

## 2. Current Baseline

CONTROL_THREAD accepts these exploration outputs:

- JAI Agent Registry Discovery v0.
- JAI Agent Registry Domain Engine + Voting Model v0.
- JAI Agent Role Template + Palette Agent-Set Recommendation Model v0.

This artifact consolidates accepted discovery, domain-engine, voting,
role-template, and Palette recommendation concepts into a durable
`docs/reference` model before any Agent activation work proceeds.

Accepted control statement:

`JAI::AGENT::<ROLE>` templates define reusable governed Agent-role envelopes.
Templates may derive into domain Agents. Domain Agents may be recommended as
project-scoped staged candidates. JAI Palette may recommend staged Agent
candidates for review, but Palette recommendation is not creation, activation,
dispatch, or authority. Template expansion is recommendation. Template
instantiation is review. Agent activation is gated. CONTROL_THREAD decides.
ZERO GATES GRANTED.

## 3. JAI Agent Definition

A JAI Agent is a governed, versioned, registry-backed operating profile that can
be assigned to staged lanes to produce bounded work artifacts under authority,
evidence, validation, receipt, and gate constraints.

A JAI Agent includes:

- Stable identity: `agent_id`, namespace, `object_id`, `nhID`, version, and
  lineage.
- Role: intended role, Agent type, vote role, work role, and collaboration
  role.
- Capability envelope: capability classes, allowed modes, blocked modes,
  allowed actions, and blocked actions.
- Context requirements: source classes, freshness, privacy boundary, project
  context, domain context, and `.jai` dependencies.
- Allowed outputs: summaries, proposals, classifications, reviews, risk notes,
  validation checklists, rollback notes, handoff drafts, and safe alternatives.
- Blocked actions: execution, dispatch, tool invocation, repo/file mutation,
  branch/PR automation, receipt creation, canon update, and gate evaluation.
- Review requirements: peer review, human review, dissent preservation,
  contradiction review, and CONTROL_THREAD review.
- Gate requirements: security, execution, model/provider, tool, repo/file,
  customer-data, and domain gates where applicable.
- Receipt requirements: future receipt expectations for proposal, acceptance,
  lineage, promotion, review, rollback, revocation, and supersession.
- Provenance: source artifact, authoring route, evidence, lineage, and receipt
  references when they exist.
- Lifecycle status: proposed, reviewed, staged, accepted read-only, accepted
  compose-only, suspended, revoked, deprecated, superseded, or retired.

A JAI Agent is a registry-backed operating profile. A JAI Agent is not
automatically a runtime actor. A JAI Agent does not execute in v0. A JAI Agent
does not gain authority by being registered. Registry presence is not
activation. Lane assignment is not execution.

## 4. Non-Agent Distinctions

These are not JAI Agents:

- Model provider: a model provider may supply model capability, but it is not a
  governed JAI Agent.
- Model slot: a model slot may represent a model position, but it is not an
  Agent identity.
- Council participant: a Council participant may contribute advisory review,
  but it is not automatically a registry-backed Agent.
- Route: a route displays or organizes workflow, but it is not an Agent.
- Workflow: a workflow may coordinate work, but it is not an Agent.
- Tool: a tool may be required by future capabilities, but it is not an Agent.
- Permission, gate, or receipt: a permission, gate, or receipt is a governance
  object, not an Agent.
- Human operator: a human operator is not a JAI Agent.
- Raw prompt template: a raw prompt template is not a registry-backed Agent.

Governance objects may constrain Agent use. They do not become Agents.

## 5. Role-Template Model

`JAI::AGENT::<ROLE>` templates are abstract, reusable, governance-bounded
Agent-role definitions.

Role-template rules:

- Role templates are not active Agents.
- Role templates are reusable registry objects.
- Role templates are `.jai` profile candidates.
- Role templates are derivation sources for domain Agents.
- Role templates define inherited governance boundaries.
- Accepted templates do not activate derived Agents.

Required initial template examples:

- `JAI::AGENT::BUILDER`
- `JAI::AGENT::VERIFIER`
- `JAI::AGENT::CHALLENGER`
- `JAI::AGENT::LIBRARIAN`
- `JAI::AGENT::SYNTHESIZER`
- `JAI::AGENT::AUDITOR`
- `JAI::AGENT::SAFETY_GUARD`
- `JAI::AGENT::CONTEXT_CURATOR`
- `JAI::AGENT::RECEIPT_DRAFTER`
- `JAI::AGENT::ROLLBACK_PLANNER`
- `JAI::AGENT::ROUTER`
- `JAI::AGENT::STEWARD`
- `JAI::AGENT::EXECUTOR_CANDIDATE`

Template existence is not Agent activation. Template acceptance is not Agent
activation. Template expansion is recommendation. Template instantiation is
review. A template may derive into a domain Agent only through controlled review
and accepted lineage.

## 6. Template Namespace Model

Template namespace syntax:

`JAI::AGENT::<ROLE>`

Namespace rules:

- Version and status must not be encoded directly in namespace.
- `namespace` is stable human-facing canonical name.
- `object_id` is durable identity.
- `nhID` is coordinate/location in JAI structure.
- `version` is revision over time.
- `status` is lifecycle state.
- `receipt_ref` is decision lineage.

Namespace distinctions:

- `JAI::AGENT::<ROLE>` is a template namespace.
- `JAI::<DOMAIN>::<ROLE>` is a domain-Agent namespace.
- `JAI::PROJECT::<PROJECT_ID>::<DOMAIN>::<ROLE>` is a project-scoped candidate
  namespace.

## 7. Template Object Model

Role-template registry object fields:

- `role_template_id`
- `namespace`
- `object_id`
- `nhID`
- `display_name`
- `version`
- `status`
- `template_class`
- `description`
- `allowed_domain_engines`
- `default_agent_types`
- `default_allowed_outputs`
- `default_forbidden_outputs`
- `default_allowed_actions`
- `default_blocked_actions`
- `default_vote_role`
- `default_work_role`
- `default_collaboration_roles`
- `default_quorum_requirements`
- `default_gate_requirements`
- `default_receipt_requirements`
- `default_validation_requirements`
- `default_rollback_requirements`
- `risk_profile`
- `context_requirements`
- `palette_recommendation_rules`
- `instantiation_rules`
- `specialization_rules`
- `review_requirements`
- `lineage`
- `provenance`

Required v0 defaults:

```yaml
current_gate_state: closed
recommendation_is_creation: false
recommendation_is_activation: false
```

`default_allowed_actions` are limited to:

- `represent`
- `stage`
- `draft`
- `review`
- `summarize`
- `propose`
- `classify`
- `request_human_review`

`default_blocked_actions` include:

- `execute`
- `dispatch`
- `invoke_tool`
- `write_file`
- `mutate_repo`
- `create_branch`
- `open_pr`
- `push`
- `merge`
- `deploy`
- `create_receipt`
- `update_canon`
- `access_customer_data`
- `persist_hidden_memory`
- `run_terminal`
- `control_browser`
- `control_desktop`

Illustrative non-executable template object:

```yaml
role_template_id: JAI-ROLE-TEMPLATE-BUILDER-0001
namespace: JAI::AGENT::BUILDER
object_id: jai.agent.template.builder
nhID: jai.agent.template.builder
display_name: Builder Role Template
version: 0.0.0-reference
status: TEMPLATE_STAGED
template_class: reusable_role_envelope
description: Drafts bounded work artifacts for review.
allowed_domain_engines: [DEV, DOCS, EDGE, OPS]
default_agent_types: [BUILDER]
default_allowed_outputs: [plan_draft, summary, safe_alternative]
default_forbidden_outputs: [applied_patch, receipt, canon_update]
default_allowed_actions: [represent, stage, draft, summarize, propose]
default_blocked_actions: [execute, dispatch, invoke_tool, mutate_repo, open_pr]
current_gate_state: closed
recommendation_is_creation: false
recommendation_is_activation: false
lineage:
  receipt_ref: null
provenance:
  artifact: JAI_AGENT_REGISTRY_MODEL_V0
```

This example is illustrative and non-executable.

## 8. Template Lifecycle

A template can be accepted while all derived Agents remain staged.

Template acceptance does not activate derived Agents.

| Lifecycle state | Meaning | Allowed behavior | Blocked behavior | Required evidence | Decision authority | Receipt expectation |
| --- | --- | --- | --- | --- | --- | --- |
| `TEMPLATE_PROPOSED` | Template concept exists | Represent proposal | Derive active Agents | Source rationale | CONTROL_THREAD review requested | Proposal receipt future |
| `TEMPLATE_DRAFT` | Draft shape exists | Draft and revise | Activate | Draft body and boundaries | CONTROL_THREAD review requested | Draft lineage receipt future |
| `TEMPLATE_REVIEW_ONLY` | Ready for review | Review, comment, dissent | Instantiate automatically | Review package | CONTROL_THREAD | Review receipt future |
| `TEMPLATE_STAGED` | Candidate for acceptance | Stage as reusable envelope | Execute, dispatch | Peer review and blockers | CONTROL_THREAD | Staging receipt future |
| `TEMPLATE_ACCEPTED` | Accepted reusable envelope | Derive staged domain Agents by review | Activate derived Agents | Acceptance evidence | CONTROL_THREAD | Template acceptance receipt future |
| `TEMPLATE_DEPRECATED` | No longer preferred | Display as deprecated | New recommendation by default | Replacement rationale | CONTROL_THREAD | Deprecation receipt future |
| `TEMPLATE_SUPERSEDED` | Replaced by another template | Link successor | Silent replacement | Supersession mapping | CONTROL_THREAD | Supersession receipt future |
| `TEMPLATE_RETIRED` | Archived | Read-only history | New derivation | Retirement rationale | CONTROL_THREAD | Retirement receipt future |
| `BLOCKED_IN_V0` | Not available for use in v0 | Display blocker | Use, execute, dispatch | Blocker note | CONTROL_THREAD | Blocker record future |

## 9. Template Derivation Model

Template derivation specializes reusable role templates into domain Agents.

Required example:

`JAI::AGENT::BUILDER`

`JAI::DEV::BUILDER`

Derivation rules:

- Domain specialization may add restrictions.
- Domain specialization may not weaken inherited governance.
- Allowed overrides: display name, domain scope, allowed output subset, stricter
  context requirements, stricter review requirements, stricter gates, stricter
  receipt expectations, stricter rollback expectations, and domain-specific
  risk posture.
- Non-overridable inherited governance: blocked actions, no-execution posture,
  no-dispatch posture, no-tool posture, receipt requirements, gate
  requirements, review requirements, rollback requirements, evidence
  requirements, dissent preservation, and CONTROL_THREAD authority.
- Specialization is stricter-only.
- Domain-specific gates may be added.
- Derived Agent versioning is separate from template versioning.
- Inherited blocked actions remain blocked.

Derived domain Agents remain staged until accepted separately. Derived domain
Agents do not execute. Template derivation is not activation. Domain
specialization cannot remove blocked actions inherited from the role template.
Domain specialization cannot weaken gate, receipt, review, rollback, or evidence
requirements.

## 10. Domain Engine Model

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

## 11. Agent Namespace Model

Domain-Agent namespace syntax:

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

- `JAI::AGENT::<ROLE>` = reusable role-template namespace.
- `JAI::<DOMAIN>::<ROLE>` = domain-Agent namespace.
- `JAI::PROJECT::<PROJECT_ID>::<DOMAIN>::<ROLE>` = project-scoped candidate
  namespace.

Do not encode version or status directly in a namespace.

## 12. Agent Type Taxonomy

Type assignment does not grant execution authority. Type assignment does not
grant tool authority. Type assignment does not decide routes. Type assignment
does not create receipts. Type assignment does not update canon.

| Agent type | Purpose | Allowed outputs | Blocked actions | Voting role | Likely domain engines | Safe v0 posture | Required gates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `EXECUTOR_CANDIDATE` | Represents possible future execution lane participant | Readiness note, gate list, rollback note | execute, dispatch, invoke tools | Comment only by default | DEV, EDGE, OPS | Staged, not executing | Future security and execution gates |
| `VOTER` | Issues advisory vote evidence | Vote record, rationale | decide, progress routes | May vote | All | Advisory | Vote receipt future |
| `REVIEWER` | Reviews evidence and artifacts | Review note, revision request | accept, mutate | May vote or comment | All | Read-only | Review receipt future |
| `BUILDER` | Drafts work artifacts | Plan, PR body draft, summary | write files, open PRs | May vote on readiness | DEV, EDGE, OPS | Compose-only | Repo/tool gates future |
| `VERIFIER` | Checks claims and validation posture | Verification note, checklist | execute validation automatically | May vote on evidence sufficiency | DEV, AUDIT, SECURITY | Read-only | Validation evidence future |
| `LIBRARIAN` | Checks lineage and source posture | Lineage note, source map | update canon | May raise lineage blockers | DEV, DOCS, FORMAT | Read-only | Canon/receipt future |
| `SYNTHESIZER` | Prepares handoff | Summary, passalong | decide, hide dissent | Comment or vote if assigned | DOCS, COUNCIL, AUDIT | Compose-only | Receipt future |
| `CHALLENGER` | Attacks assumptions | Dissent, contradiction, risk flag | block automatically | May raise blocker recommendation | DEV, COUNCIL, SECURITY | Advisory dissent | Human review future |
| `ROUTER` | Proposes route/work placement | Route recommendation | mutate route state | Comment | DEV, OPS, COUNCIL | Advisory | Route decision future |
| `STEWARD` | Maintains domain health | Registry hygiene note | activate Agents | May vote on hygiene | OPS, CUSTOMER, BILLING | Read-only | Registry receipt future |
| `AUDITOR` | Reviews authority and risk | Audit finding, risk note | enforce policy automatically | May raise blockers | AUDIT, SECURITY | Read-only | Audit receipt future |
| `SAFETY_GUARD` | Checks blocked capabilities | Safety review, blocker note | open gates | May raise blockers | SECURITY, DEV, CUSTOMER | Read-only | Security gate future |
| `CONTEXT_CURATOR` | Labels and scopes context | Context packet, source note | retrieve automatically, inject context | Comment | DOCS, FORMAT, DEV | Compose-only | Context/privacy gate future |
| `RECEIPT_DRAFTER` | Drafts receipt request text | Receipt draft, lineage expectation | create receipts | Comment | DOCS, AUDIT, COUNCIL | Compose-only | Receipt authority future |
| `ROLLBACK_PLANNER` | Plans rollback/revocation | Rollback note, revocation plan | execute rollback | May vote on rollback adequacy | DEV, EDGE, OPS, SECURITY | Compose-only | Execution/rollback gate future |

## 13. Executor-Candidate Posture

EXECUTOR_CANDIDATE is the only safe v0 executor-related term.

An executor candidate is a registry-backed profile that may later be evaluated
for a tightly gated execution role after doctrine, gates, receipts, validation,
rollback, security, and audit are accepted.

An executing Agent is a live runtime actor with dispatch and tool authority.
Executing Agent does not exist in v0 because no execution gate, tool gate, model
gate, repo gate, receipt authority, or runtime authority is open.

Allowed executor-candidate outputs:

- execution readiness note
- scope proposal
- required gate list
- risk assessment
- rollback requirement
- human handoff draft

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

- accepted registry entry
- accepted role template and domain engine
- security gate design
- execution gate design
- tool gate design
- receipt design
- validation evidence requirements
- rollback plan
- audit review
- CONTROL_THREAD acceptance

Required safe labels:

- `EXECUTOR_CANDIDATE`
- `NOT EXECUTING`
- `COMPOSE-ONLY`
- `GATED FUTURE CAPABILITY`
- `ZERO GATES GRANTED`

Avoid and explicitly reject:

- `EXECUTOR`
- `ACTIVE EXECUTOR`
- `RUNNER`
- `AUTONOMOUS AGENT`
- `LIVE AGENT`

Executor-candidate posture is representational. Executor-candidate posture does
not activate execution. Executor-candidate posture does not imply an Agent
runner. Executor-candidate posture does not imply tool use. Executor-candidate
posture does not imply autonomy.

## 14. Advisory Voting Model

Agent voting is advisory governance input.

Agent votes are evidence, not authority.

Agent votes do not decide.

CONTROL_THREAD decides.

No vote class triggers automatic progression. Even unanimous approval remains
advisory.

Use `VETO_RECOMMENDATION`.

Do not use `VETO`.

Agent voting does not open gates. Agent voting does not approve execution. Agent
voting does not update canon. Agent voting does not create receipts. Agent
voting does not select the best Agent automatically. Agent voting does not
progress routes automatically.

## 15. Vote Taxonomy

Vote classes describe advisory evidence. Vote classes do not decide. Vote
classes do not trigger automatic route progression. Vote classes do not create
receipts. Vote classes do not open gates.

| Vote class | Meaning | Allowed issuers | Required evidence | Route readiness effect | CONTROL_THREAD review |
| --- | --- | --- | --- | --- | --- |
| `APPROVE_RECOMMENDATION` | Recommends proceeding based on evidence | Assigned voters | Evidence summary and scope | Positive readiness signal only | Required |
| `REJECT_RECOMMENDATION` | Recommends not proceeding | Assigned voters | Failure rationale | Negative readiness signal only | Required |
| `REQUEST_REVISION` | Requests changes before further review | Reviewers, voters | Specific revision request | Readiness incomplete | Required for acceptance |
| `BLOCKER_RAISED` | Identifies blocker or missing prerequisite | Challenger, Safety Guard, Auditor, Verifier | Blocker evidence | Blocks readiness display until reviewed | Required |
| `RISK_FLAG` | Flags risk without full blocker posture | Any assigned reviewer | Risk note | Adds risk posture | Required for high risk |
| `ABSTAIN` | Declines vote due to scope/conflict/evidence | Any voter | Abstention reason | Quorum gap if role required | Required if quorum affected |
| `DISSENT` | Preserves disagreement | Any reviewer or voter | Dissent rationale | Must remain visible | Required |
| `CONTRADICTION_FOUND` | Identifies conflicting claims/evidence | Challenger, Verifier, Auditor, Librarian | Contradiction evidence | Blocks synthesis closure | Required |
| `SAFE_ALTERNATIVE_PROPOSED` | Offers lower-risk path | Builder, Synthesizer, Safety Guard, Rollback Planner | Alternative and tradeoff | Advisory alternative | Required if selected |
| `NEEDS_MORE_EVIDENCE` | Evidence is insufficient | Any reviewer or voter | Missing evidence list | Readiness incomplete | Required for progression |
| `OUT_OF_SCOPE` | Work exceeds assigned scope | Router, Steward, Reviewer, Auditor | Scope rationale | Route/scope review needed | Required |
| `DEFER` | Recommends waiting | Any voter | Deferral reason | No progression | Required if work continues |

## 16. Quorum Model

Quorum is readiness evidence, not approval.

Quorum fields:

- required roles
- optional roles
- `quorum_status`
- `automatic_approval: false`
- no-consensus state
- dissent visibility requirements

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

Quorum complete does not equal approval. Quorum complete does not open gates.
Quorum complete does not update canon. Quorum complete does not create receipts.
Quorum incomplete does not automatically reject; it records readiness deficit.
Dissent must remain visible.

## 17. Collaboration Model

BUILDER drafts.

VERIFIER checks.

CHALLENGER attacks.

LIBRARIAN checks lineage.

SAFETY_GUARD checks blocked capabilities.

SYNTHESIZER prepares handoff.

CONTROL_THREAD decides.

Development work pattern: Builder drafts plan and handoff, Verifier checks
evidence, Challenger attacks assumptions, Librarian checks lineage when source
posture matters, Safety Guard checks blocked capabilities for risk, and
Synthesizer prepares manual handoff.

Docs/canon work pattern: Synthesizer drafts reference, Librarian or Archivist
checks lineage, Canon Boundary Reviewer checks canon boundary, Challenger
preserves contradictions, and CONTROL_THREAD decides.

Security/gate work pattern: Gate Reviewer names gate requirements, Abuse Case
Reviewer attacks bypass paths, Privacy Boundary Reviewer checks boundaries,
Auditor records evidence gaps, and CONTROL_THREAD decides.

Handoff representation includes source posture, vote posture, dissent,
contradictions, blockers, safe alternatives, required gates, required receipts,
and unresolved questions. Conflict preservation is required.

Collaboration produces evidence and artifacts. Collaboration does not decide.
Collaboration does not execute. Collaboration does not mutate repos.
Collaboration does not create receipts. Collaboration does not update canon.

## 18. Initial Domain-Specific Agent Sets

### DEV

Agents: `JAI::DEV::BUILDER`, `JAI::DEV::VERIFIER`,
`JAI::DEV::CHALLENGER`, `JAI::DEV::LIBRARIAN`,
`JAI::DEV::RELEASE_PLANNER`, `JAI::DEV::ROLLBACK_PLANNER`.

Expected artifacts: implementation plan, diff summary, validation checklist, PR
body draft, release note, rollback note. V0 posture: read-only and
compose-only. Allowed outputs: plans, summaries, checklists, dissent, safe
alternatives. Blocked actions: repo/file mutation, branch/PR automation, commit
automation, execution. Likely voting: Builder, Verifier, Challenger, Librarian,
Rollback Planner. Gate/receipt prerequisites: repo gate, execution gate,
validation evidence, rollback receipt future.

### DOCS

Agents: `JAI::DOCS::SYNTHESIZER`, `JAI::DOCS::ARCHIVIST`,
`JAI::DOCS::CONSISTENCY_REVIEWER`,
`JAI::DOCS::CANON_BOUNDARY_REVIEWER`.

Expected artifacts: reference draft, source map, consistency note, canon
boundary note. V0 posture: read-only and compose-only. Allowed outputs: docs
drafts, lineage notes, contradictions. Blocked actions: canon update, receipt
creation, route progression. Likely voting: Archivist, Consistency Reviewer,
Canon Boundary Reviewer. Gate/receipt prerequisites: canon receipt future, docs
acceptance receipt future.

### FORMAT

Agents: `JAI::FORMAT::PROFILE_DESIGNER`, `JAI::FORMAT::SCHEMA_REVIEWER`,
`JAI::FORMAT::COMPATIBILITY_GUARD`, `JAI::FORMAT::EXAMPLE_CURATOR`.

Expected artifacts: `.jai` profile proposal, schema review, compatibility note,
example packet. V0 posture: doctrine/reference only. Allowed outputs: profile
drafts, schema notes, examples. Blocked actions: parser/runtime behavior,
profile validation, `.jai` execution. Likely voting: Schema Reviewer,
Compatibility Guard. Gate/receipt prerequisites: profile acceptance receipt
future.

### AUDIT

Agents: `JAI::AUDIT::RISK_REVIEWER`,
`JAI::AUDIT::EVIDENCE_REVIEWER`,
`JAI::AUDIT::AUTHORITY_BOUNDARY_REVIEWER`.

Expected artifacts: risk register, evidence review, authority boundary note. V0
posture: read-only. Allowed outputs: findings, risk flags, blocker
recommendations. Blocked actions: policy enforcement, gate opening, automatic
scoring. Likely voting: all listed. Gate/receipt prerequisites: audit receipt
future.

### SECURITY

Agents: `JAI::SECURITY::GATE_REVIEWER`,
`JAI::SECURITY::ABUSE_CASE_REVIEWER`,
`JAI::SECURITY::STEP_UP_REVIEWER`,
`JAI::SECURITY::PRIVACY_BOUNDARY_REVIEWER`.

Expected artifacts: gate requirement note, abuse case review, step-up boundary,
privacy boundary. V0 posture: read-only and blocked. Allowed outputs: security
findings, blocker recommendations, safe alternatives. Blocked actions: opening
gates, auth/session changes, customer-data handling, privilege escalation.
Likely voting: all listed. Gate/receipt prerequisites: security gate receipt
future.

### COUNCIL

Agents: `JAI::COUNCIL::DELIBERATOR`,
`JAI::COUNCIL::DISSENT_PRESERVER`,
`JAI::COUNCIL::CONTRADICTION_FINDER`,
`JAI::COUNCIL::SYNTHESIS_REVIEWER`.

Expected artifacts: deliberation note, dissent record, contradiction record,
synthesis review. V0 posture: advisory only. Allowed outputs: advisory notes,
dissent, contradictions, synthesis review. Blocked actions: model dispatch,
Council dispatch, automatic synthesis, canon update, receipt creation. Likely
voting: Dissent Preserver, Contradiction Finder, Synthesis Reviewer.
Gate/receipt prerequisites: `council-return/v0` receipt future.

## 19. Project-Scoped Candidate Model

Project-scoped candidate namespace syntax:

`JAI::PROJECT::<PROJECT_ID>::<DOMAIN>::<ROLE>`

Example:

`JAI::PROJECT::JAI_NEXUS::DEV::BUILDER`

Required project evidence before Palette recommendation:

- project objective
- repo composition
- domain engines involved
- risk posture
- source posture
- missing validation
- missing receipts
- blocked capabilities
- customer-data boundary
- operator preferences

Project fields influencing recommendations include project ID, repos, domain
scope, work lanes, current blockers, risk, context sources, validation status,
receipt expectations, security posture, and audit needs.

Candidate statuses: `RECOMMENDED`, `STAGED_FOR_REVIEW`,
`ACCEPTED_READ_ONLY`, `ACCEPTED_COMPOSE_ONLY`, `REJECTED`, `SUPERSEDED`,
`EXPIRED`, `BLOCKED_IN_V0`.

Candidate acceptance/rejection model: Palette recommends, Operator reviews,
CONTROL_THREAD accepts or rejects, receipt records where future authority
exists. Candidate supersession requires lineage and replacement rationale.
Project candidate sprawl risk is contained by recommendation caps, expiration,
review cadence, and supersession records.

Palette may recommend staged Agent candidates. Palette must not silently create
active Agents. Palette must not activate Agents. Palette must not dispatch
Agents. Palette must not open gates.

## 20. Palette Agent-Set Recommendation Model

JAI Palette recommends project Agent sets for review.

Palette may use:

- project objective
- repo composition
- domain engines involved
- risk posture
- docs/canon needs
- security posture
- audit needs
- customer-data boundary
- current work lanes
- missing validation
- missing receipt requirements
- active blockers
- operator preferences
- accepted doctrine

Palette output should include:

- recommended Agent set
- rationale
- required reviews
- required gates
- blocked capabilities
- safe alternatives
- missing evidence
- source posture
- confidence label, if used
- operator review requirement
- CONTROL_THREAD acceptance requirement

Palette recommendation is not creation.

Palette recommendation is not activation.

Palette recommendation is not dispatch.

Palette recommendation is not authority.

Preferred safe wording: Palette recommends staged Agent candidates for review.

Avoid these phrases: automatically create active Agents, activate Agents,
launch Agents, run Agents, assign live Agents, deploy Agents, auto-select best
Agent, auto-generate active Agent roster.

## 21. Instantiation Authority Model

Authority requirements:

- Template acceptance: CONTROL_THREAD acceptance, template evidence, future
  template receipt.
- Domain Agent derivation: accepted template, domain engine review, stricter-only
  specialization, CONTROL_THREAD acceptance.
- Project Agent candidate proposal: Palette recommendation or human proposal,
  project evidence, source posture, operator review.
- Project Agent candidate acceptance: explicit CONTROL_THREAD acceptance and
  future receipt where applicable.
- Read-only Agent participation: accepted read-only scope and no execution
  gate.
- Compose-only Agent participation: accepted compose scope, local-only output,
  no dispatch.
- Future gated execution: separate accepted future route with gates, receipts,
  validation, rollback, security, and audit.

Default authority chain: Palette may recommend. Operator may review.
CONTROL_THREAD accepts. Receipt records. Gates remain closed unless separately
granted.

Template expansion is recommendation. Template instantiation is review. Agent
activation is gated. Acceptance must be explicit and receipt-backed where
applicable. Gate opening requires a separate accepted future route.

## 22. Grid Representation

Grid may display:

- role template
- derived domain Agent
- project-scoped candidate
- accepted read-only participant
- accepted compose-only participant
- gated future capability

Required Grid labels:

- `TEMPLATE`
- `DOMAIN AGENT`
- `PROJECT CANDIDATE`
- `PALETTE RECOMMENDATION`
- `STAGED FOR REVIEW`
- `READ-ONLY READY`
- `COMPOSE-ONLY READY`
- `BLOCKED IN V0`
- `ZERO GATES GRANTED`
- `CONTROL_THREAD REVIEW REQUIRED`

Grid displays Agent posture; it does not create or activate Agents.

Grid displays vote/readiness posture; it does not decide.

## 23. `.jai` Relationship

Role templates and Agent registry entries should become `.jai` objects only
after `JAI_CORE_OBJECT_MODEL_V0` is accepted.

Candidate future profiles:

- `agent-role-template/v0`
- `agent-registry-entry/v0`
- `agent-domain-engine/v0`
- `agent-vote/v0`
- `agent-lane-candidate/v0`
- `agent-set-recommendation/v0`
- `project-agent-candidate/v0`

`.jai must not create active Agents, activate Agents, dispatch Agents, call models, invoke tools, mutate repos, write files, create branches, open PRs, create receipts, update canon, open gates, run workflows, auto-select best Agents, or silently inject context.`

## 24. Receipt Relationship

Receipt expectations:

- role template proposal receipt
- role template acceptance receipt
- domain Agent derivation receipt
- project Agent candidate proposal receipt
- project Agent candidate acceptance receipt
- Agent-set recommendation receipt
- Agent vote review receipt
- Agent deprecation/supersession receipt

Receipt draft is not receipt. Palette recommendation is not receipt. Grid
display is not receipt. CONTROL_THREAD acceptance is required. No receipt
creation is authorized by this artifact.

Receipts record; they do not decide.

## 25. Safety/Refusal Model

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
- automatic creation wording implying activation

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

## 26. Registry Lifecycle

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

## 27. Safe Activation Sequence

1. `JAI_AGENT_REGISTRY_MODEL_V0`
2. `JAI_AGENT_ROLE_TEMPLATE_MODEL_V0`, if split later
3. `JAI_AGENT_DOMAIN_ENGINE_MODEL_V0`, if split later
4. `JAI_AGENT_VOTING_MODEL_V0`, if split later
5. `JAI Palette Agent-Set Recommendation Model v0`, if split later
6. `dev-jai-nexus Agent Registry Read-Only Surface v0`
7. `dev-jai-nexus Palette Agent Recommendation Surface v0`
8. `jai-format agent-role-template/v0 profile`
9. `jai-format agent-set-recommendation/v0 profile`
10. `jai-format project-agent-candidate/v0 profile`
11. compose-only Agent collaboration packets
12. gated execution design much later

Sequencing rules:

- Templates before domain derivation.
- Domain derivation before project candidates.
- Palette recommendation before candidate acceptance.
- Candidate acceptance before read-only or compose-only participation.
- Read-only before compose-only.
- Compose-only before gated execution design.
- Execution design much later.

## 28. Risks

| Risk | Mitigation / containment |
| --- | --- |
| Automatic creation wording implying activation | Use recommendation/review/staged wording only. |
| Template inheritance weakening governance | Require stricter-only specialization and inherited blocked actions. |
| Too many templates too early | Start with minimum reusable library and review cadence. |
| Domain specialization drift | Require lineage, domain-engine review, and conflict policy. |
| Project-specific Agent sprawl | Use recommendation caps, expiration, and supersession. |
| Palette recommendation becoming automatic selection | Require operator review and CONTROL_THREAD acceptance. |
| Grid display implying active Agents | Use `STAGED FOR REVIEW`, `BLOCKED IN V0`, and `ZERO GATES GRANTED`. |
| Template-derived voting mistaken for authority | Repeat advisory-only doctrine and CONTROL_THREAD boundary. |
| `EXECUTOR_CANDIDATE` implying execution | Pair with `NOT EXECUTING` and reject runner/live labels. |
| Hidden privilege escalation through derived templates | Require authority ceiling and non-overridable governance. |
| Customer project context causing data boundary issues | Keep customer-data access blocked until separate authority exists. |
| Advisory weights becoming automatic scoring | Prohibit scoring, ranking, approval, and best-agent selection. |
| Agent consensus hiding dissent | Require dissent and contradiction preservation. |
| Domain engines becoming silos | Track related domain engines and cross-domain review. |
| Council and Agent voting collapsing into one authority | Keep Agent votes, Council review, and CONTROL_THREAD separate. |

## 29. Unresolved Questions

- Are role templates formal registry entries or a separate registry class?
- Does `agent-role-template/v0` come before `agent-registry-entry/v0` in
  `jai-format`?
- Are Palette recommendations represented before Grid can display project
  candidates?
- Is `JAI::PROJECT::<PROJECT_ID>::...` canonical namespace or display alias?
- What project candidate recommendation caps are required?
- Does Palette recommendation require a receipt draft?
- Must role templates be accepted by CONTROL_THREAD before domain derivation?
- Can a domain engine reject a globally accepted template?
- Can a project override vote role to comment-only?
- Can domain engines create domain-only templates?
- Does `EXECUTOR_CANDIDATE` belong in the initial library?
- Should `advisory_weight` exist on templates or only vote bundles?
- Should template inheritance render visibly in Grid?
- What is the minimum review package for project candidate acceptance?
- Does every Palette recommendation bundle include safe alternatives?
- What customer-data boundary requirements apply?
- What expiration/review triggers apply to project Agent candidates?
- What supersession receipt requirements apply?
- Should role-template docs split from `JAI_AGENT_REGISTRY_MODEL_V0`?

## 30. Non-Authorizations

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

Explicit non-authorized classes:

- execution
- runtime activation
- provider/model dispatch
- live model calls
- Agent execution
- Agent dispatch
- tool invocation
- GitHub integration
- GitHub API use
- repo mutation
- file mutation
- branch creation
- PR creation
- push
- merge
- commit automation
- branch/PR automation
- browser/desktop control
- terminal/command execution
- scheduler
- autonomous loop
- retrieval engine
- automatic context injection
- live memory writes
- hidden persistence
- live settings mutation
- new API routes
- new server actions
- DB writes
- Prisma changes
- telemetry
- auth/session changes
- customer-data handling
- production behavior
- `.jai` parser/runtime behavior
- `.jai` execution behavior
- `.nexus` active semantics
- policy enforcement
- execution gates opened
- automatic scoring
- automatic synthesis
- automatic best-agent selection
- automatic gate evaluation
- automatic profile validation
- receipt creation
- canon update
- route-state mutation
- motion-state mutation

JAI Agents are staged, not executing.

Agent registry entries do not execute.

Agent lanes do not execute.

Agent votes are evidence, not authority.

Agent votes do not decide.

Quorum is readiness evidence, not approval.

Template expansion is recommendation.

Template instantiation is review.

Agent activation is gated.

Palette recommendation is not creation.

Palette recommendation is not activation.

Palette recommendation is not dispatch.

Palette recommendation is not authority.

CONTROL_THREAD decides.

ZERO GATES GRANTED.
