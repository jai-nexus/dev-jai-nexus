# Execution: JAI Canon Interoperability Registry v0

**Motion:** motion-0148
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Status:** RATIFIED

---

## Touch list

**New files (3):**
- `.nexus/docs/canon-interoperability-registry.md` — Sub-line A
- `.nexus/docs/templates/canon-registration-template.md` — Sub-line B
- `.nexus/docs/examples/canon-interoperability-example.md` — Sub-line C

**No other files touched.**

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
- `.nexus/docs/passalong-schema.md` (motions 0134–0139)
- `.claude/commands/*`
- `.nexus/codex/evals/*`
- `portal/scripts/*`
- `portal/src/*`
- `package.json`
- Any `.nexus/motions/motion-0140/` through `motion-0147/` files

---

## Per-path specifications

### `.nexus/docs/canon-interoperability-registry.md`

```
[H1] JAI Canon Interoperability Registry v0
[section] Registry definition
  [para] Navigational map statement
  [para] "registry presence does not confer authority" — in body, not only boundary rules
  [para] Authority source: ratification under a governed motion
  [para] What the registry records: artifact classes, relationship vocabulary, dependency chains
  [para] What the registry is not: authority layer, enforcement mechanism, runtime gate
[section] Artifact classes
  [sub] Foundation layer — definition + current entries (motions 0140–0144) + rules
  [sub] Cross-cutting layer — definition + current entries (motions 0145–0148) + rules
  [sub] Template layer — definition + rules (instantiates, does not extend or redefine)
  [sub] Example layer — definition + "Illustrative only" rule
  [sub] Filled artifact layer — definition + "session artifacts, not canon artifacts"
  [sub] Motion package layer — definition + authority-source statement
[section] Relationship vocabulary
  [sub] depends-on — definition + structural dependency note + example
  [sub] extends — definition + inheritance note + example
  [sub] composes — definition + component pattern note + example
  [sub] references — definition + non-structural note + example
  [sub] example-of — definition + illustrative-only scope + example
  [sub] constrained-by — definition + authoring/session-time scope + example
[section] Registration and dependency canon
  [rule] Declare artifact class
  [rule] Declare layer position
  [rule] Declare dependencies (declarative, not enforced)
  [rule] Declare relationships (six canonical terms only)
  [rule] Declare no-redefinition boundaries
[section] Navigation guidance
  [table] Reader intent → entrypoint (7 rows minimum)
[section] Boundary rules
  [list] What this registry does not do (8+ items)
[section] Non-goals
  [list] Explicit non-goal list from proposal
```

### `.nexus/docs/templates/canon-registration-template.md`

```
[H1] Canon Registration Template
[note] "Template layer — instantiates canon-interoperability-registry.md. Does not extend or redefine it."
[field] Entry name
[field] File path
[field] Artifact class (one of: foundation / cross-cutting / template / example / filled artifact / motion package)
[field] Layer position (foundation / cross-cutting / template / example / filled / motion package)
[field] depends-on (list: file path + motion number)
[field] Relationship declarations
  [sub-field] extends:
  [sub-field] composes:
  [sub-field] references:
  [sub-field] constrained-by:
  [sub-field] example-of:
[field] No-redefinition boundaries (list of settled terms and layers this entry must not redefine)
[field] Notes
```

Total fields: 8 top-level fields (entry name, file path, artifact class, layer position, depends-on, relationship declarations, no-redefinition boundaries, notes). Relationship declarations contains 5 sub-fields.

### `.nexus/docs/examples/canon-interoperability-example.md`

```
[H1] Canon Interoperability Example
[note] "Illustrative only. This document does not establish new canon, register canonical entries,
        or modify any settled canon layer."
[section] Canon stack map
  [para] Six artifact class layers and their navigation relationships (illustrative diagram/table)
[section] Filled registration template — foundation layer
  [note] "Illustrative only."
  [filled] Representative settled entry from foundation layer (e.g., control-thread-model.md)
[section] Filled registration template — cross-cutting layer
  [note] "Illustrative only."
  [filled] Representative settled entry from cross-cutting layer (e.g., governance-constraint-stack.md)
[section] Filled registration template — template layer
  [note] "Illustrative only."
  [filled] Representative settled template (e.g., canon-authoring-checklist-template.md)
[section] Navigation walkthrough — workflow roles
  [para] Reader intent: "Understand a coordination role"
  [para] Entrypoint → sequence through relevant mode model → composition model → kit
[section] Navigation walkthrough — authoring guidance
  [para] Reader intent: "Write a new canon artifact"
  [para] Entrypoint → authoring conventions → registration template → this registry
```

---

## V-matrix

