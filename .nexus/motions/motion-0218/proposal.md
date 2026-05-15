# Proposal: Sandbox Fixture Review Summary v0

## Purpose

Add a compact read-only summary of sandbox fixture guard, failure, and gate
evidence posture to `/operator/corpus`.

## Scope

- extend the existing sandbox review block without redesigning the page
- display fixture guard posture, fixture categories, failure trace examples, gate-evidence summary, and source paths
- keep all copy explicit about fixture-only, simulated, non-authoritative review posture

## Non-goals

- no new route
- no controls
- no runtime state
- no API or DB calls
- no live governance behavior
