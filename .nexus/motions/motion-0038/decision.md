# Decision Record - motion-0038

## Decision
Proceed with the first polish and operationalization pass for the Claude bootstrap generator.

## Reason
Motion-0037 proved the generated Claude bootstrap pack, but the output still had rough edges and the invocation path was more manual than ideal. Motion-0038 closes that gap by improving section extraction, adding a simple package script, and validating the generated pack as a practical repo-centric setup handoff.

## Constraints
- keep the motion narrowly focused on polish and operationalization,
- preserve deterministic markdown output,
- preserve valid manifest behavior,
- keep generated output clearly secondary to canonical repo artifacts,
- avoid expansion into provider orchestration or broader unrelated workflow changes.

## Ratification condition
Ratify only after:
- `pnpm claude:bootstrap` works,
- the generated markdown pack reads more cleanly,
- the markdown output remains stable across identical reruns,
- the polished pack is practically usable as a Claude setup handoff.
