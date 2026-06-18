# dev.jai.nexus Live-Readiness Staging v0

## Live-Readiness Thesis

Live-ready does not mean live-executing. For this staging branch, live-readiness means the Operator shell exposes the visible structure, route posture, readiness labels, activation blockers, gate requirements, and read-only workflows needed before live activation can be considered.

Commit 1 stages the Operator route topology readiness shell only. It does not promote routes, redirect routes, remove legacy access, redesign navigation, or enable execution.

## Commit 1: Route Topology Readiness Shell

The Operator route topology shell makes existing route relationships legible without deciding them. It uses local static `SYN-*` records and read-only labels only.

Current action posture:

- `READ-ONLY` for route labels, inventories, and relationship cards.
- `GATED` or `BLOCKED` for future or unauthorized capabilities.
- `MANUAL HANDOFF` for any later route decision work.
- `NOT AUTHORIZED IN V0` for execution, dispatch, mutation, promotion, redirect, or navigation redesign.

## Route Relationship Inventory

| Surface | Current role | Commit 1 posture |
| --- | --- | --- |
| `/operator` | Current Operator entry point | Remains the entry route; not replaced. |
| `/operator/control-plane` | Current control-plane route | Remains current route; not redirected. |
| `/operator/live-dashboard` | Prototype/readiness surface | Not promoted to `/operator`. |
| `/operator/council-prototype` | Prototype/readiness surface | Not promoted to `/operator/council`. |
| `/operator/design-system` | Design/reference surface | Remains design/reference. |
| DCT | Existing decision/context tooling surface | Remains available. |
| Legacy nav | Existing global/top navigation posture | Remains available. |

## Route Topology Decisions Deferred

- Should `/operator/live-dashboard` become `/operator`?
- Should `/operator/council-prototype` become `/operator/council`?
- Should `/operator/control-plane` remain, redirect, or become a specialized subsection?
- Should `/operator/design-system` remain in subnav?
- Should DCT remain in subnav?
- Should legacy top nav remain?
- Should phase-clustered navigation be introduced?

## Current Allowed Behavior

- Read-only route relationship cards.
- Page-level role labels for Operator topology surfaces.
- Static `SYN-*` readiness records.
- Conservative fixture/source labeling.
- Non-authorizing explanation copy.
- Existing read-only canonical reads where already accepted by the route.
- Local-only copy behavior only where it already exists and remains visibly labeled `REAL-COMPOSE`.

## Current Blocked Behavior

- Route promotion.
- Route redirects.
- DCT removal.
- Legacy top-nav removal.
- Phase-clustered navigation implementation.
- Navigation redesign.
- Execution, provider/model dispatch, live model calls, Agent execution, GitHub integration, repo mutation, branch creation, PR creation, branch/PR automation, or runtime activation.
- API route, server action, database, Prisma, telemetry, auth/session, localStorage/sessionStorage, `.jai`, `.nexus`, policy enforcement, gate evaluation, receipt creation, canon update, motion-state mutation, or route-state mutation expansion.

## Activation Blockers

- `CONTROL_THREAD` has not decided route topology.
- Execution gates remain closed.
- Step-up verification, if present later, can confirm operator presence only.
- Authentication remains separate from authorization.
- Receipts record; they do not decide.
- Validation is not acceptance.
- Council agreement is not authority.
- Agents are staged, not executing.
- Dashboard display does not authorize.
- Read-only is not authority.
- ZERO GATES GRANTED.

## Non-Authorizations

Commit 1 does not authorize execution, route promotion, route redirect, live runtime behavior, provider/model calls, Agent execution, GitHub automation, repo mutation, customer data handling, production behavior, automatic scoring, automatic synthesis, automatic best-agent selection, automatic gate evaluation, receipt creation, canon update, motion-state mutation, route-state mutation, or opened execution gates.

## Commit 2: JAI / JAI Council Readiness Surfaces

Commit 2 stages read-only and compose-only readiness surfaces for JAI and JAI Council. It does not activate a JAI runtime, Council runtime, provider SDK, model dispatch path, automatic synthesis path, canon merge path, or receipt path.

### JAI Readiness Summary

JAI is not live runtime in v0. The Operator JAI route can show context, guardrails, draft prompt posture, model-slot readiness labels, and activation blockers. It cannot submit prompts, call providers, persist conversations, dispatch Agents, mutate repos, create receipts, update canon, or open execution gates.

Current JAI posture:

- `READ-ONLY` for context and readiness records.
- `REAL-COMPOSE` only for local clipboard handoff drafts.
- `BLOCKED` for model dispatch, live model calls, Agent execution, provider integration, receipt creation, canon update, and runtime activation.
- `MANUAL HANDOFF` for any prompt or Council packet that leaves the interface.

### JAI Council Readiness Summary

JAI Council is advisory only. Council agreement is not authority. Council output can be displayed as claims, dissent, contradictions, unresolved questions, and advisory route recommendations, but it cannot decide, accept, merge, execute, or update canon.

Current Council posture:

- Model-slot records are synthetic `SYN-*` readiness records, not live provider/model state.
- Council session lifecycle examples are fixture/readiness records, not live sessions.
- Synthesis drafts are advisory display, not automatic synthesis.
- CONTROL_THREAD decision drafts are copy-only local text and do not create receipts.

### Model-Slot Readiness Posture

