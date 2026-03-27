# Challenge (motion-0059)

## Risks
- Proof-only motions carry low inherent risk.
- The main risk is that provider-specific API differences could cause
  subtle output formatting issues that are not caught by success/fail
  testing alone. For example, one provider might return slightly
  different markdown structure that technically passes but looks wrong.
- API availability is not guaranteed. If either provider is temporarily
  unavailable during execution, that test cannot be completed.

## Objections
- Output formatting differences are caught by human review, which is
  required before ratification. The proof target is functional parity
  (commands succeed, files are written, boundaries preserved), not
  output-quality equivalence or identical prose.
- API availability issues are noted in the execution record. If a
  provider is unavailable, that test is marked as deferred rather than
  falsely recorded as passing.

## Mitigations
- All proof evidence is recorded in proposal.md before ratification.
- Human review of generated content is still required.
- Provider unavailability is recorded honestly, not hidden.
- Functional parity is explicitly distinguished from output-quality
  equivalence.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
