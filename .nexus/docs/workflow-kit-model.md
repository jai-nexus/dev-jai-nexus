# Workflow Kit Model - dev-jai-nexus

## Purpose

This document defines workflow kits in JAI NEXUS.

A workflow kit is a reusable multi-layer package built from already-canonized
roles and already-canonized continuity artifacts. A workflow kit tells a selecting
session which recurring cross-layer pattern applies, which artifacts should be
present, where that pattern may branch, and where continuity closes.

Workflow kits are reusable guides. They are not selectors, dispatchers,
controllers, or execution mechanisms.

The v0 kit catalog is intentionally bounded to four named kits only:

- normal delivery loop
- exploration-first loop
- deferred / hold loop
- governance-readiness review loop

No sub-variants or additional v0 catalog entries are defined here.

---

## Workflow kit definition

A workflow kit is a named, reusable, cross-layer package that bundles:

- an entry condition
- a role chain
- required artifacts
- optional branches
- deferred outcomes
- a sync-back endpoint
- keep-out-of-scope constraints

Each kit is assembled from the existing canon defined in:

- `control-thread-model.md`
- `orchestrator-model.md`
- `repo-execution-model.md`
- `exploration-model.md`
- `workflow-composition-model.md`
- `.nexus/codex/passalong-schema.md`

A selecting session may instantiate one workflow kit when a recurring pattern is
already known. The kit then serves as a documentary guide for that session
sequence.

A workflow kit does not:

- execute work
- mutate repo state
- mutate runtime state
- erase role boundaries
- replace the underlying canon layers
- automate kit selection
- automate workflow progression

---

## Relationship to underlying canon

Workflow kits are downstream of the existing canon layers.

They do not redefine:

- `CONTROL_THREAD`
- `ORCHESTRATOR`
- `REPO_EXECUTION`
- `EXPLORATION`
- the transition classes from `workflow-composition-model.md`
- the seven settled state buckets

Instead, a workflow kit instantiates those settled definitions into one reusable
cross-layer pattern.

If a kit and an underlying canon document appear to disagree, the underlying canon
document wins.

---

## Seven state buckets across the full kit

Every workflow kit carries the same seven state buckets across its handoffs:

1. current baseline
2. what is settled
3. what remains open
4. tasks
5. risks
6. routing targets
7. next prompts

Workflow kits do not define new state buckets.

They inherit the continuity contract from `workflow-composition-model.md` and
apply it across the selected role chain.

For each handoff inside a kit:

- the relevant state buckets must be present
- relevant state may be compressed only when the receiving session can still
  reconstruct the continuity it needs
- relevant state must not be silently dropped

Governance constraints still apply even when a kit compresses continuity state for
legibility.

---

## V0 standard kit catalog

### Kit 1: Normal delivery loop

#### Entry condition

Use this kit when a clear scoped deliverable already exists, the next bounded seam
can be recommended without prior ideation, and the work is ready to move through
the standard governed delivery path.

#### Role chain

`CONTROL_THREAD -> ORCHESTRATOR -> REPO_EXECUTION -> CONTROL_THREAD`

#### Required artifacts

- control-thread continuity artifact using the governed passalong structure
- orchestrator recommendation artifacts:
  - `candidate-seam-template.md`
  - `next-motion-recommendation-template.md`
  - `repo-init-routing-template.md`
- repo-execution artifact chain:
  - `motion-package-template.md`
  - `implementation-plan-template.md`
  - `verification-pack-template.md`
  - `pr-package-template.md`
  - `sync-back-template.md`

#### Optional branches

- `ORCHESTRATOR` may defer instead of launching `REPO_EXECUTION`
- `REPO_EXECUTION` may sync back open work rather than seam closure when the seam
  proves not closable in the current cycle

#### Deferred outcomes

- a candidate seam remains open in control-thread continuity because it was not
  launched
- an execution seam is returned as still-open work rather than treated as closed

#### Sync-back endpoint

`CONTROL_THREAD`

Sync-back closes only when the receiving control-thread session records the
resulting continuity state.

#### Keep-out-of-scope constraints

- `ORCHESTRATOR` remains recommendation-only
- `REPO_EXECUTION` remains one repo, one bounded seam, one active change line
- no automatic routing, branch creation, commit generation, or PR generation

### Kit 2: Exploration-first loop

#### Entry condition

Use this kit when the next seam is not yet bounded enough for direct recommendation
or execution and the first need is structured ideation or option-shaping.

#### Role chain

`CONTROL_THREAD -> EXPLORATION -> ORCHESTRATOR -> REPO_EXECUTION -> CONTROL_THREAD`

#### Required artifacts

- control-thread continuity artifact using the governed passalong structure
- exploration artifacts:
  - `exploration-template.md`
  - `exploration-outcome-template.md`
- orchestrator recommendation artifacts:
  - `candidate-seam-template.md`
  - `next-motion-recommendation-template.md`
  - `repo-init-routing-template.md`
- repo-execution artifact chain:
  - `motion-package-template.md`
  - `implementation-plan-template.md`
  - `verification-pack-template.md`
  - `pr-package-template.md`
  - `sync-back-template.md`

