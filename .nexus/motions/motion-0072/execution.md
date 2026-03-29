# Execution Plan - motion-0072

## Goal
Establish the motion tag convention and dry-run activation script that
form the identity bridge between the governance loop and the execution
loop. No database writes. No agent runtime changes.

## Files changed

### 1. `portal/src/lib/work/workPacketContract.ts`

Add two pure exported helpers after the existing `buildInboxTags`
function:

```typescript
const MOTION_TAG_PREFIX = "motion:";

export function buildMotionTag(motionId: string): string {
    return `${MOTION_TAG_PREFIX}${motionId}`;
}

export function getMotionFromTags(tags: string[]): string | null {
    const hit = tags.find(
        (t) => typeof t === "string" && t.startsWith(MOTION_TAG_PREFIX)
    );
    if (!hit) return null;
    const motionId = hit.slice(MOTION_TAG_PREFIX.length).trim();
    return motionId || null;
}
```

Pattern mirrors `getAssigneeFromTags` / `buildInboxTags` exactly.

### 2. `portal/scripts/activate-motion.mjs` (new)

Dry-run activation script. Reads governance artifacts and outputs the
activation intent. Exits 0 (activatable) or 1 (not activatable).

**Activatability checks (in order):**
1. Motion directory exists
2. `motion.yaml` is readable and has a `motion_id`
3. `decision.yaml` exists and `status` is `RATIFIED`
4. `execution.handoff.json` exists
5. `execution.handoff.json` status is `ISSUED`
6. Target repo is derivable from `decision.yaml` or `motion.yaml`

**Warn (not block):**
- `execution.md` absent (reduces WS-2 readiness)

**Output:**
- Per-check status lines
- Activation intent block: activation tag, route tag, suggested packet
  title, handoff ID, execution.md presence
- Final ACTIVATABLE or NOT ACTIVATABLE verdict
- Explicit confirmation that no DB writes were performed

## Validation

```
node --check portal/scripts/activate-motion.mjs
pnpm -C portal typecheck
```

## Rollback plan

- Revert the two added lines in `workPacketContract.ts`
- Delete `activate-motion.mjs`

No downstream consumers yet — both additions are additive only.
