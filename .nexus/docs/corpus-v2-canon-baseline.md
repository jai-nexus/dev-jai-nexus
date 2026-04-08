# Corpus V2 Governance Canon Baseline

**Established:** motion-0123
**Date:** 2026-04-05
**Status:** Active — opening-era baseline
**Inherited context packet:** `.nexus/deliberation/cr05-inherited-context-packet.md`

---

## 1. Authority and scope

This document is the Corpus V2 governance canon baseline. It is established by
the ratification of motion-0123, the CR-05 Corpus V2 Opening v0 motion. Its
authority derives from the same source as all governed artifacts in this repo:
the operator's ratification decision, applied to a committed artifact against a
pre-committed contract (`.nexus/deliberation/cr05-first-agent-voted-motion-contract.md`),
a pre-committed checklist (`.nexus/deliberation/cr05-opening-checklist.yaml`),
and a pre-committed panel mechanism (`.nexus/deliberation/cr05-panel-staging-guidance.yaml`).

This document is the canon; prose in decision.md alone is not the canon. The
existence of this file at this path in committed repo state is what makes the
Corpus V2 opening event real rather than a relabeling. Red line RL-6 of the
first-agent-voted-motion contract required a committed canon baseline artifact —
this document satisfies that requirement.

This canon is the opening-era baseline. It establishes what Corpus V2 inherits,
what the opening event adds, and what is explicitly deferred. Subsequent Corpus
V2 motions extend this canon through the same governed process that produced it.

**Scope of this document:** All motions ratified after motion-0123 are Corpus V2
motions and are governed by this canon baseline and its successors. Motions
0001–0122 are permanent Corpus V1 record and are not subject to this canon.

---

## 2. Corpus V1 inheritance record

This canon cites `.nexus/deliberation/cr05-inherited-context-packet.md` as the
authoritative Corpus V1 inheritance record. The following artifacts carry forward
into Corpus V2 without modification per the `carry_forward_unchanged` section of
that packet:

| Artifact | Path | Inheritance note |
|---|---|---|
| Six seat contracts | `.nexus/deliberation/seat-contracts/` | Carry forward unchanged. Corpus V2 may add seats; it may not silently alter existing seat contracts. |
| Escalation ladder | `.nexus/deliberation/escalation-ladder.yaml` | Carries forward. Extension for agent-authored motions is a follow-on governed motion. |
| Agent vote protocol v0.1 | `.nexus/deliberation/agent-vote-protocol.yaml` | v0.1 schema carries forward. Protocol version 0.2+ requires a ratified governing motion. |
| Corpus V1 Program Planning Canon v0 | `.nexus/docs/corpus-v1-program-planning-canon.md` | The 9-phase workflow, motion quality standard, and launch-packet template carry forward. |
| Corpus V1 Deliberation Readiness v0 | `.nexus/docs/corpus-v1-deliberation-readiness.md` | Historical record of the V1 deliberation layer; carries forward as reference. |
| Motion-folder phase guide | `.nexus/docs/motion-folder-phase-guide.md` | Per-file guidance for six canonical motion-package files carries forward. |
| Agent registry | `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` | Registry is continuous. Corpus V2 adds agents to the existing 202-entry registry; it does not reset or fork it. |
| CR-04 agent readiness spec | `.nexus/deliberation/cr04-agent-readiness-spec.md` | Historical reference record. Not active governance spec for Corpus V2. |

All six seat contracts (`architecture.yaml`, `cost-discipline.yaml`,
`evidence-falsifiability.yaml`, `execution-pragmatism.yaml`,
`governance-safety.yaml`, `operator-usability.yaml`) are confirmed as
carry-forward artifacts. Their `distinctive_questions`, `pass_criteria`, and
`block_conditions` are unchanged.

---

## 3. Must-extend items addressed

The `must_extend` section of cr05-inherited-context-packet.md listed four items
that required explicit treatment by the opening motion. Each is addressed here:

### 3.1 Corpus V2 readiness criteria document

**Path:** `.nexus/docs/corpus-v2-readiness-criteria.md`

Updated by motion-0123: CR-05 promoted to `current_status: met`. The opening
event has satisfied all ten criteria to the extent required at opening time.
CR-06 and CR-07 remain as parallel tracks. The summary table now reads 8 met /
1 partial / 1 unmet.

The document's framing as a "Corpus V1-era transition criteria" document is
complete at this point: all pre-opening criteria are resolved or tracked. A
Corpus V2 successor criteria document may be authored as a subsequent governed
motion but is not required by this opening event.

### 3.2 Program graph

**Path:** `.nexus/programs/program-graph.yaml`

Updated by motion-0123: the `corpus-v1` era entry `last` field is set to
`motion-0122` — the final Corpus V1 motion in committed repo state at opening
time. A `corpus-v2` era entry is added with `first: motion-0123` and
`governance_model: agent-participated-advisory`. The first Corpus V2 program
will be established by the first post-opening Corpus V2 motion; the era entry
opens the record.

### 3.3 Motion quality standard (motion-0118 §5)

**Deferred.** Corpus V2 does not currently include agent-authored motion
proposals. The existing five quality dimensions (proposal_precision,
challenge_adversarialism, execution_specificity, evidence_traceability,
decision_rationale) apply to all current motions, which are human-authored.

