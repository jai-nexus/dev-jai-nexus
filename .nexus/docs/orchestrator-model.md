# Orchestrator Model - dev-jai-nexus

## Purpose

This document defines `ORCHESTRATOR` as the bounded routing and next-seam
selection layer that sits between synced control-thread continuity and a freshly
routed repo thread.

`ORCHESTRATOR` is a recommendation-packaging surface, not an execution surface.
It compares candidate seams, recommends one bounded seam, frames the next motion,
and packages the opening routing context for the receiving repo thread.

---

## ORCHESTRATOR definition

`ORCHESTRATOR` is the coordination surface that decides what bounded seam should
happen next after synced control-thread state has been received.

Its core responsibilities are:

- receive synced control-thread state as the baseline for the next decision
- compare candidate seams that are actually viable in the current repo context
- recommend one bounded seam at a time
- frame a next-motion recommendation for that seam
- produce a repo-init routing package for the receiving repo thread

`ORCHESTRATOR` is advisory and packaging-oriented.

It does:

- evaluate options
- package recommendations
- clarify bounded next direction
- keep deferrals explicit

It does not:

- execute work
- mutate repo state
- mutate runtime state
- automatically route a session
- automatically create a branch
- automatically generate a motion id
- automatically create a PR
- replace repo-local judgment in the receiving repo thread

---

## Distinction from other coordination surfaces

| Surface | Primary focus | Input artifacts | Output artifacts | Scope authority | Forbidden behavior |
|---|---|---|---|---|---|
| `CONTROL_THREAD` | preserve program continuity and settled canon | ratified motions, continuity artifacts, deferred seams | canon updates, continuity state, arc-level decisions | program arc and cross-session continuity | direct seam execution |
| `ORCHESTRATOR` | compare candidate seams and package the next bounded recommendation | synced control-thread state, settled canon, repo baseline | candidate-seam comparison, next-motion recommendation, repo-init routing package | one recommended next seam at a time | execution, automation, controller behavior |
| `REPO_EXECUTION` | implement one bounded seam in one repo | motion package, implementation plan, repo-local context | changed files, verification pack, PR package, sync-back | one active seam in one repo | scope widening, advisory-only orchestration in place of execution |
| `EXPLORATION` | reduce ambiguity before a bounded seam is recommended or resumed | open questions, partial canon, framing gaps | options, clarifications, research notes | discovery and framing only | claiming closure or launching execution by implication |

`ORCHESTRATOR` is therefore distinct from:

- `CONTROL_THREAD`, which preserves settled continuity above the seam-selection layer
- `REPO_EXECUTION`, which performs the bounded work after the seam is chosen
- `EXPLORATION`, which reduces ambiguity before bounded recommendation or execution is ready

`ORCHESTRATOR` recommends and packages. It does not implement.

---

## Operating constraints

### One recommended seam at a time

An orchestrator session may survey multiple candidate seams, but it should
recommend one seam at a time so that the receiving thread has a single bounded
direction.

### Recommendation, not ratification

An orchestrator session may frame a next-motion recommendation, but it does not
ratify that motion or treat the recommendation as settled governance state.

### Routing, not execution

An orchestrator session may produce a routing package for a receiving repo thread,
but it does not execute for that thread and does not mutate the repo on its behalf.

### Explicit deferral

Candidate seams not recommended should be recorded as explicitly deferred, with a
reason for deferral, so that the recommendation remains falsifiable and reviewable.

### No automation

An orchestrator session does not trigger workflow execution, branch creation,
motion-id allocation, or PR creation. All such actions remain outside the scope of
this canon document.

---

## Orchestrator lifecycle

The recurring orchestrator lifecycle is:

1. `synced control-thread state received`
   - the session begins from settled continuity rather than from local guesswork
2. `candidate seams compared`
   - viable seams are listed, compared, and bounded
3. `one seam recommended`
   - one next seam is selected and alternatives are explicitly deferred
4. `next-motion package framed`
   - the recommended motion shape is documented as an advisory package
5. `repo-init routing package produced`
   - the receiving repo thread is given its initial bounded framing, return shape,
     and keep-out-of-scope constraints

This lifecycle is documentary and advisory. It is not a runtime pipeline.

---

## Artifact outputs

An orchestrator session may produce:

- candidate-seam comparison
- next-motion recommendation
- repo-init routing package
- continuity note or later passalong if a handoff is actually needed

These outputs are packaging artifacts. They do not mutate governance state and do
not substitute for the receiving session's local planning or execution evidence.

---

## Relationship to execution roles

`ORCHESTRATOR` is orthogonal to the execution-role taxonomy in `CLAUDE.md`.

A session operating in `ORCHESTRATOR` may still hold an execution role such as:

- `ARCHITECT`
- `BUILDER`
- `VERIFIER`
- `OPERATOR`
- `LIBRARIAN`

Those roles describe what the session is doing as work style. `ORCHESTRATOR`
describes where the session sits in the broader coordination flow.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- background execution
- automatic routing
- automatic branch creation
- automatic motion-id generation
- PR generation
- GitHub workflow integration
- repo/runtime mutation
- portal/runtime changes

This model is documentary v0 only.
