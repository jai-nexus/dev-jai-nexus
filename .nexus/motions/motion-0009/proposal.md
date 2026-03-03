# Proposal (motion-0009)

## 0.0 Problem
The current voting mechanism can converge quickly but can also railroad minority concerns that later prove correct. For a civilization-level governance system intended to be trusted over decades, decisions must be defensible from all angles, and disagreement must be treated as a signal for deeper calibration rather than an obstacle to be outvoted.

Additionally, proposal quality should primarily emerge from JAI Agents (specialized perspectives + domain contexts), not from the human alone. The system needs a structured pre-proposal intelligence step and a durable way to swap AI models over time without rewriting agent roles.

## 1.0 Implications
- Majority vote optimizes for speed, not defensibility; it can suppress correct minority objections.
- Rapid convergence produces brittle “canon” and increases long-term drift and regret.
- Without structured challenge artifacts, disagreements become deadlocks or disappear.
- Without an intel step, proposals may miss new information (especially in fast-moving AI domains).
- Without model slots, agent roles become tied to specific models and cannot evolve cleanly.

## 2.0 Solution
Adopt a Council v0.3 governance pivot with four changes:

### 2.1 Unanimous Consent Voting
A motion is RATIFIED only if all required voters return:
- `YES` OR `YES_WITH_RESERVATIONS`

Any `NO` blocks ratification.

### 2.2 Blocker Packets (required for NO)
Any `NO` vote must include a structured Blocker Packet:
- blocker_type: `safety | correctness | scope | evidence | governance | maintainability`
- claim: one sentence
- why_it_matters: 1–3 bullets
- evidence: links/files/gates or “reasoned concern”
- minimal_fix: smallest change to become YES
- acceptance_to_flip: explicit criteria

### 2.3 Reservations (allowed with unanimous consent)
`YES_WITH_RESERVATIONS` is permitted but must include:
- reservation: one sentence
- risk: 0.0–1.0
- mitigation: 1–2 bullets
- what_to_watch: metric/signal

Reservations are appended to Golden Trace and attached to the decision as a durable “objections log.”

### 2.4 Deadlock Protocol (productive friction, not paralysis)
If unanimity is not reached after 2 amendment rounds:
- Mark state: `DEADLOCK`
- Arbiter MUST choose one:
  1) Split motion into smaller motions
  2) Add gates/evidence/rollback to reduce risk
  3) Request additional intelligence (Intel Packet)
  4) Escalate to Human Override (only human can force)

Human Override must be recorded as a separate canon action and preserve objections verbatim.

### 2.5 Intel Packet (pre-proposal intelligence)
Before final proposal drafting, the Master must request an Intel Packet when relevant:
- What changed recently that affects the decision
- Best practices / known failure modes
- Assumptions that may be outdated
- References (external links or internal docs)

This packet is attached to the motion proposal and cited as “intel consulted.”

### 2.6 Model Slots (role → slot → model mapping)
Replace hard-coded “role uses model X” with:
- role → model_slot
- model_slot → provider/model/version

This enables upgrading models over time without changing role identity and allows purposeful diversity across proposer/challenger/arbiter/librarian.

## 3.0 Decision Proposal
Adopt Council v0.3 rules:
- Unanimous consent voting
- Blocker Packet schema and enforcement
- Reservations log and trace write
- Deadlock escalation protocol
- Optional Intel Packet stage (default on for high-risk domains)
- Model slots for role routing

## 4.0 Scope
Primary implementation in dev-jai-nexus (Council Runner + motion artifacts):
- Update vote evaluation logic to require unanimity
- Enforce Blocker Packet schema for NO votes
- Support YES_WITH_RESERVATIONS and record reservations
- Add deadlock tracking fields and arbitration outputs
- Add Intel Packet hook (initially optional/manual)
- Introduce model-slot routing in .nexus/model-routing.yaml (or compatible config)

Out of scope (for this motion):
- Full docs-nexus crawler/auto-intel ingestion (may be future motion)
- CRL-3 traceability expansion beyond reservations/objections logging

## 5.0 Next Actions
- Implement schema + enforcement for votes (NO requires blocker packet, YES_WITH_RESERVATIONS requires reservations).
- Update Council Runner decision logic to unanimous consent.
- Add deadlock state transition + arbiter resolution outputs.
- Add model-slot routing format and default slot assignments for roles.
- Add intel packet artifact placeholder and trace write rules.
