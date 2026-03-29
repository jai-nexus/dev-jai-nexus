# Execution Plan - motion-0075

## Goal
Add motion-context awareness to `ArchitectAgentRuntime` so that packets
tagged with `motion:<motionId>` produce a motion-grounded `debug.plan`
artifact instead of a generic stub. Non-motion-linked packets are
unaffected.

---

## File changed

### `portal/src/lib/work/architectRuntime.ts`

**New imports (top of file):**
```ts
import fs from "node:fs";
import path from "node:path";
import { getMotionFromTags } from "@/lib/work/workPacketContract";
```

**New type:**
```ts
type MotionContext = {
    motionId: string;
    title: string;
    executionPlan: string;
};
```

**New helpers:**

`findRepoRoot(startDir: string): string | null`
- Walks up from `startDir` checking for `.nexus` directory
- Returns the first parent that contains `.nexus`, or `null` if not found
- Max 8 hops (mirrors existing script pattern)

`loadMotionContext(inboxTags: string[]): MotionContext | null`
- Calls `getMotionFromTags(inboxTags)` — returns `null` if no motion tag
- Calls `findRepoRoot(process.cwd())` — returns `null` with warn if not found
- Reads `motion.yaml` title via regex `^title:\s*["']?(.+?)["']?\s*$`
- Reads full `execution.md` text
- All file read failures are caught; fallbacks applied silently or with warn
- Returns `{ motionId, title, executionPlan }` or `null`

**Updated `buildArchitectPlan`:**
- New optional third parameter: `motionContext?: MotionContext | null`
- When `motionContext` is present: returns motion-grounded plan with
  `motionId`, `motionTitle`, `plan.objective` referencing the motion,
  `plan.governedBy`, `plan.executionPlan` (execution.md text),
  and motion-specific `checkpoints`
- When `motionContext` is absent: returns existing generic plan unchanged

**Updated `execute()` (one added line):**
```ts
const motionContext = loadMotionContext(loaded.inboxTags);
```
Called after `loadWorkPacketContext` returns and role validation passes,
inside the existing transaction block. Passed to `buildArchitectPlan`.

---

## Validation

```
pnpm -C portal typecheck
```
Output: clean (no errors)

---

## Live runtime proof — why it is deferred

The WS-1 activation bridge creates an `AgentInboxItem` (ID: 9, WorkPacket: 880).
The architect runtime `claimNext()` queries `AgentQueueItem`, not `AgentInboxItem`.

Two confirmed blockers prevent a live proof against the existing motion-linked
packet (WorkPacket 880, motion-0070) on the current branch:

**Blocker 1 — No `AgentQueueItem` exists for WorkPacket 880.**
DB query confirms: `AgentQueueItem for wp 880: []`.
`claimNext()` finds no rows → returns null → `run-architect-once.ts` prints
"No claimable architect packet found" and exits 0 without executing the runtime.

**Blocker 2 — WorkPacket 880 has `repoId=null`.**
DB query confirms: `WorkPacket 880: {"repoId":null}`.
In `claimNext()`, `reposToCheck` falls back to `packetCtx.repoName` which is
also null → `reposToCheck = []` → the claim loop `continue`s past the packet
even if a queue item existed.

**What is needed to unblock live proof (deferred to a follow-on slice):**
- A path from `AgentInboxItem` to `AgentQueueItem` for the motion-linked packet
  (routing step, likely WS-1 or a dedicated routing slice)
- `repoId` set on WorkPacket 880 (operator routing step, currently skipped at
  activation time per motion-0073 non-goal: "Do not look up or wire repoId at
  creation time.")

**Scope of this slice (confirmed):**
- Code-level binding: complete and typecheck-verified
- Live runtime proof: explicitly deferred
- No fake confidence asserted

---

## Fallback table

| Condition | Behavior |
|---|---|
| No `motion:` tag | `loadMotionContext` returns `null` → generic plan |
| Repo root not found | `console.warn` → `null` → generic plan |
| `motion.yaml` missing | `title = motionId` (motionId used as fallback title) |
| `motion.yaml` title regex no match | `title = motionId` |
| `execution.md` missing | `console.warn` + `executionPlan = ""` → `"(execution.md absent)"` in plan |
| `execution.md` unreadable | `console.warn` + `executionPlan = ""` |

---

## No other files changed

- `agentRuntime.ts` — no change
- `workPacketContract.ts` — no change (helpers already exported)
- `workPacketActions.ts` — no change
- Any builder or verifier runtime — no change
- Prisma schema — no change

## Rollback plan
Revert the changes to `portal/src/lib/work/architectRuntime.ts`. The
file's previous behavior is fully restored. No DB changes to undo.
