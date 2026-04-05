# Execution: CR-04 JAI Agent Operational v0 — minimum viable first agent, governed seat assignment, and traceable agent vote proof

**Motion:** motion-0121
**Date:** 2026-04-05

---

## Scope

Create or update the CR-04 implementation artifact set. Four phases in strict
dependency order. Early stop after Phase 2 (CR04-01 and CR04-02 closeable)
is coherent. Early stop after Phase 3 (all seven items closeable) is coherent.
Phase 4 (closure updates) must happen last.

No runtime, UI, DB, or portal files are changed.

---

## Pre-flight baseline reads (required before any write)

Before writing any file, complete all three baseline reads:

**Baseline 1:** Read `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`
- Confirm the file exists and is parseable as YAML.
- Confirm it is under git version control on this branch.
- Read two existing agent entries to understand the exact field names, nesting
  depth, and value formats. Do not guess the schema from the spec description —
  model the new entry on what is actually there.
- If the file is not readable, not parseable, or not committable on this branch,
  stop. Report the blocker. Do not proceed with agent registration until the
  path is confirmed accessible.

**Baseline 2:** Read `.nexus/deliberation/seat-contracts/evidence-falsifiability.yaml`
- Record the exact `distinctive_questions` list and `block_conditions` list.
- These are the evaluation inputs for Phase 3. The evaluation trace must
  reference specific questions and conditions from this exact file.
- Record `version` field for use in `seat_contract_version` field of agent-vote.json.

**Baseline 3:** Read all six files in `.nexus/motions/motion-0121/` (motion.yaml,
proposal.md, challenge.md, execution.md, decision.yaml, decision.md)
- This is the motion the agent will evaluate in Phase 3.
- Confirm all six files exist and are non-empty before producing the evaluation.

---

## Phase 1 — CR-03 entrance gate

### Step 1 — Create CR-03 compliance record

**New file:** `.nexus/deliberation/cr03-compliance-record.yaml`

Content requirements:
- `schema_id: cr03-compliance-record-v0`
- `established: motion-0121`
- `coverage_note`: state explicitly that this covers 4 of 5 required motions
  and that CR-03 will be met when one more post-0118 motion is assessed
- `motions_assessed`: list of four entries, one per motion (0118, 0119, 0120, 0121)

Per motion entry, include:
- `motion_id`
- `title` (one-line)
- `assessed_by`: which seat contracts were applied (evidence-falsifiability and
  governance-safety, per CR-03 specification)
- `dimensions`:
  - `proposal_precision`: PASS or FAIL with specific artifact evidence cited
  - `challenge_adversarialism`: PASS or FAIL with specific finding cited
  - `execution_specificity`: PASS or FAIL with specific artifact evidence cited
  - `evidence_traceability`: PASS or FAIL with specific finding cited
  - `decision_rationale`: PASS or FAIL with specific finding cited
- `overall`: PASS or CONDITIONAL (if any dimension is FAIL, record
  CONDITIONAL and explain the specific finding)
- `notes`: any dimension-specific observations

The compliance record must be adversarial. If any motion has a dimension
gap, record it honestly. A compliance record that gives PASS on every
dimension for every motion without citing specific artifacts is not valid.

Verifiable output: file exists, four motion entries, each with all five
dimensions assessed and artifact evidence cited, coverage note states
"4 of 5 required."

---

## Phase 2 — Agent registration and seat assignment

### Step 2 — Register agent in agents.generated.yaml

**Updated file:** `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`

Add one new entry for `jai-agent-001`. The entry must:
- Use the exact field names and nesting from existing entries (from Baseline 1)
- Include `agent_id: jai-agent-001`
- Include `type: panel-seat` (or the closest matching type from existing entries)
- Include domain assignment that covers `dev.jai.nexus`
- Include repo assignment that covers `dev-jai-nexus`
- Not duplicate any existing agent_id

**Immediately after adding the entry:**
Run `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
This must exit 0. If it exits non-zero: stop, diagnose, do not proceed to Step 3.
The agent is not registered until validation passes.

Verifiable output: validate_agency exits 0 after the edit. The entry for
`jai-agent-001` is present in the file.

### Step 3 — Create seat assignment

**New file:** `.nexus/deliberation/seat-assignments/jai-agent-001.yaml`

Required fields:
```
schema_id: seat-assignment-v0
established: motion-0121
agent_id: jai-agent-001
seat_id: evidence-falsifiability
seat_contract_ref: ".nexus/deliberation/seat-contracts/evidence-falsifiability.yaml"
seat_contract_version: [value from Baseline 2 read]
assigned_at: "2026-04-05T00:00:00.000Z"
notes: >
  First seat assignment for jai-agent-001. Evidence-falsifiability seat
  chosen for Corpus V1 CR-04 proof: directly applicable to any governance
  motion; block_conditions are structurally checkable from motion package alone.
