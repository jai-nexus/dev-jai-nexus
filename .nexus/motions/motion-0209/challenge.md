# Challenge: Agent Governance Sandbox Boundary v0

## Risks

- sandbox could be mistaken for a backdoor activation path
- fixture outputs could be mistaken for canon
- simulated traces could be overread as live ratification behavior

## Mitigations

- keep sandbox strictly local and fixture-only
- state that sandbox output is not canon unless later motionized
- explicitly forbid provider dispatch, runtime execution, and authority paths
