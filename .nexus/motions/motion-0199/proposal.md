# Proposal: Motion Governance Schema Hygiene v0

## Purpose

Formalize Corpus V1 motion-governance schema eras and clarify role/lens
assignment versus canonical governance voter identities.

## Scope

- inspect representative Corpus V1 schema eras
- add a corpus canon artifact documenting schema-era drift
- clarify `motion.yaml` role/lens fields versus `vote.json` voter identities
- document human operator intervention posture in Corpus V1
- record the relationship to PR `#151`
- add a read-only/canon-only motion package for `motion-0199`
- refresh the bundled motion snapshot through `motion-0199`

## Non-goals

- no opening of Corpus V2
- no numbering reset
- no mutation of historical outcomes, statuses, timestamps, or vote values
- no rewriting of older motion packages
- no live voting enablement
- no runtime execution, provider/model calls, branch-write, PR, merge,
  scheduler, automation, API/DB mutation, or hidden persistence authority
