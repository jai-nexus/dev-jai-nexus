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

## Commit 4: JAI Palette + JAI Grid Readiness Surfaces

Commit 4 stages read-only and compose-only readiness surfaces for JAI Palette and JAI Grid. It does not add a retrieval engine, automatic context injection, customer-data handling, live memory writes, hidden persistence, model dispatch, Agent dispatch, execution, or a live Palette/Grid runtime.

### JAI Palette Readiness Summary

Palette assembles context; it does not authorize. Palette readiness can describe relevant project context, repo context, motion/receipt context, Council context, Agent lane context, retrieval/source posture, freshness, blocked context classes, privacy boundaries, and customer-data boundaries. Palette readiness records are local/static `SYN-*` records unless an existing route already exposes accepted read-only canonical data.

Current Palette posture:

- `READ-ONLY` for context cards and source/freshness labels.
- `REAL-COMPOSE` only for local clipboard context packet drafts.
- `BLOCKED` for retrieval engines, automatic context injection, live memory writes, hidden persistence, customer-data handling, model dispatch, Agent dispatch, receipt creation, canon update, and gate evaluation.
- `MANUAL HANDOFF` for any context packet that leaves the interface.

### JAI Grid Readiness Summary

Grid displays operational state; it does not execute. Grid readiness can describe operational-state maps, project/repo/work relationships, workflow lanes, route queues, motion queues, work queues, capability maps, source posture, and live-readiness blockers. Grid readiness does not authorize routing, scheduling, dispatch, execution, repo mutation, or state mutation.

### Context Assembly Posture

Context selection is not authority. Retrieval is not acceptance. Unknown-source context must not appear canonical. Context cards must carry source and freshness posture labels and must distinguish fixture, derived, read-only canonical, and unknown-source context conservatively.

Relevant context classes:

- Project context.
- Repo context.
- Motion and receipt context.
- Council context.
- Agent lane context.
- Capability and gate context.

### Source / Freshness Posture

Palette and Grid readiness records must label source posture and freshness posture. Fixture snapshots stay marked fixture. Derived displays stay marked derived. Read-only canonical data must be clearly labeled. Unknown-source context must be blocked or conservatively labeled and must never appear canonical.

### Blocked Context Classes

- Unknown-source context as canonical.
- Customer data handling.
- Private memory writes.
- Hidden persistence.
- Automatic context injection.
- Retrieval engine.
- Live memory write.
- Model dispatch.
- Agent dispatch.
- Execution.
- Gate evaluation.
- Canon update.

### Privacy And Customer-Data Boundaries

Customer data is not handled in Commit 4. Private, unknown-source, or customer-origin context remains blocked unless future gates, provenance, privacy review, and receipts are explicitly established. Copy-only context packet drafts must not imply customer-data handling, memory writes, retrieval injection, or persistence.

### Operational-State Map Posture

Operational state maps show relationships and readiness posture only. Dashboard display does not authorize. Route, work, motion, and capability displays are not execution authority and do not mutate route-state, motion-state, canon, receipts, repos, branches, PRs, memory, or gates.

### Route / Work / Motion Queue Readiness Posture

Route queues recommend; they do not execute. Work queues frame review; they do not schedule. Motion queues record posture; they do not accept. Validation is not acceptance. Receipts record; they do not decide. CONTROL_THREAD decides.

### Capability Map Readiness

Capability maps must show capabilities as `READ-ONLY`, `GATED`, `BLOCKED`, `FUTURE`, or `NOT AUTHORIZED IN V0`. Capability display is not a grant. ZERO GATES GRANTED remains the controlling posture.

### Palette And Grid Activation Blockers

- Palette assembles context; it does not authorize.
- Grid displays operational state; it does not execute.
- Context selection is not authority.
- Retrieval is not acceptance.
- Dashboard display does not authorize.
- Unknown-source context must not appear canonical.
- No retrieval engine exists in v0.
- No automatic context injection exists in v0.
- No live memory write exists in v0.
- No hidden persistence exists in v0.
- No customer-data handling exists in v0.
- No model or Agent dispatch exists in v0.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

