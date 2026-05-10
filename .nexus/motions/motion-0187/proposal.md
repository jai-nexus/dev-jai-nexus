# Proposal: First Agenda Deliberation Passalong v0

## Summary

Select one existing seeded agenda item as the first official deterministic
loop-through candidate and make that same item visibly traceable across root
`/`, `/operator/work`, `/operator/deliberation`, and the copy-only passalong
block.

The loop must remain read-only, copy-only, and human-gated.

## Scope

- select one existing seeded work packet as the first official loop-through candidate
- expose that candidate on root `/` as part of the operator overview
- mark that candidate on `/operator/work` without hiding the rest of the agenda
- make `/operator/deliberation` and its passalong block reference the same candidate
- preserve deterministic chain coverage through agent, role, repo, surface,
  source seam, requested action, validation gate, human gate, and next routing target

## Non-scope

- no provider or model calls
- no runtime execution
- no branch-write authority
- no PR-creation authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no passalong index
- no changes to `/operator/jai`, canonical agent registry, or JAI Palette model

## Expected outcome

The operator loop becomes visibly provable with one repo-local seeded item,
demonstrating overview -> agenda -> deliberation -> passalong -> CONTROL_THREAD
routing without adding execution or persistence.
