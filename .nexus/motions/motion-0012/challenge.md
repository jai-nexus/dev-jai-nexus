# Challenge (motion-0012)

## Risks
- Unbounded filesystem scanning could leak data or slow the server.
- Production environment may not include .nexus.

## Mitigations
- Hard-bound scans to repoRoot/.nexus/motions only.
- Only read two known JSON files per panel.
- Show “no panels found” if .nexus not present.

## Risk score
risk_score: 0.05
