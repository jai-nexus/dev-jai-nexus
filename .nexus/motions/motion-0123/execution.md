# Execution: CR-05 Corpus V2 Opening v0 — first true agent-voted opening event and governed transition into Corpus V2

**Motion:** motion-0123
**Date:** 2026-04-05

---

## Scope

Produce the opening-event artifact set. Artifacts are committed in paired
order: Pair 1 (agent evaluation trace + agent-vote.json), Pair 2 (canon
baseline + program graph update), Pair 3 (checklist closure + criteria
update). All six artifact categories are required — the opening event is not
ratifiable without Pair 1 (RL-6: canon baseline required) and not valid
without a committed trace (RL-3: evaluation trace required).

No agents.generated.yaml modification. No runtime, portal, UI, or DB changes.

---

## Pre-flight verification

Before any implementation artifact is written, confirm all CR05 pre-conditions
from `.nexus/deliberation/cr05-opening-checklist.yaml` and `.nexus/docs/cr05-opening-boundary.md`.
Stop and report if any pre-condition is not met.

**Pre-flight 1: Branch isolation (RL-4 verification)**

Confirm this branch is NOT `sprint/q2-cr05-opening-planning` or any branch
that contains the initial commit of `.nexus/docs/cr05-opening-boundary.md`.

Command: `git log --oneline | head -5` — confirm the commit history of this
branch does not include the motion-0122 implementation commit.

If this branch shares a recent ancestor that includes cr05-opening-boundary.md
creation, stop and report: the arc separation constraint (RL-4) is violated.

**Pre-flight 2: Opening pre-conditions confirmed met**

Read `.nexus/deliberation/cr05-opening-checklist.yaml`. Confirm:
- CR05-01 status: met (CR-04 confirmed met — all 7 cr04-closure-checklist items)
- CR05-02 status: met (CR-03 confirmed met — cr03-compliance-record 5/5 PASS)
- CR05-03 status: met or closeable (motion-0122 decision.yaml status: RATIFIED)
- CR05-04 status: met or closeable (cr05-opening-boundary.md 5 sections present)
- CR05-05 status: met or closeable (cr05-first-agent-voted-motion-contract.md present)
- CR05-06 status: met or closeable (cr05-panel-staging-guidance.yaml present)
- CR05-07 status: met or closeable (cr05-inherited-context-packet.md present)
- CR05-08: confirm by grep — `grep -r "era: corpus-v2" .nexus/motions/*/vote.json` must return zero results

**Pre-flight 3: Agent registration confirmed**

Read `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`. Confirm:
- `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001` is present
- `scope: [dev-jai-nexus]`
- `tier: 2`

Run `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`.
Confirm exit 0. Stop if non-zero.

**Pre-flight 4: Seat contract and evaluation context**

Read `.nexus/deliberation/seat-contracts/evidence-falsifiability.yaml`. Confirm:
- `seat_id: evidence-falsifiability`
- `version: "v0"`
- `distinctive_questions` list is present and non-empty (5 questions expected)
- `block_conditions` list is present and non-empty (4 conditions expected)

The agent will consume this file as primary evaluation context. The exact
`distinctive_questions` and `block_conditions` from this file must appear
verbatim (or as close paraphrases) in the evaluation trace.

---

## Pair 1 — Agent evaluation (required; opening event invalid without this)

### Step 1 — Produce the evaluation trace

**New file:** `.nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0123-trace.yaml`

This is the agent's evaluation of motion-0123 from the evidence-falsifiability
perspective. It must satisfy the `evaluation_trace_schema` in agent-vote-protocol v0.1 §2.

Required fields and content:

```
schema_id: evaluation-trace-v0
motion_id: motion-0123
agent_id: nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001
seat_id: evidence-falsifiability
seat_contract_ref: ".nexus/deliberation/seat-contracts/evidence-falsifiability.yaml"
seat_contract_version: "v0"
produced_at: "2026-04-05T00:00:00.000Z"
model: claude-sonnet-4-6
protocol_version: "0.1"
```

