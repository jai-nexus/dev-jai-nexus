# Event and Sync Gap Assessment

Date: 2026-05-09
Scope: `dev.jai.nexus` / `dev-jai-nexus`
Motion: `motion-0180`

## Current baseline

- `dev-jai-nexus` is structurally coherent through `motion-0179`.
- `/operator/jai`, `/operator/agents`, `/operator/projects`, `/repos`, and `/operator/motions` now align to the settled control-plane baseline.
- Remaining telemetry questions are about freshness and operator interpretation, not missing route structure.

## Events surface

### Surface paths

- `portal/src/app/events/page.tsx`
- `portal/src/app/operator/events/page.tsx`

### Data source

- Both surfaces read directly from `prisma.sotEvent`.
- Primary write helpers and entry paths found during inspection:
  - `portal/src/lib/sotEvents.ts`
  - `portal/src/app/api/sot-events/route.ts`
  - `portal/src/app/api/sync-report/route.ts`
  - work-packet and DCT mutation paths that call `recordSotEvent(...)`
  - several local scripts that write directly to `SotEvent`

### Latest event timestamp found

- Latest `SotEvent.ts` in the local portal database:
  - `2026-04-17T01:39:31.334Z`
- Latest row summary:
  - source: `jai-work-ui`
  - kind: `WORK_APPROVED`
  - summary: `Work approved: motion-0133`
- Local row count observed:
  - `1525`

### Freshness assessment

- The Events surfaces are not dead routes; they are live database readers.
- The issue is feed freshness and expectation clarity.
- The most recent event found is materially older than the current motion baseline through `motion-0179`.
- The latest observed event comes from work-packet activity, not from current motion ratification or recent control-plane upkeep.

### Governance-event expectation

- Governance and motion artifacts are canonical on disk under `.nexus/motions/**`.
- Current repo inspection found no active bridge that mirrors motion ratification into `SotEvent`.
- A concept of governance or operational event modeling exists in canon, but explicit emission is still disabled in at least one current policy artifact:
  - `.nexus/canon/docs-agent-operation-event.yaml`
  - `v0_status: model_only_not_emitted`
  - rules include `event emission is not enabled by motion-0174`

### Conclusion

- Operator expectation should be:
  - Events currently show manual, script, and runtime-fed `SotEvent` rows.
  - Motion/governance ratification does not automatically flow into Events in v0.
- Therefore the Events surface should be relabeled as a partial telemetry stream, not implied as a complete control-plane activity log.

## Sync Runs surface

### Surface paths

- `portal/src/app/page.tsx`
- `portal/src/app/operator/sync-runs/[syncRunId]/review/page.tsx`

### Data source

- Root dashboard reads directly from `prisma.syncRun`.
- Known write paths found during inspection:
  - `portal/src/app/api/sync-report/route.ts`
  - `portal/scripts/jai-sync-repos.ts`
  - `portal/src/app/api/internal/agents/commit/route.ts`

### Latest sync run timestamp found

- Latest `SyncRun.createdAt` in the local portal database:
  - `2026-02-18T20:56:16.526Z`
- Latest row details:
  - `id: 1`
  - `type: agent-commit`
  - `status: PENDING_REVIEW`
  - `trigger: runner-v0`
  - `summary: test: staged edit via agents/commit`
- Local row count observed:
  - `1`

### Freshness and semantics assessment

- The root dashboard is currently labeled like a repo-wide sync heartbeat:
  - `Control plane for sync runs across the Nexus.`
- The stored data does not support that interpretation.
- Only one `syncRun` row exists in the inspected local database, and it is an old agent-edit review staging record.
- The dedicated operator sync-run detail route is specifically an agent edit review surface, not a general telemetry review surface.
- The `sync:repos` machinery exists, but the current inspected data does not show ongoing repo-index sync activity landing in the table.

### Conclusion

- The current root Sync Runs surface reads as a legacy or underfed operational table.
- It should not be interpreted as an active, comprehensive repo-sync heartbeat.
- The best near-term posture is relabeling rather than implementation repair inside this motion.

## Decisions surface

### Surface paths

- `portal/src/app/operator/decisions/page.tsx`

### Data source

- The route reads from `prisma.decision`.
- Population path is manual extraction, not live telemetry:
  - `portal/scripts/extract-decisions.ts`
  - portal script alias: `pnpm -C portal extract:decisions`

### Latest decision freshness found

- Latest `Decision.createdAt` in the local portal database:
  - `2026-02-02T01:26:52.960Z`
- Local row count observed:
  - `247`

### Inclusion rationale

- Decisions are structurally adjacent because operator-facing users may infer freshness from the surrounding telemetry surfaces.
- The route already hints at the truth:
  - it describes decisions as extracted from archived AI conversations
  - its empty state explicitly says to run `extract:decisions`
- That makes the Decisions surface less misleading than Sync Runs, even though freshness is still manual and stale.

### Conclusion

- Decisions belong in this assessment as a documented adjacent freshness gap.
- They do not need UI relabeling in this seam unless operator confusion persists after event/sync relabeling.

## Recommendations

### Repair later

- Add an explicit governance-to-`SotEvent` bridge only in a future routed seam.
- Decide whether repo-index sync activity should continue using `SyncRun`, move to a different run model, or be retired from the root dashboard.
- If Decisions should appear operationally current, route a separate extraction freshness seam with explicit cadence and ownership.

### Relabel now

- Events:
  - clarify that the stream is partial and currently fed by manual/runtime/script writes
  - clarify that motion ratification is not auto-emitted into the event stream in v0
- Sync Runs:
  - relabel the root table as legacy or sparse until a live feed exists
  - clarify that the table is not a full repo-registry heartbeat

### Deprecate only after replacement

- Do not remove the surfaces in this motion.
- If Sync Runs is later deprecated, replace it with either:
  - a clearly named agent-edit review surface, or
  - a verified live operations/run-status surface

## Risks

- Operators may still infer live telemetry from table shape even after relabeling.
- Local database findings may differ from another environment, but the code inspection still shows that freshness depends on manual or runner-only ingestion.
- A future event bridge could make this document stale if it is not revised after implementation.

## Guardrails preserved

- No event emitter added
- No scheduler added
- No automation added
- No provider/model calls added
- No execution, branch-write, or PR authority added
- No DB migration or API mutation added
- `/operator/jai` unchanged
- canonical agent registry unchanged
- JAI Palette model unchanged
- no cross-repo mutation

## Recommended next seam

- Smallest high-value next seam:
  - decide whether the root Sync Runs surface should be repaired as a real live telemetry surface or explicitly repositioned around agent-edit review only
- After that:
  - route governance-event emission only if CONTROL_THREAD wants motion and ratification activity to appear in Events as first-class operational telemetry
