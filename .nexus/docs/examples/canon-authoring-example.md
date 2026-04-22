Illustrative example only. This file is not a governance record. It does not
establish new canon.

# Canon Authoring Example

This example shows compliant canon authoring in practice using one fictional
model-doc skeleton, one filled canon authoring checklist, and short notes
explaining why the structure is interoperable with the settled corpus.

The example is bounded, documentary, and non-executing.

---

## Example framing

- scenario: fictional canon addition for a documentation-only governance layer
- goal: show authoring shape rather than introduce a new live canon layer
- governing boundary: no runtime, portal, command-surface, or automation changes

---

## Fictional model-doc skeleton

```markdown
# Fictional Intake Notes Model - example-repo

## Purpose

This document defines fictional intake notes for example governance work.

This document applies to control-thread continuity notes and adjacent
documentation-only intake summaries.

This document inherits from `.nexus/docs/workflow-composition-model.md`
(motion-0144) and `.nexus/docs/governance-constraint-stack.md` (motion-0146)
and does not redefine them.

This document is documentary and advisory. It does not execute work, mutate repo
state, or add runtime enforcement.

## Fictional intake-note definition

Fictional intake notes summarize one bounded intake condition before any later
recommendation or execution surface acts on it.

## Continuity treatment

This skeleton uses the inherited continuity ordering from
`.nexus/docs/workflow-composition-model.md` (motion-0144), limited to the items
relevant to this fictional artifact.

- settled canon
  - workflow composition is settled through motion-0144
  - governance constraint stack is settled through motion-0146
- active work
  - in progress under motion-0999: document one fictional intake-note shape
- open questions
  - Open question: should the intake note carry one optional review-owner field?
- deferred ideas
  - Deferred to a later fictional motion if the optional field becomes necessary.
- risks
  - Risk: authors may confuse intake notes with live routing packages.
    Mitigation: keep advisory/non-executing language at the top of the model doc.
- routing targets
  - produces a routing recommendation for `ORCHESTRATOR` when the intake note closes with a bounded seam candidate
- next prompts
  - `Draft a fictional repo-init recommendation using the bounded intake note above.`

## No-touch boundaries

- `portal/**`
- `.claude/**`
- `package.json`
- existing settled canon docs from motions `0140` through `0146`

## Boundary rules

This model does not:

- execute work
- dispatch sessions
- mutate repo state
- mutate runtime state
- override the explicit/manual council-run boundary
- collapse role distinctions

## Non-goals

- no automation
- no controller behavior
- no automatic routing
- no runtime enforcement

## Risks

- Risk: a later example may accidentally redefine workflow composition terms.
  Mitigation: cite the inherited canon layer rather than restating it.
```

---

## Filled canon authoring checklist

```markdown
# Canon Authoring Checklist: Fictional Intake Notes Model

## Artifact context

- artifact type: `model doc`
- scope statement: `applies to control-thread continuity notes and adjacent documentation-only intake summaries`
- motion or governing basis: `motion-0999`
- prior canon inheritance: `.nexus/docs/workflow-composition-model.md (motion-0144)`; `.nexus/docs/governance-constraint-stack.md (motion-0146)`

## Checklist

- [x] artifact type identified
- [x] scope and inheritance stated
- [x] advisory and non-executing status stated
- [x] settled canon cited rather than redefined
- [x] continuity phrasing present where relevant
- [x] active work stays between settled canon and open questions where relevant
- [x] boundary language present where relevant
- [x] non-goals present
- [x] risks present
- [x] routing targets and next prompts present where relevant
- [x] no-touch boundaries present where relevant
- [x] template, example, and filled-artifact distinction preserved
- [x] explicit/manual council-run boundary preserved where relevant

## Notes

- open questions: `none`
- deferred authoring follow-up: `none`
```

---

## Why this is compliant

- artifact differentiation
  - The example uses a fictional model doc and a separate filled checklist. The checklist is not presented as a model doc, template, or enforcement mechanism.
- continuity treatment
  - The fictional model doc keeps `active work` between `settled canon` and `open questions`, and keeps deferred ideas separate from both.
- boundary phrasing
  - The model skeleton uses explicit non-executing language, explicit no-touch boundaries, and the exact `explicit/manual council-run boundary` phrasing.
- cross-layer inheritance
  - The fictional model doc cites `workflow-composition-model.md` and `governance-constraint-stack.md` by path and motion number instead of redefining their terms.
- advisory status
  - The example states that the artifact is documentary and advisory rather than implying linting, gating, or runtime behavior.

---

## Annotation notes

- `Purpose`
  - satisfies the scope and advisory-status convention from `.nexus/docs/canon-authoring-conventions.md`
- `Continuity treatment`
  - satisfies the phrasing canon for settled canon, active work, open questions, deferred ideas, risks, routing targets, and next prompts from `.nexus/docs/canon-authoring-conventions.md`
- `No-touch boundaries`
  - satisfies the explicit no-touch boundary convention from `.nexus/docs/canon-authoring-conventions.md`
- `Boundary rules` and `Non-goals`
  - satisfy the boundary and non-goal conventions from `.nexus/docs/canon-authoring-conventions.md`
- `Filled canon authoring checklist`
  - demonstrates use of the reusable checklist artifact from `.nexus/docs/templates/canon-authoring-checklist-template.md`
