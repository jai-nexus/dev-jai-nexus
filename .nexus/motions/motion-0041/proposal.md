# Proposal - motion-0041

## Title
Claude Second Live Usage v0: code-heavy bounded task + setup stress test

## Why this motion exists
Motion-0040 proved the first real Claude usage path in dev-jai-nexus:
- the validated setup routine was usable,
- the generated bootstrap pack helped,
- the canonical vs generated distinction held,
- recontextualization was reduced.

But the first live proof was still closer to setup/workflow validation than to real implementation pressure.

The next missing proof is code-heavy usage.

JAI NEXUS now needs to answer:
- Can the Claude setup stack support real repo implementation work?
- Is the bootstrap pack still helpful once code surfaces matter?
- Are the active motion package and motion-local generated context enough?
- What still has to be explained manually for code tasks?

## What this motion changes
This motion validates the Claude stack against one real code-heavy bounded task.

It should:
- use the current Claude setup routine,
- use the generated bootstrap pack,
- load the active motion package,
- load only the relevant code surfaces,
- record what worked and what did not.

## Why this matters
The Claude operating stack is now structurally complete.
What remains is proving it under implementation load.

This motion is not asking whether Claude can read the setup files.
It is asking whether the setup files plus motion-local context are enough to support a real coding task without excessive rebriefing.

## Suggested bounded task shape
Choose one real task that:
- touches actual code,
- is still small enough to evaluate in one session,
- has clear validation or evidence,
- can be described by a single active motion.

Good examples:
- a small operator surface polish
- a script refinement
- a deterministic artifact improvement
- a small workflow semantics cleanup

## Suggested validation outputs
A clean v0 could include:
- `.nexus/claude/second-live-usage-report.md`
- `.nexus/claude/second-live-passalong.md`

## Design stance
This motion should be honest and evidence-oriented.

The goal is not to force a perfect outcome.
The goal is to learn whether the current setup stack stays useful once real code context enters the loop.
