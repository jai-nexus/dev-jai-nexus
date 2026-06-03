# CONTROL_THREAD to JAI NEXUS Operating Model Migration Plan v0

## Objective

Plan how the current manual `CONTROL_THREAD` and portfolio-routing workflow
could eventually migrate into JAI NEXUS as a future operator-facing system,
without implementing that system in this slice.

This artifact is docs/plans only. It does not add portal/app code, API/DB
behavior, runtime behavior, live ingestion, passalong auto-ingestion,
validation execution, routing buttons, JAI agent authority, provider/model
dispatch, desktop/browser control, automation, scheduler behavior, branch/PR
automation, autonomous execution, autonomous approval, autonomous merge,
customer data handling, credential/session/token capture, telemetry,
production/customer workload authority, deployment/sync/migration authority,
control buttons, remediation controls, or cross-repo mutation.

## Source baseline

Primary source baseline:

- `docs/reference/CONTROL_THREAD_PORTFOLIO_ROUTING_PROTOCOL_V0.md`

Related settled inputs:

- `dev-jai-nexus` owns Operator Control Plane posture, static visibility,
  approval posture, cross-repo routing, and passalong reconciliation
- `CONTROL_THREAD` portfolio routing now has a docs/reference protocol for
  portfolio batches, lanes, status, dependencies, passalongs, and closeout
- current execution remains manual and repo-local
- JAI Toolchain runtime integration remains not authorized
- `.jai` representation is useful as governed information routing, but
  representation does not imply execution
- JAI substrate/council reasoning may provide critique and recommendations in
  future lanes, but reasoning is not approval
- human approval remains required before routing, dispatch, execution,
  settlement, batch closeout, runtime/API/automation activation, or
  customer/production-facing capability

## Files and artifacts inspected

- `docs/reference/CONTROL_THREAD_PORTFOLIO_ROUTING_PROTOCOL_V0.md`
- `docs/reference/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_REFERENCE_MODEL_V0.md`
- `docs/plans/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_SURFACE_PLANNING_V0.md`
- `docs/plans/JAI_TOOLCHAIN_ACTIVE_CAPABILITY_MAP_V0.md`
- `docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md`
- `docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`
- `docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`
- `docs/reference/STATIC_JAI_CONTEXT_VISIBILITY_REVIEW_V0.md`
- `.nexus/canon/passalong-schema.yaml`
- `.nexus/canon/repo-routing-target-schema.yaml`
- `.nexus/canon/toolchain-integration-readiness-matrix-v0.md`
- `.nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md`
- `.nexus/canon/**`
- `README.md`
- `portal/src/app/page.tsx`
- `portal/src/lib/controlPlane/authorityPosture.ts`
- `portal/src/lib/controlPlane/types.ts`
- `portal/src/lib/controlPlane/**`
- `package.json`
- `portal/package.json`

## Current manual system

The current manual `CONTROL_THREAD` system consists of:

- human-written passalongs
- repo-specific execution chats
- one branch per lane
- PR descriptions and validation summaries
- squash/merge/delete closeout
- manual passalong request
- `CONTROL_THREAD` reconciliation
- manual next-route selection
- authority boundaries preserved by text prompts and repo discipline

The current manual system uses `CONTROL_THREAD` as the cross-repo coordinator.
Repo execution chats own only their assigned repo-local lane. Each lane returns
changed files, validation results, authority posture, residual risks, PR
description, and passalong. `CONTROL_THREAD` then reconciles lane state,
dependency state, and recommended next routing.

The current manual system does not include:

- automatic passalong ingestion
- automatic route selection
- automatic branch creation
- automatic PR creation
- automatic merge
- runtime execution
- live dashboard
- JAI agent approval
- provider/model dispatch
- API/DB-backed routing state
- live repo sync
- automated validation execution
- customer or production workload handling

## Future JAI NEXUS system

Future JAI NEXUS could eventually provide an operator-facing system for:

- portfolio batch planning
- repo lane routing visibility
- passalong intake
- reconciliation
- status visibility
- authority boundaries
- human approval gates
- JAI substrate reasoning summaries
- `.jai` representation of batches and lanes

Conceptually, that future system could include:

- operator-facing portfolio batch planning view
- repo lane status view
- static capability map / status surface
- manual passalong intake surface
- reconciliation checklist
- authority boundary display
- human approval gates
- JAI reasoning summary area
- `.jai` representation of portfolio batches and lanes
- lane status states:
  - `ready_to_route`
  - `in_flight`
  - `blocked`
  - `merged_pending_passalong`
  - `settled`
  - `paused`
  - `held`