**questions_evaluated:** Must contain entries addressing at minimum 3 of the
5 distinctive_questions from the evidence-falsifiability seat contract. Per
C-5 resolution: aim to address all 5. Each entry must:
- Quote or closely paraphrase the question from the seat contract verbatim
- Provide a response specific to motion-0123's evidence chain and artifacts
- Not give generic answers that could apply to any motion

The questions likely to be most relevant for the opening event:
1. Are all success criteria paired with specific, binary evidence items? (All 14
   success criteria in proposal.md should map to checkable artifacts)
2. Are the validation commands exact and reproducible? (validate_motion and
   validate_agency commands must be exact strings with expected output)
3. Is the implementation evidence specific enough that a future reviewer can
   verify what was done without trusting the author? (All artifact paths, file
   checks, and commands in execution.md must be independently runnable)
4. Are there claims in the proposal that cannot be verified from committed
   repo state? (Flag any claims dependent on author assertion)
5. Does the evidence chain connect success criteria to implementation artifacts
   to validation gates without gaps?

**block_conditions_checked:** Must contain entries for all 4 block_conditions
from the evidence-falsifiability seat contract. For each:
- State the condition as it appears in the seat contract
- Declare: `triggered` or `not_triggered`
- Provide a motion-0123-specific note explaining why

For a well-formed opening event, all 4 block conditions are expected to be
`not_triggered`. If any is triggered, the trace must state the specific problem
and the opening event must address it before ratification.

**non-independence acknowledgment:** The trace must include an explicit statement:
> "This evaluation shares the underlying model (claude-sonnet-4-6) with the
> motion author. The advance over CR-04 is the object of evaluation: this
> motion declares an era boundary and establishes a governance canon, not merely
> the agent's own instantiation. This is structural proof of the evidence
> chain's falsifiability, not adversarial independence."

**pass_or_block:** PASS is expected if block conditions are not triggered.
If any block condition is triggered, `pass_or_block: BLOCK` and the
implementation must stop before Pair 2 to diagnose.

**reasoning:** Free-text explanation specific enough to reconstruct the
evaluation without the session transcript.

Verifiable output: file exists, parseable as YAML, `questions_evaluated` has
≥ 3 entries each with motion-specific content, `block_conditions_checked` has
4 entries, `pass_or_block` is non-null, non-independence stated.

---

### Step 2 — Produce agent-vote.json

**New file:** `.nexus/motions/motion-0123/agent-vote.json`

Modeled on `.nexus/motions/motion-0121/agent-vote.json`. Must satisfy the
existing human vote schema AND all 8 agent-vote-protocol v0.1 extension fields.

Required human vote schema fields (for validate_motion to pass):
```json
{
  "motion_id": "motion-0123",
  "voted_at": "2026-04-05T00:00:00.000Z",
  "era": "corpus-v2",
  "vote_mechanism": "agent-seat-evaluation",
  "panel": [
    {
      "role": "panel-seat",
      "seat_id": "evidence-falsifiability",
      "agent_id": "nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001"
    }
  ],
  "outcome": {
    "yes": 1,
    "no": 0,
    "abstain": 0,
    "yes_with_reservations": 0,
    "result": "PASS",
    "reasons": [...],
    "missing_required_roles": []
  }
}
```

Required agent-vote-protocol v0.1 extension fields:
- `vote_type`: `"agent"`
- `agent_id`: `"nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001"`
- `seat_id`: `"evidence-falsifiability"`
- `seat_contract_ref`: `".nexus/deliberation/seat-contracts/evidence-falsifiability.yaml"`
- `seat_contract_version`: `"v0"`
- `evaluation_trace_ref`: `.nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0123-trace.yaml`
- `model`: `"claude-sonnet-4-6"`
- `protocol_version`: `"0.1"`

