# Challenge (motion-0020)

## Risks
- Model names could change over time; this is an initial baseline.
- Over-committing to a single provider could limit experimentation.

## Mitigations
- Slot indirection is the intended abstraction: we can swap models later without changing panel IDs or motion structure.
- This motion is OpenAI-only by intent; a later motion can introduce multi-provider mixes and budgeting rules.

risk_score: 0.06
