# Sync-Back Template

Use this template as the session-internal completion record for a bounded
repo-execution seam.

This artifact is distinct from a passalong even when the structures overlap.

- sync-back: records the session's completion state and routing readiness
- passalong: handoff artifact for a later receiving session

Not every sync-back becomes a passalong. The sync-back should still stand on its own
as a completion structure.

---

## Current baseline

- repo: `{repo}`
- branch: `{branch}`
- last commit or working-tree state: `{state}`
- active motion: `{motion_id}`
- governance status: `{DRAFT | RATIFIED | other}`

---

## What is settled

- `{settled fact}`
- `{settled fact}`
- `{artifact that landed}`

Only include items that are actually stable as of this session.

---

## What remains open

- `{open item}`
- `{deferred item}`
- `{follow-up seam}`

This section should preserve what is unfinished without collapsing it into tasks.

---

## Tasks

- [ ] `{next task}`
- [ ] `{next task}`

Use tasks for discrete next actions only.

---

## Risks

- Risk: `{risk}`
  Mitigation: `{mitigation}`

- Risk: `{risk}`
  Mitigation: `{mitigation}`

---

## Routing targets

- `CONTROL_THREAD` - `{when the seam should be folded back into continuity}`
- `ORCHESTRATOR` - `{when next bounded routing is needed}`
- `REPO_EXECUTION` - `{when local work remains active}`
- `EXPLORATION` - `{when ambiguity still blocks bounded work}`

Choose only the targets that actually apply to the seam.

---

## Next chat prompts

- `{prompt starter}`
- `{prompt starter}`
- `{prompt starter}`

Prompt starters should be usable by the next session without extra framing.

---

## Distinction from passalong

If a passalong is also needed, state that explicitly:

- sync-back records completion state inside the session
- passalong is authored afterward for a receiving session

Do not treat the existence of a sync-back as proof that handoff already occurred.
