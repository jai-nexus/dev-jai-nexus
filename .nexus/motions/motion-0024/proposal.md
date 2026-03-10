# Proposal (motion-0024)

## 0.0 Problem
motion-0023 made panel progress deterministic and visible, but the operator workflow is still too manual.

Today:
- panelIndex already supports filtering by progress state
- Coverage already computes progress breakdown counts
- Panel Viewer already shows progress status + reason

But operators still do extra work to route themselves to the next task:
- /operator/panels does not expose a progress filter in the UI
- Coverage breakdown is informational, not a direct work queue
- Panel Viewer explains status, but not the deterministic next action

This slows down at-scale panel completion.

## 1.0 Goal
Turn progress state into an explicit operator work queue by adding:
- progress filtering in /operator/panels
- one-click work queue links for incomplete states
- deep links from Coverage into filtered queue views
- deterministic “next action” hints in Panel Viewer

## 2.0 Solution
1) Extend /operator/panels UI
- add `progress` filter select
- add work queue links:
  - INVALID
  - NEEDS_SCORES
  - NEEDS_WINNER
  - NEEDS_EVIDENCE
  - COMPLETE

2) Extend Coverage routing
- make progress breakdown clickable
- send operators directly to /operator/panels?progress=<STATE>

3) Extend Panel Viewer
- keep showing progress + reason
- add deterministic next-action guidance derived from progress state

## 3.0 Acceptance
- /operator/panels exposes a visible progress filter
- /operator/panels exposes one-click work queue links by progress state
- /operator/registry/coverage progress counts link into filtered panels queues
- /operator/panels/<motion>/<panel> shows deterministic next action guidance
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- No change to scoring semantics
- No automatic evidence generation
- No change to COMPLETE semantics
- No changes to panel scaffolding / instantiation
