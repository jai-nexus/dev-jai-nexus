# CR-05 Opening Boundary

**Established:** motion-0122
**Date:** 2026-04-05
**Status source:** This document defines the falsifiable conditions that must
be confirmed true before the Corpus V2 opening motion is authored and ratified.
It is not the opening motion. It does not start Corpus V2. Corpus V2 begins
only when a separate governed opening motion exists, is ratified, and carries
`era: corpus-v2` in its vote.json as the first such label in the corpus.

---

## 1. Purpose

This document defines the exact opening boundary between late Corpus V1 and
the first real Corpus V2 motion. It establishes which conditions must be
confirmed true before the opening motion is authored, which conditions are
explicitly not required, what the opening event itself must do, and what it
must not do. Every condition named here is checkable from committed repo state
without author assertion. The opening motion that closes CR-05 must reference
this document and demonstrate that each confirmed pre-condition in Section 2
is met at time of drafting.

---

## 2. Confirmed pre-conditions

All four conditions below must be confirmed true before the Corpus V2 opening
motion is authored. Each condition names the specific artifact or command that
makes it checkable.

**P-1: CR-04 is met.**

All seven items in `.nexus/deliberation/cr04-closure-checklist.yaml` must show
`status: met` in committed repo state. At least one real agent (registered in
`workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`) must have
produced a governed vote.json that satisfies agent-vote-protocol v0.1 for at
least one real motion.

Verification: Read `.nexus/deliberation/cr04-closure-checklist.yaml`. Confirm
all seven items show `status: met`. Run `node portal/scripts/validate-agency.mjs
--domain dev.jai.nexus --repo dev-jai-nexus` and confirm exit 0.

Current state (2026-04-05): **MET** — all seven CR04 items committed met by
motion-0121. `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001` registered
in agents.generated.yaml (202 agents, validate_agency exit 0).

**P-2: CR-03 is met.**

`.nexus/deliberation/cr03-compliance-record.yaml` must cover at least five
consecutive post-0118 motions, all assessed PASS or equivalent under the
Evidence/Falsifiability and Governance/Safety seat contracts, with per-dimension
evidence citations.

Verification: Read `.nexus/deliberation/cr03-compliance-record.yaml`. Count
entries with `overall: PASS`. Must be at least 5. Entries assessed CONDITIONAL
at proposed stage and subsequently ratified must have been updated or superseded
to reflect final PASS.

Current state (2026-04-05): **NOT MET** — cr03-compliance-record.yaml covers
4 of 5 required post-0118 motions (motions 0118–0121). One more qualifying
ratified motion is required before the opening motion may be authored.

**P-3: The opening planning arc is ratified.**

`.nexus/motions/motion-0122/decision.yaml` must show `status: RATIFIED`.
The planning artifacts in `.nexus/deliberation/cr05-*.yaml`,
`.nexus/deliberation/cr05-*.md`, and this document must exist in committed,
ratified state before the opening motion's branch is created.

Verification: Read `.nexus/motions/motion-0122/decision.yaml`. Confirm
`status: RATIFIED`. Confirm `.nexus/deliberation/cr05-opening-checklist.yaml`,
`.nexus/deliberation/cr05-first-agent-voted-motion-contract.md`, and
`.nexus/deliberation/cr05-panel-staging-guidance.yaml` all exist.

Current state (2026-04-05): **NOT MET** — motion-0122 is proposed, not yet ratified.

**P-4: No prior Corpus V1 motion has pre-declared Corpus V2 started.**

No decision.yaml or decision.md in `.nexus/motions/` may contain a declaration
that Corpus V2 has begun, that a Corpus V2 era boundary has been crossed, or
that a motion is `era: corpus-v2` except the opening motion itself.

Verification: `grep -r "corpus-v2" .nexus/motions/*/decision.yaml` must not
show any `era: corpus-v2` field or equivalent era-transition declaration in
a ratified motion prior to the opening motion.

Current state (2026-04-05): **MET** — no Corpus V1 motion has declared Corpus
V2 started. Every ratified motion carries `era: corpus-v1` or omits the era
field (treated as corpus-v1 by convention).

---

## 3. Confirmed non-conditions

The following conditions are explicitly NOT required before the Corpus V2 opening
motion may be authored. They are parallel-track concerns that do not block the
era transition.

**NC-1: CR-06 (normalization arc complete) is NOT required.** The remaining
open item in CR-06 is confirmation of motion-0112's ratification status. This
is a historical record question, not a governance readiness question. Its
incompleteness does not block the opening event. The opening motion may
reference CR-06's partial status honestly.

