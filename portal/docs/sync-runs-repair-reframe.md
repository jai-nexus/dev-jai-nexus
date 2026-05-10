# Sync Runs Repair/Reframe

Date: 2026-05-09
Scope: `dev.jai.nexus` / `dev-jai-nexus`
Motion: `motion-0181`

## Current baseline

- `motion-0180` established that Sync Runs is a real database-backed surface, but materially underfed.
- The root `/` route currently centers a stale `SyncRun` table.
- The latest observed local `SyncRun` row remained from `2026-02-18`.
- Current evidence suggests `SyncRun` is serving agent-edit review and sparse file-index/reporting paths, not a broad live control-plane heartbeat.

## SyncRun schema and source findings

### Schema

- `portal/prisma/schema.prisma`
- `SyncRun` fields:
  - `id`
  - `createdAt`
  - `updatedAt`
  - `type`
  - `status`
  - `trigger`
  - `startedAt`
  - `finishedAt`
  - `workflowRunUrl`
  - `summary`
  - `payload`
  - optional `repoId`
- `SyncRun` has no explicit domain, queue class, or review-only discriminator.
- `FileIndex` optionally links back to `syncRunId`, which supports file-index/import history use.

### Source meaning

- The schema is generic enough to represent multiple operational run types.
- Current product semantics are not generic:
  - root `/` presents Sync Runs as if they were a control-plane heartbeat
  - `/operator/sync-runs/[syncRunId]/review` is explicitly an agent-edit review surface

## Current producers

### 1. Agent edit staging

- `portal/src/app/api/internal/agents/commit/route.ts`
- Creates a `SyncRun` with:
  - `type: "agent-commit"`
  - `status: "PENDING_REVIEW"`
  - staged files under `.jai-agent-edits/<syncRunId>/`
- This is the clearest current operator-facing meaning of `SyncRun`.

### 2. Agent edit apply / reject

- `portal/src/app/api/internal/agents/apply/route.ts`
- `portal/src/app/api/internal/agents/reject/route.ts`
- Update existing `SyncRun` rows to `APPLIED` or `REJECTED`.
- These routes reinforce that the review flow is not hypothetical; it is the concrete lifecycle currently attached to operator handling.

### 3. Sync report endpoint

- `portal/src/app/api/sync-report/route.ts`
- Creates generic `SyncRun` rows from posted payloads and mirrors them into `SotEvent`.
- This path can represent broader sync activity, but the current observed table state does not show it operating as an active system heartbeat.

### 4. Repo indexer script

- `portal/scripts/jai-sync-repos.ts`
- Creates `SyncRun` rows with file-index semantics and links `FileIndex` rows back to the run.
- This is meaningful operational history, but it is not the same thing as an operator review queue or a real-time control-plane overview.

## Current consumers

### Root `/`

- `portal/src/app/page.tsx`
- Reads latest `prisma.syncRun.findMany(...)`
- Displays a generic recent sync-run table
- Current copy already labels the surface as legacy and sparse

### Sync-run review route

- `portal/src/app/operator/sync-runs/[syncRunId]/review/page.tsx`
- Reads one `SyncRun`, loads staged files from `.jai-agent-edits/<syncRunId>/`, previews old/new content, and exposes apply/reject controls
- This is operationally specific and already behaves like an agent-edit review queue detail page

### Operator apply/reject pass-through routes

- `portal/src/app/api/operator/sync-runs/[syncRunId]/apply/route.ts`
- `portal/src/app/api/operator/sync-runs/[syncRunId]/reject/route.ts`
- These keep the operator-facing review flow stable without broadening Sync Runs into a general telemetry abstraction

## Root `/` product assessment

- Root `/` currently over-centers a stale table whose present meaning is narrower than its framing.
- The page functions, but it is not a strong long-term landing surface.
- The strongest current control-plane overview already lives elsewhere:
  - `/operator`
  - `/operator/jai`
  - `/operator/motions`
  - `/repos`
  - `/operator/events`
- That makes root `/` a legacy landing surface rather than the best future home for operator status.

## `/operator/sync-runs/[syncRunId]/review` assessment

- This route is coherent.
- It is not a generic sync detail page.
- It is specifically:
  - agent-edit review
  - staged diff preview
  - operator apply/reject decision surface
- The product issue is not this route; the issue is that root `/` and the broader “sync runs” label blur this narrower meaning.

## Compared options

### Option A. Repair Sync Runs later as a live control-plane heartbeat

Pros:

- preserves the generic `SyncRun` model
- could give root `/` a direct live operational function later
- aligns with older control-plane language

Cons:

- requires explicit new producers, cadence, or orchestration
- risks conflating different run classes unless taxonomy is redesigned
- out of scope for this seam and not justified by current evidence

Assessment:

- viable only in a later routed implementation seam
- not recommended as the immediate product interpretation

### Option B. Reframe Sync Runs as agent-edit review queue

Pros:

- matches the strongest current operator-facing semantics
- aligns with `PENDING_REVIEW`, `APPLIED`, `REJECTED`, staged edits, and diff preview flow
- requires only copy/IA clarification in this seam

Cons:

- does not fully account for file-index and generic sync-report producers
- narrows a generic schema into a more product-specific interpretation

Assessment:

- good near-term operator framing
- best used as the interim product meaning for current visible surfaces

### Option C. Move/narrow Sync Runs and make root `/` a broader operator status overview later

Pros:

- best long-term IA for `dev.jai.nexus`
- avoids centering stale SyncRun rows on the domain root
- makes room for a future overview that can summarize motions, repos, authority posture, telemetry freshness, and JAI entry points without pretending one sparse table is the whole story

Cons:

- requires a later scoped dashboard/overview motion
- not fully implemented here

Assessment:

- best long-term product path
- should be paired with Option B as the immediate interim framing

## Recommended product path

Recommended conclusion:

1. Do not treat Sync Runs as the long-term root landing surface.
2. Treat current visible Sync Runs primarily as:
   - a legacy sparse `SyncRun` feed at root
   - an agent-edit review queue/detail flow in operator routes
3. Route a later motion that turns root `/` into a broader operator status overview.
4. Do not repair Sync Runs with live producers in this seam.

Short form:

- immediate product framing: **B**
- long-term IA direction: **C**
- explicitly not now: **A**

## Non-goals

- adding schedulers
- adding automation
- adding a live heartbeat producer
- adding event emitters
- adding provider/model calls
- adding execution or write authority
- adding DB migration or API mutation
- implementing a full replacement dashboard
- changing Events or Decisions behavior

## Guardrails preserved

- No scheduler added
- No automation added
- No live producer added
- No event emitter added
- No provider/model calls added
- No execution, branch-write, or PR authority added
- No DB migration or API mutation added
- `/operator/jai` unchanged
- canonical agent registry unchanged
- JAI Palette unchanged
- no docs-nexus or jai-nexus mutation

## Risks

- Root `/` still shows the same underlying table until a later overview motion replaces it.
- Reframing Sync Runs toward agent-edit review could understate the generic file-index/reporting uses of the same schema.
- A future live heartbeat design may want a different run model instead of stretching `SyncRun`.

## Recommended next seam

- Route a focused root-IA motion that replaces the current root landing page with a broader operator status overview.
- Keep Sync Runs available as a narrower review/history surface unless and until a dedicated telemetry run model is ratified.
