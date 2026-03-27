# Proposal - motion-0034

## Title
Fourth Governed Slice v0: operator review + approve/request-changes proof

## Why this motion exists
The first vertical governed path is almost complete.

Already proven:
- motion-0030: architect live claim + planning evidence + builder handoff
- motion-0031: builder live claim + patch evidence + verifier handoff
- motion-0032: verifier live claim + verification evidence + operator-review handoff

That means the missing stage is not more executor runtime. The missing stage is the final human-governed operator decision.

A verifier-ready packet must be reviewable by an operator and must support two explicit outcomes:
1. approve
2. request changes

Without this proof, the first vertical slice stops one step short of full governed closure.

## What this motion changes
This motion proves the operator decision stage by:
- preparing verifier-ready packets,
- exercising operator-side approve,
- exercising operator-side request changes,
- confirming correct packet-linked SoT event emission,
- tightening operator action semantics where needed so decision outcomes are not confused with routing.

## Why this matters
JAI NEXUS is not only an executor pipeline. It is a governed collaboration platform. The operator stage is where human judgment formally closes or redirects work. If that layer is not proven, the vertical slice is incomplete.

## Proposed implementation surfaces
Likely touched paths:
- `portal/src/lib/work/workPacketActions.ts`
- operator work surface(s) under `portal/src/app/operator/work/`
- any packet control-state / lane-derivation helpers needed to reflect final operator decision state cleanly

Possible touched paths:
- `portal/src/lib/work/agentRunContract.ts`
- operator list / detail UI helpers
- packet status derivation helpers

## Suggested smoke packets
Use two fresh proof packets rather than mutating earlier proof artifacts:

### Approve proof
- NH: `1.2.103`
- Title: `Operator approve smoke test`

### Request changes proof
- NH: `1.2.104`
- Title: `Operator request changes smoke test`

For each:
- create packet in verifier lane,
- assign to verifier-capable agent,
- run verifier one-shot to reach operator-review-ready state,
- perform the operator decision from UI.

## Expected proof
### Approve branch
- verifier-ready packet is visible in operator review state
- operator clicks approve
- `WORK_APPROVED` is emitted
- packet reflects approved/finalized operator decision state

### Request changes branch
- verifier-ready packet is visible in operator review state
- operator clicks request changes
- `WORK_REVIEW_REQUESTED` is emitted
- packet reflects changes-requested operator decision state

## Scope stance
This motion should prove the final governed decision surface, not over-engineer the entire downstream rework loop.
