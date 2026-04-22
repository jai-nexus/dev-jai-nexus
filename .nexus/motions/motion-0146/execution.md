# Execution: JAI Governance Constraint Stack Canon v0

**Motion:** motion-0146
**Kind:** builder-proof
**Status:** DRAFT — awaiting implementation and gate results

---

## Implementation-ready plan

### Touch list (3 new files)

1. `.nexus/docs/governance-constraint-stack.md` — new canon doc: constraint stack
   definition, five constraint classes, cross-artifact applicability map, constraint-
   callout canon, boundary rules, non-goals
2. `.nexus/docs/templates/constraint-callout-template.md` — new template for
   expressing a single constraint callout using the five-class canon
3. `.nexus/docs/examples/governance-constraint-stack-example.md` — new illustrative
   example: five filled callouts, one cross-artifact applicability example, one
   motion-package boundary-rules note

(This file is updated after implementation with evidence.)

### No-touch list

- `.nexus/docs/control-thread-model.md` (motion-0140)
- `.nexus/docs/repo-execution-model.md` (motion-0141)
- `.nexus/docs/orchestrator-model.md` (motion-0142)
- `.nexus/docs/exploration-model.md` (motion-0143)
- `.nexus/docs/workflow-composition-model.md` (motion-0144)
- `.nexus/docs/workflow-kit-model.md` (motion-0145)
- `.nexus/codex/passalong-schema.md`
- `.nexus/docs/templates/` (all existing templates)
- `.nexus/docs/examples/` (all existing examples)
- `portal/` (all files)
- `.nexus/codex/evals/`
- `.claude/commands/`
- `package.json`
- All grid governance scripts

---

## Per-path specifications

### `.nexus/docs/governance-constraint-stack.md`

Model spec:

```
# JAI Governance Constraint Stack Canon v0

## Constraint stack definition
[The governance constraint stack is the named, classified set of cross-cutting
rules that govern what JAI coordination sessions, artifacts, and mode transitions
may and may not do. Advisory and documentary only. A constraint is a rule, not a
trigger.]

## Constraint classification

### Class 1: Non-execution constraints
[No artifact class may execute work or run scripts. Exception: REPO_EXECUTION under
a ratified motion via the explicit/manual council-run boundary.]

### Class 2: Non-mutation constraints
[No commentary, advisory, documentary, or routing artifact may modify repo or
runtime state. Exception: REPO_EXECUTION commits under a ratified motion via the
explicit/manual council-run boundary.]

### Class 3: Non-controller constraints
[No artifact may dispatch sessions, advance mode transitions, enforce transition
gates, or auto-route to a next session. A constraint is a rule, not a trigger.]

### Class 4: Continuity / state-carrying constraints
[Required state must travel intact across session boundaries. State may be
compressed but not silently dropped. Drop is detected by receiving session; fill
is requested before proceeding. Inference is not a substitute for missing state.]

### Class 5: Scope / non-goal preservation constraints
[No session may widen scope beyond the ratified motion without a new governed
motion. Deferred extensions remain deferred. The explicit/manual council-run
boundary must be preserved.]

## Cross-artifact applicability

[Table: five constraint classes × six artifact domains (CT artifacts, ORC
artifacts, RE artifacts, EXP artifacts, Kits, Gov read-only surfaces). RE has
named exception for Classes 1 and 2. Kits and Gov read-only surfaces have n/a
for Class 4 (they are reference artifacts, not state-carrying sessions). All
other cells: applies.]

## Constraint-callout canon
Each constraint callout in any future artifact must contain:
- Constraint class (one of the five v0 classes)
- Constraint statement (specific rule asserted in this artifact)
- Scope (artifact types or session types this callout applies to)
- Exception path (conditions under which the prohibited action is permitted, or "None")
- Reference (canon doc or motion that establishes this constraint)

[A constraint callout is not a gate. Its presence does not trigger evaluation.]

## Boundary rules
[Stack does not: execute, dispatch, mutate, enforce, add runtime gates, override
council-run boundary, collapse role distinctions, define new classes beyond v0.]

## Non-goals
[Enforcement engine; runtime evaluation; violations as gate failures; existing doc
modification; portal/runtime; new constraint classes; RE exception collapse.]
```

### `.nexus/docs/templates/constraint-callout-template.md`

Template spec:

```
## Constraint callout: [short label]

- **Constraint class:** [Class 1: Non-execution | Class 2: Non-mutation |
  Class 3: Non-controller | Class 4: Continuity | Class 5: Scope preservation]
- **Constraint statement:** [Specific rule asserted in this artifact]
- **Scope:** [Artifact types or session types this callout applies to]
- **Exception path:** [Conditions under which the prohibited action is permitted, or None]
- **Reference:** [governance-constraint-stack.md §[class]; or motion-XXXX]
```

### `.nexus/docs/examples/governance-constraint-stack-example.md`

Example spec:

```
# Governance Constraint Stack Example

> **Illustrative only.** This document uses fictional references and placeholder
> values. It is not a governance record. It does not establish new canon.

## Example scenario
[Fictional program context with placeholder artifact names]

## Five filled constraint callouts (one per class)
[Five filled constraint-callout-template.md instances, each using placeholder
artifact names and fictional motion references]

## Cross-artifact applicability example
[Show how one constraint class (e.g., Class 3: Non-controller) applies across
all six artifact domains in the example scenario, with one sentence per domain]

## Motion-package boundary rules note
[Show how constraint callouts would appear in a motion package boundary
preservation section, using fictional motion-XXXX as the example]
```

