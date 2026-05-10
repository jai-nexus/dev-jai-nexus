# Proposal: Loop Candidate Source Hardening v0

## Summary

Harden the static/local selected-candidate helper used by the first
deterministic operator-loop proof so one source model exposes the selected
work-packet id, selection reason, seam, status, routing target, validation
gate, human decision gate, and authority boundary.

The current selected candidate remains `wp-agent-registry-follow-up`.

## Scope

- strengthen `operatorLoopCandidate.ts` into the single source for selected
  loop-through metadata
- preserve the current selected candidate and its repo-local governance-safe posture
- update root `/`, `/operator/work`, `/operator/deliberation`, and the passalong
  block to consume the stronger source fields consistently
- keep everything deterministic, static/local, read-only, and copy-only

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

The first operator-loop proof becomes easier to maintain because selected
candidate labels, gates, and boundary text come from one hardened helper rather
than multiple duplicate local strings.
