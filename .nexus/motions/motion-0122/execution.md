# Execution: CR-05 Corpus V2 Opening Planning v0 — opening boundary, first agent-voted motion shape, and transition guardrails

**Motion:** motion-0122
**Date:** 2026-04-05

---

## Scope

Create the opening-planning artifact set. Artifacts are committed in paired
order: Pair 1 first (opening boundary + checklist), Pair 2 second (first-agent-voted-motion
contract + panel staging guidance), Pair 3 third (inherited-context packet +
program graph update + launch packet). Early stop after Pair 1 is coherent
and ratifiable.

No existing governance artifacts other than the program-graph.yaml update
are modified. No runtime, portal, UI, DB, or agent registry files are changed.

---

## Pre-flight baselines

Before writing any implementation artifact, confirm:

**Baseline 1:** `.nexus/deliberation/cr03-compliance-record.yaml` is readable
and shows motions 0118–0121 assessed (4 of 5 required). Confirms the CR-03
entrance state that motion-0122 must honestly represent.

**Baseline 2:** `.nexus/deliberation/cr04-closure-checklist.yaml` shows all
seven items `status: met`. Confirms CR-04 is actually closed, not just claimed
closed, before this motion references it as a precondition.

**Baseline 3:** `.nexus/docs/corpus-v2-readiness-criteria.md` shows CR-04
`current_status: met` and the summary as 5 met / 1 partial / 4 unmet. Confirms
the post-0121 readiness state that all planning artifacts in this motion will
reference.

If any baseline does not match expected state, stop and report the discrepancy
before proceeding.

---

## Pair 1 — Opening boundary definition (highest value, ratifiable if execution stops here)

### Step 1 — Create CR-05 opening boundary document

**New file:** `.nexus/docs/cr05-opening-boundary.md`

Must contain the following sections:

**1. Purpose.** One paragraph: this document defines the falsifiable conditions
that must be confirmed true before the Corpus V2 opening motion is authored and
ratified. It is not the opening motion. It does not start Corpus V2.

**2. Confirmed pre-conditions.** A structured list of conditions that must
be true, each with an artifact reference or command that makes it checkable:

- CR-04 is met: all seven items in `.nexus/deliberation/cr04-closure-checklist.yaml`
  show `status: met` in committed repo state. At least one real agent (registered
  in agents.generated.yaml) has produced a governed vote.json that satisfies
  agent-vote-protocol v0.1 for at least one real motion.
- CR-03 is met: `.nexus/deliberation/cr03-compliance-record.yaml` covers at
  least five consecutive post-0118 motions, all assessed PASS under the
  Evidence/Falsifiability and Governance/Safety seat contracts.
- The opening planning arc (motion-0122 line) is ratified and merged: the
  planning artifacts in `.nexus/deliberation/cr05-*` and `.nexus/docs/cr05-opening-boundary.md`
  are committed and the motion that produced them is RATIFIED in its decision.yaml.
- No prior Corpus V1 motion has pre-declared Corpus V2 started: check that
  no decision.yaml or decision.md in `.nexus/motions/` uses language declaring
  an era transition except the opening motion itself.

**3. Confirmed non-conditions.** A list of conditions that are explicitly NOT
required before the opening motion can be authored. Must include at minimum:
- CR-06 (normalization arc complete) is NOT a required precondition. It is a
  parallel track. Its incompleteness does not block the opening event.
- CR-07 (program graph complete) is NOT required. It is a documentation
  cleanup track.
- CR-08 is already met (motion-0120 launch packet). Not a precondition.
- A multi-agent panel is NOT required for the opening event. The minimum
  panel composition is defined in `.nexus/deliberation/cr05-panel-staging-guidance.yaml`.

**4. The opening event.** What the opening motion must do:
- Name each readiness criterion that is met and cite the motion that closed it.
- Declare the era boundary explicitly: the first Corpus V2 motion is the
  motion immediately following the opening motion's ratification.
- Establish the Corpus V2 governance canon baseline: reference the inherited
  artifacts and note any extensions or supersessions.
- Be the first motion in the repo that is labeled `era: corpus-v2` in its
  vote.json. No prior motion may carry this label.

**5. Hard stop.** What the opening motion must NOT do:
- Must not be authored before CR-03 is confirmed met (5/5 assessed).
- Must not claim agent independence properties beyond what agent-vote-protocol
  v0.1 requires.
