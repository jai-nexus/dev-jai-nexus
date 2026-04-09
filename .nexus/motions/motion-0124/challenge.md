# Challenge: motion-0124 — Corpus V2 Deliberation Protocol v0

**Motion:** motion-0124
**Kind:** governance-policy
**Date:** 2026-04-08

---

## C-1: Bootstrapping — this motion is governed by the protocol it creates

**Challenge:** The deliberation protocol takes effect for Corpus V2 motions. This
motion is itself a Corpus V2 motion. Does it govern itself? If the protocol
requires Tier 2 evaluation with cost-discipline and governance-safety seats
mandatory, but those seat assignments do not exist until this motion creates them,
the motion cannot satisfy its own requirements.

**Resolution:** The protocol explicitly scopes its authority to "motions 0125 and
onward." This motion operates under the Corpus V2 canon baseline (motion-0123),
not under the protocol being created. The canon baseline requires at least one
registered panel-seat agent to evaluate each motion; it does not specify seat
routing by tier. This motion satisfies the canon baseline (one evaluation from the
evidence-falsifiability seat) and creates the protocol that subsequent motions
operate under. The bootstrapping problem is resolved by sequencing: the protocol
governs what comes after it, not itself.

---

## C-2: Single-agent Tier 2 evaluations — same model, three mandatory seats

**Challenge:** The proposal creates two additional seat assignment files for the
existing agent, enabling it to produce evaluations from the cost-discipline and
governance-safety perspectives. But the agent shares a model (claude-sonnet-4-6)
with the motion author. Three evaluations from the same model do not constitute
three independent evaluations. This is especially problematic for governance-safety,
where adversarial independence is most valuable.

**Resolution:** Acknowledged without deflection. The non-independence limitation is
the same structural caveat that applied to motion-0121 and motion-0123. The claim
is not adversarial independence — it is internal coherence. Three seat-scoped traces
from a single model can still check: are the cost estimates plausible and categorized
correctly? Does the motion raise governance-safety concerns that should be escalated?
Are the block_conditions for each seat triggered? These checks have value even from
a non-independent source, as long as the limitation is documented in each trace.

The non-independence limitation is stated in each seat assignment extension file
and must be stated in any evaluation trace that uses those assignments. The panel
(human operator) retains final ratification authority. When an independent second
agent becomes registered, it replaces this arrangement; until then, this is the
honest operating state.

---

## C-3: Cost discipline integration — order-of-magnitude categories, not precise estimates

**Challenge:** The cost discipline gate in the proposed protocol uses four
order-of-magnitude categories (minimal / standard / substantial / major) declared
in execution.md by the motion author. The author is not a neutral party. Declaring
"standard" when a motion is actually "substantial" avoids mandatory seat review.
Categories that are too coarse to contest are unenforceable.

**Resolution:** The protocol is designed around estimation culture, not audit
precision. The categories are calibrated for practical use: "minimal" means <10k
tokens of agent context and no novel infrastructure; "substantial+" means >200k
tokens or introduces new priced dependencies. These thresholds are coarse but
contestable — a challenger reviewing the execution.md can assess whether the
declared category fits the described scope. The cost discipline seat's role is not
to produce precise billing estimates; it is to flag cases where cost assumptions
are implausible or where tier elevation is warranted. False categorization is a
quality-standard failure, not a protocol design failure.

---

## C-4: Tier 1 optional seat ambiguity — guidance vs. mandate

**Challenge:** The tier-seat matrix marks certain seats as "optional" for Tier 1,
with mappings by motion kind (governance-policy → governance-safety optional;
implementation → execution-pragmatism optional). "Optional" means an author can
skip the review with no consequence. If the optional seats are never used, they
provide no value and the routing matrix reduces to evidence-falsifiability for all
Tier 1 motions.

**Resolution:** The optional designation is intentional. Tier 1 is the standard
operating tier for most motions. Requiring two evaluations for every Tier 1 motion
would double the agent context cost and slow the deliberation cycle without
proportionate benefit. The optional seats serve two purposes: (1) they provide a
governed path for requesters who want an additional seat perspective on a Tier 1
motion, and (2) they create the precedent for when escalation to Tier 2 is
warranted (when the motion kind implies high governance or cost exposure, the
requestor should use the optional seat or re-classify to Tier 2). The matrix is
not silent on Tier 1 rigor — it is explicit that optional means available, not
required.

---

## C-5: Scope — four pairs of deliverables from one motion

**Challenge:** This motion delivers: (1) the deliberation protocol document,
(2) the tier-seat routing matrix, (3) seat assignment extensions for the existing
agent, and (4) program-graph updates plus CR-06 promotion. A single motion with
four pairs is difficult to challenge holistically — a challenger can agree with
three pairs and object to one, but the motion is all-or-nothing. Scope bundling
reduces governance precision.

**Resolution:** The four deliverable pairs are not independently useful. The
deliberation protocol document is not operational without the tier-seat routing
matrix. The routing matrix is not enforceable without the seat assignment
extensions. The program registration is required to categorize this motion
legitimately (it references `program: q2-corpus-v2-live-value-loop` in its own
motion.yaml). CR-06 promotion is a side-effect confirmation action that requires
no new work. Each pair is inseparable from the core operational intent: a
post-opening motion deliberation system that actually routes evaluations. Splitting
the motion would create orphaned documents with no operational anchor.

---

## C-6: This motion's own Tier 2 classification under canon baseline rules

**Challenge:** This motion is governance-policy, novel, and expands the seat
evaluation schema. Under the protocol it creates, it would be Tier 2 (mandatory
cost-discipline + governance-safety evaluation). But the protocol only applies
from motion-0125 onward. So this motion is evaluated under canon baseline rules
(evidence-falsifiability only). That means it receives less rigorous evaluation
than the standard it establishes for future motions. This is a governance gap.

**Resolution:** The gap is real and is documented as a known limitation, not
dismissed. Under the canon baseline, the human panel (operator) retains full
ratification authority. The challenger and arbiter roles are exercised by the same
operator. The governance-safety and cost-discipline concerns are addressed in this
challenge document (the human-authored challenge is the substitute for the missing
seat evaluations). The agent evaluation for this motion focuses on
evidence-falsifiability: are the artifacts specific, falsifiable, and resolvable
from committed repo state? That check is applied rigorously. The acknowledged gap
does not invalidate the motion; it establishes why motion-0124 must be the last
motion evaluated under canon-only rules.
