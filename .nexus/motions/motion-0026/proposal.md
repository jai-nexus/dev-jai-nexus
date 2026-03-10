# Proposal (motion-0026)

## 0.0 Problem
motion-0025 formalized the Work Packet control plane:
- shared packet contract helpers
- centralized control-state derivation
- run ledger projection
- handoff history projection

That makes packet execution visible, but the execution loop is still too implicit.

Today:
- assignment exists via inbox tags
- runtime claim/complete/fail/requeue events exist
- handoff history is visible
- operator packet detail pages are richer

But operators still lack a deterministic way to drive the next execution lane:
- no explicit route-to-architect / builder / verifier actions
- no explicit requeue-to-assignee action
- no explicit “request changes” execution lane routing
- no shared helper that converts operator actions into consistent inbox + SoT updates

This means the system can describe multi-agent workflow, but the controlled execution loop is still soft.

## 1.0 Goal
Make the first governed execution loop explicit and operable by adding:
- deterministic operator routing actions
- explicit lane transitions
- explicit handoff signals
- clearer next-lane control state on packet detail pages

## 2.0 Solution
1) Introduce shared operator action helpers
- centralize packet execution actions in portal/src/lib/work/**
- avoid duplicating packet mutation / inbox mutation / SoT emission logic in UI pages

2) Add governed routing actions
- route to architect
- route to builder
- route to verifier
- request changes
- requeue current assignee
- approve packet

3) Make lane semantics explicit
- derive current lane from packet + inbox + run/debug signals
- derive next recommended lane
- render both in packet detail view

4) Emit explicit SoT lifecycle signals
- operator actions emit deterministic event kinds for routing / review transitions
- handoff history becomes more meaningful and less inferred

## 3.0 Acceptance
- shared operator execution action helper exists
- /operator/work/[id] exposes deterministic execution loop actions
- actions update packet / inbox state coherently
- actions emit packet-linked SoT events for routing / review transitions
- packet detail page shows current lane + next lane + operator actions
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- no autonomous background daemon rollout
- no broad polyrepo execution rollout
- no Prisma schema migration unless strictly necessary
- no ungated direct apply to canonical repo paths
- no panel-system changes
