# Decision - motion-0091

## Status
RATIFIED

## Summary
Motion `motion-0091` is ratified.

WS-E (Dispatch and Coverage Integration Spec) is complete. Two planning
artifacts are committed: `coverage-declaration.schema.yaml` defines the
post-bootstrap declaration schema with project identity, execution scope,
governance placement, agent coverage (9 agents for OffBook.ai), wave state,
and full provenance annotations on every field. `dispatch-integration.spec.md`
defines the 13-field dispatch handle surface (10 planner-owned, 3
implementation-owned), the planner/implementation boundary, integration
contract, and Wave 0 dispatch-readiness checklist. The OffBook.ai pressure
test confirms all 10 required handle fields are satisfiable from existing
WS-A through WS-D artifacts without adding new intake fields.

## Evidence
- `.nexus/planning/coverage-declaration.schema.yaml` committed at v0.1
- `.nexus/planning/dispatch-integration.spec.md` committed at v0.1
- OffBook.ai pressure test: all 10 required planner-owned handle fields satisfied
- No new intake fields required
- No runtime code created; planning-only boundary held
- `validate_motion`: PASS
- `validate_agency`: PASS
- challenge.md: no blocking objections; both challenges (declaration vs agency.yaml, freeze enforcement) resolved

## Notes
This ratification closes the final workstream of the motion-0084 planning
program. Ratified as part of the motion-0092 governance closure sweep.
