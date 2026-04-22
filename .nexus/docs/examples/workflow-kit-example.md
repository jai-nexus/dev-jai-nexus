Illustrative example only. This file is not a governance record. It does not
establish new canon.

# Workflow Kit Example

This example shows the v0 workflow-kit catalog in practice using fictional names,
placeholder branches, and bounded documentary-only scenarios.

The example preserves:

- role distinctions
- expected artifacts
- sync-back endpoints
- non-goals and keep-out-of-scope constraints

It does not imply automation, dispatch, or runtime control.

---

## Example framing

- program context: fictional canon-maintenance arc for a documentation-only repo
- repo context: one governed repo with settled four-layer coordination canon
- active boundary: no runtime, portal, command-surface, or automation changes

---

## Kit 1 in practice: Normal delivery loop

### Entry condition

A clear documentation seam already exists and does not need exploratory option
shaping before it can be recommended.

### Role chain

`CONTROL_THREAD -> ORCHESTRATOR -> REPO_EXECUTION -> CONTROL_THREAD`

### Required artifacts

- control-thread passalong carrying the current baseline and settled canon
- orchestrator recommendation package for the next bounded seam
- repo-execution artifact chain for motion package, plan, verification, PR
  package, and sync-back

### Optional branches

- `ORCHESTRATOR` may defer the seam if a precondition is missing
- `REPO_EXECUTION` may sync back open work if the seam cannot close cleanly

### Deferred outcomes

If the seam is not launched or not closed, it remains visible in `what remains
open` and returns to the next control-thread cycle.

### Sync-back endpoint

`CONTROL_THREAD`

### Keep-out-of-scope constraints

- the kit does not dispatch the sessions it names
- `ORCHESTRATOR` does not implement the seam
- `REPO_EXECUTION` does not widen into adjacent seams

---

## Kit 2 in practice: Exploration-first loop

### Entry condition

The problem is real, but the next seam is not yet bounded enough for immediate
orchestration or execution.

### Role chain

`CONTROL_THREAD -> EXPLORATION -> ORCHESTRATOR -> REPO_EXECUTION -> CONTROL_THREAD`

### Required artifacts

- control-thread continuity artifact
- exploration framing artifact with an explicit bounded target
- exploration outcome artifact with a recommended direction
- orchestrator recommendation package
- repo-execution artifact chain

### Optional branches

- `EXPLORATION` may return to `CONTROL_THREAD` if the outcome is arc-level
- `ORCHESTRATOR` may still defer if the explored options do not yet yield a safe
  launch seam

### Deferred outcomes

The option set may be useful while still leaving the seam open. In that case the
deferred items stay explicit rather than being treated as execution-ready.

### Sync-back endpoint

`CONTROL_THREAD`

### Keep-out-of-scope constraints

- `EXPLORATION` remains bounded ideation, not execution
- direct `EXPLORATION -> REPO_EXECUTION` would require explicit justification
- exploratory output does not become canon by implication

---

## Kit 3 in practice: Deferred / hold loop

### Entry condition

A seam is recognizable, but the current cycle should not launch it because a
blocking precondition remains unresolved.

### Role chain

Default:

`ORCHESTRATOR -> CONTROL_THREAD`

Alternate hold-registration shape:

`CONTROL_THREAD -> CONTROL_THREAD`

### Required artifacts

- continuity artifact that keeps the blocked seam reconstructable
- explicit note of the blocking condition
- updated open-work record in control-thread continuity

### Optional branches

- a later cycle may return the seam to `ORCHESTRATOR`
- a later cycle may route to `EXPLORATION` if the blocking condition is actually
  an ambiguity problem rather than a pure hold

### Deferred outcomes

The seam remains open, risks remain visible, and no `REPO_EXECUTION` thread is
pretended into existence.

### Sync-back endpoint

`CONTROL_THREAD`

### Keep-out-of-scope constraints

- deferred is not treated as a role
- a hold is not treated as closure
- omission would be a continuity defect, not a valid defer

---

## Kit 4 in practice: Governance-readiness review loop

This loop remains read-only and bounded.

### Entry condition

A control-thread session needs a readiness assessment before deciding whether a
future motion or ratification step should proceed.

### Role chain

`CONTROL_THREAD -> EXPLORATION -> CONTROL_THREAD`

### Required artifacts

- control-thread continuity artifact
- exploration framing artifact with a bounded readiness question
- exploration outcome that records the assessment and remaining risks

### Optional branches

- `CONTROL_THREAD` may defer the decision to a later cycle
- a later cycle may route to `ORCHESTRATOR` if a new seam should be framed next

### Deferred outcomes

The readiness question can remain open without being mistaken for ratification.

### Sync-back endpoint

`CONTROL_THREAD`

### Keep-out-of-scope constraints

- this loop stays on the read-only side of council-run
- no ratification is performed by the example
- no repo-execution launch is implied by the review itself

---

## Example filled kit manifest

```markdown
# Kit Manifest: Normal delivery loop

## Instantiation context

- selecting session role: `CONTROL_THREAD`
- repo or program context: fictional documentation-only canon seam
- date: `2026-04-21`
- reference motion or branch if relevant: `motion-0999`, `example/normal-delivery-loop`

## Selected kit

- selected kit: `normal delivery loop`
- why this kit is being used now: the seam is already bounded and ready for standard governed delivery

## Entry condition

- observed entry condition: a clear documentation seam exists and does not require prior exploration
- why nearby kits were not chosen: no unresolved option space or governance-readiness hold remains

## Role chain

1. `CONTROL_THREAD`
2. `ORCHESTRATOR`
3. `REPO_EXECUTION`
4. `CONTROL_THREAD`

## Required artifacts

- control-thread passalong
- candidate seam comparison, next-motion recommendation, repo-init routing package
- motion package, implementation plan, verification pack, PR package, sync-back

## Optional branches

- `ORCHESTRATOR` may defer if a new blocking condition is discovered
- `REPO_EXECUTION` may sync back open work instead of closure if verification exposes a blocking issue

## Deferred outcomes

- deferred shape: seam stays in `what remains open`
- recording rule: deferral is recorded in control-thread continuity rather than silently omitted

## Sync-back endpoint

- receiving role: `CONTROL_THREAD`
- closure artifact or continuity record: `sync-back record`
- closure condition: bounded work is verified and returned with explicit continuity state

## State carried

| State bucket | How it is carried in this instantiation |
|---|---|
| current baseline | `required` |
| what is settled | `required` |
| what remains open | `required` |
| tasks | `required` |
| risks | `required` |
| routing targets | `required` |
| next prompts | `required` |

## Governance constraints

- no ratification without evidence artifacts
- no scope widening without a new governed motion
- no role boundary is erased by the selected kit

## Keep-out-of-scope constraints

- no automatic routing or dispatch
- no automatic branch, commit, or PR generation
- no runtime or portal mutation
```

---

## What the example demonstrates

The v0 catalog remains bounded to four named kits:

- normal delivery loop
- exploration-first loop
- deferred / hold loop
- governance-readiness review loop

Each kit is a reusable guide built from existing canon. None of the examples
turns the workflow into a controller or substitutes the kit for local session
judgment.
