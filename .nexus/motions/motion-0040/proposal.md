# Proposal - motion-0040

## Title
Claude First Live Usage v0: real project session proof + passalong artifact validation

## Why this motion exists
Motions 0036 through 0039 built the Claude operating stack for dev-jai-nexus:

- Claude-facing repo artifacts
- generated Claude bootstrap pack
- bootstrap polish + package command
- validated setup workflow and handoff routine

That means the preparation layer is now in place.

The next missing proof is real usage.

JAI NEXUS now needs to answer:
- Does the setup actually reduce manual recontextualization?
- Is the bootstrap pack sufficient for a real bounded task?
- What still needs to be explained manually?
- What passalong artifact should be preserved after a real session?

## What this motion changes
This motion proves the first live Claude usage path by:
- starting one real Claude session using the validated setup routine,
- using the generated bootstrap pack as intended,
- attempting one bounded dev-jai-nexus task,
- recording what context was enough and what was missing,
- producing a reusable validation/passalong artifact.

## Why this matters
The repo now has a strong substrate and setup stack, but real value comes from operational proof.

This motion does not ask whether the setup looks good.
It asks whether it works.

## Suggested bounded task shape
Pick one real but contained task, such as:
- a small repo-local polish task,
- a motion package drafting task,
- a tightly scoped code surface edit,
- a passalong or bootstrap refinement task.

The task should be:
- meaningful,
- bounded,
- easy to evaluate after one session.

## Suggested validation outputs
A clean v0 could include:
- `.nexus/claude/first-live-usage-report.md`
- `.nexus/claude/first-live-passalong.md`

If the repo prefers different names, preserve the same conceptual roles.

## Design stance
This motion is about operational validation, not perfection.

The goal is to learn:
- what the current setup already solves,
- what it still misses,
- how future Claude usage should improve.

## Why now
Now is the right time because the setup stack is already complete enough to test honestly.