#### Optional branches

- `EXPLORATION` may route back to `CONTROL_THREAD` when the outcome is arc-level
  rather than seam-level
- `EXPLORATION` may route directly to `REPO_EXECUTION` only as an explicit
  exception when no seam-selection decision remains
- `ORCHESTRATOR` may still defer after exploration if no launchable seam is ready

#### Deferred outcomes

- exploration closes with useful option structure but no ready seam
- orchestrator identifies viable candidates but defers launch
- repo execution syncs back open work rather than closure

#### Sync-back endpoint

`CONTROL_THREAD`

The full loop closes only when the bounded seam has either been completed and
synced back or explicitly returned as still open.

#### Keep-out-of-scope constraints

- `EXPLORATION` requires an explicit bounded target before the session begins
- direct `EXPLORATION -> REPO_EXECUTION` remains the exception path and requires
  explicit justification
- no speculative outcome becomes active work by implication

### Kit 3: Deferred / hold loop

#### Entry condition

Use this kit when a seam is identifiable but should not be launched in the current
cycle because of missing preconditions, resource constraints, governance hold, or
similar bounded reasons to keep the work open.

#### Role chain

Default chain:

`ORCHESTRATOR -> CONTROL_THREAD`

Alternate hold-registration shape:

`CONTROL_THREAD -> CONTROL_THREAD`

#### Required artifacts

- continuity artifact or equivalent deferral record that preserves the open seam
- governed passalong structure for the state buckets that remain relevant
- explicit note of why the seam is deferred rather than launched

#### Optional branches

- a hold may originate in `CONTROL_THREAD` without passing through `ORCHESTRATOR`
- a later control-thread cycle may re-route the deferred seam to
  `EXPLORATION` or `ORCHESTRATOR` when the blocking condition changes

#### Deferred outcomes

- the deferred seam remains in `what remains open`
- blocked tasks, risks, and routing targets remain legible for the next cycle
- no transition to `REPO_EXECUTION` occurs in the current cycle

#### Sync-back endpoint

`CONTROL_THREAD`

This kit closes as a continuity update, not as an execution completion. No
repo-execution sync-back is implied.

#### Keep-out-of-scope constraints

- deferred is an outcome state, not a role
- deferral must be explicit and reconstructable rather than silently dropped
- a hold does not count as closure, execution, or ratification

### Kit 4: Governance-readiness review loop

#### Entry condition

Use this kit when an arc-level, read-only readiness check is needed before a
motion-framing or ratification decision should proceed.

#### Role chain

`CONTROL_THREAD -> EXPLORATION -> CONTROL_THREAD`

#### Required artifacts

- control-thread continuity artifact using the governed passalong structure
- exploration artifacts:
  - `exploration-template.md`
  - `exploration-outcome-template.md`
- continuity update recording the readiness outcome

#### Optional branches

- `CONTROL_THREAD` may defer the decision after receiving the readiness outcome
- a later control-thread cycle may route onward to `ORCHESTRATOR` if the review
  establishes that a new bounded seam should be framed next

#### Deferred outcomes

- readiness is still open and remains queued for a later control-thread cycle
- open risks or unanswered governance questions remain explicit rather than
  treated as resolved

#### Sync-back endpoint

`CONTROL_THREAD`

The loop closes when the exploration outcome is folded back into continuity as a
read-only governance-readiness input.

#### Keep-out-of-scope constraints

- this kit stays on the read-only side of council-run
- `EXPLORATION` produces assessment, not ratification
- `ORCHESTRATOR` and `REPO_EXECUTION` are not implied by this kit
- no governance decision is auto-completed by the existence of the review artifact

---

## Kit selection guidance

Use the following matching guidance:

| Situation | Select this kit |
|---|---|
| clear scoped deliverable, bounded seam ready | normal delivery loop |
| unresolved option space, seam not yet bounded | exploration-first loop |
| seam identified but intentionally not launched this cycle | deferred / hold loop |
| read-only readiness check needed before governance decision | governance-readiness review loop |

If more than one kit could apply, the selecting session should record:

- which kit was selected
- the observed entry condition
- why that kit was chosen over the nearby alternatives

That record belongs in the filled kit manifest or the continuity artifact that
references the kit.

---

## Boundary rules

Workflow kits do not:

- execute work
- mutate repo state
- mutate runtime state
- erase role boundaries
- replace the underlying canon layers
- redefine the transition matrix
- automate kit selection
- automate workflow progression
- substitute for governed motions, verification evidence, review, or ratification
- turn the workflow into a controller

Governance constraints still apply across the full package, regardless of which
kit is selected.

That includes:

- no ratification without evidence artifacts
- no scope widening without a new governed motion
- no silent mutation of settled role semantics
- no bypass of keep-out-of-scope constraints because a kit is already named

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- background orchestration
- automatic kit selection
- automatic routing
- automatic branch creation
- automatic motion-id generation
- PR generation
- GitHub workflow integration
- repo/runtime mutation
- portal/runtime changes
- new coordination modes
- new state buckets
- catalog expansion beyond the four named v0 kits

This model is documentary v0 only.
