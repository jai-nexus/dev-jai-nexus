# Decision - motion-0076

## Status
DRAFT

## Summary
Motion `motion-0076` is a DRAFT bounded WS-2 phase-2 implementation slice.

The queue-readiness bridge for motion-linked packets is implemented and live-proven locally,
with a repaired route-stage guard that prevents enqueuing packets past the architect stage.

## What was done

`portal/scripts/enqueue-motion-packet.mjs` added and repaired:
- validates motion directory, `decision.yaml` RATIFIED status, and target repo
- auto-detects first ARCHITECT-capable agent from `config/agency.yaml` (or accepts `--agent <nhId>`)
- **guards against non-ARCHITECT route tags**: parses `route:` tag from latest inbox tags;
  refuses with exit 1 if current route is not `ARCHITECT`
- upserts `AgentQueueItem` with `repoScope=[targetRepo]` and `status=PENDING`

**Why the guard is necessary:**
After the architect processes a packet, `applyPacketRouteAction(ROUTE_BUILDER)` updates
the inbox tags to `["motion:<id>", "route:BUILDER"]`. Without the guard, the script
would create an architect queue item for a builder-stage packet — one that
`ArchitectAgentRuntime.canClaimCandidate()` would correctly skip (it checks
`packet.requestedRole === "ARCHITECT"`), but silently. The guard surfaces the
misalignment immediately at enqueue time.

## Proof candidate: motion-0069

Motion-0070 (original candidate) was past architect stage (`route:BUILDER`) after
the first proof run. The repaired script correctly refuses it. Motion-0069 is RATIFIED,
`target_repo=dev-jai-nexus`, and had no existing work packet — a clean architect-stage candidate.

## Evidence

### Guard validation
```
node portal/scripts/enqueue-motion-packet.mjs --motion motion-0070
```
→ Exit 1: `ERROR: Packet is not at architect stage. Current route tag: route:BUILDER`

### Validation
- `node --check portal/scripts/enqueue-motion-packet.mjs` — PASS
- `pnpm -C portal typecheck` — PASS (clean, no errors)

### Live proof sequence (2026-03-29)

**Step 1 — Handoff:**
```
node portal/scripts/issue-execution-handoff.mjs --motion motion-0069
```
Result: `motion-0069-handoff-001` issued, status=ISSUED.

**Step 2 — Activate:**
```
node portal/scripts/activate-motion.mjs --motion motion-0069 --create
```
Result: WorkPacket 881, InboxItem 10, tags=`["motion:motion-0069","route:ARCHITECT"]`.

**Step 3 — Enqueue (guard passes):**
```
node portal/scripts/enqueue-motion-packet.mjs --motion motion-0069
```
Result: AgentQueueItem `d649ec99-8d7d-4ad2-903d-6d67b18675e5`, `agentNhId=6.0.10`,
`repoScope=["dev-jai-nexus"]`, `status=PENDING`. Exit 0.

**Step 4 — Architect runtime:**
```
pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10
```
Result: `[ARCHITECT-ONCE] Claimed and processed one architect packet for 6.0.10.` Exit 0.

**Step 5 — SoT event verification (ID: 1491, WorkPacket 881):**

| Field | Value |
|---|---|
| `payload.motionId` | `"motion-0069"` |
| `payload.motionTitle` | `"bounded post-ratification execution handoff and receipt artifacts"` |
| `payload.requestedRole` | `"ARCHITECT"` |
| `payload.plan.governedBy` | `"motion-0069"` |
| `payload.plan.executionPlan` | full `execution.md` text present |
| `payload.plan.handoffTarget` | `"BUILDER"` |

All motion-grounded fields confirmed present.

## Post-run state

After architect processing:
- `AgentInboxItem` tags updated to `["motion:motion-0069", "route:BUILDER"]`
- Queue item deleted via `syncAgentQueueItemForPacket(assigneeNhId=null)`
- Re-running enqueue for motion-0069 now correctly refuses (route:BUILDER)

## Notes
Implemented and proved on 2026-03-29.
No files outside `portal/scripts/enqueue-motion-packet.mjs` were changed
(plus governance artifacts and motion-0069 handoff file).
This is a bounded proof slice; production routing remains the operator surface's responsibility (WS-3).
