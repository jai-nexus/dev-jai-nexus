# Validation Guidance - dev-jai-nexus

## Purpose
This document explains how to use validation presets in future Claude code-edit sessions.

## Why this exists
Recent live Claude usage proofs showed a recurring pattern:

- setup works better when validation expectations are explicit,
- the same validation shapes recur,
- repeated manual restatement adds friction.

The validation preset layer exists to reduce that friction without removing judgment.

## What presets are
Validation presets are reusable starting profiles for local checks.

They are meant to answer:
- what kind of task is this?
- what validation usually fits this task shape?
- what command should be stated up front?

They are not meant to answer:
- whether the task is correct,
- whether broader checks are needed,
- whether the motion scope is sound.

## How to use presets
1. Identify the actual task shape.
2. Choose the smallest preset that fits.
3. State the validation command explicitly in the session.
4. Override or extend the preset when the task clearly needs more.
5. Record the actual command and result if the session reaches implementation proof.

## Recommended usage pattern
For a normal Claude code-edit session:

1. identify the active motion
2. identify the bounded task
3. choose the validation preset
4. tell Claude the exact validation command
5. proceed with the task
6. run and record the actual validation result

## When to override a preset
Override when:
- the task spans multiple surfaces,
- the task changes a generator plus emitted outputs,
- build behavior matters more than type behavior,
- the preset is clearly too broad or too narrow for the actual task.

## Current practical rule
If the task changes:
- portal code -> start with `portal_code_edit`
- script/generator logic -> start with `script_or_generator_edit`
- docs/config only -> start with `docs_or_config_only`
- a small mixed task -> start with `bounded_multi_surface_change`

## Important boundary
Presets are reusable guidance.
They are not canonical repo truth and they are not hard law.

Canonical truth remains in:
- repo source files,
- motion artifacts,
- substrate artifacts,
- actual command results.

## Practical conclusion
The goal is not to automate judgment.
The goal is to remove repeated low-value setup explanation while keeping validation explicit and bounded.
