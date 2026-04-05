# Challenge: CR-05 Corpus V2 Opening Planning v0 — opening boundary, first agent-voted motion shape, and transition guardrails

**Motion:** motion-0122
**Date:** 2026-04-05

---

## C-1: Is this motion planning for more planning? motion-0120 planned for CR-04. motion-0121 implemented it. Why does CR-05 need another planning layer before the opening event — can't the opening motion plan itself?

**Concern:** The proposal argues that the Corpus V2 opening motion needs
a pre-committed specification the same way CR-04 implementation needed
motion-0120. But CR-04 was a technical readiness criterion with a
machine-checkable closure condition. CR-05 is a governance declaration.
Governance declarations do not require external specification — the motion
that makes the declaration is its own specification. Adding a planning layer
before the opening event introduces unnecessary ceremony.

**Resolution:** The parallel to motion-0120 is correct but the analogy is
not quite right. The more precise analogy is: the opening event is the
highest-stakes governance motion in the corpus so far, and its risks are
categorically different from CR-04.

CR-04's risk was technical: would agents.generated.yaml accept a new entry
without breaking validate_agency? The mitigation was a pre-flight read and
an immediate post-edit validation. The planning motion specified the check;
the implementation ran it.

CR-05's risk is semantic: the opening event will be cited as precedent for
every Corpus V2 motion that follows. If the opening motion gets the panel
composition wrong, every future Corpus V2 motion inherits the wrong model.
If the opening motion inherits Corpus V1 artifacts by assumption rather than
by governed declaration, the inheritance is a latent ambiguity in every
future motion that references those artifacts. If the opening motion is
ratified by the same structural proof that closed CR-04, it is indistinguishable
from the CR-04 proof — it is not a new era, it is a renamed motion.

These risks cannot be mitigated during drafting of the opening motion itself.
They must be mitigated before drafting begins — because the moment the opening
motion is drafted against ambiguous pre-conditions, its scope is already
compromised. The planning motion commits the bar before the drafting begins.

The test: after motion-0122 is implemented and ratified, can a new session
open the launch packet and author the Corpus V2 opening motion without asking
"but what exactly does a valid Corpus V2 opening require?" If yes, motion-0122
is an implementation prerequisite, not ceremony.

---

## C-2: This motion defines the "shape of the first agent-voted motion" — but the opening motion is also the first agent-voted motion. You are defining the target and hitting the target in the same arc. Isn't the cr05-first-agent-voted-motion-contract circular?

**Concern:** The cr05-first-agent-voted-motion-contract is supposed to
define what a valid Corpus V2 opening looks like. But the opening motion
must satisfy that contract to be valid. If the contract is authored in the
same planning arc that opens Corpus V2, there is no independent check:
the author of the contract is the same operator who will draft the opening
motion. The contract will be written to match the motion the operator
intends to write.

**Resolution:** The circularity is real if the contract and the opening
motion are authored in the same session or the same branch. The governance
answer is arc separation: the planning arc (this branch) is ratified and
merged before the opening arc begins. The contract is a committed, ratified
artifact before anyone starts drafting the opening motion. The opening
motion is then evaluated against a contract it cannot retroactively change.

The non-circularity test: would a reviewer who had not seen the planning arc
be able to read the cr05-first-agent-voted-motion-contract and independently
assess whether the opening motion satisfies it? If yes, the contract is
non-circular. The contract must be written to pass this test: specific enough
that an uninformed reviewer can check compliance, not a mirror of whatever
the author plans to write.

The mitigation in execution.md: the contract must define minimum panel
composition as a specific number and seat set, required evidence artifacts
as a specific file list, and the distinction between "establishes" and
"inherits" as a structured list — not prose that can be read either way.

---

## C-3: CR-03 is at 4/5. The fastest path to closing CR-03 would be a narrow, high-quality post-0118 motion — not a broad planning arc. Does motion-0122's scope prioritize CR-03 closure or delay it by being too complex to implement quickly?

**Concern:** CR-03 requires one more qualifying post-0118 motion. A narrow,
well-executed motion (e.g., a documentation motion or program graph update)
could close CR-03 cleanly. motion-0122 is broad and complex. If implementation
takes multiple sessions, CR-03 closure is delayed. The critical path to
CR-05 runs through CR-03 (4/5 → 5/5) and then to the opening motion. A
planning arc that delays CR-03 is the wrong arc.

**Resolution:** The framing inverts the priority. CR-03 closure is not the
purpose of motion-0122; it is a consequence of good work. Authoring a narrow
CR-03-closing motion first would produce a correctly qualified corpus record
but would not advance the opening planning. The opening planning still needs
to happen before the opening event — deferring it does not save time,
it adds a sequential dependency (close CR-03, then plan CR-05) where a
parallel one could exist (plan CR-05 in a way that also qualifies for CR-03).

If motion-0122 is implemented and ratified well — per the five quality
dimensions in the compliance record — it will be the 5th qualifying post-0118
motion and CR-03 will close as a side effect. That outcome requires motion-0122
to be high-quality, not narrow. The quality standard is the entry bar, not
the width of scope.

The operational mitigation: the six artifacts in motion-0122 are structured
in pairs with an early-stop guarantee after Pair 1. If implementation stalls
after Pair 1 (opening boundary + checklist), those two artifacts alone are
ratifiable and qualify as the 5th CR-03 motion if the quality standard is met.
CR-03 does not require six artifacts — it requires five good motions.

