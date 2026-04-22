# Execution: JAI Canon Authoring Conventions v0

**Motion:** motion-0147
**Kind:** builder-proof
**Status:** DRAFT — awaiting implementation and gate results

---

## Implementation-ready plan

### Touch list (3 new files)

1. `.nexus/docs/canon-authoring-conventions.md` — new canon doc: authoring-
   convention definition, four artifact types, ten phrasing rules, four cross-
   layer reference rules, thirteen-item authoring checklist, boundary rules, non-goals
2. `.nexus/docs/templates/canon-authoring-checklist-template.md` — new blank
   checklist template instantiating the thirteen-item authoring checklist
3. `.nexus/docs/examples/canon-authoring-example.md` — new illustrative example:
   fictional model doc skeleton, filled checklist, annotation layer

(This file is updated after implementation with evidence.)

### No-touch list

- `.nexus/docs/control-thread-model.md` (motion-0140)
- `.nexus/docs/repo-execution-model.md` (motion-0141)
- `.nexus/docs/orchestrator-model.md` (motion-0142)
- `.nexus/docs/exploration-model.md` (motion-0143)
- `.nexus/docs/workflow-composition-model.md` (motion-0144)
- `.nexus/docs/workflow-kit-model.md` (motion-0145)
- `.nexus/docs/governance-constraint-stack.md` (motion-0146)
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

### `.nexus/docs/canon-authoring-conventions.md`

Model spec:

```
# JAI Canon Authoring Conventions v0

## Authoring-convention definition
[Advisory and documentary guidance for writing JAI NEXUS canon artifacts. Applies
to model docs, templates, examples, and filled artifacts. A convention is guidance,
not a gate.]

## Artifact differentiation canon

### Model doc
[Defines a concept or canon layer. Naming: kebab-case noun phrase. Defines; does
not instantiate.]

### Template
[Blank structure instantiating a model doc's canon structure. Naming:
[concept]-template.md. Instantiates; does not extend or redefine.]

### Example
[Illustrative, non-normative. Always marked "Illustrative only." Naming:
[concept]-example.md. Illustrates; does not establish new canon.]

### Filled artifact
[Completed session output from a template. Named by artifact type (manifest,
callout, passalong). Session artifact, not canon artifact.]

## Continuity and boundary phrasing canon

### Settled canon
["X is settled through motion-XXXX." Never redefine. Cite; do not re-explain.]

### Active work
["In progress under motion-XXXX." Authorized and open. Not settled, not deferred.
Must be explicitly listed in handoff state so receiving session can identify open
items.]

### Open questions
["Open question: [text]." Named uncertainty; not a gap.]

### Deferred ideas
["Deferred to [future motion class or arc]." Register in CONTROL_THREAD if active.]

### Non-goals
[Explicit bulleted list. State what is excluded. Required in all canon artifacts.]

### Risks
["R-N — [name]: [description]. Mitigation: [mitigation]." Must have named
mitigations. Risks without mitigations should be resolved before ratification.]

### Routing targets
["Produces a routing recommendation for [mode]." Never "dispatches to [mode]."]

### Next prompts
[Exact user-facing prompt starters. Not AI instructions. Handoff artifacts.]

### No-touch boundaries
[Explicit bulleted list with specific file/directory paths. Not "all existing docs."]

### Governance boundaries
["The explicit/manual council-run boundary." Never "automatic" or "automated."]

## Cross-layer reference canon

### State scope
["This document applies to [artifact types or session types]."]

### State inheritance
["This document inherits from [prior-doc] (motion-XXXX) and does not redefine it."]

### Reference without redefining
[Cite source by path and motion. Use term as defined in source. Do not re-explain.]

### Preserve interoperability
[New canon must not contradict settled constraint class, transition class, or kit
without a new motion.]

### Cross-cutting status
["Applies across all coordination modes" rather than listing each mode individually.]

## Authoring checklist
[Thirteen-item checklist. Guidance, not a gate. Absence is not a blocking condition.]

- [ ] Artifact type identified
- [ ] Scope stated
- [ ] Prior canon inheritance cited
- [ ] Settled canon not redefined
- [ ] Non-goals listed explicitly
- [ ] Boundary rules present
- [ ] No-touch boundaries enumerated
- [ ] Template fields match model doc (if template)
- [ ] Marked "Illustrative only" with fictional refs (if example)
- [ ] Council-run boundary not phrased as automatic
- [ ] No dispatch language in non-RE artifacts
- [ ] No new constraint classes beyond v0 (unless new motion)
- [ ] No new coordination modes beyond four (unless new motion)

## Boundary rules
[Conventions do not: execute, dispatch, mutate, add runtime enforcement, override
council-run boundary, collapse role distinctions, define new canon layers.]

## Non-goals
[Automatic enforcement; linting; violation reporting; existing doc modification;
portal/runtime; new modes; new constraint classes; checklist items as blocking gates.]
```

