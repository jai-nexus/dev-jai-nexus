# Proposal: CR-05 Corpus V2 Opening v0 — first true agent-voted opening event and governed transition into Corpus V2

**Motion:** motion-0123
**Kind:** governance-policy
**Date:** 2026-04-05

---

## Where we are

Five motions have built the foundation for this moment:

- **motion-0118**: Corpus V1 Program Planning Canon v0 — the 9-phase planning workflow, quality standard, and launch-packet template
- **motion-0119**: Corpus V1 Deliberation Readiness v0 — six seat contracts, escalation ladder, activation path, and the ten Corpus V2 readiness criteria
- **motion-0120**: Corpus V2 Readiness Blockers v0 — the CR-04 specification, agent vote protocol v0.1, and the closure checklist
- **motion-0121**: CR-04 JAI Agent Operational v0 — the minimum viable first agent registered, assigned, and evaluated; all seven CR-04 checklist items met
- **motion-0122**: CR-05 Corpus V2 Opening Planning v0 — the opening boundary, opening criteria checklist, first-agent-voted-motion contract, panel staging guidance, inherited-context packet, and CR-03 closure

The Corpus V2 readiness state as of motion-0122 ratification:

| Criterion | Status |
|---|---|
| CR-01 | met — motion-0118 |
| CR-02 | met — motion-0119 |
| CR-03 | met — motion-0122 |
| CR-04 | met — motion-0121 |
| CR-05 | **unmet — this motion** |
| CR-06 | partial |
| CR-07 | unmet |
| CR-08 | met — motion-0120 |
| CR-09 | met — motion-0108 |
| CR-10 | met — motion-0095 |

All four pre-conditions in `.nexus/docs/cr05-opening-boundary.md` are confirmed met:
- P-1 (CR-04 met): ✓ — motion-0121
- P-2 (CR-03 met): ✓ — motion-0122
- P-3 (opening planning arc ratified): ✓ — motion-0122 decision.yaml status: RATIFIED
- P-4 (no prior V2 claim): ✓ — no committed motion carries `era: corpus-v2`

The opening event is now authorable. This motion is it.

---

## What this motion is — and is not

**This is the actual opening event.** It is not more planning. It does not
define what the opening looks like — that was motion-0122's work. It executes
the opening per the pre-committed contract and produces the artifacts that
make the era transition real, governed, and traceable.

The distinction matters: every prior motion in this arc was authorizing or
specifying the opening. This motion is the opening. The word "governed" is
doing work here — the opening event is governed because it operates against
a pre-committed contract (cr05-first-agent-voted-motion-contract.md),
a pre-committed checklist (cr05-opening-checklist.yaml), a pre-committed
panel mechanism (cr05-panel-staging-guidance.yaml), and a pre-committed
inheritance record (cr05-inherited-context-packet.md). None of these were
written in the same branch as this motion. The authority and the execution
are separated.

**Corpus V2 starts only if this motion is later implemented and ratified.**
The package being drafted now is the proposal. Implementation produces the
required artifacts. Ratification is the governed event that crosses the era
boundary. Until ratification, Corpus V2 has not started.

---

## The five things this motion must make real

### 1. The era boundary in the governance record

The vote.json for motion-0123 will be the first committed vote.json in the
corpus with `era: corpus-v2`. This is not a label — it is a commitment that
binds all governance from this motion forward. Every motion ratified after
this one will be a Corpus V2 motion. The entire preceding corpus (motions
0001–0122) is permanently Corpus V1 record. The boundary is in the committed
artifacts, not in a prose declaration.

This works because the `era` field in vote.json records the era under which
the motion's governance obligations are interpreted going forward. The
ratification mechanism is still `unanimous_consent_with_agent_witness` —
the Corpus V1 mechanism extended for the opening event per
`.nexus/deliberation/cr05-panel-staging-guidance.yaml`. The era label in
vote.json is the declaration of result, not a description of the ratification
process.

### 2. Real agent participation in the opening record

Per `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md` §2 and
`.nexus/deliberation/cr05-panel-staging-guidance.yaml`, the opening event
requires at least one registered agent to produce a governed evaluation trace
and agent-vote.json for motion-0123. This is required participation, not
optional observation.

