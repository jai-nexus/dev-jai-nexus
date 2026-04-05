# Proposal: CR-04 JAI Agent Operational v0 — minimum viable first agent, governed seat assignment, and traceable agent vote proof

**Motion:** motion-0121
**Kind:** governance-policy
**Date:** 2026-04-05

---

## Where we are

motion-0120 produced the specification layer for CR-04 closure:
- A precise, falsifiable definition of what "JAI Agent operational" requires
- An agent vote protocol (v0) governing how agent-produced votes are recorded
- A seven-item machine-checkable closure checklist
- An updated readiness criteria document (4 met / 2 partial / 4 unmet)
- A launch packet opening this implementation line

All seven items on the CR-04 closure checklist (`cr04-closure-checklist.yaml`)
are currently `status: unmet`. The spec exists. The protocol exists. The bar
is set. Nothing has cleared it.

motion-0121 is the first real implementation motion against that spec.

---

## The CR-03 entrance gate

Before proceeding to CR-04 implementation, this motion line must pass
a CR-03 entrance gate. CR-03 requires:

> "At least five consecutive post-0118 motions demonstrate consistent
> quality-standard compliance (verified by the Evidence/Falsifiability
> and Governance/Safety seat-contract checks)."

As of this motion, the post-0118 corpus contains motions 0118, 0119, 0120,
and 0121 — four motions. A formal CR-03 compliance record documenting the
seat-contract evaluation for each of these four motions serves two purposes:

1. It demonstrates that the quality standard is being applied consistently
   and that the seat contracts from motion-0119 are operational as
   deliberation tools in Corpus V1.
2. It establishes the compliance record as a governed artifact that a future
   motion can extend to close CR-03 when the fifth motion is complete.

The entrance gate does not claim CR-03 is met. It establishes the record
that makes CR-03 closure traceable and governed rather than asserted.

---

## The primary gap: CR-04 is unmet because no agent exists

The closure checklist starts at CR04-01: agent registration. An agent's
`agent_id` must appear in the registry at
`workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` with a
domain assignment that includes `dev.jai.nexus`, a repo assignment that
includes `dev-jai-nexus`, and a `type` field of `panel-seat` or compatible.

No such entry currently exists.

Until CR04-01 is closed, none of the subsequent checklist items can be
closed either: you cannot assign a seat to an agent that is not registered,
and you cannot produce a governed vote from an agent that has no seat.

The implementation sequence is strictly ordered: register first, assign
seat second, produce vote third, commit trace fourth, close checklist fifth.

---

## The first agent: minimum viable, not maximum capable

The CR-04 spec defines the minimum bar explicitly:

> "One registered agent, one seat, one evaluated motion, one committed
> governed vote, one evaluation trace."

This motion implements exactly that minimum bar. It does not implement:
- A full six-seat panel
- Multiple agents
- The Corpus V2 vote aggregation mechanism
- Agent-authored motion packages
- Any runtime or portal infrastructure

The minimum viable first agent is:
- **agent_id:** `jai-agent-001`
- **type:** `panel-seat`
- **domain assignment:** `dev.jai.nexus`
- **repo assignment:** `dev-jai-nexus`
- **assigned seat:** `evidence-falsifiability`

The `evidence-falsifiability` seat is chosen for the first agent because:
1. Its distinctive_questions are directly applicable to any governance motion
   (can claims be verified? is the evidence chain traceable?).
2. Its block_conditions are the most structurally checkable from the motion
   package alone — no runtime context required.
3. It maps to the motion quality standard dimensions most likely to surface
   genuine compliance gaps in early-corpus motions.
4. The evaluation output is the most useful immediately: a structured
   falsifiability assessment of motion-0121's own evidence chain, which
   serves as both the CR-04 proof and a lived demonstration of the seat
   contract system.

---

## The governed vote: the agent evaluates its own inauguration motion

The most coherent target for the first agent's vote is motion-0121 itself.
This is not circular — it is the correct sequence:

1. The motion-0121 package is authored and committed.
2. The implementation step registers the agent and assigns the seat.
3. The registered agent evaluates the completed motion-0121 package using
   the evidence-falsifiability seat contract as evaluation context.
4. The agent's vote.json and evaluation trace are committed to the repo.
5. The human ratification vote remains the governed ratification event.
6. The CR-04 closure checklist items are updated to `met`.

The agent does not ratify motion-0121. The agent evaluates motion-0121 from
the evidence-falsifiability perspective and produces a structured verdict.
The human ratification vote proceeds independently. In Corpus V1, the agent
vote is not a gatekeeping vote — it is the proof that a real agent can
evaluate a real motion against a real seat contract and produce a governed
output. That proof is what CR-04 requires.

Evaluating motion-0121 is cleaner than evaluating a prior motion (e.g.,
motion-0120) because:
- The agent is being instantiated to evaluate governance motions; the first
  motion it evaluates is the one that instantiates it. This is the most
  direct proof path.
- The motion-0121 package is complete and known at evaluation time; a prior
  motion's context would require reading the entire prior branch arc.
- If the evidence-falsifiability seat finds genuine gaps in motion-0121's
  evidence chain, those gaps can be addressed before ratification. This is
  the seat contract system working as designed.

---

## The evaluation trace: governed, committed, and readable