- Must not supersede the seat contracts, escalation ladder, or motion quality
  standard without explicit governed extension artifacts.
- Must not be drafted as part of the same branch arc that produces this
  opening boundary document.

Verifiable output: file exists, contains all five sections, all pre-conditions
reference specific artifacts or commands.

---

### Step 2 — Create CR-05 opening checklist

**New file:** `.nexus/deliberation/cr05-opening-checklist.yaml`

Modeled on `.nexus/deliberation/cr04-closure-checklist.yaml`. Must contain:

```
schema_id: cr05-opening-checklist-v0
established: motion-0122
version: "v0"
readiness_criterion: CR-05
spec_ref: ".nexus/docs/cr05-opening-boundary.md"
```

Items (each with id, description, artifact_ref or command, verification_method,
status: unmet, closed_by: null):

- **CR05-01:** CR-04 confirmed met — all seven cr04-closure-checklist items
  show `status: met`.
  Verification: Read `.nexus/deliberation/cr04-closure-checklist.yaml`. All
  items must show `status: met`.

- **CR05-02:** CR-03 confirmed met — cr03-compliance-record.yaml covers
  at least five consecutive post-0118 motions, all PASS.
  Verification: Read `.nexus/deliberation/cr03-compliance-record.yaml`.
  Count entries with `overall: PASS`. Must be at least 5.

- **CR05-03:** Opening planning arc ratified — motion-0122 decision.yaml
  shows `status: RATIFIED`.
  Verification: Read `.nexus/motions/motion-0122/decision.yaml`. Confirm
  `status: RATIFIED`.

- **CR05-04:** Opening boundary document committed — `.nexus/docs/cr05-opening-boundary.md`
  exists and contains all five required sections.
  Verification: Read the file. Confirm sections: Purpose, Confirmed pre-conditions,
  Confirmed non-conditions, The opening event, Hard stop.

- **CR05-05:** First-agent-voted-motion contract committed —
  `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md` exists
  with minimum panel composition and required evidence artifacts specified.
  Verification: Read the file. Confirm minimum_panel_composition and
  required_evidence_artifacts sections.

- **CR05-06:** Panel staging guidance committed —
  `.nexus/deliberation/cr05-panel-staging-guidance.yaml` exists and answers
  the ratification-mechanism question for the opening event specifically.
  Verification: Read the file. Confirm `opening_event_ratification_mechanism`
  field is present and non-null.

- **CR05-07:** Inherited-context packet committed —
  `.nexus/deliberation/cr05-inherited-context-packet.md` exists and lists
  artifacts in each of: carry_forward_unchanged, must_extend, v1_only.
  Verification: Read the file. Confirm all three categories are present
  and non-empty.

- **CR05-08:** No prior motion claims Corpus V2 started — no committed
  decision.yaml or decision.md declares an era transition before the
  opening motion.
  Verification: `grep -r "corpus-v2" .nexus/motions/*/decision.yaml` must
  not show any `era: corpus-v2` or equivalent declaration in a ratified motion.

Verifiable output: file exists, parseable as YAML, eight items present,
all `status: unmet`, all with artifact_ref or verification_method.

---

## Pair 2 — Opening motion contract and panel staging

### Step 3 — Create first-agent-voted-motion contract

**New file:** `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md`

Must contain the following sections:

**1. Purpose.** One paragraph: this contract defines the minimum requirements
for the Corpus V2 opening motion to be valid. The opening motion must satisfy
every item in this contract before it is submitted for ratification.

**2. Minimum panel composition for the opening event.**

Specify as a structured list with counts:
- Minimum human panel: the proposer/challenger/arbiter structure from Corpus V1
  is retained as the human panel floor. The operator must still provide all
  three human roles.
- Minimum agent panel: at least one registered agent (agent_id in
  agents.generated.yaml with dev-jai-nexus scope) must produce a governed
  evaluation trace and agent-vote.json conforming to agent-vote-protocol v0.1
  for the opening motion. This is the minimum. The opening event may include
  additional agents.
- Independence requirement: the agent participant in the opening event must
  not be the sole determinant of ratification. The human panel retains ratification
  authority. The agent participation is required evidence of the transition — it
  is not the ratification mechanism for the opening motion itself (per
  cr05-panel-staging-guidance.yaml).

