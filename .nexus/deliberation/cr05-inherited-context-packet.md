# CR-05 Inherited Context Packet

**Established:** motion-0122
**Date:** 2026-04-05
**Purpose:** This packet declares which Corpus V1 artifacts carry into Corpus V2
and under what terms. The Corpus V2 opening motion must cite this packet as its
Corpus V1 inheritance record. Inheritance is governed, not assumed: artifacts
in the `carry_forward_unchanged` section below are authorized to carry forward
by this record; artifacts in `must_extend` require explicit treatment by the
opening motion; artifacts in `v1_only` are historical records and do not carry
forward as active governance state.

Any Corpus V1 artifact not listed in one of the three sections below is not
covered by this packet. If the opening motion needs to reference an unlisted
artifact, it must determine the appropriate category and declare it explicitly
in its own inherited-context section.

---

## carry_forward_unchanged

Corpus V1 artifacts that carry into Corpus V2 without modification. The opening
motion need not re-establish them. They may be referenced by their current paths.
The opening motion must not modify any of these artifacts inline. If an artifact
in this list needs extension for the agent-voted era, a separate, discrete
extension artifact must be committed in the opening motion package, and the
extension must be governed — not an edit to the original file.

| Artifact | Path | Established by | Inheritance note |
|---|---|---|---|
| Six seat contracts | `.nexus/deliberation/seat-contracts/` (all six) | motion-0119 | The seat perspectives, distinctive_questions, pass_criteria, and block_conditions carry forward unchanged. Corpus V2 may add seats; it may not silently alter existing seat contracts. |
| Escalation ladder | `.nexus/deliberation/escalation-ladder.yaml` | motion-0119 | Tier 0–3 definitions and calibration note carry forward. Extension for agent-authored motions is a follow-on Corpus V2 governance motion, not a prerequisite for the opening. |
| Agent vote protocol v0.1 | `.nexus/deliberation/agent-vote-protocol.yaml` | motion-0120 | The v0.1 schema (8 extension fields, trace format, compatibility note, versioning, anti-patterns) carries forward. Protocol version 0.2 or higher requires a ratified governing motion. Existing agent votes remain valid under the version they recorded. |
| Corpus V1 Program Planning Canon v0 | `.nexus/docs/corpus-v1-program-planning-canon.md` | motion-0118 | The 9-phase planning workflow, program graph vocabulary, context inheritance rules, motion quality standard, and launch-packet template carry forward. The quality standard (§5) may require extension if Corpus V2 introduces agent-authored proposals; that is a post-opening concern. |
| Corpus V1 Deliberation Readiness v0 | `.nexus/docs/corpus-v1-deliberation-readiness.md` | motion-0119 | The narrative tying together seat contracts, escalation ladder, and motion-folder phase guide carries forward as the V1 deliberation record. Corpus V2 will produce a successor deliberation readiness doc; this V1 doc remains the historical record. |
| Motion-folder phase guide | `.nexus/docs/motion-folder-phase-guide.md` | motion-0119 | The per-file guidance for the six canonical motion-package files carries forward. |
| Agent registry | `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` | Ongoing (202 agents as of motion-0121) | The registry is continuous; Corpus V2 adds agents to the existing registry. It does not reset or fork the registry. The current 202 entries are valid. |
| CR-04 agent readiness spec | `.nexus/deliberation/cr04-agent-readiness-spec.md` | motion-0120 | Historical record of the minimum viable first agent specification. Carries forward as reference; not active governance spec for Corpus V2 (which may set a higher bar). |
| Agent vote protocol baseline | `.nexus/deliberation/agent-vote-protocol.yaml` | motion-0120 | Already listed; included for completeness. |

---

## must_extend

Corpus V1 artifacts that must be explicitly treated by the opening motion or the
first Corpus V2 policy motion. The opening motion may extend them inline (as a
committed artifact in the opening motion package), declare them superseded by a
new Corpus V2 document, or explicitly defer extension to a named follow-on motion.
Silence is not valid: the opening motion must address each item in this list.

**Corpus V2 readiness criteria document**

