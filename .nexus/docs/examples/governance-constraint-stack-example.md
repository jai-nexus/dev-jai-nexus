Illustrative example only. This file is not a governance record. It does not
establish new canon.

# Governance Constraint Stack Example

This example shows how the governance constraint stack can be referenced across
multiple canon artifacts without implying runtime enforcement, hidden dispatch, or
automatic recovery.

The scenario is fictional and bounded to documentation-only governance work.

---

## Example scenario

- repo context: fictional documentation repo with settled coordination canon
- active seam: one bounded governance-documentation update
- governing boundary: no runtime, portal, command-surface, or automation changes
- continuity expectation: all required state remains reconstructable across the
  example handoffs

---

## Five filled constraint callouts

### Constraint callout: Execution stays bounded to the execution surface

- `constraint class`
  - `Class 1: Governance execution-boundary`

- `binding rule`
  - `Control-thread, orchestrator, exploration, workflow-kit, and governance read-only artifacts do not execute work.`

- `affected layers / artifact domains`
  - `control-thread artifacts`
  - `orchestrator artifacts`
  - `exploration artifacts`
  - `workflow kits`
  - `governance read-only surfaces`

- `prohibited drift`
  - `Do not treat a routing package, kit manifest, example, or review note as authority to execute the seam it describes.`

- `required callout location`
  - `boundary preservation`

- `recovery guidance if omitted or weakened`
  - `Reinsert the callout before relying on the artifact for routing or review, and restate that only the separate repo-execution boundary may perform execution under its own settled governance basis.`

### Constraint callout: Documentary artifacts do not mutate state

- `constraint class`
  - `Class 2: Non-mutation`

- `binding rule`
  - `Passalongs, motion packages, transition matrices, kit manifests, and governance review notes describe state but do not mutate repo or runtime state.`

- `affected layers / artifact domains`
  - `control-thread artifacts`
  - `orchestrator artifacts`
  - `repo-execution artifacts`
  - `exploration artifacts`
  - `workflow kits`
  - `governance read-only surfaces`

- `prohibited drift`
  - `Do not read documentary artifacts as if their presence performs branch creation, commit creation, ratification, or runtime mutation.`

- `required callout location`
  - `keep-out-of-scope constraints`

- `recovery guidance if omitted or weakened`
  - `Restore the callout and re-state the affected artifacts as read artifacts before using them in a planning or review chain.`

### Constraint callout: Guidance does not become controller logic

- `constraint class`
  - `Class 3: Non-automation / non-controller`

- `binding rule`
  - `Workflow kits, routing packages, and model documents may describe next direction but may not dispatch sessions, auto-route work, or turn the workflow into a controller.`

- `affected layers / artifact domains`
  - `control-thread artifacts`
  - `orchestrator artifacts`
  - `repo-execution artifacts`
  - `workflow kits`
  - `governance read-only surfaces`

- `prohibited drift`
  - `Do not reinterpret recommended role chains, routing targets, or next prompts as automatic progression rules.`

- `required callout location`
  - `boundary preservation`

- `recovery guidance if omitted or weakened`
  - `Add the callout back to the affected artifact and require the next session to make its routing decision explicitly rather than by implied automation.`

### Constraint callout: Continuity must remain reconstructable

- `constraint class`
  - `Class 4: Continuity / state-carrying`

- `binding rule`
  - `Relevant continuity state may be compressed for legibility, but it must remain reconstructable and must not be silently dropped.`

- `affected layers / artifact domains`
  - `control-thread artifacts`
  - `orchestrator artifacts`
  - `repo-execution artifacts`
  - `exploration artifacts`
  - `governance read-only surfaces`

- `prohibited drift`
  - `Do not omit required baseline, settled state, open items, tasks, risks, routing targets, or next prompts in a way the receiving session cannot detect.`

- `required callout location`
  - `continuity notes`

- `recovery guidance if omitted or weakened`
  - `Treat the gap as a continuity defect, request state fill, and do not infer the missing state from guesswork.`

### Constraint callout: Non-goals remain binding

- `constraint class`
  - `Class 5: Scope / non-goal preservation`

- `binding rule`
  - `A bounded motion or advisory package does not authorize adjacent seams, deferred work, or governance expansion beyond its explicit scope and non-goals.`

- `affected layers / artifact domains`
  - `control-thread artifacts`
  - `orchestrator artifacts`
  - `repo-execution artifacts`
  - `exploration artifacts`
  - `workflow kits`
  - `governance read-only surfaces`

- `prohibited drift`
  - `Do not treat nearby ideas, deferred items, or future-readiness observations as already in scope.`

- `required callout location`
  - `non-goals`

- `recovery guidance if omitted or weakened`
  - `Restore the scope-preservation callout and split or defer the widened seam until a new governed basis exists.`

---

## Cross-artifact application example

This example applies `Class 3: Non-automation / non-controller` across all six
artifact domains.

- control-thread artifacts
  - A control-thread passalong may name `ORCHESTRATOR` as the next routing target, but it does not auto-launch that session.
- orchestrator artifacts
  - A repo-init routing package may recommend `REPO_EXECUTION`, but it does not dispatch the receiving repo thread.
- repo-execution artifacts
  - A PR package may describe the next review step, but it does not advance the review or merge state by itself.
- exploration artifacts
  - An exploration outcome may recommend a seam, but it does not auto-promote that seam into execution.
- workflow kits
  - A filled kit manifest may describe a role chain, but it remains a reusable guide rather than a controller.
- governance read-only surfaces
  - A governance-readiness review note may recommend waiting or re-framing, but it remains on the read-only side of the explicit/manual council-run boundary.

Role distinctions remain intact throughout:

- `CONTROL_THREAD` preserves continuity
- `ORCHESTRATOR` recommends bounded next direction
- `REPO_EXECUTION` performs bounded local work within its own settled execution boundary
- `EXPLORATION` shapes options without executing them

---

## Motion-package note example

The following shows how constraint callouts can appear inside a fictional motion
package boundary-preservation section.

```markdown
## Boundary preservation

- Constraint callout: Execution stays bounded to the execution surface
  Class 1: Governance execution-boundary
  Binding rule: This motion package frames work but does not execute it.

- Constraint callout: Guidance does not become controller logic
  Class 3: Non-automation / non-controller
  Binding rule: Role-chain references and routing targets in this package do not dispatch sessions.

- Constraint callout: Non-goals remain binding
  Class 5: Scope / non-goal preservation
  Binding rule: Deferred adjacent seams remain out of scope unless a later governed motion brings them in.
```

This usage remains documentary.

It preserves:

- role distinctions
- council-run boundary preservation
- non-mutation and non-controller rules
- continuity expectations for later handoff artifacts
