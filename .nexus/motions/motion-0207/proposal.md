# Proposal: Static Readiness Gate Data Model v0

## Purpose

Convert Corpus V2 readiness gate posture into a static local data model for
read-only operator surfaces.

## Scope

- add a static local readiness gate model
- align the model to settled readiness status and checkability values
- use the static model to drive root readiness counts and blockers
- keep canon as source-of-truth and the local model as UI representation only

## Non-goals

- no enforcement
- no automation
- no Corpus V2 opening
- no numbering reset
- no live drafting, voting, or ratification
- no authority expansion
