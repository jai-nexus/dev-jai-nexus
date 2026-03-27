# Proposal - motion-0051

## Title
Differentiated-score ranking behavior proof on 2-candidate executor panels

## Why this motion exists
motion-0050 proved that the selection/scoring path behaves correctly on the
2-candidate shape with zero scores. That exercised the code path but did not
validate the weighted scoring math, total computation, or winner determination
under differentiated input. This motion closes that gap.

## What this motion proves
Nonzero differentiated breakdown scores were applied to a 2-candidate
Librarian panel. Totals were pre-calculated from the rubric weights, then
verified against actual score and select output.

## Test setup
Panel: JAI_DEV_LIBRARIAN_PANEL_V0 (scaffolded under motion-0049)
Rubric weights: fidelity 0.25, clarity 0.20, canon_alignment 0.20,
completeness 0.15, minimal_diff 0.10, risk_awareness 0.10

### SLOT_LIBRARIAN_01 breakdown
| Criterion | Score |
|-----------|-------|
| fidelity | 8 |
| clarity | 7 |
| canon_alignment | 6 |
| completeness | 7 |
| minimal_diff | 8 |
| risk_awareness | 6 |

Pre-calculated total: (8×0.25 + 7×0.20 + 6×0.20 + 7×0.15 + 8×0.10 + 6×0.10) × 10 = **70.5**

### SLOT_LIBRARIAN_02 breakdown
| Criterion | Score |
|-----------|-------|
| fidelity | 5 |
| clarity | 6 |
| canon_alignment | 4 |
| completeness | 5 |
| minimal_diff | 6 |
| risk_awareness | 5 |

Pre-calculated total: (5×0.25 + 6×0.20 + 4×0.20 + 5×0.15 + 6×0.10 + 5×0.10) × 10 = **51.0**

Expected winner: SLOT_LIBRARIAN_01 (70.5 vs 51.0)

## Behavior results

| Test | Surface | Expected | Actual | Result |
|------|---------|----------|--------|--------|
| score recompute | panel-run.mjs score | SLOT_LIBRARIAN_01: 70.5, SLOT_LIBRARIAN_02: 51.0 | SLOT_LIBRARIAN_01: 70.5, SLOT_LIBRARIAN_02: 51 | PASS |
| select ranking | panel-select.mjs --verbose | best=SLOT_LIBRARIAN_01 | best=SLOT_LIBRARIAN_01 total=70.5 | PASS |
| winner determination | panel-select.mjs | winner=SLOT_LIBRARIAN_01 | winner=SLOT_LIBRARIAN_01 | PASS |

## What this motion does not change
No files are modified. This is a pure behavior-proof motion. The differentiated
scores were applied to an existing scaffolded selection.json for testing purposes.

## What this motion does not prove
- Selector activation (selectors remain deferred)
- Live multi-agent orchestration
- Automated execution loops
- Scoring behavior on panels other than Librarian (reasonable inference from
  shared panelSelectCore.mjs, but not directly runtime-tested in this motion)

## Design stance
This motion extends the proof chain from zero-score behavior (motion-0050) to
differentiated-score ranking. It confirms that the deterministic scoring formula
produces expected results and that winner determination correctly selects the
highest-scoring candidate on the 2-candidate Phase 1 shape.

## Why now
The scoring path was previously validated only with zero scores. Before any
future motion introduces real candidate content or activates scoring workflows,
the weighted math and ranking behavior should be formally validated with
explicit differentiated input. This prevents discovering scoring defects later
under real workload conditions.
