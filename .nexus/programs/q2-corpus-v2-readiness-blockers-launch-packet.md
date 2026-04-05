# Launch Packet: Corpus V2 Readiness Blockers — CR-04 JAI Agent Operational Implementation

**Program:** q2-corpus-v2-readiness-blockers
**First motion:** motion-0120
**Branch:** sprint/q2-corpus-v2-readiness-blockers
**Prepared:** 2026-04-04
**Prepared by:** JerryIngram / operator

---

## 1. Goal

Close the minimum blocking Corpus V2 readiness criteria so that the Corpus V2
opening motion (CR-05) can be planned and ratified honestly.

### Done when

CR-04 is declared met: all seven items in `.nexus/deliberation/cr04-closure-checklist.yaml`
have `status: met` in committed repo state, attributable to a ratified motion. An agent
with a registered identity has produced a governed vote.json for at least one real motion,
the vote.json passes `validate_motion`, and the evaluation trace is committed and
references the agent's assigned seat contract.

### Success criteria

1. An agent_id is registered in agents.generated.yaml with dev.jai.nexus domain
   assignment and dev-jai-nexus repo assignment.
2. A seat assignment artifact exists at `.nexus/deliberation/seat-assignments/<agent_id>.yaml`
   mapping the agent to one of the six seat contracts.
3. The agent has produced a vote.json for at least one real motion satisfying both
   the human vote schema and the agent-vote-protocol extension fields.
4. The vote.json passes `validate_motion` (exit 0).
5. An evaluation trace is committed at the path referenced by `evaluation_trace_ref`
   in the vote.json, containing non-empty `questions_evaluated` and
   `block_conditions_checked` lists from the assigned seat contract.
6. All seven items in `cr04-closure-checklist.yaml` show `status: met`.
7. A ratified motion records the CR-04 closure event and promotes CR-04 to `met`
   in `corpus-v2-readiness-criteria.md`.

---

## 2. Baseline

### Relevant prior motions

| Motion | What it established |
|---|---|
| motion-0118 | Corpus V1 Program Planning Canon v0: 9-phase workflow, program graph, launch-packet template, context inheritance rules |
| motion-0119 | Corpus V1 Deliberation Readiness v0: six seat contracts, escalation ladder, motion-folder phase guide, launch-packet activation path, V2 readiness criteria |
| motion-0120 | CR-04 agent readiness spec, agent vote protocol, closure checklist, updated readiness criteria, this launch packet |

### Relevant substrate artifacts

- `.nexus/deliberation/seat-contracts/` — six per-seat YAML contracts (the evaluation context the agent must consume)
- `.nexus/deliberation/cr04-agent-readiness-spec.md` — the precise CR-04 closure definition
- `.nexus/deliberation/agent-vote-protocol.yaml` — the schema the agent's vote.json must satisfy
- `.nexus/deliberation/cr04-closure-checklist.yaml` — the machine-checkable pre-conditions list
- `.nexus/deliberation/escalation-ladder.yaml` — governs what tier of deliberation the first agent vote requires
- `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` — where the agent must be registered
- `.nexus/docs/corpus-v2-readiness-criteria.md` — the document that must be updated when CR-04 is met

### Current state

motion-0120 is ratified. The spec, protocol, and checklist are committed. No agent is
registered. No agent has produced a vote. CR-04 is unmet. The next motion in this
line implements the minimum viable first agent: registration, seat assignment, first
governed vote, evaluation trace, CR-04 closure declaration.

---

## 3. Constraints

### Hard constraints — must not be violated

- Do not declare Corpus V2 started before CR-04 is met and a separate Corpus V2
  opening motion is ratified. The first agent-produced vote.json does not start Corpus V2.
  It satisfies CR-04. CR-05 requires a separate motion.
- Do not simulate an agent vote. A human writing a vote.json with an agent_id that
  does not resolve to a registered entry in agents.generated.yaml is a governance
  violation per agent-vote-protocol.yaml §5.
- Do not modify runtime, portal, UI, or DB behavior in this program line unless a
  separate motion is authored and ratified for that change. Agent registration and
  vote production are governance artifacts — they do not require portal changes.
- The agent's vote.json must pass validate_motion (exit 0) without modifications to
  the validator. The extension fields are additive; the validator must not need patching.

### Soft constraints — preserve unless stated reason

- Implement in the minimum number of motions that produces a real governed agent vote.
  One motion for agent registration + seat assignment + first vote is the target.
- Prefer a seat contract that maps well to self-evaluation: the Evidence/Falsifiability
  or Governance/Safety seat are natural first choices because they are applicable to
  any motion's ratification quality.
- Keep the first implementation motion's scope narrow enough that early stop leaves
  the repo in a coherent state.

---

## 4. Decomposition

