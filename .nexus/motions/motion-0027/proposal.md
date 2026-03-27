# Proposal (motion-0027)

## 0.0 Problem
motion-0026 introduced execution-loop foundations:
- shared execution lane derivation
- shared work packet routing action helpers

But those helpers are not yet wired into the operator work surfaces.

Today:
- portal/src/lib/work/executionLane.ts exists
- portal/src/lib/work/workPacketActions.ts exists
- Work Packet operator pages still do not expose the execution loop in a first-class way

This means the architecture is improving, but the operator UI still does not fully express:
- current lane
- next lane
- route-to-architect / builder / verifier actions
- request changes / requeue / approve actions

## 1.0 Goal
Wire the governed execution-loop helpers into the operator work surfaces so packet routing becomes visible and usable from the UI.

## 2.0 Solution
1) Update /operator/work
- show execution lane state in the list view
- show clearer execution-loop hints per packet

2) Update /operator/work/[id]
- show current lane + next lane
- expose governed execution-loop actions
- use shared workPacketActions helper for server-side mutations
- display lane/routing state using shared executionLane helper

3) Keep execution governed
- preserve explicit operator actions
- preserve packet-linked SoT history
- do not introduce ungated repo mutation

## 3.0 Acceptance
- /operator/work displays lane-aware control state
- /operator/work/[id] displays current lane + next lane
- /operator/work/[id] exposes governed routing actions
- routing actions use shared helper(s), not ad hoc page logic
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- no autonomous background execution rollout
- no schema migration unless strictly necessary
- no direct ungated apply to canonical repo paths
- no panel-system changes
