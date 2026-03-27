# First Project Workflow - dev-jai-nexus

## Purpose
This document defines the practical first-project setup flow for starting new Claude work in dev-jai-nexus from governed repo context.

## Outcome
At the end of this workflow, Claude should have:
- repo-local operating guidance,
- awareness of the formal substrate,
- awareness of the active motion,
- a compact generated bootstrap handoff,
- enough context to begin meaningful work without broad re-explanation.

## Workflow

### 1. Generate the latest Claude bootstrap pack
Run:

`pnpm claude:bootstrap`

This creates the current generated Claude handoff under:
- `surfaces/claude/YYYY-MM-DD_claude-bootstrap.md`
- `surfaces/claude/YYYY-MM-DD_claude-bootstrap_manifest.json`

### 2. Establish repo-local operating context
Read:
- `CLAUDE.md`

This gives Claude the repo purpose, editing rules, governance assumptions, and sensitive surfaces.

### 3. Establish stable substrate context
Read the core substrate artifacts:
- `.nexus/context/project-constitution.yaml`
- `.nexus/context/slot-policy.yaml`
- `.nexus/context/scoring-rubric.yaml`

Use additional substrate artifacts if needed:
- `.nexus/context/repo-capsule.schema.yaml`
- `.nexus/context/motion-packet.schema.json`

### 4. Establish Claude-facing repo context
Read:
- `.nexus/claude/project-context-pack.md`
- `.nexus/claude/operating-workflow.md`

These explain how Claude is expected to operate inside dev-jai-nexus.

### 5. Load the generated bootstrap handoff
Read:
- `surfaces/claude/YYYY-MM-DD_claude-bootstrap.md`

This is the compact generated setup layer.
It is a handoff artifact, not canonical truth.

### 6. Load the active motion
Read the active motion package:
- `.nexus/motions/motion-XXXX/motion.yaml`
- `.nexus/motions/motion-XXXX/proposal.md`
- `.nexus/motions/motion-XXXX/challenge.md`
- `.nexus/motions/motion-XXXX/execution.md`
- `.nexus/motions/motion-XXXX/policy.yaml`

Use additional motion files if the motion is near closeout:
- `decision.md`
- `decision.yaml`
- `verify.json`
- `vote.json`

### 7. Load motion-local generated context if needed
When the motion touches multiple files or spans chats, read:
- `surfaces/chat-context/YYYY-MM-DD_repo-capsule.txt`
- `surfaces/chat-context/YYYY-MM-DD_active-path-pack.txt`

### 8. Begin scoped work
Only after the above:
- identify the exact requested task,
- inspect only the relevant code surfaces,
- make the smallest coherent change,
- validate locally,
- confirm proof before closeout.

## Canonical order of trust
1. repo source files
2. motion artifacts
3. substrate artifacts
4. Claude-facing repo guidance
5. generated bootstrap/context handoff artifacts

## Notes
- Do not upload the whole repo by default.
- Do not treat the generated bootstrap pack as canonical truth.
- Do not begin by reading unrelated old motions unless needed for the current task.