**3. Required evidence artifacts.** A specific, named list:
- `vote.json` satisfying the standard human vote schema with `era: corpus-v2`
- `agent-vote.json` satisfying agent-vote-protocol v0.1 (from the agent
  panel participant)
- An evaluation trace committed at the path referenced by `evaluation_trace_ref`
  in the agent-vote.json, addressing at minimum 3 distinctive_questions and
  all block_conditions from the agent's assigned seat contract
- `verify.json` with both required gates passing (validate_motion, validate_agency)
- A committed corpus-v2 canon baseline artifact declaring which Corpus V1
  artifacts are inherited and which are extended

**4. What the opening motion establishes.** A list of what only the opening
motion can do — things that cannot be done by implication or by a prior
Corpus V1 motion:
- Declare the era boundary: the motion after this one operates under Corpus V2
- Label its own vote.json with `era: corpus-v2` as the first such label
- Extend the motion quality standard, seat contracts, or escalation ladder for
  the agent-voted era (if any extensions are needed)
- Register the agent panel composition baseline for Corpus V2 motions

**5. What the opening motion inherits.** A reference to
`.nexus/deliberation/cr05-inherited-context-packet.md` and confirmation that
the opening motion must cite this packet in its inherited-context record rather
than asserting inheritance informally.

**6. Red lines.** Specific, named configurations that render an opening motion
invalid regardless of author intent:
- The opening motion is ratified with `era: corpus-v2` in vote.json but no
  agent participant in the panel — a human-only vote cannot be the first
  Corpus V2 vote.
- The opening motion's agent-vote.json is authored by a human operator with
  an agent name in it, with no corresponding registered entry in agents.generated.yaml.
- The only agent participant in the opening event is
  `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001` acting without an
  evaluation trace that addresses at least 3 of the 5 distinctive_questions
  from its assigned seat contract.
- The opening motion's decision.md does not explicitly state that each
  CR05-opening-checklist item is met with a specific artifact reference.
- The opening motion is authored in the same branch arc as this planning motion.

Verifiable output: file exists, contains all six sections. Red lines are
specific and reference named artifacts or agent_ids. No red line is a
prose-only condition.

---

### Step 4 — Create panel staging guidance

**New file:** `.nexus/deliberation/cr05-panel-staging-guidance.yaml`

Must contain:

```yaml
schema_id: cr05-panel-staging-guidance-v0
established: motion-0122
version: "v0"
scope: "opening event only — does not govern Corpus V2 panel composition for post-opening motions"
```

Fields required:

- `opening_event_ratification_mechanism`: The mechanism used to ratify the
  Corpus V2 opening motion. Must be one of: `unanimous_consent_with_agent_witness`
  (Corpus V1 human panel ratifies; agent participation is required evidence
  but not vote-weighted) or `agent_participated_ratification` (agent vote
  carries defined weight in ratification). Must include a `rationale` field
  explaining the choice.

- `rationale_for_mechanism_choice`: Why this mechanism is the right one for
  the opening event. Must address the bootstrapping problem explicitly: the
  Corpus V2 governance canon that would govern agent-participated ratification
  does not exist at the time the opening motion is ratified, because the opening
  motion is what establishes it. If agent-participated ratification is chosen,
  this field must explain how the circular dependency is resolved.

- `first_agent_vote_weight`: Either `zero` (agent participation is required
  evidence but carries no vote weight in ratification), `advisory` (agent
  vote informs the panel but is not binding), or `weighted` (agent vote
  contributes a defined fraction to ratification). Must include a `justification`
  field. `weighted` requires the fraction to be specified.

- `transition_note`: A note confirming that this guidance applies only to the
  opening event. Post-opening Corpus V2 motions are governed by the canon
  established by the opening motion, not by this guidance. Reference to where
  the post-opening rules will be authored.

- `prohibited_configurations`: A list of panel configurations that are invalid
  for the opening event regardless of operator preference. At minimum: an
  all-human panel with `era: corpus-v2` in vote.json; a panel where the agent
  participant has no committed evaluation trace.

Verifiable output: file exists, parseable as YAML, `opening_event_ratification_mechanism`
is non-null and is one of the two valid values, `first_agent_vote_weight` is
non-null and is one of the three valid values, scope field explicitly limits
this to the opening event.

---

## Pair 3 — Context inheritance and arc registration

### Step 5 — Create inherited-context packet

