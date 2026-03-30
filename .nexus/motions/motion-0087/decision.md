# Decision - motion-0087

## Status
RATIFIED

## Summary
Motion `motion-0087` is ratified.

WS-C (Topology and Wave Planner) is complete. Two new planning schemas
are committed: `topology-plan.schema.yaml` derives execution_scope
(repo_local | cross_repo), governance_resident_repo, and agent scope paths
from intake and demand matrix inputs. `wave-model.schema.yaml` defines five
bootstrap waves (0–4) with proof gates and entry_wave rules by project_type
(greenfield=0, migration=1, extension=2). Wave advancement is proof-based,
not calendar-based.

## Evidence
- `.nexus/planning/topology-plan.schema.yaml` committed at v0.1
- `.nexus/planning/wave-model.schema.yaml` committed at v0.1
- execution_scope derivation: polyrepo → cross_repo, monorepo → repo_local
- Wave proof gate model consistent with WS-D bootstrap manifest
- `validate_motion`: PASS
- `validate_agency`: PASS
- challenge.md: no blocking objections; both challenges (planner boundary, polyrepo Wave 2) resolved

## Notes
Ratified as part of the motion-0092 governance closure sweep.
