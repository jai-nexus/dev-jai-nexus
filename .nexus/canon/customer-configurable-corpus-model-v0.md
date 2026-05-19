# Customer-Configurable Corpus Model v0

## Purpose

Define the customer/project corpus model as a future product/canon concept,
extending corpus semantics beyond internal JAI governance epochs so JAI NEXUS
can eventually support customer-defined project-history compartments.

This artifact is docs/canon/static UI only. It does not implement customer
corpus functionality.

## Source baseline

- `dev-jai-nexus` is settled through `motion-0243`
- Corpus V1 remains the active internal manual-governance corpus
- Corpus V2 remains the future internal reset corpus
- motion numbering has not reset
- corpus namespace and snapshot additions remain conceptual only

## Internal governance corpus relationship

The internal corpus model remains primary for control-plane governance epochs:

- Corpus V1 = active internal manual-governance corpus
- Corpus V2 = future-gated internal reset corpus
- motion numbering has not reset

This artifact does not change the internal governance corpus model. It extends
corpus semantics conceptually so customer/project history can later be
compartmentalized in a product-facing way.

## Customer/project corpus definition

A customer/project corpus is a future project-history compartment that groups a
projects development motions, decisions, and snapshots into a bounded reviewable
lineage.

Its intended purpose is to let customers eventually:

- review all corpuses
- review prior motions
- compare current and previous corpuses
- archive completed corpuses
- keep one continuous corpus if preferred
- divide a continuous corpus into multiple corpuses later, under governance

## Corpus classes

Two corpus classes are now defined conceptually:

- internal governance corpus
- customer/project corpus

## Customer/project segmentation modes

Future customer/project corpuses may support these segmentation modes:

- monthly
- quarterly
- yearly
- milestone-based
- continuous/all-in-one
- manual/custom
- retroactive split

## Conceptual customer/project corpus fields

Future customer/project corpus models may define:

- `corpus_id`
- `corpus_type`
- `corpus_owner_scope`
- `workspace_id`
- `project_id`
- `corpus_label`
- `corpus_status`
- `segmentation_mode`
- `segmentation_period`
- `opened_at`
- `closed_at`
- `prior_corpus_id`
- `next_corpus_id`
- `parent_corpus_id`
- `derived_from_corpus_id`
- `motion_numbering_scope`
- `snapshot_lineage_scope`
- `decision_record_scope`
- `archive_status`

## Review-all-corpuses posture

Future product posture should preserve reviewability across corpus boundaries:

- all corpuses remain reviewable
- closed corpuses remain archived and reviewable
- cross-corpus references are allowed conceptually
- cross-corpus review is read-only unless separately governed

## Previous-motion review posture

Previous motions remain reviewable across current and prior corpuses.

Review posture requirements:

- previous motions remain reviewable
- prior corpus lineage remains visible
- archived corpus history remains inspectable
- customer/project corpus review must not rewrite historical provenance

## Retroactive split posture

Future continuous/all-in-one corpuses may be divided later under governance.

Retroactive split rules:

- continuous/all-in-one corpuses may be divided later
- split must preserve original motion provenance
- derived corpuses reference parent corpus
- no motion history is deleted or rewritten by default
- split tooling requires separate explicit governance

## Snapshot posture

Future customer/project snapshot posture should preserve corpus-aware lineage:

- future customer/project snapshots should support corpus identity
- current corpus and archived corpuses must be distinguishable
- customer/project corpus snapshots must not overwrite prior history
- corpus-aware snapshot implementation remains future work

## Carry-forward rules

The following carry forward across customer/project corpus boundaries:

- repo ownership boundaries
- authority denials
- motion provenance
- prior corpuses remain archived and reviewable
- paid-beta and customer-data restrictions remain closed until separately authorized

## Non-goals

- no customer corpus UI
- no account/workspace/project persistence
- no corpus database schema
- no API routes
- no DB behavior
- no retroactive split tooling
- no customer data collection
- no Corpus V2 opening
- no motion numbering reset

## Explicitly not-authorized items

This artifact does not authorize:

- customer corpus UI
- customer account, workspace, or project persistence
- corpus DB schema
- API routes
- DB behavior
- customer data collection
- auth/session behavior
- billing/payment behavior
- Corpus V2 opening
- motion numbering reset
- retroactive split tooling

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
- No billing/payment behavior
- No hidden persistence
- No live dry-run or evidence ingestion
- No file watchers
- No API routes
- No DB behavior

This artifact defines future customer/project corpus semantics only. It does
not implement product functionality or change the current internal corpus
governance posture.
