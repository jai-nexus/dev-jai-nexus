# Second Live Claude Passalong - dev-jai-nexus

## Current state
dev-jai-nexus now has two levels of Claude live-use validation:

- first live usage proof for setup/workflow validation
- second live usage proof for code-heavy bounded-task validation

This means the Claude stack is now validated for:
- startup/setup coherence
- bootstrap handoff usefulness
- code-task context loading with bounded file selection

## What the second live proof showed
The code-heavy validation confirmed that:
- the bootstrap pack still helps under implementation pressure,
- the active motion package remains the canonical anchor,
- the setup stack reduces recontextualization,
- actual touched code files still need to be selected deliberately,
- a short explicit task framing remains important.

## Current recommended code-heavy setup routine
1. Run `pnpm claude:bootstrap`
2. Read `CLAUDE.md`
3. Read key substrate artifacts:
   - `.nexus/context/project-constitution.yaml`
   - `.nexus/context/slot-policy.yaml`
   - `.nexus/context/scoring-rubric.yaml`
4. Read:
   - `.nexus/claude/project-context-pack.md`
   - `.nexus/claude/operating-workflow.md`
5. Read:
   - `surfaces/claude/YYYY-MM-DD_claude-bootstrap.md`
6. Read the active motion package
7. Add only the relevant code surfaces
8. Add motion-local generated context only if the task spans multiple files or prior chats

## What remains true
- Canonical truth remains in repo source files, motion artifacts, and substrate artifacts.
- Generated bootstrap/context files remain compression layers.
- The setup stack helps orientation, but source inspection still matters for implementation work.
- The operator still needs to state the exact bounded task and choose the relevant files.

## Recommended minimum governed path for code-heavy work
- `CLAUDE.md`
- `.nexus/context/project-constitution.yaml`
- `.nexus/claude/project-context-pack.md`
- `surfaces/claude/YYYY-MM-DD_claude-bootstrap.md`
- active motion package
- touched code files

Add chat-context generated artifacts only when the task is larger or conversation continuity matters.

## Suggested next motion direction
Strong next options:
- a third live Claude proof on a real code-edit + local validation task,
- a task-local code-surface packaging motion to reduce manual file selection,
- or a cleanup motion to consolidate overlapping Claude-facing docs.

## Recommended reminder for the next code-heavy Claude session
Before starting, always provide:
- active motion id
- exact bounded implementation task
- touched files or likely touched files
- expected validation step such as `pnpm -C portal typecheck`
