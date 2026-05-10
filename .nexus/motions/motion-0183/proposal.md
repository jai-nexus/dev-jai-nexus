# Proposal: Deterministic Agent Activation Agenda v0

## Summary

Upgrade `/operator/work` into a deterministic agent activation agenda for
`dev.jai.nexus` so every agenda item resolves:

- assigned JAI Agent
- canonical role mapping
- target repo
- target surface
- source motion or control-thread seam
- requested action
- validation gates
- human decision

The surface remains draft-only, read-only, and authority-disabled. No live
agent runtime or repository mutation path is introduced.

## Scope

- extend draft work packet metadata with agenda status, source seam, and next
  prompt/passalong target
- add a composition-layer agenda model over existing draft work packets
- reframe `/operator/work` into the deterministic agent activation agenda
- preserve prompt previews, branch suggestions, verification gates, human gates,
  and evidence expectations as copy-only operator material
- ratify deterministic planning/review semantics only

## Non-scope

- no provider or model calls
- no live agent runtime
- no execution authority
- no branch-write authority
- no PR-creation authority
- no scheduler or automation
- no hidden persistence
- no credentials
- no API or DB mutation
- no changes to `/operator/jai`, canonical agent registry, or JAI Palette model

## Expected outcome

`/operator/work` becomes a clear operator control-plane agenda where every item
is traceable through a deterministic planning/review chain without implying
autonomous execution.
