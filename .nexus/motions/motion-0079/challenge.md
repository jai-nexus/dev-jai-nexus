# Challenge: bounded verifier runtime readiness for motion-linked packets

**Motion:** motion-0079
**Challenger role:** DEV Challenger (6.0.3)
**Date:** 2026-03-30

## Challenges raised

### C1: Is removing the dead imports in scope for a motion-context binding slice?

The dead imports (`crypto`, `Prisma`, `assertSotEventV01`, `compactText`)
are not strictly related to motion-context binding.

**Resolution:** These imports are dead code: they are present in the file
but not called anywhere. Removing them reduces confusion and eliminates
future "why is this imported" audit burden. The change is within the
bounded file scope of this motion. TypeScript will confirm via typecheck
that nothing breaks.

### C2: Should verifier read architect or builder artifacts in addition to motion.yaml and execution.md?

Builder produces a `debug.patch` SoT event. Should verifier read that
artifact to make its verification grounded in what the builder actually
produced?

**Resolution:** The same question was considered for the builder phase
(motion-0077) and resolved with the same answer: read only `motion.yaml`
(title) and `execution.md`. The debug.patch SoT event lives in the
database and is not a file artifact; reading DB records in a filesystem
context loader is out of pattern. The execution.md is the canonical
governed plan. This remains the correct minimum for this phase.

### C3: Is the queue gap the same root cause as the builder gap?

Yes. `applyPacketRouteAction("ROUTE_VERIFIER", clearAssignee=true)` calls
`syncAgentQueueItemForPacket(null)` which deletes the queue item. The fix
is identical in structure to motion-0078.

**Resolution:** Confirmed. `enqueue-verifier-packet.mjs` applies the same
proven pattern. No further analysis needed.

### C4: Does completing WS-2 in one branch change governance obligations?

This motion covers two concerns (context binding + queue readiness) that
were separate motions in prior phases.

**Resolution:** The prior phases separated them because the patterns were
unproven. Now that both patterns are proven and reviewed (motion-0075/0077
for binding, motion-0076/0078 for queue readiness), combining them in a
single WS-2 completion motion is the minimal coherent slice. A single
reviewable motion is better than two near-identical ones.

## Verdict

No blockers. Challenges C1–C4 resolved inline. Proceed with implementation.
