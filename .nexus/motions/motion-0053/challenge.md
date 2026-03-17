# Challenge (motion-0053)

## Risks
- The placeholder narrative files are intentionally incomplete. A human might
  attempt to run council:run on an unfinished scaffold and encounter confusing
  validation failures.
- The motion.yaml template uses intent directly as the title, which may
  produce verbose or imprecise titles that need manual editing.
- Without overwrite behavior, a failed or abandoned scaffold requires manual
  directory deletion before the factory can reuse that motion ID.

## Objections
- Placeholder files include explicit "Draft scaffold" markers that are
  visually distinct from completed content. The stdout reminder also warns
  that narrative completion is required before ratification. Between these
  two signals, the risk of accidentally ratifying an unfinished scaffold is
  low.
- Intent-as-title is a reasonable v0 default. The human can edit the title
  before ratification. Title refinement is a natural part of review.
- Manual directory cleanup for abandoned scaffolds is acceptable in v0. The
  factory is a drafting tool, not a lifecycle manager. Overwrite behavior
  can be added in a later revision-oriented motion if justified.

## Mitigations
- Explicit "Draft scaffold — pending" markers in all narrative sections.
- Stdout reminder printed after every draft run.
- No API call means no risk of hallucinated content in the scaffold.
- Refusing to overwrite prevents accidental loss of in-progress work.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05