Future JAI NEXUS must remain human-governed unless separately authorized. This
plan does not authorize any implementation level beyond planning.

## Operator visibility model

Future static/read-only Operator Control Plane visibility may include:

- current portfolio batch
- lane list
- repo
- branch
- artifact
- scope
- mode
- status
- `depends_on`
- `blocks`
- authority boundary
- validation expected
- passalong required
- passalong received
- reconciliation state
- residual risks
- current recommended next action
- non-authorizations banner

Visibility posture:

- static/read-only first
- manually maintained until later governance exists
- non-interactive unless separately routed
- no live status claims
- no automatic repo sync
- no automatic passalong ingestion
- no automatic validation
- no route dispatch
- no PR automation
- no execution authority
- no JAI agent authority

The visibility must not imply:

- live routing
- live repo sync
- automated status updates
- automatic passalong ingestion
- automatic validation
- PR automation
- execution authority
- agent authority

## What remains manual

The following must remain manual until separately governed:

- route selection
- branch creation
- repo execution
- PR creation
- PR review
- squash/merge/delete
- passalong submission
- passalong reconciliation
- lane settlement
- batch closeout
- next batch decision
- any approval gate
- escalation of blocked lanes
- acceptance of JAI suggestions
- promotion of passalong context into settled baseline

Manual does not mean informal. The manual workflow should keep using explicit
lane scopes, branch names, artifact expectations, validation expectations,
authority boundaries, and passalong requirements.

## What JAI may later assist

JAI may later assist with:

- summarizing passalongs
- identifying missing fields
- checking whether a lane has returned required closeout content
- drafting reconciliation notes
- suggesting whether a lane appears settled, paused, held, or blocked
- proposing next routes
- identifying authority drift risk
- mapping passalongs into `.jai` representations
- comparing batch status against protocol fields
- drafting residual-risk summaries
- drafting batch closeout text

JAI must remain advisory unless separately governed. JAI assistance cannot
replace `CONTROL_THREAD`, human approval, repo-local validation, PR review, or
batch closeout decisions.

## What must not become automated yet

The following must not become automated in this plan:

- route dispatch
- repo mutation
- branch/PR creation
- PR merge
- validation execution
- provider/model dispatch
- desktop/browser actions
- API/DB state mutation
- passalong ingestion from chats without human submission
- runtime job scheduling
- production/customer workload actions
- credential/session/token capture
- telemetry collection
- live dashboard refresh
- control/remediation actions
- lane settlement
- batch closeout
- approval gates

## Migration levels

### Level 0 - Manual chat + passalongs

Current state:

- manual `CONTROL_THREAD` routing
- repo execution chats
- human-written passalongs
- manual passalong request
- manual passalong reconciliation
- manual status interpretation
- one branch per lane
- PR descriptions and validation summaries
- no app/runtime system

Allowed posture:

- text prompts
- repo-local execution within explicit scope
- manual validation commands
- manual PR review and merge
- manual batch closeout

Denied posture:

- app/runtime routing system
- automatic ingestion
- automatic route selection
- automatic branch/PR creation
- automatic merge
- JAI agent approval
- API/DB-backed routing state

### Level 1 - Static reference models

Purpose:

- docs/reference models define batch, lane, status, capability, and authority
  vocabulary.

Allowed posture:

- docs/reference artifacts
- docs/plans artifacts
- manually maintained examples
- vocabulary and field definitions
- static non-authority warnings

Denied posture:

- UI implementation
- ingestion
- runtime behavior
- validation execution
- route dispatch
- automation

### Level 2 - Read-only portfolio status surface

Purpose:

- future static/read-only Operator Control Plane view.

Possible visible content:

- current batch
- lane table
- repo, branch, artifact, scope, mode, status
- dependencies and blockers
- authority boundaries
- validation expected
- passalong and reconciliation state
- residual risks
- recommended next action
- non-authorizations banner

Allowed posture:

- manually maintained static data
- read-only display
- no controls
- no live ingestion

Denied posture:

- live dashboard
- API/DB unless separately governed
- automatic repo sync
- automatic passalong ingestion
- routing buttons
- validation buttons
- remediation controls

### Level 3 - Manual passalong intake form

Purpose:

- future human-entered passalong intake.

Allowed posture:

- explicit human submission
- structured passalong fields
- visible authority boundary fields
- visible validation and residual-risk fields
- human review before reconciliation

