# Corpus Namespace Snapshot Model v0

## Purpose

Define the corpus namespace and snapshot model needed before Corpus V2 can
open, clarifying how future corpus-aware snapshots distinguish Corpus V1 from
Corpus V2 without opening Corpus V2 or resetting motion numbering now.

This artifact is docs/canon/static UI only. It does not change the active
Corpus V1 snapshot behavior.

## Source baseline

- `dev-jai-nexus` is settled through `motion-0242`
- Corpus V1 remains active
- Corpus V2 remains future-gated
- the current bundled snapshot remains a Corpus V1 snapshot
- no corpus-aware snapshot implementation is introduced here

## Corpus namespace fields

Future corpus-aware models should define:

- `corpus_id`
- `corpus_version`
- `corpus_label`
- `corpus_status`
- `corpus_opened_at`
- `corpus_closed_at`
- `prior_corpus_id`
- `motion_numbering_scope`
- `snapshot_lineage_scope`
- `decision_record_scope`

## Current Corpus V1 posture

Current intended namespace posture:

- `corpus_id: corpus-v1`
- `corpus_version: 1`
- `corpus_label: Corpus V1`
- `corpus_status: active`
- `corpus_opened_at: historical / already active`
- `corpus_closed_at: null`
- `prior_corpus_id: null`
- `motion_numbering_scope: corpus-local`
- `snapshot_lineage_scope: corpus-v1`
- `decision_record_scope: corpus-v1`

Current numbering posture:

- Corpus V1 numbering remains corpus-local
- Corpus V1 currently spans `motion-0001` through `motion-0243` after this
  motion

## Future Corpus V2 posture

Future intended namespace posture:

- `corpus_id: corpus-v2`
- `corpus_version: 2`
- `corpus_label: Corpus V2`
- `corpus_status: future_gated`
- `corpus_opened_at: null until explicitly opened`
- `corpus_closed_at: null`
- `prior_corpus_id: corpus-v1`
- `motion_numbering_scope: corpus-local`
- `snapshot_lineage_scope: corpus-v2`
- `decision_record_scope: corpus-v2`

Future numbering posture:

- motion numbering resets to `motion-0001` only when Corpus V2 is explicitly
  opened
- Corpus V2 snapshots must not overwrite Corpus V1 historical snapshot lineage

## Conceptual snapshot model additions

Future corpus-aware snapshots should conceptually support:

- `snapshot_corpus_id`
- `snapshot_corpus_version`
- latest motion id within corpus
- bundled motion count within corpus
- prior corpus reference
- historical corpus archive reference
- `generated_at`
- `source_repo`
- `validation_gate_summary`

These are conceptual additions only. They are not implemented by this motion.

## Conceptual decision record model additions

Future corpus-aware decision records should conceptually support:

- `decision_corpus_id`
- `decision_corpus_version`
- `corpus_local_motion_id`
- `global_motion_reference`, if needed later
- `prior_corpus_reference`, if cross-corpus reference is needed

These are conceptual additions only. They are not implemented by this motion.

## Reset and carry-forward rules

Reset when Corpus V2 is later opened:

- numbering
- corpus-local decisions
- corpus-local snapshot lineage
- corpus-local ratification sequence

Carry forward into Corpus V2:

- repo ownership boundaries
- authority denials
- Edge Runner substrate
- paid-beta and customer-data restrictions
- voter identity hygiene
- validation gates
- Corpus V1 archive

## Non-goals

- implementing schema migration
- mutating the current snapshot generator
- changing the current Corpus V1 snapshot format
- opening Corpus V2
- resetting numbering
- creating Corpus V2 motion files
- claiming provider/model or agent execution readiness

## Explicitly not authorized by this model

This artifact does not authorize:

- opening Corpus V2 now
- resetting numbering now
- creating Corpus V2 motion files now
- mutating the current Corpus V1 snapshot format
- provider/model calls
- live agent voting
- autonomous execution
- branch-write authority
- PR creation or merge authority
- scheduler authority
- production deployment
- customer workloads
- customer data collection
- payment or billing handling

## Authority boundary

- No provider/model calls
- No live agent voting
- No autonomous execution
- No runner execution
- No scheduler authority
- No branch-write authority
- No PR-creation authority
- No merge authority
- No production deployment
- No customer workloads
- No customer data collection
- No payment/billing handling
- No hidden persistence
- No live dry-run or evidence ingestion
- No file watchers
- No API routes
- No DB behavior

This artifact defines namespace and snapshot posture only. It does not open
Corpus V2, reset numbering, or change the active Corpus V1 snapshot format.
