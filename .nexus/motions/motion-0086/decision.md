# Decision - motion-0086

## Status
RATIFIED

## Summary
Motion `motion-0086` is ratified.

WS-B (Agent Demand Planner) is complete. `agent-demand-matrix.schema.yaml`
v0.1 is committed with the NH-suffix convention corrected (council = nh_root,
governance children = .1–.4, execution = .10–.14), `scope_actions` per-role
field defined, `governance_resident_only` boolean with per-role defaults,
and `staffing_tier_rules` (minimum_viable=1 slot, expanded, panel=6) documented.
OffBook.ai pressure test produces 9 agents with correct NH IDs.

## Evidence
- `.nexus/planning/agent-demand-matrix.schema.yaml` committed at v0.1
- NH convention verified against `config/agency.yaml` baseline
- OffBook.ai derived_agents: 9 agents (7.0, 7.0.1–7.0.4, 7.0.10–7.0.12, 7.0.14)
- `validate_motion`: PASS
- `validate_agency`: PASS
- challenge.md: no blocking objections; NH convention fix and monorepo_vs_polyrepo challenge resolved

## Notes
Ratified as part of the motion-0092 governance closure sweep.
