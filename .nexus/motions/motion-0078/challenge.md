# Challenge: bounded builder queue readiness for motion-linked packets

**Motion:** motion-0078
**Challenger role:** DEV Challenger (6.0.3)
**Date:** 2026-03-30

## Challenges raised

### C1: Why not fix syncAgentQueueItemForPacket to preserve the queue item on route?

The root cause is that `applyPacketRouteAction("ROUTE_BUILDER")` clears the
assignee and therefore deletes the queue item. Fixing the queue sync logic
to preserve a pending queue item during route-without-assignee would
eliminate the need for a separate enqueue script.

**Resolution:** Changing `syncAgentQueueItemForPacket` or `workPacketActions.ts`
is a high-sensitivity surface that affects all route actions across all roles.
The script approach is narrower, safer, and follows the precedent of
`enqueue-motion-packet.mjs`. The root-cause fix is a legitimate future
improvement but is not required to unblock the proof and is out of scope
for this bounded slice.

### C2: Why not add a --role flag to enqueue-motion-packet.mjs rather than a new script?

Generalizing the existing ARCHITECT script with a `--role` flag would add
one file and cover both roles.

**Resolution:** The ARCHITECT bridge is proven and ratified (motion-0076).
Modifying it introduces regression risk in a validated path. The symmetric
script pattern keeps each role's readiness bridge independently reviewable
and auditable. The duplication cost is low; the isolation benefit is high.

### C3: Is motion-0070 the correct proof candidate?

The prompt mentions motion-0069. motion-0069 is PROPOSED, not RATIFIED.

**Resolution:** motion-0070 is the correct proof candidate. It is RATIFIED,
has an issued handoff, was activated by motion-0074, and was processed by
architect runtime during the motion-0076 proof. Its work packet is now at
`route:BUILDER` stage. The prompt's mention of motion-0069 appears to be a
reference to the agent that ran the proof (agent 6.0.10 ran against the
motion-0070 packet), not the motion being proved. motion-0070 is used.

### C4: What if the motion-0070 queue item was already re-created by something else?

The script uses upsert semantics, so a pre-existing queue item for the
packet is reset to PENDING. This is the same idempotent approach as the
ARCHITECT script and is safe.

## Verdict

No blockers. Challenges C1–C4 resolved inline. Proceed with implementation.
