# Execution: bounded operator motion state surface

**Motion:** motion-0080
**Date:** 2026-03-30

## Implementation surface

Single file changed: `portal/src/app/operator/work/[id]/page.tsx`

## Changes applied

### Additions

- `import fs from "node:fs"` and `import path from "node:path"`
- `getMotionFromTags` added to the existing workPacketContract import
- `findRepoRoot(startDir: string): string | null` — identical to runtime pattern
- `GoverningMotionState` type:
  ```typescript
  { motionId: string; title: string | null; decisionStatus: string | null;
    handoffStatus: string | null; receiptStatus: string | null }
  ```
- `loadGoverningMotionState(inboxTags: string[]): GoverningMotionState | null`
  - reads motion.yaml (title, regex), decision.yaml (status, regex),
    execution.handoff.json (status, JSON), execution.receipt.json (status, JSON)
  - all reads try/catch; null for missing/unreadable fields
  - returns null if no motion tag or repo root not found
- `const governingMotion = loadGoverningMotionState(inboxTags)` in page body
- "Governing Motion" JSX section inserted after `</header>`, before eligibility
  mismatch banner, rendered only when `governingMotion` is non-null

### Governing Motion section fields

| Field            | Source                          | Display                          |
|------------------|---------------------------------|----------------------------------|
| motion           | getMotionFromTags               | sky mono text                    |
| title            | motion.yaml title               | plain gray-200 text              |
| council decision | decision.yaml status            | emerald=RATIFIED, amber=other, slate=— |
| handoff          | execution.handoff.json status   | sky=ISSUED, amber=other, slate=— |
| receipt          | execution.receipt.json status   | emerald=COMPLETED, amber=other, slate=pending |

## Fallback behavior

| Condition                           | Behavior                          |
|-------------------------------------|-----------------------------------|
| No motion tag in inbox tags         | Section not rendered              |
| Repo root not found                 | All fields null → shown as —/pending |
| motion.yaml missing/unreadable      | title = null → "—"               |
| decision.yaml missing/unreadable    | decisionStatus = null → "—"      |
| execution.handoff.json absent       | handoffStatus = null → "—"       |
| execution.receipt.json absent       | receiptStatus = null → "pending" |
| Non-motion-linked packet            | Entire section absent, page unchanged |

## Validation

```
pnpm -C portal typecheck
```
Result: pass, 0 errors

## Proof path

Navigate to `/operator/work/880` (or the actual ID for the motion-0070 packet).
The "Governing Motion" section renders with:
- motion: `motion-0070`
- title: `(title from motion-0070/motion.yaml)`
- council decision: RATIFIED (emerald)
- handoff: ISSUED (sky)
- receipt: pending (slate)
