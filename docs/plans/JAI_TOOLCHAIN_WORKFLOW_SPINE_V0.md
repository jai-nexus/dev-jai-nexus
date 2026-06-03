# JAI Toolchain Workflow Spine v0

## Objective

Define the planning/reference workflow spine for a coordinated JAI Toolchain
flow spanning operator intent, canonical packet shaping, proposal/reasoning,
human approval, dispatch, execution handoff, evidence normalization, routing,
and operator visibility.

This artifact is planning-only and reference-only. It does not authorize
desktop control, live automation, scheduler authority, autonomous execution,
branch/PR automation, provider/model dispatch implementation, API/DB behavior,
credential/session capture, customer data handling, production/customer
workload authority, deployment/sync/migration authority, runtime polling, live
telemetry, or cross-repo mutation.

## Current baseline

- the Edge Runner health workflow proved the first complete safe loop
- `jai-edge` produced a read-only signal
- `orchestrator-nexus` normalized the signal into evidence
- `dev-jai-nexus` displayed the result as a static operator-facing surface
- `CONTROL_THREAD` retained routing and decision authority
- `dev-jai-nexus` is already settled on read-only control-plane visibility,
  passalong routing, and explicit blocked authority posture
- Toolchain runtime integration remains not authorized
- Toolchain events and client payloads are not global SoT by default
- raw JSONL remains ingress evidence only unless separately governed

## Strategic intent

Move from isolated repo capabilities toward one coordinated JAI Toolchain
workflow:

Operator intent
-> `jai-format` packet
-> motion/work proposal
-> agent/council reasoning
-> human approval
-> orchestrator dispatch
-> tool/client execution
-> normalized evidence
-> `CONTROL_THREAD` routing
-> `dev-jai-nexus` visibility

The goal is coordination, not immediate automation. The workflow spine should
make role boundaries, packet boundaries, approval gates, and evidence handling
explicit before any implementation authority is considered.

## Workflow sequence

### Step 1 - Operator intent

- source: human operator / `CONTROL_THREAD`
- output: initial operator intent, task objective, boundary facts, success
  posture
- authority: intent only; no execution

### Step 2 - `jai-format` packet

- source: `dev-jai-nexus` or an approved client surface
- owner grammar: `jai-format`
- output: canonical work packet with scope, constraints, authority metadata,
  expected evidence, and expected outputs
- authority: packaging only; not approval and not execution

### Step 3 - Motion/work proposal

- source: `dev-jai-nexus` using shared `jai` semantics
- output: motion proposal packet or work packet for review
- authority: proposal only; no dispatch authority

### Step 4 - Agent/council reasoning

- owner semantics: `jai`
- output: reasoning, recommendation, critique, failure classification, or
  routing advice
- authority: cannot approve itself and cannot execute

### Step 5 - Human approval

- owner: `CONTROL_THREAD` / operator
- output: approval, rejection, hold, reroute, or request for clarification
- authority: required before dispatch or execution handoff

### Step 6 - Orchestrator dispatch

- owner: `orchestrator-nexus`
- output: dry-run dispatch packet, manual runner package, or later allowlisted
  dispatch packet if separately governed
- authority: no execution unless separately and explicitly governed

### Step 7 - Tool/client execution or handoff

- possible lanes: `jai-vscode`, `jai-pilot`, `jai-edge`,
  `orchestrator-nexus`
- output: execution result packet, user-confirmed handoff, or read-only local
  evidence
- authority: user-approved and scoped only; no hidden capture or autonomous
  action

### Step 8 - Normalized evidence

- owner: `orchestrator-nexus` or the source lane owner depending on the seam
- output: normalized evidence record with classification, authority metadata,
  and routing recommendation
- authority: evidence only; not execution authority and not global SoT by
  default

### Step 9 - `CONTROL_THREAD` routing

- owner: `dev-jai-nexus` / `CONTROL_THREAD`
- output: status update, passalong, next route, hold, escalation, or deferred
  route
- authority: routing only; routing recommendation is not execution authority

### Step 10 - `dev-jai-nexus` visibility

- output: operator-facing status, queue posture, approval posture, dispatcher
  visibility, and evidence status
