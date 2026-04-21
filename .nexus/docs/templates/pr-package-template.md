# PR Package Template

Use this template to summarize a bounded repo-execution seam for review.

Required:

- role
- goal
- scope
- outputs
- evidence
- risk
- notes / handoff

---

## Role

- coordination mode: `{REPO_EXECUTION | CONTROL_THREAD | EXPLORATION}`
- execution role: `{ARCHITECT | BUILDER | VERIFIER | OPERATOR | LIBRARIAN}`

---

## Goal

{One sentence stating exactly what this PR accomplishes.}

---

## Scope

- `{path}` - `{new | modify | delete}`
- `{path}` - `{new | modify | delete}`

Keep the scope exact. Do not summarize with broad directory names if the touched
paths are already known.

---

## Outputs

- `{artifact or file added}`
- `{artifact or file modified}`
- `{evidence or template set produced}`

This section should state what now exists that did not exist before.

---

## Evidence

- validation commands run:
  - `{command}` -> `{result}`
  - `{command}` -> `{result}`
- observed checks:
  - `{boundary or content check}` -> `{result}`

Do not treat planned validation as observed evidence.

---

## Risk

- residual risk: `{what still might be wrong or incomplete}`
- why the risk is acceptable or what follow-up would reduce it: `{note}`

---

## Notes / handoff

- `{reviewer note}`
- `{next-session note}`
- `{explicit follow-up if any}`

Use this section for context that does not fit cleanly into goal, scope, or evidence.
