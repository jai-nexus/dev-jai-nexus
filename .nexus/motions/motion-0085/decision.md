# Decision - motion-0085

## Status
RATIFIED

## Summary
Motion `motion-0085` is ratified.

WS-A (Project Intake Canon) is complete. `project-intake.schema.yaml` v0.1
is committed with field classification annotations, the `project_type` field
(greenfield | migration | extension), invariant/derived fields removed, and
a `derived_fields` section documenting WS-C outputs. The OffBook.ai example
object is fully representable in the schema.

## Evidence
- `.nexus/planning/project-intake.schema.yaml` committed at v0.1
- `.nexus/planning/offbook-ai-intake-example.yaml` satisfies schema
- `validate_motion`: PASS
- `validate_agency`: PASS
- challenge.md: no blocking objections; both challenges resolved

## Notes
Ratified as part of the motion-0092 governance closure sweep.
