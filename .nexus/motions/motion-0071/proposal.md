# Proposal - motion-0071

## Title
bounded governed loop activation — motion to execution to receipt

## This motion is a planning and decomposition artifact

motion-0071 does not implement code. It defines the quarter program,
establishes the workstream sequence, and ratifies the decomposition
approach. Each workstream will be executed through its own short-lived
implementation branch, governed by its own bounded child motion or
ratified slice.

---

## Current loop map

dev-jai-nexus has two loops today. Both are real and functional. They
do not talk to each other.

```
GOVERNANCE LOOP (.nexus/ files)          EXECUTION LOOP (database + portal)
────────────────────────────             ─────────────────────────────────
motion.yaml proposed                     WorkPacket created (DRAFT)
  ↓ council:run                            ↓ ROUTE_ARCHITECT tag
policy evaluation                         AgentInboxItem queued
  ↓ vote.json                              ↓ run-architect-once.ts
decision.yaml → RATIFIED                  debug.plan SoT emitted
  ↓ issue-execution-handoff.mjs            ↓ applyPacketRouteAction → BUILDER
execution.handoff.json (ISSUED)           debug.patch SoT emitted
  ↓ record-execution-receipt.mjs           ↓ applyPacketRouteAction → VERIFIER
execution.receipt.json (COMPLETED)        debug.verify SoT emitted
                                           ↓ OPERATOR_REVIEW → APPROVE
                                          WorkPacket status → DONE
```

These two loops share no code path. A ratified motion does not produce a
work packet. Work packet completion does not close a receipt. Agent
runtimes have no awareness of the motion governing their work. Operators
viewing the work surface see no governance context.

---

## Why the loop does not yet feel alive

Five specific gaps make the loop feel dead:

**1. No motion → work packet bridge.**
Ratification lands in `.nexus/motions/*/decision.yaml`. Nothing reads
that and creates a work packet. The execution loop has no entry point
from the governance loop.

**2. WorkPacket has no motion identity.**
The `WorkPacket` schema has no `motionId` field. `AgentInboxItem.tags`
can carry `motion:X` but nothing sets or reads this. Without motion
identity on a packet, the two loops cannot be correlated at any stage.

**3. Agent runtimes are motion-blind.**
`ArchitectAgentRuntime.execute()` produces a hardcoded three-checkpoint
template. It does not read `execution.md`, the motion context bundle, or
any governed artifact. The architect pass records an artifact that has no
connection to the ratified plan.

**4. Handoff and receipt artifacts are invisible to the operator.**
`/operator/work/[id]` shows execution lane state, run ledger, and SoT
handoff events — but shows nothing from `execution.handoff.json` or
`execution.receipt.json`. An operator reviewing a work packet cannot see
whether a motion is governing the work they are approving.

**5. No receipt closure path.**
When an operator approves a motion-linked work packet, there is no
prompted or automatic path to record `execution.receipt.json` as
COMPLETED. The governed loop has an explicit receipt artifact
(`record-execution-receipt.mjs`) but no trigger connects packet
completion to receipt closure.

---

## Proposed workstreams

### WS-1 — Motion-to-packet activation bridge
**The foundational connector. All other workstreams depend on it.**

Add a `motion:X` tag convention to `workPacketContract.ts` and a CLI
script (`activate-motion.mjs`) that:
- reads a RATIFIED motion's `execution.handoff.json`
- validates the handoff is in ISSUED state
- creates a work packet tagged `motion:motion-XXXX` and routed to
  ARCHITECT

This uses the existing `AgentInboxItem.tags` system — no schema
migration required. It establishes the traceability link that WS-2
through WS-5 all rely on.

**Touched files:** `workPacketContract.ts` (new tag helpers),
`activate-motion.mjs` (new script)

---

### WS-2 — Agent runtime motion context binding
Given a work packet with a `motion:X` tag, the architect runtime should
load `execution.md` and the motion's context bundle as its plan input.
The plan artifact becomes motion-grounded rather than a hardcoded stub.

**Touched files:** `architectRuntime.ts`, optionally `builderRuntime.ts`
**Prerequisite:** WS-1 (tag convention must exist)

---

### WS-3 — Operator motion state surface
Add a read-only operator view that shows a motion's:
- council `decision.yaml` status
- `execution.handoff.json` state (ISSUED / absent)
- `execution.receipt.json` state (COMPLETED / FAILED / absent)

This is a server-side file read from Next.js. No schema change required.
The operator can see live loop state without reading `.nexus/` files
manually.

**Touched files:** new operator route or addition to
`/operator/work/[id]`

---

### WS-4 — Receipt closure from operator approval
When an operator approves a motion-linked work packet, surface an
explicit path to record `execution.receipt.json` as COMPLETED. This
closes the governed loop with a durable receipt artifact and makes the
approval action visible in the governance record.

**Touched files:** operator work UI action handler or
`workPacketActions.ts`
**Prerequisite:** WS-1, WS-3

---

### WS-5 — Loop coherence gate
A validation script (`validate-loop-coherence.mjs`) that, given a
motionId, checks the full chain:
- decision RATIFIED
- handoff ISSUED
- work packet with `motion:X` tag exists
- receipt COMPLETED if packet DONE

Produces a single PASS/FAIL judgment on loop completeness. Can be run
manually or added as an optional gate in `council.config.yaml`.

**Touched files:** new script, optionally `council.config.yaml`
**Prerequisite:** WS-1 through WS-4

---

## Why WS-1 must be first

WS-2 through WS-5 all require a work packet that knows which motion it
belongs to. Without the tag convention and the activation script:
- The agent runtimes have no motionId to load context from (WS-2)
- The operator state surface has no packet to correlate with (WS-3)
- The receipt closure has no packet to detect as DONE (WS-4)
- The coherence gate has no packet to check (WS-5)

WS-1 is the seam point. It is also the narrowest and safest first
slice: two files, no schema change, independently deployable.
