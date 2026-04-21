# Motion Package Template

Use this template to define the minimum documentary shape of a bounded motion
package before implementation begins.

Required:

- frontmatter identity
- current repo framing
- problem statement
- exact scope
- non-goals
- acceptance criteria
- likely touched paths
- risks

Optional:

- basis or prior motion linkage
- sub-line decomposition when multiple deliverables are needed

---

## Frontmatter

```markdown
# Proposal: {title}

**Motion:** {motion_id}
**Kind:** {kind}
**Program:** {program}
**Date:** YYYY-MM-DD
**Basis:** {basis or "none"}
```

---

## Current repo framing

- repo: `{repo_name}`
- branch or seam context: `{branch_or_boundary}`
- current baseline: `{what already exists and what does not}`
- why this seam belongs in the current repo: `{repo-local reason}`

---

## Problem statement

### Current baseline

{State what already exists, what has already been settled, and what remains missing.}

### Gap 1 - {gap name}

{Describe one concrete gap.}

### Gap 2 - {gap name}

{Describe the next concrete gap if applicable.}

Add or remove gap blocks as needed, but keep them bounded and legible.

---

## Exact scope

### Sub-line A - {deliverable name}

- path: `{path}`
- change: `{new | modify}`
- description: `{what will be added or changed}`

### Sub-line B - {deliverable name}

- path: `{path}`
- change: `{new | modify}`
- description: `{what will be added or changed}`

Only include sub-lines that are actually in scope for the motion.

---

## Boundary preservation

State explicitly what the motion does not authorize, especially when nearby surfaces
could be mistaken as in scope.

Example shape:

- no automation
- no portal/runtime mutation
- no `.claude/**` changes
- no `package.json` changes
- no controller behavior

---

## Acceptance criteria

Use `SC-N` format only.

- `SC-1` {artifact or behavior} exists and can be checked by {method}
- `SC-2` {artifact or behavior} remains unchanged at boundary {path or surface}
- `SC-3` {validation command} passes

Each acceptance criterion should state a real pass condition, not a vague intent.

---

## Likely touched paths

- `{path}`
- `{path}`
- `{path}`

This list should be concrete enough to support planning and no-touch checks.

---

## Risks

- Risk: {risk}
  Mitigation: {mitigation}

- Risk: {risk}
  Mitigation: {mitigation}

Keep risks specific to the seam rather than broad project concerns.

---

## Non-goals

- {explicitly out-of-scope item}
- {explicitly out-of-scope item}
- {explicitly out-of-scope item}

Non-goals should preserve seam boundaries rather than restate the full problem.
