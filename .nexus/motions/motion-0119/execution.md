# Execution: Corpus V1 Deliberation Readiness v0 — executable seat differentiation, cost-aware escalation, and launch-packet activation

**Motion:** motion-0119
**Date:** 2026-04-04

---

## Scope

Create the deliberation readiness artifact set. All artifacts are new files. No existing files are modified. No runtime, UI, DB, or portal behavior is changed.

---

## Deliverable sequence

Artifacts are committed in dependency order. Early-stop after any artifact still produces a coherent, ratifiable output.

### Step 1 — Create seat-contracts directory and six per-seat YAML contracts

**New directory:** `.nexus/deliberation/seat-contracts/`

**New files:**

```
.nexus/deliberation/seat-contracts/cost-discipline.yaml
.nexus/deliberation/seat-contracts/architecture.yaml
.nexus/deliberation/seat-contracts/governance-safety.yaml
.nexus/deliberation/seat-contracts/operator-usability.yaml
.nexus/deliberation/seat-contracts/evidence-falsifiability.yaml
.nexus/deliberation/seat-contracts/execution-pragmatism.yaml
```

Each file must contain:
- `seat_id`: machine-readable identifier
- `responsibility`: one-sentence statement of what this seat is responsible for evaluating
- `distinctive_questions`: list of questions this seat must ask that no other seat asks
- `pass_criteria`: specific conditions under which this seat votes PASS
- `block_conditions`: exact conditions under which this seat votes BLOCK or escalates
- `reasoning_shape`: one-paragraph description of how this seat's deliberation logic differs materially from every other seat

Verifiable output: `ls .nexus/deliberation/seat-contracts/` returns six files, each parseable as YAML.

### Step 2 — Create escalation ladder

**New file:** `.nexus/deliberation/escalation-ladder.yaml`

Must contain four tier definitions (Tier 0–3), each with:
- `tier_id`: integer 0–3
- `label`: human-readable name
- `description`: what class of motion belongs here
- `trigger_conditions`: list including both numeric (risk_score range) and non-numeric triggers (surface type, novelty flag, uncertainty flag)
- `required_deliberation_steps`: list of steps required at this tier
- `automation_eligibility`: boolean or conditional statement

Must include a calibration note documenting that Tier 0–3 risk score thresholds are v0 heuristic calibrations grounded in observed Corpus V1 policy.yaml distribution, not derived from first principles.

Verifiable output: `node -e "const y=require('.nexus/deliberation/escalation-ladder.yaml'); console.log('ok')"` — or validate that file parses as valid YAML with four tier entries.

### Step 3 — Create primary deliberation readiness narrative

**New file:** `.nexus/docs/corpus-v1-deliberation-readiness.md`

Must contain:
- Overview tying the six seat contracts, escalation ladder, and phase guide into a coherent picture
- How to use the seat contracts as a structured deliberation checklist in Corpus V1 (single operator + Claude)
- How escalation tier is determined for a given motion
- A worked example: apply the full deliberation readiness apparatus to one representative Corpus V1 motion (e.g., motion-0115 or motion-0118)
- Reference to the motion quality standard dimensions and how they map to seat responsibilities
- Forward reference: how Corpus V2 agents will consume these artifacts

Verifiable output: file exists, contains all five sections, worked example references a real motion-id.

### Step 4 — Create motion-folder phase guide

**New file:** `.nexus/docs/motion-folder-phase-guide.md`

Must contain per-file guidance for each of the six motion-package files:
- `motion.yaml` — required fields, common omissions
- `proposal.md` — structural requirements, precision signals, common failure modes
- `challenge.md` — adversarialism standard, what makes a challenge genuine vs constructed-to-dismiss
- `execution.md` — verifiability standard, difference between descriptive and verifiable steps
- `decision.yaml` — field completeness, status transition correctness
- `decision.md` — rationale standard, difference between "it passed" and "here is why it was correct"

Per file: structural requirements, common failure modes, and a before/after example (weak vs strong version of one element).

Verifiable output: file exists, contains six per-file sections, each with at least one before/after example.

### Step 5 — Create launch-packet activation path

**New file:** `.nexus/programs/launch-packet-activation.md`

Must contain:
1. Validation step: how a filled-in launch packet is checked for schema completeness and constraint consistency before conversion
2. Conversion step: which motion-package files the launch packet populates and how context inheritance is recorded
3. Inheritance step: how subsequent motions in the same program line inherit and update the launch packet
4. Hand-off step: what a clean session hand-off looks like — what state must be committed, what must be communicated to the next session

Must reference `.nexus/programs/motion-launch-packet.template.md` as the source template.

Verifiable output: file exists, contains four numbered sections matching above, references the template path.

### Step 6 — Create V2 readiness criteria

**New file:** `.nexus/docs/corpus-v2-readiness-criteria.md`

Must contain a falsifiable checklist of criteria. Per criterion:
- `id`: short identifier
- `description`: what must be true for this criterion to be met
- `current_status`: one of `met`, `unmet`, `unknown`
- `closing_action`: if unmet or unknown, the specific motion or action that would close it

Must be honest: criteria that are not yet met must be marked unmet. Must not optimistically declare criteria met that have not been demonstrated.

Verifiable output: file exists, contains at least 8 criteria, each with status and closing action where applicable.

---

## Evidence checklist

Each item is independently verifiable:

- [ ] `ls .nexus/deliberation/seat-contracts/` returns exactly six `.yaml` files
- [ ] Each seat contract YAML contains: `seat_id`, `responsibility`, `distinctive_questions`, `pass_criteria`, `block_conditions`, `reasoning_shape`
- [ ] `.nexus/deliberation/escalation-ladder.yaml` exists and contains four tiers (Tier 0–3)
- [ ] Escalation ladder includes calibration note for v0 risk score thresholds
- [ ] Escalation ladder includes non-numeric triggers (surface type, novelty flag, uncertainty flag)
- [ ] `.nexus/docs/corpus-v1-deliberation-readiness.md` exists and contains worked example referencing a real motion-id
- [ ] `.nexus/docs/motion-folder-phase-guide.md` exists and contains guidance for all six motion-package files
- [ ] `.nexus/programs/launch-packet-activation.md` exists and contains four activation steps
- [ ] `.nexus/docs/corpus-v2-readiness-criteria.md` exists and contains falsifiable criteria with honest status assessments
- [ ] `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0119/motion.yaml` exits 0
- [ ] `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` exits 0

---

## What is NOT done in this motion

- Does not modify any existing file
- Does not change runtime, UI, DB, or portal behavior
- Does not ratify or reopen any prior motion
- Does not create JAI Agent vote infrastructure
- Does not start Corpus V2
