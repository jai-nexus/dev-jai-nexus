# Challenge: JAI Chat Surface v0

## Main risks

- the route could look more capable than it actually is if copy is vague
- the new surface could drift from the control-plane registry if it is not added
  to the existing surface catalog
- adjacent operator surfaces could be blurred if `/operator/jai` tries to behave
  like a live chat product

## Mitigations

- make the route visibly draft-only, read-only, and non-executing
- show blocked authority and missing capability posture directly on the page
- reuse existing control-plane models for repo count and authority posture
- keep all prompt affordances static and copy-only

## Blocking boundary

This motion must not add provider dispatch, API routes, message persistence,
event streaming, scheduler behavior, execution, branch writes, PR creation,
credentials, or cross-repo mutation.
