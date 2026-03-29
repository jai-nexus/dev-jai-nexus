# Execution Plan - motion-0073

## Goal
Extend `activate-motion.mjs` with a `--create` flag that creates a real
motion-linked WorkPacket and AgentInboxItem in the database after all
activatability checks pass, with idempotent duplicate prevention.

## File changed

### `portal/scripts/activate-motion.mjs`

**Structural changes:**
1. Add `create: false` to the `parseArgs` result object.
2. Parse `--create` flag in the arg loop.
3. Convert the synchronous IIFE `(function main() {...})()` to an async
   function call `async function main() {...}` with a `.catch()` handler,
   enabling `await` inside the create path without touching the existing
   sync logic.
4. After all existing precondition checks pass, branch on `args.create`:
   - `false` → existing dry-run output (no change to that code path)
   - `true` → call `runCreate(...)` with the derived activation params

**New `runCreate` function:**

```js
async function runCreate({ motionId, motionTitle, activationTag, routeTag, packetTitle, repoRoot }) {
    // 1. Load DATABASE_URL if missing
    if (!process.env.DATABASE_URL) {
        const envPath = path.join(repoRoot, "portal", ".env.local");
        if (fs.existsSync(envPath)) {
            const { default: dotenv } = await import("dotenv");
            dotenv.config({ path: envPath, override: false });
        }
    }
    if (!process.env.DATABASE_URL) {
        console.error("[ACTIVATE-MOTION] ERROR: DATABASE_URL is not set.");
        console.error("[ACTIVATE-MOTION] Set it in the environment or in portal/.env.local");
        process.exit(1);
    }

    // 2. Import Prisma client
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    try {
        // 3. Idempotency check
        const existingInbox = await prisma.agentInboxItem.findFirst({
            where: {
                tags: { has: activationTag },
                status: { notIn: ["DONE", "CANCELED"] },
            },
            select: { id: true, workPacketId: true, status: true },
        });

        if (existingInbox) {
            console.error(`[ACTIVATE-MOTION] REFUSE: Live packet exists for ${motionId}`);
            console.error(`[ACTIVATE-MOTION] Existing inbox item ID:   ${existingInbox.id}`);
            console.error(`[ACTIVATE-MOTION] Existing work packet ID:  ${existingInbox.workPacketId}`);
            console.error(`[ACTIVATE-MOTION] Existing status:          ${existingInbox.status}`);
            console.error(`[ACTIVATE-MOTION] Resolve or close the existing packet before re-activating.`);
            process.exit(1);
        }

        // 4. Create WorkPacket + AgentInboxItem in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const packet = await tx.workPacket.create({
                data: {
                    nhId: motionId,
                    title: packetTitle,
                    ac: "",
                    plan: "",
                    status: "DRAFT",
                },
            });

            const inbox = await tx.agentInboxItem.create({
                data: {
                    workPacketId: packet.id,
                    status: "QUEUED",
                    priority: 60,
                    tags: [activationTag, routeTag],
                },
                select: { id: true, status: true, priority: true, tags: true },
            });

            return { packet, inbox };
        });

        // 5. Print created packet identity
        console.log();
        console.log(`[ACTIVATE-MOTION] --- Work packet created ---`);
        console.log(`[ACTIVATE-MOTION] WorkPacket ID:   ${result.packet.id}`);
        console.log(`[ACTIVATE-MOTION] nhId:            ${result.packet.nhId}`);
        console.log(`[ACTIVATE-MOTION] Title:           ${result.packet.title}`);
        console.log(`[ACTIVATE-MOTION] Status:          ${result.packet.status}`);
        console.log(`[ACTIVATE-MOTION] InboxItem ID:    ${result.inbox.id}`);
        console.log(`[ACTIVATE-MOTION] Inbox status:    ${result.inbox.status}`);
        console.log(`[ACTIVATE-MOTION] Inbox priority:  ${result.inbox.priority}`);
        console.log(`[ACTIVATE-MOTION] Tags:            ${JSON.stringify(result.inbox.tags)}`);
        console.log();
        console.log(`[ACTIVATE-MOTION] Motion ${motionId} is now LIVE in the execution system.`);
        console.log();

        process.exit(0);
    } finally {
        await prisma.$disconnect();
    }
}
```

**Updated script header docstring:**
- Add `--create` flag to usage
- Note motion-0073 as the adding motion
- Reference motion-0072 as phase 1

**No other files are changed.**

## Idempotency rule (exact)

Refuse creation if:
```
AgentInboxItem WHERE tags HAS 'motion:<motionId>'
              AND status NOT IN ('DONE', 'CANCELED')
```

Terminal states permitting re-activation: DONE, CANCELED.
Non-terminal states blocking re-activation: QUEUED, CLAIMED, IN_PROGRESS,
PROPOSED, BLOCKED.

## Validation

```
node --check portal/scripts/activate-motion.mjs
pnpm -C portal typecheck
```

The typecheck pass confirms that `workPacketContract.ts` (already
modified in phase 1) still passes, and that the script changes do not
introduce any TypeScript-visible regressions.

## Rollback plan

Revert the changes to `activate-motion.mjs`. The dry-run mode is restored
immediately. No DB schema or data changes to undo (the script creates
packets; existing packets can be deleted from the operator work surface or
via `prisma studio` if needed).
