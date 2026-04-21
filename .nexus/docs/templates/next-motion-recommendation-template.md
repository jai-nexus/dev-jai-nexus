# Next Motion Recommendation Template

Use this template when an orchestrator session needs to frame the recommended
shape of the next motion without creating or ratifying it.

Required:

- recommended motion title
- subtitle
- exact scope
- non-goals
- risks
- likely touched paths
- recommended branch
- recommended motion id

This template is advisory. The motion id and branch are recommendations only; they
do not allocate an id or create a branch automatically.

---

## Recommended motion

Required:

- recommended motion title: `{title}`
- subtitle: `{short clarifying subtitle}`
- recommended motion id: `{motion-XXXX or next-available placeholder}`
- kind: `{builder-proof | librarian-proof | operator-proof | other}`
- program: `{program}`
- basis: `{what settled motion or canon enables this}`

---

## Exact scope

Required:

- bounded seam statement: `{one sentence describing the exact seam}`
- included deliverables:
  - `{path or artifact}`
  - `{path or artifact}`

Optional:

- explicit sub-lines when the seam has multiple bounded deliverables

Keep the scope narrow enough to support one receiving repo thread.

---

## Non-goals

Required:

- `{explicitly excluded item}`
- `{explicitly excluded item}`
- `{explicitly excluded item}`

Non-goals should preserve boundary, not restate the whole problem.

---

## Risks

Required:

- Risk: `{risk}`
  Mitigation: `{mitigation}`

- Risk: `{risk}`
  Mitigation: `{mitigation}`

---

## Likely touched paths

Required:

- new files:
  - `{path}` - `{purpose}`
- modified files:
  - `{path}` - `{change description}`
- explicitly excluded paths:
  - `{path}`
  - `{path}`

If there are no modified files or no new files, state that explicitly.

---

## Recommended branch

Required:

- recommended branch: `{branch-name}`

Keep the name advisory and repo-local. Do not imply creation.
