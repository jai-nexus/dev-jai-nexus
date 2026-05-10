# Execution: Sync Runs Repair/Reframe v0

**Motion:** motion-0181
**Role:** BUILDER
**Date:** 2026-05-09
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one durable assessment doc, one motion packet, and small copy/IA updates
to existing Sync Runs surfaces. No new producers, no automation, no runtime
expansion, and no cross-repo changes.

---

## Boundary confirmation

This motion must not:

- add a scheduler
- add automation
- add a live producer
- add an event emitter
- add provider/model calls
- add execution capability
- add branch-write authority
- add PR-creation authority
- add DB migration
- add API mutation
- change `/operator/jai`
- change the canonical agent registry
- change the JAI Palette model
- implement a full replacement dashboard

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-10T03:02:30.2744394Z`

### 2. Files changed

- `portal/docs/sync-runs-repair-reframe.md`
- `portal/src/app/page.tsx`
- `portal/src/app/operator/sync-runs/[syncRunId]/review/page.tsx`
- `.nexus/motions/motion-0181/**`

No `docs-nexus` files were changed. No `jai-nexus` files were changed.

### 3. Inspection findings

#### SyncRun schema

- `SyncRun` remains a generic run record with:
  - `type`
  - `status`
  - `trigger`
  - `startedAt`
  - `finishedAt`
  - `workflowRunUrl`
  - `summary`
  - `payload`
  - optional `repoId`
- `FileIndex` optionally links to `syncRunId`
- the schema does not itself force one product meaning

#### Producers found

- `portal/src/app/api/internal/agents/commit/route.ts`
  - creates `type: "agent-commit"` and `status: "PENDING_REVIEW"`
- `portal/src/app/api/internal/agents/apply/route.ts`
  - updates run to `APPLIED`
- `portal/src/app/api/internal/agents/reject/route.ts`
  - updates run to `REJECTED`
- `portal/src/app/api/sync-report/route.ts`
  - creates generic sync report rows and mirrors them into `SotEvent`
- `portal/scripts/jai-sync-repos.ts`
  - creates file-index-oriented sync runs and links `FileIndex` rows back to the run

#### Consumers found

- `portal/src/app/page.tsx`
  - renders root `/` as a SyncRun-centered landing surface
- `portal/src/app/operator/sync-runs/[syncRunId]/review/page.tsx`
  - renders staged file diff review from `.jai-agent-edits/<syncRunId>/`
- operator apply/reject routes proxy into the same review flow

#### Product semantics

- root `/` is the misleading surface
- the sync-run review route is already coherent as an agent-edit review detail surface
- the strongest current operator-facing meaning of Sync Runs is agent-edit review, not broad live heartbeat telemetry

### 4. Copy/IA changes added

- root `/`
  - retained legacy warning
  - added copy pointing operators to `/operator` for broader control-plane status
  - relabeled section heading from `Recent sync runs` to `Legacy SyncRun feed`
- `/operator/sync-runs/[syncRunId]/review`
  - added explicit copy that the route is `agent-edit review only`, not a generic control-plane sync detail

No behavior, producers, jobs, emitters, or mutations were added.

### 5. Recommended product path

- immediate framing:
  - treat visible Sync Runs primarily as a narrow agent-edit review/history surface
- long-term IA:
  - move root `/` away from SyncRun-first presentation and replace it in a later motion with a broader operator status overview
- not now:
  - do not attempt heartbeat repair or add live producers in this seam

### 6. Acceptance checks

- SRR-01 pass
- SRR-02 pass
- SRR-03 pass
- SRR-04 pass
- SRR-05 pass
- SRR-06 pass
- SRR-07 pass
- SRR-08 pass
- SRR-09 pass
- SRR-10 pass
- SRR-11 pass
- SRR-12 pass
- SRR-13 pass
- SRR-14 pass
- SRR-15 pass
- SRR-16 pass
- SRR-17 pass
- SRR-18 pass
- SRR-19 pass
- SRR-20 pass
- SRR-21 pass

### 7. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0181/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm -C portal build
```

Results recorded for ratification:

- `validate_motion` -> pass
- `validate_agency` -> pass
- `typecheck` -> pass
- `build` -> pass

### 8. Ratification closeout

Motion-0181 is ratified as an assessment and copy/IA seam only.

- `motion.yaml` status -> `ratified`
- `decision.yaml` status -> `RATIFIED`
- `vote.json` result -> `PASS`
- `policy.yaml` remains non-blocking with `required_ok: true`
- no scheduler, automation, live producer, emitter, authority, or mutation path was added
