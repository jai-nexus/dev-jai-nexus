# Corpus V2 Readiness Gate

## Purpose

Define the exact readiness gates that must be satisfied before Corpus V2 can
open.

## Current status

- `corpus_id`: `corpus-v2`
- `status`: `gated`
- `open_state`: `not_open`

This gate definition does not authorize opening Corpus V2.

## Required readiness gates

1. JAI Agents can draft motions internally to `dev.jai.nexus`.
2. JAI Agents can vote using canonical governance voter identities.
3. JAI Agents can ratify motions through a governed, visible process.
4. Ratified motions can generate workflow-ready outputs.
5. Human operator retains final override and approval boundary where required.
6. Vote records distinguish governance voter identities, execution/role-lens
   agents, and human operator intervention.
7. Motion package generation is deterministic and schema-valid.
8. Snapshot generation is automatic or required by gate before settlement.
9. Corpus V2 motion numbering can start at `motion-0001` without overwriting
   Corpus V1.
10. Corpus V1 records remain immutable and historical unless corrected through
    explicit hygiene fix.
11. No branch-write, PR creation, merge, or execution authority is granted
    unless separately authorized.

## Current blockers

Corpus V2 remains blocked on:

- live agent motion drafting
- live canonical voting
- ratification workflow
- motion package generation
- workflow trigger path
- authority boundaries

## Non-authorizations

This readiness gate does not:

- open Corpus V2
- reset motion numbering yet
- declare live agent voting exists today
- grant provider/model dispatch authority
- grant runtime execution authority
- grant branch-write, PR, merge, scheduler, or automation authority
- add API or DB mutation
- add hidden persistence
