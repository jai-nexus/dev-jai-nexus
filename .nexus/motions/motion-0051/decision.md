# Decision - motion-0051

## Status
RATIFIED — unanimous consent.

## Summary
Nonzero differentiated breakdown scores produced the expected ranking and
winner determination on the tested 2-candidate Librarian panel. Pre-calculated
weighted totals matched actual output exactly. This is a pure behavior-proof
motion with no code changes.

## Evidence
| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| score recompute | SLOT_LIBRARIAN_01: 70.5, SLOT_LIBRARIAN_02: 51.0 | SLOT_LIBRARIAN_01: 70.5, SLOT_LIBRARIAN_02: 51 | PASS |
| select ranking | best=SLOT_LIBRARIAN_01 | best=SLOT_LIBRARIAN_01 total=70.5 | PASS |
| winner determination | winner=SLOT_LIBRARIAN_01 | winner=SLOT_LIBRARIAN_01 | PASS |

## Evidence calibration
- One panel (Librarian) was runtime-tested with one explicit differentiated-score distribution
- Pre-calculated expectations matched actual output exactly
- Broader panel equivalence is a supported inference from the shared panelSelectCore.mjs implementation
- Edge cases (tied totals, boundary scores, near-ties) remain untested
- Differentiated scores were temporary proof inputs, not canonical substrate changes

## What remains unproven
- Tied-total and boundary-value behavior
- Selector activation
- Live multi-agent orchestration
- Automated execution loops

## Outcome
All three required roles voted YES. No objections, no reservations.

## Phase 1 proof chain
- motion-0046: canon
- motion-0047: consumer wiring
- motion-0048: structure reconciliation
- motion-0049: scaffold proof
- motion-0050: zero-score behavior proof
- motion-0051: differentiated-score behavior proof
