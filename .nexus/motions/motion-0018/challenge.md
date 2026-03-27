# Challenge (motion-0018)

## Risks
- Adds many new “UNKNOWN” slots which could be mistaken for configured models.
- Panel/rubric drift across roles could become messy.

## Mitigations
- Slots remain explicitly UNKNOWN until bound by operators.
- Manifest-gated panel IDs prevent ad-hoc panel proliferation.
- Rubrics are role-specific but still enforce weight-sum=1.00 validation.

risk_score: 0.08
