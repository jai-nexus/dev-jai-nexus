# Challenge (motion-0011)

## Risks
- File path traversal if motionId/panelId not validated.
- Production environments may not include .nexus directory.

## Mitigations
- Strict allowlist validation on motionId + panelId (safe patterns).
- Bound reads to repoRoot/.nexus/motions only.
- Friendly error UI if .nexus is missing.

## Risk score
risk_score: 0.06