## Commit 5: Development Work Readiness Surfaces

Commit 5 stages read-only and compose-only readiness surfaces for future development work. It does not authorize GitHub integration, branch creation, PR creation, push, merge, file mutation, repo write, code-generation execution, commit automation, receipt creation, canon update, or execution gates.

### Development Work Readiness Summary

Development-work readiness can represent branch planning, PR description drafting, validation requirements, diff/patch posture, closeout expectations, rollback requirements, and security gates. Development readiness records are local/static `SYN-*` records and must not look like executable workflow state or live GitHub state.

Current development posture:

- `READ-ONLY` for repo/work/project posture and readiness records.
- `REAL-COMPOSE` only for local clipboard branch, PR, validation, and closeout drafts.
- `GATED` for future branch, PR, validation, receipt, rollback, and security gates.
- `BLOCKED` for GitHub API, branch creation, PR creation, push, merge, file mutation, repo write, commit automation, code-generation execution, receipt creation, canon update, and gate evaluation.
- `MANUAL HANDOFF` for any development packet that leaves the interface.

### Branch Planning Readiness

Branch planning may be represented. Branch names may be suggested as copy-only local text. Branch creation is not authorized. Code push is not authorized. Repo mutation is not authorized.

### PR Planning Readiness

PR descriptions may be composed. PR body drafts are local `REAL-COMPOSE` text only. PR creation, branch/PR automation, push, merge, GitHub API usage, and repo mutation remain blocked.

### Validation Requirements

Validation requirements may be displayed or copied as checklists. Validation is not acceptance. Validation output does not create receipts, update canon, open gates, or authorize merge/push/PR behavior.

### GitHub Integration Blockers

- GitHub integration is not authorized.
- GitHub API is not authorized.
- Branch creation is not authorized.
- PR creation is not authorized.
- Code push is not authorized.
- Merge is not authorized.
- Commit automation is not authorized.
- Branch/PR automation is not authorized.

### Diff / Patch Readiness

Diff and patch readiness may describe intended files, review posture, validation expectations, and rollback notes. It must not write files, mutate repos, run code generation, invoke Agents, create commits, or execute terminal commands.

### Receipt / Closeout Expectations

Closeout drafts may be copied locally. Receipt creation is not authorized. Receipts record; they do not decide. CONTROL_THREAD decides whether any later receipt path is valid.

### Rollback / Revert Readiness

Rollback and revert requirements may be represented before any future write-capable gate is considered. Rollback readiness does not execute rollback and does not authorize repo mutation.

### Step-Up And Security Requirements

Authentication is not authorization. Step-up verification confirms operator presence only. Verified session does not open execution gates. Future branch, PR, push, merge, repo write, validation, receipt, rollback, and security gates require explicit CONTROL_THREAD authority.

### Blocked Development Actions

- GitHub API.
- Branch creation.
- PR creation.
- Code push.
- Merge.
- File mutation.
- Repo write.
- Commit automation.
- Branch/PR automation.
- Code-generation execution path.
- Receipt creation.
- Canon update.
- Gate evaluation.
- Provider/model dispatch.
- Agent execution.

### Compose-Only Development Handoff Posture

Compose-only development drafts are local clipboard text only. They do not submit, persist, dispatch, call GitHub APIs, create branches, create PRs, write repos, mutate files, execute code, create receipts, update canon, mutate route-state, or mutate motion-state.

### Required Future Gates And Receipts

Required future posture before development activation:

- GitHub integration gate.
- Branch creation gate.
- PR creation gate.
- Push/merge gate.
- Repo write gate.
- File mutation gate.
- Code-generation execution gate.
- Validation evidence requirement.
- Rollback plan requirement.
- Step-up and security review requirement.
- Receipt requirement after accepted decisions.
- CONTROL_THREAD decision record.

## Recommended Later Commit Sequence

1. Commit 6: consolidate gate/readiness matrix.
2. Commit 7: final live-readiness staging review and closeout, still without activation unless separately authorized.
