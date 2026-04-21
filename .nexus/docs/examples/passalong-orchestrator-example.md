Illustrative example only. This file is not a live governance artifact.

```yaml
passalong_kind: orchestrator
schema_version: "passalong-1.1"
date: 2026-04-20
repo: dev-jai-nexus
branch: sprint/q2-control-thread-canon
scope: CONTROL_THREAD
current_motion: motion-0140
program: q2-corpus-v2-live-value-loop
generated_by: manual-example
```

## Current baseline

The control-thread canon package is active under `motion-0140` and remains in DRAFT.
The implementation boundary is fixed to four documentary artifacts under `.nexus/docs/`
and `.nexus/codex/`. No runtime, command-surface, or automation work is in scope.

## What is settled

- `motion-0140` is the active governance package for control-thread canon v0.
- The implementation paths are fixed:
  - `.nexus/docs/control-thread-model.md`
  - `.nexus/codex/passalong-schema.md`
  - `.nexus/docs/examples/passalong-orchestrator-example.md`
  - `.nexus/docs/examples/passalong-dev-example.md`
- The work is documentary only.
- No portal, `.claude`, or package-surface changes are allowed.

## Active work

- define the control-thread canon in repo-neutral language
- expand passalong schema documentation to additive v1.1
- produce durable orchestrator and dev examples that make routing intent explicit

## What remains open

- final wording of the control-thread boundary language
- final wording of the v1.1 passalong structure and compatibility note
- validation results for `validate-motion`, `validate-agency`, and `pnpm -C portal typecheck`

## Deferred

- any skill prompt update under `.claude/**`
- any eval-fixture update under `.nexus/codex/evals/`
- any automation, notification, telemetry, or collaboration expansion
- any runtime or operator-surface change

## Tasks

- [ ] author `.nexus/docs/control-thread-model.md`
- [ ] update `.nexus/codex/passalong-schema.md` to additive v1.1
- [ ] add durable orchestrator and dev examples
- [ ] run the standard motion validation commands
- [ ] keep the motion in DRAFT and close the session without ratification

## Risks

- Risk: control-thread language could be misread as execution authority.
  Mitigation: restate that the control thread preserves continuity only and does not execute.
- Risk: passalong v1.1 could be misread as invalidating v1.0 artifacts.
  Mitigation: state that v1.1 is additive and v1.0 remains valid.
- Risk: examples could be mistaken for live artifacts.
  Mitigation: mark examples explicitly as illustrative at the top of each file.

## Routing targets

- `ORCHESTRATOR`
  - use when the next session needs to decide which bounded work item should happen next
- `REPO_EXECUTION`
  - use when the next session should implement the fixed documentary scope of `motion-0140`
- `EXPLORATION`
  - use only if wording or boundary questions remain unresolved after the documentary pass

## Next direction

Route next to `REPO_EXECUTION` to finish the four documentary artifacts, run the
standard validations, and return a bounded status update without ratifying the motion.

## Next chat prompts

- `Implement the four motion-0140 documentary artifacts and keep the motion in DRAFT.`
- `Review the control-thread wording for any language that implies automation or controller behavior.`
- `Run the standard motion-0140 validation commands and report only documentary-file changes.`

## Reference layers

- Motion: `motion-0140` (`.nexus/motions/motion-0140/`)
- Prior passalong canon: `.nexus/codex/passalong-schema.md`
- Repo role guidance: `CLAUDE.md`
- Generated continuity destination: `surfaces/chat-context/`

## Handoff note

Keep the settled/open/deferred split intact. If a follow-on request tries to upgrade
skills, evals, or runtime surfaces, route that as a separate motion rather than
expanding `motion-0140`.
