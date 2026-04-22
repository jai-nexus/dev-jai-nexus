# Execution: JAI Canon Review and Maintenance Guidance v0

**Motion:** motion-0149
**Kind:** builder-proof
**Program:** q2-canon-stack-consolidation
**Status:** RATIFIED

---

## Touch list

**New files (3):**
- `.nexus/docs/canon-review-maintenance-guidance.md` — Sub-line A
- `.nexus/docs/templates/canon-maintenance-checklist-template.md` — Sub-line B
- `.nexus/docs/examples/canon-maintenance-example.md` — Sub-line C

**No other files touched.**

(This file is updated after implementation with evidence.)

---

## No-touch list

The following files must not be modified:

- `.nexus/docs/control-thread-model.md` (motion-0140)
- `.nexus/docs/repo-execution-model.md` (motion-0141)
- `.nexus/docs/orchestrator-model.md` (motion-0142)
- `.nexus/docs/exploration-model.md` (motion-0143)
- `.nexus/docs/workflow-composition-model.md` (motion-0144)
- `.nexus/docs/workflow-kit-model.md` (motion-0145)
- `.nexus/docs/governance-constraint-stack.md` (motion-0146)
- `.nexus/docs/canon-authoring-conventions.md` (motion-0147)
- `.nexus/docs/canon-interoperability-registry.md` (motion-0148)
- `.nexus/docs/passalong-schema.md` (motions 0134–0139)
- `.nexus/docs/templates/` (all existing templates)
- `.nexus/docs/examples/` (all existing examples)
- `.claude/commands/*`
- `.nexus/codex/evals/*`
- `portal/scripts/*`
- `portal/src/*`
- `package.json`
- Any `.nexus/motions/motion-0140/` through `motion-0148/` files

---

## Per-path specifications

### `.nexus/docs/canon-review-maintenance-guidance.md`

```
[H1] JAI Canon Review and Maintenance Guidance v0
[section] Review and maintenance definition
  [para] Canon review: examining a settled entry for defects warranting maintenance action
  [para] Canon maintenance: applying a scoped action to address an identified defect
  [para] Advisory process — does not operate automatically, does not require a new motion
          for all action classes, does not alter authority of settled entries
[section] Maintenance action classes
  [sub] Correction — factual error / broken reference / incorrect example
        Constraint: bounded to error only; no new terms, no new scope, no new rules
        Motion required: No
  [sub] Clarification — readability / ambiguity / phrasing consistency (no meaning change)
        Constraint: no new canonical terms, no scope extension
        Motion required: No
  [sub] Extension — new concepts / terms / artifact types added without redefining existing
        Constraint: states which existing entry it extends and what it adds
        Motion required: Yes
  [sub] Supersession — replaces a settled layer; redefines or restructures content
        Constraint: explicitly states "supersedes motion-XXXX"; superseded entry annotated
        Motion required: Yes
  [sub] Deprecation — marks entry as superseded, stale, or no longer canonical reference
        Constraint: annotated, not deleted
        Motion required: Yes (or note in superseding motion)
  [sub] Drift handling — resolves accumulated wording / overlap / example drift
        Constraint: action class determined by drift severity (cosmetic / meaningful / structural)
        Motion required: Depends on severity
[section] Maintenance decision guidance
  [table] Situation → Action class → New motion required? (13 rows)
  [note] Table is advisory decision support, not a gate or compliance check
[section] Drift-handling canon
  [sub] Wording drift — definition + handling (register / clarify / no new motion)
  [sub] Overlap drift — definition + handling (cross-reference / extension / supersession)
  [sub] Example drift — definition + handling (correction / extension / supersession)
[section] Casual-reopening guardrail
  [list] What does not constitute a maintenance ground (5+ items)
  [para] Reopening threshold: concrete defect that cannot be addressed by correction/clarification
  [para] Test: a reader following existing canon would reach incorrect/ambiguous conclusion
[section] Boundary rules
  [list] What this guidance does not do (9+ items)
[section] Non-goals
  [list] Explicit non-goal list from proposal
```

**Sequencing constraint:** Correction and clarification action classes must appear before the casual-reopening guardrail section. The guardrail qualifies what does not trigger maintenance; the action classes define what does.

### `.nexus/docs/templates/canon-maintenance-checklist-template.md`

