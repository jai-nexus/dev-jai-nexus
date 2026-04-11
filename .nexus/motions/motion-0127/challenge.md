# Challenge: motion-0127 — Corpus V2 governed activation proof v0 — escalate path

**Motion:** motion-0127
**Date:** 2026-04-11

---

## C-1: Is it dishonest to declare `substantial` when the actual scope is artifact-only?

The actual implementation scope of this proof motion is small: create a motion
package, run three scripts, record a receipt. That is `standard` by the deliberation
protocol's category definitions (10k–500k tokens, multiple artifacts, no new priced
dependencies).

Declaring `substantial` when the actual scope is `standard` would be a cost-discipline
quality failure in any other motion. Here it is justified because:

1. The proof's explicit goal is to exercise the ESCALATE activation gate. The ESCALATE
   gate fires only for `substantial` or `major` declarations. The `substantial`
   declaration is the proof mechanism, not a scope claim.

2. The declaration is transparent: proposal.md, challenge.md, and execution.md each
   state that the `substantial` category is intentionally chosen to trigger the gate.
   There is no attempt to misrepresent the scope.

3. The cost-discipline seat evaluation (triggered by the `substantial` declaration)
   directly evaluates whether this intentional mismatch is a quality failure. The
   seat's block conditions require that scope is "significantly above what the impact
   justifies, with no stated reason." The reason is stated explicitly and is the
   entire point of the motion.

**Resolution:** The `substantial` declaration is a governed proof mechanism, not a
scope inflation. The cost-discipline seat evaluation confirms or challenges this
judgment. The motion does not pass or fail based on the cost category being "correct"
for the actual scope — it passes or fails based on whether the escalation behavior
was demonstrated and the documentation is honest.

---

## C-2: Does the cost-discipline mandatory seat create a circular dependency?

Declaring `substantial` triggers the deliberation protocol's cost-discipline seat
(Tier 1 + cost-escalation). The cost-discipline seat's evaluation addresses whether
the `substantial` declaration is justified. The answer will be: no, it is not
justified by scope — it is justified by proof intent.

Could the cost-discipline evaluation BLOCK the motion? It would BLOCK if the
cost mismatch has "no stated reason." The stated reason is present (multiple times).
The block condition is not triggered.

**Resolution:** The cost-discipline seat functions as designed — it audits the cost
declaration. For this motion, it produces a nuanced PASS: the declared category does
not match scope, but the mismatch is governed and documented. No circular dependency;
the evaluation is straightforward.

---

## C-3: Should `--create` be run and the exit 1 be part of the evidence?

Yes. The exit 1 from `--create` is the key proof that the ESCALATE gate fires and
refuses packet creation. The activation artifact (written before the gate check fails)
shows `create_requested: true` and `work_packet_id: null`. Both pieces of evidence
together prove: the creation attempt was made, the gate fired, and no packet exists.

Recording only the dry-run would leave ambiguity about whether the gate would fire
if creation were actually attempted. Running `--create` and capturing the exit 1
eliminates that ambiguity.

The exit 1 itself is not committed as an artifact — but the state of
`execution.activation.json` after the `--create` run (with `work_packet_id: null`)
is the durable proof.

---

## C-4: Is BLOCKED the right receipt status?

Yes. The allowed receipt statuses are: ACKNOWLEDGED, STARTED, COMPLETED, BLOCKED,
FAILED, REVERTED. For this motion, the activation was blocked by the escalation gate
— the execution path was refused before it started. BLOCKED accurately captures this
state and sets `finished_at` (per receipt script semantics), marking the lifecycle
as closed for this proof without overstating it as COMPLETED or FAILED.

**Resolution:** BLOCKED is the honest status for "activation was refused by the gate;
the governed path is closed pending operator escalation review."
