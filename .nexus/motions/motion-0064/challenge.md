# Challenge (motion-0064)

## Risks
- Draft preview generates 9 files of output, which can be large —
  especially with API-backed narrative generation.
- Preview uses a provisional motion ID that is not reserved. If another
  motion is created between preview and apply, the ID will differ.
- API cost: preview calls the provider API for narrative generation,
  and a subsequent normal draft calls it again.

## Objections
- Large output is navigable via clear per-file markers. Operators can
  pipe to a file or pager. Placeholder preview (--no-api) is short.
- The provisional ID limitation is explicitly documented in the preview
  output itself ("provisional and not reserved"). Operators who need
  ID certainty should run normal draft directly.
- API cost doubling is bounded and optional. For routine motions,
  operators can skip preview. For high-stakes motions, the extra
  cost is worthwhile. --no-api preview is free.

## Mitigations
- Preview is optional (--preview flag, not default).
- Clear per-file markers make output navigable.
- --no-api preview is free and produces short output.
- Preview explicitly labeled as proposed-only.
- Provisional motion ID caveat printed in preview output.
- No directory created, no files written under any path.
- Preview failure reported as failed generation, not partial creation.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
