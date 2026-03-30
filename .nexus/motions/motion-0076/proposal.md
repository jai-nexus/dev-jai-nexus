# Proposal - motion-0076

## Title
bounded architect queue readiness for motion-linked packets

## Parent
motion-0071 (WS-2 phase 2, Q2 loop activation program)
Depends on: motion-0075 (WS-2 phase 1 — architect context binding)

## Confirmed blockers from motion-0075 investigation

| Blocker | Evidence |
|---|---|
| No `AgentQueueItem` for WorkPacket 880 | DB query: `AgentQueueItem for wp 880: []` |
| `WorkPacket 880 repoId=null` → `repoName=null` | DB query: `{"repoId":null}` |

### Why Blocker 1 exists
`activate-motion.mjs --create` calls Prisma directly to create `WorkPacket`
and `AgentInboxItem`. It does not call `syncAgentQueueItemForPacket`.
`syncAgentQueueItemForPacket` only creates a queue item when `assigneeNhId`
is non-null — which it never is at activation time per motion-0073 non-goals.

### Why Blocker 2 is resolved without touching repoId
`claimNext()` in agentRuntime.ts uses this fallback chain:
1. Use `AgentQueueItem.repoScope` if non-empty
2. Else use `packetCtx.repoName` (from `WorkPacket.repoId → repo.name`)
3. If still empty → skip

By storing `repoScope=['dev-jai-nexus']` in the new queue item, step 1
produces a non-empty list. Step 2 (the null fallback) is never reached.
`repoId` on the WorkPacket stays null — setting it is an operator routing
step, not this slice's concern.

---

## Fix: `portal/scripts/enqueue-motion-packet.mjs`

A new standalone script. Single responsibility: given a motionId, ensure
an `AgentQueueItem` exists for the motion-linked packet so the architect
runtime can claim it.

### Inputs
- `--motion <motionId>` (required)
- `--agent <nhId>` (optional — default: auto-detect first ARCHITECT-capable
  agent from `config/agency.yaml`)

### Preconditions checked
| Check | Source | Required |
|---|---|---|
| Motion directory exists | `.nexus/motions/<motionId>/` | yes |
| `decision.yaml` status is RATIFIED | governance artifact | yes |
| Target repo derivable | `decision.yaml` or `motion.yaml` | yes |
| Live AgentInboxItem exists with `motion:<motionId>` tag | DB | yes |
| Agent exists in agency config and is ARCHITECT-capable | `config/agency.yaml` | yes |

### DB operation
```
AgentQueueItem UPSERT
  where:  { workPacketId: inboxItem.workPacketId }
  create: { workPacketId, agentNhId, repoScope: [targetRepo], status: PENDING }
  update: { agentNhId, repoScope: [targetRepo], status: PENDING,
            claimedAt: null, leaseExpiry: null }
```

Idempotent: upsert resets the queue item to PENDING on repeat runs.

### Why repoScope=[targetRepo] is correct
`validateReposAgainstAgentScope('6.0.10', ['dev-jai-nexus'])` → normalizes
`dev-jai-nexus` → present in architect's allowed set (from `repo:dev-jai-nexus`
in the agent's scope) → VALID.

Storing the full agent scope array would fail because `paths:portal/src/**`
entries normalize to `**` — not a valid repo name in the allowed set.

### Output
```
[ENQUEUE-MOTION] Found inbox item ID=9 workPacketId=880 status=QUEUED
[ENQUEUE-MOTION] --- Queue item ready ---
[ENQUEUE-MOTION] AgentQueueItem ID:  <uuid>
[ENQUEUE-MOTION] agentNhId:          6.0.10
[ENQUEUE-MOTION] repoScope:          ["dev-jai-nexus"]
[ENQUEUE-MOTION] status:             PENDING
[ENQUEUE-MOTION] WorkPacket ID:      880
[ENQUEUE-MOTION] Motion-linked packet is now claimable by architect 6.0.10.
[ENQUEUE-MOTION] Run: pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10
```

---

## Proof sequence

### Step 1 — Enqueue
```
node portal/scripts/enqueue-motion-packet.mjs --motion motion-0070
```
Creates/upserts AgentQueueItem for WorkPacket 880 with agentNhId=6.0.10
and repoScope=['dev-jai-nexus'].

### Step 2 — Architect runtime pass
```
pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10
```
Expected: claims WorkPacket 880, emits debug.plan SoT event with
motionId, motionTitle, executionPlan in the payload.

### Step 3 — Verify motion-grounded plan
Query the resulting SoT event to confirm the plan payload contains:
- `motionId: "motion-0070"`
- `motionTitle: "bounded council policy seam extraction"`
- `plan.governedBy: "motion-0070"`
- `plan.executionPlan: "<execution.md text>"`

---

## What is not changed

- `activate-motion.mjs` — no change
- `architectRuntime.ts` — no change (motion context binding from phase 1 unchanged)
- `agentRuntime.ts` — no change
- `workPacketQueue.ts` — no change
- `workPacketActions.ts` — no change
- Prisma schema — no change
- Operator UI — no change
