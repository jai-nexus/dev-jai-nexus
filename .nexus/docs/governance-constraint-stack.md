# Governance Constraint Stack - dev-jai-nexus

## Purpose

This document defines the governance constraint stack for JAI NEXUS.

A governance constraint is a cross-cutting rule that states what a coordination
session, continuity artifact, or canon artifact may or may not do inside the
settled governance surface.

The governance constraint stack is a small, bounded, documentary classification of
those recurring rules.

This stack does not introduce new governance rules.

It consolidates cross-cutting constraints that already recur across the settled
canon documents delivered by motions `0140` through `0145`.

This stack is a documentary and advisory canon layer. It is not runtime
enforcement, hidden controller logic, or dispatch infrastructure.

---

## Constraint stack definition

The governance constraint stack is the named set of recurring governance
constraints that apply across:

- control-thread artifacts
- orchestrator artifacts
- repo-execution artifacts
- exploration artifacts
- workflow kits
- governance read-only surfaces

The stack exists so future canon artifacts can reference one coherent set of
constraint classes rather than restating scattered boundary rules from multiple
documents.

The stack therefore:

- names recurring constraints
- classifies them
- shows where they apply
- provides a reusable expression shape for future callouts

The stack does not:

- execute work
- mutate repo state
- mutate runtime state
- add runtime enforcement mechanisms
- override settled governance execution boundaries
- collapse role distinctions

---

## Foundational global workflow constraints

The following global workflow constraints propagate across the full stack.

### Explicit/manual council-run boundary

The explicit/manual council-run boundary is a foundational governance constraint.

It means:

- governance progression remains explicit rather than automatic
- execution authority is not inferred from documentary artifacts
- read-only governance surfaces remain read-only unless an explicitly governed
  process changes that state

This boundary propagates across every constraint class in this document.

No class in the stack may be read as permission to automate council-run,
ratification, execution, mutation, or cross-layer dispatch.

### Settled role-boundary preservation

The settled distinctions between `CONTROL_THREAD`, `ORCHESTRATOR`,
`REPO_EXECUTION`, `EXPLORATION`, workflow kits, and governance read-only surfaces
remain in force.

The stack consolidates rules across those layers. It does not merge them into one
controller surface.

### Documentary status

The stack is documentary and advisory only.

It names constraints so future artifacts can cite them clearly. It does not
evaluate gates, trigger outcomes, or produce runtime enforcement behavior.

---

## Bounded classification

The stack uses one foundational global layer plus five recurring constraint
classes.

### Global workflow constraints

Global workflow constraints are stack-wide constraints that apply across all
artifact domains and all class interpretations.

They include:

- explicit/manual council-run boundary preservation
- settled role-boundary preservation
- documentary-only status for the stack itself

Global workflow constraints are not a substitute for the numbered classes below.
They are the propagation layer that stays in force across all of them.

### Class 1: Governance execution-boundary constraints

Class 1 covers non-execution rules.

Documentary, advisory, continuity, routing, template, example, kit, and read-only
governance artifacts do not execute work.

This class protects the distinction between:

- naming work
- recommending work
- documenting work
- actually executing work

`REPO_EXECUTION` remains the only coordination surface that may perform
repo-local execution, and only through its own settled execution boundary under
the explicit/manual council-run boundary. That exception does not turn
repo-execution artifacts into execution mechanisms.

### Class 2: Non-mutation constraints

Class 2 covers non-mutation rules.

Documentary, advisory, continuity, routing, template, example, kit, and read-only
governance artifacts do not mutate repo state or runtime state.

This class remains separate from Class 1.

A non-executing artifact is not automatically the same thing as a non-mutating
surface, so both rules must stay explicit.

`REPO_EXECUTION` may perform bounded repo-local mutation only within its own
settled execution boundary under the explicit/manual council-run boundary. That
exception does not convert repo-execution artifacts, sync-back artifacts, or
PR-packaging artifacts into mutating surfaces.

### Class 3: Non-automation / non-controller constraints

Class 3 covers rules against controller behavior, hidden dispatch, automatic
routing, automatic workflow progression, and similar automation drift.

Artifacts in this corpus may describe:

- role chains
- transition classes
- workflow kits
- routing targets
- next prompts

They may not:

- dispatch sessions
- auto-route to the next layer
- enforce transition progression
- generate hidden controller behavior
- turn documentation into a scheduler or orchestration runtime

### Class 4: Continuity / state-carrying constraints

Class 4 covers reconstructable continuity across session boundaries.

Required state must remain legible when work moves between layers.

State may be compressed when the receiving session can still reconstruct the
needed continuity.

Relevant state must not be silently dropped.

An omission is treated as a silent drop when the receiving session cannot detect
the missing state from the passalong or nearby continuity artifact.

When that happens:

