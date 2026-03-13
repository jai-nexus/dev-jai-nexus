# Proposal - motion-0042

## Title
Task-Local Code Surface Pack v0: bounded file-context generator for code-heavy Claude sessions

## Why this motion exists
Motion-0041 proved that the Claude setup stack remains usable for code-heavy bounded work.

That proof also exposed the next friction point:
- the setup stack helps orientation,
- the active motion helps governance,
- the bootstrap pack helps compression,
- but selecting the actual code files still requires substantial manual judgment.

The next high-leverage improvement is not broader memory.
It is better task-local code packaging.

## What this motion changes
This motion adds a generator that compiles a bounded task-local code surface pack.

The generator should:
- take a motion id and/or explicit paths,
- identify a compact relevant file set,
- emit stable ordered file sections,
- include bounded source excerpts,
- preserve canonical file references,
- emit a manifest sidecar.

## Why this matters
For code-heavy Claude sessions, the operator still has to decide:
- which files matter,
- how much of them to show,
- how to avoid dumping too much,
- how to keep the session grounded in the active task.

A task-local code pack improves this by creating a generated middle layer between:
- motion context,
- bootstrap context,
- raw source files.

## Suggested output location
A clean v0 location would be:

- `surfaces/code-context/YYYY-MM-DD_task-code-pack.txt`
- `surfaces/code-context/YYYY-MM-DD_task-code-pack_manifest.json`

If the repo prefers slightly different names, preserve the same concept.

## Design stance
This motion should remain:
- deterministic,
- compact,
- path-oriented,
- repo-specific,
- practical for real code sessions.

It should not become:
- semantic search,
- automatic whole-repo summarization,
- a replacement for source truth.

## Suggested selection logic
v0 should be simple and practical:
- include explicit `--path` values,
- include active motion package touched paths when useful,
- optionally include a few currently modified git paths,
- exclude junk/build/generated folders,
- sort consistently,
- excerpt files instead of dumping everything.
