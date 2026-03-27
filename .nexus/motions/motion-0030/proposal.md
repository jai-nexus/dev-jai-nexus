# Proposal (motion-0030)

## 0.0 Problem
motions 0025–0029 established the governed work packet contract, execution lanes, routing actions, vertical slice visibility, and explicit separation between governance agents and execution-capable agents.

However, the system is still mostly operator-driven. Work packets can be routed into execution lanes, but no live execution-capable agent currently claims a packet and advances it through a real governed runtime loop.

## 1.0 Goal
Introduce the first real execution-capable runner for the architect lane only.

This runner should:
- discover architect-routed work packets
- claim eligible architect work
- emit runtime SoT evidence
- emit planning/debug evidence
- mark the architect slice complete
- hand the packet forward into builder readiness without skipping operator/governed state

## 2.0 Solution
1) Implement an architect-only live runner
- process packets whose canonical execution role is ARCHITECT
- only claim packets assigned to architect-capable execution agents
- respect explicit execution eligibility from agency configuration

2) Emit governed runtime evidence
- emit WORK_CLAIMED when the runner starts work
- emit debug.plan (or equivalent planning evidence) when planning output is produced
- emit WORK_COMPLETED for the architect runtime slice when the planning stage completes

3) Write deterministic planning output
- create durable planning evidence linked to the packet
- keep outputs deterministic and packet-linked
- do not silently mutate packet state without SoT evidence

4) Perform governed handoff
- after architect completion, hand the packet to the next governed lane
- packet should become builder-ready through explicit routing/handoff semantics
- preserve operator visibility and audit trail

## 3.0 Acceptance
- at least one architect-capable execution agent can claim eligible work
- claim emits packet-linked runtime SoT evidence
- planning evidence is written and visible in operator surfaces
- architect slice can complete and hand off toward builder
- assignment respects execution-role eligibility from motion-0029
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- no builder/verifier live automation yet
- no multi-agent concurrency rollout
- no autonomous merge/apply behavior
- no broad scheduler/orchestrator system
