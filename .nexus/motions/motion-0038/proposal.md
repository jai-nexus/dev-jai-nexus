# Proposal - motion-0038

## Title
Claude Bootstrap Polish v0: section extraction cleanup + package script + practical setup validation

## Why this motion exists
Motion-0036 established the Claude-facing operating artifacts:
- `CLAUDE.md`
- Claude project context pack
- bootstrap set
- Claude operating workflow

Motion-0037 then established a generated Claude bootstrap handoff:
- dated markdown bootstrap pack
- manifest sidecar
- deterministic markdown output

That means the core system now exists.

The next step is polish and operationalization.

The bootstrap generator is already useful, but:
- extracted sections still show awkward heading carry-through,
- invocation is still more manual than ideal,
- the repo should have a cleaner repeatable command,
- the handoff should be validated as something that feels ready for actual recurring use.

## What this motion changes
This motion makes the Claude bootstrap layer cleaner and easier to use by:
- improving section extraction,
- tightening output presentation,
- adding a package script,
- validating the pack in a practical setup flow.

## Why this matters
JAI NEXUS now has:
- generated context bundles,
- formal context substrate artifacts,
- repo-centric Claude operating artifacts,
- a generated Claude bootstrap pack.

A small polish motion now has high leverage because it converts a proven generator into a smoother operating surface.

## Suggested touched surfaces
Likely:
- `portal/scripts/generate-claude-bootstrap.mjs`
- `package.json`

Possible:
- `CLAUDE.md`
- `.nexus/claude/project-context-pack.md`
- `.nexus/claude/operating-workflow.md`

## Expected proof
- package script works,
- bootstrap markdown reads more cleanly,
- manifest remains valid,
- rerun stability remains intact,
- the pack is usable as a practical setup handoff.
