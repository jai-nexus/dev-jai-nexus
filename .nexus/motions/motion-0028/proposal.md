# Proposal (motion-0028)

## 0.0 Problem
motions 0025–0027 established:
- work packet contract helpers
- control/lifecycle derivation
- run ledger projection
- handoff history projection
- governed routing actions
- operator UI wiring for execution lanes

The architecture is now significantly stronger, but it has not yet been proven in one full governed end-to-end packet flow.

Today the system can describe and route multi-agent execution, but it still needs a concrete proof slice that demonstrates:
- architect lane
- builder lane
- verifier lane
- operator review/approval lane
- packet-linked SoT continuity across the entire workflow

## 1.0 Goal
Prove one complete governed vertical slice for a single Work Packet in dev-jai-nexus:
- route to architect
- capture architect artifact/evidence
- route to builder
- capture builder artifact/evidence
- route to verifier
- capture verifier artifact/evidence
- operator approves or requests changes

## 2.0 Solution
1) Define one narrow vertical-slice packet path
- one packet
- one repo
- one explicit lane at a time
- one final review decision

2) Tighten artifact/evidence visibility
- ensure packet detail clearly shows lane progression
- ensure debug/runtime evidence appears clearly in the run ledger

3) Standardize the happy-path execution loop
- architect produces planning evidence
- builder produces patch/PR evidence
- verifier produces verification evidence
- operator approves or requests changes

4) Preserve governance boundaries
- no ungated direct repo mutation
- no background autonomous rollout
- no broad multi-repo expansion in this motion

## 3.0 Acceptance
- one packet can be routed through architect → builder → verifier → operator
- packet detail page clearly reflects lane progression
- packet-linked SoT events exist for route/review/approval transitions
- debug/runtime evidence appears in the run ledger for the slice
- operator can end in either APPROVED or CHANGES_REQUESTED path
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- no broad autonomous polyrepo rollout
- no schema migration unless strictly necessary
- no panel-system changes
- no attempt to generalize all agent behaviors in this motion
