# Challenge (motion-0061)

## Risks
- Adding another command increases the code surface marginally.
- The status command could become a maintenance burden if new commands
  or providers are added without updating the status output.
- Operators might confuse status with context, since both print
  information without writing files.
- Operators might interpret "key present" as "provider is ready to use,"
  which is not guaranteed.

## Objections
- The code surface increase is minimal: one function that reads existing
  state and prints to stdout. No API calls, no file writes, no new
  dependencies.
- Status output is hardcoded for v0 commands and providers. Future motions
  that add commands should update the status output as part of their scope.
- Status and context serve different purposes: status reports factory
  configuration (what the factory is, what is available), context reports
  repo-specific motion state for a given intent (what the factory sees).
  The distinction is clear in the output and documented in the proposal.
- Key presence is explicitly documented as environmental only, with a
  caveat printed in the status output itself. The command does not claim
  provider health or readiness.

## Mitigations
- The command has no side effects.
- Output is concise and structured.
- --json provides a stable machine-readable surface.
- Key values are never printed, only presence.
- Key presence caveat is printed inline in the status output.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
