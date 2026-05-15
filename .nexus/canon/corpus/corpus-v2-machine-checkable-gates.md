# Corpus V2 Machine-Checkable Gate Model

## Purpose

Model which Corpus V2 readiness gates can eventually become deterministic
checks without claiming that any such checks are enforced today.

## Non-enforcement posture

This artifact is design-only canon.

- it does not implement enforcement
- it does not add automation
- it does not open Corpus V2
- it does not reset numbering
- it does not claim agents are fully operable

## Checkability categories

- `canon-checkable`: can be evidenced by the existence and content of canon
  artifacts
- `snapshot-checkable`: can be evidenced by snapshot generation or snapshot
  freshness checks
- `schema-checkable`: can be evidenced by deterministic schema validation of
  motion artifacts
- `UI-visible-only`: can be surfaced visibly, but not proven sufficient by
  visibility alone
- `human-gated`: requires explicit human judgment or approval even if evidence
  exists
- `authority-blocked`: cannot be satisfied without a separate authority motion

## Gate evidence fields

Every modeled gate should be described with:

- `gate_id`
- `gate_label`
- `current_status`
- `checkability`
- `evidence_source`
- `missing_condition`
- `authority_note`

## Gate table

| gate_id | gate_label | current_status | checkability | evidence_source | missing_condition | authority_note |
| --- | --- | --- | --- | --- | --- | --- |
| `drafting` | Live agent motion drafting | `unmet_future` | `authority-blocked` | Corpus model, readiness gate, readiness checklist | Internal JAI Agent drafting flow into `dev.jai.nexus` | No provider, model, or runtime authority is granted. |
| `canonical_voting` | Canonical governance voting | `partially_satisfied` | `canon-checkable` | PR `#151`, motion `0199`, recent `vote.json` records | Live JAI Agent voting process | Canonical identity shape exists; live voting is not active. |
| `visible_ratification` | Governed visible ratification | `partially_satisfied` | `human-gated` | Motion packages, decision records, readiness checklist | Agent-operable visible ratification workflow | No autonomous ratification authority is granted. |
| `workflow_outputs` | Workflow-ready outputs | `partially_satisfied` | `UI-visible-only` | Execution artifacts, passalong blocks, PR descriptions | Deterministic agent-generated workflow outputs | No branch-write, PR, or execution authority is granted. |
| `human_override` | Human override boundary | `satisfied_by_canon` | `human-gated` | Corpus model and readiness gate canon | Concrete implementation of approval checkpoints | Human final boundary remains required. |
| `identity_distinction` | Voter/lens/human distinction | `satisfied_by_canon` | `canon-checkable` | Motion `0199`, readiness checklist | Future V2 schema and tooling enforcement | Canon exists; live enforcement does not. |
| `schema_generation` | Deterministic schema-valid package generation | `partially_satisfied` | `schema-checkable` | `validate-motion`, current motion package conventions | Deterministic agent-operable generation path | No live generation automation is granted. |
| `snapshot_gate` | Snapshot generation gate | `partially_satisfied` | `snapshot-checkable` | `build-motion-snapshot --write`, `--check` | Final policy for automatic versus required snapshot gate | No scheduler or automation is granted. |
| `numbering_reset` | Safe motion numbering reset | `satisfied_by_canon` | `canon-checkable` | Corpus model, readiness gate | Opening procedure and corpus-aware storage/path strategy | Numbering has not reset. |
| `v1_immutability` | Corpus V1 immutability | `satisfied_by_canon` | `canon-checkable` | Corpus V1 archive/index, schema hygiene, closeout canon | Optional future archive protections | No historical rewrite is authorized. |
| `authority_boundary` | No write/merge/execution authority without separate authorization | `satisfied_by_canon` | `authority-blocked` | Settled motions preserving no authority expansion | Separate future authority motions if any capability becomes necessary | Branch-write, PR creation, merge, and execution remain disabled. |

## Relationship to readiness checklist

This artifact is derived from
`.nexus/canon/corpus/corpus-v2-readiness-checklist.md`.

The checklist states whether a gate is currently satisfied by canon, partially
satisfied, unmet, or otherwise blocked. This artifact adds future checkability
classification without changing gate status.

## Relationship to motion tooling

- `validate-motion` supports the `schema-checkable` layer
- `build-motion-snapshot` supports the `snapshot-checkable` layer
- neither tool currently enforces Corpus V2 opening readiness
- both tools remain evidence surfaces rather than opening gates

## Future implementation notes

- canon existence checks could become deterministic file-presence checks
- snapshot freshness could become a formal settlement prerequisite
- schema-valid package generation could become a deterministic pre-vote gate
- human override and visible ratification should remain visibly modeled even if
  portions become machine-checkable later

## Non-goals

This artifact does not:

- implement enforcement
- add automation
- add live agent drafting
- add live voting
- add autonomous ratification
- open Corpus V2
- reset numbering

## Authority boundary

This gate model preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
- no hidden persistence