```

Verifiable output: file exists, parseable as YAML, `seat_id` matches
`seat_id` in `.nexus/deliberation/seat-contracts/evidence-falsifiability.yaml`.

---

## Phase 3 — Governed vote and evaluation trace

Phase 3 may only begin after Phase 2 is complete and validate_agency exits 0.

### Step 4 — Produce evaluation trace

**New file:** `.nexus/deliberation/evaluation-traces/jai-agent-001-motion-0121-trace.yaml`

The evaluation trace records the agent's assessment of motion-0121 from the
evidence-falsifiability seat perspective. All fields are required:

```
schema_id: evaluation-trace-v0
motion_id: motion-0121
agent_id: jai-agent-001
seat_id: evidence-falsifiability
seat_contract_ref: ".nexus/deliberation/seat-contracts/evidence-falsifiability.yaml"
seat_contract_version: [value from Baseline 2]
produced_at: "2026-04-05T00:00:00.000Z"
model: [actual model identifier used]
protocol_version: "0.1"

questions_evaluated:
  - question: [exact text of distinctive_question 1 from seat contract]
    response: [specific response addressing this question for motion-0121]
  - question: [exact text of distinctive_question 2]
    response: [specific response]
  ... (all five distinctive_questions must be addressed)

block_conditions_checked:
  - condition: [exact text of block_condition 1 from seat contract]
    result: not_triggered | triggered
    notes: [specific finding for motion-0121]
  ... (all four block_conditions must be checked)

pass_or_block: PASS | BLOCK | ESCALATE
reasoning: >
  [Specific reasoning for the conclusion. Must be specific enough to reconstruct
  the evaluation without reading the session transcript. Must acknowledge
  the non-independence limitation (jai-agent-001 and motion-0121 author share
  underlying model Claude). Must state what this proof demonstrates (structural
  schema compliance) and what it does not demonstrate (adversarial independence).]