### `.nexus/docs/templates/canon-authoring-checklist-template.md`

Template spec:

```
# Canon Authoring Checklist: [Artifact Name]

## Artifact context
- Artifact type: [model doc | template | example | filled artifact]
- Scope: [artifact types or session types this applies to]
- Motion: [motion-XXXX]
- Prior canon inheritance: [file path (motion-XXXX), or None]

## Rubric checklist

- [ ] Artifact type identified (model doc / template / example / filled artifact)
- [ ] Scope is stated
- [ ] Prior canon inheritance cited by file path and motion number
- [ ] Settled canon is not redefined in this artifact
- [ ] Non-goals are listed explicitly
- [ ] Boundary rules section is present
- [ ] No-touch boundaries are enumerated (specific paths, not "all existing docs")
- [ ] If template: fields match the model doc's canon structure
- [ ] If example: marked "Illustrative only" with fictional references
- [ ] Council-run boundary is not phrased as automatic
- [ ] No dispatch language in non-REPO_EXECUTION artifacts
- [ ] No new constraint classes beyond settled v0 catalog (unless new motion)
- [ ] No new coordination modes beyond the settled four (unless new motion)

## Notes
[Any open questions or items that could not be confirmed at time of authoring]
```

### `.nexus/docs/examples/canon-authoring-example.md`

Example spec:

```
# Canon Authoring Example

> **Illustrative only.** This document uses fictional references and placeholder
> values. It is not a governance record. It does not establish new canon.

## Example scenario
[Fictional canon addition: "JAI Fictional Layer Canon v0"]

## Fictional model doc skeleton
[A complete model doc structure for the fictional layer, using all required
sections: definition, classification, applicability, template canon, boundary
rules, non-goals. All content is placeholder.]

## Filled authoring checklist
[A completed canon-authoring-checklist-template.md for the fictional model doc,
showing which checklist items are checked and why, using placeholder references]

## Annotation layer
[Inline annotations mapping each section of the fictional model doc to the
convention it satisfies, citing canon-authoring-conventions.md §[section] for
each annotation]
```

---

## V-matrix

| Check | Criterion | Method |
|-------|-----------|--------|
| V-1 | canon-authoring-conventions.md exists | File check |
| V-2 | Convention definition present | grep "convention is guidance, not a gate" |
| V-3 | All four artifact types defined | grep "Model doc\|Template\|Example\|Filled artifact" |
| V-4 | All ten phrasing rules present (including Active work) | Check section headings |
| V-5 | Council-run phrasing rule present | grep "explicit/manual council-run" |
| V-6 | Routing phrasing rule present | grep "dispatch" (must appear negated) |
| V-7 | Cross-layer reference canon has 5 rules | Count subsection headings |
| V-8 | Authoring checklist has 13 items | Count checkbox items |
| V-9 | Rubric marked as guidance not gate | grep "guidance, not a gate" in checklist section |
| V-10 | Boundary rules section present | grep "Boundary rules" |
| V-11 | canon-authoring-checklist-template.md exists | File check |
| V-12 | Checklist template has 13 checkbox items | Count checkbox items |
| V-13 | canon-authoring-example.md exists | File check |
| V-14 | Example marked illustrative | grep "Illustrative only" |
| V-15 | Example has skeleton + checklist + annotation | Section check |
| V-16 | No existing docs modified | git diff --name-only HEAD |
| V-17 | No gate-implication language | grep "MUST\|required gate\|blocking condition\|convention enforces" |
| V-18 | validate-motion passes | gate result |
| V-19 | validate-agency passes | gate result |
| V-20 | typecheck passes | pnpm -C portal typecheck |

