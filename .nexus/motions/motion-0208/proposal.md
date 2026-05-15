# Proposal: Corpus V2 Readiness Drilldown Surface v0

## Purpose

Add a compact read-only operator drilldown surface for Corpus V2 readiness
gates.

## Scope

- add a compact `/operator/corpus` drilldown page
- display gate list, status, checkability, evidence, missing condition,
  authority note, and source path
- add a small link from the root readiness area
- keep the surface static and read-only

## Non-goals

- no controls
- no runtime state
- no API or DB writes
- no enforcement
- no automation
- no Corpus V2 opening or numbering reset