```
[H1] Canon Maintenance Review Checklist
[note] "Template layer — instantiates canon-review-maintenance-guidance.md decision framework.
        Does not grant authority to proceed with a maintenance action."
[field] Entry being reviewed (entry name + file path + motion number)
[field] Issue identified (description of the defect or drift observed)
[field] Issue type (factual error / ambiguity / wording drift / overlap drift /
        example drift / scope gap / other)
[field] Drift type (if applicable: wording / overlap / example / N/A)
[field] Recommended action class (correction / clarification / extension / supersession /
        deprecation / drift handling — register / no action)
[field] New motion required? (yes / no / depends — with one-sentence reasoning)
[field] Casual-reopening check (confirm: is the issue a factual error, structural inconsistency,
        or scope gap? Or is it a style preference or phrasing preference?)
[field] Notes
```

Total fields: 8. No approval, verification, or compliance-status fields.

### `.nexus/docs/examples/canon-maintenance-example.md`

```
[H1] Canon Maintenance Example
[note] "Illustrative only. This document does not establish new canon, apply any maintenance
        action, or modify any settled canon layer."
[section] Scenario 1 — Correction (no new motion)
  [note] "Illustrative only."
  [filled] Broken cross-reference in a mode model doc → Correction, no new motion
[section] Scenario 2 — Clarification (no new motion)
  [note] "Illustrative only."
  [filled] Ambiguous phrasing causing two valid readings → Clarification, no new motion
[section] Scenario 3 — Drift registration (no action required)
  [note] "Illustrative only."
  [filled] Cosmetic wording drift across two layers → Register as known drift, no action
[section] Scenario 4 — Supersession trigger (new motion required)
  [note] "Illustrative only."
  [filled] Structural inconsistency between two layers (contradictory) → Supersession, new motion
```

---

## V-matrix

| # | Check | Pass condition |
|---|---|---|
| V-01 | `canon-review-maintenance-guidance.md` exists | File present at path |
| V-02 | `canon-maintenance-checklist-template.md` exists | File present at path |
| V-03 | `canon-maintenance-example.md` exists | File present at path |
| V-04 | Guidance doc defines all six action classes | correction, clarification, extension, supersession, deprecation, drift handling |
| V-05 | Correction class scoped to "no new terms, no new scope, no new canonical rules" | String or equivalent present in correction definition |
| V-06 | Clarification class scoped to "no new canonical terms, no scope extension" | String or equivalent present in clarification definition |
| V-07 | Decision guidance table present | Table with ≥12 situation rows |
| V-08 | Decision table labeled as advisory | `grep "decision support\|not a gate"` present near table |
| V-09 | Drift-handling canon names three drift types | wording drift, overlap drift, example drift all present |
| V-10 | Structural drift handling requires new motion | `grep "requires.*new motion\|supersession.*required"` present in drift-handling section |
| V-11 | Casual-reopening guardrail section present | Section exists |
| V-12 | Casual-reopening guardrail appears after action classes | Section order: action classes → decision table → drift canon → guardrail |
| V-13 | Guardrail lists "style preference" and "phrasing preference" as non-maintenance grounds | Strings present |
| V-14 | Boundary rules list contains "does not serve as a gate or blocking check" | String present |
| V-15 | Template has exactly 8 fields | entry reviewed, issue identified, issue type, drift type, action class, motion required, casual-reopening check, notes |
| V-16 | Template note states "does not grant authority to proceed" | String present |
| V-17 | Example doc header marked "Illustrative only" | String present in preamble |
| V-18 | Each scenario block in example doc marked "Illustrative only" | `grep -c "Illustrative only"` ≥ 5 (header + 4 scenario blocks) |
| V-19 | Example doc covers four scenario types | correction, clarification, drift registration, supersession trigger |
| V-20 | No existing mode/canon docs modified | `git diff --name-only` does not include any of the 10 no-touch docs |
| V-21 | No portal or script files modified | `git diff --name-only` contains no `portal/` or `package.json` paths |
| V-22 | Guidance doc does not invent new constraint classes | `grep "new constraint class\|Class 6\|Class 7"` returns 0 hits |
| V-23 | Guidance doc does not invent new coordination modes | `grep "new coordination mode\|introduces.*mode"` returns 0 hits |
| V-24 | `pnpm -C portal typecheck` passes | Exit code 0 |
| V-25 | `validate-motion` passes for motion-0149 | Exit code 0 |
| V-26 | `validate-agency` passes | Exit code 0 |

---

## Defect traps