Include a `note` field (as in motion-0121/agent-vote.json): this is the agent's
seat-contract evaluation artifact, not the ratification vote.json. The ratification
vote.json is separate and carries `era: corpus-v2`.

Evidence command verification:
```
node -e "const v=require('./.nexus/motions/motion-0123/agent-vote.json'); console.log(v.vote_type, v.agent_id, v.outcome.result)"
```
Expected output: `agent nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 PASS`

Verify that `evaluation_trace_ref` resolves to the file created in Step 1.

---

## Pair 2 — Canon baseline and era record

### Step 3 — Create Corpus V2 canon baseline

**New file:** `.nexus/docs/corpus-v2-canon-baseline.md`

This is the Corpus V2 governance canon at the opening of the new era.
It is the committed artifact that satisfies RL-6 (no prose-only canon
declaration) and addresses the `must_extend` items from cr05-inherited-context-packet.md.

Must contain the following sections:

**1. Authority and scope.** This document is the Corpus V2 governance canon
baseline. It is established by the ratification of motion-0123. Its authority
derives from the same source as all governed artifacts in this repo: the
operator's ratification decision, applied to a committed artifact against a
pre-committed contract.

**2. Corpus V1 inheritance record.** Cite
`.nexus/deliberation/cr05-inherited-context-packet.md` as the authoritative
Corpus V1 inheritance record. State which `carry_forward_unchanged` artifacts
this canon relies on. Confirm: all six seat contracts, the escalation ladder,
agent vote protocol v0.1, planning canon, deliberation readiness doc, and the
agent registry carry forward without modification.

**3. Must-extend items addressed.** Address each item from cr05-inherited-context-packet.md
`must_extend` list:

- `corpus-v2-readiness-criteria.md`: Updated by this motion — CR-05 promoted to met.
- `program-graph.yaml`: Updated by this motion — corpus-v1 era `last` field set,
  corpus-v2 era entry added. First Corpus V2 program will be established by
  the first post-opening Corpus V2 motion.
- `Motion quality standard (motion-0118 §5)`: Deferred to a post-opening
  Corpus V2 governance motion. Corpus V2 does not currently include
  agent-authored proposals. When agent-authored proposals are introduced,
  the quality standard must be extended by a governed motion before
  agent-authored proposals are ratified. Until that extension is committed,
  the existing quality standard applies and all proposals are human-authored.
- `cr03-compliance-record.yaml`: Closed by motion-0122 ratification. Historical
  record. Corpus V2 will produce a successor compliance record when the
  quality standard is applied to post-opening motions.

**4. What the opening event adds to the Corpus V2 canon.**

- **Era labeling:** All post-opening motions must carry `era: corpus-v2` in
  their vote.json. No exceptions for post-opening motions.
- **Advisory agent participation:** All post-opening Corpus V2 motions should
  include agent participation as an advisory participant per the mechanism
  established by the opening event. This is advisory until the canon is
  evolved through a subsequent governed motion that defines weighted or
  gatekeeping agent participation. Advisory means: the agent's PASS/BLOCK
  conclusion is recorded and informs the panel; the human panel retains
  ratification authority; an agent BLOCK conclusion must be addressed in
  decision.md before the panel overrides.
- **First Corpus V2 program:** Will be established by the first post-opening
  Corpus V2 motion. The program graph era entry is open; the first motion
  to open a new program under the corpus-v2 era completes this field.

**5. What the opening event does not determine.** Explicit list of open
governance questions that are NOT answered by this canon baseline and require
subsequent governed motions:
- Whether agent participation weight increases from advisory to weighted
- The panel composition for agent-authored proposals (if any)
- Whether additional agents are registered and from what seat perspectives
- The Corpus V2 motion quality standard extension for non-human proposers
- The Corpus V2 equivalent of the Corpus V1 Program Planning Canon (if any
  structural changes are needed for the agent-voted era)

