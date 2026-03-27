# Proposal (motion-0025)

## 0.0 Problem
dev-jai-nexus already has a usable Work Packets UI and a packet detail/edit loop, but the execution contract is still implicit and distributed across pages and runtime events.

Today the system already supports:
- packet creation
- delegation via assignee tags
- repo-scope enforcement
- packet mutation SoT events
- runtime claim/complete/fail/requeue SoT events
- debug loop artifacts

But the architecture is still missing one shared contract surface for:
- assignee derivation
- requested role derivation
- packet control/lifecycle state
- next-action guidance
- run ledger entries
- handoff history

## 1.0 Goal
Formalize the existing Work Packet system into a shared execution contract without changing core Prisma schema semantics.

## 2.0 Solution
1) Introduce shared work packet helpers in portal/src/lib/work/**
- workPacketContract.ts
- workPacketLifecycle.ts
- agentRunContract.ts

2) Centralize derived packet control state
- compute assignee from inbox tags
- compute requested role from agency agent_key
- compute packet control phase and next action

3) Centralize derived run ledger / handoff views
- map runtime/debug SoT events into operator-facing execution rows
- map delegation/claim/requeue events into handoff history rows

4) Upgrade operator work surfaces
- /operator/work shows lifecycle/control information from the shared contract
- /operator/work/new emits richer contract-aware SoT payloads
- /operator/work/[id] shows contract summary + run ledger + handoff history

## 3.0 Acceptance
- shared work packet contract helpers exist
- shared packet control state helper exists
- shared run ledger / handoff helpers exist
- /operator/work shows lifecycle/control information from the shared contract
- /operator/work/new emits contract-aware delegation metadata
- /operator/work/[id] shows contract summary + run ledger + handoff history
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- no Prisma enum migration in this motion
- no autonomous multi-repo rollout
- no ungated direct apply to canonical repo paths
- no changes to panel semantics