---

## V-matrix

| Check | Criterion | Method |
|-------|-----------|--------|
| V-1 | governance-constraint-stack.md exists | File check |
| V-2 | Constraint stack definition present | grep "constraint stack" |
| V-3 | Exactly 5 constraint classes | Count Class 1–5 headings |
| V-4 | RE exception present in Class 1 | grep "REPO_EXECUTION" in Class 1 section |
| V-5 | RE exception present in Class 2 | grep "REPO_EXECUTION" in Class 2 section |
| V-6 | Cross-artifact applicability table present | grep "applicability" |
| V-7 | Continuity class has "not silently dropped" | grep "silently dropped" |
| V-8 | Constraint-callout canon has 5 fields | Count field names in callout canon section |
| V-9 | "rule, not a trigger" present | grep "rule, not a trigger" |
| V-10 | Boundary rules section present | grep "Boundary rules" |
| V-11 | constraint-callout-template.md exists | File check |
| V-12 | Template has all 5 required fields | grep field names in template |
| V-13 | governance-constraint-stack-example.md exists | File check |
| V-14 | Example marked illustrative | grep "Illustrative only" |
| V-15 | Example has 5 callouts + cross-artifact + motion note | Section check |
| V-16 | No existing docs modified | git diff --name-only HEAD |
| V-17 | No enforcement language in new files | grep "the stack triggers\|automatically triggers\|gate failure\|constraint enforces" |
| V-18 | validate-motion passes | gate result |
| V-19 | validate-agency passes | gate result |
| V-20 | typecheck passes | pnpm -C portal typecheck |

---

## Commit plan

**Commit 1** — Add governance-constraint-stack.md
```
governance(motion-0146): add governance-constraint-stack.md — JAI Constraint Stack v0

Defines the governance constraint stack: five cross-cutting constraint classes,
cross-artifact applicability map, and constraint-callout canon.
```

**Commit 2** — Add constraint-callout-template.md + governance-constraint-stack-example.md
```
governance(motion-0146): add constraint-callout-template and stack example
```

**Commit 3** — Update execution.md with implementation evidence
```
governance(motion-0146): record implementation evidence in execution.md
```

---

## PR draft

Title: `governance: ratify motion-0146 JAI Governance Constraint Stack Canon v0`

Body:
```
Implements motion-0146 — JAI Governance Constraint Stack Canon v0.

Adds:
- .nexus/docs/governance-constraint-stack.md — five constraint classes,
  cross-artifact applicability map, constraint-callout canon
- .nexus/docs/templates/constraint-callout-template.md
- .nexus/docs/examples/governance-constraint-stack-example.md

No existing docs modified. All required gates pass.
Basis: motion-0145 (JAI Workflow Kit Canon v0).
```

---

## Rollback steps

1. `git revert <commit>` for each commit in the commit plan
2. Verify no existing docs were touched (V-16)
3. Motion returns to DRAFT status

---

## Defect traps

**Trap 1 — Enforcement-implication language**
Before ratification: grep for "the stack triggers", "automatically triggers",
"gate failure", "constraint enforces" across all three new files. Any match is a
defect. The stack is advisory; replace with "asserts", "names", "classifies", or
"references." (Note: "trigger" and "triggers" appear legitimately in boundary rule
negations — "a rule, not a trigger" — and must not be flagged.)

**Trap 2 — RE exception absent from Class 1 or Class 2**
Check Class 1 and Class 2 sections for "REPO_EXECUTION" and "council-run boundary."
If absent from either, the constraint collapses the execution exception. Add the
explicit carve-out before ratification.

**Trap 3 — Constraint class count**
Count Class 1, Class 2, Class 3, Class 4, Class 5 headings in governance-constraint-
stack.md. If not exactly 5, the catalog has drifted. Remove extras or restore
missing classes.

**Trap 4 — Template field parity**
Compare constraint-callout-template.md fields against the callout canon in
governance-constraint-stack.md. Required fields: constraint class, constraint
statement, scope, exception path, reference. Missing or extra required fields are
a defect.

**Trap 5 — Existing doc modification**
Run `git diff --name-only HEAD` before the ratification commit. Any existing
`.nexus/docs/` file in the diff is a defect. Revert and verify V-16 clears before
proceeding.

**Trap 6 — Example illustrative marker**
grep "Illustrative only" governance-constraint-stack-example.md. Absent marker is
a defect. Add blockquote before any content. Required by SC-3.

---

## Implementation evidence

- governance-constraint-stack.md: created at 2026-04-21T00:00:00.000Z
- constraint-callout-template.md: created at 2026-04-21T00:00:00.000Z
- governance-constraint-stack-example.md: created at 2026-04-21T00:00:00.000Z
- Gate results: validate-motion PASS, validate-agency PASS, typecheck PASS
- Implementation confined to: .nexus/docs/governance-constraint-stack.md,
  .nexus/docs/templates/constraint-callout-template.md,
  .nexus/docs/examples/governance-constraint-stack-example.md,
  .nexus/motions/motion-0146/**
- No .claude/**, portal/**, package.json, or runtime/command surfaces touched
- V-matrix: all required checks pass (V-1 through V-20)
