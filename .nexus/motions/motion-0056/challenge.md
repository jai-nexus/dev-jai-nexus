# Challenge (motion-0056)

## Risks
- The placeholder-first workflow rule is a convention, not an enforcement
  mechanism. There is nothing preventing a human from manually creating
  motion files without the factory.
- If the factory generates low-quality scaffolds, the placeholder-first
  convention could slow the operator down rather than speed them up.
- Self-referential proof (the factory authors its own proof motion) could
  be seen as circular — the quality of this motion is both the test and
  the evidence.

## Objections
- Convention-level rules are appropriate for operator workflow. Enforcement
  would require validation gates that reject non-factory-created motions,
  which is overdesign for v0. The convention is sufficient and explicitly
  stated as non-enforced.
- Factory scaffold quality has been tested in motions 0053 and 0054. If
  quality degrades, the human review step catches it before ratification.
  The convention does not bypass review.
- Self-referential proof is acceptable because the motion is human-reviewed
  at every step. The factory assists drafting; the human governs quality.
  The proof target is the workflow execution trail, not the narrative
  quality of any single generated file.

## Mitigations
- The placeholder-first rule is stated as a convention, not a gate.
- Human review remains the governance boundary at every step.
- The full-cycle proof table in the proposal is a template that must be
  completed with real outcomes before ratification.
- The proof is auditable: each workflow step is recorded with its command
  and outcome.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
