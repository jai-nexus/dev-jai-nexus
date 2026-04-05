# Launch Packet: CR-05 Corpus V2 Opening Planning — Opening Boundary, Contract, and Transition Guardrails

**Program:** q2-cr05-opening-planning
**First motion:** motion-0122
**Branch:** sprint/q2-cr05-opening-planning
**Prepared:** 2026-04-05
**Prepared by:** JerryIngram / operator

---

## 1. Goal

Produce the pre-committed specification layer for the Corpus V2 opening event
so that the opening motion (CR-05) can be authored and ratified as a genuine,
falsifiable era transition rather than a symbolic declaration.

The opening event is the highest-stakes governance motion in the corpus to date.
It declares the era boundary, sets every precedent the new era inherits, and
is the first motion where agent participation in the governance record is required.
A weak opening is a permanent precedent. This arc exists to define "weak" and
"invalid" before drafting begins, not during it.

### Done when

All eight items in `.nexus/deliberation/cr05-opening-checklist.yaml` show
`status: met` in committed repo state, attributable to ratified motions. The
Corpus V2 opening motion (CR-05) exists, is ratified, carries `era: corpus-v2`
in its vote.json as the first such label, and satisfies every requirement in
`.nexus/deliberation/cr05-first-agent-voted-motion-contract.md`.

### Success criteria

1. `.nexus/docs/cr05-opening-boundary.md` committed with all five sections;
   all pre-conditions reference specific artifact paths or commands.
2. `.nexus/deliberation/cr05-opening-checklist.yaml` committed with eight items,
   each independently verifiable; items CR05-01 and CR05-08 already met.
3. `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md` committed
   with minimum panel composition, required evidence artifacts, and red lines
   referencing named artifacts or agent_ids.
4. `.nexus/deliberation/cr05-panel-staging-guidance.yaml` committed with
   `opening_event_ratification_mechanism` = `unanimous_consent_with_agent_witness`,
   scope field explicitly limited to the opening event.
5. `.nexus/deliberation/cr05-inherited-context-packet.md` committed with all
   three sections non-empty; all referenced paths exist in the repo.
6. `.nexus/programs/program-graph.yaml` registers `q2-cr05-opening-planning`
   with `status: open`; `corpus-v2-readiness-blockers` program closed with
   motion-0121 added.
7. This launch packet exists at its canonical path with no bracketed placeholders.
8. motion-0122 is ratified: `decision.yaml` shows `status: RATIFIED`.
9. CR-03 is confirmed met (5/5 post-0118 motions assessed PASS) before the
   Corpus V2 opening motion is authored.
10. The Corpus V2 opening motion exists, is ratified, and satisfies the contract.

---

## 2. Baseline

### Relevant prior motions

| Motion | What it established |
|---|---|
| motion-0118 | Corpus V1 Program Planning Canon v0: 9-phase workflow, program graph, launch-packet template, motion quality standard |
| motion-0119 | Corpus V1 Deliberation Readiness v0: six seat contracts, escalation ladder, motion-folder phase guide, launch-packet activation path, Corpus V2 readiness criteria |
| motion-0120 | CR-04 agent readiness spec, agent vote protocol v0.1, CR-04 closure checklist, updated readiness criteria, program graph update, first launch packet |
| motion-0121 | CR-04 closure: agent registered (nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001), seat assigned (evidence-falsifiability), governed evaluation trace and agent-vote.json produced, all seven CR04 checklist items met, CR-04 promoted to met |
| motion-0122 | CR-05 opening planning: opening boundary, opening checklist, first-agent-voted-motion contract, panel staging guidance, inherited-context packet, this launch packet |

### Corpus V2 readiness state at this arc's opening

| Criterion | Status | Notes |
|---|---|---|
| CR-01 | met | motion-0118 |
| CR-02 | met | motion-0119 |
| CR-03 | partial (4/5) | One more qualifying post-0118 motion required |
| CR-04 | met | motion-0121 |
| CR-05 | unmet | This arc works toward it; the opening event is a separate motion |
| CR-06 | partial | motion-0112 ratification status unconfirmed |
| CR-07 | unmet | Motions 0001–0070 uncategorized |
| CR-08 | met | motion-0120 |
| CR-09 | met | motion-0108 |
| CR-10 | met | motion-0095 |

### Relevant substrate artifacts

- `.nexus/docs/cr05-opening-boundary.md` — opening pre-conditions, non-conditions, hard stops
- `.nexus/deliberation/cr05-opening-checklist.yaml` — 8-item machine-checkable opening criteria
- `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md` — opening event shape, red lines
- `.nexus/deliberation/cr05-panel-staging-guidance.yaml` — ratification mechanism for opening event
- `.nexus/deliberation/cr05-inherited-context-packet.md` — V1 inheritance record for opening event
- `.nexus/deliberation/agent-vote-protocol.yaml` — v0.1 schema (8 extension fields, trace format)
- `.nexus/deliberation/seat-contracts/` — six seat contracts (carried forward unchanged)
- `.nexus/deliberation/cr03-compliance-record.yaml` — 4/5 post-0118 motions assessed; must reach 5/5 before opening
- `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml` — 202 agents; nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 registered

---

## 3. Constraints

### Hard constraints (must not be violated)

1. **The Corpus V2 opening motion must not be authored in the same branch arc
   as these planning artifacts.** The planning arc (sprint/q2-cr05-opening-planning
   or equivalent) must be merged and these artifacts ratified before the opening
   motion's branch is created. This is RL-4 in the cr05-first-agent-voted-motion-contract.
   Violation renders the opening motion invalid.