Path: `.nexus/docs/corpus-v2-readiness-criteria.md`

The opening motion must update CR-05 to `current_status: met` and update the
summary table. The document's framing as a "Corpus V1-era transition criteria"
document will be complete at that point; a Corpus V2 successor criteria document
may be authored as a subsequent governed motion but is not required by the
opening event itself.

**Program graph**

Path: `.nexus/programs/program-graph.yaml`

The opening motion must register the first Corpus V2 program or at minimum
add the `era: corpus-v2` annotation to the program graph to mark where the
era boundary falls. The current graph has `era_id: corpus-v1` with `last: null`.
The opening motion closes this era entry and either adds a `corpus-v2` era entry
or declares that the first Corpus V2 motion will do so as its opening action.

**Motion quality standard (motion-0118 §5)**

If the opening motion introduces or anticipates agent-authored motion proposals
in Corpus V2, the quality standard must be extended for non-human proposers.
The five existing quality dimensions (proposal_precision, challenge_adversarialism,
execution_specificity, evidence_traceability, decision_rationale) apply to
human-authored proposals. Their application to agent-authored proposals is an
open governance question. The opening motion must either: (a) explicitly defer
this to a named follow-on motion, or (b) commit an extension artifact that
addresses non-human proposers. It may not silently assume the existing standard
applies without modification.

**CR-03 compliance record**

Path: `.nexus/deliberation/cr03-compliance-record.yaml`

The record currently covers motions 0118–0121 (4 of 5 required). The fifth
entry must be committed before the opening motion is authored. After CR-05 is
met, this record is closed as a Corpus V1 readiness artifact. The opening motion
must confirm that CR-03 is met (5/5 entries with overall: PASS) and cite the
record. Post-opening, Corpus V2 will produce its own quality-standard compliance
record if needed.

---

## v1_only

Corpus V1 artifacts that are historical records and do not carry forward as
active governance state. They remain in the repo permanently as the Corpus V1
record. Corpus V2 motions may reference them for historical context but are
not governed by them.

**CR-04 closure checklist**

Path: `.nexus/deliberation/cr04-closure-checklist.yaml`

CR-04 is met and closed. This checklist is the record of how it was closed.
It is not active governance state for Corpus V2.

**CR-05 opening checklist (this motion's artifact)**

Path: `.nexus/deliberation/cr05-opening-checklist.yaml`

Once CR-05 is met and the opening motion is ratified, this checklist becomes
a historical record. It governs the opening event; after the opening event,
it is closed.

**CR-05 opening boundary document**

Path: `.nexus/docs/cr05-opening-boundary.md`

Governs the conditions for the opening event. After the opening event is
ratified, it is a historical record of those conditions.

**CR-05 first-agent-voted-motion contract**

Path: `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md`

Governs the shape of the opening event specifically. After ratification,
it is a historical record.

**CR-05 panel staging guidance**

Path: `.nexus/deliberation/cr05-panel-staging-guidance.yaml`

Governs the opening event ratification mechanism specifically. Its scope
field states it applies to the opening event only. After ratification, it
is a historical record.

**All Corpus V1 motion packages**

Paths: `.nexus/motions/motion-0001/` through `.nexus/motions/motion-0122/`
(and any additional Corpus V1 motions ratified before the opening event)

The full Corpus V1 motion history is permanent record. No Corpus V2 motion
may modify a prior Corpus V1 motion package.

---

## Inheritance record usage

The Corpus V2 opening motion must contain a section titled "Inherited context"
(or equivalent) that:

1. Cites this packet by path: `.nexus/deliberation/cr05-inherited-context-packet.md`
2. Confirms which `carry_forward_unchanged` artifacts it relies on
3. Addresses each `must_extend` item (extends, supersedes, or defers with named motion)
4. Notes any artifact in `v1_only` that it references for historical context

If the opening motion adds artifacts not covered by this packet (e.g., a
Corpus V2 governance canon baseline), those additions must be declared in
its own inherited-context section and committed as part of the opening
motion package. They do not need to appear in this packet — this packet
is the Corpus V1 inheritance record only.
