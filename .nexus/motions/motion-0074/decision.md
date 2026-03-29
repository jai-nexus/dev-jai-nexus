# Decision - motion-0074

## Status
DRAFT

## Summary
Motion `motion-0074` is a DRAFT bounded operator-authorized proof slice.

WS-1 phase 3 happy-path proof is complete.

## Proof candidate
`motion-0070` - "bounded council policy seam extraction"

Candidate selection rationale:
- RATIFIED with full artifact coverage (`verify.json`, `execution.md`, `decision.yaml`)
- No pre-existing handoff (clean starting state)
- Does not involve Motion Factory (out of scope per program constraints)
- Does not involve handoff/receipt semantics themselves (avoids circularity)
- Smallest, most bounded available candidate

## Evidence
- `node --check portal/scripts/activate-motion.mjs` PASS
- `pnpm -C portal typecheck` PASS
- `node portal/scripts/issue-execution-handoff.mjs --motion motion-0070` PASS
- `node portal/scripts/activate-motion.mjs --motion motion-0070` PASS
  - exit 0
  - all 7 activation checks passed
  - activation tag: `motion:motion-0070`
- `node portal/scripts/activate-motion.mjs --motion motion-0070 --create` PASS
  - exit 0
  - WorkPacket ID: `880`
  - WorkPacket nhId: `motion-0070`
  - InboxItem ID: `9`
  - Tags: `["motion:motion-0070", "route:ARCHITECT"]`
  - Status: `DRAFT / QUEUED`
- second `node portal/scripts/activate-motion.mjs --motion motion-0070 --create` refused as expected
  - exit 1
  - existing inbox item ID: `9`
  - existing work packet ID: `880`

## Pre-proof fix
`portal/scripts/activate-motion.mjs` required a minimal fix to use the PrismaPg adapter for Prisma v7. Only the `runCreate` function changed. The dry-run path is unchanged.

## Notes
Proof executed on 2026-03-29 against the dev environment.
WorkPacket `880` and InboxItem `9` are live in the system tagged with `motion:motion-0070` and can be canceled via the operator work surface when no longer needed.
