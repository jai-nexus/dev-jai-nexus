# Challenge: Q2M4 Control-Plane Clarity Update v0

## Review focus

- Ensure customer-portal is represented as a surface under
  `jai-nexus/jai-nexus`, not as a standalone repo.
- Ensure `/repos` is explicitly the full repo registry and `/operator/agents`
  is explicitly a configured scope subset.
- Ensure work packets and task prompts use actual repo-plus-surface targets.

## Risks

- Old `repo_scope` naming may survive in UI copy and blur the model.
- Projects may still look like repos if repo and surface coverage are not shown
  separately.
- Any change that introduces write or execution posture would exceed scope.

## Required protections

- keep all execution and write posture disabled
- add no API routes, DB writes, or runtime changes
- preserve all existing guardrails from the motion and agent lines
