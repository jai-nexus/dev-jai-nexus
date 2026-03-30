# Execution Plan - motion-0076

## Goal
Bridge the two confirmed blockers that prevented the WS-2 live architect
runtime proof. After this slice, `run-architect-once.ts 6.0.10` successfully
claims a motion-linked packet and emits a motion-grounded `debug.plan` artifact.

---

## New file: `portal/scripts/enqueue-motion-packet.mjs`

Creates or upserts an `AgentQueueItem` for a motion-linked work packet,
with a mandatory route-stage guard.

**Inputs:**
- `--motion <motionId>` (required)
- `--agent <nhId>` (optional — auto-detects first ARCHITECT-capable agent)

**Precondition checks:**
1. Motion directory and `motion.yaml` exist
2. `decision.yaml` status is RATIFIED
3. Target repo derivable from decision or motion artifacts
4. Live `AgentInboxItem` exists with `motion:<motionId>` tag
5. Agent exists in `config/agency.yaml` and is ARCHITECT-capable
6. **Latest inbox tags include `route:ARCHITECT`** — refuse if any other route

**Route-stage guard (added in repair):**

After finding the inbox item, the script parses the `route:` tag from
`inboxItem.tags`. If the route is anything other than `ARCHITECT`, it exits
with a clear message:

```
[ENQUEUE-MOTION] ERROR: Packet is not at architect stage.
[ENQUEUE-MOTION] Current route tag: route:BUILDER
[ENQUEUE-MOTION] Only packets with route:ARCHITECT can be enqueued for the architect runtime.
[ENQUEUE-MOTION] Motion motion-0070 is already past the architect stage — do not re-enqueue it.
```

**Why this guard is necessary:**
`ArchitectAgentRuntime.canClaimCandidate()` checks
`packet.requestedRole === "ARCHITECT"`. After the architect processes a
packet, `applyPacketRouteAction(ROUTE_BUILDER)` updates the inbox tags to
`["motion:<id>", "route:BUILDER"]`. Without the guard, the script would
create an unclaimable queue item — the architect runtime would find it,
load the packet context, see `requestedRole="BUILDER"`, and skip it.
The guard surfaces this misalignment immediately rather than silently.

**DB operation:**
```
AgentQueueItem UPSERT
  where:  { workPacketId }
  create: { workPacketId, agentNhId, repoScope: [targetRepo], status: PENDING }
  update: { agentNhId, repoScope: [targetRepo], status: PENDING,
            claimedAt: null, leaseExpiry: null }
```

**Why `repoScope=[targetRepo]` not the full agent scope:**
`claimNext()` uses `AgentQueueItem.repoScope` as the list of repos to
validate against `validateReposAgainstAgentScope`. Storing the full agent
scope array (`['repo:dev-jai-nexus', 'paths:portal/src/**', ...]`) fails
validation because `paths:portal/src/**` normalizes to `**` — not a valid
repo in the allowed set. Storing only `[targetRepo]` (`['dev-jai-nexus']`)
passes correctly.

---

## Validation

```
node --check portal/scripts/enqueue-motion-packet.mjs
```
Output: `PASS: syntax check`

```
pnpm -C portal typecheck
```
Output: clean (no errors)

---

## Proof sequence and evidence

### Proof candidate: motion-0069

Motion-0069 is RATIFIED (`target_repo=dev-jai-nexus`), with no existing
work packet. It is a clean architect-stage candidate.

Motion-0070 was the original candidate but is **past architect stage**
(`route:BUILDER`) — the repaired script correctly refuses it.

---

### Step 0 — Guard validation: motion-0070 refused

```
node portal/scripts/enqueue-motion-packet.mjs --motion motion-0070
```

Output:
```
[ENQUEUE-MOTION] Motion:   motion-0070
[ENQUEUE-MOTION] Agent:    6.0.10 (DEV Architect)
[ENQUEUE-MOTION] Repo:     dev-jai-nexus
[ENQUEUE-MOTION] Repo root: ...dev-jai-nexus

[ENQUEUE-MOTION] Found inbox item  ID=9  workPacketId=880  status=QUEUED

[ENQUEUE-MOTION] ERROR: Packet is not at architect stage.
[ENQUEUE-MOTION] Current route tag: route:BUILDER
[ENQUEUE-MOTION] Current tags:      ["motion:motion-0070","route:BUILDER"]
[ENQUEUE-MOTION] Only packets with route:ARCHITECT can be enqueued for the architect runtime.
[ENQUEUE-MOTION] Motion motion-0070 is already past the architect stage — do not re-enqueue it.
```

Exit: 1 ✓

---

### Step 1 — Issue handoff for motion-0069

```
node portal/scripts/issue-execution-handoff.mjs --motion motion-0069
```

Output:
```
[EXECUTION-HANDOFF] Execution handoff issued for motion-0069
[EXECUTION-HANDOFF] Path: .nexus/motions/motion-0069/execution.handoff.json
[EXECUTION-HANDOFF] Handoff ID: motion-0069-handoff-001
[EXECUTION-HANDOFF] Target: domain=dev.jai.nexus repo=dev-jai-nexus
[EXECUTION-HANDOFF] Status: ISSUED
```

Exit: 0

---

### Step 2 — Activate motion-0069

```
node portal/scripts/activate-motion.mjs --motion motion-0069 --create
```

