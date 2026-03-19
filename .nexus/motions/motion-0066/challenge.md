# Challenge (motion-0066)

## Risks
- The motion could become too broad if it tries to solve Waves integration, Motion Factory promotion, and Work UI execution in one slice.
- `dev-jai-nexus` could accidentally redefine or drift from the canonical `candidate.motion` contract instead of consuming it.
- Candidate Motion could be conflated with WaveTask if the distinction is not kept explicit in data shape and UI.
- Promotion into Motion Factory could blur the boundary between prep artifacts and formal motions if lineage is not explicit.
- Agent planning output may not cleanly map to canonical Candidate Motion fields on the first pass.

## Objections
- Waves already holds plans and tasks, so Candidate Motion may seem like an unnecessary extra layer.
- Motion Factory already drafts motions, so adding a promotion layer may appear like added ceremony.
- The project may gain more immediate value from stronger executor power than from more planning structure.
- It may be too early to consume Candidate Motion broadly before all downstream repos agree on usage patterns.

## Mitigations
- Keep the motion tightly bounded to Candidate Motion consumption and promotion only.
- Treat `candidate.motion` as an upstream canonical contract and avoid local semantic drift.
- Keep WaveTask and Candidate Motion distinct:
  - WaveTask remains work-oriented
  - Candidate Motion remains governance/preparation-oriented
- Require explicit lineage fields for candidate-to-motion promotion.
- Defer broad Work UI integration and execution autonomy to later motions.
- Start with a narrow agent-planning mapping that can be extended later.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.09
