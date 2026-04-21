# Implementation Plan Template

Use this template after the motion package is settled and before implementation is
treated as complete.

Required:

- file/path plan
- artifact or interface shape where applicable
- acceptance-test matrix
- commit-by-commit plan
- PR checklist
- defect traps

Optional:

- output sketch when the change has a meaningful rendered or serialized shape
- internal structural or data-model notes when the seam needs them

---

## Seam framing

- motion: `{motion_id}`
- repo: `{repo}`
- branch: `{branch}`
- bounded seam: `{one-sentence seam description}`

---

## Command / interface / artifact shape

Use the subsection that matches the seam:

- command or interface shape: `{CLI, API, route, or workflow surface}`
- artifact shape: `{doc sections, schema fields, file layout, or output structure}`

If the seam is documentary only, make the artifact shape explicit and omit runtime
detail.

---

## Internal structural / data-model notes

Only include this section when the seam has an internal structure worth preserving.

- structural assumption: `{assumption}`
- naming rule: `{rule}`
- data or section model: `{fields or headings}`

If not needed, state: `No additional internal structure beyond the file plan.`

---

## File / path plan

Use one flat item per path:

- `{path}` - `{new | modify | delete}` - `{one-line purpose}`
- `{path}` - `{new | modify | delete}` - `{one-line purpose}`

Include an explicit no-touch list after the touched paths:

- no-touch: `{path or path family}`
- no-touch: `{path or path family}`

---

## Acceptance-test matrix

| ID | Artifact or boundary | Verification method | Pass condition |
|---|---|---|---|
| V-1 | `{artifact}` | `{manual check or command}` | `{what passes}` |
| V-2 | `{boundary}` | `{manual check or command}` | `{what passes}` |

Each row should be independently checkable.

---

## Commit-by-commit plan

1. `{commit message}`
   - files: `{paths}`
   - purpose: `{why this commit exists}`

2. `{commit message}`
   - files: `{paths}`
   - purpose: `{why this commit exists}`

Keep commits scoped so that rollback and review remain simple.

---

## PR checklist

- [ ] scope matches the bounded seam
- [ ] only planned paths changed
- [ ] validation commands ran
- [ ] no-touch boundaries held
- [ ] residual risks are stated
- [ ] sync-back shape is clear if the seam closes here

---

## Output sketch

Use only when helpful.

```text
{sketch of expected output, file layout, or rendered shape}
```

If not relevant, state: `No output sketch needed for this seam.`

---

## Defect traps to avoid

- trap: `{common failure mode}`
  avoid by: `{specific check or constraint}`

- trap: `{common failure mode}`
  avoid by: `{specific check or constraint}`

Examples:

- widening the seam after planning
- touching runtime surfaces by implication
- claiming verification before evidence exists
