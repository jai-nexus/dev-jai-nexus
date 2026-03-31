# run-proof-lane — Proof Lane Execution

Run one stage of the governed proof lane for the motion specified in: `$ARGUMENTS`

You are operating as **BUILDER / VERIFIER** role inside dev-jai-nexus governance.
This skill executes scripts that mutate live database state. Read all pre-flight
checks before running anything.

---

## Usage

`/run-proof-lane <stage> <motionId>`

- `stage` — one of: `ARCHITECT`, `BUILDER`, `VERIFIER`
- `motionId` — e.g. `motion-0104`

---

## Stage reference table

| Stage | Enqueue command | Run command | Agent | Expected next route |
|---|---|---|---|---|
| `ARCHITECT` | `node portal/scripts/enqueue-motion-packet.mjs --motion {id}` | `pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10` | 6.0.10 | BUILDER |
| `BUILDER` | `node portal/scripts/enqueue-builder-packet.mjs --motion {id}` | `pnpm -C portal exec tsx scripts/run-builder-once.ts 6.0.11` | 6.0.11 | VERIFIER |
| `VERIFIER` | `node portal/scripts/enqueue-verifier-packet.mjs --motion {id}` | `pnpm -C portal exec tsx scripts/run-verifier-once.ts 6.0.12` | 6.0.12 | OPERATOR_REVIEW |

---

## Steps

### 1 — Parse and validate arguments

Extract `stage` and `motionId` from `$ARGUMENTS`.

- If `stage` is missing or not one of `ARCHITECT`, `BUILDER`, `VERIFIER`: stop and report.
- If `stage` is `OPERATOR_REVIEW`: stop immediately — see Hard constraints.
- If `motionId` is missing: stop and report usage.

### 2 — Verify motion governance state

Read `.nexus/motions/{motionId}/decision.yaml`.

- `status` must be `RATIFIED`. If `DRAFT`, stop and report:
  ```
  Motion {motionId} is DRAFT. Enqueue scripts require a RATIFIED motion.
  Ratify the motion first: /motion-ratify {motionId}
  ```
- If the file does not exist, stop and report.

### 3 — Pre-flight: verify packet is at the expected stage

Write, run, and immediately delete a bounded read-only check script at
`portal/scripts/_proof-preflight.mjs`:

```js
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
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
  if (!inbox) { console.log("NO_LIVE_INBOX"); process.exit(0); }
  const routeTag = inbox.tags.find(t => t.startsWith("route:"));
  const route = routeTag ? routeTag.slice("route:".length).toUpperCase() : "NONE";
  const queue = await prisma.agentQueueItem.findFirst({
    where: { workPacketId: inbox.workPacketId },
    select: { id: true, agentNhId: true, status: true },
  });
  const sotCount = await prisma.sotEvent.count({ where: { workPacketId: inbox.workPacketId } });
  console.log(JSON.stringify({ route, queuePresent: !!queue, queueAgent: queue?.agentNhId ?? null, sotCount, workPacketId: inbox.workPacketId }));
} finally { await prisma.$disconnect(); await pool.end(); }
```

Run: `node portal/scripts/_proof-preflight.mjs`
Delete the file immediately after reading output.

Evaluate the output:

- If `NO_LIVE_INBOX`: stop — "No live inbox item for {motionId}. The packet may already be DONE or not yet activated."
- If `route` does not match `{stage}`: stop — report the mismatch:
  ```
  Pre-flight failed: packet is at route:{actual}, expected route:{stage}.
  Check status with: /motion-status {motionId}
  ```
- If `route` matches: proceed.

Record `workPacketId` and `sotCount` (pre-run baseline) from the output.

### 4 — Run enqueue script

Use the stage reference table. Run the enqueue command for the resolved stage.

```
node portal/scripts/enqueue-{stage-script}.mjs --motion {motionId}
```

Capture full output. If exit code is non-zero, stop immediately:
```
Enqueue failed (exit {code}). Do not run the run-once script.
Full output: {output}
```

Record the `AgentQueueItem ID` from the output.

### 5 — Run the run-once script

Use the stage reference table. Run the run command for the resolved stage.

```
pnpm -C portal exec tsx scripts/run-{stage}-once.ts {agentNhId}
```

Capture full output. If exit code is non-zero, stop and report:
```
Run-once script failed (exit {code}).
Full output: {output}
```

### 6 — Verify post-run state

Write, run, and immediately delete a second check at
`portal/scripts/_proof-postcheck.mjs` (same structure as Step 3, no changes).

Run it and capture the output. Delete the file immediately.

Verify:
- `route` has advanced to the expected next route (see stage reference table)
- `sotCount` is greater than the pre-run baseline

If route has NOT advanced, report:
```
Post-run check: route did not advance (still {route}). Review run-once output above.
```

### 7 — Report evidence

Print a structured evidence block:

```
[RUN-PROOF-LANE] Stage:          {stage}
[RUN-PROOF-LANE] Motion:         {motionId}
[RUN-PROOF-LANE] WorkPacket:     {workPacketId}

[RUN-PROOF-LANE] Enqueue:        EXIT 0 — AgentQueueItem {queueItemId}
[RUN-PROOF-LANE] Run-once:       EXIT 0

[RUN-PROOF-LANE] Pre-run route:  {stage}
[RUN-PROOF-LANE] Post-run route: {nextRoute}
[RUN-PROOF-LANE] SoT events:     {preSotCount} → {postSotCount} (+{delta})

[RUN-PROOF-LANE] PASS — packet advanced from {stage} to {nextRoute}
```

If any step failed, substitute FAIL and include the error output.

---

## Hard constraints

- **NEVER** run for `OPERATOR_REVIEW`. That is a human decision gate. Stop and say:
  ```
  OPERATOR_REVIEW is a human gate. Use the /operator/work/{packetId} surface.
  For a one-shot governed proof, use: pnpm -C portal exec tsx scripts/operator-approve-once.ts {packetId}
  ```
- **NEVER** run the run-once script if the enqueue script exits non-zero.
- **NEVER** proceed if the pre-flight route check fails.
- **NEVER** proceed if the motion is DRAFT.
- **NEVER** run more than one stage per invocation.
- **ALWAYS** delete `_proof-preflight.mjs` and `_proof-postcheck.mjs` before the skill completes.
- **Do NOT** commit unless explicitly asked.
- **Do NOT** modify governance artifacts (motion packages, decision files).
- **Do NOT** call `applyPacketRouteAction` directly — that is the runtime's responsibility.
