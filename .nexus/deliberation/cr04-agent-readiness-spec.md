# CR-04 Agent Readiness Specification

**Established:** motion-0120
**Date:** 2026-04-04
**Readiness criterion:** CR-04 in `.nexus/docs/corpus-v2-readiness-criteria.md`
**Protocol reference:** `.nexus/deliberation/agent-vote-protocol.yaml`
**Closure checklist:** `.nexus/deliberation/cr04-closure-checklist.yaml`

---

## Purpose

This document is the precise, falsifiable specification for CR-04 closure.
CR-04 requires: "A JAI Agent exists that can evaluate a motion against at
least one of the six seat contract perspectives, produce a structured vote
output (yes/no/abstain with rationale), and have that output recorded in a
vote.json that passes validate_motion."

That description is sufficient to know what CR-04 requires in principle.
It is not sufficient to know when CR-04 has been met in practice. This
document converts the description into an implementation target: exact
registration requirements, exact vote output requirements, and exact evidence
that must be committed before CR-04 is declared met.

CR-04 cannot be declared met by author assertion. It is declared met when
the repo state satisfies all items in the closure checklist — verifiable by
any operator or agent reading the committed artifacts.

---

## 1. Agent identity requirements

For an agent to count as a valid CR-04 participant, the following must be
true in committed repo state:

**1.1 Agent registration**
The agent's `agent_id` must appear in the registry at
`workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` (the file
validated by `validate_agency`). The agent must have:
- A unique `agent_id` (string, no spaces, machine-readable)
- A domain assignment that includes `dev.jai.nexus`
- A repo assignment that includes `dev-jai-nexus`
- A `type` field of `panel-seat` or a compatible subtype

**1.2 Seat assignment declaration**
The agent must have a committed seat assignment artifact — a YAML file at
`.nexus/deliberation/seat-assignments/<agent_id>.yaml` — that explicitly maps
the agent to one of the six seat contracts:
- `cost-discipline`
- `architecture`
- `governance-safety`
- `operator-usability`
- `evidence-falsifiability`
- `execution-pragmatism`

The assignment artifact must reference the seat contract by its `seat_id`
field and by its file path in `.nexus/deliberation/seat-contracts/`.

**Why registration and seat assignment must both be committed:**
An agent that exists in the registry but has no seat assignment is a registry
entry, not a panel participant. An agent with a seat assignment but no registry
entry is a document claim. Both must be present for the agent to count.

---

## 2. Seat assignment requirements

Once an agent has a committed seat assignment, it is bound to evaluate motions
from that seat's perspective. The evaluation must demonstrably consume the
seat contract as context.

**2.1 Primary evaluation context**
The agent must consume, at minimum:
- The seat contract's `distinctive_questions` field: the agent's evaluation
  must explicitly address at least one distinctive question from the assigned
  seat contract.
- The seat contract's `block_conditions` field: the agent's evaluation must
  explicitly check each block condition and record whether it was triggered
  or not triggered.

"Consume" means the evaluation_trace artifact (see §5) is traceable to the
specific questions and conditions in the seat contract YAML. An evaluation
that reaches a conclusion without engaging these fields does not satisfy the
seat assignment requirement.

**2.2 Seat contract version**
The evaluation_trace must record the version of the seat contract consumed
(the `version` field from the seat contract YAML). If the seat contract is
updated, prior evaluations remain valid under the version they recorded.

---

## 3. Vote output field requirements

The agent's vote.json must satisfy two schema layers:

**3.1 Existing human vote schema (required, must not be broken)**
The agent vote.json must contain all fields required by the current human
vote schema, including:
- `motion_id`
- `voted_at` (ISO 8601)
- `panel` array with at least one entry naming the agent (by agent_id, not
  human identity)
- `outcome` object with nested fields: `yes`, `no`, `abstain`,
  `yes_with_reservations`, `result`, `reasons`, `missing_required_roles`

The existing `validate_motion` gate must pass on the agent's vote.json
without modification to the validator.

**3.2 Agent vote protocol extension (required for CR-04 closure)**
The agent vote.json must additionally contain the extension fields defined
in `.nexus/deliberation/agent-vote-protocol.yaml`:
- `vote_type: "agent"` (distinguishes from human vote)
- `agent_id`: the agent's registered identifier
- `seat_id`: the assigned seat perspective
- `seat_contract_ref`: path to the seat contract YAML file consumed
- `seat_contract_version`: the version string from the consumed contract
- `evaluation_trace_ref`: path to the committed evaluation trace artifact
- `model`: the model identifier used to produce the evaluation
- `protocol_version`: the version of agent-vote-protocol.yaml used

---

## 4. Validation requirements

The agent's vote.json is a governed vote only if it passes validation:

**4.1 Required gate**
`node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-NNNN/motion.yaml`
must exit 0 for the motion the agent voted on.

An agent vote.json that exists but was produced for a motion whose
validate_motion gate fails is not a governed vote for CR-04 purposes.

**4.2 Schema compliance**
The agent vote.json must parse as valid JSON. All required fields from both
the human vote schema (§3.1) and the agent extension schema (§3.2) must be
present and correctly typed.

**4.3 Evaluation trace reachability**
The `evaluation_trace_ref` path in the vote.json must resolve to a committed
file in the repo. The trace file must exist and be parseable.

---

## 5. Evidence requirements

The following must be committed to the repo before CR-04 is declared met.
"Committed" means present in the repo's default branch (main), not on a
feature branch.

**5.1 Required committed artifacts:**
1. `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` — updated
   to include the agent's registration entry
2. `.nexus/deliberation/seat-assignments/<agent_id>.yaml` — committed seat
   assignment mapping the agent to a seat contract
3. `.nexus/motions/motion-NNNN/vote.json` — the agent's governed vote on a
   real motion, satisfying both schema layers
4. `.nexus/deliberation/evaluation-traces/<agent_id>-<motion_id>-trace.yaml`
   (or equivalent path) — the evaluation trace referenced by the vote.json
5. `.nexus/motions/motion-NNNN/verify.json` — recording the validate_motion
   gate result for the voted motion

**5.2 Evidence must be self-contained**
Each artifact must be independently readable. The trace must not require
reading the session transcript to interpret. The vote.json must not require
the author's explanation to understand which agent produced it and why.

---

## 6. Minimum viable first agent

CR-04 does not require a full six-seat panel. It does not require multiple
agents. It does not require the Corpus V2 governance mechanism to be fully
specified. It requires the minimum bar that distinguishes a real governed
agent vote from a human operator writing a vote.json with an agent name in it.

**The minimum bar is:**
- One registered agent (in agents.generated.yaml)
- One committed seat assignment
- One real motion evaluated (the motion must be a real governance motion,
  not a test stub)
- One vote.json satisfying both schema layers
- One evaluation trace that engages the assigned seat contract's
  distinctive_questions and block_conditions
- validate_motion exit 0 on the voted motion

**What exceeds the minimum bar (not required for CR-04):**
- Multiple agents
- Multiple seat perspectives
- Full panel deliberation (all six seats)
- The Corpus V2 vote aggregation mechanism
- Agent-written proposal.md or challenge.md (the agent votes; it does not
  author the full motion package unless a separate motion governs that)

**The minimum bar is the bar.** CR-04 is met when the minimum bar is cleared.
It is not met when something that looks like the minimum bar is achieved
informally. The closure checklist (`cr04-closure-checklist.yaml`) is the
governed record of closure.