---

## C-4: Does committing the cr05-panel-staging-guidance before the Corpus V2 governance canon exists amount to specifying Corpus V2 rules in a Corpus V1 motion?

**Concern:** The panel staging guidance answers: how should the panel for
the opening event be composed, and how does panel composition evolve into
Corpus V2? Answering this in motion-0122 means that Corpus V2 panel
governance rules are being set by a Corpus V1 motion. This is the same
risk that challenge C-5 in motion-0120 identified (pre-specifying Corpus V2
architecture) — and it was only partially resolved there.

**Resolution:** The same interface/implementation distinction applies here,
but it must be applied more carefully than in motion-0120 because panel
staging is a higher-authority question than agent vote schema fields.

The cr05-panel-staging-guidance does not set Corpus V2 panel governance rules.
It answers a specific bounded question: what mechanism governs the ratification
of the opening motion itself — which is a Corpus V1 question, because the
opening motion exists and is ratified before Corpus V2 begins. A Corpus V1
motion governing how the opening event is ratified is not pre-specifying
Corpus V2 canon; it is completing Corpus V1 governance by specifying the
exit condition.

What the staging guidance must NOT do: declare the panel composition for
Corpus V2 motions after the opening event. That is Corpus V2 canon scope.
The staging guidance is scoped to the opening event only — what happens after
the opening is out of scope and must be stated explicitly in the artifact.

The execution.md must enforce this scope: the cr05-panel-staging-guidance
covers only the opening motion's ratification mechanism. A scope creep check
item in the evidence checklist will verify that the guidance does not declare
Corpus V2 ongoing panel rules.

---

## C-5: The red-lines artifact defines what would "fake" a Corpus V2 start. But it is authored by the same operator who will author the opening motion. An operator who intends to fake the opening can simply write red lines that exclude their intended approach from the "fake" category.

**Concern:** The cr05-first-agent-voted-motion-contract includes red lines
defining what would constitute a false Corpus V2 start. The motivating case
is the CR-04 non-independence limitation: the first agent proof was structural,
not adversarial, and this was acceptable only because it was explicitly
acknowledged as such. The proposal implies the opening event must be stronger.
But if the operator writes the red lines, the operator controls what "strong"
means.

**Resolution:** The red lines are not a self-assessment instrument. They are
a pre-committed falsifiability standard — a list of specific configurations
that, if present in the opening motion, render it invalid regardless of author
intent. The value is not that the author cannot write red lines that suit them;
the value is that a reviewer, seeing the ratified red lines and reading the
opening motion, can check each one independently.

The mitigation is specificity, not authority. A vague red line ("the opening
should feel like a real transition") is worthless — it is as flexible as the
author wants. A specific red line ("the opening motion may not be ratified by
a panel in which the only agent participant is nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001
acting alone without additional agent or human oversight beyond the proposer")
is checkable regardless of who wrote it.

The execution.md will require: each red line must reference a specific, named
artifact or configuration. Prose-only red lines that cannot be checked against
repo state are not valid red lines.

---

## C-6: Seven implementation artifacts across three pairs and a launch packet. Same scope inflation as prior motions.

**Concern:** motion-0118: seven artifacts. motion-0119: six. motion-0120:
six. motion-0121: seven. motion-0122: seven (counting the launch packet).
The artifact count has never decreased. This is a systematic pattern of
scope maximization disguised as coherent pairing.

**Resolution:** The pairing structure is real, not post-hoc:

- **Pair 1 (opening boundary + checklist):** The boundary document says
  what must be true; the checklist makes it machine-checkable. The boundary
  without the checklist is aspirational prose. The checklist without the
  boundary document has no context for its items. They are a single design
  unit split into two files for the same reason cr04-closure-checklist.yaml
  and cr04-agent-readiness-spec.md were separate: the document explains,
  the checklist verifies.

- **Pair 2 (first-agent-voted-motion contract + panel staging guidance):**
  The contract says what the opening event must produce; the staging guidance
  says who ratifies it and how. Both are required before the opening motion
  can be drafted. A contract without a ratification mechanism is unenforceable.
  A ratification mechanism without an evidence contract is procedure without substance.

- **Pair 3 (inherited-context packet + program graph + launch packet):**
  The inherited-context packet is standalone — it could ship alone, but it
  is low complexity and belongs with the arc-opening artifacts. The program
  graph and launch packet are structurally required for any new program line
  under the planning canon. Three files, but the program graph update is a
  single field addition and the launch packet instantiates a template.

Early-stop guarantee: stopping after Pair 1 produces a ratifiable output.
Two artifacts. The opening boundary conditions are checkable. CR-03 is
potentially closeable. The remaining pairs do not need to exist for the
planning arc to have produced governance value.

---

## Resolution

No blocking challenge identified. C-2 identifies a real circularity risk
that is mitigated by arc separation: the planning arc must be ratified and
merged before the opening arc begins. The execution.md must make this
explicit as a hard constraint on the launch packet's done-when condition.
C-4 identifies a real authority boundary: the cr05-panel-staging-guidance
is scoped to the opening event only and must not declare Corpus V2 ongoing
panel rules. C-5 identifies a real falsifiability requirement: red lines
must reference specific named artifacts or configurations, not prose conditions.
Proceed to execution with these mitigations explicit.
