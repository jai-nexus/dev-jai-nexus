# Proposal - motion-0043

## Title
Claude Third Live Usage v0: task-code-pack-assisted code edit + local validation proof

## Why this motion exists
Motion-0040 proved the first real Claude usage path.
Motion-0041 proved the setup stack under code-heavy bounded-task conditions.
Motion-0042 added a task-local code surface pack to reduce manual file gathering.

That means the next missing proof is straightforward:

Can Claude use:
- the validated setup routine,
- the bootstrap pack,
- the active motion package,
- and the new task-local code pack

to complete one real code edit and survive local validation?

## What this motion changes
This motion performs the first live code-edit proof using the full current Claude stack.

It should:
- start from the governed setup path,
- use the generated bootstrap pack,
- use the generated task-local code pack,
- attempt one bounded code change,
- run local validation,
- record what still needed manual help.

## Why this matters
The setup stack is now mature enough that the next useful question is not structural.

It is operational:

Does the stack actually help a real code edit with less friction than manual file gathering alone?

## Suggested bounded task shape
Choose one task that is:
- real,
- small,
- code-edit oriented,
- locally verifiable,
- tied to one active motion.

Good examples:
- a small script polish,
- a narrow operator surface cleanup,
- a deterministic artifact-generation fix,
- a small workflow semantics adjustment.

## Suggested validation outputs
A clean v0 could include:
- `.nexus/claude/third-live-usage-report.md`
- `.nexus/claude/third-live-passalong.md`

## Design stance
This motion is about live proof, not perfection.

The goal is to measure whether the full setup stack now supports real implementation work with lower startup and file-selection friction.
