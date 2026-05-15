# Corpus V2 Static Readiness Gates

## Purpose

Convert Corpus V2 readiness gate posture into a static local data model that a
read-only operator surface can consume.

## Static model posture

- canon files remain source-of-truth references
- the static model is a UI-consumable representation
- the static model is local and read-only
- the static model does not imply enforcement
- the static model does not add automation

## Recommended fields

Each readiness gate record should include:

- `gate_id`
- `gate_label`
- `status`
- `checkability`
- `current_evidence`
- `missing_before_v2`
- `authority_note`
- `source_artifact`

## Gate set

The static model should cover:

- live agent motion drafting
- canonical governance voting
- governed visible ratification
- workflow-ready outputs
- human override boundary
- voter/lens/human distinction
- deterministic schema-valid motion package generation
- snapshot generation gate
- safe motion numbering reset without overwriting Corpus V1
- Corpus V1 immutability
- no write/merge/execution authority without separate authorization

## Status and checkability alignment

The static model should reuse the settled readiness status values and
checkability values already defined by readiness canon:

- status:
  - `satisfied_by_canon`
  - `partially_satisfied`
  - `unmet_future`
  - `blocked_by_authority`
  - `deferred_until_v2_opening`
- checkability:
  - `canon-checkable`
  - `snapshot-checkable`
  - `schema-checkable`
  - `UI-visible-only`
  - `human-gated`
  - `authority-blocked`

## Relationship to operator surfaces

- the root surface may consume static counts and top blockers
- the drilldown surface may consume the full static model
- neither surface may add controls or imply runtime state

## Non-goals

This static model does not:

- open Corpus V2
- reset numbering
- implement enforcement
- add automation
- add live drafting, voting, or ratification

## Authority boundary

This model preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
