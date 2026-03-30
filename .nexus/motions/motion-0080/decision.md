# Decision - motion-0080

## Status
RATIFIED

## Summary
Motion `motion-0080` is ratified.

The operator motion state surface is accepted as a bounded WS-3 phase-1 implementation:
- `portal/src/app/operator/work/[id]/page.tsx` modified to add "Governing Motion" section
- Section renders motionId, title, council decision chip, handoff chip, receipt chip
- For packet 880 / motion-0070: shows RATIFIED, ISSUED, pending correctly
- Non-motion-linked packets show no change

## Evidence
- Commit `950dc0d feat(loop): surface governing motion state in operator work view (#39)`
- Governing Motion section visible at `/operator/work/880`
- `pnpm -C portal typecheck` PASS

## Notes
Closes WS-3. Operator surface shows governed loop state without manual .nexus/ inspection.
