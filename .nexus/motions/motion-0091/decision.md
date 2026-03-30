# Decision: Bounded Dispatch and Coverage Integration Spec v0

**Motion:** motion-0091
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0091` is a DRAFT WS-E spec motion under the Q3 bootstrap
and agency planning program (motion-0084).

## Scope

- Created `.nexus/planning/coverage-declaration.schema.yaml`: post-bootstrap
  declaration schema covering project identity, execution scope, governance
  placement, agent coverage, and wave state; full provenance annotations;
  OffBook.ai example with 9-agent roster and Wave 0 proof gates
- Created `.nexus/planning/dispatch-integration.spec.md`: dispatch handle
  surface definition, planner/implementation boundary, integration contract,
  Wave 0 dispatch-readiness checklist, OffBook.ai pressure test

## Proof results

- OffBook.ai pressure test: all 10 required planner-owned dispatch handle
  fields satisfiable from WS-A through WS-D artifacts ✓
- No new intake fields required ✓
- All field references consistent with WS-A through WS-D schemas ✓
- No runtime code created; planning-only boundary held ✓
- Challenge review: 2 objections raised and resolved ✓

## Program completion

With WS-E ratified, the motion-0084 bootstrap and agency planning program
is complete:

| WS | Motion | Artifact(s) |
|---|---|---|
| WS-A | motion-0085 | project-intake.schema.yaml (refined) |
| WS-B | motion-0086 | agent-demand-matrix.schema.yaml (refined) |
| WS-C | motion-0087 | topology-plan.schema.yaml, wave-model.schema.yaml |
| WS-D spec | motion-0088 | bootstrap-manifest.schema.yaml, bootstrap-generator.spec.md |
| WS-D impl | motion-0089 | portal/scripts/generate-bootstrap.mjs |
| WS-D proof | motion-0090 | real-write proof, one minimal fix |
| WS-E | motion-0091 | coverage-declaration.schema.yaml, dispatch-integration.spec.md |

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.
