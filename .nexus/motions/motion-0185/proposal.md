# Proposal: Deterministic Deliberation Quality v0

## Summary

Improve `/operator/deliberation` so canonical JAI agents read as credible
deterministic reasoning participants instead of repeating nearly identical
transcript turns.

This motion adds differentiated, role-specific reasoning lenses for canonical
deliberation participants while preserving deterministic, read-only, copy-only
behavior.

## Scope

- inspect and refactor the current deterministic deliberation transcript builder
- add a role/lens model for canonical deliberation participants
- make turn content visibly distinct by role
- add visible turn fields for role lens, evidence basis, confidence,
  recommendation posture, and dissent/caution
- preserve deterministic behavior and non-binding posture

## Non-scope

- no provider or model calls
- no backend runtime or agent execution
- no branch-write authority
- no PR-creation authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no changes to `/operator/jai`, canonical agent registry, or JAI Palette model

## Expected outcome

The deliberation transcript becomes more credible and role-specific while still
remaining deterministic, read-only, advisory-only, and authority-disabled.
