# Decision - motion-0072

## Status
DRAFT

## Summary
Motion `motion-0072` proposes the first governed bridge between the
motion loop and the execution loop for `dev-jai-nexus` (WS-1 of
motion-0071).

This slice adds:
- `buildMotionTag` and `getMotionFromTags` helpers to `workPacketContract.ts`,
  establishing the canonical `motion:motion-XXXX` tag convention
- `activate-motion.mjs`, a dry-run activation script that reads a
  RATIFIED motion's artifacts and outputs the exact activation intent
  for a motion-linked work packet without performing any database writes

No schema migration. No live DB writes. No agent runtime changes.

## Required gates
- validate_motion
- validate_agency

## Notes
Pending vote and validation.
