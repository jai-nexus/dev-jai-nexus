# Repo Execution Model - dev-jai-nexus

## Purpose

This document defines `REPO_EXECUTION` as the bounded execution surface that acts
inside one repository after work has been routed out of the control thread.

`REPO_EXECUTION` is execution-oriented, but still artifact-first. A valid
repo-execution session is framed by governed artifacts before it is judged by
runtime output, review, or ratification.

---

## REPO_EXECUTION definition

`REPO_EXECUTION` is the coordination surface for one repo, one bounded seam, and
one active change line.

That means:

- one repo: the session acts inside a single repository boundary
- one bounded seam: the session stays inside one coherent change seam rather than
  widening into adjacent capability areas
- one active change line: the session drives one active implementation line at a
  time until that line is verified or explicitly deferred

`REPO_EXECUTION` is execution-oriented because it produces repo-local change,
validation evidence, and review packaging.

It is artifact-first because:

- work is framed through a motion package before widening into implementation
- implementation planning exists before patch closure
- verification evidence exists before ratification
- sync-back exists before handoff is treated as complete

`REPO_EXECUTION` does not:

- widen scope unilaterally
- initiate new motions without routing or governance basis
- mutate cross-repo state
- mutate runtime or portal state unless the active motion explicitly authorizes it
- replace control-thread judgment with local execution momentum

---

## Distinction from other coordination surfaces

| Surface | Primary focus | Inputs | Outputs | Scope authority | Forbidden behavior |
|---|---|---|---|---|---|
| `CONTROL_THREAD` | program continuity and next bounded routing | active motions, canon docs, continuity artifacts | routing decisions, continuity docs, canon framing | program arc and cross-session continuity | direct repo execution |
| `ORCHESTRATOR` | route the next bounded work item inside control-thread scope | current baseline, settled facts, open seams, constraints | bounded next direction, target selection, continuity framing | choosing what should receive next | acting as the repo-local execution thread |
| `REPO_EXECUTION` | bounded implementation inside one repo seam | motion package, implementation plan, repo-local context | changed files, verification pack, PR package, sync-back record | one active seam in one repo | scope widening, automation, controller behavior |
| `EXPLORATION` | reduce ambiguity before bounded work resumes | open questions, partial canon, framing gaps | options, clarifications, recommendations | discovery and framing only | claiming closure or implementation completion |

`REPO_EXECUTION` is therefore distinct from:

- `CONTROL_THREAD`, which preserves continuity above repo-local work
- `ORCHESTRATOR`, which decides what bounded work should happen next
- `EXPLORATION`, which clarifies options before a bounded seam is ready

`OPERATOR` in `CLAUDE.md` remains an execution role, not a separate coordination
surface defined by this document.

---

## Operating principles

### Motion-first

No meaningful repo-execution seam should proceed without a governed motion package
or equivalent governed boundary.

### One bounded seam

Each repo-execution session should stay inside one coherent seam. If new scope is
discovered, it should be deferred, split, or routed rather than silently absorbed.

### One active change line

One session may inspect adjacent context, but it should maintain one active change
line at a time so that planning, verification, review, and rollback remain clear.

### Artifact-first

Repo execution should leave behind structured artifacts that explain what changed,
why it changed, how it was verified, and what remains open.

### Evidence-falsifiable

Outputs must be checkable against acceptance criteria, no-touch boundaries, and
observed verification results. Claims that cannot be checked should not be treated
as closure evidence.

---

## Repo-execution lifecycle

The recurring lifecycle is:

1. `routed in`
   - the seam is routed into `REPO_EXECUTION` from `CONTROL_THREAD` or
     `ORCHESTRATOR`
2. `motion packaged`
   - the bounded problem, scope, non-goals, acceptance criteria, likely touched
     paths, and risks are captured in a motion package
3. `implementation planned`
   - the exact file/path plan, artifact shape, test matrix, commit sequence, and
     defect traps are defined before execution closes
4. `verified`
   - evidence is gathered through validation commands, boundary checks, and
     observed results
5. `PR packaged`
   - the review-facing package is assembled with scope, outputs, evidence, risk,
     and handoff notes
6. `synced back`
   - the session records its completion state in a sync-back structure so that the
     next routing decision is grounded in settled facts

Sync-back is distinct from passalong:

- sync-back: session-internal completion record and completion structure
- passalong: handoff artifact for a later receiving session

Not every repo-execution session requires a passalong. Every closed seam should
still be able to state its sync-back shape.

---

## Artifact chain

A bounded repo-execution seam typically produces the following artifact chain:

- motion package
- implementation plan
- verification pack
- PR package
- sync-back record

These artifacts may live in different files or be embedded in existing governance
files, but the shape should remain explicit.

The artifact chain is documentary. It does not imply:

- automation
- background execution
- automatic commit generation
- automatic PR generation
- automatic branch creation
- controller behavior over repo threads

---

## Allowed outputs

`REPO_EXECUTION` may produce:

- repo-local file changes within the active motion boundary
- implementation planning artifacts
- verification evidence
- review-facing packaging
- sync-back records
- passalongs when a later handoff is actually needed

It may not treat any of those outputs as a substitute for ratification, review, or
control-thread continuity judgment.

---

## Relationship to execution roles

`REPO_EXECUTION` is orthogonal to the execution-role taxonomy in `CLAUDE.md`.

A session inside `REPO_EXECUTION` may operate as:

- `ARCHITECT`
- `BUILDER`
- `VERIFIER`
- `OPERATOR`
- `LIBRARIAN`

Those roles describe what the session is doing within the seam. `REPO_EXECUTION`
describes where the session sits in the broader coordination flow.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- background execution
- automatic commit or PR generation
- automatic branch creation
- GitHub workflow integration
- repo/runtime mutation outside the active motion boundary
- portal or runtime changes by implication

This model is documentary v0 only.
