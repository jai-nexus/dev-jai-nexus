# JAI Toolchain Packet Flow v0

## Purpose

Define the conceptual packet classes for the coordinated JAI Toolchain
workflow so packet purpose, ownership, authority, approval gates, and evidence
relationships are explicit before any implementation is routed.

This artifact is reference-only. It does not implement packet transport,
runtime ingestion, execution, or client automation.

## Shared packet posture

All packet classes in this reference should be compatible with a future
canonical `jai-format` grammar and should preserve explicit authority
metadata.

Minimum conceptual fields across the packet family:

- `packet_id`
- `packet_type`
- `packet_version`
- `source_repo`
- `target_repo`
- `created_at`
- `created_by`
- `requested_action`
- `scope`
- `constraints`
- `authority_boundary`
- `approval_required`
- `evidence_required`
- `expected_outputs`
- `routing_recommendation`
- `failure_classification`
- `status`

## Packet classes

### Operator intent packet

Purpose:

- capture the initial human / `CONTROL_THREAD` objective without implying
  execution

Owner repo:

- `dev-jai-nexus`

Source:

- human operator / `CONTROL_THREAD`

Destination:

- `dev-jai-nexus`, `jai-format`, or a bounded client handoff surface

Minimum fields:

- `packet_id`
- `packet_type`
- `created_at`
- `created_by`
- `requested_action`
- `scope`
- `constraints`
- `authority_boundary`
- `approval_required`

Authority metadata:

- intent only
- no execution authority
- no implied approval

Approval requirement:

- authored by a human/operator context
- additional approval still required before dispatch/execution

Evidence relationship:

- may declare expected evidence but does not contain execution evidence

Non-goals / blocked behaviors:

- triggering execution
- bypassing packet shaping
- widening authority from plain-language intent

### `jai-format` work packet

Purpose:

- convert intent into a canonical workflow packet with scope, constraints,
  authority metadata, and expected evidence

Owner repo:

- `jai-format`

Source:

- `dev-jai-nexus` or an approved client surface

Destination:

- proposal/reasoning lanes, `orchestrator-nexus`, or later approved client
  lanes

Minimum fields:

- shared packet fields
- `target_repo`
- `evidence_required`
- `expected_outputs`

Authority metadata:

- canonical packaging only
- not approval
- not dispatch authority

Approval requirement:

- required before execution handoff if the packet advances past planning

Evidence relationship:

- defines expected evidence shape and required outputs

Non-goals / blocked behaviors:

- hidden execution
- runtime dispatch by packet creation alone
- provider/model dispatch implementation

### Motion proposal packet

Purpose:

- express a bounded motion/work proposal derived from the work packet using
  shared `jai` semantics

Owner repo:

- `dev-jai-nexus` with semantics from `jai`

Source:

- `dev-jai-nexus`

Destination:

- reasoning lanes, operator review, or `CONTROL_THREAD`

Minimum fields:

- shared packet fields
- `requested_action`
- `constraints`
- `expected_outputs`
- `approval_required`

Authority metadata:

- proposal only
- cannot self-authorize

Approval requirement:

- explicit human approval required before dispatch/execution

Evidence relationship:

- may reference expected evidence but does not certify evidence

Non-goals / blocked behaviors:

- self-approval
- dispatch authority
- branch/PR automation

### Council reasoning packet

Purpose:

- carry reasoning, recommendation, critique, risk framing, and classification

Owner repo:

- `jai`

Source:

- agent/council reasoning lane

Destination:

- operator review, `CONTROL_THREAD`, or proposal refinement

Minimum fields:

- shared packet fields
- `routing_recommendation`
- `failure_classification`
- `status`

Authority metadata:

- reasoning only
- not approval
- not execution

Approval requirement:

- cannot replace human approval

Evidence relationship:

- may interpret evidence or identify missing evidence
- does not finalize evidence truth

Non-goals / blocked behaviors:

- approving itself
- dispatching itself
- runtime mutation

### Approval gate packet

Purpose:

- record approval, rejection, hold, reroute, or deferred posture explicitly

Owner repo:

- `dev-jai-nexus` / `CONTROL_THREAD`

Source:

- operator / `CONTROL_THREAD`

Destination:

- `orchestrator-nexus`, client handoff lanes, or back to planning

Minimum fields:

- shared packet fields
- `status`
- `approval_required`
- `authority_boundary`
- `routing_recommendation`

Authority metadata:

- explicit approval state
- bounded to the approved scope only

Approval requirement:

- this packet is the approval record

Evidence relationship:

- may require evidence before closure
- does not itself constitute execution evidence

Non-goals / blocked behaviors:

- open-ended approval without constraints
- retroactive approval inference
- hidden widening of scope

### Dispatch packet

Purpose:

- package dry-run, manual-run, or later separately governed allowlisted
  dispatch instructions

Owner repo:

- `orchestrator-nexus`

Source:

- approved work/approval gate input

Destination:

- `orchestrator-nexus` runner lane or an approved client/tool lane

Minimum fields:

- shared packet fields
- `target_repo`
- `requested_action`
- `constraints`
- `authority_boundary`

Authority metadata:

- no execution unless separately governed
- dispatch target semantics must stay allowlisted

