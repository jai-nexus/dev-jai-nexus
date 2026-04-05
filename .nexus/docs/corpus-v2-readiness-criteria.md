# Corpus V2 Readiness Criteria

**Established:** motion-0119
**Date:** 2026-04-04
**Last updated:** 2026-04-05 by motion-0122
**Status source:** This document records current-status assessments as of
its last update. It does not declare when Corpus V2 begins. The transition
requires a separate governed event: a Corpus V2 opening motion. This document
is an input to that motion, not a substitute for it.

**Attribution note:** Status fields in this document are updated by subsequent
ratified motions. Each status change notes the motion that promoted the
criterion. Changes are traceable to the promoting motion's ratification record.

---

## How to read this document

Each criterion is:
- **Specific and falsifiable:** "The system feels ready" is not a criterion.
  "A governed opening motion exists and is ratified" is a criterion.
- **Grounded in observable corpus state:** Status is assessed against what
  is actually true in the repo, not what is predicted or hoped.
- **Honest about gaps:** Criteria that are not yet met are marked `unmet`.
  Criteria that cannot be assessed from current repo state are marked `unknown`.
- **Actionable when unmet:** Each unmet or unknown criterion includes a
  `closing_action` — the specific motion or action that would close it.

---

## Criteria

---

### CR-01: Planning canon in place

**Description:** The Corpus V1 Program Planning Canon v0 is committed and
ratified, establishing the 9-phase planning workflow, program graph vocabulary,
context inheritance rules, motion quality standard, and launch-packet template.

**Current status:** `met`

**Assessment:** motion-0118 ratified. All seven planning artifacts committed
and validated. Both required gates passed. *Promoted to met by motion-0120.*

**Closing action:** Closed.

---

### CR-02: Deliberation readiness in place

**Description:** The executable deliberation readiness layer is committed and
ratified: six per-seat contracts with PASS/BLOCK conditions, a four-tier
escalation ladder, a primary readiness narrative, a motion-folder phase guide,
a governed launch-packet activation path, and a falsifiable V2 readiness checklist.

**Current status:** `met`

**Assessment:** motion-0119 ratified. Six seat contracts, escalation ladder,
primary readiness narrative, phase guide, launch-packet activation path, and
V2 readiness criteria all committed. Both required gates passed.
*Promoted to met by motion-0120.*

**Closing action:** Closed.

---

### CR-03: Motion quality standard applied consistently

**Description:** The five quality dimensions (proposal precision, challenge
adversarialism, execution specificity, evidence traceability, decision rationale)
are consistently applied to all motions in the corpus from the point of the
quality standard's establishment.

**Current status:** `met`

**Assessment:** The quality standard was established by motion-0118.
Motions 0001–0117 predate it and were not authored against it. Motions from
0118 forward are expected to meet it.

motion-0122 ratification completed the five-motion consecutive run. The
cr03-compliance-record.yaml was updated to cover motions 0118–0122 (5 of 5
required). motion-0121's entry was promoted from CONDITIONAL to PASS
post-ratification per the note in the original record. motion-0122 added as
the fifth qualifying motion — all five quality dimensions PASS.
*Promoted to met by motion-0122.*

**Closing action:** Closed.

---

### CR-04: At least one JAI Agent is operational with a defined panel seat

**Description:** A JAI Agent exists that can evaluate a motion against at
least one of the six seat contract perspectives, produce a structured vote
output (yes/no/abstain with rationale), and have that output recorded in a
vote.json that passes validate_motion.

**Current status:** `met`

**Assessment:** motion-0121 ratified. `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`
registered in agents.generated.yaml (validate_agency exits 0, 202 agents).
Seat assignment committed at `.nexus/deliberation/seat-assignments/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001.yaml`
(evidence-falsifiability seat). Agent evaluation trace committed at
`.nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0121-trace.yaml`
with 5 distinctive_questions addressed and 4 block_conditions checked.
Agent-vote.json committed at `.nexus/motions/motion-0121/agent-vote.json`,
validate_motion exits 0. All seven CR04 checklist items promoted to met.
Non-independence limitation acknowledged: structural proof, not adversarial
independence. *Promoted to met by motion-0121.*

**Closing action:** Closed.

---

### CR-05: Governed Corpus V2 opening motion exists

**Description:** A motion exists that explicitly declares the Corpus V2
transition: names the conditions that were met, records the first agent-voted
motion, and establishes the Corpus V2 governance canon (extending this planning
canon for the agent-voted era).

**Current status:** `unmet`

**Assessment:** No Corpus V2 opening motion exists. This criterion cannot be
met until CR-04 is met (at least one operational panel-seat agent).

**Closing action:** Author and ratify a Corpus V2 opening motion. That motion
is the governed event that starts Corpus V2. It must not be simulated or
anticipated by any Corpus V1 motion.

---

### CR-06: Normalization arc complete — all known anomalies resolved

