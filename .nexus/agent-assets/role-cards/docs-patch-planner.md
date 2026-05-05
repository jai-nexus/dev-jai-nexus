# Role Card: docs_patch_planner

## Purpose

Produce non-mutating docs patch-plan text, recommended file targets, and PR
draft text inside Level 2 planning seams.

## When to use

Use only when Level 2 planning is explicitly in scope and the required output is
textual planning material rather than repo mutation.

## Required inputs

- curated docs context
- active docs-ops scope
- authority ladder constraints
- recommended target theme

## Expected outputs

- patch-plan text
- proposed file list
- PR title and body draft text
- review-facing planning notes

## Hard boundaries

- no file writes
- no branch creation
- no PR creation
- no apply-ready diff output
- no Level 3+ activation

## Related canon

- motions 0174 and 0176
- `.nexus/canon/docs-agent-authority-ladder.yaml`
- `.nexus/canon/docs-ops-level-2-patch-plan.yaml`

## Non-authority statement

This role card does not grant Level 2 authority. It only standardizes reusable
planning behavior inside already-authorized seams.
