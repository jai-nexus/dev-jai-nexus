# Execution: Corpus V2 Readiness Blockers v0 — JAI Agent operational prerequisites before the Corpus V2 opening motion

**Motion:** motion-0120
**Date:** 2026-04-04

---

## Scope

Create or update the readiness-blocker artifact set. Artifacts are committed
in paired order per the C-3 resolution: Pair 1 first (CR-04 spec + closure
checklist), then Pair 2 (agent vote protocol + criteria update), then Pair 3
(program graph + launch packet). Early stop after Pair 1 still produces a
coherent, ratifiable output.

No existing governance artifacts other than the two explicitly listed updates
are modified. No runtime, UI, DB, or portal files are changed.

---

## Deliverable sequence

### Pair 1 — CR-04 definition (highest value, ratifiable if execution stops here)

#### Step 1 — Create CR-04 agent readiness spec

**New file:** `.nexus/deliberation/cr04-agent-readiness-spec.md`

Must contain:

1. **Agent identity requirements:** What fields must be registered for an
   agent to count as a participant. Minimum: agent_id present in
   agents.generated.yaml; agent has a domain assignment that includes
   dev.jai.nexus; agent has a declared seat assignment mapped to one of
   the six seat contracts in `.nexus/deliberation/seat-contracts/`.

2. **Seat assignment requirements:** Which seat contract governs the
   agent's evaluation. The assignment must be declared in a committed
   artifact (not assumed). The agent must consume the seat contract's
   `distinctive_questions` and `block_conditions` fields as primary
   evaluation context.

3. **Vote output field requirements:** The agent's vote.json must satisfy
   the existing human vote schema (nested outcome object with yes/no/abstain/
   result/reasons/missing_required_roles) AND the agent-specific extension
   fields defined in agent-vote-protocol.yaml.

4. **Validation requirements:** The agent's vote.json must pass
   `validate_motion` (exit 0) for the motion it is voting on. Any agent
   vote that does not pass this gate does not count as a governed vote.

5. **Evidence requirements:** The following must be committed to the repo
   before CR-04 is declared met:
   - The agent's vote.json for at least one real motion
   - An evaluation_trace artifact referenced by the vote.json (see
     agent-vote-protocol.yaml for trace format)
   - Confirmation that the agent consumed the assigned seat contract
     (traceable from the evaluation_trace)
   - A verify.json recording the validate_motion gate result for the
     agent's vote

6. **Minimum viable first agent:** CR-04 does not require a six-seat full
   panel. It requires one agent, one seat, one evaluated motion, one
   committed governed vote. The spec must make explicit what the minimum
   bar is and what exceeds the minimum bar.

Verifiable output: file exists, contains all six sections, minimum viable
first agent definition is specific and falsifiable.

#### Step 2 — Create CR-04 closure checklist

**New file:** `.nexus/deliberation/cr04-closure-checklist.yaml`

Must contain a machine-checkable list of pre-conditions. Every item must
be independently verifiable from repo state without author assertion. Each
item must reference the specific artifact or command that proves it.

Required items at minimum:
- Agent registered: `agent_id` appears in agents.generated.yaml under
  dev.jai.nexus domain
- Seat assigned: agent's seat assignment committed to a declared artifact,
  referencing a seat contract file in `.nexus/deliberation/seat-contracts/`
- Vote produced: a vote.json file exists for at least one real motion that
  was authored by the agent (agent_id in panel, not human identity)
- Vote schema compliant: agent vote.json satisfies agent-vote-protocol
  extension fields
- Validation passes: `node portal/scripts/validate-motion.mjs --motion
  .nexus/motions/motion-NNNN/motion.yaml` exits 0 for the voted motion
- Evaluation trace committed: a trace artifact exists at the path referenced
  in vote.json's evaluation_trace_ref field
- Seat contract consumed: the evaluation_trace references at least one
  distinctive_question and at least one block_condition from the assigned
  seat contract

Verifiable output: file exists, parseable as YAML, all required items
present with `artifact_ref` or `command` field per item.

---

### Pair 2 — Current state reflection

#### Step 3 — Create agent vote protocol

**New file:** `.nexus/deliberation/agent-vote-protocol.yaml`

Must contain:

1. **Schema extension fields** beyond the existing human vote schema:
   - `vote_type`: enum `human | agent` (required, distinguishes vote origin)
   - `agent_id`: string, required when vote_type is agent
   - `seat_id`: string, must match a seat_id in `.nexus/deliberation/seat-contracts/`
   - `seat_contract_ref`: path to the seat contract YAML consumed
   - `seat_contract_version`: version field from the consumed contract
   - `evaluation_trace_ref`: path to committed evaluation trace artifact
   - `model`: string, the model identifier used to produce the evaluation

2. **Evaluation trace format:** Minimum fields a trace artifact must contain
   to be considered a governed trace:
   - `motion_id`: motion evaluated
   - `seat_id`: seat perspective applied
   - `questions_evaluated`: list of distinctive_questions from the seat
     contract that were explicitly addressed
   - `block_conditions_checked`: list of block_conditions checked and result
     (triggered / not triggered) for each
   - `pass_or_block`: the seat's conclusion (PASS / BLOCK / ESCALATE)
   - `reasoning`: free text explanation

3. **Compatibility note:** Agent vote.json must also satisfy all existing
   human vote.json required fields. Existing validators must not need
   modification to validate an agent vote. The extension fields are additive.

4. **Forward compatibility mechanism:** Schema version field in protocol YAML.
   Agent votes must record the protocol version they were produced against.
   Schema updates produce a new version; existing votes remain valid under
   the version they recorded.

