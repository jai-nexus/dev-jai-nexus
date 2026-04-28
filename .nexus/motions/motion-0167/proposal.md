# Proposal: Q2M4 Control-Plane Clarity Update v0

**Motion:** motion-0167  
**Basis:** motion-0166  
**Program:** q2-control-plane-clarity-update

## Intent

Normalize control-plane language so repo, surface, project, configured agent
scope, and work packet target mean the same thing across:

- `/operator/agents`
- `/operator/work`
- `/operator/projects`
- `/repos`

## Scope

- add a bundled repo/surface/project targeting model
- relabel the Agent Registry scope matrix as a configured subset
- update work packets and prompt previews to use repo plus surface targets
- update Projects to distinguish project from repo and surface
- update Repos to present the full repo registry

## Boundaries

- no execution enablement
- no branch writes
- no PR creation
- no dispatch
- no scheduler behavior
- no DB or API mutation
- no runtime changes
- no credentials or secret values
- no existing motion mutation
