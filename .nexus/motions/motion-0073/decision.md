# Decision - motion-0073

## Status
DRAFT

## Summary
Motion `motion-0073` proposes WS-1 phase 2 of the Q2 loop activation
program (parent: motion-0071). It extends the dry-run bridge established
in `motion-0072` (phase 1) into a real, bounded creation path.

This slice adds `--create` mode to `activate-motion.mjs`:
- Creates a WorkPacket and AgentInboxItem in the database when all
  activatability preconditions hold
- Refuses duplicate creation idempotently via the motion tag
- Carries the canonical `motion:<motionId>` and `route:ARCHITECT` tags
- No schema migration, no runtime changes, no operator UI changes

## Required gates
- validate_motion
- validate_agency

## Notes
Pending vote and validation.
