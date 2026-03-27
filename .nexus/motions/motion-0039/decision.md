# Decision Record - motion-0039

## Decision
Proceed with the first validated Claude setup routine for dev-jai-nexus.

## Reason
Motions 0036 through 0038 established the Claude-facing repo artifacts, the generated Claude bootstrap pack, and the first polish pass for that generator. Motion-0039 closes the remaining gap by defining how the pack should actually be used in practice through a first-project workflow, an upload/read order, a reusable handoff checklist, and a setup validation note.

## Constraints
- keep the setup routine compact and repeatable,
- preserve the distinction between canonical artifacts and generated handoff artifacts,
- avoid redesigning the generator,
- avoid expansion into provider orchestration or account automation,
- keep the workflow repo-centric and governance-aware.

## Ratification condition
Ratify only after the validated Claude setup routine exists as a governed artifact set:
- `.nexus/claude/first-project-workflow.md`
- `.nexus/claude/upload-order.yaml`
- `.nexus/claude/handoff-checklist.md`
- `.nexus/claude/setup-validation.md`
