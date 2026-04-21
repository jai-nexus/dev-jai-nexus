# Control Thread Model - dev-jai-nexus

## Purpose

This document defines the control thread as the top-level coordination surface for
multi-session work in `dev-jai-nexus`. It exists to keep canon stable, keep active
work legible, and keep repo-thread continuity explicit without introducing any
execution mechanism.

---

## Control thread definition

A control thread is the top-level coordination surface for a program arc.

It does the following:

- preserves canon by anchoring direction in motion packages, repo guidance, and
  other established governance artifacts
- tracks active work by keeping the current motion, branch, and bounded objective
  visible across sessions
- synchronizes repo threads by recording when bounded execution has been brought
  back into canonical continuity
- routes the next bounded work item by naming the next thread type or receiving
  target that should take over

It does not do the following:

- it does not execute work
- it does not mutate repo state
- it does not mutate runtime state
- it does not replace repo-local judgment inside a bounded execution thread
- it does not create controller behavior over repo threads

The control thread is a documentary coordination layer. It is not a runtime,
process manager, queue, or authority service.

---

## Coordination boundaries

The control thread sits above repo-local execution. It frames and synchronizes work,
but it does not perform that work itself.

The boundary is:

- control thread: preserves continuity, names the next bounded objective, and
  keeps the current state legible across sessions
- repo execution thread: interprets the active motion locally, edits the repo,
  runs validation, and produces implementation evidence

This separation prevents passalongs and other continuity artifacts from being read
as commands, automation hooks, or substitutes for local governance judgment.

---

## Routing surfaces and targets

### `CONTROL_THREAD`

`CONTROL_THREAD` is the top-level coordination surface.

Its responsibilities are:

- maintain the current program arc and bounded objective
- preserve settled canon and active constraints
- decide which routing target should receive the next bounded unit of work
- determine whether a repo thread has been synced back into continuity

Its allowed outputs are:

- control-thread canon docs
- passalongs and continuity notes
- routing decisions expressed as documentary direction

Its forbidden behavior is:

- direct execution of repo changes
- direct mutation of runtime or operator surfaces
- automatic routing, task creation, or branch creation

### `ORCHESTRATOR`

`ORCHESTRATOR` is the routing target that operates within the control-thread scope.
It receives continuity state and decides what bounded work should happen next.

Its responsibilities are:

- interpret current baseline, settled facts, open questions, and deferred work
- keep program-level constraints visible
- route the next bounded motion, repo thread, or exploration thread

Its allowed outputs are:

- orchestrator passalongs
- next-direction framing
- bounded routing decisions documented in canon language

Its forbidden behavior is:

- acting as an execution thread
- mutating the repo based on passalong content
- bypassing repo-local motion judgment

### `REPO_EXECUTION`

`REPO_EXECUTION` is the routing target for bounded repo-local implementation or
documentation work.

Its responsibilities are:

- read the active motion and nearby canon
- perform the bounded implementation inside the repo
- run validation appropriate to that bounded change
- report status back through continuity artifacts when the work closes

Its allowed outputs are:

- repo-local file edits
- validation evidence
- dev passalongs that summarize current repo-thread state

Its forbidden behavior is:

- redefining program arc outside the active motion boundary
- treating a passalong as authority to auto-mutate state
- claiming sync-back before the required conditions are met

### `EXPLORATION`

`EXPLORATION` is the routing target for open-ended framing, research, or option
generation when the next bounded implementation slice is not yet clear.

Its responsibilities are:

- surface options, unknowns, and framing gaps
- reduce ambiguity before routing into bounded execution

Its allowed outputs are:

- exploratory notes
- framing summaries
- bounded recommendations for a later motion or repo thread

Its forbidden behavior is:

- claiming implementation completion
- mutating repo or runtime state
- silently converting exploration into governed execution

---

## Relationship to execution roles

The routing surfaces and targets above are not a replacement for the execution-role
taxonomy in `CLAUDE.md`.

The existing execution roles remain:

- `ARCHITECT`
- `BUILDER`
- `VERIFIER`
- `OPERATOR`
- `LIBRARIAN`

Those roles describe what a session is doing inside a bounded work item.
`CONTROL_THREAD`, `ORCHESTRATOR`, `REPO_EXECUTION`, and `EXPLORATION` describe
where that session sits in the broader coordination flow.

A single session may therefore be:

- a `BUILDER` operating inside `REPO_EXECUTION`
- a `LIBRARIAN` operating inside `CONTROL_THREAD`
- a `VERIFIER` operating inside `REPO_EXECUTION`

This orthogonality must remain explicit so that coordination language does not get
mistaken for execution authority.

---

## Sync-back rule

A repo thread is considered synced back to the control thread only when both of the
following conditions are true:

1. the active motion is ratified
2. a passalong has been authored and recorded under `surfaces/chat-context/`

If either condition is missing, the repo thread remains local execution in progress.

Sync-back is a continuity status, not an execution action. It does not reopen the
repo thread, mutate state, or authorize new work by itself.

---

## Continuity artifacts

Passalongs are continuity artifacts. They exist to preserve continuity between
sessions and between surfaces.

They may:

- summarize the current baseline
- distinguish what is settled from what remains open
- record tasks, risks, routing targets, and exact prompt starters
- clarify what should happen next and who should receive the next bounded handoff

They may not:

- execute work
- mutate repo state
- mutate runtime state
- replace repo-local judgment
- replace motion packages, `decision.yaml`, or other canonical governance artifacts
- create controller behavior over repo threads

Continuity artifacts document routing. They do not perform routing.

---

## Non-goals

This model does not authorize:

- automation engines
- background orchestration
- auto-routing
- task runners
- repo mutation based on passalong content
- automatic branch creation
- PR generation
- GitHub workflow integration
- portal runtime mutation
- notifications, telemetry, or collaboration expansion
- controller behavior over repo threads

The model is documentary v0 only.