2. **The Corpus V2 opening motion must not be authored before CR-03 is confirmed
   met at 5/5.** CR-03 is currently at 4/5. The next motion in this arc after
   motion-0122 ratification must either close CR-03 (if motion-0122 itself
   qualifies as the fifth post-0118 motion after ratification) or wait for a
   qualifying motion to do so. This is P-2 in cr05-opening-boundary.md and
   CR05-02 in the opening checklist.

3. **Do not simulate agent participation in the opening event.** The agent
   participant must be a registered agent in agents.generated.yaml. No human
   operator may author an agent-vote.json with an agent_id that does not exist
   in the registry. This is RL-2 in the contract and Section 5 of agent-vote-protocol.

4. **Do not declare Corpus V2 started in any Corpus V1 motion.** The opening
   motion is the first and only motion to carry `era: corpus-v2` in its vote.json.
   This is CR05-08 and P-4 in cr05-opening-boundary.md.

5. **Do not modify the planning artifacts (cr05-*.yaml, cr05-*.md) after
   ratification of motion-0122** except through a governed correction motion.
   The pre-committed bar must not drift as the opening event is drafted.

### Soft constraints (preferences, not hard rules)

- Author the opening event in the minimum number of motions. One motion for
  the opening event is ideal; a multi-motion arc is acceptable if the first
  motion in the arc is the opening declaration itself.
- If CR-03 closes as a consequence of motion-0122 ratification (motion-0122
  qualifies as the fifth post-0118 motion), proceed directly to the opening
  event in the next session. Do not introduce an intermediate motion.
- The opening motion should acknowledge the non-independence limitation
  explicitly rather than understating it.

---

## 4. Decomposition

| Motion | Type | Purpose | Depends on |
|---|---|---|---|
| motion-0122 | governance-policy | Planning: opening boundary, contract, guidance, packet | — |
| Fifth CR-03 motion | documentation or governance-policy | Closes CR-03 at 5/5 (if motion-0122 does not itself qualify) | motion-0122 ratified |
| Corpus V2 opening motion | governance-policy | Declares era transition, establishes V2 canon baseline, first agent-ratified event | motion-0122 ratified AND CR-03 confirmed met (5/5) |

Note: if motion-0122 itself qualifies as the fifth post-0118 motion (implemented
and ratified to PASS standard under the compliance record), the "Fifth CR-03
motion" row is collapsed — motion-0122 both closes CR-03 and opens the way to
the opening event. This is the ideal path.

---

## 5. Agent and panel strategy

**This arc (motion-0122 and any CR-03-closing motion):**
Corpus V1 era. Human panel: proposer/challenger/arbiter roles exercised by
JerryIngram working with Claude. No agent participation required for these
Corpus V1 motions (though the governance-safety and evidence-falsifiability
seat contracts should be applied to deliberation per standard Corpus V1 workflow).

**The Corpus V2 opening event:**
Per `.nexus/deliberation/cr05-panel-staging-guidance.yaml`:
- Human panel: proposer + challenger + arbiter (unanimous consent)
- Agent participant: minimum one registered agent (nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001
  or a successor) with evaluation trace and agent-vote.json
- Ratification mechanism: unanimous_consent_with_agent_witness
- Agent vote weight: advisory

---

## 6. First next motion scope

After motion-0122 is ratified:

**Check CR-03 status.** Read cr03-compliance-record.yaml. If the record
has been updated to cover motion-0122 with overall: PASS, CR-03 is met (5/5)
and the opening event can be authored immediately in a new session on a new branch.

If CR-03 is still at 4/5 after motion-0122 ratification, the next motion must
be a qualifying post-0118 motion that will receive a PASS assessment under the
Evidence/Falsifiability and Governance/Safety seat contracts. That motion need
not be about CR-05; it needs to be any well-executed governance motion.

**When CR-03 is met, open the Corpus V2 opening event arc:**
New branch (not sprint/q2-cr05-opening-planning). The opening motion must:
- Satisfy all eight CR05-opening-checklist items
- Produce the six required evidence artifacts from cr05-first-agent-voted-motion-contract §3
- Carry `era: corpus-v2` in vote.json
- Reference this launch packet's baseline and constraint sections

---

## 7. What the opening motion must prove

Each of the following must be true and checkable in committed repo state:

1. CR05-01: CR-04 all seven items met — already true post-0121
2. CR05-02: CR-03 five consecutive post-0118 motions PASS — must be confirmed at authoring time
3. CR05-03: motion-0122 decision.yaml shows RATIFIED
4. CR05-04: cr05-opening-boundary.md five sections present
5. CR05-05: cr05-first-agent-voted-motion-contract.md with minimum_panel_composition and red lines
6. CR05-06: cr05-panel-staging-guidance.yaml opening_event_ratification_mechanism non-null
7. CR05-07: cr05-inherited-context-packet.md three sections non-empty
8. CR05-08: no prior motion carries era: corpus-v2 — confirmed by grep at authoring time
9. vote.json carries era: corpus-v2 (opening motion only)
10. agent-vote.json from a registered agent, all 8 protocol fields present
11. Evaluation trace committed at evaluation_trace_ref path, questions_evaluated ≥ 3 entries
12. corpus-v2 canon baseline artifact committed as a named file (not just decision.md prose)
13. validate_motion exit 0, validate_agency exit 0

---

## 8. Cost estimate

| Phase | Sessions | Motions | Surfaces |
|---|---|---|---|
| Planning (motion-0122) | 1 | 1 | .nexus/deliberation/, .nexus/docs/, .nexus/programs/ |
| CR-03 close (if needed) | 0–1 | 0–1 | .nexus/deliberation/ (cr03-compliance-record update) |
| Opening event | 1 | 1 | .nexus/motions/motion-NNNN/, .nexus/deliberation/, .nexus/docs/, agents.generated.yaml (if new agent needed) |

Total: 2–3 motions, 2–3 sessions. The opening event is the most consequential;
budget a full session for it.
