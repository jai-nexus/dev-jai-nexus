# Proposal: Cross-Repo Ownership Sweep Consolidation v0

## Purpose

Update the Operator Control Plane canon/routing layer with the settled
repo-local ownership boundaries from the Q2M5 cross-repo ownership sweep.

## Scope

- add a consolidation artifact under `.nexus/canon/**`
- consolidate settled ownership boundaries for:
  - `audit-nexus`
  - `docs-nexus`
  - `jai`
  - `jai-nexus`
  - `api-nexus`
  - `jai-format`
  - `orchestrator-nexus`
- list unresolved / future-routed seams explicitly
- tie the consolidation back to `motion-0194`
- refresh the bundled motion snapshot through `motion-0195`

## Non-goals

- no runtime behavior change
- no cross-repo mutation
- no authority expansion
- no provider/model calls
- no execution, write, merge, scheduler, automation, or persistence behavior
