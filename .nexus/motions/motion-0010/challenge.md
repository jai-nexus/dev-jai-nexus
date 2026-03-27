# Challenge (motion-0010)

## Risks
- Adds conceptual complexity (panels, slots, selectors) before full automation exists.
- Selection could become biased or hand-wavy if rubric is vague.
- Model slot drift could cause changes without traceability.

## Mitigations
- Rubric weights must be explicit and stable.
- Selection records must be required when panels are actually executed (future motion).
- Slots are versioned and changes to slot mappings become normal motions.

## Risk score
risk_score: 0.08
