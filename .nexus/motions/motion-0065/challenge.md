# Challenge (motion-0065)

## Risks
- Status output changes could break expectations for anyone informally relying on current wording or field interpretation.
- More explicit inventory reporting could look like a regression to operators who are used to reading a single total.
- If human-readable and JSON-readable output are not both driven from the same snapshot builder, drift could reappear after future edits.
- Additive status fields may create mild churn for downstream consumers if they assume the old presentation is the only supported shape.

## Objections
- This may seem like polish work rather than a meaningful workflow improvement.
- Missing motion ids may reflect intentional local state, so surfacing them could add noise when gaps do appear.
- Renaming or splitting status fields may create churn for operators who are used to the current output.
- Status already works well enough for local use, so the benefit may appear smaller than adding another end-user command improvement.

## Mitigations
- Keep the motion tightly scoped to status trust and inventory accuracy only.
- Preserve existing command semantics and avoid changing draft, revise, or evidence behavior.
- Prefer additive clarification over disruptive redesign in both terminal and JSON output.
- Treat missing ids as explicit inventory facts, not validation failures, unless a later motion chooses stronger enforcement.
- Use a shared status snapshot so terminal and JSON views cannot drift independently.
- Preserve `total_motions` as a backward-compatible field while adding explicit inventory detail.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.08
