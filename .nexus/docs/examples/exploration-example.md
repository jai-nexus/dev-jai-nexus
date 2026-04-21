Illustrative example only. This file is not a live governance artifact.

# Exploration Example

This example shows the recurring exploration artifact chain in a bounded,
fictional seam. It is advisory only and does not imply automation, runtime
control, or execution by implication.

---

## Framing and option set

```markdown
# Exploration Artifact

## Current framing

- what is settled:
  - `example-control-thread-model.md` exists
  - `example-orchestrator-model.md` exists
- what triggered this exploration:
  - a bounded coordination gap remains, but the next seam is not yet clear

## Exploration target [REQUIRED]

- bounded target: determine the best bounded documentation seam for an example continuity artifact that sits between exploration and execution

## Constraints

- what cannot change:
  - `portal/**`
  - `.claude/**`
- what is explicitly out of scope:
  - runtime behavior
  - automatic routing

## Evaluation lens

- criteria: boundedness of the seam
- criteria: clarity of the receiving artifact chain
- criteria: low risk of implying automation

## Candidate ideas / options

### Option A - continuity-summary seam

- brief description: add a generic continuity-summary canon artifact
- key assumption: one summary artifact is enough to bridge multiple coordination surfaces

### Option B - exploration-closeout seam

- brief description: add a closeout artifact specifically for bounded exploration outcomes
- key assumption: exploration needs its own explicit close structure before routing

## Tradeoffs

- Option A is broader and more reusable, but it risks becoming too abstract to route cleanly
- Option B is narrower and more actionable, but it may not generalize beyond exploration

## Risks

- Risk: the broader option could blur multiple coordination surfaces
  Mitigation: prefer the option with the clearer receiving boundary
- Risk: the narrower option could overfit one surface
  Mitigation: keep the wording reusable even if the seam is exploration-specific

## Open questions

- should the next seam be framed as a general continuity artifact or an exploration-specific closeout artifact
- does the recommended seam still require orchestrator packaging after exploration closes
```

---

## Outcome and routing

```markdown
# Exploration Outcome

## Recommended direction

- one recommended option: `exploration-closeout seam`
- rationale: it preserves a clear receiving boundary and translates more directly into a bounded next seam

## Deferred ideas

- deferred idea: `continuity-summary seam` - reason: promising, but too broad for the next bounded move

## What becomes active work

- concrete active-work translation: package a candidate seam and next-motion recommendation for an exploration-closeout documentation artifact

## Routing target

- routing target: `ORCHESTRATOR`
- why this target: the exploration narrowed the field, but the next seam still needs recommendation packaging before a repo thread should be launched

## Next prompt

- exact prompt starter: `Package the exploration-closeout seam as the next bounded motion recommendation and keep the work documentation-only.`
```

---

## Outcome separation

Keep these distinctions explicit:

1. recommended direction: the one preferred option
2. deferred ideas: options not pursued now and why
3. routing outcome: which coordination surface should receive the result next

The exploration session closes by recommending and routing. It does not execute the
recommended seam.