The agent participant is `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`
(registered in agents.generated.yaml, evidence-falsifiability seat, established
by motion-0121). The agent evaluates motion-0123 from the evidence-falsifiability
perspective and produces a governed output conforming to agent-vote-protocol v0.1.

The non-independence limitation from motion-0121 persists: the agent and the
motion author share the underlying model (claude-sonnet-4-6). This is
acknowledged honestly in the evaluation trace, as required by the contract
§2 independence note. The advance over CR-04 is the object of evaluation:
the agent now evaluates a motion that declares an era boundary, not merely
its own instantiation. The structural proof is real; the adversarial proof
is not yet achievable in the current agent pool. Corpus V2's canon will
govern how adversarial independence is established as additional agents become
available.

### 3. The Corpus V2 governance canon baseline

The opening event produces `.nexus/docs/corpus-v2-canon-baseline.md` — the
committed artifact that constitutes the Corpus V2 governance canon at opening.
This is not decision.md prose; it is a separate, path-referenced, independently
readable governance document.

The canon baseline must:
- Cite `.nexus/deliberation/cr05-inherited-context-packet.md` as its Corpus V1
  inheritance record
- Confirm which `carry_forward_unchanged` artifacts carry into Corpus V2 without
  modification and under what terms
- Address each `must_extend` item from the inherited-context packet: corpus-v2
  readiness criteria (CR-05 update), program graph (era entry), motion quality
  standard (defer to named follow-on motion explicitly)
- Declare what the opening event adds to the canon: advisory agent participation
  as the baseline for Corpus V2 motions; era labeling requirement for all
  post-opening motions; first Corpus V2 program will be established by a
  follow-on motion

### 4. CR-05 opening checklist closure

The opening event's decision.md must address each of the eight items in
`.nexus/deliberation/cr05-opening-checklist.yaml` with specific artifact
references. CR05-01 and CR05-08 are already met. CR05-02 through CR05-07
become closeable after motion-0122 ratification and are closed by this motion.

The checklist is the governed record that CR-05 is actually met — not the
criteria doc alone, and not decision.md prose alone.

### 5. The post-opening boundary

Ratification of motion-0123 makes exactly the following true:

- CR-05 is met: corpus-v2-readiness-criteria.md is updated to reflect `met`
- The era boundary is permanent: vote.json with `era: corpus-v2` exists in
  committed repo state; no prior motion carries this label
- The Corpus V2 governance canon baseline is committed at a named path
- Post-opening motions carry `era: corpus-v2` in their vote.json
- Agent participation is required for Corpus V2 ratification per the canon
  (advisory weight, per cr05-panel-staging-guidance.yaml, until the canon
  evolves through subsequent governed motions)
- The program graph records the era boundary: the corpus-v1 era entry's
  `last` field is set to motion-0122 (the final Corpus V1 motion); the
  corpus-v2 era entry opens with motion-0123 as first

Ratification of motion-0123 does NOT make the following true:

- The full Corpus V2 canon is complete (it is a baseline; subsequent governed
  motions will extend it)
- Adversarial agent independence is achieved (deferred to post-opening canon
  evolution)
- CR-06 or CR-07 are closed (parallel tracks, not affected by this motion)
- Agent-authored motion proposals are governed (deferred to a post-opening
  motion quality standard extension)
- The agent registry is changed (202 agents; the opening event uses the
  existing agent, not a new one)

---

## What this motion produces

### Pair 1 — Agent evaluation (required; opening event is invalid without this pair)

**New file:** `.nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0123-trace.yaml`

The evaluation trace for the opening event. The agent evaluates motion-0123
from the evidence-falsifiability perspective. Must address at minimum 3 of
the 5 distinctive_questions from the evidence-falsifiability seat contract
(contract §3 requirement: ≥ 3 questions_evaluated). Must check all 4
block_conditions. Must acknowledge the non-independence limitation per §2 of
the contract. `pass_or_block` expected: PASS (all block conditions should not
trigger for a well-formed opening motion).

**New file:** `.nexus/motions/motion-0123/agent-vote.json`

The agent evaluation artifact. All 8 agent-vote-protocol v0.1 extension fields
present. `vote_type: agent`, `agent_id: nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`,
`era: corpus-v2` on the motion, `evaluation_trace_ref` matching the evaluation trace path.

