# Challenge (motion-0015)

## Risks
- Accidental winner selection when scores are still all-zero scaffold defaults.
- File path traversal if motionId/panelId are not validated.
- Rubric/score mismatch could produce confusing totals.

## Mitigations
- Only set winner when at least one slot total is > 0 (unless `--force-winner`).
- Strict allowlist validation on motionId + panelId.
- Treat missing breakdown keys as 0; clamp scores to 0–10.

## Risk score
risk_score: 0.06
