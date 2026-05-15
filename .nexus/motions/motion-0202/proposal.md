# Proposal: Corpus V2 Readiness Surface v0

## Purpose

Make Corpus V2 readiness visible from the Operator Control Plane without
turning the readiness checklist into runtime state or authority.

## Scope

- add read-only canon describing the readiness surface
- extend the existing root corpus transition surface with static readiness
  counts and blockers
- keep the readiness checklist as source of truth
- add a read-only motion package for `motion-0202`
- refresh the bundled motion snapshot through `motion-0202`

## Non-goals

- no opening of Corpus V2
- no numbering reset
- no live drafting, voting, or ratification enablement
- no runtime authority expansion
- no new large route or cockpit redesign
