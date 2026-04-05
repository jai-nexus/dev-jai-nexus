# Challenge: CR-04 JAI Agent Operational v0 — minimum viable first agent, governed seat assignment, and traceable agent vote proof

**Motion:** motion-0121
**Date:** 2026-04-05

---

## C-1: The CR-03 entrance gate is performative. You are assessing your own motions for compliance with a standard you wrote. This is self-certification, not an adversarial check.

**Concern:** The CR-03 compliance record assesses motions 0118–0121 for
quality-standard compliance. The same operator who authored those motions
is now writing the compliance assessment. There is no adversarial reviewer
in this picture. A compliance record authored by the compliance subject is
not meaningful governance evidence.

**Resolution:** The compliance record's value is not adversarial review —
it is structured forcing function. CR-03 requires five consecutive motions
to be evaluated against the Evidence/Falsifiability and Governance/Safety
seat contracts. The seat contracts have specific PASS criteria and specific
block_conditions. Applying those contracts to recent motions forces the
evaluator to check specific things: does decision.md name what was verified?
does the evidence checklist cover all success criteria? are block conditions
present that should have triggered? These checks are not subjective, and a
compliance record that finds a genuine gap is a meaningful governance output
regardless of who produced it.

The mitigation: the compliance record must be adversarial in tone, not
self-congratulatory. Each motion must be assessed dimension by dimension
with honest PASS/FAIL findings. A compliance record that gives every motion
PASS on every dimension without engaging specific evidence is not a valid
compliance record — the evidence checklist in execution.md will verify that
each assessment cites specific artifacts. If any dimension is FAIL, the
compliance record must say so and the motion must address the gap rather
than ignoring it.

---

## C-2: The agent evaluating motion-0121 is the same Claude instance that authored motion-0121. This is not an independent evaluation — it is the author reviewing their own work with a different hat on.

**Concern:** The proposal says the agent evaluates motion-0121 to produce
the CR-04 proof. But `jai-agent-001` running the evidence-falsifiability
evaluation is, in practice, the same underlying model (Claude) that wrote
the motion package. The evaluation will not find genuine gaps because the
evaluator is not independent of the author.

**Resolution:** This challenge identifies a real limitation of Corpus V1
CR-04 closure that must be stated honestly rather than argued away. The
resolution is framing, not refutation.

In Corpus V1, there are no truly independent agents. The CR-04 minimum
viable bar was set knowing this: one agent, one seat, one governed output.
The governed output demonstrates that the agent-vote-protocol schema works,
that agents.generated.yaml can carry a panel-seat agent, that seat-assignment
artifacts can be committed, and that evaluation traces can reference seat
contract fields. These are structural governance proofs, not adversarial
correctness proofs.

The spec (motion-0120 §6) was explicit about this: "A low bar that is
actually met is better than a high bar that is never cleared." The agent
independence problem is a Corpus V2 concern, not a Corpus V1 minimum bar
concern. When multiple independent JAI Agents with genuinely different
models and operating contexts are available, the independence problem is
addressed. For now, the CR-04 proof is structural, not adversarial.

The mitigation: decision.md must explicitly state this limitation. The
evaluation trace must note that `jai-agent-001` and the motion author share
an underlying model. CR-04 closure does not claim adversarial independence —
it claims schema-and-structure compliance.

---

## C-3: Registering an agent by editing agents.generated.yaml without understanding its schema is dangerous. What if the format is wrong and validate_agency breaks?

**Concern:** agents.generated.yaml currently has 201 entries and is validated
by `validate_agency`. Adding a new entry with the wrong format could break
validation for the entire domain. The proposal does not specify the exact
YAML structure required for a new agent entry.

**Resolution:** The execution.md must require reading agents.generated.yaml
before writing a new entry — not to find a path, but to understand the
exact schema of an existing entry and replicate the format. The new entry
must mirror the field names, nesting, and value formats of an existing
panel-seat entry if one exists, or the closest type available if not.

After adding the entry, `validate_agency` must be re-run and must exit 0
before any subsequent implementation step proceeds. If `validate_agency`
fails after the addition, the implementation must stop and diagnose before
continuing. The new entry must not be guessed from the spec description —
it must be modeled on the actual file content.

The execution.md will specify: read two existing entries first, model the
new entry on the closest matching type, run validate_agency immediately after
the edit, stop if exit code is non-zero.

---

## C-4: The agent vote is filed at `.nexus/motions/motion-0121/agent-vote.json`, not at `.nexus/motions/motion-0121/vote.json`. Two vote files in one motion package is a structural anomaly that may confuse future tooling.

