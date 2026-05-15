# Corpus V2 Readiness Checklist

## Purpose

This artifact makes Corpus V2 readiness visible and inspectable before any
Corpus V2 opening work advances.

It does not open Corpus V2.
It does not reset motion numbering.
It does not grant live voting or execution authority.

## Checklist status model

- `satisfied_by_canon`: the canon or planning requirement is documented, but
  this does not imply runtime operability.
- `partially_satisfied`: some supporting canon or surface exists, but the gate
  is not fully met.
- `unmet_future`: no implementation or governing mechanism is active yet.
- `blocked_by_authority`: the gate cannot be satisfied until a separate
  authority motion is passed.
- `deferred_until_v2_opening`: the gate belongs to the eventual Corpus V2
  opening process.

## Gate table

| Gate | Status | Current evidence | Missing before V2 | Authority note |
| --- | --- | --- | --- | --- |
| Live agent motion drafting | `unmet_future` | Corpus V1 remains human-operated and manual; no live agent drafting path exists today. | Internal JAI Agent drafting flow into `dev.jai.nexus`. | No provider, model, or runtime authority is granted. |
| Canonical governance voting | `partially_satisfied` | PR `#151` corrected recent voter identities and motions `0196` through `0200` use canonical governance voter identities. | Live JAI Agent voting process using those identities. | Canonical voter identity shape exists; live voting is not active. |
| Governed visible ratification | `partially_satisfied` | Corpus V1 has visible motion packages, decisions, and manual ratification records. | Governed, visible, agent-operable ratification workflow. | No live agent ratification authority is granted. |
| Workflow-ready outputs | `partially_satisfied` | Passalongs, PR descriptions, validation lists, and motion packages exist as structured outputs. | Deterministic workflow-output generation by operable agents. | No branch-write, PR, or execution authority is granted. |
| Human override / approval boundary | `satisfied_by_canon` | Corpus model and readiness gate preserve human override and approval boundary where required. | Implementation specifics for where approval gates live. | Human final boundary remains required where applicable. |
| Voter/lens/human distinction | `satisfied_by_canon` | Motion `0199` documents role/lens versus voter identity and human intervention distinction. | Future Corpus V2 schema or tooling enforcement. | Canon exists; live enforcement does not. |
| Deterministic schema-valid motion package generation | `partially_satisfied` | `validate-motion` and settled package conventions exist; snapshot gate already checks package completeness. | Deterministic agent-operable generation path. | No live generation automation is granted. |
| Snapshot generation gate | `partially_satisfied` | `build-motion-snapshot --write` and `--check` exist and are required in current motion validation practice. | Final Corpus V2 policy for automatic versus required snapshot gate. | No scheduler or automation is granted. |
| Safe motion numbering reset without overwriting Corpus V1 | `satisfied_by_canon` | Corpus model states a new Corpus may restart at `motion-0001` without overwriting Corpus V1. | Actual opening procedure and storage/path strategy. | Numbering has not reset. |
| Corpus V1 immutability | `satisfied_by_canon` | Corpus V1 archive/index and schema-hygiene canon preserve historical immutability except explicit hygiene fixes. | Optional future archive protection or tooling if desired. | No historical rewrite is authorized. |
| No write/merge/execution authority without separate authorization | `satisfied_by_canon` | Repeated settled motions preserve no authority expansion across write, merge, and execution boundaries. | Separate future authority motions if any capability becomes necessary. | Branch-write, PR creation, merge, and execution remain disabled. |

## Relationship to Corpus V1 archive/index

This checklist depends on
`/ .nexus/canon/corpus/corpus-v1-archive-index.md` as the historical boundary
for Corpus V1.

Corpus V1 must remain preserved and searchable before Corpus V2 opens.
Corpus V1 must also remain immutable except through explicit hygiene fixes.

## Relationship to Corpus model and readiness gate

This checklist is derived from:

- `.nexus/canon/corpus/corpus-model-v0.md`
- `.nexus/canon/corpus/corpus-v2-readiness-gate.md`
- `.nexus/canon/corpus/motion-governance-schema-hygiene-v0.md`

It is an inspectable tracker derived from the readiness gate, not the opening
mechanism itself.

## Non-goals

This checklist does not:

- open Corpus V2
- reset numbering
- implement live agent drafting
- implement live agent voting
- implement live ratification
- add branch-write, PR, merge, or runtime authority
- add scheduler or automation
- add API or DB mutation
- create a passalong index
- introduce live heartbeat semantics

## Authority boundary

This checklist preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
- no hidden persistence
- no passalong index
- no ToolchainModule registry
- no per-agent pages
- no live heartbeat behavior