| # | Check | Pass condition |
|---|---|---|
| V-01 | `canon-interoperability-registry.md` exists | File present at path |
| V-02 | `canon-registration-template.md` exists | File present at path |
| V-03 | `canon-interoperability-example.md` exists | File present at path |
| V-04 | Registry body contains "registry presence does not confer authority" | String present in body section, not only boundary rules |
| V-05 | Registry lists all six artifact classes | foundation, cross-cutting, template, example, filled artifact, motion package |
| V-06 | Registry lists all six relationship terms | depends-on, extends, composes, references, example-of, constrained-by |
| V-07 | Registry includes navigation guidance table | Table with ≥7 reader-intent rows |
| V-08 | Registration/dependency canon has five declaration rules | artifact class, layer position, dependencies, relationships, no-redefinition |
| V-09 | Registry boundary rules list contains "does not serve as a validator or gate" | String present |
| V-10 | Dependency declaration language is non-enforcement | `grep "registry enforces\|registry blocks\|automatic enforcement\|gate failure"` returns 0 hits in registry doc |
| V-11 | Template has exactly 8 top-level fields | Entry name, file path, artifact class, layer position, depends-on, relationship declarations, no-redefinition boundaries, notes |
| V-12 | Template includes template-layer note | "instantiates canon-interoperability-registry.md. Does not extend or redefine it." |
| V-13 | Example doc header marked "Illustrative only" | String present in doc header/preamble |
| V-14 | Each filled template block in example doc marked "Illustrative only" | `grep -c "Illustrative only"` ≥ 4 (header + 3 filled blocks) |
| V-15 | Example doc contains exactly three filled registration templates | One foundation, one cross-cutting, one template layer |
| V-16 | Example doc contains two navigation walkthroughs | Workflow roles + authoring guidance |
| V-17 | No existing mode/canon docs modified | `git diff --name-only` does not include any of the 9 no-touch docs |
| V-18 | No portal or script files modified | `git diff --name-only` contains no `portal/` or `package.json` paths |
| V-19 | Registry doc does not invent new constraint classes | `grep "new constraint class\|Class 6\|Class 7"` returns 0 hits |
| V-20 | Registry doc does not invent new coordination modes | `grep "new coordination mode\|introduces.*mode"` returns 0 hits in new files |
| V-21 | `pnpm -C portal typecheck` passes | Exit code 0 |
| V-22 | `validate-motion` passes for motion-0148 | Exit code 0 |
| V-23 | `validate-agency` passes | Exit code 0 |

---

## Defect traps

**Trap 1 — "Registry presence = ratification prerequisite"**
If the registry definition implies that a new canon entry must be registered before it can be ratified, the registry has become a gate. Watch for language like "entries must declare" (prescriptive before ratification) vs. "entries should declare" (advisory after ratification) or "new canon additions register via a motion" (correct: motion is the authority, registration is the record).

**Trap 2 — "depends-on = hard block"**
If the depends-on definition says "may not be ratified until the depended-on entry is settled" without qualifying that this is a reviewer judgment call (not a registry enforcement), it implies registry-mediated gating. The correct framing: "a dependency that is not declared is treated as undocumented state" — the consequence is information loss, not a gate.

**Trap 3 — "Illustrative only" only at the header**
If the example doc marks "Illustrative only" only once (header), a future reader could excerpt a filled template and cite it as the canonical registration for that entry. Every filled template block must carry its own "Illustrative only" marking.

**Trap 4 — Template adds enforcement fields**
If the canon registration template adds a "ratification status," "compliance verified," or "registered by" field, it implies the registry is an authority-granting mechanism. The template must contain only the eight declaration fields. No status, approval, or verification fields.

**Trap 5 — Registry doc cross-references modified mode model docs**
If the registry doc links to sections of mode model docs that do not exist (e.g., a "Registry entry" section added by this motion), it implies those docs were modified. All mode model cross-references must be to existing, ratified sections only.

**Trap 6 — Stack map in example doc becomes a live index**
If the stack map in the example doc lists all current entries with their ratification dates and motion numbers in a format that implies ongoing maintenance, it will be treated as a live canonical index. The stack map must be framed as an illustrative snapshot, not a maintained registry.

---

## Commit plan

**Commit 1 — Sub-line A**
```
docs(canon): add canon-interoperability-registry.md (motion-0148)
```
File: `.nexus/docs/canon-interoperability-registry.md`

**Commit 2 — Sub-lines B and C**
```
docs(canon): add canon-registration-template and interoperability-example (motion-0148)
```
Files:
- `.nexus/docs/templates/canon-registration-template.md`
- `.nexus/docs/examples/canon-interoperability-example.md`

**Commit 3 — Ratification**
```
governance: ratify motion-0148 canon interoperability registry (#XX)
```
Files:
- `.nexus/motions/motion-0148/decision.yaml`
- `.nexus/motions/motion-0148/verify.json`
- `.nexus/motions/motion-0148/policy.yaml`
- `.nexus/motions/motion-0148/vote.json`

---

## PR draft

**Title:** `governance: ratify motion-0148 JAI Canon Interoperability Registry v0`

**Body:**
```
Ratifies motion-0148: JAI Canon Interoperability Registry v0.

Adds three new canon artifacts:
- `.nexus/docs/canon-interoperability-registry.md` — registry definition,
  six artifact classes, six relationship terms, registration/dependency canon,
  navigation guidance table, boundary rules, non-goals
- `.nexus/docs/templates/canon-registration-template.md` — blank declaration
  structure for registering a new canon entry
- `.nexus/docs/examples/canon-interoperability-example.md` — illustrative stack
  map, three filled registration templates, two navigation walkthroughs

No existing `.nexus/docs/` documents modified.
No portal runtime, governance runner, or script files modified.

Gates: validate-motion ✓ validate-agency ✓ typecheck ✓
Program: q2-corpus-v2-live-value-loop
Basis: motion-0147 (JAI Canon Authoring Conventions v0)
```

---

## Implementation evidence

- canon-interoperability-registry.md: created at 2026-04-22T00:00:00.000Z
- canon-registration-template.md: created at 2026-04-22T00:00:00.000Z
- canon-interoperability-example.md: created at 2026-04-22T00:00:00.000Z
- Gate results: validate-motion PASS, validate-agency PASS, typecheck PASS
- Implementation confined to: .nexus/docs/canon-interoperability-registry.md,
  .nexus/docs/templates/canon-registration-template.md,
  .nexus/docs/examples/canon-interoperability-example.md,
  .nexus/motions/motion-0148/**
- No .claude/**, portal/**, package.json, or runtime/command surfaces touched
- V-matrix: all required checks pass (V-01 through V-23)
