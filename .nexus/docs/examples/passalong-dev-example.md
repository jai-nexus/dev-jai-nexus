Illustrative example only. This file is not a live governance artifact.

```yaml
passalong_kind: dev
schema_version: "passalong-1.1"
date: 2026-04-20
repo: dev-jai-nexus
branch: sprint/q2-control-thread-canon
scope: REPO_EXECUTION
current_motion: motion-0140
motion_status: DRAFT
generated_by: manual-example
```

## Current baseline

`motion-0140` is active in DRAFT state on `sprint/q2-control-thread-canon`. The repo
thread is limited to four documentary artifacts only. No portal, package-surface,
`.claude`, or runtime changes are allowed.

## What is settled

- the implementation scope is fixed to the four canon/doc paths
- the work is static and documentary only
- no ratification or commit should happen in the implementation session
- sync-back to the control thread will require ratification plus a recorded passalong,
  so the thread is not yet synced back

## What remains open

- author the final text for the control-thread model doc
- land the additive v1.1 passalong schema language
- add the two durable example files
- run the standard validation commands after the docs are written

## Tasks

- [ ] write `.nexus/docs/control-thread-model.md`
- [ ] update `.nexus/codex/passalong-schema.md`
- [ ] write `.nexus/docs/examples/passalong-orchestrator-example.md`
- [ ] write `.nexus/docs/examples/passalong-dev-example.md`
- [ ] run validation without ratifying or committing

## Risks

- Risk: schema text may imply that passalongs can trigger repo mutation.
  Mitigation: repeat that passalongs are continuity artifacts only.
- Risk: control-thread wording may blur control-thread scope with repo-local execution.
  Mitigation: keep `CONTROL_THREAD`, `ORCHESTRATOR`, `REPO_EXECUTION`, and `EXPLORATION`
  distinct and describe the boundary directly.
- Risk: a follow-on session may assume sync-back is complete as soon as the docs land.
  Mitigation: state that sync-back requires ratification and a recorded passalong.

## Routing targets

- `ORCHESTRATOR`
  - target after ratification when the updated repo state needs to be folded back into control-thread continuity
- `REPO_EXECUTION`
  - target while the four documentary artifacts are still being authored or validated
- `EXPLORATION`
  - target only if new ambiguity appears that cannot be resolved inside the current motion boundary

## Next step

Write the four documentary artifacts, run `validate-motion`, `validate-agency`, and
`pnpm -C portal typecheck`, then report the repo-thread state back without ratifying
the motion.

## Next chat prompts

- `Finish motion-0140 documentary implementation and keep the worktree limited to the four canon/doc files.`
- `Validate motion-0140 after the doc edits and confirm that no runtime or command surfaces changed.`
- `Prepare a repo-thread passalong that reports DRAFT status and outstanding ratification steps only.`

## Reference layers

- Motion: `motion-0140` (`.nexus/motions/motion-0140/`)
- Control-thread canon: `.nexus/docs/control-thread-model.md`
- Passalong canon: `.nexus/codex/passalong-schema.md`
- Continuity destination: `surfaces/chat-context/`

## Handoff note

This repo thread is still local execution until ratification occurs. Do not describe
the work as synced back just because the documentary files exist in the working tree.