5. **What an agent vote is NOT:** An agent vote is not a simulation of a
   human vote authored by a human with an agent name. The agent_id must
   resolve to a registered entry in agents.generated.yaml. A human writing
   a vote.json with `agent_id: "some-agent"` when no such agent exists is
   a governance violation.

Verifiable output: file exists, parseable as YAML, contains all five
sections, schema extension fields are named with type constraints.

#### Step 4 — Update corpus-v2-readiness-criteria.md

**File to update:** `.nexus/docs/corpus-v2-readiness-criteria.md`

Changes required:
- CR-01: promote `current_status` from `unmet` to `met`. Add ratification
  note: "Promoted to met: motion-0118 ratified."
- CR-02: promote `current_status` from `unmet` to `met`. Add ratification
  note: "Promoted to met: motion-0119 ratified."
- Summary table: update counts to 4 met, 2 partial, 4 unmet.
- Dependency chain note: update to reflect that CR-01 and CR-02 are cleared.
- Attribution: add a note at the top of the document stating that status
  fields are updated by subsequent ratified motions; changes are traceable
  to the motion that promoted each criterion.

Verifiable output: CR-01 and CR-02 both show `current_status: met`. Summary
table reflects updated counts.

---

### Pair 3 — Arc registration and opening

#### Step 5 — Update program-graph.yaml

**File to update:** `.nexus/programs/program-graph.yaml`

Changes required:
- Under `corpus-v1-planning-foundation` epic: add program entry for
  `q2-corpus-v1-deliberation-readiness` (motion-0119) with `status: closed`.
- Add new epic entry or program entry for `q2-corpus-v2-readiness-blockers`
  (motion-0120) with `status: open`, motion_line containing motion-0120 as
  first entry.
- Update `generated_at` to `"2026-04-04T00:00:00.000Z"`.

Verifiable output: both programs appear in program-graph.yaml. motion-0119
program shows `status: closed`. motion-0120 program shows `status: open`.

#### Step 6 — Create launch packet

**New file:** `.nexus/programs/q2-corpus-v2-readiness-blockers-launch-packet.md`

Must follow the template at `.nexus/programs/motion-launch-packet.template.md`.
Must be self-contained per the launch-packet activation path in
`.nexus/programs/launch-packet-activation.md`.

Required content:
1. **Goal:** Close the minimum blocking CR-04 criteria so that the Corpus V2
   opening motion can be planned honestly.
2. **Done when:** CR-04 closure checklist passes completely (all items in
   `.nexus/deliberation/cr04-closure-checklist.yaml` are met). An agent has
   produced a governed vote.json for at least one real motion that passes
   all validation gates.
3. **Baseline:** Post-0120 state — spec and protocol committed; no agent
   implementation yet.
4. **Constraints:** Hard: do not simulate an agent vote; do not declare
   Corpus V2 started before CR-04 is met; do not modify runtime or portal
   without a separate motion. Soft: implement in the smallest number of
   motions that produces a real governed agent vote.
5. **Decomposition table:** At minimum: one implementation motion for agent
   registration + seat assignment + first vote production.
6. **Dependency graph:** Implementation motion depends on motion-0120 (spec
   and protocol must be ratified before implementing against them).
7. **Agent/panel strategy:** Corpus V1 era; operator + Claude in motion-
   implementation mode.
8. **First motion scope:** Implement the minimum viable first agent per the
   CR-04 spec. Produce one governed vote.json. Commit the evaluation trace.
9. **What the first motion must prove:** An agent_id in agents.generated.yaml,
   a seat assignment committed, a vote.json that passes validate_motion,
   an evaluation_trace that references at least one distinctive_question
   and one block_condition from the assigned seat contract.
10. **Cost estimate:** 1–2 sessions, 2–3 motions, surfaces: agents.generated.yaml
    + .nexus/deliberation/ + .nexus/motions/ (one new motion).

Verifiable output: file exists. Template placeholders are all replaced.
The file does not contain any `[bracketed placeholder]` strings.

---

## Evidence checklist

Each item is independently verifiable:

- [ ] `.nexus/deliberation/cr04-agent-readiness-spec.md` exists and contains
  all six sections including minimum viable first agent definition
- [ ] `.nexus/deliberation/cr04-closure-checklist.yaml` exists with all
  required items, each with `artifact_ref` or `command` field
- [ ] `.nexus/deliberation/agent-vote-protocol.yaml` exists with five sections
  including `vote_type` enum, extension fields, trace format, compatibility
  note, and forward-compatibility mechanism
- [ ] `.nexus/docs/corpus-v2-readiness-criteria.md` shows CR-01 `current_status: met`
  and CR-02 `current_status: met`
- [ ] Summary table in criteria doc updated: 4 met, 2 partial, 4 unmet
- [ ] `.nexus/programs/program-graph.yaml` contains `q2-corpus-v1-deliberation-readiness`
  with `status: closed`
- [ ] `.nexus/programs/program-graph.yaml` contains `q2-corpus-v2-readiness-blockers`
  with `status: open`
- [ ] `.nexus/programs/q2-corpus-v2-readiness-blockers-launch-packet.md` exists
  with no `[bracketed placeholder]` strings
- [ ] `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0120/motion.yaml`
  exits 0
- [ ] `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
  exits 0

---

## What is NOT done in this motion

- Does not implement a JAI Agent
- Does not produce an agent-authored vote.json
- Does not modify the agents.generated.yaml registry
- Does not change runtime, portal, UI, or DB behavior
- Does not ratify any prior motion
- Does not declare Corpus V2 started
- Does not draft the Corpus V2 opening motion