- authority: static/read-only unless separately governed

## Repo role map summary

- `dev-jai-nexus` owns Operator Control Plane visibility, motion/work queue
  posture, approval posture, dispatcher visibility, cross-repo routing, and
  operator-facing evidence/status visibility
- `jai-format` should become the canonical grammar owner for workflow packets,
  authority metadata, approval gates, evidence records, routing
  recommendations, failure classifications, and passalongs
- `jai` owns substrate/council/motion semantics and agent/council reasoning
  semantics
- `orchestrator-nexus` owns dry-run/manual runner packaging, evidence
  normalization, and dispatch target semantics within approved authority
- `jai-edge` remains a private Edge Runner / local evidence node for read-only
  local observation
- `jai-vscode` / JAI for VS Code is the IDE-side Toolchain client and
  explicit repo-context handoff surface
- `jai-pilot` is the browser/desktop-side Toolchain client and explicit
  user-approved handoff surface
- `api-nexus` is the future packet/event interface boundary, not a global SoT
  by default
- `audit-nexus` owns privacy/security/authority review posture, not execution
  authority
- `docs-nexus` owns canon/source-intelligence documentation, not runtime or
  product state

The detailed role map is defined in
`docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`.

## Packet flow summary

The coordinated workflow should use conceptual packet classes rather than
repo-specific ad hoc payloads.

Required packet classes for this spine:

- operator intent packet
- `jai-format` work packet
- motion proposal packet
- council reasoning packet
- approval gate packet
- dispatch packet
- tool/client handoff packet
- execution result packet
- normalized evidence record
- routing recommendation packet
- passalong packet

The detailed packet reference is defined in
`docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`.

## Motion proposal role

The motion/work proposal layer should:

- convert operator intent into reviewable bounded work
- preserve scope, constraints, and expected evidence
- remain proposal-only until human approval
- stay portable across client, orchestrator, and control-plane lanes

The motion proposal layer must not:

- self-approve
- trigger dispatch by implication
- widen authority from proposal wording alone

## Agent dispatcher role

The dispatcher may:

- propose work
- classify requests
- package work
- route work
- summarize evidence
- recommend next actions
- identify missing gates

The dispatcher must not:

- autonomously execute desktop actions
- approve motions
- create PRs
- merge PRs
- deploy
- sync
- mutate runtime
- bypass human approval
- capture credentials/session/tokens
- call providers/models in production paths unless separately authorized
- collect customer data

## `jai-format` role

`jai-format` should mature into the shared grammar for:

- motion packets
- work packets
- agent dispatch packets
- evidence records
- approval gates
- authority boundaries
- routing recommendations
- failure classifications
- passalongs

Minimum conceptual fields for the shared packet vocabulary should include:

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

## `jai-pilot` role

`jai-pilot` should mature toward:

- an explicit user-approved browser/desktop handoff surface
- visible context selection
- visible action preview
- handoff packet creation
- user confirmation before any browser/desktop action

`jai-pilot` must not:

- perform hidden scraping
- capture credentials/session/tokens
- add hidden telemetry
- perform autonomous browser/desktop actions
- collect customer data
- bypass user approval

## `jai-vscode` / JAI for VS Code role

`jai-vscode` should mature as JAI for VS Code:

- an IDE-side packet/repo-context review surface
- a repo-context bridge
- a user-approved context handoff surface
- an explicit file inclusion surface
- a work packet preview surface

`jai-vscode` must preserve:

- file/context inclusion remains explicit and user-visible
- agent controls remain disabled unless explicitly authorized
- no hidden file capture
- no global SoT authority
- no autonomous repo mutation

## `orchestrator-nexus` role

`orchestrator-nexus` should be the dispatch/evidence bridge for this workflow:

- dry-run runner owner
- manual runner owner
- dispatch packet interpreter within approved boundaries
- normalized evidence record owner where cross-lane evidence must be unified
- routing recommendation vocabulary owner for dispatch/evidence seams

`orchestrator-nexus` must not execute outside approved authority and must not
be treated as automatically authorized merely because a packet is well-formed.