Denied posture:

- automatic ingestion from chats or repos
- background repo scanning
- hidden capture
- automatic reconciliation
- automatic settlement
- API/DB behavior unless separately governed

### Level 4 - Assisted reconciliation suggestions

Purpose:

- future JAI-assisted summaries and suggested next routes.

Allowed posture:

- summarize passalongs
- identify missing fields
- flag authority drift
- suggest lane status
- draft reconciliation notes
- propose next routes
- draft batch closeout

Denied posture:

- approve
- route
- merge
- execute
- mutate
- settle lanes autonomously
- close batches autonomously
- bypass human `CONTROL_THREAD`

### Level 5 - Governed JAI Agent participation

Purpose:

- future bounded JAI agent participation after governance.

Allowed posture, if separately governed:

- propose
- classify
- summarize
- critique
- identify missing gates
- compare status to protocol
- assist with `.jai` representation mapping

Denied posture:

- autonomously execute
- approve
- merge
- deploy
- mutate repos
- call providers in production paths
- bypass humans
- capture credentials/session/tokens
- handle customer data
- create branch/PR automation by implication

### Level 6 - Runtime automation

Purpose:

- explicitly deferred and unauthorized runtime automation.

Required before any consideration:

- separate governance
- API/data model
- audit/privacy review
- runtime authority
- validation strategy
- safety constraints
- production/customer boundaries
- credential/session/token handling boundary
- deployment/sync/migration boundary
- human override and rollback policy

Current posture:

- not authorized
- not routed
- not implemented
- not implied by this plan

## Authority boundaries

`CONTROL_THREAD` remains responsible for:

- launching a portfolio batch
- routing a lane
- accepting passalong content as reconciled
- marking a lane settled
- closing a batch
- choosing next routes
- preserving cross-repo dependency state
- escalating blocked lanes

Repo execution chats remain responsible for:

- completing only the assigned repo-local lane
- preserving the routed scope
- reporting files changed, validation, authority posture, risks, PR
  description, and passalong
- avoiding cross-repo mutation
- reporting blocked, held, or paused states instead of widening authority

JAI NEXUS, if later implemented, should initially provide visibility and
structure only. It must not become a routing actor, approval actor, execution
actor, or merge actor unless separate governance explicitly grants that
authority.

## Human approval gates

Human approval remains required for:

- launching a portfolio batch
- routing a lane
- accepting a passalong as reconciled
- marking a lane settled
- closing a batch
- escalating a blocked lane
- approving any runtime/API/automation/agent capability
- approving customer/production-facing capability
- accepting any JAI-assisted recommendation as action
- promoting `.jai` representations into canon or downstream implementation

Approval gate interpretation:

- proposal is not approval
- reasoning is not approval
- representation is not approval
- passalong is not approval
- visibility is not approval
- suggested next route is not approval

## JAI substrate reasoning role

JAI substrate reasoning may later provide:

- council-style critique
- routing recommendation summaries
- missing-gate detection
- authority-boundary checks
- residual-risk summaries
- passalong compression
- batch closeout draft
- lane status critique
- dependency collision warnings

It must not:

- approve itself
- route itself
- execute tasks
- mutate repos
- create PRs
- merge PRs
- call providers/models in production paths
- bypass human approval
- settle lanes
- close batches
- make customer/production decisions

JAI substrate reasoning should be visibly labeled as advisory. Any future
operator surface should keep human decision fields separate from JAI reasoning
fields.

## `.jai` representation role

`.jai` may later represent:

- portfolio batch
- lane
- dependency
- status
- authority boundary
- validation expectation
- passalong requirement
- reconciliation state
- approval gate
- non-authorizations
- residual risks
- recommended next route

Representation role:

- make batch and lane structure durable
- preserve authority metadata
- make dependencies and gates explicit
- support future manual review and advisory summaries
- align with `jai-format` as grammar owner

`.jai` representation must not imply:

- execution
- validation
- parsing runtime
- routing authority
- agent authority
- API/DB persistence
- production readiness
- live ingestion
- automatic route selection
- branch/PR automation

Any future `.jai` portfolio representation should remain documentary unless a
separate route defines grammar, parser, validation, persistence, and authority
boundaries.

## Portfolio batch, lane, passalong, and reconciliation model

Future JAI NEXUS operating model should preserve the current portfolio routing
protocol:

- portfolio batch is a bounded set of repo lanes routed by `CONTROL_THREAD`
  together
