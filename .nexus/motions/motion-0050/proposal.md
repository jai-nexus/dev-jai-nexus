# Proposal - motion-0050

## Title
Phase 1 selection/scoring behavior proof on 2-candidate executor panels

## Why this motion exists
motion-0049 proved that all 5 executor panels scaffold cleanly on the
2-candidate Phase 1 shape. But scaffold only proves structure — it does not
exercise the scoring or selection path. This motion proves the next behavioral
layer: does the existing selection/scoring logic work correctly on 2-candidate
panels?

## What this motion proves
Three behavior paths were validated on the Librarian panel (2-candidate shape):

### panel-run.mjs score
- Recomputes totals from breakdown scores
- Reports both slots correctly
- No errors on 2-candidate panel

### panel-select.mjs (dry-run, zero scores)
- Processes both candidate slots (slots=2)
- Correctly returns winner=UNKNOWN when all scores are zero
- No errors

### panel-select.mjs (--force-winner, zero scores)
- Picks SLOT_LIBRARIAN_01 via alphabetical tiebreak
- Winner determination operates correctly on 2 candidates

### panelSelectCore.mjs code inspection
- computeSelection iterates Object.keys(scores) dynamically
- No hardcoded candidate count, no _03/_04/_05 references
- Scoring, total computation, and sorting are fully shape-agnostic
- The function operates identically on 2 candidates as on 5

## Behavior results

| Test | Surface | Input | Result |
|------|---------|-------|--------|
| score recompute | panel-run.mjs score | Librarian, 2 candidates, all zeros | PASS — totals consistent |
| select dry-run | panel-select.mjs | Librarian, 2 candidates, all zeros | PASS — slots=2, winner=UNKNOWN |
| select force-winner | panel-select.mjs --force-winner | Librarian, 2 candidates, all zeros | PASS — winner=SLOT_LIBRARIAN_01 (tiebreak) |
| code inspection | panelSelectCore.mjs | computeSelection | PASS — shape-agnostic |

## What this motion does not change
No files are modified. This is a pure behavior-proof motion.

## What this motion does not prove
- Selector activation (selectors remain deferred)
- Live multi-agent orchestration
- Automated execution loops
- Nonzero-score ranking with differentiated breakdowns (provable in a future motion with real candidate content)

## Design stance
This motion extends the proof chain from scaffold parity (motion-0049) to
selection/scoring behavior. It confirms that the existing selection path is
shape-agnostic and operates correctly on the Phase 1 2-candidate panel shape
without any code changes.

## Why now
The scaffold substrate is proven. Before any future motion introduces real
candidate content or activates scoring workflows, the selection path itself
should be formally validated on the current panel shape. This prevents
discovering behavioral defects later under more complex conditions.