## `dev-jai-nexus` control-plane role

`dev-jai-nexus` / `CONTROL_THREAD` should remain responsible for:

- operator visibility
- queue and approval posture
- dispatcher visibility
- cross-repo routing
- interpretation of normalized evidence
- passalong packaging and next-route selection

`dev-jai-nexus` does not become:

- the execution engine
- the runtime dispatcher
- the packet grammar owner
- the product implementation owner for other repos
- the customer-data persistence owner

## Human approval gates

Human approval remains mandatory before dispatch or execution handoff.

Required approval principles:

- proposal is not approval
- reasoning is not approval
- dispatch recommendation is not approval
- routing recommendation is not execution authority
- execution evidence is not retroactive approval
- allowlisted execution, if ever routed later, still requires explicit
  governance

## Evidence flow

The evidence flow for the workflow spine should be:

1. source lane produces execution result, handoff result, or read-only
   observation
2. result is shaped into an execution result packet or source evidence packet
3. `orchestrator-nexus` or the lane owner normalizes that result where needed
4. normalized evidence carries classification and routing recommendation
5. `CONTROL_THREAD` interprets the evidence and decides the next route
6. `dev-jai-nexus` shows static/read-only operator-facing visibility

Evidence rules:

- evidence record is not global SoT unless separately governed
- client event is not global SoT by default
- raw JSONL is ingress evidence only unless separately governed
- normalized evidence informs routing, not autonomous execution

## Authority boundaries

The workflow spine preserves these boundaries:

- human approval required before dispatch/execution
- proposal is not approval
- reasoning is not approval
- routing recommendation is not execution authority
- evidence record is not global SoT unless separately governed
- client event is not global SoT by default
- raw JSONL is ingress evidence only unless separately governed
- local devices are private workflow acceleration only
- customer production infrastructure requires separate planning and approval

## Blocked behaviors

This workflow spine does not authorize:

- desktop control implementation
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
- external repo mutation
- live runtime calls
- runtime polling
- live telemetry
- control buttons
- remediation controls

## First safe implementation seams

Recommended safe next seams:

- `jai-format` packet schema draft v0
- `dev-jai-nexus` static packet-flow visibility reference
- `jai-vscode` user-approved context handoff boundary
- `jai-pilot` explicit handoff UX boundary
- `orchestrator-nexus` dispatch packet dry-run schema
- `audit-nexus` authority/privacy review for packet payloads

Do not route first to:

- desktop control implementation
- browser automation
- provider/model dispatch
- runtime Toolchain integration
- live API/DB implementation
- branch/PR automation
- scheduler/runner authority

## Next routing decisions

Preferred next route after this planning package:

- `jai-format` canonical workflow packet grammar v0

Alternative valid next routes:

- `dev-jai-nexus` static packet-flow visibility reference
- `jai-vscode` context handoff boundary
- `jai-pilot` explicit handoff UX boundary
- `audit-nexus` packet payload privacy/security review
- `orchestrator-nexus` dispatch packet dry-run schema

Recommended sequencing:

1. `jai-format` packet grammar v0
2. `orchestrator-nexus` dispatch/evidence dry-run schema alignment
3. `jai-vscode` and `jai-pilot` explicit handoff boundaries
4. `dev-jai-nexus` visibility/reference follow-up for operator surfaces

## Residual risks

- packet vocabulary may drift across repos before `jai-format` canon is settled
- proposal, reasoning, approval, and dispatch semantics may be conflated if
  packet classes are weakly separated
- client lanes may over-collect context unless explicit inclusion rules stay
  visible and enforceable
- normalized evidence may be mistaken for global SoT if provenance and
  authority metadata are weak
- dispatcher language may be overread as execution authority if approval gates
  are not kept explicit
- future implementation pressure may skip safe dry-run seams and push toward
  premature runtime integration

## Authority boundary

This artifact is planning-only and reference-only.

It does not:

- authorize execution
- authorize runtime integration
- authorize client automation
- authorize provider/model dispatch
- authorize packet ingestion runtime behavior
- authorize branch/PR automation
- authorize cross-repo mutation
- authorize customer-serving behavior
