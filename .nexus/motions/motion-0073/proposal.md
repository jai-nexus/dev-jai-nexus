# Proposal - motion-0073

## Title
bounded motion-linked work packet creation

## Parent
motion-0071 (WS-1 phase 2, Q2 loop activation program)
Extends: motion-0072 (WS-1 phase 1 — dry-run bridge)

## What this motion does

Turns the dry-run activation bridge into a real, bounded creation path.
`activate-motion.mjs --create` creates a motion-linked WorkPacket and
AgentInboxItem in the database when all activatability checks pass.

This is WS-1 phase 2. Phase 1 established the tag convention and the
dry-run inspection path. Phase 2 makes creation real.

---

## Activatability preconditions (unchanged from phase 1)

| Check | Source | Required |
|---|---|---|
| Motion directory exists | `.nexus/motions/<motionId>/` | yes |
| `motion.yaml` readable with title | motion artifact | yes |
| `decision.yaml` status is `RATIFIED` | governance artifact | yes |
| `execution.handoff.json` exists | execution artifact | yes |
| `execution.handoff.json` status is `ISSUED` | execution artifact | yes |
| Target repo derivable | `decision.yaml` or `motion.yaml` | yes |
| `execution.md` present | motion artifact | warn only |

All six required checks must pass before any database write is attempted.

---

## Idempotency rule

Before creating, query:

```
AgentInboxItem WHERE tags HAS 'motion:<motionId>'
              AND status NOT IN ('DONE', 'CANCELED')
```

If any row is found: refuse creation, print the existing `inboxItemId`
and `workPacketId`, exit 1.

If no row is found: proceed with creation.

**Why DONE and CANCELED are the terminal states:**
- `DONE` — work is complete; re-activation is permitted for a new execution
- `CANCELED` — work was withdrawn; re-activation is permitted
- All other states (QUEUED, CLAIMED, IN_PROGRESS, PROPOSED, BLOCKED) mean
  the packet is still live and actionable; re-activation is refused

---

## Created packet shape

### WorkPacket
| Field | Value |
|---|---|
| `nhId` | `motionId` (e.g. `motion-0073`) |
| `title` | `[motionId] motionTitle` |
| `ac` | `""` (empty; deferred to execution lane) |
| `plan` | `""` (empty; deferred to execution lane) |
| `status` | `DRAFT` |
| `repoId` | not set (deferred to operator routing step) |

### AgentInboxItem
| Field | Value |
|---|---|
| `status` | `QUEUED` |
| `priority` | `60` (matches ROUTE_ARCHITECT priority in workPacketActions) |
| `tags` | `["motion:<motionId>", "route:ARCHITECT"]` |

No assignee tag at creation. Assignment is a separate operator or routing step.
No SoT event emission in this slice (deferred).

---

## Environment loading

If `DATABASE_URL` is not set in the environment, the script loads
`portal/.env.local` via `dotenv` before importing the Prisma client.
If `DATABASE_URL` is still missing after dotenv load, the script fails
with a clear message.

---

## What is not changed

- `workPacketContract.ts` — no change (tag helpers are already in place)
- `workPacketActions.ts` — no change
- `agentRuntime.ts` — no change
- Prisma schema — no change
- Any operator UI surface — no change

---

## Files changed

| File | Change |
|---|---|
| `portal/scripts/activate-motion.mjs` | Add `--create` flag and `runCreate()` function |

---

## Why this is the right second slice

Phase 1 established: "what would the packet look like?" (dry-run intent)
Phase 2 answers: "create it" — using exactly the shape phase 1 described.

The idempotency rule means the script is safe to run multiple times.
The precondition checks mean creation can only happen for a properly
ratified and handed-off motion. The minimal packet shape leaves
assignee, repoId, ac, and plan for the execution lane to populate —
matching the existing governed creation pattern.
