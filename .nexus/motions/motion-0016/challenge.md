# Challenge (motion-0016)

## Risks
- UI write actions could introduce unsafe file access.
- Divergence between CLI and UI scoring rules.
- Coverage signal could become “vanity metric” if definition is too loose.

## Mitigations
- Reuse the same scorer library in both CLI and UI.
- Strict id validation for motionId/panelId and bounded repo-root discovery.
- Completion definition requires both a non-UNKNOWN winner and a non-empty evidence plan.

risk_score: 0.09
