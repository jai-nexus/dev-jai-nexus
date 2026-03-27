# Decision Record - motion-0037

## Decision
Proceed with the first generated Claude bootstrap pack for dev-jai-nexus.

## Reason
Motion-0036 established the Claude-facing operating artifacts, but practical Claude setup still required manual file gathering. Motion-0037 closes that gap by adding a deterministic generator that compiles Claude-facing repo guidance, formal substrate references, and current generated repo context into a reusable dated bootstrap handoff.

## Constraints
- keep the bootstrap output compact and repo-centric,
- preserve canonical truth in motion and substrate artifacts,
- avoid expansion into provider orchestration or account automation,
- keep the generated pack deterministic and reusable,
- treat the bootstrap output as a handoff layer, not a replacement for canonical sources.

## Ratification condition
Ratify only after the generator emits:
- a dated Claude bootstrap markdown file,
- a manifest sidecar,
- stable markdown output across identical reruns,
- clear inclusion of Claude-facing artifacts, substrate references, and generated context references.