Approval requirement:

- requires prior human approval

Evidence relationship:

- defines expected execution result/evidence return path

Non-goals / blocked behaviors:

- free-form execution
- scheduler authority
- autonomous retries

### Tool/client handoff packet

Purpose:

- transfer approved, scoped work to `vscode-nexus`, `jai-pilot`, `jai-edge`,
  or another approved client/tool lane with explicit user-visible context

Owner repo:

- lane owner receiving the handoff, with grammar anchored in `jai-format`

Source:

- `orchestrator-nexus` or approved control-plane routing

Destination:

- `vscode-nexus`, `jai-pilot`, `jai-edge`, or an approved runner lane

Minimum fields:

- shared packet fields
- `target_repo`
- `constraints`
- `authority_boundary`
- `expected_outputs`

Authority metadata:

- user-approved and scoped only
- no hidden capture

Approval requirement:

- prior human approval plus local user confirmation where client action is
  involved

Evidence relationship:

- defines what execution or observation evidence should be returned

Non-goals / blocked behaviors:

- hidden scraping
- hidden file capture
- credential/session/token capture
- autonomous browser/desktop actions

### Execution result packet

Purpose:

- report the direct result of a bounded tool/client action or observation

Owner repo:

- source lane owner

Source:

- `vscode-nexus`, `jai-pilot`, `jai-edge`, or `orchestrator-nexus`

Destination:

- `orchestrator-nexus` normalization lane or `CONTROL_THREAD` review

Minimum fields:

- shared packet fields
- `status`
- `expected_outputs`
- `failure_classification`

Authority metadata:

- result only
- not approval
- not routing by itself

Approval requirement:

- execution/observation must have been previously approved if required

Evidence relationship:

- precursor to normalized evidence

Non-goals / blocked behaviors:

- claiming global SoT
- silently omitting failure state
- implying remediation authority

### Normalized evidence record

Purpose:

- unify source result/evidence into a consistent review/routing record

Owner repo:

- `orchestrator-nexus` or source lane owner where normalization is
  repo-local and bounded

Source:

- execution result packet, observation output, or bounded source evidence

Destination:

- `CONTROL_THREAD` / `dev-jai-nexus`

Minimum fields:

- shared packet fields
- `routing_recommendation`
- `failure_classification`
- `status`
- `evidence_required`

Authority metadata:

- evidence only
- not global SoT by default
- not execution authority

Approval requirement:

- no additional approval to exist as evidence
- still cannot bypass approval for follow-on execution

Evidence relationship:

- this is the normalized evidence packet for the workflow spine

Non-goals / blocked behaviors:

- promoting evidence to global SoT by default
- skipping provenance
- authorizing remediation or deployment

### Routing recommendation packet

Purpose:

- express the recommended next route from normalized evidence or workflow
  review

Owner repo:

- `orchestrator-nexus` for evidence-driven recommendations
- `dev-jai-nexus` / `CONTROL_THREAD` for control-plane routing posture

Source:

- normalized evidence or control-plane review

Destination:

- `CONTROL_THREAD`, operator view, or next planning seam

Minimum fields:

- shared packet fields
- `routing_recommendation`
- `status`
- `authority_boundary`

Authority metadata:

- routing advice only
- not execution authority

Approval requirement:

- operator/`CONTROL_THREAD` decides whether to accept the route

Evidence relationship:

- should reference the evidence or review basis for the recommendation

Non-goals / blocked behaviors:

- auto-dispatch
- self-approving execution
- hidden priority rewrites

### Passalong packet

Purpose:

- package continuity for the next workflow-role handoff across
  `CONTROL_THREAD`, `ORCHESTRATOR`, `REPO_EXECUTION`, and `EXPLORATION`

Owner repo:

- `dev-jai-nexus`

Source:

- workflow-role handoff author

Destination:

- next workflow-role receiver

Minimum fields:

- must preserve the settled passalong schema fields from
  `.nexus/canon/passalong-schema.yaml`

Authority metadata:

- documentary only
- does not execute work

Approval requirement:

- no special execution approval, but must preserve explicit boundaries

Evidence relationship:

- may include validation/evidence status and routing basis

Non-goals / blocked behaviors:

- treating the passalong as an execution command
- inventing settled canon
- using passalong packaging to widen authority

## Workflow sequence summary

The intended conceptual packet chain is:

1. operator intent packet
2. `jai-format` work packet
3. motion proposal packet
4. council reasoning packet
5. approval gate packet
6. dispatch packet
7. tool/client handoff packet
8. execution result packet
9. normalized evidence record
10. routing recommendation packet
11. passalong packet where continuity handoff is needed

## Shared non-goals

No packet class in this reference authorizes:

- live automation
- scheduler authority
- autonomous execution
- branch/PR automation
- provider/model dispatch implementation
- API/DB behavior
- credential/session capture
- customer data handling
- production/customer workload authority
- deployment/sync/migration authority
- runtime polling
- live telemetry
- control buttons
- remediation controls

## Authority boundary

This reference defines conceptual packet classes only.

It does not:

- implement packet transport
- implement runtime ingestion
- implement execution control
- implement client automation
- authorize cross-repo mutation