| Motion (tentative) | Description | Input state | Change | Output state |
|---|---|---|---|---|
| motion-0120 | CR-04 spec + protocol + closure checklist + criteria update + program graph + launch packet | Post-0119: contracts and escalation committed, no agent spec | Six governance artifacts establishing the CR-04 bar | CR-04 is defined and checkable; no agent yet |
| motion-0121 | CR-04 implementation: agent registration + seat assignment + first governed vote | motion-0120 ratified; no agent registered | Register agent in agents.generated.yaml; commit seat assignment; produce vote.json + evaluation trace for a real motion | CR-04 closure checklist passes; CR-04 declared met in criteria doc |

---

## 5. Dependency graph

| From | To | Type | Condition |
|---|---|---|---|
| motion-0120 | motion-0121 | sequential | motion-0120 must be ratified before agent implementation begins against the spec |

**Critical path:** motion-0120 → motion-0121

**Parallel tracks:** None required. The line is sequential.

---

## 6. Agent / panel strategy

| Motion | Operating mode | Notes |
|---|---|---|
| motion-0120 | strategic-project | Planning and spec authoring. Completed. |
| motion-0121 | motion-implementation | Implement CR-04 closure: register agent, assign seat, produce first governed vote. Operator + Claude in implementation mode. |

---

## 7. First motion scope (motion-0121)

### In scope

- Register one agent in `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`
  with dev.jai.nexus domain and dev-jai-nexus repo assignments
- Create `.nexus/deliberation/seat-assignments/<agent_id>.yaml` assigning the agent
  to one of the six seat contracts
- Produce a vote.json for one real motion that satisfies both the human vote schema
  and all agent-vote-protocol extension fields
- Commit the evaluation trace at the path referenced by evaluation_trace_ref
- Update `cr04-closure-checklist.yaml`: mark all seven items `status: met` with
  `closed_by: motion-0121`
- Update `corpus-v2-readiness-criteria.md`: promote CR-04 to `met`

### Out of scope

- Do not register multiple agents
- Do not implement a full six-seat panel
- Do not author a Corpus V2 opening motion
- Do not modify runtime, portal, UI, or DB behavior
- Do not specify the Corpus V2 vote aggregation mechanism

---

## 8. What the first motion must prove

motion-0121 enables CR-05 planning when:

1. An agent_id resolves to a live entry in agents.generated.yaml with the correct
   domain and repo assignments.
2. A seat assignment artifact exists at `.nexus/deliberation/seat-assignments/<agent_id>.yaml`
   referencing a valid seat_id.
3. A vote.json exists for at least one real motion where `vote_type: agent`,
   `agent_id` matches the registered agent, and the nested outcome object has
   `result: PASS` or `result: BLOCK` (not null or pending).
4. `node portal/scripts/validate-motion.mjs` exits 0 for the voted motion.
5. The evaluation trace at `evaluation_trace_ref` contains non-empty
   `questions_evaluated` and `block_conditions_checked` lists tracing to the
   assigned seat contract.
6. All seven items in `cr04-closure-checklist.yaml` show `status: met`.

If any condition is not met, pause and re-scope before declaring CR-04 closed.

---

## 9. Cost estimate and escalation

### Estimate

| Dimension | Estimate |
|---|---|
| Sessions | 1–2 |
| Motions | 1 (motion-0121) |
| Primary surfaces | agents.generated.yaml, .nexus/deliberation/ (seat-assignments/, evaluation-traces/), .nexus/motions/ (one voted motion) |

### Escalation triggers

- If agents.generated.yaml schema does not support the required agent fields
  (domain assignment, repo assignment, panel-seat type) without a schema change,
  pause: a schema change requires a separate motion.
- If `validate_motion` does not pass for an agent vote.json with the extension
  fields present (e.g., validator rejects unknown fields), pause: validator
  changes require a separate motion.
- If the first real motion to vote on is not yet ratified and cannot be used as
  the evidence target, choose a previously ratified motion (e.g., motion-0119
  or motion-0120) as the vote target rather than stalling.

### Clean exit checkpoints

| Checkpoint | Repo state if execution stops here |
|---|---|
| After agent registration only | Agent in registry; no seat assignment; CR-04 not met; coherent partial state |
| After seat assignment | Agent registered and assigned; no vote yet; CR-04 not met; coherent |
| After first governed vote | All CR-04 checklist items met; CR-04 closeable; full ratification possible |

---

## Context inheritance for subsequent motions

Subsequent motions in this line inherit the following without restatement:

- Goal framing (§1)
- Hard constraints (§3 hard constraints)
- Dependency graph structure (§5) unless a motion changes sequencing

Motions must restate if changed:

- Baseline (§2): update current state after motion-0120 is ratified and after
  each subsequent motion changes the repo state
- Soft constraints (§3 soft constraints): if implementation findings require
  adjusting the "minimum motions" preference

Motions must not re-litigate:

- The CR-04 specification (resolved by motion-0120)
- The agent vote protocol schema (resolved by motion-0120; update via new version
  if recalibration is needed)
- The paired-artifact rationale for motion-0120's scope (resolved in challenge C-3)