### Pair 2 — Canon baseline and inherited context declaration

**New file:** `.nexus/docs/corpus-v2-canon-baseline.md`

The Corpus V2 governance canon at opening. References cr05-inherited-context-packet.md
as the V1 inheritance record. Addresses all four `must_extend` items. Declares
the minimum Corpus V2 governance obligations for post-opening motions. This
artifact is the canon; decision.md prose alone does not constitute a canon.

**Updated file:** `.nexus/programs/program-graph.yaml`

The corpus-v1 era entry's `last` field set to `motion-0122` (the final Corpus V1
motion in committed state at opening time). A corpus-v2 era entry added with
`first: motion-0123` and `governance_model: agent-participated-advisory`. The
first Corpus V2 program will be established by a follow-on motion; the era entry
opens the record. `generated_at` updated to `2026-04-05T00:00:00.000Z`.

### Pair 3 — Opening event closure record

**Updated file:** `.nexus/deliberation/cr05-opening-checklist.yaml`

All eight items promoted to `status: met` with `closed_by: motion-0123` and
per-item `evidence_ref` citations. CR05-01 and CR05-08 were already met;
their `closed_by` fields are confirmed. CR05-02 through CR05-07 closed by
this motion with specific artifact references.

**Updated file:** `.nexus/docs/corpus-v2-readiness-criteria.md`

CR-05 promoted to `current_status: met`. Assessment cites the opening event
artifacts. Summary updated to 8 met / 1 partial / 1 unmet.

---

## What this motion does NOT do

- Does not declare Corpus V2 started before this motion is later implemented
  and ratified
- Does not close CR-06 or CR-07 (parallel tracks not affected by the opening)
- Does not add agents to the registry; uses the existing agent established
  by motion-0121
- Does not change the agent vote protocol (v0.1 carries forward unchanged)
- Does not change the seat contracts (carry forward unchanged per inherited-context-packet)
- Does not govern agent-authored motion proposals (deferred to a post-opening
  quality standard extension motion)
- Does not establish the full Corpus V2 canon; establishes the opening-era
  baseline from which the canon will grow
- Does not reopen normalization
- Does not widen into OffBook.ai rollout work
- Does not modify runtime, portal, UI, DB, or agent registry files

---

## Success criteria

All eight CR05-opening-checklist items must be met in committed repo state:

1. **CR05-01** (CR-04 confirmed met): Verified — all seven cr04-closure-checklist items `status: met`.
2. **CR05-02** (CR-03 confirmed met): Verified — cr03-compliance-record 5/5 entries PASS.
3. **CR05-03** (planning arc ratified): Verified — motion-0122 `decision.yaml status: RATIFIED`.
4. **CR05-04** (opening boundary committed): Verified — cr05-opening-boundary.md 5 sections present.
5. **CR05-05** (first-agent-voted-motion contract committed): Verified — cr05-first-agent-voted-motion-contract.md with minimum_panel_composition and red lines.
6. **CR05-06** (panel staging guidance committed): Verified — cr05-panel-staging-guidance.yaml `opening_event_ratification_mechanism` non-null.
7. **CR05-07** (inherited-context packet committed): Verified — cr05-inherited-context-packet.md 3 sections non-empty.
8. **CR05-08** (no prior V2 claim): Verified at implementation time — grep confirms no prior `era: corpus-v2` in committed vote.json files.

Plus the six required evidence artifacts from cr05-first-agent-voted-motion-contract §3:

9. `vote.json` with `era: corpus-v2` — first such label in corpus
10. `agent-vote.json` satisfying agent-vote-protocol v0.1 — all 8 extension fields
11. Evaluation trace at path matching `evaluation_trace_ref` — `questions_evaluated` ≥ 3 entries
12. `verify.json` — both gates pass (validate_motion exit 0, validate_agency exit 0)
13. `corpus-v2-canon-baseline.md` — committed, path-referenced, independently readable
14. CR-05 checklist closure record in decision.md — each item cited with artifact reference

All success criteria must be satisfied in committed repo state before ratification. No criterion may be satisfied by author assertion alone.