```

Verifiable output: file exists, parseable as YAML, `questions_evaluated` has
five entries, `block_conditions_checked` has four entries, each entry has a
non-empty `response` or `notes` field, `pass_or_block` is set.

### Step 5 — Produce agent vote

**New file:** `.nexus/motions/motion-0121/agent-vote.json`

The agent vote satisfies both the human vote schema and the agent-vote-protocol
extension fields. Required content:

```json
{
  "motion_id": "motion-0121",
  "voted_at": "2026-04-05T00:00:00.000Z",
  "era": "corpus-v1",
  "vote_mechanism": "agent-seat-evaluation",
  "note": "This is an agent seat-contract evaluation, not a ratification vote. The human ratification vote is in vote.json. This file demonstrates CR-04 structural compliance.",
  "vote_type": "agent",
  "agent_id": "jai-agent-001",
  "seat_id": "evidence-falsifiability",
  "seat_contract_ref": ".nexus/deliberation/seat-contracts/evidence-falsifiability.yaml",
  "seat_contract_version": "[value from Baseline 2]",
  "evaluation_trace_ref": ".nexus/deliberation/evaluation-traces/jai-agent-001-motion-0121-trace.yaml",
  "model": "[actual model identifier]",
  "protocol_version": "0.1",
  "panel": [
    { "role": "panel-seat", "seat_id": "evidence-falsifiability", "agent_id": "jai-agent-001" }
  ],
  "outcome": {
    "yes": [1 if PASS, 0 if BLOCK],
    "no": [1 if BLOCK, 0 if PASS],
    "abstain": 0,
    "yes_with_reservations": 0,
    "result": "PASS or BLOCK",
    "reasons": ["[specific finding from evaluation trace reasoning]"],
    "missing_required_roles": []
  }
}
```

**After creating agent-vote.json:**
Run `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0121/motion.yaml`
This must exit 0. (Validates the motion, not the agent-vote.json itself —
the motion package must remain valid after this new file is added.)

Verifiable output: file exists, parseable as JSON. Node command confirms:
`node -e "const v=require('./.nexus/motions/motion-0121/agent-vote.json'); console.log(v.vote_type, v.agent_id, v.outcome.result)"`
outputs `agent jai-agent-001 PASS` (or BLOCK).

---

## Phase 4 — Closure

Phase 4 may only begin after Phase 3 is complete and all files are committed.

### Step 6 — Update CR-04 closure checklist

**Updated file:** `.nexus/deliberation/cr04-closure-checklist.yaml`

For each of the seven items, update:
- `status: met`
- `closed_by: motion-0121`
- Add `evidence_ref` pointing to the specific artifact that satisfies each item:
  - CR04-01: `workspace/.../agents.generated.yaml` (jai-agent-001 entry)
  - CR04-02: `.nexus/deliberation/seat-assignments/jai-agent-001.yaml`
  - CR04-03: `.nexus/motions/motion-0121/agent-vote.json`
  - CR04-04: `.nexus/motions/motion-0121/agent-vote.json` (extension fields)
  - CR04-05: `validate_motion exit 0 result`
  - CR04-06: `.nexus/deliberation/evaluation-traces/jai-agent-001-motion-0121-trace.yaml`
  - CR04-07: trace file `questions_evaluated` and `block_conditions_checked` fields

Verifiable output: all seven items show `status: met` and `closed_by: motion-0121`.

### Step 7 — Update corpus-v2-readiness-criteria.md

**Updated file:** `.nexus/docs/corpus-v2-readiness-criteria.md`

Changes:
- CR-04: promote `current_status` from `unmet` to `met`. Add ratification note:
  "Promoted to met: motion-0121 ratified. jai-agent-001 registered, evidence-falsifiability
  seat assigned, agent-vote.json + evaluation trace committed, all seven
  CR04 checklist items met."
- CR-03: update assessment to note that 4 of 5 required motions are now assessed
  in cr03-compliance-record.yaml; closing action updated to "Assess one more
  post-0118 motion in the cr03-compliance-record."
- Summary table: update to 5 met / 1 partial / 4 unmet (CR-04 promoted,
  CR-03 remains partial).

Verifiable output: CR-04 shows `current_status: met`. Summary counts updated.

---

## Evidence checklist

Each item is independently verifiable:

- [ ] `.nexus/deliberation/cr03-compliance-record.yaml` exists with four motion
  entries, each with all five quality dimensions assessed and artifacts cited.
  `coverage_note` states "4 of 5 required."
- [ ] `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` contains
  an entry for `jai-agent-001` with domain `dev.jai.nexus` and repo `dev-jai-nexus`.
- [ ] `validate_agency` exits 0 after adding `jai-agent-001` entry.
- [ ] `.nexus/deliberation/seat-assignments/jai-agent-001.yaml` exists with
  `seat_id: evidence-falsifiability` and matching `seat_contract_ref`.
- [ ] `.nexus/deliberation/evaluation-traces/jai-agent-001-motion-0121-trace.yaml`
  exists with non-empty `questions_evaluated` (5 entries) and
  `block_conditions_checked` (4 entries).
- [ ] `.nexus/motions/motion-0121/agent-vote.json` exists. Node evidence command
  outputs `agent jai-agent-001 PASS` (or `BLOCK`).
- [ ] All seven CR-04 checklist items show `status: met`, `closed_by: motion-0121`.
- [ ] `corpus-v2-readiness-criteria.md` shows CR-04 `current_status: met`.
- [ ] Summary counts in criteria doc updated: 5 met.
- [ ] `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0121/motion.yaml`
  exits 0.
- [ ] `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
  exits 0.

---

## Stop conditions

Stop immediately and report (do not continue to next phase) if:

- Baseline 1 fails: `agents.generated.yaml` is not readable, not parseable,
  or cannot be committed on this branch.
- Step 2 validation: `validate_agency` exits non-zero after adding `jai-agent-001`.
- Phase 3 pre-condition: Phase 2 artifacts are not committed before Phase 3 begins.
- Phase 4 pre-condition: Phase 3 artifacts are not committed before Phase 4 begins.

Any stop condition is a blocker, not a reason to improvise. Report the exact
error and stop. Do not attempt workarounds that require un-governed schema changes.

---

## What is NOT done in this motion

- Does not declare Corpus V2 started
- Does not author a Corpus V2 opening motion
- Does not implement multi-agent panel infrastructure
- Does not make agent votes a governing ratification mechanism
- Does not change runtime, portal, UI, or DB behavior
- Does not close CR-03 (4 of 5 covered; one more motion required)
- Does not reopen any prior motion
