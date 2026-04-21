# Verification Pack Template

Use this template to record how a bounded seam will be checked before ratification
or handoff.

Required:

- validation commands
- expected evidence
- no-touch boundary checks
- regression checks
- no-mutation checks where relevant

---

## Validation commands

List only the commands that actually apply to the seam.

```text
{command}
{command}
{command}
```

For each command, note the expected outcome:

- `{command}` -> exit 0 / PASS

---

## Expected evidence

Describe what evidence each deliverable should produce.

- `{path}` -> exists, contains `{section or field}`, and matches the planned seam
- `{path}` -> remains unchanged if it is a boundary artifact

When relevant, separate evidence by artifact type:

- content evidence
- schema evidence
- validation evidence

---

## No-touch boundaries

Use a direct worktree check:

```text
git status --short -- {planned_paths_and_boundaries}
```

Pass condition:

- only planned paths appear as changed
- forbidden surfaces do not appear

---

## Regression checks

Record checks that confirm adjacent unchanged surfaces were not disturbed.

- `{path or surface}` -> `{check}`
- `{path or surface}` -> `{check}`

Examples:

- unchanged doc remains untouched
- existing template family remains readable
- adjacent governance artifact remains in prior state

---

## No-mutation checks

Use this section whenever the seam must preserve state.

- governance state check: `{motion.yaml or decision.yaml expectation}`
- runtime mutation check: `{state that no runtime surface changed}`
- repo mutation boundary: `{state that no out-of-scope path changed}`

Example pass conditions:

- `motion.yaml` remains `status: open`
- `decision.yaml` remains `status: DRAFT`
- no portal or package surface files changed

---

## Observed results

Fill this section after verification runs:

- `{command}` -> `{observed result}`
- `{boundary check}` -> `{observed result}`

Do not record guessed results. Use observed outcomes only.