**NC-2: CR-07 (program graph 0001–0070 classified) is NOT required.** This is
a documentation cleanup task. The program graph's partial coverage of motions
0001–0070 does not affect the governance integrity of the opening event.

**NC-3: CR-08 is already met.** The launch-packet pattern was used in practice
by motion-0120. This condition is closed and is not a precondition.

**NC-4: A multi-agent panel is NOT required for the opening event.** The
minimum panel composition is defined in
`.nexus/deliberation/cr05-panel-staging-guidance.yaml`. One registered agent
with a committed evaluation trace is sufficient for the opening event per that
guidance. The opening event is not required to demonstrate a full six-seat panel.

**NC-5: Corpus V2 architectural decisions are NOT required before the opening.**
The opening motion establishes the Corpus V2 governance canon baseline. It
inherits the seat contracts, escalation ladder, agent vote protocol, and motion
quality standard from Corpus V1 per
`.nexus/deliberation/cr05-inherited-context-packet.md`. Full architectural
extensions to the Corpus V2 canon are subsequent governed events, not
prerequisites for the opening.

---

## 4. The opening event

The Corpus V2 opening motion is the governed event that starts the new era.
It must do all of the following:

**4.1 Confirm and cite each met readiness criterion.**

The opening motion's proposal.md must name each readiness criterion that was
met at time of authoring and cite the motion that closed it:
- CR-01: met by motion-0118
- CR-02: met by motion-0119
- CR-03: met by [the fifth qualifying motion] — must be PASS status before opening
- CR-04: met by motion-0121
- CR-09: met by motion-0108
- CR-10: met by motion-0095

**4.2 Declare the era boundary explicitly.**

The opening motion's decision.md must state explicitly: "The first Corpus V2
motion is the motion immediately following this motion's ratification. All prior
motions in this repo are Corpus V1 motions." The opening motion's vote.json
must carry `era: corpus-v2`. No prior ratified motion carries this label; the
opening motion is the first.

**4.3 Produce an agent participant in the ratification record.**

Per `.nexus/deliberation/cr05-panel-staging-guidance.yaml`, the opening event
requires at least one registered agent (agent_id in agents.generated.yaml with
dev-jai-nexus scope) to produce a governed evaluation trace and agent-vote.json
conforming to agent-vote-protocol v0.1 for the opening motion. The agent
participation is required evidence of the genuine transition — the opening
motion cannot declare Corpus V2 started without a real agent having participated.

**4.4 Establish the Corpus V2 governance canon baseline.**

The opening motion must produce a committed artifact declaring which Corpus V1
artifacts carry into Corpus V2 unchanged, which are extended, and which are
V1-only. This artifact must reference
`.nexus/deliberation/cr05-inherited-context-packet.md` as its Corpus V1
inheritance record. It may extend or supersede items in the `must_extend` list;
it must not modify items in the `carry_forward_unchanged` list without a
separate governed extension artifact in the same motion package.

**4.5 Reference the CR-05 opening checklist.**

The opening motion's decision.md must cite each item in
`.nexus/deliberation/cr05-opening-checklist.yaml` and confirm it is met with
a specific artifact reference. No CR-05 checklist item may be declared met
by author assertion alone.

---

## 5. Hard stop

The opening motion must NOT do any of the following:

**HS-1:** Be authored before P-2 (CR-03 confirmed met at 5/5) is satisfied in
committed repo state. If CR-03 is at 4/5 when this planning arc is ratified,
the next governed action is the fifth qualifying post-0118 motion — not the
opening event.

**HS-2:** Be authored in the same branch arc that produced this document, the
cr05-opening-checklist.yaml, the cr05-first-agent-voted-motion-contract.md, or
the cr05-panel-staging-guidance.yaml. The planning arc (sprint/q2-cr05-opening-planning
or equivalent) must be merged before the opening motion's branch is created.

**HS-3:** Claim agent independence properties beyond what agent-vote-protocol v0.1
requires. The non-independence limitation acknowledged in motion-0121 (single
model, same underlying system as motion author) is still the structural reality
of the first agent. The opening motion must acknowledge this honestly and note
whether the opening event adds any additional independence that CR-04 did not
demonstrate.

**HS-4:** Supersede the seat contracts, escalation ladder, or motion quality
standard by implication. If any Corpus V1 artifact in the `carry_forward_unchanged`
list in cr05-inherited-context-packet.md is to be modified by the opening event,
the modification must be a discrete, separately committed extension artifact in
the opening motion package, not an inline edit to the original file.

**HS-5:** Declare a Corpus V2 governance canon without producing a committed
artifact that specifies what the canon consists of. "Corpus V2 has begun" is
not a canon. The canon baseline must be a committed file, not a claim in
decision.md.
