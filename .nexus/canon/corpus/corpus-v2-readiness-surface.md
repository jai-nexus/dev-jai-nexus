# Corpus V2 Readiness Surface

## Purpose

Define the small read-only surface that exposes Corpus V2 readiness posture
from the Operator Control Plane.

The source of truth remains
`.nexus/canon/corpus/corpus-v2-readiness-checklist.md`.

## Surface posture

- surface is read-only
- source of truth remains the readiness checklist canon
- the UI or card is a visibility surface only
- no Corpus V2 opening occurs here
- no numbering reset occurs here
- no live drafting, voting, or ratification is activated here
- no runtime authority is expanded here

## Recommended surface shape

The lowest-risk placement is the existing root Corpus transition card or a
small adjacent section in the existing root/operator overview.

The surface should show:

- Corpus V2 status: `gated / not open`
- readiness checklist posture: canon-first, inspectable, non-authorizing
- static gate counts by status where helpful
- top blockers:
  - live agent motion drafting
  - live agent voting
  - governed visible ratification
  - deterministic agent-operable package generation
  - workflow-ready outputs
  - authority boundaries
- explicit notes:
  - no opening
  - no numbering reset
  - no authority expansion

## Source-of-truth relationship

- checklist canon remains authoritative
- the readiness surface may summarize counts and blockers
- the readiness surface must not invent additional gate semantics
- the readiness surface must not imply machine enforcement

## UI constraints

- static or local model only
- no runtime state
- no selector UI
- no route expansion unless a smaller extension is clearly impossible
- no scheduler, automation, API, DB, or persistence layer

## Non-goals

This surface does not:

- open Corpus V2
- reset numbering
- enable live agent drafting
- enable live agent voting
- enable autonomous ratification
- add provider or model calls
- add runtime execution
- add branch-write, PR, merge, scheduler, or automation authority

## Authority boundary

This surface preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
- no hidden persistence
- no passalong index
- no live heartbeat behavior
