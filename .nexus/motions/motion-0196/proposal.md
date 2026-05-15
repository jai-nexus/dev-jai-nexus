# Proposal: Corpus V1 Closeout and Corpus Model v0

## Purpose

Define Corpus as a first-class governance era model for `dev-jai-nexus` and
record Corpus V1 as the manual-governance era.

## Scope

- add a corpus model canon artifact under `.nexus/canon/corpus/**`
- define Corpus V1 as manual-governance corpus
- define Corpus V2 as future agent-operable corpus
- define Corpus identity fields for future corpus records
- define the policy that a new Corpus may restart motion numbering at
  `motion-0001`
- preserve prior Corpus history as searchable, historical canon
- define Corpus V1 closeout posture and preservation rules
- keep Corpus V2 gated and unopened
- refresh the bundled motion snapshot through `motion-0196`

## Non-goals

- no opening of Corpus V2
- no reset of motion numbering yet
- no renaming of Corpus V1 motion files
- no mutation of older Corpus V1 records beyond explicit hygiene fixes
- no provider/model calls
- no runtime execution, branch-write, PR, merge, scheduler, automation, API/DB,
  or persistence authority
