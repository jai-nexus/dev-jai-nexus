# Challenge (motion-0052)

## Risks
- Adding a new script introduces a maintenance surface. If the factory
  is abandoned, the script becomes dead code.
- The context summary could drift from actual governance state if the
  factory reads stale or incomplete surfaces.
- The script reads YAML files without schema validation, so malformed
  config could produce confusing output.

## Objections
- The script is one file with one command. If abandoned, cleanup is
  trivial (delete one file). The maintenance cost is minimal.
- Context drift is mitigated by reading the canonical .nexus/ surfaces
  directly. If those surfaces change, the factory reads the new state.
- YAML parse errors should produce clear error messages, not silent
  failures. The script should use the same safeYamlLoad pattern from
  panel-run.mjs.

## Mitigations
- One script, one command, no config family — minimal blast radius.
- Reads only from .nexus/ and git state — no external dependencies.
- Writes nothing — cannot corrupt repo state.
- Clear error handling for missing or malformed files.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05
