# Proposal: Root Operator Status Overview v0

## Summary

Replace root `/` from a SyncRun-first landing surface into a broader read-only
operator status overview for `dev.jai.nexus`.

The root surface should become the front door to the JAI NEXUS control plane,
leading with motion, agenda, registry, agent, authority, and freshness posture
instead of implying a live heartbeat through a sparse SyncRun table.

## Scope

- add a small computed root overview model using existing read-only control-plane
  sources
- reframe root `/` into an operator status overview
- keep `/operator/jai` visibly available as a static, draft-only, read-only
  entry point
- keep Sync Runs visible only as compact legacy/review artifacts below the
  overview
- include low-risk freshness notes for Events, Sync Runs, and Decisions

## Non-scope

- no scheduler or automation
- no live producer or event emitter
- no provider/model calls
- no execution authority
- no branch-write authority
- no PR-creation authority
- no DB migration or API mutation
- no changes to `/operator/jai`, Events ingestion, Decisions extraction,
  canonical agent registry, or JAI Palette model

## Expected outcome

The root domain becomes a useful read-only operator front door while preserving
the current authority-disabled and telemetry-limited posture.
