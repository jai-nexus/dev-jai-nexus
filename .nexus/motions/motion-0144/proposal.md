# Proposal: JAI Workflow Composition Canon v0

**Motion:** motion-0144
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0143 (JAI Exploration Canon v0)

---

## Current repo framing

Motions 0134–0143 are merged baseline. The four coordination modes are now fully
canonized:

- CONTROL_THREAD — defined in `.nexus/docs/control-thread-model.md` (motion-0140).
  Governs the program arc: ratifies motions, tracks deferred extensions, maintains
  the passalong chain.
- REPO_EXECUTION — defined in `.nexus/docs/repo-execution-model.md` (motion-0141).
  Executes one bounded seam: implements a governed motion, produces artifacts,
  and closes the seam.
- ORCHESTRATOR — defined in `.nexus/docs/orchestrator-model.md` (motion-0142).
  Selects the next bounded seam, packages a next-motion recommendation, and
  produces a routing recommendation for the receiving mode.
- EXPLORATION — defined in `.nexus/docs/exploration-model.md` (motion-0143).
  Investigates a problem space, evaluates options, and produces a structured
  outcome for routing to ORCHESTRATOR, REPO_EXECUTION, or CONTROL_THREAD.

Supporting artifacts: passalong schema v1.1 (`.nexus/codex/passalong-schema.md`,
motion-0140); repo-execution templates (`.nexus/docs/templates/`, motion-0141);
orchestrator templates (`.nexus/docs/templates/`, motion-0142); exploration
templates (`.nexus/docs/templates/`, motion-0143).

---

## Problem

Motions 0140–0143 defined the four coordination modes individually. What is not
yet documented is how they compose: how a multi-session workflow moves through
the modes, what transitions are valid, what state must travel across session
boundaries, and what the failure patterns look like when composition goes wrong.

Four gaps remain:

**1. No canonical workflow composition definition.**
The modes are defined in isolation. There is no document describing the workflow
chain — how CONTROL_THREAD, ORCHESTRATOR, REPO_EXECUTION, and EXPLORATION relate
to each other in sequence, what the normal operating loop looks like, and what
constraints govern the chain as a whole. Without this, each session reconstructs
the inter-mode relationship from scratch.

**2. No canonical transition matrix.**
The routing recommendations produced by ORCHESTRATOR and EXPLORATION sessions
reference target modes, but there is no canonical classification of transition
classes: which transitions are normal (expected), which are optional (valid but
not required), which are discouraged (problematic in practice), and which are
prohibited (explicitly forbidden). Each session determines transition validity ad
hoc.

**3. No canonical state-carrying contract.**
State travels between sessions via passalong documents (passalong-schema.md v1.1).
But which state buckets are required at each transition — current baseline, what
is settled, what remains open, tasks, risks, routing targets, next prompts — is
not specified. State may be silently compressed or dropped without a contract
governing what must survive each boundary crossing.

**4. No canonical failure-state and guidance rules.**
When a transition is attempted without required state, when state is dropped, or
when a prohibited transition is attempted, there are no documented recovery
patterns. Each session improvises.

---

## Solution

### Sub-line A — Workflow composition model doc

Add `.nexus/docs/workflow-composition-model.md` defining:

1. **Workflow composition definition** — The cross-layer session sequence: how
   CONTROL_THREAD, ORCHESTRATOR, REPO_EXECUTION, and EXPLORATION compose into a
   governed workflow. This is a documentation artifact, not an execution mechanism.
   It describes how sessions relate in sequence; it does not dispatch them.

2. **Normal operating loop** — The standard workflow chain:
   CONTROL_THREAD → ORCHESTRATOR → REPO_EXECUTION → CONTROL_THREAD (sync-back).
   Each step in the loop, what it produces, and what the next step receives.

3. **Transition matrix** — Classification of all transition classes:
   - Normal transitions: expected, required for the standard loop
   - Optional transitions: valid insertions into the loop (e.g., inserting
     EXPLORATION between CONTROL_THREAD and ORCHESTRATOR)
   - Discouraged transitions: technically possible but create recognized problems
     (e.g., REPO_EXECUTION → REPO_EXECUTION without closing the current seam)
   - Prohibited transitions: explicitly forbidden mode-to-mode transitions
     (e.g., EXPLORATION → REPO_EXECUTION without the required explicit
     justification — see optional transitions for the valid exception path)