**New file:** `.nexus/deliberation/cr05-inherited-context-packet.md`

Must contain three structured sections:

**carry_forward_unchanged:** Corpus V1 artifacts that carry into Corpus V2
without modification. The opening motion need not re-establish them; it must
cite this packet as the authorization for their continuity. Include:
- `.nexus/deliberation/seat-contracts/` (all six seat contracts)
- `.nexus/deliberation/escalation-ladder.yaml`
- `.nexus/deliberation/agent-vote-protocol.yaml` (v0.1; version-pinned)
- `.nexus/docs/corpus-v1-program-planning-canon.md`
- `.nexus/docs/corpus-v1-deliberation-readiness.md`
- `.nexus/deliberation/cr03-compliance-record.yaml` (historical record; not extended)
- `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` (registry
  is continuous; Corpus V2 adds agents, does not reset)

**must_extend:** Artifacts that must be explicitly extended or superseded by
the opening motion or the first Corpus V2 policy motion. The opening motion
may extend them or declare that an extension motion will follow. Must include:
- `corpus-v2-readiness-criteria.md` — the V2 opening motion must update
  CR-05 to `met` and may update other criteria; a Corpus V2 successor criteria
  document is expected.
- `program-graph.yaml` — the opening motion must register the first Corpus V2
  program or confirm the continuity approach.
- The motion quality standard (motion-0118, §5) — if Corpus V2 adds
  agent-authored motions, the quality standard may need extension for
  non-human proposers. The opening motion must explicitly address this.

**v1_only:** Corpus V1 artifacts that do not carry forward because they are
V1-specific governance records:
- `.nexus/deliberation/cr04-closure-checklist.yaml` — CR-04 is a V1
  readiness criterion. It is met and closed. It is a historical record.
- `.nexus/deliberation/cr05-opening-checklist.yaml` — the opening criteria
  checklist is consumed by the opening event and becomes a historical record
  after CR-05 is met.
- All per-motion artifacts in `.nexus/motions/motion-0001/` through
  `.nexus/motions/motion-0122/` — Corpus V1 motion history is permanent
  record, not active governance state.

Must include a note: inherited-context is established here and must be cited
by the opening motion's inherited-context record. The opening motion may not
extend or supersede any artifact in `carry_forward_unchanged` without first
producing a governed extension artifact in its own package.

Verifiable output: file exists, contains all three sections, each section
is non-empty, all referenced artifacts are actual paths in the repo.

---

### Step 6 — Update program-graph.yaml and create launch packet

**File to update:** `.nexus/programs/program-graph.yaml`

Changes required:
- Under the `corpus-v2-readiness-blockers` epic (or a new `corpus-v2-opening`
  epic — choose whichever the current graph structure supports cleanly):
  add program entry for `q2-cr05-opening-planning` with `status: open`,
  first_motion: motion-0122.
- Update `generated_at` to `"2026-04-05T00:00:00.000Z"`.

Verifiable output: `q2-cr05-opening-planning` appears in program-graph.yaml
with `status: open`.

**New file:** `.nexus/programs/q2-cr05-opening-planning-launch-packet.md`

Must follow the template. Must be self-contained: any agent or operator reading
it can execute the next motion in the line without external instruction.

Required content:
1. **Goal:** Produce the pre-committed specification layer for the Corpus V2
   opening event so that the opening motion can be authored and ratified as
   a genuine, falsifiable era transition rather than a symbolic declaration.
2. **Done when:** All eight CR05-opening-checklist items show `status: met` in
   committed repo state, attributable to ratified motions. The opening motion
   (CR-05) exists, is ratified, and its vote.json carries `era: corpus-v2`.
3. **Baseline:** Post-0122 state — opening boundary, contract, staging guidance,
   inherited-context packet, and checklist committed. CR-03 at 4/5 (motion-0122
   may close it if implemented and ratified well). CR-04 met. The next motion
   in this line must wait until CR-03 is confirmed met before authoring the
   opening event.
4. **Constraints:** Hard: do not author the Corpus V2 opening motion in the same
   session or branch as the planning artifacts; do not ratify the opening motion
   before CR-03 is confirmed met; do not simulate agent participation in the
   opening event. Soft: author the opening event in the minimum number of motions
   that satisfies the cr05-first-agent-voted-motion-contract.