**Description:** All truly open motions identified by the corpus audit
(motion-0111) are ratified: motion-0037 (P1 anomaly), motion-0083,
motion-0092, and motion-0094 (P2 anomaly family).

**Current status:** `partial`

**Assessment:** P2 anomaly family is resolved: motion-0113 (closes 0083),
motion-0114 (closes 0092), and motion-0116 (closes 0094) are all ratified
on their respective branches. The audit baseline (motion-0111) is ratified
via motion-0117.

motion-0037 (P1 anomaly) status: motion-0112 targeted the P1 repair. Current
ratification status of motion-0112 must be confirmed.

**Closing action:** Confirm motion-0112 is ratified. If not, ratify it.
Once motion-0112 is ratified, all four anomalies are resolved and this
criterion is met.

---

### CR-07: Corpus V1 program graph is complete

**Description:** `.nexus/programs/program-graph.yaml` covers all 119+ Corpus V1
motions (0001–current). Currently `coverage: partial` with motions 0001–0070
in the `uncategorized_motions` list.

**Current status:** `unmet`

**Assessment:** The program graph currently classifies motions 0071–0118 across
eight programs and six epics. Motions 0001–0070 are listed as uncategorized.
A complete retrospective classification is a follow-on task.

**Closing action:** Author a motion that classifies motions 0001–0070 into
the program graph, updates `coverage` to `complete`, and updates `generated_at`.
This is a documentation motion with no runtime impact.

---

### CR-08: Launch-packet pattern used at least once in practice

**Description:** At least one program line opened after motion-0118 has a
committed, filed launch packet that follows the template, has been validated
against the activation path (motion-0119), and is referenced by the first
motion in that line.

**Current status:** `met`

**Assessment:** motion-0120 opened the `q2-corpus-v2-readiness-blockers` program
line and filed `.nexus/programs/q2-corpus-v2-readiness-blockers-launch-packet.md`
following the template. The launch packet is self-contained, covers all nine
planning phases, and is referenced by motion-0120 as the first motion in the
line. The closing action criteria are satisfied. This status update was missed
at motion-0120 ratification and is corrected here by motion-0122: the correction
is warranted by the cr05-opening-boundary.md NC-3 declaration, which required
the criteria doc and the planning artifact to be consistent.
*Corrected to met by motion-0122 (closed by motion-0120).*

**Closing action:** Closed.

---

### CR-09: Context bundle generation is accurate for current program lines

**Description:** `node portal/scripts/generate-context-bundle.mjs` produces
a context bundle for any open motion that accurately reflects the current
repo state, correct motion status, and correct active-path-pack.

**Current status:** `met`

**Assessment:** motion-0107 and motion-0108 fixed active-path-pack and
repo-capsule accuracy. Context bundle generation is currently accurate
for the motions tested.

**Closing action:** None required. Maintain by running the generator for each
new motion and confirming accuracy.

---

### CR-10: Validated end-to-end governance proof exists

**Description:** At least one motion has been executed with the full governed
proof chain: work packet → ARCHITECT stage → BUILDER stage → VERIFIER stage →
SoT emission → ratification. All stages have committed evidence.

**Current status:** `met`

**Assessment:** Track A Proof Chain (motions 0095–0101) demonstrated the full
governed execution loop with WorkPacket 882. The proof chain is committed and
the umbrella motion (motion-0095) is ratified.

**Closing action:** None required. This criterion is met. Maintain the proof
chain discipline for future high-stakes motions.

---

## Summary: current Corpus V2 readiness state

| ID | Criterion | Status |
|---|---|---|
| CR-01 | Planning canon in place | **met** *(motion-0118)* |
| CR-02 | Deliberation readiness in place | **met** *(motion-0119)* |
| CR-03 | Quality standard applied consistently | **met** *(motion-0122)* |
| CR-04 | JAI Agent operational with panel seat | **met** *(motion-0121)* |
| CR-05 | Corpus V2 opening motion exists | unmet |
| CR-06 | Normalization arc complete | partial |
| CR-07 | Program graph complete | unmet |
| CR-08 | Launch-packet pattern used in practice | **met** *(motion-0120, corrected by motion-0122)* |
| CR-09 | Context bundle generation accurate | met |
| CR-10 | End-to-end governance proof exists | met |

**Met:** 7 of 10
**Partial:** 1 of 10
**Unmet:** 2 of 10

CR-03 and CR-08 are now met. The remaining critical path is: **CR-05 (Corpus V2
opening motion)**. CR-03 is met (5/5 qualifying post-0118 motions); the opening
boundary pre-conditions are documented in `.nexus/docs/cr05-opening-boundary.md`.
Corpus V2 has not started — the opening motion is a separate governed event that
must not be authored in the same branch arc as the planning artifacts.
CR-06 and CR-07 are parallel tracks that do not block the transition but should
be closed before declaring the Corpus V1 record complete.