4. **State-carrying contract** — The state buckets that must travel across each
   transition boundary, carried in passalong documents:
   - Current baseline (repo, branch, last commit, working tree)
   - What is settled (ratified motions, active canon versions)
   - What remains open (deferred items, pending seams, open risks)
   - Tasks (discrete next steps for the receiving session)
   - Risks (open risks with mitigations)
   - Routing targets (which mode receives next, and why)
   - Next prompts (exact prompt starters for the receiving session)
   State may be compressed across long chains but must not be silently dropped.
   An omission is treated as a silent drop when the receiving session cannot
   detect it from the passalong. If the compression or omission is documented,
   the receiving session can identify the gap and request state-bucket fill.

5. **Failure-state and guidance rules** — Recovery patterns for composition
   failures:
   - Missing required state: receiving session requests state-bucket fill before
     proceeding; does not infer or assume
   - Silently dropped state: treat as a baseline recovery event; route to
     CONTROL_THREAD for arc-level context reconstruction
   - Attempted prohibited transition: route to CONTROL_THREAD for an explicit
     arc-level decision before proceeding
   - Recursive mode entry (e.g., EXPLORATION without a new bounded target): reject
     and route to ORCHESTRATOR to re-frame the problem

6. **Boundary rules** — What composition artifacts do not do:
   do not execute work, do not mutate repo or runtime state, do not erase role
   boundaries, do not turn the workflow chain into a controller or dispatcher.
   Governance constraints that apply at all transitions regardless of class:
   no ratification without evidence artifacts; no scope widening without a new
   governed motion.

7. **Non-goals** — Automation engine, enforcement infrastructure, runtime graph,
   direct session dispatch.

### Sub-line B — Transition matrix template

Add `.nexus/docs/templates/transition-matrix-template.md` — a standard structure
for sessions documenting their own composition context using the framework defined
in `workflow-composition-model.md`. The template instantiates the canonical
framework; the model doc defines it.
- Source mode
- Target mode
- Transition class (normal | optional | discouraged | prohibited)
- Required state at boundary (list of required state buckets)
- Notes / rationale

### Sub-line C — Workflow composition example

Add `.nexus/docs/examples/workflow-composition-example.md` — an illustrative
example of a multi-layer workflow. Explicitly marked as illustrative only. Uses
fictional references and placeholder values. Covers at minimum:
- A normal loop (CONTROL_THREAD → ORCHESTRATOR → REPO_EXECUTION → CONTROL_THREAD)
- An optional insertion (CONTROL_THREAD → EXPLORATION → ORCHESTRATOR → REPO_EXECUTION)
- A deferred path (ORCHESTRATOR → deferred to future CONTROL_THREAD cycle)
- A filled transition matrix for the example scenario

### Boundary preservation

This motion does not authorize:
- Automation engine or runtime workflow orchestration
- Enforcement infrastructure or runtime transition gates
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0143
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to any existing `.nexus/docs/` documents (including all four
  mode model docs and the passalong schema)

---

## Success criteria

- **SC-1** `.nexus/docs/workflow-composition-model.md` exists and defines:
  workflow composition, normal operating loop, transition matrix (all four classes),
  state-carrying contract (all seven state buckets), failure-state guidance rules,
  boundary rules, non-goals
- **SC-2** `.nexus/docs/templates/transition-matrix-template.md` exists and covers:
  source mode, target mode, transition class, required state at boundary, notes
- **SC-3** `.nexus/docs/examples/workflow-composition-example.md` exists, is marked
  as illustrative only, and covers: normal loop, optional insertion, deferred path,
  and a filled transition matrix
- **SC-4** `validate-motion` passes for motion-0144
- **SC-5** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-6** `pnpm typecheck` passes
- **SC-7** No portal runtime, governance runner, skill prompt, eval fixture,
  existing `.nexus/docs/*.md`, or grid script files modified

---

## Non-goals

- Automation engine or runtime workflow orchestration
- Enforcement infrastructure, runtime transition gates, or session dispatching
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0143
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to existing `.nexus/docs/` documents
- Defining new coordination modes (the four modes are settled canon)
- Defining new execution roles (orthogonality to execution roles is described,
  not extended)
