# Workflow Composition Model - dev-jai-nexus

## Purpose

This document defines workflow composition across `CONTROL_THREAD`,
`ORCHESTRATOR`, `REPO_EXECUTION`, and `EXPLORATION`.

Workflow composition is a cross-layer session sequence. It describes how sessions
relate across coordination layers and what state must survive each handoff. It is
not an execution mechanism, runtime dispatcher, or controller.

---

## Workflow composition definition

Workflow composition is the documentary description of how bounded sessions move
between the four coordination layers:

- `CONTROL_THREAD`
- `ORCHESTRATOR`
- `REPO_EXECUTION`
- `EXPLORATION`

The model answers:

- what transitions are normal
- what transitions are valid but optional
- what transitions are discouraged in practice
- what transitions are prohibited
- what state must travel across the boundary
- what happens when continuity breaks

The model does not dispatch sessions. It describes composition; it does not
perform composition.

---

## Normal operating loop

The normal operating loop is:

1. `CONTROL_THREAD -> ORCHESTRATOR`
   - `CONTROL_THREAD` provides synced continuity state and arc-level framing
   - `ORCHESTRATOR` receives the current baseline and recommends the next bounded seam

2. `ORCHESTRATOR -> REPO_EXECUTION`
   - `ORCHESTRATOR` packages the next seam as a recommendation and repo-init routing package
   - `REPO_EXECUTION` receives a bounded seam and performs the local implementation cycle

3. `REPO_EXECUTION -> CONTROL_THREAD`
   - `REPO_EXECUTION` closes the seam through verification, packaging, and sync-back
   - `CONTROL_THREAD` receives the updated continuity state and folds the seam back into arc context

This loop is the default composition path. It is documentary and cross-session. It
does not imply automatic dispatch.

---

## Transition classes

Transition classes apply only to real role-to-role transitions between the four
coordination layers. Broader governance rules are handled separately in the
governance constraints section.

### Normal transitions

Normal transitions are the expected operating path:

- `CONTROL_THREAD -> ORCHESTRATOR`
- `ORCHESTRATOR -> REPO_EXECUTION`
- `REPO_EXECUTION -> CONTROL_THREAD`

### Optional transitions

Optional transitions are valid insertions or variations that may be needed for a
specific seam:

- `CONTROL_THREAD -> EXPLORATION`
  - when the next seam is not yet well-bounded
- `EXPLORATION -> ORCHESTRATOR`
  - default exploration closeout path
- `EXPLORATION -> CONTROL_THREAD`
  - when the outcome is arc-level rather than seam-level
- `ORCHESTRATOR -> EXPLORATION`
  - when seam selection reveals unresolved ambiguity that must be bounded before recommendation closes
- `EXPLORATION -> REPO_EXECUTION`
  - exception path only; valid only with explicit justification that no seam-selection decision remains

Example optional chain:

- `CONTROL_THREAD -> EXPLORATION -> ORCHESTRATOR -> REPO_EXECUTION`

### Discouraged transitions

Discouraged transitions are technically possible but create recognized continuity
problems:

- `REPO_EXECUTION -> REPO_EXECUTION` without closing the current seam first
- `ORCHESTRATOR -> ORCHESTRATOR` without returning through updated continuity context
- `EXPLORATION -> EXPLORATION` without a new bounded target

Discouraged does not mean prohibited, but it does mean the transition should be
avoided unless the reason is explicit and reviewable.

### Prohibited transitions

Prohibited transitions are explicitly forbidden:

- `EXPLORATION -> REPO_EXECUTION` without the required explicit justification
- `CONTROL_THREAD -> REPO_EXECUTION` as a silent bypass of `ORCHESTRATOR` for a new seam
- any transition that erases the current role boundary by treating one layer as if it were another

Prohibited means the receiving session should not proceed as if the transition were valid.

---

## Deferred handling

Deferred handling is not a transition class because deferred is not a coordination
role. It is an outcome state returned to a future continuity cycle.

Valid deferred examples include:

- `EXPLORATION -> deferred`
  - when the option set is useful but no bounded recommendation is ready
- `ORCHESTRATOR -> deferred`
  - when no candidate seam should be launched in the current cycle

Deferred outcomes should return to a future `CONTROL_THREAD` cycle as open work,
not masquerade as completed transitions.

---

## State-carrying contract

The following seven state buckets must be considered at each handoff:

1. current baseline
2. what is settled
3. what remains open
4. tasks
5. risks
6. routing targets
7. next prompts

### State bucket meanings

- `current baseline`
  - repo, branch, seam context, last commit, working-tree note, and other minimal situational state
- `what is settled`
  - ratified motions, active canon versions, and decisions that should not be re-litigated
- `what remains open`
  - deferred seams, unresolved questions, pending follow-up, and continuity gaps
- `tasks`
  - discrete next actions for the receiving session
- `risks`
  - open risks and mitigations that still matter at receipt time
- `routing targets`
  - which layer should receive next, and why
- `next prompts`
  - exact prompt starters for the receiving session

### Compression and silent-drop rule

Relevant state may be compressed across layers when the receiving session can still
reconstruct the required continuity from the handoff artifact.

Relevant state must not be silently dropped.

An omission is treated as a silent drop when the receiving session cannot detect
the missing state from the passalong.

If compression or omission is documented in a way that makes the gap legible, the
receiving session can request state-bucket fill rather than infer missing context.

The default mechanism for carrying these buckets across sessions is the governed
continuity stack anchored in `.nexus/codex/passalong-schema.md`.

---

## Failure-state guidance

### Missing required state

If a receiving session lacks required state buckets:

- stop and request state-bucket fill
- do not infer or assume the missing state

### Silently dropped state

If the receiving session cannot reconstruct a required state bucket from the
handoff artifact:

- treat the omission as a silent drop
- treat the situation as a baseline recovery event
- route to `CONTROL_THREAD` for continuity reconstruction

### Attempted prohibited transition

If a prohibited transition is attempted:

- do not proceed as though the transition were valid
- route to `CONTROL_THREAD` for an explicit continuity or governance decision

### Recursive mode entry without new boundary

If a mode tries to recur into itself without the required new boundary:

- reject the recurrence
- return to the layer that can re-frame the boundary appropriately

Examples:

- `EXPLORATION -> EXPLORATION` without a new bounded target -> re-frame before continuing
- `REPO_EXECUTION -> REPO_EXECUTION` without seam closure -> close or defer the current seam first

---

## Governance constraints

Governance constraints apply regardless of transition class.

These include:

- no ratification without evidence artifacts
- no scope widening without a new governed motion
- no silent mutation of role semantics
- no bypass of settled boundary rules just because a transition is classified as optional

Transition class describes composition validity. It does not override governance.

---

## Boundary rules

Workflow-composition artifacts do not:

- execute work
- mutate repo state
- mutate runtime state
- erase role boundaries
- turn the workflow into a controller
- turn documentation into dispatch infrastructure

Composition artifacts describe continuity and sequencing. They do not perform the
work they describe.

---

## Relationship to execution roles

Workflow composition is orthogonal to the execution-role taxonomy in `CLAUDE.md`.

The composition chain remains valid regardless of whether the active session is
operating as:

- `ARCHITECT`
- `BUILDER`
- `VERIFIER`
- `OPERATOR`
- `LIBRARIAN`

Execution roles describe work style within a session. Workflow composition
describes cross-layer continuity between sessions.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- background orchestration
- automatic routing
- automatic branch creation
- automatic motion-id generation
- PR generation
- GitHub workflow integration
- repo/runtime mutation
- portal/runtime changes
- new coordination modes
- new execution roles

This model is documentary v0 only.
