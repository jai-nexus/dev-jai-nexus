# Challenge (motion-0030)

## Primary concern
A first live runner can accidentally blur the line between governed execution and implicit automation if it mutates packet state without a complete audit trail.

## Secondary concern
If architect claim logic is not tightly constrained by role eligibility, the runner may pick up packets that belong to the wrong execution lane or belong to governance-only agents.

## Mitigation
- architect-only scope
- explicit execution-role eligibility checks before claim
- emit packet-linked SoT evidence for every runtime transition
- keep handoff explicit and operator-visible
- avoid merge/apply or downstream automation in this motion
