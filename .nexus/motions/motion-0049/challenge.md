# Challenge (motion-0049)

## Risks
- A proof-only motion with no code changes has low inherent risk.
- The main risk is that scaffold success does not prove end-to-end panel
  behavior (scoring, selection, winner determination). It proves only that
  the structure resolves and scaffolds correctly.

## Objections
- Scaffold parity is a necessary but not sufficient proof. Future motions
  should validate scoring and selection paths on the 2-candidate shape.
- This is acceptable because motion-0049 is explicitly scoped to scaffold
  parity, not full panel lifecycle validation.

## Mitigations
- All 5 scaffolds were executed and passed before drafting.
- Scaffold exercises both `loadSlots()` overlay and `agent-panels.yaml`
  candidate resolution, which are the two surfaces changed in motions
  0047 and 0048.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