5. **Decomposition:** motion-0122 (this planning motion) → CR-03 confirmation
   (may be a separate motion or covered by motion-0122 itself if ratified well)
   → opening motion (CR-05 — first Corpus V2 motion). Sequential: the opening
   motion depends on planning artifacts being ratified.
6. **Dependency graph:** Opening motion depends on: motion-0122 ratified;
   CR-03 confirmed met; CR-04 confirmed met (already true post-0121).
7. **Agent/panel strategy for the opening event:** Per cr05-panel-staging-guidance.yaml.
   Human panel (proposer/challenger/arbiter) plus minimum one registered
   agent participant with evaluation trace.
8. **First next motion scope:** If CR-03 is not yet met after motion-0122
   ratification — assess the fifth qualifying motion per the compliance record.
   If CR-03 is met — author the Corpus V2 opening motion against the contract.
9. **Opening motion must prove:** Each CR05-opening-checklist item met with
   evidence; `era: corpus-v2` in vote.json; agent-vote.json from a registered
   agent; evaluation trace committed; corpus-v2 canon baseline artifact declared.
10. **Cost estimate:** 1–2 sessions, 2–3 motions (this planning motion + optional
    CR-03 close + opening event). Surfaces: .nexus/deliberation/ + .nexus/docs/ +
    .nexus/programs/ + .nexus/motions/ (opening motion package only).

Verifiable output: file exists, no bracketed placeholder strings remain,
constraint section explicitly states the opening motion may not be authored
in the same branch as the planning artifacts.

---

## Evidence checklist

Each item is independently verifiable:

- [ ] Pre-flight Baseline 1: cr03-compliance-record.yaml readable, shows
  motions 0118–0121 assessed (4 of 5)
- [ ] Pre-flight Baseline 2: cr04-closure-checklist.yaml shows all seven items
  `status: met`
- [ ] Pre-flight Baseline 3: corpus-v2-readiness-criteria.md shows CR-04
  `current_status: met`, summary 5 met / 1 partial / 4 unmet
- [ ] `.nexus/docs/cr05-opening-boundary.md` exists with all five required sections
- [ ] cr05-opening-boundary.md Confirmed pre-conditions: all conditions reference
  specific artifact paths or commands
- [ ] cr05-opening-boundary.md Hard stop: explicitly states opening motion must
  not be drafted in the same branch arc as this document
- [ ] `.nexus/deliberation/cr05-opening-checklist.yaml` exists, parseable as YAML,
  eight items present, all `status: unmet`
- [ ] cr05-opening-checklist.yaml schema_id: cr05-opening-checklist-v0
- [ ] `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md` exists
  with all six sections including red lines
- [ ] cr05-first-agent-voted-motion-contract.md red lines: each red line references
  a specific named artifact or agent_id — no prose-only conditions
- [ ] `.nexus/deliberation/cr05-panel-staging-guidance.yaml` exists, parseable
  as YAML, `opening_event_ratification_mechanism` field is non-null
- [ ] cr05-panel-staging-guidance.yaml `scope` field explicitly limits this to
  "opening event only"
- [ ] `.nexus/deliberation/cr05-inherited-context-packet.md` exists with all
  three sections: carry_forward_unchanged, must_extend, v1_only
- [ ] cr05-inherited-context-packet.md: all referenced artifact paths are
  actual paths in the repo
- [ ] `.nexus/programs/program-graph.yaml` contains `q2-cr05-opening-planning`
  with `status: open`
- [ ] `.nexus/programs/q2-cr05-opening-planning-launch-packet.md` exists with
  no `[bracketed placeholder]` strings
- [ ] Launch packet constraint section: explicitly states opening motion may not
  be authored in the same branch as planning artifacts
- [ ] `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0122/motion.yaml`
  exits 0
- [ ] `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
  exits 0

---

## What is NOT done in this motion

- Does not author the Corpus V2 opening motion
- Does not declare Corpus V2 started
- Does not update cr03-compliance-record.yaml (motion-0122 itself is not yet
  assessed; that is a post-ratification action)
- Does not update corpus-v2-readiness-criteria.md (no criterion changes state
  as a direct result of this planning motion)
- Does not modify the agent vote protocol, seat contracts, or escalation ladder
- Does not modify agents.generated.yaml
- Does not change runtime, portal, UI, or DB behavior
- Does not ratify any prior motion
- Does not reopen normalization or widen into OffBook.ai rollout work
