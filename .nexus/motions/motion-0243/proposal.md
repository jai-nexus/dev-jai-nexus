# Proposal: Corpus Namespace Snapshot Model v0

## Purpose

Define the corpus namespace and snapshot model needed before Corpus V2 can
open, clarifying how future corpus-aware snapshots distinguish Corpus V1 from
Corpus V2 without opening Corpus V2 or resetting motion numbering now.

## Scope

- add a corpus namespace and snapshot model artifact under `.nexus/canon/`
- define current Corpus V1 and future Corpus V2 namespace posture
- define conceptual snapshot and decision-record model additions
- define reset and carry-forward rules
- add one compact root overview note
- preserve current Corpus V1 snapshot format
- refresh the bundled motion snapshot through `motion-0243`

## Non-goals

- opening Corpus V2
- resetting numbering
- creating Corpus V2 motion files
- mutating the current snapshot generator
- changing current Corpus V1 snapshot format
