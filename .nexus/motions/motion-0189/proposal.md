# Proposal: Loop Candidate Selection Criteria v0

## Summary

Define deterministic future-selection criteria for operator-loop candidates and
keep those criteria beside the static selected-candidate source model.

The current selected candidate remains `wp-agent-registry-follow-up`.

## Scope

- extend the selected-candidate helper with explicit future-selection criteria
- keep the current selected candidate unchanged
- surface the criteria compactly on root `/`, `/operator/work`,
  `/operator/deliberation`, and the passalong block where useful
- preserve static/local, deterministic, read-only, copy-only, human-gated behavior

## Non-scope

- no provider or model calls
- no runtime execution
- no branch-write authority
- no PR-creation authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no passalong index
- no scoring or ranking engine
- no changes to `/operator/jai`, canonical agent registry, or JAI Palette model

## Expected outcome

Future loop-through candidate selection becomes explicit and repeatable without
adding routing complexity or changing the current selected candidate.