Output:
```
[ACTIVATE-MOTION] WorkPacket ID:   881
[ACTIVATE-MOTION] nhId:            motion-0069
[ACTIVATE-MOTION] Title:           [motion-0069] bounded post-ratification execution handoff and receipt artifacts
[ACTIVATE-MOTION] Status:          DRAFT
[ACTIVATE-MOTION] InboxItem ID:    10
[ACTIVATE-MOTION] Inbox status:    QUEUED
[ACTIVATE-MOTION] Tags:            ["motion:motion-0069","route:ARCHITECT"]
[ACTIVATE-MOTION] Motion motion-0069 is now LIVE in the execution system.
```

Exit: 0

---

### Step 3 — Enqueue (guard passes)

```
node portal/scripts/enqueue-motion-packet.mjs --motion motion-0069
```

Output:
```
[ENQUEUE-MOTION] Motion:   motion-0069
[ENQUEUE-MOTION] Agent:    6.0.10 (DEV Architect)
[ENQUEUE-MOTION] Repo:     dev-jai-nexus
[ENQUEUE-MOTION] Repo root: ...dev-jai-nexus

[ENQUEUE-MOTION] Found inbox item  ID=10  workPacketId=881  status=QUEUED

[ENQUEUE-MOTION] --- Queue item ready ---
[ENQUEUE-MOTION] AgentQueueItem ID:  d649ec99-8d7d-4ad2-903d-6d67b18675e5
[ENQUEUE-MOTION] agentNhId:          6.0.10
[ENQUEUE-MOTION] repoScope:          ["dev-jai-nexus"]
[ENQUEUE-MOTION] status:             PENDING
[ENQUEUE-MOTION] WorkPacket ID:      881

[ENQUEUE-MOTION] Motion-linked packet is now claimable by architect 6.0.10.
```

Exit: 0

---

### Step 4 — Architect runtime proof

```
pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10
```

Output:
```
[lib/prisma] Initializing module...
[ARCHITECT-ONCE] Claimed and processed one architect packet for 6.0.10.
```

Exit: 0

---

### Step 5 — Motion-grounded plan verification

Query of resulting `debug.plan` SoT event (ID: 1491) for WorkPacket 881:

```json
{
  "id": 1491,
  "payload": {
    "kind": "debug.plan",
    "nhId": "motion-0069",
    "source": "jai-agent-runtime",
    "payload": {
      "schema": "architect-runtime-0.1",
      "agentNhId": "6.0.10",
      "workPacketId": 881,
      "requestedRole": "ARCHITECT",
      "motionId": "motion-0069",
      "motionTitle": "bounded post-ratification execution handoff and receipt artifacts",
      "plan": {
        "objective": "Architect review for governed motion motion-0069: bounded post-ratification execution handoff and receipt artifacts",
        "governedBy": "motion-0069",
        "executionPlan": "# Execution Plan - motion-0069\n\n## Goal\n...",
        "checkpoints": [
          "Review execution.md for motion-0069 implementation surface.",
          "Confirm proposed changes match motion success criteria.",
          "Record governed architect evidence before BUILDER handoff."
        ],
        "handoffTarget": "BUILDER"
      }
    }
  }
}
```

**Evidence of motion-grounded plan:**
- `payload.motionId`: `"motion-0069"` ✓
- `payload.motionTitle`: `"bounded post-ratification execution handoff and receipt artifacts"` ✓
- `payload.requestedRole`: `"ARCHITECT"` ✓
- `payload.plan.objective`: references motionId and title ✓
- `payload.plan.governedBy`: `"motion-0069"` ✓
- `payload.plan.executionPlan`: full `execution.md` text present ✓
- `payload.plan.checkpoints`: motion-specific checkpoints ✓
- `payload.plan.handoffTarget`: `"BUILDER"` ✓

---

## Post-run state note

After the architect runtime processes the packet, `applyPacketRouteAction`
(ROUTE_BUILDER, clearAssignee=true) runs. This:
- Updates `AgentInboxItem` tags to `["motion:motion-0069", "route:BUILDER"]`
- Calls `syncAgentQueueItemForPacket(assigneeNhId=null)` → deletes the queue item

Running `enqueue-motion-packet.mjs --motion motion-0069` again after the
architect pass will now correctly refuse: the route tag will be `route:BUILDER`
and the guard will exit 1.

---

## Success criteria check

| Criterion | Result |
|---|---|
| `node --check` passes | PASS |
| `pnpm -C portal typecheck` passes | PASS |
| enqueue refuses motion-0070 (route:BUILDER) with exit 1 | PASS |
| enqueue accepts motion-0069 (route:ARCHITECT) with exit 0 | PASS |
| enqueue creates queue item with agentNhId=6.0.10 and repoScope=["dev-jai-nexus"] | PASS |
| `run-architect-once.ts 6.0.10` exits 0 | PASS |
| debug.plan SoT event (ID: 1491) contains motionId, motionTitle, executionPlan | PASS |
| Re-running enqueue after architect pass is refused (route:BUILDER) | PASS (by design) |
| No files outside portal/scripts/enqueue-motion-packet.mjs changed | PASS |

---

## Files added

| File | Purpose |
|---|---|
| `portal/scripts/enqueue-motion-packet.mjs` | queue-readiness bridge script with route-stage guard |
| `.nexus/motions/motion-0069/execution.handoff.json` | handoff artifact for proof candidate |
| `.nexus/motions/motion-0076/` | governance package for this slice |

## Rollback plan
Delete `portal/scripts/enqueue-motion-packet.mjs`. No schema changes to
undo. The created AgentQueueItem rows can be deleted via the operator surface
or `prisma studio` if needed.
