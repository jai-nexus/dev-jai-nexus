# Proposal: Operator Surface for Corpus Transition v0

## Purpose

Make corpus transition state visible in the Operator Control Plane through a
small read-only status card.

## Scope

- add a small static corpus status model if needed
- show current corpus as Corpus V1 with manual-governance closeout posture
- show future corpus as Corpus V2 with gated/not-open posture
- show unresolved blockers before Corpus V2
- keep the surface read-only and local
- refresh the bundled motion snapshot through `motion-0198`

## Non-goals

- no runtime corpus switching
- no API route or DB model
- no route/query/local/session state
- no selector UI
- no live heartbeat semantics
- no provider/model calls
- no runtime execution, write, merge, scheduler, or automation authority
