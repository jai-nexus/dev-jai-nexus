# CR-05 First Agent-Voted Motion Contract

**Established:** motion-0122
**Date:** 2026-04-05
**Version:** v0
**Authority:** This contract defines the minimum requirements for the Corpus V2
opening motion to be considered valid. The opening motion must satisfy every
item in this contract before it is submitted for ratification. This contract
is a Corpus V1 pre-commitment, authored before the opening event and ratified
independently. It cannot be modified by the opening motion's author in the
same session or branch arc as the opening motion drafting.

---

## 1. Purpose

This contract defines what a valid Corpus V2 opening motion looks like: its
minimum panel composition, the evidence artifacts it must produce, the
distinction between what it establishes and what it merely inherits, and the
specific configurations that would render it invalid regardless of author intent.

The opening motion is the highest-stakes governance motion in the corpus to
date. It declares the era boundary, sets every precedent the new era inherits,
and is the first motion where agent participation in the governance record is
required rather than optional. A weak opening motion is a permanent precedent.
This contract exists to make "weak" and "invalid" falsifiable, not subjective.

---

## 2. Minimum panel composition for the opening event

The opening motion must include both a human panel and an agent participant.
Neither alone is sufficient.

**Human panel (floor, not ceiling):**
- Proposer role: one human identity (JerryIngram or successor operator)
- Challenger role: one human identity
- Arbiter role: one human identity

The human panel composition follows the Corpus V1 unanimous consent model as
the minimum floor. The human panel retains ratification authority for the
opening event per `.nexus/deliberation/cr05-panel-staging-guidance.yaml`. The
opening motion may include additional human roles beyond the floor.

**Agent participant (required, not optional):**
- At least one registered agent must be listed in the opening motion's panel
- The agent's `agent_id` must resolve to a committed entry in
  `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` with
  `scope` including `dev-jai-nexus`
- The agent must produce a governed evaluation trace conforming to
  `.nexus/deliberation/agent-vote-protocol.yaml` §2 for the opening motion
- The agent must produce an `agent-vote.json` for the opening motion satisfying
  all eight extension fields in agent-vote-protocol v0.1

**Independence note:**
The agent participant in the opening event will likely be
`nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001` or a successor agent. The
non-independence limitation acknowledged in motion-0121 (same underlying model
as the motion author) remains a structural reality of the current agent pool.
The opening motion must acknowledge this honestly in decision.md. The opening
event does not require adversarial independence — it requires genuine agent
participation. The opening motion may add a second agent or human observer
beyond the floor; doing so strengthens but does not replace the required floor.

---

## 3. Required evidence artifacts

The opening motion package must contain or reference the following artifacts
at ratification time. Artifacts listed with a canonical path must exist at
that exact path in committed repo state.

