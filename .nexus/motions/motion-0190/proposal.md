# Proposal: Agenda Source Metadata Hardening v0

## Summary

Harden the static agenda/work-packet source model with explicit selection
metadata so future loop-candidate selection uses stronger, more consistent
inputs.

The current selected candidate remains `wp-agent-registry-follow-up`.

## Scope

- extend the work-packet type layer with explicit selection metadata
- derive that metadata in the static work-packet source model
- align the selected-candidate helper with the new agenda metadata
- surface the metadata in `/operator/work` and, where useful, in the passalong text

## Non-scope

- no provider or model calls
- no runtime execution
- no branch-write authority
- no PR-creation authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no passalong index
- no ranking/scoring engine
- no changes to `/operator/jai`, canonical agent registry, or JAI Palette model

## Expected outcome

Agenda items become easier to inspect and compare as future loop-through
candidates because the source model now exposes repo posture, work class,
action class, mutation boundary, authority boundary, and chain completeness
directly.