---

## Commit plan

**Commit 1** — Add canon-authoring-conventions.md
```
governance(motion-0147): add canon-authoring-conventions.md — JAI Canon Authoring Conventions v0

Defines authoring conventions for JAI NEXUS canon artifacts: four artifact types,
ten phrasing rules, cross-layer reference canon, thirteen-item authoring checklist.
```

**Commit 2** — Add canon-authoring-checklist-template.md + canon-authoring-example.md
```
governance(motion-0147): add canon-authoring-checklist-template and example
```

**Commit 3** — Update execution.md with implementation evidence
```
governance(motion-0147): record implementation evidence in execution.md
```

---

## PR draft

Title: `governance: ratify motion-0147 JAI Canon Authoring Conventions v0`

Body:
```
Implements motion-0147 — JAI Canon Authoring Conventions v0.

Adds:
- .nexus/docs/canon-authoring-conventions.md — authoring-convention definition,
  four artifact types, ten phrasing rules, cross-layer reference canon,
  thirteen-item authoring checklist
- .nexus/docs/templates/canon-authoring-checklist-template.md
- .nexus/docs/examples/canon-authoring-example.md

No existing docs modified. All required gates pass.
Basis: motion-0146 (JAI Governance Constraint Stack Canon v0).
```

---

## Rollback steps

1. `git revert <commit>` for each commit in the commit plan
2. Verify no existing docs were touched (V-16)
3. Motion returns to DRAFT status

---

## Defect traps

**Trap 1 — Gate-implication language**
Before ratification: grep for "MUST", "required gate", "blocking condition",
"convention enforces" across all three new files. Any match is a defect (unless
appearing in the context of "is not a blocking condition"). Conventions are
guidance; replace gate-implication language with "should", "is guidance", or "is
advisory."

**Trap 2 — Artifact types incomplete**
Check that all four artifact types (model doc, template, example, filled artifact)
are defined with naming patterns in canon-authoring-conventions.md. If any type is
missing or lacks a naming pattern, add it before ratification.

**Trap 3 — Settled canon redefinition**
Grep for defined terms from motions 0140–0146 (coordination modes, constraint
classes, transition classes, kit names) in canon-authoring-conventions.md. Any
instance that re-explains or redefines a term rather than citing its source is a
defect. Replace with a citation: "[term] is defined in [file] (motion-XXXX)."

**Trap 4 — Rubric item count**
Count checkbox items in canon-authoring-conventions.md authoring checklist section.
If not exactly 13, the checklist has drifted. Add missing items or remove extras.
Check that no item uses "MUST" or "required" language.

**Trap 5 — Cross-layer guidance phrased as prohibition**
Check the "Preserve interoperability" rule in canon-authoring-conventions.md.
If it reads as a hard prohibition ("is prohibited") rather than guidance ("must not
... without a new governed motion"), correct to guidance framing before ratification.

**Trap 6 — Existing doc modification**
Run `git diff --name-only HEAD` before the ratification commit. Any existing
`.nexus/docs/` file in the diff is a defect. Revert and verify V-16 clears.

---

## Implementation evidence

- canon-authoring-conventions.md: created at 2026-04-21T00:00:00.000Z
- canon-authoring-checklist-template.md: created at 2026-04-21T00:00:00.000Z
- canon-authoring-example.md: created at 2026-04-21T00:00:00.000Z
- Gate results: validate-motion PASS, validate-agency PASS, typecheck PASS
- Implementation confined to: .nexus/docs/canon-authoring-conventions.md,
  .nexus/docs/templates/canon-authoring-checklist-template.md,
  .nexus/docs/examples/canon-authoring-example.md,
  .nexus/motions/motion-0147/**
- No .claude/**, portal/**, package.json, or runtime/command surfaces touched
- V-matrix: all required checks pass (V-1 through V-20)
