# Proposal: Event and Sync Gap Assessment v0

**Motion:** motion-0180
**Kind:** documentation
**Program:** q2-event-sync-gap-assessment-v0
**Basis:** motion-0179
**Date:** 2026-05-09

---

## Problem

The operator surface is now structurally coherent, but several telemetry-facing
surfaces still read as more current or more complete than the underlying feeds
justify.

The concrete gaps named for this assessment are:

- Event stream freshness
- Sync run freshness and semantics
- Decisions freshness only if it is low-risk and adjacent

The key question is not whether these routes exist. They do. The question is
whether they are:

- actively fed,
- correctly framed,
- or misleading enough that they should be relabeled or later deprecated.

---

## Scope

This motion is assessment-only with narrowly justified copy-only labels allowed.

It covers:

1. Inspecting current Events surfaces and their data source
2. Identifying the latest event timestamp available locally
3. Clarifying whether motion/governance ratification currently flows into Events
4. Inspecting current Sync Runs surfaces and their data source
5. Identifying the latest sync run timestamp available locally
6. Determining whether Sync Runs is active, legacy, mislabeled, or stale
7. Inspecting Decisions freshness only because it is structurally adjacent
8. Recording repair / relabel / deprecate recommendations

---

## Non-goals

- adding a new event emitter
- adding a scheduler
- adding automation
- adding provider/model calls
- adding execution authority
- adding branch-write authority
- adding PR-creation authority
- adding DB migration or API mutation
- changing `/operator/jai`
- changing the canonical agent registry or JAI Palette model
- implementing telemetry repair in this motion

---

## Success criteria

- Events source and freshness are documented
- latest event timestamp is named or explicitly absent
- governance-event expectation is clarified
- Sync Runs source and freshness are documented
- latest sync run timestamp is named or explicitly absent
- a repair / relabel / deprecate recommendation is made
- Decisions freshness is either included or explicitly deferred with rationale
- any UI change is copy-only and justified
- no emitter, scheduler, automation, authority, DB mutation, or cross-repo mutation is introduced
