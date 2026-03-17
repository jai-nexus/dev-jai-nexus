# Challenge (motion-0047)

## Risks
- Extending the slot-resolution helper to read a second manifest file
  introduces a branching code path. If the Phase 1 file is missing or
  malformed, the Librarian panel could fail to resolve any model.
- Wiring one panel to the new manifest while leaving four on the legacy file
  creates a split-brain period where two staffing sources coexist in the
  resolution layer.
- If the resolution helper is not designed for reuse, subsequent panel wiring
  motions may duplicate logic or diverge in approach.

## Objections
- The split-brain state is intentional and bounded. It is the safest migration
  strategy: one panel at a time, validated before expanding. A big-bang
  switchover would carry higher risk.
- The resolution helper should include a fallback or clear error when the
  Phase 1 file is absent, so Librarian resolution fails visibly rather than
  silently falling back to stale data.

## Mitigations
- The resolution helper should validate that the Phase 1 file exists and
  parses cleanly before attempting slot lookup.
- The helper should be written for reuse so subsequent panels can be wired
  with minimal incremental changes.
- A simple validation script or test confirms correct Librarian resolution
  before the motion is ratified.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05
