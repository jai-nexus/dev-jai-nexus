# Proposal: Sync Runs Repair/Reframe v0

**Motion:** motion-0181
**Kind:** documentation
**Program:** q2-sync-runs-repair-reframe-v0
**Basis:** motion-0180
**Date:** 2026-05-09

---

## Problem

`motion-0180` established that Sync Runs is a real DB-backed surface, but the
current product reading is misleading:

- root `/` centers a sparse stale `SyncRun` table
- the strongest current `SyncRun` semantics are agent-edit review semantics
- the domain root should likely become a broader operator overview later

The unresolved product question is:

- what should Sync Runs mean now, and
- whether root `/` should keep centering it

---

## Scope

This motion is assessment-only with narrowly justified copy/IA updates allowed.

It covers:

1. SyncRun schema and usage inspection
2. producer and consumer inspection
3. root `/` product assessment
4. sync-run review route assessment
5. comparison of repair, reframe, and root-replacement options
6. recommendation of the product path

---

## Non-goals

- adding schedulers
- adding automation
- adding live producers
- adding event emitters
- adding provider/model calls
- adding execution or write authority
- adding DB migration or API mutation
- implementing a full root dashboard
- changing Events behavior
- changing Decisions extraction behavior

---

## Success criteria

- SyncRun schema and usage are documented
- current producers and consumers are documented
- root `/` semantics are documented
- sync-run review semantics are documented
- repair / reframe / replace options are compared
- a recommended product path is selected
- any product change remains copy-only or IA-only
- no producer, scheduler, automation, authority, DB mutation, or cross-repo change is introduced
