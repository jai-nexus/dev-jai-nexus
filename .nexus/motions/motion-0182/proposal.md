# Proposal: Motion Snapshot Gate v0

**Motion:** motion-0182
**Kind:** documentation
**Program:** q2-motion-snapshot-gate-v0
**Basis:** motion-0181
**Date:** 2026-05-10

---

## Problem

The motion browser depends on a bundled snapshot at:

- `portal/src/lib/motion/motionSnapshot.json`

That snapshot can drift behind canonical motion packages after a merge if no one
refreshes it explicitly.

Recent evidence:

- after `motion-0181`, the bundled snapshot still stopped at `motion-0180`
- that meant `/operator/motions` did not reflect the latest settled canon

The current repo needs a process gate that makes snapshot refresh/check part of
the default closeout for future motion-bearing PRs.

---

## Scope

This motion covers:

1. refreshing the bundled motion snapshot for the current repo state
2. documenting the default gate for future motion-bearing PRs
3. adding low-risk script aliases if they improve adoption
4. updating existing PR/repo guidance only where clearly appropriate

---

## Non-goals

- adding CI automation
- changing motion validation semantics
- changing Sync Runs, Events, Decisions, `/operator/jai`, or agent registry behavior
- adding schedulers, emitters, provider calls, execution, write authority, or DB/API mutation

---

## Success criteria

- bundled snapshot is refreshed through this PR
- snapshot write/check commands are documented as required motion-bearing PR evidence
- latest bundled motion id and bundled motion count are expected closeout facts
- any added aliases are non-conflicting and low-risk
- no authority, runtime, or data-mutation expansion is introduced
