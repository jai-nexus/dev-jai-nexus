# motion-status — Activation Lane Status

Report the current execution lane status for the motion specified in: `$ARGUMENTS`

You are operating as **OPERATOR / LIBRARIAN** role in dev-jai-nexus.
This is a **read-only** status check. Do not create, enqueue, or run anything unless
explicitly asked to proceed.

---

## Steps

### 1 — Parse the motion ID

Extract the motion ID from `$ARGUMENTS` (e.g. `motion-0096`).

### 2 — Read governance status

Read:
- `.nexus/motions/{motionId}/decision.yaml` → `status` field (DRAFT / RATIFIED)
- `.nexus/motions/{motionId}/motion.yaml` → `kind`, `title`

### 3 — Query live packet state

Write a bounded read-only check script at `portal/scripts/_status-check.mjs`:

```js
// Reads WorkPacket, AgentInboxItem, AgentQueueItem, and SoT events for motionId
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env.local"), override: false });
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const { PrismaClient } = await import("@prisma/client");
const { PrismaPg } = await import("@prisma/adapter-pg");
const { default: pg } = await import("pg");
const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
try {
  const tag = `motion:{motionId}`;
  const inbox = await prisma.agentInboxItem.findFirst({
    where: { tags: { has: tag }, status: { notIn: ["DONE","CANCELED"] } },
    orderBy: { id: "desc" },
    select: { id: true, workPacketId: true, status: true, tags: true, priority: true },
  });
  if (!inbox) { console.log("No live inbox item for " + tag); process.exit(0); }
  const packet = await prisma.workPacket.findUnique({
    where: { id: inbox.workPacketId },
    select: { id: true, nhId: true, status: true, title: true },
  });
  const queue = await prisma.agentQueueItem.findFirst({
    where: { workPacketId: inbox.workPacketId },
    select: { id: true, agentNhId: true, status: true },
  });
  const sot = await prisma.sotEvent.findMany({
    where: { workPacketId: inbox.workPacketId },
    orderBy: { ts: "asc" },
    select: { kind: true, summary: true, ts: true },
  });
  console.log("packet:", JSON.stringify(packet));
  console.log("inbox tags:", inbox.tags);
  console.log("queue:", queue ? JSON.stringify(queue) : "(none)");
  console.log("sot events:");
  for (const e of sot) console.log(" ", e.ts.toISOString(), e.kind, e.summary);
} finally { await prisma.$disconnect(); await pool.end(); }
```

Run it: `node portal/scripts/_status-check.mjs`
Delete it after reading the output.

### 4 — Report status

Report all of the following:

- Governance status: DRAFT or RATIFIED
- WorkPacket id, nhId, status
- Current route tag from inbox tags
- AgentQueueItem: present (agent, status) or absent
- Last 4 SoT events
- **What needs to happen next** (see lane state table below)

### 5 — Lane state → next action table

| Inbox route tag | Queue item | Next action |
|---|---|---|
| `route:ARCHITECT` | absent | `node portal/scripts/enqueue-motion-packet.mjs --motion {id}` then `run-architect-once.ts 6.0.10` |
| `route:ARCHITECT` | PENDING | `pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10` |
| `route:BUILDER` | absent | `node portal/scripts/enqueue-builder-packet.mjs --motion {id}` then `run-builder-once.ts 6.0.11` |
| `route:BUILDER` | PENDING | `pnpm -C portal exec tsx scripts/run-builder-once.ts 6.0.11` |
| `route:VERIFIER` | absent | `node portal/scripts/enqueue-verifier-packet.mjs --motion {id}` then `run-verifier-once.ts 6.0.12` |
| `route:VERIFIER` | PENDING | `pnpm -C portal exec tsx scripts/run-verifier-once.ts 6.0.12` |
| `route:OPERATOR_REVIEW` | any | Operator action required — use `/operator/work/{id}` surface |
| No live inbox item | — | Packet may be DONE/CANCELED or not yet activated |

---

## Hard constraints

- Do **not** create or modify WorkPackets.
- Do **not** call `--create` on any activation script during this status check.
- Do **not** enqueue or run agents unless the user explicitly says "proceed".
- Delete `_status-check.mjs` immediately after reading its output.
