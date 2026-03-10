# Challenge (motion-0023)

## Risks
- Status logic drift if multiple pages implement “completion” differently.
- Back-compat issues if older motions have malformed selection records.

## Mitigations
- Centralize the logic in a shared helper (panelProgress.ts).
- Treat malformed/missing selection fields as INVALID with an explicit reason.
- Keep COMPLETE definition identical to current semantics: winner != UNKNOWN AND evidence commands > 0.

## Risk score
risk_score: 0.06
