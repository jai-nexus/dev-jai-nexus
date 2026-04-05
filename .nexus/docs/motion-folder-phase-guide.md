# Motion-Folder Phase Guide

**Established:** motion-0119
**Date:** 2026-04-04
**Quality standard reference:** `.nexus/docs/motion-quality-standard.md`

---

## Purpose

This guide provides concrete authoring instructions for each of the six
motion-package files. It converts the five abstract quality dimensions from
the motion quality standard into file-specific requirements, common failure
modes, and before/after examples.

A motion-package file that meets the guidance in this document satisfies
its corresponding quality dimensions. A motion-package file that exhibits
a listed failure mode will fail the quality standard review.

---

## motion.yaml

### Structural requirements

- `protocol_version`: must match the current canonical version (check
  `.nexus/motions/motion-0118/motion.yaml` for current value if unknown).
- `motion_id`: must be `motion-NNNN` where NNNN is a zero-padded integer.
- `kind`: one of `documentation`, `governance-policy`, `governance-closure`,
  `feature`, `bugfix`, `refactor`. Do not invent new kinds.
- `status`: must be `proposed` at creation. `RATIFIED` is only set by the
  ratification process.
- `title`: one sentence, no terminal period. Must be specific enough to
  identify the motion uniquely across the corpus.
- `program`: must match a `program_id` in `.nexus/programs/program-graph.yaml`
  or be a tentative id that will be added in the same commit.
- `required_gates`: must include both `validate_motion` and `validate_agency`
  unless there is a stated reason to omit one.

### Common failure modes

- `kind` does not match the actual nature of the motion (e.g., `documentation`
  for a motion that amends a governance policy).
- `title` is a general description of the area ("Governance improvements")
  rather than a specific description of what the motion does.
- `status` is left as `proposed` even after ratification (status source
  is `decision.yaml`, not `motion.yaml` — but both should stay consistent).

---

## proposal.md

### Structural requirements

Every proposal.md must answer three questions explicitly:

1. **Input state:** What is true before this motion executes? Name the
   specific artifacts or repo conditions that this motion will change.
2. **Change:** What exactly does this motion do? Name the specific files
   created or modified and the nature of each change.
3. **Output state:** What will be true after this motion executes? State
   this in falsifiable terms — a reader should be able to verify it by
   reading the repo.

The proposal should also include: why this change is necessary (the gap
being closed), what the motion explicitly does NOT do (scope boundaries),
and success criteria in enumerable form.

### Common failure modes

- Problem is described without naming the current-state artifact. "The
  repo lacks a quality standard" without naming what is currently in place
  (nothing, a draft, an informal convention).
- Change is described in outcome terms: "improve deliberation quality."
  Not a change — an aspiration. The change is: create these six files
  with these specific contents.
- Output state is implied but not stated. A reader should not need to
  infer the output state from the change description.

### Before / after example — output state

**Weak:**
> This motion creates the deliberation readiness artifact set that will
> enable structured multi-seat review.

**Strong:**
> After this motion: `.nexus/deliberation/seat-contracts/` contains six
> per-seat YAML files, each parseable and with differentiated `block_conditions`.
> `.nexus/deliberation/escalation-ladder.yaml` exists with four tier definitions.
> `validate_motion` and `validate_agency` both pass for motion-0119.

The strong version is falsifiable. A reader can verify it without asking
the author anything.

---

## challenge.md

### Structural requirements

Each challenge must:
- Name a genuine concern that a skeptical reviewer would raise.
- State a resolution that actually engages the concern — not dismisses it.
- Be labeled C-N for easy reference in decision.md.

Required challenge types for motions with significant scope (see quality
standard §2 for definitions):
- **Authority challenge:** Does this motion have the authority to make
  this change?
- **Scope challenge:** Is the scope correct — not too wide, not too narrow?
- **Downstream challenge:** Does this motion affect things it did not
  intend to affect?
- **Sufficiency challenge:** Is the proposed change sufficient to solve
  the stated problem?

A motion with fewer than two challenges is almost always under-challenged.

### Common failure modes

- A challenge is raised that the author clearly expects to dismiss. "Could
  someone argue this is too broad? No, because it is well-scoped." This is
  not an adversarial challenge — it is a strawman constructed to be removed.
- Resolution says "this is fine" or "this concern does not apply" without
  explaining why.
- The challenge document does not include a scope challenge. Scope is the
  most common error in motion authoring and must always be challenged.