- the omission is treated as a continuity defect
- the receiving session requests state fill before proceeding
- inference is not treated as a valid substitute for missing required state

### Class 5: Scope / non-goal preservation constraints

Class 5 covers scope preservation and non-goal preservation.

No artifact, session summary, or advisory package may widen the active seam,
expand non-goals by implication, or treat deferred work as already authorized.

This class protects:

- motion boundaries
- no-touch boundaries
- explicit deferred status
- named non-goals
- read-only governance boundaries

If scope must widen, a new governed motion or equally explicit governing basis is
required. Continuity language alone is not enough.

---

## Artifact domains in scope

The stack applies across the following artifact domains:

### Control-thread artifacts

Continuity artifacts, sync-back intake artifacts, and top-level coordination docs
that preserve arc state without executing local work.

### Orchestrator artifacts

Candidate-seam comparisons, next-motion recommendations, repo-init routing
packages, and similar advisory artifacts that package next bounded direction.

### Repo-execution artifacts

Motion packages, implementation plans, verification packs, PR packages, sync-back
records, and related documentary artifacts that frame or explain bounded
repo-execution work.

### Exploration artifacts

Exploration framing artifacts and exploration outcomes that shape options without
executing the seam.

### Workflow kits

Workflow-kit model references and filled kit manifests that describe reusable
cross-layer patterns without dispatching them.

### Governance read-only surfaces

Governance packages, review-readiness materials, examples, templates, model docs,
and other governance-facing artifacts that remain on the explicit/manual
council-run read-only side.

---

## Cross-artifact applicability

The main constraint classes apply across the six artifact domains as follows.

| Constraint class | Control-thread artifacts | Orchestrator artifacts | Repo-execution artifacts | Exploration artifacts | Workflow kits | Governance read-only surfaces |
|---|---|---|---|---|---|---|
| Global workflow constraints | applies | applies | applies | applies | applies | applies |
| Class 1: Governance execution-boundary | applies | applies | applies as documentary artifact rule; does not erase the separate `REPO_EXECUTION` session boundary | applies | applies | applies |
| Class 2: Non-mutation | applies | applies | applies as documentary artifact rule; does not erase the separate `REPO_EXECUTION` session boundary | applies | applies | applies |
| Class 3: Non-automation / non-controller | applies | applies | applies | applies | applies | applies |
| Class 4: Continuity / state-carrying | applies where continuity is handed off | applies where continuity is handed off | applies where continuity is handed off | applies where continuity is handed off | reference-only; kits describe continuity expectations but do not carry state by themselves | applies when the surface preserves or receives continuity state |
| Class 5: Scope / non-goal preservation | applies | applies | applies | applies | applies | applies |

Two points remain explicit:

1. Repo-execution artifacts remain documentary artifacts even when the surrounding
   `REPO_EXECUTION` session may execute or mutate within its own settled boundary.
2. Governance read-only surfaces remain on the read-only side of the
   explicit/manual council-run boundary unless an explicitly governed process says
   otherwise.

---

## Constraint-callout expression

Future canon artifacts may restate a stack constraint using a reusable expression
called a constraint callout.

A filled artifact using that reusable expression is called a `constraint callout`.

Each constraint callout should contain:

- `constraint class`
  - one of: global workflow constraints, Class 1, Class 2, Class 3, Class 4, or
    Class 5
- `binding rule`
  - the exact rule being asserted in the current artifact
- `affected layers / artifact domains`
  - which layers, artifact domains, or session surfaces the rule applies to here
- `prohibited drift`
  - what weakening, reinterpretation, or adjacent misuse must be rejected
- `required callout location`
  - where this callout should appear in the artifact, such as boundary
    preservation, keep-out-of-scope constraints, non-goals, or continuity notes
- `recovery guidance if omitted or weakened`
  - what the receiving or reviewing session should do if the callout is missing,
    blurred, or contradicted

Constraint callouts are reusable expressions.

They do not:

- enforce anything at runtime
- redefine the governance constraint stack
- override the canon documents they reference
- turn an omitted callout into an automatic trigger

---

## Boundary rules

The governance constraint stack does not:

- execute work
- mutate repo state
- mutate runtime state
- add runtime enforcement mechanisms
- add hidden controller logic
- dispatch sessions
- auto-route work
- override settled governance execution boundaries
- collapse role distinctions
- create a replacement governance regime outside motions `0140` through `0145`

The stack names recurring rules. It does not perform those rules.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- background orchestration
- automatic enforcement runtime
- automatic routing
- automatic branch creation
- automatic motion-id generation
- PR generation
- GitHub workflow integration
- repo/runtime mutation
- portal/runtime changes
- new governance rules beyond the settled recurring set
- changes to existing canon docs from motions `0140` through `0145`
- collapse of the settled execution boundary for `REPO_EXECUTION`

This model is documentary v0 only.
