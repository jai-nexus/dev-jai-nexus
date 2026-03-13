# Proposal - motion-0044

## Title
Validation Presets v0: reusable local check profiles for Claude code-edit sessions

## Why this motion exists
Motions 0040 through 0043 produced a clear operational lesson:

Claude code-edit sessions work better when the validation step is explicit.

The problem is that validation expectations are still being restated manually from session to session.

That means the current stack now has:
- governed setup,
- bootstrap compression,
- task-local code packaging,
- live code-edit proof,

but it still lacks a reusable layer for:
- "what should we validate for this kind of task?"

## What this motion changes
This motion adds a small governed validation-preset layer for recurring local checks.

It should define compact profiles for common session types, such as:
- code-edit session with portal source changes,
- script/session with generator changes,
- docs/config-only session,
- broader bounded implementation session.

The goal is not to remove judgment.
The goal is to reduce repetitive setup friction.

## Why this matters
The Claude stack is now mature enough that repeated sessions will benefit from reusable session scaffolding.

A validation-preset layer helps by:
- making validation expectations explicit,
- reducing repeated briefing,
- preserving consistent habits,
- supporting future code-edit sessions and passalongs.

## Suggested artifact set
A clean v0 could include:

- `.nexus/claude/validation-presets.yaml`
- `.nexus/claude/validation-guidance.md`
- `.nexus/claude/session-validation-checklist.md`

If the repo prefers slightly different names, preserve the same conceptual roles.

## Design stance
This motion should remain:
- compact,
- operator-friendly,
- text-first,
- practical,
- governance-aware.

It should not become:
- a full automation framework,
- CI replacement,
- rigid workflow law that overrides motion-specific judgment.

## Why now
This is a good stopping-point motion because it converts recent live-proof lessons into durable reusable structure without requiring another full live implementation session tonight.