The evaluation trace is not a scratchpad. It is a committed governance
artifact. Per `agent-vote-protocol.yaml` §2, it must contain:
- `motion_id`, `agent_id`, `seat_id`, `seat_contract_ref`
- `questions_evaluated`: non-empty list, each entry referencing a
  `distinctive_question` from the seat contract with the agent's response
- `block_conditions_checked`: non-empty list, each entry stating whether
  the condition was triggered or not triggered
- `pass_or_block`: the seat's conclusion (PASS / BLOCK / ESCALATE)
- `reasoning`: free-text explanation specific enough to reconstruct the
  evaluation without the session transcript

The trace must be at the path referenced by `evaluation_trace_ref` in the
vote.json. The path must be committed. The trace must be independently
readable without the session transcript.

---

## The stop rule

motion-0121 stops when:
1. All seven CR-04 closure checklist items have `status: met` and
   `closed_by: motion-0121` in committed repo state, OR
2. Implementation encounters a genuine blocker that requires a separate
   motion (e.g., agents.generated.yaml schema does not support the required
   fields without a schema change, or validate_motion rejects the agent
   vote.json extension fields).

motion-0121 does NOT proceed to:
- Authoring a Corpus V2 opening motion
- Declaring CR-05 scope
- Implementing multi-agent panel infrastructure
- Making the agent vote the governing ratification mechanism for future motions

If CR-04 closes cleanly (all seven items met), the next motion in this
program line is a separate decision: either proceed to CR-05 planning or
address remaining parallel-track criteria first (CR-03, CR-06, CR-07).
That decision belongs to the next session, not to this motion.

---

## What this motion produces

### Phase 1 — CR-03 entrance gate

**New file:** `.nexus/deliberation/cr03-compliance-record.yaml`

A structured compliance assessment for motions 0118–0121 against the five
quality dimensions. For each motion: dimension-by-dimension PASS/FAIL, the
specific evidence that supports each assessment, and the seat-contract lens
applied (Evidence/Falsifiability and Governance/Safety as specified by CR-03).
Does not claim CR-03 is met — records the current compliance state honestly.

### Phase 2 — Agent registration and seat assignment

**Updated file:** `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`

Add `jai-agent-001` with `type: panel-seat`, `domain: dev.jai.nexus`,
`repo: dev-jai-nexus`.

**New file:** `.nexus/deliberation/seat-assignments/jai-agent-001.yaml`

Committed seat assignment mapping `jai-agent-001` to the
`evidence-falsifiability` seat contract. References the seat contract path
and version. Closes CR04-01 and CR04-02.

### Phase 3 — Governed vote and evaluation trace

**New file:** `.nexus/motions/motion-0121/agent-vote.json`

The agent's vote on motion-0121 using the evidence-falsifiability seat.
Satisfies both the human vote schema (nested outcome object) and all
agent-vote-protocol extension fields (vote_type: agent, agent_id, seat_id,
seat_contract_ref, seat_contract_version, evaluation_trace_ref, model,
protocol_version). Closes CR04-03 and CR04-04.

**New file:** `.nexus/deliberation/evaluation-traces/jai-agent-001-motion-0121-trace.yaml`

The evaluation trace. Contains non-empty `questions_evaluated` (addressing
all five distinctive_questions from the evidence-falsifiability seat contract)
and `block_conditions_checked` (checking all four block_conditions). Records
`pass_or_block` and `reasoning`. Closes CR04-05, CR04-06, and CR04-07 (in
combination with the validate_motion gate).

### Phase 4 — Closure

**Updated file:** `.nexus/deliberation/cr04-closure-checklist.yaml`

All seven items promoted to `status: met`, `closed_by: motion-0121`.

**Updated file:** `.nexus/docs/corpus-v2-readiness-criteria.md`

CR-04 promoted to `met`. Summary updated to 5 met / 2 partial / 3 unmet
(assuming CR-03 remains partial after this motion's compliance record
covers 4 of 5 required motions).

---

## What this motion does NOT do

- Does not declare Corpus V2 started
- Does not author a Corpus V2 opening motion
- Does not implement a multi-agent panel
- Does not make the agent vote a governing ratification mechanism
- Does not change runtime, portal, UI, or DB behavior
- Does not reopen normalization
- Does not widen into OffBook.ai rollout work
- Does not modify any prior motion package
- Does not close CR-03 (4 of 5 required motions covered; one more needed)
- Does not close CR-05, CR-06, or CR-07

---

## Success criteria

1. `jai-agent-001` is registered in agents.generated.yaml with the correct
   domain, repo, and type fields. `validate_agency` still exits 0.
2. `.nexus/deliberation/seat-assignments/jai-agent-001.yaml` exists and
   references the evidence-falsifiability seat contract.
3. `.nexus/motions/motion-0121/agent-vote.json` exists with `vote_type: agent`,
   all eight protocol extension fields present, and `outcome.result` set.
   `validate_motion` exits 0 for motion-0121.
4. `.nexus/deliberation/evaluation-traces/jai-agent-001-motion-0121-trace.yaml`
   exists with non-empty `questions_evaluated` and `block_conditions_checked`.
5. All seven CR-04 closure checklist items show `status: met` with
   `closed_by: motion-0121`.
6. `corpus-v2-readiness-criteria.md` shows CR-04 `current_status: met`.
7. CR-03 compliance record committed and covers motions 0118–0121 with
   honest, per-dimension assessments.
8. No fake agent vote — `jai-agent-001` resolves to a registered entry
   in agents.generated.yaml before any vote.json is produced.
