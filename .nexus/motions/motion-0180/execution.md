# Execution: Event and Sync Gap Assessment v0

**Motion:** motion-0180
**Role:** BUILDER
**Date:** 2026-05-09
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one durable assessment doc, one motion packet, and small copy-only label
updates on already-existing operator surfaces. No runtime emitters, no DB
mutation, no automation, and no cross-repo changes.

---

## Boundary confirmation

This motion must not:

- add a new event emitter
- add a scheduler
- add automation
- add provider/model calls
- add execution capability
- add branch-write authority
- add PR-creation authority
- add DB migration
- add API mutation
- change `/operator/jai`
- change the canonical agent registry
- change the JAI Palette model
- implement agent PR workflow
- broaden into a telemetry implementation seam

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-09T22:01:30.1912010Z`

### 2. Files changed

- `portal/docs/event-sync-gap-assessment.md`
- `portal/src/app/events/page.tsx`
- `portal/src/app/operator/events/page.tsx`
- `portal/src/app/page.tsx`
- `.nexus/motions/motion-0180/**`

No `docs-nexus` files were changed. No `jai-nexus` files were changed.

### 3. Inspection findings

#### Events

- Surface paths:
  - `portal/src/app/events/page.tsx`
  - `portal/src/app/operator/events/page.tsx`
- Data source:
  - `prisma.sotEvent`
- Latest event found locally:
  - `2026-04-17T01:39:31.334Z`
  - source: `jai-work-ui`
  - kind: `WORK_APPROVED`
  - summary: `Work approved: motion-0133`
- Interpretation:
  - the route is live, but the feed is partial and stale relative to current motion baseline
  - motion ratification does not auto-emit into Events in v0

#### Sync Runs

- Surface paths:
  - `portal/src/app/page.tsx`
  - `portal/src/app/operator/sync-runs/[syncRunId]/review/page.tsx`
- Data source:
  - `prisma.syncRun`
- Latest sync run found locally:
  - `2026-02-18T20:56:16.526Z`
  - type: `agent-commit`
  - status: `PENDING_REVIEW`
  - trigger: `runner-v0`
  - summary: `test: staged edit via agents/commit`
- Interpretation:
  - the root surface is not operating as a live repo-wide sync heartbeat
  - current observed table state reads as legacy or sparse

#### Decisions

- Surface path:
  - `portal/src/app/operator/decisions/page.tsx`
- Data source:
  - `prisma.decision`
  - manual extractor: `pnpm -C portal extract:decisions`
- Latest decision found locally:
  - `2026-02-02T01:26:52.960Z`
- Interpretation:
  - freshness is manual and stale
  - inclusion here is adjacency-only, not a routed repair seam

### 4. Copy-only labels added

- `/events`
  - added note that the stream is a manual/script/runtime-fed snapshot and does not auto-emit motion ratification in v0
- `/operator/events`
  - added note that the surface is a partial telemetry stream and does not auto-emit current motion/governance ratification artifacts
- `/`
  - added note that Sync Runs is a legacy sparse `SyncRun` feed, not a full live heartbeat for the 38-repo registry

No behavior, emitters, jobs, or mutations were added.

### 5. Acceptance checks

- ESG-01 pass
- ESG-02 pass
- ESG-03 pass
- ESG-04 pass
- ESG-05 pass
- ESG-06 pass
- ESG-07 pass
- ESG-08 pass
- ESG-09 pass
- ESG-10 pass
- ESG-11 pass
- ESG-12 pass
- ESG-13 pass
- ESG-14 pass
- ESG-15 pass
- ESG-16 pass
- ESG-17 pass
- ESG-18 pass
- ESG-19 pass
- ESG-20 pass
- ESG-21 pass

### 6. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0180/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm -C portal build
```

Results recorded for ratification:

- `validate_motion` -> pass
- `validate_agency` -> pass
- `typecheck` -> pass
- `build` -> pass

### 7. Ratification closeout

Motion-0180 is ratified as an assessment and copy-label seam only.

- `motion.yaml` status -> `ratified`
- `decision.yaml` status -> `RATIFIED`
- `vote.json` result -> `PASS`
- `policy.yaml` remains non-blocking with `required_ok: true`
- no emitters, automation, authority, or mutation paths were added
