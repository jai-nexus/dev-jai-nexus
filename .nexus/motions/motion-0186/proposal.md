# Proposal: Deliberation Passalong Block v0

## Summary

Add a deterministic passalong-ready summary block to `/operator/deliberation`
so the current transcript can be handed back to `CONTROL_THREAD` as operationally
useful copy-only material.

The block must reuse the existing deterministic role/lens model and stay
read-only, copy-only, and non-persistent.

## Scope

- add a deterministic passalong summary helper derived from existing
  deliberation transcript data
- render a visible passalong-ready summary block on `/operator/deliberation`
- provide a copy-only textarea with deterministic passalong text
- summarize reviewed seam, participant roles, posture, evidence basis,
  strongest caution, arbiter synthesis, recommended routing target, and
  authority boundary

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

`/operator/deliberation` becomes more operationally useful for
`CONTROL_THREAD` handoff while staying deterministic, local, read-only, and
authority-disabled.