**6. Post-opening boundary statement.** One paragraph: Corpus V2 began at the
ratification of motion-0123. Every motion ratified after this one is a Corpus V2
motion. Every motion ratified before this one is a permanent Corpus V1 record.
This canon is the authorized starting point. Future Corpus V2 motions extend
the canon through the same governed process that produced it.

Verifiable output: file exists, 6 sections present, `must_extend` items all
addressed (no silence), deferral for quality standard extension explicitly
names the deferral and the condition under which it is triggered.

---

### Step 4 — Update program-graph.yaml

**File to update:** `.nexus/programs/program-graph.yaml`

Changes required:

1. Under `eras` → `corpus-v1` entry: set `last: motion-0122`. motion-0122 is
   the final Corpus V1 motion in the committed record at the time of this
   opening. (motion-0123 is the opening event; it may appear in the corpus-v2
   era entry or as a boundary marker, not in corpus-v1's motion range.)

2. Add a new era entry for `corpus-v2`:
   ```yaml
   - era_id: corpus-v2
     title: "Corpus V2 — Agent-Participated Era"
     description: >
       Motions ratified with required advisory agent participation.
       Era established by motion-0123 ratification.
       Agent vote weight: advisory (per cr05-panel-staging-guidance.yaml).
       Subsequent governed motions may evolve panel composition and canon.
     governance_model: agent-participated-advisory
     motion_range:
       first: motion-0123
       last: null  # era open
     epics: []  # first Corpus V2 program established by follow-on motion
   ```

3. Under `q2-cr05-opening-planning` program (in the `corpus-v2-opening-planning`
   epic), add `motion-0123` to the `cr05-opening-planning-main` motion line.
   Update the program `status` to `closed` (the opening planning program is
   complete when the opening event is ratified).

4. Update `generated_at` to `"2026-04-05T00:00:00.000Z"`.

Verifiable output: corpus-v1 era has `last: motion-0122`; corpus-v2 era entry
exists with `first: motion-0123`; q2-cr05-opening-planning program line includes
motion-0123 and `status: closed`.

---

## Pair 3 — Opening event closure record

### Step 5 — Update CR-05 opening checklist

**File to update:** `.nexus/deliberation/cr05-opening-checklist.yaml`

Promote all items to `status: met`. For items CR05-01 and CR05-08, confirm
existing met status and add `confirmed_by: motion-0123` if not already present.
For items CR05-02 through CR05-07, set `status: met`, `closed_by: motion-0123`,
and add `evidence_ref` for each:

- **CR05-02** (CR-03 met): `evidence_ref: ".nexus/deliberation/cr03-compliance-record.yaml — 5/5 entries PASS, coverage_note declares CR-03 MET by motion-0122 ratification"`
- **CR05-03** (planning arc ratified): `evidence_ref: ".nexus/motions/motion-0122/decision.yaml — status: RATIFIED"`
- **CR05-04** (opening boundary committed): `evidence_ref: ".nexus/docs/cr05-opening-boundary.md — 5 sections present"`
- **CR05-05** (contract committed): `evidence_ref: ".nexus/deliberation/cr05-first-agent-voted-motion-contract.md — 6 sections present, red lines reference named artifacts"`
- **CR05-06** (panel staging committed): `evidence_ref: ".nexus/deliberation/cr05-panel-staging-guidance.yaml — opening_event_ratification_mechanism: unanimous_consent_with_agent_witness"`
- **CR05-07** (inherited-context committed): `evidence_ref: ".nexus/deliberation/cr05-inherited-context-packet.md — 3 sections non-empty, all referenced paths present"`

Verifiable output: all 8 items show `status: met`; items CR05-02 through CR05-07
have `closed_by: motion-0123` and `evidence_ref` fields.

---

### Step 6 — Update corpus-v2-readiness-criteria.md

**File to update:** `.nexus/docs/corpus-v2-readiness-criteria.md`

Changes required:

1. Update `Last updated` line to `2026-04-05 by motion-0123`.
2. CR-05 section: change `current_status` from `unmet` to `met`. Update assessment
   to cite the opening event artifacts: opening boundary conditions met; agent
   participated per staging guidance; canon baseline committed; program graph
   updated; all 8 opening checklist items met. Add note: *Promoted to met by
   motion-0123.*
3. Summary table: update CR-05 to `**met** *(motion-0123)*`.
4. Summary counts: update to 8 met / 1 partial / 1 unmet.
   - Met: CR-01, CR-02, CR-03, CR-04, CR-05, CR-08, CR-09, CR-10 (8)
   - Partial: CR-06 (1)
   - Unmet: CR-07 (1)
5. Update the closing narrative: "All ten readiness criteria are resolved or in
   progress. CR-05 is met: the Corpus V2 era has begun. CR-06 and CR-07 are
   parallel tracks. The critical path is now the evolution of the Corpus V2 canon."

Verifiable output: CR-05 shows `current_status: met`; summary counts 8/1/1.

---

## Evidence checklist

Each item is independently verifiable from committed repo state:

- [ ] Pre-flight 1: branch is NOT sprint/q2-cr05-opening-planning; git log
  confirms no motion-0122 planning commits in this branch's history
- [ ] Pre-flight 2: all CR05 pre-conditions met — CR05-01 and CR05-08 confirmed,
  CR05-02 through CR05-07 closeable post-0122 ratification
- [ ] Pre-flight 3: nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 in
  agents.generated.yaml with dev-jai-nexus scope; validate_agency exit 0
- [ ] Pre-flight 4: evidence-falsifiability.yaml readable with 5 distinctive_questions
  and 4 block_conditions
- [ ] Evaluation trace at `.nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0123-trace.yaml`
  exists; `questions_evaluated` has ≥ 3 entries (aim: 5); `block_conditions_checked`
  has 4 entries; `pass_or_block: PASS`; non-independence stated
- [ ] Evidence command: `node -e "const v=require('./.nexus/motions/motion-0123/agent-vote.json'); console.log(v.vote_type, v.agent_id, v.outcome.result)"` → `agent nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 PASS`
- [ ] agent-vote.json has all 8 protocol extension fields; `evaluation_trace_ref`
  resolves to committed trace file
- [ ] `.nexus/docs/corpus-v2-canon-baseline.md` exists with 6 sections; all
  `must_extend` items addressed (no silence); deferral of quality standard
  extension explicitly names the condition
- [ ] `program-graph.yaml`: corpus-v1 `last: motion-0122`; corpus-v2 era entry
  with `first: motion-0123`; q2-cr05-opening-planning program includes motion-0123
  with `status: closed`
- [ ] cr05-opening-checklist.yaml: all 8 items `status: met`; CR05-02 through
  CR05-07 have `closed_by: motion-0123` and `evidence_ref`
- [ ] corpus-v2-readiness-criteria.md: CR-05 `current_status: met`; summary 8/1/1
- [ ] `grep -r "era: corpus-v2" .nexus/motions/*/vote.json` — returns exactly
  one result: `.nexus/motions/motion-0123/vote.json`
- [ ] `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0123/motion.yaml`
  exits 0
- [ ] `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
  exits 0

---

## What is NOT done in this motion

- Does not register new agents or modify agents.generated.yaml
- Does not change the agent vote protocol, seat contracts, or escalation ladder
- Does not extend the motion quality standard for agent-authored proposals
  (explicitly deferred in the canon baseline)
- Does not establish the first Corpus V2 program (the program graph era entry
  opens it; the first post-opening motion establishes it)
- Does not change runtime, portal, UI, or DB behavior
- Does not close CR-06 or CR-07
- Does not reopen normalization
- Does not widen into OffBook.ai rollout work