- lane is one repo, one branch, one scope, and one expected passalong
- routing target includes expected branch, artifact, validation, authority
  boundary, and return shape
- active lanes should not depend on unmerged output from other active lanes
- every lane returns passalong
- merged lanes are not settled until passalong is reconciled
- paused lanes are intentionally stopped and not failures
- held lanes wait for `CONTROL_THREAD`, human approval, or reconciliation
- blocked lanes require an unblock condition before reroute
- batch closeout follows all lanes settling, pausing, holding, or blocking

Future JAI NEXUS should not collapse these into a single automated state
machine without separate governance. The early migration path should treat the
model as a checklist and display vocabulary.

## Deferred implementation paths

Deferred until separately routed:

- static portfolio status reference model
- static non-app migration checklist
- static/read-only portfolio status surface
- portal/app implementation
- manual passalong intake form
- API/DB-backed passalong state
- assisted reconciliation suggestions
- JAI reasoning summaries in UI
- `.jai` portfolio batch / lane representation draft
- automatic passalong import
- runtime Toolchain integration
- provider/model-backed agent participation
- validation execution
- branch/PR automation
- live dashboard refresh
- scheduler behavior
- customer/production workload paths

## Implementation recommendation

Recommended posture:

- this slice remains docs/plans only
- no portal/app implementation in this branch
- no API/DB or passalong intake implementation
- no JAI agent authorization
- no runtime behavior
- no live ingestion
- no validation execution
- no routing controls
- runtime automation remains Level 6 deferred

Next safe step, if `CONTROL_THREAD` wants to continue:

- create a docs/reference model for the operating model migration
- or create a static non-app migration checklist

Do not proceed directly to:

- portal/app implementation
- API/DB or passalong intake implementation
- JAI agent authorization
- runtime automation
- provider/model dispatch
- branch/PR automation
- customer/production capability

## Explicit forbidden behaviors

This artifact does not authorize:

- portal/app code
- API/DB behavior
- runtime behavior
- live ingestion
- passalong auto-ingestion
- validation execution
- routing buttons
- JAI agent authority
- provider/model dispatch
- desktop/browser control
- automation
- scheduler behavior
- branch/PR automation
- autonomous execution
- autonomous approval
- autonomous merge
- customer data handling
- credential/session/token capture
- telemetry
- production/customer workload authority
- deployment/sync/migration authority
- control buttons
- remediation controls
- cross-repo mutation
- hidden repo sync
- live dashboard refresh

## Residual risks

- migration plan may be mistaken for implementation approval
- assisted reconciliation may be mistaken for autonomous reconciliation
- `.jai` representation may be mistaken for execution semantics
- future UI could imply live status
- passalong intake could drift into automatic ingestion
- JAI summaries could be over-trusted
- human approval gates could be softened by convenience pressure
- runtime automation could be attempted before audit/governance exists
- status fields could be mistaken for live repo state
- manual data could drift if a future static surface is not maintained
- API/DB state could be proposed before privacy and authority review
- agent participation could be overread as agent approval authority

## Recommended next routing

Recommended current decision:

- pause after this migration plan unless `CONTROL_THREAD` wants one more
  docs/reference artifact

Next safe optional route:

- `dev-jai-nexus` CONTROL_THREAD Operating Model Migration Checklist v0

Alternative future routes:

- `dev-jai-nexus` static portfolio status reference model
- `jai-format` `.jai` portfolio batch / lane representation draft
- `audit-nexus` authority/privacy review for passalong intake and assisted
  reconciliation
- `orchestrator-nexus` evidence index / `latest.json` planning
- `jai-vscode` context/work packet handoff boundary
- `jai-pilot` explicit handoff UX boundary

Routing constraint:

- keep Levels 0 and 1 as the active posture unless `CONTROL_THREAD`
  separately routes and approves a higher level
- do not route implementation directly from this plan
- keep Level 6 runtime automation deferred and unauthorized

## Non-authorizations preserved

This plan preserves the following non-authorizations:

- no portal/app code
- no API/DB behavior
- no runtime behavior
- no live ingestion
- no passalong auto-ingestion
- no validation execution
- no routing buttons
- no JAI agent authorization
- no provider/model dispatch
- no desktop/browser control
- no automation
- no scheduler behavior
- no branch/PR automation
- no autonomous execution
- no autonomous approval
- no autonomous merge
- no customer data handling
- no credential/session/token capture
- no telemetry
- no production/customer workload authority
- no deployment/sync/migration authority
- no control buttons
- no remediation controls