**Concern:** The human ratification vote.json and the agent evaluation
vote are different artifacts. Naming the agent's output `agent-vote.json`
in the motion folder creates a non-standard file that the current motion
package schema does not define. Future tooling or validators may not expect
this file.

**Resolution:** This is a real structural design choice that must be
addressed explicitly in the proposal and execution. Two viable options:

**Option A (agent-vote.json):** File the agent's output as `agent-vote.json`
in the motion package. This keeps the agent vote alongside the motion it
evaluated. The naming difference (`agent-vote.json` vs `vote.json`) makes
the distinction clear. The human ratification `vote.json` remains the
canonical ratification record.

**Option B (evaluation-traces only):** The agent's output is committed only
as the evaluation trace. The `vote.json` remains exclusively the human
ratification record. The agent's verdict is expressed through the trace and
the checklist closure, not through a vote.json file.

motion-0121 adopts **Option A** with the following constraint: `agent-vote.json`
is explicitly not a ratification vote. The motion package schema allows
arbitrary additional files in a motion folder (only the six canonical files
have defined semantics). `agent-vote.json` is supplementary evidence, not
a governance vote on the motion's ratification. This must be stated in the
`agent-vote.json` itself via a `note` field.

---

## C-5: Does closing CR-04 require updating agents.generated.yaml, which lives in a different workspace location (workspace/jai-nexus/nexus-core/)? That workspace may not be on this branch or may have different write rules.

**Concern:** The CR-04 spec says the agent must be registered in
`workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`. This path
is in a different directory tree from `.nexus/`. It may be in a workspace
that is not under the current branch's jurisdiction. Edits there may not
follow the same governance rules as `.nexus/` edits.

**Resolution:** This is a valid concern about workspace scope and must be
checked before implementation begins. The execution.md must require a
baseline read of `workspace/jai-nexus/nexus-core/registry/agents.generated.yaml`
at the start of implementation to confirm:
1. The file is readable and parseable.
2. The file is under git version control (can be committed on this branch).
3. Its schema supports the required fields.

If any of these three conditions is not met, the implementation step stops
and reports the specific blocker before attempting an edit. The agent
registration cannot proceed against an inaccessible or non-committable file.
An alternative path (e.g., a `.nexus/`-local agent manifest) will be
assessed only if the canonical path is confirmed inaccessible. The fallback
must be governed by a ratified motion, not improvised during implementation.

---

## C-6: Seven implementation artifacts across four phases in one motion. The scope pattern from prior motions is repeating — is this arc too wide?

**Concern:** motion-0118 had seven artifacts. motion-0119 had six.
motion-0120 had six (in three pairs). motion-0121 has seven (in four phases).
The artifact count never narrows even as the arc approaches "minimum viable."

**Resolution:** The seven artifacts in motion-0121 are more tightly coupled
than they appear:

- The CR-03 compliance record is independent and could be separated, but
  doing so would require a single-artifact Tier 0 motion followed by this
  motion — adding overhead that the compliance record's low complexity does
  not justify.
- Agent registration and seat assignment are a single logical operation:
  an agent without a seat is not a panel participant. Two files, one step.
- Agent vote and evaluation trace are inseparable: the vote.json references
  the trace via `evaluation_trace_ref`. Committing the vote without the trace
  creates a broken reference. One step, two files.
- Closure updates (checklist + criteria) follow directly from the evidence.
  Deferring them to a separate motion would mean CR-04 checklist items remain
  `unmet` despite the evidence being committed. This creates an inconsistent
  state — evidence exists but the governed closure event has not happened.

Early-stop coherence: stopping after Phase 2 (agent registered + seat
assigned) leaves a coherent state where CR04-01 and CR04-02 are closeable
but not yet closed. Stopping after Phase 3 leaves a coherent state where
all seven items are closeable but the checklist update is deferred to the
ratification motion. Either early stop is coherent and commits forward progress.

---

## Resolution

No blocking challenge identified. C-2 identifies a real structural limitation
of Corpus V1 CR-04 closure (non-independent evaluation) that must be stated
explicitly in the evaluation trace and decision.md — not as a defect to be
fixed but as an honest characterization of what this proof demonstrates and
does not demonstrate. C-3 requires the execution.md to mandate reading
agents.generated.yaml before editing it and running validate_agency immediately
after. C-5 requires a baseline read of the workspace path before any write
attempt. Proceed to execution with these mitigations explicit.
