# Decision: CR-05 Corpus V2 Opening v0 — first true agent-voted opening event and governed transition into Corpus V2

**Motion:** motion-0123
**Status:** RATIFIED
**Ratified:** 2026-04-08
**Vote mechanism:** unanimous_consent_with_agent_witness

---

## Summary

motion-0123 is the Corpus V2 opening event. It is ratified. The era boundary is
crossed. The Corpus V2 era has begun.

This motion operated against a pre-committed contract (cr05-first-agent-voted-motion-contract.md),
a pre-committed checklist (cr05-opening-checklist.yaml), a pre-committed panel
mechanism (cr05-panel-staging-guidance.yaml), and a pre-committed inheritance
record (cr05-inherited-context-packet.md) — all committed and merged as part of
motion-0122 before this branch was created. The contract was not written to match
this motion; this motion satisfied the contract as-written.

**Non-independence limitation stated:** Agent
`nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001` and the motion author share
the underlying model `claude-sonnet-4-6`. This is acknowledged explicitly in the
evaluation trace and in the agent-vote.json. The advance over CR-04 is in the
object of evaluation: the agent evaluated a motion that declares an era boundary
and establishes a governance canon, not merely its own instantiation. This is
structural proof of the evidence chain's falsifiability, not adversarial proof.
Adversarial independence is a post-opening canon concern and is explicitly
deferred in corpus-v2-canon-baseline.md §5.

---

## Challenges reviewed

Six challenges were raised and resolved:

- **C-1** (same agent, same non-independence as CR-04): Resolved. Stated explicitly
  here and in the evaluation trace per requirement. The non-independence limitation
  is a permanent record; it does not invalidate the opening event.
- **C-2** (symbolic transition): Resolved. Three distinguishing elements make this
  transition real: (1) required agent participation — not optional; (2) committed
  canon baseline artifact independently readable at a named path; (3) pre-committed
  checklist confirms the opening was earned, not declared.
- **C-3** (era label incoherence): Resolved by staging guidance rationale. The
  `era: corpus-v2` label in vote.json declares the result of the transition.
  The ratification uses `unanimous_consent_with_agent_witness` (a Corpus V1
  mechanism extended for the opening event). This is the constitutional convention
  model: the opening uses the existing order to establish the new order.
- **C-4** (minimal canon): Resolved. All `must_extend` items addressed with named
  deferral where applicable. Silence is not valid; explicit deferral is.
- **C-5** (minimum agent floor): Resolved. No additional agents invented for
  credibility. Mitigation: evaluation trace addresses all 5 distinctive_questions,
  not just the minimum 3.
- **C-6** (scope): Resolved. Artifact set pre-constrained by the contract. Three
  natural pairs; all three pairs completed.

No blocking challenge identified.

---

## CR-05 opening checklist closure record

Each item confirmed met with specific artifact reference per cr05-opening-boundary.md §4.5:

| Item | Status | Closed by | Evidence |
|---|---|---|---|
| CR05-01 | met | motion-0121 | .nexus/deliberation/cr04-closure-checklist.yaml — all 7 items met; validate_agency exit 0 (202 agents) |
| CR05-02 | met | motion-0123 | .nexus/deliberation/cr03-compliance-record.yaml — 5/5 entries PASS (motions 0118–0122); coverage_note declares CR-03 MET |
| CR05-03 | met | motion-0123 | .nexus/motions/motion-0122/decision.yaml — status: RATIFIED; all five cr05-* planning artifacts at canonical paths |
| CR05-04 | met | motion-0123 | .nexus/docs/cr05-opening-boundary.md — 5 sections; P-1 (motion-0121), P-2 (motion-0122), P-3 (motion-0122 RATIFIED), P-4 (grep confirmed, zero prior era:corpus-v2) |
| CR05-05 | met | motion-0123 | .nexus/deliberation/cr05-first-agent-voted-motion-contract.md — 6 sections; RL-1 through RL-6 each reference named paths/agent_ids |
| CR05-06 | met | motion-0123 | .nexus/deliberation/cr05-panel-staging-guidance.yaml — opening_event_ratification_mechanism: unanimous_consent_with_agent_witness (non-null); scope: opening event only; first_agent_vote_weight: advisory |
| CR05-07 | met | motion-0123 | .nexus/deliberation/cr05-inherited-context-packet.md — 3 sections non-empty; all 8 carry_forward_unchanged artifacts; 4 must_extend items addressed; all paths verified present |
| CR05-08 | met | motion-0123 | Pre-implementation and post-ratification grep: .nexus/motions/motion-0123/vote.json is the only vote.json carrying era: corpus-v2 in the corpus |

---

## Vote

**Result:** PASS
**Mechanism:** unanimous_consent_with_agent_witness
**Human panel:** JerryIngram (proposer, challenger, arbiter) — unanimous yes (3/3)
**Agent witness:** nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 (evidence-falsifiability seat) — advisory PASS
**Agent evaluation:** .nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0123-trace.yaml — 5 questions, 4 block conditions, pass_or_block: PASS
**Voted at:** 2026-04-08T00:00:00.000Z

The agent's advisory PASS conclusion informed the human panel's ratification. No
BLOCK condition was triggered. No override reasoning was required.

---

## What is now established by ratification

**Established by this ratification:**
- **Corpus V2 has begun:** The era boundary is in committed repo state. vote.json
  carries `era: corpus-v2` — the first such label in the corpus. The transition
  is not backdated to implementation time; it is crossed by this ratification.
- **CR-05 is met:** All ten Corpus V2 readiness criteria are now resolved or
  tracked. corpus-v2-readiness-criteria.md updated to 8 met / 1 partial / 1 unmet.
- **corpus-v2-canon-baseline.md is the authoritative opening-era governance document:**
  It governs what all post-opening motions inherit and what they must do. The
  canon is the committed file — not this decision.md prose.
- **Advisory agent participation is the Corpus V2 baseline:** All post-opening
  motions must include agent participation as an advisory participant. An agent
  BLOCK must be addressed in decision.md before the panel overrides.
- **Post-opening motions carry `era: corpus-v2` in their vote.json.** No exceptions.
- **Program graph era boundary is committed:** corpus-v1 last = motion-0122;
  corpus-v2 first = motion-0123.
- **The Corpus V1 era (motions 0001–0122) is permanent record.** No post-opening
  motion may alter a Corpus V1 motion package.

**Explicitly deferred by this ratification (require subsequent governed motions):**
- Agent participation weight evolution beyond advisory
- Agent-authored motion proposals (blocked until quality standard extension is
  ratified — the condition is: the first contemplated agent-authored proposal
  triggers the extension motion requirement)
- The first Corpus V2 program establishment (program graph corpus-v2 era entry
  opens; the first post-opening motion to open a program completes it)
- Additional agent registrations
- Corpus V2 equivalent of the Corpus V1 Program Planning Canon (if structural
  changes are needed for the agent-voted era)
- CR-06 closure (parallel track)
- CR-07 closure (parallel track)

**Stop rules (remain in effect after ratification):**
- Do not modify agents.generated.yaml as part of this motion's branch
- Do not change the agent vote protocol, seat contracts, or escalation ladder
  without a separate governed extension artifact
- Do not author a post-opening Corpus V2 motion in this task or branch