| Artifact | Path | Requirement |
|---|---|---|
| vote.json | `.nexus/motions/motion-NNNN/vote.json` | Standard human vote schema; `era: corpus-v2` field present; `vote_mechanism` records the mechanism from cr05-panel-staging-guidance |
| agent-vote.json | `.nexus/motions/motion-NNNN/agent-vote.json` | Satisfies agent-vote-protocol v0.1 — all eight extension fields present; `vote_type: agent`; outcome.result set |
| evaluation trace | `.nexus/deliberation/evaluation-traces/<agent_id>-motion-NNNN-trace.yaml` | Path must match evaluation_trace_ref in agent-vote.json; non-empty questions_evaluated (minimum 3 of the seat's distinctive_questions addressed); all block_conditions_checked |
| verify.json | `.nexus/motions/motion-NNNN/verify.json` | Both required gates pass: validate_motion exit 0, validate_agency exit 0 |
| corpus-v2 canon baseline | `.nexus/docs/corpus-v2-canon-baseline.md` or equivalent | Committed artifact declaring which Corpus V1 artifacts are inherited unchanged, which are extended, and what the opening event adds to the canon. Must reference cr05-inherited-context-packet.md as the V1 inheritance source. |
| cr05 checklist closure record | In decision.md | The opening motion's decision.md must address each CR05-opening-checklist item with a specific artifact reference. |

The opening motion fails this contract if any of the six artifact categories
is absent or incomplete at ratification time.

---

## 4. What the opening motion establishes

The following outcomes are exclusive to the opening motion — they cannot be
produced by implication in a prior Corpus V1 motion, by side-effect of another
motion's ratification, or by informal declaration:

**4.1 Era declaration.** The opening motion is the first and only motion in
the corpus with `era: corpus-v2` in vote.json. Its decision.md explicitly
states that the era boundary is crossed by this ratification. No prior Corpus V1
motion may carry this label.

**4.2 Canon baseline.** The opening motion produces the Corpus V2 governance
canon baseline artifact (see §3, row 5). This artifact, not decision.md prose,
is the authoritative statement of what Corpus V2 inherits and what it adds.

**4.3 First agent ratification witness.** The opening motion contains the
first agent-vote.json for a motion that carries `era: corpus-v2`. This is the
record of genuine agent participation in the era transition — the moment when
agent involvement moves from the CR-04 structural proof to the canonical opening
event.

**4.4 Corpus V2 program line opening.** The opening motion's branch registers
the first Corpus V2 program in program-graph.yaml. The era field in the program
graph transitions from corpus-v1 to corpus-v2 for the new program.

---

## 5. What the opening motion inherits

The opening motion inherits the following from Corpus V1 without requiring
re-establishment. It must cite
`.nexus/deliberation/cr05-inherited-context-packet.md` as the authoritative
inheritance record in its inherited-context section.

**Carried forward unchanged (no modification required or permitted without
a separate governed extension artifact):**
- All six seat contracts in `.nexus/deliberation/seat-contracts/`
- The escalation ladder at `.nexus/deliberation/escalation-ladder.yaml`
- Agent vote protocol v0.1 at `.nexus/deliberation/agent-vote-protocol.yaml`
- The Corpus V1 motion quality standard (motion-0118 §5)
- The program planning canon at `.nexus/docs/corpus-v1-program-planning-canon.md`

**Items requiring explicit extension or declaration:**
- `corpus-v2-readiness-criteria.md`: must update CR-05 to `met`
- `program-graph.yaml`: must register the first Corpus V2 program
- The motion quality standard (if agent-authored motions are introduced in
  Corpus V2, the standard must be extended for non-human proposers)

The opening motion may extend or supersede items in the must-extend list. It
may not modify items in the carry-forward-unchanged list without a separately
committed, discrete extension artifact in the same motion package.

---

## 6. Red lines

The following configurations render an opening motion invalid regardless of
author intent. Each red line references a specific named artifact or agent_id.
These are checkable conditions, not prose judgements.

**RL-1: Human-only vote.json with era: corpus-v2.**
If the opening motion's vote.json carries `era: corpus-v2` but the panel
contains only human roles (no `agent_id` entry resolving to a registered
agent in agents.generated.yaml), the opening motion is invalid. An era
declaration without a real agent participant is a Corpus V1 motion with a
wrong label. Check: panel array in vote.json must contain at least one entry
with `agent_id` matching an agents.generated.yaml entry.

**RL-2: Agent-vote.json authored by a human operator without a registered agent.**
If the opening motion's `agent-vote.json` carries an `agent_id` field whose
value does not resolve to a committed entry in
`workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`, the
agent-vote.json is a governance violation per agent-vote-protocol v0.1 §5
(anti-patterns: Human-authored agent vote). Check: `node -e "const a =
require('./workspace/jai-nexus/nexus-core/registry/agents.generated.yaml');
// confirm agent_id present"` — or use validate_agency.

**RL-3: Evaluation trace below the minimum threshold.**
If the opening motion's evaluation trace has `questions_evaluated` with fewer
than 3 entries, or has `block_conditions_checked` with 0 entries, the trace
does not satisfy the contract §3 evidence requirement. The structural proof
requires genuine engagement with the seat contract, not tokenistic citation.
Check: count entries in questions_evaluated and block_conditions_checked in
the committed trace file.

**RL-4: Opening motion drafted in the same branch arc as the planning artifacts.**
If the opening motion is authored in the same branch as this document (i.e.,
`sprint/q2-cr05-opening-planning` or any branch that also contains the
original commit of this file), the arc separation required by challenge C-2
(motion-0122 challenge.md) is violated. The planning arc must be merged before
the opening motion's branch is created. Check: `git log` of the opening motion's
branch — it must not contain the initial commit of this file.

**RL-5: CR-03 not confirmed met at opening motion authoring time.**
If `.nexus/deliberation/cr03-compliance-record.yaml` covers fewer than 5
consecutive post-0118 motions with overall: PASS at the time the opening motion
is authored, the opening motion violates hard stop HS-1 in
`.nexus/docs/cr05-opening-boundary.md`. The opening motion must not exist
until CR-03 is met. Check: count overall: PASS entries in cr03-compliance-record.yaml.

**RL-6: Corpus V2 canon declared by prose alone.**
If the opening motion's decision.md contains claims like "Corpus V2 has begun"
or "the new era is governed by the following principles" without a committed
canon baseline artifact (§3, row 5), the opening event is invalid. A governance
era cannot be started by prose in a decision document. The canon must be a
committed file that is independently readable. Check: confirm the canon baseline
artifact path listed in §3 exists in committed repo state.
