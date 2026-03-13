# First Live Claude Passalong - dev-jai-nexus

## Current state
dev-jai-nexus now has a full Claude operating stack proven through live usage validation:

- repo-root Claude guidance
- formal context substrate
- Claude-facing repo artifacts
- generated Claude bootstrap pack
- package command: `pnpm claude:bootstrap`
- validated first-project setup routine
- first live session validation artifacts

## Current recommended setup routine
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
7. Add motion-local generated context only if needed

## What was validated
The first live usage proof showed that:
- the bootstrap pack is genuinely useful as a setup handoff,
- startup context is more repeatable,
- canonical vs generated artifact boundaries are understandable,
- the active motion package still needs to remain central,
- a short explicit task framing is still helpful.

## What remains true
- Canonical truth remains in repo source, motion artifacts, and substrate artifacts.
- Generated bootstrap/context artifacts are compression layers, not authority layers.
- Claude setup is now operationally usable, but still benefits from a precise task ask.

## Practical routine for the next Claude session
Use this minimum governed path:
- `CLAUDE.md`
- `.nexus/context/project-constitution.yaml`
- `.nexus/claude/project-context-pack.md`
- `surfaces/claude/YYYY-MM-DD_claude-bootstrap.md`
- active motion package

Add:
- `surfaces/chat-context/YYYY-MM-DD_repo-capsule.txt`
- `surfaces/chat-context/YYYY-MM-DD_active-path-pack.txt`

only when the task spans multiple files or prior chats.

## Suggested next motion direction
A strong next step after this validation is:
- a second live usage proof on a more code-heavy bounded task, or
- consolidation/polish of overlapping Claude-facing artifacts.

## Recommended reminder for next setup
Before asking Claude to work, always include:
- the active motion id,
- the exact bounded task,
- whether the ask is strategy, implementation, review, or passalong.