The quality standard must be explicitly extended by a post-opening Corpus V2
governed motion before any agent-authored proposal is accepted for ratification.
Until that extension is committed and ratified, all proposals must be
human-authored and evaluated against the existing quality standard.

**This deferral is explicit, not silent.** The opening event cannot determine
the correct quality standard for agent-authored proposals because no such
proposals exist yet. The condition for triggering the extension is clear:
when the first agent-authored proposal is contemplated, the extension motion
must be completed and ratified before that proposal proceeds.

Named follow-on motion type: a post-opening Corpus V2 governance motion that
extends `.nexus/docs/corpus-v1-program-planning-canon.md` §5 for non-human
proposers.

### 3.4 CR-03 compliance record

**Path:** `.nexus/deliberation/cr03-compliance-record.yaml`

Closed by motion-0122 ratification. The record covers motions 0118–0122
(5 of 5 required), all with `overall: PASS`. CR-03 is met. This record is
now a historical record: a Corpus V1 readiness artifact. It is in the `v1_only`
category as of this opening event.

Corpus V2 will produce a successor quality-standard compliance record when the
quality standard is applied to post-opening motions. That successor record is
not required by this opening event.

---

## 4. What the opening event adds to the Corpus V2 canon

### Era labeling

All post-opening Corpus V2 motions must carry `era: corpus-v2` in their
vote.json. No exceptions. The `era` field records the governance regime under
which the motion's obligations are interpreted. A post-opening motion carrying
`era: corpus-v1` would be a governance error.

### Advisory agent participation

All post-opening Corpus V2 motions must include advisory agent participation.
Specifically:

- At least one registered panel-seat agent (currently
  `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`, evidence-falsifiability
  seat) must produce an evaluation trace and agent-vote.json for each motion.
- The agent's `pass_or_block` conclusion is recorded and informs the human panel.
- The human panel retains ratification authority.
- If the agent's evaluation returns `BLOCK`, the motion's decision.md must
  address the block condition by name and provide a specific resolution before
  the human panel ratifies. A panel override of an agent BLOCK must be explicit
  and artifact-traceable — the panel must cite which block condition was
  triggered, what the agent's concern was, and why the panel disagrees.
- An agent returning `PASS` does not guarantee ratification; it confirms the
  evidence-falsifiability seat found no block conditions.

**Advisory weight definition:** "Advisory" means the agent's conclusion informs
but does not gate the human panel's ratification. This is the minimum viable
agent participation model for the opening era. It may be evolved to weighted or
gatekeeping participation through subsequent governed motions. Any increase in
agent participation weight requires a ratified governing motion; it does not
happen by default.

### First Corpus V2 program

The first Corpus V2 program will be established by the first post-opening Corpus
V2 motion that opens a new program line. The program graph era entry for corpus-v2
is open with `epics: []`. The first motion to open an epic and program under the
corpus-v2 era completes this field. Until that motion is ratified, the Corpus V2
era has no active programs — which is correct: the opening event is the era
boundary, not a program.

---

## 5. What the opening event does not determine

The following governance questions are NOT answered by this canon baseline.
They require subsequent governed motions. Silence on these questions in this
document is intentional and explicit — not an oversight.

**Agent participation weight evolution.** Whether agent participation weight
increases from advisory to weighted or gatekeeping is an open question. The
opening era uses advisory weight. Evolution requires a ratified governing motion.

**Panel composition for agent-authored proposals.** Not yet applicable. Deferred
to the quality standard extension motion (see §3.3).

**Additional agent registrations.** New agents may be registered through governed
motions. The opening event uses the existing agent (202 agents in registry).
Additional registrations from new seat perspectives or new model contexts require
ratified governing motions. The opening event does not authorize unilateral
registry additions.

**The Corpus V2 motion quality standard extension for non-human proposers.** See
§3.3. Explicitly deferred. The condition for triggering it is clear.

**The Corpus V2 equivalent of the Corpus V1 Program Planning Canon.** The Corpus
V1 planning canon (motion-0118) governs program structure, motion quality, and
launch packets. If structural changes are needed for the agent-voted era, a
Corpus V2 successor planning canon may be authored as a governed motion. It is
not required by this opening event.

**CR-06 and CR-07 closure.** These are parallel tracks that do not block the
transition and are not affected by this opening event. They remain open. Their
closure requires subsequent governed motions.

---

## 6. Post-opening boundary statement

Corpus V2 began at the ratification of motion-0123. Every motion ratified after
this one is a Corpus V2 motion: it carries `era: corpus-v2` in its vote.json,
requires advisory agent participation per this canon, and is governed by this
baseline and any subsequently ratified extensions. Every motion ratified before
this one (motions 0001–0122) is a permanent Corpus V1 record: its governance
obligations were determined at the time of its ratification and are not subject
to revision by this canon.

This canon is the authorized starting point for Corpus V2. It is minimal by
design: a minimal real transition is better than an expansive symbolic one. The
canon establishes what must be true of every post-opening motion (era label,
advisory agent participation) and what is deferred (agent weight, quality standard
extension, new programs). Future Corpus V2 motions extend the canon through the
same governed process that produced it: proposal, challenge, execution, ratification,
with advisory agent participation required from this motion forward.
