# Challenge (motion-0068)

## Risks
- Promotion mutates an existing candidate artifact (status field update),
  which is the first write-back to candidates.
- Candidate write-back can fail after formal draft + promotion.json are
  created, leaving the candidate in an inconsistent state (emitted but
  actually promoted).
- If the candidate artifact is manually edited between emission and
  promotion, the promotion path may encounter unexpected content.
- Adding a promote command expands the factory's command surface from 5
  to 6 commands.
- promotion.json adds a 10th file to the formal motion directory for
  promoted motions.

## Objections
- The candidate mutation is bounded to two fields (status, targetMotionId).
  It is not a lifecycle engine.
- Candidate write-back failure is explicitly handled: promotion.json is
  the source of truth, and a reconciliation warning is surfaced. The
  motion does not overclaim full atomicity.
- Manual edits to candidate artifacts are the operator's responsibility.
  Promote reads the current state and validates it.
- The 6th command is justified: promote is a distinct action from draft.
  Overloading draft with --from-candidate would mix creation and promotion
  semantics.
- promotion.json is clearly documented as a lineage record, not a
  governance file. It is optional (only present for promoted motions).

## Mitigations
- Candidate mutation is bounded to two fields only.
- Promote validates candidate status before acting.
- Already-promoted candidates produce a clear error.
- promotion.json is the durable source of truth.
- Candidate write-back failure surfaces a reconciliation warning.
- Preview mode shows everything without writing or updating.
- Write order: formal motion + promotion.json first, candidate update last.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05
