# Challenge (motion-0055)

## Risks
- Revision could silently lose important content from the previous draft
  if the model fails to preserve key sections during regeneration.
- Allowing motion.yaml narrative revision could inadvertently alter fields
  that border on structural (e.g., proposal list items that map to
  execution plan scope).
- Repeated revision cycles could produce content drift where the narrative
  diverges further from the original intent with each pass.

## Objections
- Content loss is mitigated by the human review step. The human can diff
  the revision against the previous draft before committing. Git history
  also preserves prior versions.
- motion.yaml revision is opt-in via --files, not default. When selected,
  only narrative fields are revised; structural fields (motion_id, status,
  created_at, owner, target, vote config) are preserved by the script.
- Content drift is bounded because each revision requires explicit human
  notes. The model revises against stated notes, not autonomously.

## Mitigations
- Default scope is narrow: only proposal.md, challenge.md, execution.md.
- motion.yaml revision is opt-in and preserves structural fields.
- Structural governance files are never revised.
- API failure leaves existing files untouched.
- stdout prints exactly which files were revised.
- Human review before council:run remains the governance boundary.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.10