### Before / after example — challenge resolution

**Weak (C-1):**
> Concern: Is this motion too broad?
> Resolution: No, because it is bounded to documentation only.

**Strong (C-1):**
> Concern: motion-0119 targets six primary artifacts plus a new directory.
> There is a pattern of overloading single motions.
> Resolution: The six artifacts are more tightly coupled than they appear.
> [Explains the coupling, identifies the clean early-stop point, states
> what a partial ratification produces.] C-3 and C-5 identify real
> implementation risks that must be addressed in execution.

The strong version acknowledges that the concern has merit, engages the
substance, and names the mitigation. Saying "this is fine" is not resolution.

---

## execution.md

### Structural requirements

execution.md must be specific enough that a different person (or a future
agent) could execute the motion correctly from execution.md alone. That means:

- **Complete file list:** Every file created or modified, with the nature
  of each change.
- **Step-by-step sequence:** If steps must happen in order, number them.
  If steps can happen in parallel, say so.
- **Exact validation commands:** Not "run the validators" — the exact command
  string, with expected exit code or output pattern.
- **Evidence checklist:** Binary pass/fail items. Not "verify it looks correct."

### Common failure modes

- "Edit the appropriate section" without naming which file, which section,
  and what the edit produces.
- Validation is described generally: "confirm the YAML parses." Instead:
  `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-NNNN/motion.yaml`
  exits 0 with output `✅ motion schema OK`.
- Evidence checklist items are subjective: "confirm the implementation is
  coherent." A reader cannot determine pass/fail without exercising judgment
  the author did not supply.

### Before / after example — validation step

**Weak:**
> Run the motion validator and confirm it passes.

**Strong:**
> `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0119/motion.yaml`
> Expected: exits 0, output contains `✅ motion schema OK`.

The strong version is copy-pasteable and produces a specific, falsifiable result.

---

## decision.yaml

### Structural requirements

At proposal time:
- `status: proposed`
- `result: pending`
- `ratified_by: null`
- `notes`: brief description of what is pending.

At ratification time (updated by the ratification task):
- `status: RATIFIED`
- `result: PASS`
- `ratified_by: unanimous_consent` (Corpus V1 standard)
- `last_updated`: ISO 8601 timestamp of ratification
- `notes`: brief ratification statement citing the key evidence

**Status source rule:** `decision.yaml` is the authoritative status source
for any motion. If `motion.yaml` and `decision.yaml` disagree on status,
`decision.yaml` governs.

### Common failure modes

- `status` left as `proposed` after ratification (stale state).
- `notes` at ratification time says "passed" without citing evidence. The
  notes field should be a brief rationale, not a status echo.
- `last_updated` not updated at ratification — leaves a stale timestamp
  that makes the ratification record appear to predate the implementation.

---

## decision.md

### Structural requirements

decision.md at proposal time must include:
- A summary of what the motion does and what gaps it closes.
- A brief per-challenge summary (which challenges were raised, whether any
  identified real implementation risks).
- A "Vote" or "Next step" section stating what is pending.

decision.md at ratification time must include:
- **RATIFIED status header** (clearly marked).
- The vote outcome: yes/no/abstain counts and result.
- What was evaluated: specific artifacts reviewed, specific evidence checked.
- Why the vote is correct: not "all criteria met" but which criteria, with
  a pointer to the evidence that supports each.

### Common failure modes

- "Motion passed." This is not a decision rationale — it is a status update.
- "All success criteria were met." Which criteria? What evidence supports each?
- "The implementation is complete." Prove it: name the files, cite the
  validation output.

### Before / after example — ratification rationale

**Weak:**
> The motion was ratified. All required artifacts were created and the
> validators passed.

**Strong:**
> RATIFIED. Six seat contracts committed under `.nexus/deliberation/seat-contracts/`,
> each with differentiated `block_conditions` (verified by reading each file).
> Escalation ladder committed with four tiers, calibration note, and non-numeric
> triggers (verified by reading `.nexus/deliberation/escalation-ladder.yaml`).
> Both `validate_motion` (exit 0, `✅ motion schema OK`) and `validate_agency`
> (exit 0, `✅ registry-backed agency OK`) passed. Evidence checklist in
> execution.md cleared item by item. No blocking challenge identified.
> vote.json: yes=3, no=0, abstain=0, result=PASS.

The strong version is traceable: a reader can verify every claim by reading
the committed artifacts without trusting the author.
