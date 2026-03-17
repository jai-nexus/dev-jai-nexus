# Challenge (motion-0050)

## Risks
- All behavior tests used zero scores. This proves the path executes without
  error but does not prove correct ranking with differentiated nonzero scores.
- Only the Librarian panel was tested for selection behavior. Other panels
  share the same code path but were not individually exercised.
- Tiebreak behavior (alphabetical slot name) is an implementation detail that
  may not be the desired long-term policy.

## Objections
- Zero-score testing is sufficient for a shape-agnostic behavior proof. The
  scoring math (clamp 0-10, weighted sum, round to 0-100) is deterministic
  and does not depend on candidate count. Differentiated-score testing is a
  valid follow-up but not required for this proof target.
- All panels share panelSelectCore.mjs, which is shape-agnostic. Testing one
  panel proves the code path for all panels with the same structure.
- Tiebreak policy is a separate concern from shape parity.

## Mitigations
- Code inspection confirmed computeSelection has no shape assumptions.
- Three distinct behavior paths were exercised (score, select, force-winner).
- Future motions can test differentiated scores when real candidate content
  is introduced.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
