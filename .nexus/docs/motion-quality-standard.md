# Motion Quality Standard — dev-jai-nexus

**Established:** motion-0118
**Date:** 2026-04-03

---

## Purpose

This document defines the quality standard for motion packages in
dev-jai-nexus. It is a practical checklist, not a rubric for perfection.
A motion that passes this standard is clear enough to be executed correctly
by someone who was not in the planning session that produced it.

---

## When to apply this standard

**Always apply** for:
- The first motion in any new program line (the launch motion)
- Any motion that creates a new `.nexus/` substrate or schema artifact
- Any motion that modifies portal runtime behavior
- Any motion that changes governance policy

**Apply if useful** for:
- Small bounded repair motions (single-surface, single-session)
- Normalization or cleanup motions with clear, pre-defined scope

Use judgment. The standard is a tool, not a gate that blocks small work.

---

## The five quality dimensions

### 1. Proposal precision

The proposal must state three things explicitly:

- **Input state:** What is true before this motion executes? (Not a
  description of the problem in the abstract — the actual current state of
  the repo artifacts that this motion will change.)
- **Change:** What exactly does this motion do? (Not "improve" or "fix" —
  the specific files, the specific change, the specific new artifact.)
- **Output state:** What will be true after this motion executes? (Falsifiable
  — a reader should be able to verify it by reading the repo.)

**Pass criterion:** A reader who has never seen this motion before can, from
the proposal alone, describe the input state, the change, and the output
state accurately.

**Fail signals:**
- Proposal describes a problem without naming the current state artifact
- Change is described in outcomes ("improve performance") without specifying
  the mechanism
- Output state is implied but not stated

---

### 2. Challenge adversarialism

The challenge document must raise the strongest honest objections to the
motion — not strawmen constructed to be easily dismissed.

**Pass criterion:** A skeptical reader who wants to find a reason not to
ratify this motion would not find a better objection than the ones already
raised and resolved in the challenge document.

**Fail signals:**
- Challenges are weaker than the real objections a knowledgeable reviewer
  would raise
- All challenges are resolved with "this is fine" without engaging the concern
- The challenge document does not ask whether the scope is correct

**Required challenge types for motions with significant scope:**
- **Authority challenge:** Does this motion have the authority to make this
  change?
- **Scope challenge:** Is the scope correct — not too wide, not too narrow?
- **Downstream challenge:** Does this motion affect things it did not intend
  to affect?
- **Sufficiency challenge:** Is the proposed change sufficient to solve the
  stated problem?

---

### 3. Execution specificity

The execution document must be specific enough that a different person (or
a future agent) could execute the motion correctly from the execution.md
alone.

**Pass criterion:** The execution document names every file that will be
created or modified, states the exact command to verify each change, and
includes an evidence checklist with specific expected output for each check.

**Fail signals:**
- "Edit the file to add the new section" (which file? what section? where?)
- Validation steps are described generally ("run the validators") without
  exact commands and expected exit codes
- Evidence checklist items are not falsifiable ("confirm the change looks
  correct")

**Required elements:**
- Complete file list: created and modified, with the nature of each change
- Step-by-step implementation sequence
- Exact validation commands with expected output
- Evidence checklist with specific, binary pass/fail criteria

---

### 4. Evidence traceability

Claims in the motion must be independently verifiable. Evidence must be
grounded in committed repo state, not in the author's assertion.

**Pass criterion:** For every material claim in the vote rationale, a reader
can verify it by reading the repo (not by trusting the author).

**Fail signals:**
- Vote rationale says "all 6 success criteria were met" without listing them
  or pointing to where they are verified
- verify.json records gate results but the commands listed do not match the
  actual commands run
- decision.md says "the implementation is complete" without citing the
  specific artifacts that prove it

**For ratification votes specifically:**
- vote.json rationale must cite the committed evidence (artifact paths,
  gate results, success criterion checks)
- verify.json must record the actual gate commands run and their actual
  exit codes
- decision.md must name what was verified, not just state the conclusion

---

### 5. Decision rationale

The decision must explain why the vote is correct given the evidence — not
just that it passed.

**Pass criterion:** A reader can reconstruct the reasoning from the decision
alone: what evidence was evaluated, what the evidence showed, and why that
evidence justifies ratification.

**Fail signals:**
- "Motion passed." (Why?)
- "All criteria met." (Which criteria? What evidence supports each?)
- "Implementation is complete." (Prove it without reading the execution.md.)

---

## Quick self-assessment checklist

Before ratifying any motion, run through this checklist:

**Proposal**
- [ ] Input state is named explicitly (specific artifacts or repo conditions)
- [ ] Change is described specifically (not outcomes — the mechanism)
- [ ] Output state is falsifiable (can be verified by reading the repo)

**Challenge**
- [ ] The strongest real objection is raised (not just easy ones)
- [ ] Each challenge resolution actually engages the concern
- [ ] Scope correctness is challenged at least once

**Execution**
- [ ] Every created/modified file is listed
- [ ] Every validation command is exact (with expected exit code or output)
- [ ] Evidence checklist items are binary (pass/fail, not "looks correct")

**Evidence**
- [ ] Vote rationale cites committed artifacts, not assertions
- [ ] verify.json commands match what was actually run
- [ ] decision.md names what was verified, not just the conclusion

**Decision**
- [ ] Reader can reconstruct the reasoning from the decision alone
- [ ] "Why ratified" is answerable from the decision text
- [ ] No material claim requires trusting the author over the repo state

---

## Relationship to future JAI Agent panel review

When Corpus V2 begins, JAI Agent panels will evaluate motions against this
standard. Each of the six panel seat perspectives maps to one or more
dimensions:

| Seat | Primary dimensions |
|---|---|
| Cost discipline | Execution specificity (scope efficiency) |
| Architecture | Proposal precision (structural correctness) |
| Governance / safety | Challenge adversarialism, evidence traceability |
| Operator usability | Execution specificity, proposal precision |
| Evidence / falsifiability | Evidence traceability, decision rationale |
| Execution pragmatism | Execution specificity, challenge adversarialism |

The mechanism by which panels apply this standard is Corpus V2 scope.
The standard itself is defined here and applies now.
