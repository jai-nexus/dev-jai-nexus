Illustrative example only. This file is not a live governance artifact.

# Workflow Composition Example

This example shows a bounded multi-layer workflow across the four coordination
roles. It is advisory only and does not imply automation, runtime dispatch, or
controller behavior.

---

## Normal loop

```text
CONTROL_THREAD -> ORCHESTRATOR -> REPO_EXECUTION -> CONTROL_THREAD
```

Example shape:

- `CONTROL_THREAD`
  - carries forward the current baseline and settled canon for an example seam
- `ORCHESTRATOR`
  - recommends one bounded documentation seam and packages the next-motion framing
- `REPO_EXECUTION`
  - implements the bounded seam, verifies it, and records sync-back
- `CONTROL_THREAD`
  - receives sync-back closure and folds the result into the next continuity cycle

This is the standard loop because it preserves role distinctions and closes back
through continuity rather than through runtime dispatch.

---

## EXPLORATION insertion path

```text
CONTROL_THREAD -> EXPLORATION -> ORCHESTRATOR -> REPO_EXECUTION
```

Example shape:

- `CONTROL_THREAD`
  - surfaces a bounded unknown rather than a ready seam
- `EXPLORATION`
  - compares bounded options and closes with one recommended direction
- `ORCHESTRATOR`
  - translates that direction into a recommended seam and repo-init routing package
- `REPO_EXECUTION`
  - receives the now-bounded seam and performs the local implementation cycle

This is an optional insertion because exploration is not always required before a
seam can be recommended.

---

## Deferred path

Deferred is handled as continuity state, not as a role.

Example deferred outcomes:

- `EXPLORATION -> deferred`
  - exploration produces useful option structure, but no bounded recommendation is ready
- `ORCHESTRATOR -> deferred`
  - candidate seams exist, but none should be launched in the current cycle

In both cases:

- the deferred item remains in `what remains open`
- the deferred item returns to a future `CONTROL_THREAD` cycle
- no role boundary is erased by pretending the deferred item already routed onward

---

## State-carrying continuity

Across the example workflow, the following buckets are preserved:

1. current baseline
2. what is settled
3. what remains open
4. tasks
5. risks
6. routing targets
7. next prompts

Relevant state may be compressed, but not silently dropped. If the receiving
session cannot detect a missing bucket from the passalong, the omission is treated
as a silent drop and continuity must be reconstructed before proceeding.

---

## Filled transition matrix

```markdown
# Transition Matrix

## Current context

- current scenario: bounded documentation seam for an example coordination gap
- relevant repo or program framing: example canon-only workflow
- active boundary: no runtime or command-surface changes

## Involved roles

- `CONTROL_THREAD`
- `ORCHESTRATOR`
- `REPO_EXECUTION`
- `EXPLORATION`

## Normal transitions

- source: `CONTROL_THREAD`
  target: `ORCHESTRATOR`
  why normal here: the next seam is already identifiable enough for recommendation packaging

- source: `ORCHESTRATOR`
  target: `REPO_EXECUTION`
  why normal here: the seam is bounded and ready for local implementation

- source: `REPO_EXECUTION`
  target: `CONTROL_THREAD`
  why normal here: sync-back closes the seam into continuity

## Optional transitions

- source: `CONTROL_THREAD`
  target: `EXPLORATION`
  why optional here: the next seam may still need bounded option shaping

- source: `EXPLORATION`
  target: `ORCHESTRATOR`
  why optional here: exploration narrowed the field but did not eliminate seam-selection packaging

## Discouraged transitions

- source: `REPO_EXECUTION`
  target: `REPO_EXECUTION`
  why discouraged here: chaining execution without seam closure obscures continuity

## Prohibited transitions

- source: `EXPLORATION`
  target: `REPO_EXECUTION`
  why prohibited here: direct execution is invalid unless the exploration outcome explicitly justifies bypassing `ORCHESTRATOR`

## State carried across handoffs

| Handoff | Current baseline | What is settled | What remains open | Tasks | Risks | Routing targets | Next prompts | Notes |
|---|---|---|---|---|---|---|---|---|
| `CONTROL_THREAD -> ORCHESTRATOR` | required | required | required | required | required | required | required | standard seam recommendation handoff |
| `CONTROL_THREAD -> EXPLORATION` | required | required | required | compressed | required | required | required | exploration target must already be bounded |
| `EXPLORATION -> ORCHESTRATOR` | required | compressed | required | required | required | required | required | exploration closes with one recommended direction |
| `ORCHESTRATOR -> REPO_EXECUTION` | required | required | required | required | required | required | required | repo-init package launches a fresh repo thread in documentary form only |
| `REPO_EXECUTION -> CONTROL_THREAD` | required | required | required | compressed | required | required | required | sync-back closes the seam into continuity |

## Governance constraints

- no ratification without evidence artifacts
- no scope widening without a new governed motion
- composition artifacts do not execute work or mutate state
```

---

## Sync-back closure

The example closes only when `REPO_EXECUTION` returns to `CONTROL_THREAD` with
documented continuity state. This keeps closure reconstructable and prevents the
workflow from being treated as a controller.
