# Decision: CR-05 Corpus V2 Opening Planning v0 — opening boundary, first agent-voted motion shape, and transition guardrails

**Motion:** motion-0122
**Status:** RATIFIED
**Date:** 2026-04-05

---

## Summary

motion-0122 produces the pre-committed specification layer for the Corpus V2
opening event. CR-04 has been met since motion-0121. The question this motion
answers is not "can an agent exist?" — that was answered — but "how should the
opening event be designed so it is genuine, governed, and not symbolic?"

The motion commits seven artifacts that together define the opening boundary:
what must be true before the opening motion is authored, who must participate,
what evidence the opening motion must produce, which Corpus V1 artifacts carry
forward unchanged, and which configurations would render an opening motion
invalid. None of these answers are prose — they are committed, path-referenced,
independently checkable governance artifacts.

**CR-03 is now met.** motion-0122 qualifies as the fifth consecutive qualifying
post-0118 motion. The cr03-compliance-record has been updated: motion-0121's
entry promoted from CONDITIONAL to PASS post-ratification; motion-0122 added
with all five dimensions PASS. CR-03 is declared met.

**CR-08 correction.** corpus-v2-readiness-criteria.md is corrected to reflect
CR-08 as met (motion-0120 produced the launch packet; the status update was
missed at that ratification; the correction is required for consistency with
cr05-opening-boundary.md NC-3).

**Corpus V2 has not started.** CR-03 being met unblocks the opening event
from one of its required pre-conditions. The opening motion must still be
authored in a separate branch arc from this one, after this arc is merged.
CR-05 remains out of scope for this motion.

---

## Challenges reviewed

Six challenges were raised and resolved:

- **C-1** (planning for more planning): Resolved. The test — can a new session
  author the opening motion without asking what a valid opening requires? — is
  now answerable: yes. cr05-opening-boundary.md, cr05-first-agent-voted-motion-contract.md,
  and cr05-panel-staging-guidance.yaml together constitute a complete, self-contained
  brief for the opening event.
- **C-2** (circular contract): Resolved by arc separation. The planning artifacts
  are committed and will be ratified and merged before the opening motion's branch
  exists. Hard stop HS-2 in cr05-opening-boundary.md and Constraint 1 in the
  launch packet both enforce this. Each is independently checkable via `git log`.
- **C-3** (CR-03 delay): Resolved. motion-0122 itself qualifies as the 5th
  post-0118 motion. CR-03 is met as a consequence of this motion's quality,
  not as a separate gating action.
- **C-4** (pre-specifying V2 canon): Resolved with scope constraint.
  cr05-panel-staging-guidance.yaml carries `scope: "opening event only"` as
  an explicit YAML field. It answers the ratification-mechanism question for
  the opening event and does not declare post-opening Corpus V2 panel rules.
- **C-5** (self-authored red lines): Resolved. Each of the six red lines in
  cr05-first-agent-voted-motion-contract.md §6 references a named file path,
  a specific YAML field name, or a registered agent_id. No red line is a
  prose-only condition.
- **C-6** (scope inflation): Resolved. Three natural pairs, early-stop guarantee
  after Pair 1. The program graph update is a field addition; the launch packet
  instantiates the template.

---

## Vote

**Mechanism:** unanimous_consent (Corpus V1 era)
**Panel:** JerryIngram (proposer), JerryIngram (challenger), JerryIngram (arbiter)
**Result:** PASS — yes: 3, no: 0, abstain: 0

**Rationale:**

1. `cr05-opening-boundary.md` committed with all 5 sections. Pre-conditions
   reference artifact paths and commands. Hard stop HS-2 prohibits drafting
   the opening motion in this branch arc. P-2 (CR-03) was NOT MET at
   implementation time — recorded honestly in the document. Now met via this
   ratification.

2. `cr05-opening-checklist.yaml` committed — 8 items, schema_id: cr05-opening-checklist-v0.
   CR05-01 and CR05-08 already met. CR05-02 through CR05-07 will be closeable
   after this ratification is merged and the opening event is authored.

3. `cr05-first-agent-voted-motion-contract.md` committed — 6 sections. Red lines
   RL-1 through RL-6 each reference named artifacts or agent_ids. RL-4 (opening
   motion must not be in same branch arc as planning artifacts) is verifiable via
   `git log`. RL-5 (CR-03 not met at authoring time) is verifiable via
   cr03-compliance-record.yaml entry count.

4. `cr05-panel-staging-guidance.yaml` committed — `opening_event_ratification_mechanism:
   unanimous_consent_with_agent_witness`; `first_agent_vote_weight: advisory`.
   Bootstrapping problem explicitly addressed: the Corpus V2 canon that would
   govern agent_participated_ratification does not exist at the time the opening
   motion is ratified — the opening motion establishes it; it cannot be governed
   by it simultaneously.

5. `cr05-inherited-context-packet.md` committed — carry_forward_unchanged (8
   artifacts including all 6 seat contracts, escalation ladder, agent vote
   protocol, planning canon), must_extend (4 items including criteria doc and
   program graph), v1_only (closure checklists + all V1 motion packages).
   All referenced paths confirmed present.

6. `program-graph.yaml` updated — new epic `corpus-v2-opening-planning` with
   `q2-cr05-opening-planning` program open (motion-0122 first entry).
   `corpus-v2-readiness-blockers` program closed (motion-0121 added).

7. `q2-cr05-opening-planning-launch-packet.md` committed — 8 sections, 0
   bracketed placeholders. Constraint 1 explicitly states the opening motion
   may not be authored in the same branch arc as the planning artifacts.

8. CR-03 promoted to met: cr03-compliance-record updated — motion-0121 entry
   CONDITIONAL → PASS post-ratification; motion-0122 added as 5th entry with
   all 5 dimensions PASS. Coverage: 5/5. CR-03 declared met.
   CR-08 corrected to met: closed by motion-0120; missed status update corrected
   for consistency with cr05-opening-boundary.md NC-3.
   Readiness summary: 7 met / 1 partial / 2 unmet.

`validate_motion` exit 0. `validate_agency` exit 0 (202 agents).
No runtime, portal, UI, DB, or registry files modified.

---

## Post-ratification state

| Criterion | Status | Notes |
|---|---|---|
| CR-01 | met | motion-0118 |
| CR-02 | met | motion-0119 |
| CR-03 | **met** | **this motion** (5/5 qualifying post-0118 motions) |
| CR-04 | met | motion-0121 |
| CR-05 | unmet | Opening event — separate governed motion, separate branch arc |
| CR-06 | partial | motion-0112 ratification status unconfirmed |
| CR-07 | unmet | Motions 0001–0070 uncategorized |
| CR-08 | **met** | motion-0120 (corrected **this motion**) |
| CR-09 | met | motion-0108 |
| CR-10 | met | motion-0095 |

**The sole remaining blocker for the Corpus V2 opening event is CR-05 itself.**
All other pre-conditions in cr05-opening-boundary.md are met or will be met
once this arc is merged:
- P-1 (CR-04 confirmed met): ✓
- P-2 (CR-03 confirmed met): ✓ — met by this ratification
- P-3 (planning arc ratified): ✓ — met by this ratification
- P-4 (no prior V2 claim): ✓

The opening motion may be authored on a new branch after this arc is merged.
It must not be authored before then. Corpus V2 has not started.
