# Execution: bounded loop coherence gate

**Motion:** motion-0082
**Date:** 2026-03-30

## Implementation surface

Single file changed: `portal/src/app/operator/work/[id]/page.tsx`

## Changes applied

### Additions

- `LoopCoherenceVerdict` type: `"COHERENT" | "PROGRESSING" | "INCOHERENT" | "NOT_GOVERNED"`
- `LoopCoherenceState` type: `{ verdict: LoopCoherenceVerdict; reasons: string[] }`
- `computeLoopCoherence({ governingMotion, architectPresent, builderPresent,
  verifierPresent, operatorDecisionKind })` — inline function added before
  `writeReceiptArtifact`. No new DB queries. No new file reads.
- `const loopCoherence = computeLoopCoherence(...)` — called in page body
  after all evidence variables are set, before `return (`.
- Coherence row added at bottom of existing Governing Motion JSX section:
  verdict chip + reasons text.

### Coherence logic

```
if no governingMotion           → NOT_GOVERNED
if decisionStatus ≠ RATIFIED   → INCOHERENT  (+ reason)
if handoffStatus ≠ ISSUED      → INCOHERENT  (+ reason)
if any execution evidence missing → PROGRESSING (+ reasons for each)
if WORK_APPROVED absent        → PROGRESSING  (+ reason)
if receiptStatus ≠ COMPLETED   → PROGRESSING  (+ reason)
else                           → COHERENT
```

### Verdict chip colors

| Verdict      | Chip style                              |
|--------------|-----------------------------------------|
| COHERENT     | emerald (bg-emerald-900/50 text-emerald-200) |
| PROGRESSING  | sky (bg-sky-900/50 text-sky-200)        |
| INCOHERENT   | amber (bg-amber-900/40 text-amber-200)  |
| NOT_GOVERNED | slate (bg-zinc-900 text-gray-400)       |

## Fallback behavior

| Condition                             | Behavior                                     |
|---------------------------------------|----------------------------------------------|
| No motion tag (governingMotion = null) | Coherence row not rendered                  |
| decisionStatus null (file absent)     | Treated as ≠ RATIFIED → INCOHERENT          |
| handoffStatus null (file absent)      | Treated as ≠ ISSUED → INCOHERENT            |
| Any execution evidence absent         | PROGRESSING with specific reason             |
| All evidence present, receipt null    | PROGRESSING ("Receipt is not COMPLETED")     |
| Non-motion-linked packet              | Entire coherence row absent                  |

## Validation

```
pnpm -C portal typecheck
```
Result: pass, 0 errors

## Proof path

Navigate to `/operator/work/880` (or the actual ID for the motion-0070 packet).

The "Governing Motion" section now shows a coherence row at the bottom:
- verdict: COHERENT (emerald chip)
- reasons: "All governed conditions met: RATIFIED → ISSUED → executed →
  approved → COMPLETED."

This confirms packet 880 / motion-0070 is the first fully coherent loop
closure in dev-jai-nexus.
