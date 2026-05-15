# Proposal: Corpus V2 Readiness Gate v0

## Purpose

Define the exact readiness gates that must be satisfied before Corpus V2 can
open.

## Scope

- add a readiness gate artifact under `.nexus/canon/corpus/**`
- encode the required Corpus V2 readiness gates explicitly
- state Corpus V2 is gated and not open
- state motion numbering is not reset yet
- state no live JAI Agent voting exists yet
- state no runtime execution, branch-write, PR, merge, scheduler, automation,
  API/DB, or hidden authority is granted
- refresh the bundled motion snapshot through `motion-0197`

## Non-goals

- no opening of Corpus V2
- no numbering reset yet
- no claim that live agent motion drafting or voting exists already
- no implementation of a ratification engine or workflow runtime
- no provider/model calls
- no runtime execution or write authority
