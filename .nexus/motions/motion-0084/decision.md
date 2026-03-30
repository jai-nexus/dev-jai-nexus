# Decision - motion-0084

## Status
RATIFIED

## Summary
Motion `motion-0084` is ratified.

The Q3 bootstrap and agency planning program is complete. All five workstreams
(WS-A through WS-E) are closed, all seven child motions (motion-0085 through
motion-0091) are individually ratified, and all success criteria from the
motion-0084 umbrella are met.

## Child motions

| WS | Motion | Deliverable | Status |
|---|---|---|---|
| WS-A | motion-0085 | project-intake.schema.yaml v0.1 | RATIFIED |
| WS-B | motion-0086 | agent-demand-matrix.schema.yaml v0.1 | RATIFIED |
| WS-C | motion-0087 | topology-plan.schema.yaml + wave-model.schema.yaml | RATIFIED |
| WS-D spec | motion-0088 | bootstrap-manifest.schema.yaml + bootstrap-generator.spec.md | RATIFIED |
| WS-D impl | motion-0089 | portal/scripts/generate-bootstrap.mjs + bootstrap:gen command | RATIFIED |
| WS-D proof | motion-0090 | real-write proof 12/12, idempotency confirmed, minimal fix applied | RATIFIED |
| WS-E | motion-0091 | coverage-declaration.schema.yaml + dispatch-integration.spec.md | RATIFIED |

## Success criteria status

- project-intake.schema.yaml v0.1 committed and usable ✓
- agent-demand-matrix.schema.yaml v0.1 committed with OffBook.ai example ✓
- wave-model.schema.yaml v0.1 committed with wave sequence and proof-gating ✓
- bootstrap-manifest.schema.yaml v0.1 committed with Wave 0 artifact list ✓
- OffBook.ai intake example fully representable in WS-A schema ✓
- WS-A through WS-C artifacts sufficient to plan a new project ✓
- Generator validated by real-write proof against OffBook.ai ✓
- Coverage declaration and dispatch handle surface defined ✓

## Evidence
- motion-0085 through motion-0091: all RATIFIED
- `.nexus/planning/`: 9 planning artifacts committed (schemas + specs + example)
- `portal/scripts/generate-bootstrap.mjs`: committed and real-write proven
- `validate_motion`: PASS
- `validate_agency`: PASS

## Notes
Closes the Q3 bootstrap and agency planning program. The branch
q4/bootstrap-agency-planning presents a clean, fully closed governance
baseline. The next program begins from this foundation.