**Trap 1 — "Correction" used to justify scope expansion**
If a correction implementation adds new cross-references, new examples, or new explanatory paragraphs beyond the targeted error, it has silently expanded into extension territory. The correction must change only the identified error — nothing else. Reviewers should diff the correction against the original and confirm no new content was introduced.

**Trap 2 — Decision table becomes a hard gate**
If the guidance doc presents the "New motion required?" column as a system-enforced rule rather than a judgment output, it will be read as a gate. Watch for language like "must open a new motion," "is required to," or "cannot proceed without." Correct framing: "a new motion is appropriate when," "this situation warrants a new motion," "a new motion is the correct action class."

**Trap 3 — Drift-registration becomes indefinite deferral**
If cosmetic, meaningful, and structural drift are not clearly distinguished, "register as known drift" will be applied to contradictory overlaps that require new motions. The decision criteria for escalating from drift-registration to extension or supersession must be explicit: contradictory overlap drift always requires a new motion.

**Trap 4 — Casual-reopening guardrail placed before action classes**
If the guardrail section precedes the correction and clarification action class definitions, authors will read it as prohibiting in-place edits generally before they understand that bounded corrections and clarifications are permitted. Section order is: action classes → decision table → drift canon → guardrail.

**Trap 5 — Maintenance example scenarios cite real settled entries normatively**
If the example doc's filled scenarios cite real settled entries (e.g., "in control-thread-model.md, the following correction is required") it implies the example is a real maintenance action, not an illustration. All scenarios must use generic/fictional entries or explicitly label all real-entry references as illustrative citations only.

**Trap 6 — Template adds "approved by" or "verified by" fields**
If the template includes fields that track who approved or verified a maintenance action, it implies the template is an authority-granting mechanism. The template produces a decision-support checklist, not an approval record. No status, approval, or verification fields permitted.

---

## Commit plan

**Commit 1 — Sub-line A**
```
docs(canon): add canon-review-maintenance-guidance.md (motion-0149)
```
File: `.nexus/docs/canon-review-maintenance-guidance.md`

**Commit 2 — Sub-lines B and C**
```
docs(canon): add canon-maintenance-checklist-template and maintenance-example (motion-0149)
```
Files:
- `.nexus/docs/templates/canon-maintenance-checklist-template.md`
- `.nexus/docs/examples/canon-maintenance-example.md`

**Commit 3 — Ratification**
```
governance: ratify motion-0149 canon review and maintenance guidance (#XX)
```
Files:
- `.nexus/motions/motion-0149/decision.yaml`
- `.nexus/motions/motion-0149/verify.json`
- `.nexus/motions/motion-0149/policy.yaml`
- `.nexus/motions/motion-0149/vote.json`

---

## PR draft

**Title:** `governance: ratify motion-0149 JAI Canon Review and Maintenance Guidance v0`

**Body:**
```
Ratifies motion-0149: JAI Canon Review and Maintenance Guidance v0.

Adds three new canon artifacts:
- `.nexus/docs/canon-review-maintenance-guidance.md` — maintenance definition,
  six action classes, decision guidance table, three drift types, casual-reopening
  guardrail, boundary rules, non-goals
- `.nexus/docs/templates/canon-maintenance-checklist-template.md` — blank
  decision-support checklist for reviewing a settled canon entry
- `.nexus/docs/examples/canon-maintenance-example.md` — illustrative scenarios
  for correction, clarification, drift registration, and supersession trigger

No existing `.nexus/docs/` documents modified.
No portal runtime, governance runner, or script files modified.

Gates: validate-motion ✓ validate-agency ✓ typecheck ✓
Program: q2-canon-stack-consolidation
Basis: motion-0148 (JAI Canon Interoperability Registry v0)
```

---

## Implementation evidence

- canon-review-maintenance-guidance.md: created at 2026-04-22T00:00:00.000Z
- canon-maintenance-checklist-template.md: created at 2026-04-22T00:00:00.000Z
- canon-maintenance-example.md: created at 2026-04-22T00:00:00.000Z
- Gate results: validate-motion PASS, validate-agency PASS, typecheck PASS
- Implementation confined to: .nexus/docs/canon-review-maintenance-guidance.md,
  .nexus/docs/templates/canon-maintenance-checklist-template.md,
  .nexus/docs/examples/canon-maintenance-example.md,
  .nexus/motions/motion-0149/**
- No .claude/**, portal/**, package.json, or runtime/command surfaces touched
- V-matrix: all required checks pass (V-01 through V-26)
