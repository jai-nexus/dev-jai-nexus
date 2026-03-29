# Proposal - motion-0075

## Title
bounded architect motion context binding

## Parent
motion-0071 (WS-2 phase 1, Q2 loop activation program)

## What this motion does

Makes the architect runtime motion-context-aware. When a work packet
carries a `motion:<motionId>` tag, the architect runtime reads the
governing motion's `execution.md` and `motion.yaml` title from
`.nexus/motions/<motionId>/`, then produces a motion-grounded
`debug.plan` artifact instead of a generic stub.

Non-motion-linked packets: existing behavior unchanged.

---

## Binding point

**Where**: `ArchitectAgentRuntime.execute()`, inside the existing
transaction block, immediately after `loadWorkPacketContext()` returns
and role validation passes.

**Why there**: `WorkPacketRuntimeContext.inboxTags` is already populated
by `loadWorkPacketContext`. The motion tag is readable from there using
the canonical `getMotionFromTags(inboxTags)` helper that already exists
in `workPacketContract.ts`. No second DB query needed.

---

## Motion artifacts loaded in phase 1

| Artifact | Fields read | Reason |
|---|---|---|
| `motion.yaml` | `title:` line only | Label for objective and governance traceability |
| `execution.md` | Full text | Primary architect plan input — the "what to build" |

**Not loaded in phase 1:**
- `decision.yaml` — RATIFIED status already verified at activation time
- `execution.handoff.json` — handoff identity not needed by architect planner
- `verify.json`, `policy.yaml`, `vote.json` — not relevant to plan construction

---

## Plan shape

### Motion-linked packet (new path)

```json
{
  "schema": "architect-runtime-0.1",
  "agentNhId": "...",
  "workPacketId": 880,
  "requestedRole": "ARCHITECT",
  "assigneeNhId": null,
  "repoName": null,
  "motionId": "motion-0070",
  "motionTitle": "bounded council policy seam extraction",
  "plan": {
    "objective": "Architect review for governed motion motion-0070: bounded council policy seam extraction",
    "governedBy": "motion-0070",
    "executionPlan": "<full execution.md text>",
    "checkpoints": [
      "Review execution.md for motion-0070 implementation surface.",
      "Confirm proposed changes match motion success criteria.",
      "Record governed architect evidence before BUILDER handoff."
    ],
    "handoffTarget": "BUILDER"
  }
}
```

### Non-motion-linked packet (existing behavior, unchanged)

```json
{
  "schema": "architect-runtime-0.1",
  "agentNhId": "...",
  "workPacketId": 42,
  "requestedRole": "ARCHITECT",
  "assigneeNhId": null,
  "repoName": null,
  "plan": {
    "objective": "Prepare builder-ready plan for workPacket#42",
    "checkpoints": [
      "Review packet intent, status, and current execution lane.",
      "Identify likely implementation surface and delivery shape.",
      "Record architect planning evidence before builder handoff."
    ],
    "handoffTarget": "BUILDER"
  }
}
```

---

## Fallback behavior

| Condition | Behavior |
|---|---|
| No `motion:` tag in inboxTags | `motionContext = null` → generic plan (no change) |
| Repo root not found | `console.warn` + `motionContext = null` → generic plan |
| `motion.yaml` missing or unreadable | `title = motionId` (use motionId as fallback title) |
| `execution.md` missing | `console.warn` + `executionPlan = ""` → `"(execution.md absent)"` in plan |
| `execution.md` unreadable | `console.warn` + `executionPlan = ""` |

No errors thrown for missing motion artifacts. The architect runtime
continues and produces a degraded-but-valid plan.

---

## Implementation

Single file changed: `portal/src/lib/work/architectRuntime.ts`

### New imports
```ts
import fs from "node:fs";
import path from "node:path";
import { getMotionFromTags } from "@/lib/work/workPacketContract";
```

### New type
```ts
type MotionContext = {
    motionId: string;
    title: string;
    executionPlan: string;
};
```

### New helpers
- `findRepoRoot(startDir: string): string | null` — walks up from startDir
  until a directory containing `.nexus` is found (same pattern as scripts)
- `loadMotionContext(inboxTags: string[]): MotionContext | null` — calls
  `getMotionFromTags`, finds repo root, reads motion.yaml title and
  execution.md text, returns MotionContext or null

### Updated `buildArchitectPlan`
Accepts optional `motionContext?: MotionContext | null`. Returns
motion-grounded plan when present, existing generic plan when absent.

### Updated `execute()`
One added line inside the existing transaction:
```ts
const motionContext = loadMotionContext(loaded.inboxTags);
```
Passed as third argument to `buildArchitectPlan`.

---

## What is not changed

- `agentRuntime.ts` — no change
- `workPacketContract.ts` — no change (helpers already exist)
- `workPacketActions.ts` — no change
- Any builder or verifier runtime — no change
- Prisma schema — no change
- Any operator UI surface — no change
