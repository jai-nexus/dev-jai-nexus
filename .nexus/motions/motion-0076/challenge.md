# Challenge - motion-0076

## Risks

### Risk 1 — Queue item reset on repeat runs
`enqueue-motion-packet.mjs` uses upsert semantics that reset the queue
item's agentNhId, repoScope, and status to PENDING on every run. If an
operator runs the script while the packet is in-progress (status=CLAIMED
or IN_PROGRESS), the reset would interrupt an active claim.

**Response:** The script is a pre-proof setup step, not a production
routing operator. It is run manually before the proof invocation. For
production routing, the operator surface or `applyPacketRouteAction` is
the correct path. This risk is documented and acceptable for the proof
slice.

**Additional mitigation:** After the architect processes the packet, the
inbox tags become `route:BUILDER`. The route-stage guard (Risk 5 below
was the trigger) now prevents re-running the script for a packet that has
moved past architect stage — reducing accidental resets post-completion.

### Risk 2 — Auto-detected agent may not be the intended ARCHITECT
The auto-detect picks the first ARCHITECT-capable agent in agency.yaml
order. If agency.yaml gains a second ARCHITECT agent, the wrong agent
might be selected.

**Response:** The `--agent <nhId>` override allows explicit selection.
The auto-detect is only used when `--agent` is not provided. The output
always prints the selected agentNhId so the operator can verify.

### Risk 3 — repoScope=['targetRepo'] may not match repo name in DB
If the WorkPacket's `repoName` (from `repo.name`) differs from
`motion.yaml target.repo`, the scope validation passes (using the queue
item's repoScope) but the downstream SoT event shows a mismatched repo.

**Response:** WorkPacket 880 has no repoId/repoName (null). The scope
validation uses only the queue item's repoScope, which is `dev-jai-nexus`
from the motion's `target.repo`. The SoT event uses `repoId` from the
packet, which remains null. No false mismatch is introduced.

### Risk 4 — Script is a proof-only stepping stone
This script creates queue items that should eventually be created by a
proper routing surface. Running it in production for many motions would
bypass the operator routing flow.

**Response:** This is explicitly a bounded proof slice. The script is
labeled and documented as a WS-2 proof enabler. Production routing remains
the operator surface's responsibility (WS-3 scope). The script name and
output make its purpose clear.

### Risk 5 — Script enqueues for architect even when packet is past architect stage
The initial version of `enqueue-motion-packet.mjs` only checked for a live
`AgentInboxItem` with the `motion:` tag. After the architect processes a packet,
`applyPacketRouteAction(ROUTE_BUILDER)` updates the inbox tags to
`["motion:<id>", "route:BUILDER"]` but does not change the inbox item's
status to DONE/CANCELED. A repeat run of the script would find the item
(status=QUEUED, not filtered out), upsert a new architect queue item — but
`ArchitectAgentRuntime.canClaimCandidate()` correctly checks
`packet.requestedRole === "ARCHITECT"` and skips the packet silently.
The result is an unclaimed, stale queue item and no obvious error.

**Confirmed in live investigation:** motion-0070 inbox item had
`tags=["motion:motion-0070","route:BUILDER"]` after the first proof run.
The original script would have created an unclaimable queue item.

**Response:** Added `parseRouteFromTags()` helper and a route-stage guard
immediately after the inbox item query. If the `route:` tag is anything other
than `ARCHITECT`, the script exits 1 with a clear message identifying the
current route and explaining why enqueuing is refused. This aligns the script's
pre-condition with the runtime's `canClaimCandidate` invariant.

### Risk 6 — Architect runtime processes DRAFT WorkPacket
WorkPacket 881 (motion-0069) has `status=DRAFT`. The architect runtime does not check
WorkPacket status — it only checks `requestedRole === 'ARCHITECT'` from
the inbox tags.

**Response:** The existing runtime design allows claiming DRAFT packets.
The debug.plan SoT artifact is created regardless of packet status. The
packet status transition is handled by the completion + route action.
This is consistent with current runtime semantics.

---

## Objections and responses

- **"Why not extend activate-motion.mjs to create the queue item at
  activation time?"**
  Activation creates the packet. Queue assignment is a routing step.
  Conflating them would violate the separation established by WS-1.
  A separate script keeps each step's responsibility clear and auditable.

- **"Why not use applyPacketRouteAction instead of raw Prisma?"**
  `applyPacketRouteAction` is a TypeScript module that cannot be directly
  imported from an `.mjs` script. It also emits SoT events and modifies
  WorkPacket status — both are beyond the intent of this minimal queue
  readiness step. Raw Prisma upsert is smaller, more direct, and does
  exactly what's needed.

- **"Why not set repoId on the WorkPacket?"**
  Setting `repoId` requires knowing which Repo record in the DB corresponds
  to `dev-jai-nexus`. That's a DB lookup outside the motion artifacts.
  The `repoScope` approach works without any WorkPacket mutation and
  respects motion-0073's explicit non-goal: "Do not look up or wire repoId
  at creation time."

---

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.06
