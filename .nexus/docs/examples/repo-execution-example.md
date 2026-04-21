Illustrative example only. This file is not a live governance artifact.

# Repo Execution Example

This example shows the recurring repo-execution artifact chain in a bounded,
fictional seam. It is generic on purpose and does not imply automation, background
execution, or automatic review flow.

---

## Motion package shape

```markdown
# Proposal: Example Bounded Documentation Seam

**Motion:** motion-XXXX
**Kind:** builder-proof
**Program:** example-program
**Date:** YYYY-MM-DD
**Basis:** motion-WWWW

## Current repo framing

- repo: `example-repo`
- branch: `sprint/example-bounded-seam`
- current baseline: one existing canon doc, no template set, no example chain

## Problem statement

### Current baseline

The repo has recurring execution work but no canonical template set for bounded
artifact packaging.

### Gap 1 - missing reusable templates

Each session reconstructs planning and verification structure from memory.

## Exact scope

### Sub-line A - model doc

- path: `.nexus/docs/example-model.md`
- change: `new`
- description: define the bounded execution surface

### Sub-line B - template set

- path: `.nexus/docs/templates/`
- change: `new`
- description: add reusable planning and verification templates

## Boundary preservation

- no automation
- no runtime mutation
- no `.claude/**` changes

## Acceptance criteria

- `SC-1` example model doc exists
- `SC-2` template set exists
- `SC-3` validation commands pass

## Likely touched paths

- `.nexus/docs/example-model.md`
- `.nexus/docs/templates/`
- `.nexus/docs/examples/example-chain.md`

## Risks

- Risk: templates may overfit one repo
  Mitigation: use neutral canon language

## Non-goals

- runtime changes
- automation
```

---

## Implementation plan shape

```markdown
## Seam framing

- motion: `motion-XXXX`
- repo: `example-repo`
- branch: `sprint/example-bounded-seam`
- bounded seam: reusable documentation-only artifact packaging

## File / path plan

- `.nexus/docs/example-model.md` - `new` - define the bounded surface
- `.nexus/docs/templates/*.md` - `new` - add reusable templates
- `.nexus/docs/examples/example-chain.md` - `new` - show the chain in practice

## Acceptance-test matrix

| ID | Artifact or boundary | Verification method | Pass condition |
|---|---|---|---|
| V-1 | model doc | manual review | required sections present |
| V-2 | template set | manual review | all planned templates exist |
| V-3 | no-touch boundary | git status check | only planned paths changed |

## Commit-by-commit plan

1. `docs(canon): add example model`
2. `docs(templates): add example template set`
3. `docs(example): add repo execution chain example`
```

---

## Verification pack shape

```markdown
## Validation commands

node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-XXXX/motion.yaml
node portal/scripts/validate-agency.mjs --domain example.domain --repo example-repo
pnpm -C portal typecheck

## Expected evidence

- `.nexus/docs/example-model.md` exists and matches planned sections
- `.nexus/docs/templates/` contains the planned files
- `.nexus/docs/examples/example-chain.md` is marked illustrative only

## No-touch boundaries

git status --short -- .nexus/docs .nexus/motions/motion-XXXX .claude portal package.json

## No-mutation checks

- `motion.yaml` remains `status: open`
- `decision.yaml` remains `status: DRAFT`
```

---

## PR package shape

```markdown
## Role

- coordination mode: `REPO_EXECUTION`
- execution role: `BUILDER`

## Goal

Add a reusable documentation-only artifact chain for bounded repo execution.

## Scope

- `.nexus/docs/example-model.md` - `new`
- `.nexus/docs/templates/*.md` - `new`
- `.nexus/docs/examples/example-chain.md` - `new`

## Outputs

- one model doc
- one template family
- one example chain

## Evidence

- validation commands ran and passed
- no-touch boundaries held

## Risk

- residual risk: template wording may still be too repo-specific

## Notes / handoff

- expand only by later motion if additional artifact families are needed
```

---

## Sync-back shape

```markdown
## Current baseline

- repo: `example-repo`
- branch: `sprint/example-bounded-seam`
- active motion: `motion-XXXX`
- governance status: `DRAFT`

## What is settled

- the model doc landed
- the template set landed
- the example chain landed

## What remains open

- review feedback
- ratification decision

## Tasks

- [ ] review the template wording for overfitting
- [ ] decide whether a passalong is needed

## Risks

- Risk: reviewers may interpret the example as live process
  Mitigation: keep the illustrative marker at the top

## Routing targets

- `ORCHESTRATOR` - if next bounded routing is needed
- `REPO_EXECUTION` - if follow-up edits remain local

## Next chat prompts

- `Review the documentation-only seam for any wording that implies automation.`
- `Prepare the bounded review summary for the example artifact chain.`
```

---

## Recurring chain summary

The recurring repo-execution chain is:

1. motion package
2. implementation plan
3. verification pack
4. PR package
5. sync-back

That chain makes the seam reviewable and falsifiable without implying any automatic
controller, runtime, or workflow behavior.
