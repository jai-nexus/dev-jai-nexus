# Level 2 Patch Plan Template

## Purpose

Provide a reusable non-mutating planning template for Level 2 docs-ops seams.

## When to use

Use only when Level 2 planning output is explicitly authorized and must remain
textual, non-executable, and non-mutating.

## Required inputs

- Level 2 scope
- recommended target theme
- curated context
- provenance references
- active guardrails

## Expected outputs

- patch-plan text
- proposed file list
- PR title/body draft text
- validation recommendations
- reviewer handoff recommendations

## Template

```md
## Patch-plan target

## Proposed target paths (recommendations only)

## Patch-plan phases

## PR draft title

## PR draft body

## Validation plan

## Reviewer handoff
```

## Hard boundaries

- no file writes
- no branch creation
- no PR creation
- no apply-ready patch or diff output

## Related canon

- motions 0174 and 0176
- `.nexus/canon/docs-ops-level-2-patch-plan.yaml`

## Non-authority statement

This template does not grant Level 2 authority and cannot be treated as an
execution or mutation instruction.
