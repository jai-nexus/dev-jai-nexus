# Exploration Model - dev-jai-nexus

## Purpose

This document defines `EXPLORATION` as the bounded ideation and option-shaping
layer for work that is not yet ready to become a recommended seam or an execution
thread.

`EXPLORATION` is a thinking and structuring surface, not an execution surface.
It investigates a bounded question, develops options, and produces an advisory
outcome that can be routed onward without mutating canon, repo state, or runtime
state.

---

## EXPLORATION definition

`EXPLORATION` is the coordination surface used when the next bounded seam is not
yet clear enough to recommend or execute directly.

Its role is to:

- frame a bounded exploration target
- gather and shape candidate options
- compare tradeoffs and risks
- close with a structured advisory outcome

It is therefore:

- bounded ideation
- option shaping
- advisory analysis

It is not:

- execution
- seam selection
- arc governance

`EXPLORATION` does not execute work, create governance state, or silently convert
speculative thinking into active canon.

---

## Distinction from other coordination surfaces

| Surface | Primary focus | Input artifacts | Output artifacts | Scope authority | Forbidden behavior |
|---|---|---|---|---|---|
| `CONTROL_THREAD` | preserve settled continuity and program arc | ratified motions, continuity artifacts, canon docs | arc decisions, continuity state, deferred queues | program arc and cross-session continuity | repo-local execution |
| `ORCHESTRATOR` | recommend the next bounded seam | synced continuity, repo framing, seam candidates | candidate-seam comparison, next-motion recommendation, repo-init routing | one recommended next seam at a time | execution, automatic routing |
| `REPO_EXECUTION` | implement one bounded seam in one repo | motion package, implementation plan, repo-local context | changed files, verification evidence, review packaging, sync-back | one active seam in one repo | ideation in place of execution, scope widening |
| `EXPLORATION` | shape options for a bounded unknown | bounded target, current framing, constraints, evaluation lens | exploration artifact, exploration outcome, advisory routing | bounded ideation within one explicit question | execution, unbounded speculation, silent canon creation |

`EXPLORATION` is therefore distinct from:

- `CONTROL_THREAD`, which governs arc continuity rather than bounded option shaping
- `ORCHESTRATOR`, which recommends one next seam after the choice space is clear
- `REPO_EXECUTION`, which implements after the seam is already bounded

---

## Bounded exploration requirement

A bounded exploration target is required before an exploration session begins.

That target should be:

- explicit
- bounded
- stated in one sentence
- narrow enough to support a finite option set

Sessions without an explicit bounded target are not valid `EXPLORATION` sessions.

Open-ended ideation, unconstrained brainstorming, or indefinite research without a
declared target is outside the scope of this canon.

---

## When exploration is appropriate

`EXPLORATION` is appropriate when:

- a problem is not yet well-defined enough to scope a seam or motion
- multiple viable approaches exist and the right one is unclear
- a new capability area needs investigation before a seam can be identified
- speculative or hypothetical work needs to be contained and evaluated without
  becoming active work by implication

Exploration is useful when the primary need is not implementation, but structured
clarification.

---

## When work should route elsewhere

### Route to `ORCHESTRATOR`

`ORCHESTRATOR` is the default routing target for exploration outcomes.

Route to `ORCHESTRATOR` when:

- exploration narrowed the field but the next seam still needs recommendation
- candidate seams must still be compared
- the outcome must be translated into a bounded next-motion recommendation
- the receiving session should package the next repo-init routing context

This is the normal closeout path for exploration.

### Route directly to `REPO_EXECUTION`

Direct routing to `REPO_EXECUTION` is the exception path.

It is appropriate only when:

- exploration produced a single unambiguous implementation scope
- no seam-selection decision remains
- no additional recommendation packaging is needed

When this exception is used, the exploration outcome must include an explicit
justification stating why `ORCHESTRATOR` is being bypassed.

### Route to `CONTROL_THREAD`

Route to `CONTROL_THREAD` when the outcome is not a seam recommendation or
implementation scope, but an arc-level continuity or governance decision.

---

## Artifact outputs

An exploration session may produce:

- an exploration artifact, which records framing, options, tradeoffs, risks, and
  open questions
- an exploration outcome, which records the recommended direction, deferred ideas,
  what becomes active work, routing target, and next prompt
- a later passalong only if a real receiving session requires handoff packaging

These are advisory artifacts only.

---

## Boundary rules

Exploration artifacts do not:

- execute work
- mutate repo state
- mutate runtime state
- silently become active canon
- replace orchestrator recommendation packaging
- replace repo-execution planning
- initiate motions directly

`EXPLORATION` also does not recur into itself without a new bounded target. If the
current target is exhausted, any further exploration requires a new target rather
than an unbounded continuation.

---

## Relationship to execution roles

`EXPLORATION` is orthogonal to the execution-role taxonomy in `CLAUDE.md`.

A session operating in `EXPLORATION` may still hold an execution role such as:

- `ARCHITECT`
- `BUILDER`
- `VERIFIER`
- `OPERATOR`
- `LIBRARIAN`

Those roles describe work style. `EXPLORATION` describes the coordination surface.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- background orchestration
- automatic routing
- automatic branch creation
- automatic motion-id generation
- repo/runtime mutation
- portal/runtime changes
- open-ended ideation without a bounded target
- direct code or governance mutation

This model is documentary v0 only.