Model-slot readiness is represented as fixture data. Slot labels such as Builder, Challenger, Evidence, or Future JAI describe expected review roles only. They do not imply live provider availability, provider health, model credentials, automatic dispatch, or best-model selection.

Required future posture before activation:

- Provider/model dispatch gate.
- Explicit model-call authorization.
- Source and evidence labeling requirements.
- Dissent and contradiction preservation requirements.
- Receipt requirement for any accepted decision path.
- CONTROL_THREAD decision record before any readiness progression.

### Council Output Boundary

Model-slot output produces claims, not facts. Claims require evidence references and source posture labels before they can be reviewed. Agreement across slots remains advisory. Synthesis is not acceptance. Receipts record; they do not decide. CONTROL_THREAD decides.

Forbidden output behavior in Commit 2:

- Automatic Council dispatch.
- Automatic synthesis.
- Automatic scoring.
- Automatic best-agent or best-model selection.
- Output merge into canon.
- Receipt creation.
- Gate evaluation.
- Motion-state or route-state mutation.

### Dissent And Contradiction Handling

Dissent must remain visible. Contradictions must remain visible. Neither may be hidden by Council agreement, majority posture, synthesis polish, or route recommendation. Contradictions remain open until CONTROL_THREAD records a decision path.

### CONTROL_THREAD Decision Boundary

CONTROL_THREAD decides. Decision copy generated in v0 is local `REAL-COMPOSE` text only. It is not a receipt, not canon, not route-state, not motion-state, and not an execution grant.

### JAI And Council Activation Blockers

- JAI is not live runtime in v0.
- JAI Council is advisory only.
- No provider SDK has been added for Commit 2.
- No model dispatch exists in v0.
- No live model calls exist in v0.
- No automatic Council dispatch exists.
- No automatic synthesis exists.
- No automatic best-agent or best-model selection exists.
- No output merge into canon exists.
- No receipt creation exists.
- No execution gates are opened.
- ZERO GATES GRANTED.

## Commit 3: JAI Agents Readiness Surfaces

Commit 3 stages read-only and compose-only readiness surfaces for JAI Agents. It does not activate an Agent runtime, runner, scheduler, autonomous loop, tool invocation path, terminal action, browser/desktop control, repo write path, branch/PR automation, or execution gate.

### JAI Agents Readiness Summary

Agents are staged, not executing. Agent readiness can be represented as lane candidates, expected artifacts, validation requirements, receipt expectations, rollback requirements, and blocked authority classes. Agent readiness records are local/static `SYN-*` records and must not look like runnable queues or live Agent state.

Current Agent posture:

- `READ-ONLY` for registry, agenda, scope, and readiness records.
- `REAL-COMPOSE` only for local clipboard handoff drafts.
- `GATED` for future lane candidates.
- `BLOCKED` for tool invocation, Agent runners, schedulers, autonomous loops, terminal actions, repo mutation, branch/PR automation, browser/desktop control, receipt creation, canon update, and gate evaluation.
- `MANUAL HANDOFF` for any Agent lane prompt or development-work packet that leaves the interface.

### Agent Lane Candidate Posture

Agent lane candidates do not execute. A lane candidate may describe a possible Builder, Verifier, Docs, or Security role, but it cannot run tools, write files, call terminals, control browsers/desktops, create branches, open PRs, mutate repos, or invoke providers/models.

Each lane candidate should remain visibly bounded by:

- Expected artifact.
- Expected validation.
- Expected receipt requirement.
- Expected rollback requirement.
- Blocked behavior list.
- CONTROL_THREAD decision boundary.

### Blocked Agent Authority Classes

- Tool invocation.
- Agent runner.
- Scheduler.
- Autonomous loop.
- Terminal or command execution.
- Repo mutation.
- Branch creation.
- PR creation.
- Branch/PR automation.
- Browser or desktop control.
- Provider/model dispatch.
- Live model calls.
- Receipt creation.
- Canon update.
- Gate evaluation.

### Expected Artifact / Validation / Receipt / Rollback Model

Expected artifacts are drafts and review packets only. Validation is evidence for operator review and is not acceptance. Receipts record accepted decisions or evidence after the fact; they do not decide and do not grant gates. Rollback requirements must be visible before any future write-capable gate can be considered.

Required future posture before activation:

- Named Agent execution gate.
- Tool invocation gate.
- Repo mutation gate.
- Branch/PR automation gate.
- Terminal/command execution gate.
- Browser/desktop control gate.
- Validation evidence requirements.
- Receipt requirement for accepted changes.
- Rollback plan requirement.
- CONTROL_THREAD decision record.

### Manual Handoff Prompt Posture

Agent handoff prompts in v0 are local `REAL-COMPOSE` text only. They do not submit, dispatch, persist, invoke tools, run Agents, create receipts, update canon, mutate motion-state, mutate route-state, or open gates.

### Agent Execution Blockers

- Agents are staged, not executing.
- Agent lane candidate does not execute.
- No Agent execution authority in v0.
- No repo mutation.
- No browser/desktop control.
- No branch/PR automation.
- No autonomous loop.
- CONTROL_THREAD decides.
- Validation is not acceptance.
- Receipts record; they do not decide.
- ZERO GATES GRANTED.

## Recommended Later Commit Sequence

1. Commit 4: improve read-only compose and manual handoff posture without dispatch.
2. Commit 5: refine prototype/canonical/fixture source posture.
3. Commit 6: consolidate gate/readiness matrix.
4. Commit 7: final live-readiness staging review and closeout, still without activation unless separately authorized.
