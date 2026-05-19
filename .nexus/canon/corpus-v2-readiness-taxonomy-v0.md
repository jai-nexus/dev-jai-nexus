# Corpus V2 Readiness Taxonomy v0

## Purpose

Define the readiness taxonomy for opening Corpus V2, including what Corpus V2
means, what must be true before it opens, what resets, what carries forward,
and how JAI Agent operability differs from Corpus V1 manual motions.

This artifact is docs/canon/static UI only. It does not open Corpus V2.

## Source baseline

- `dev-jai-nexus` is settled through `motion-0241`
- Corpus V1 remains the active manual-governance corpus
- Corpus V2 readiness remains inspectable but not open
- Edge Runner dry-run and evidence validation substrates are settled as
  source-side, non-executing governed inputs only

## Corpus V1 definition

Corpus V1 is the current manual-governance corpus.

Corpus V1 characteristics:

- manual motions
- human-routed passalongs
- static and canon-driven governance
- dry-run automation substrate only
- no autonomous execution
- no live agent voting
- no live provider/model dispatch
- no branch or PR automation

## Corpus V2 definition

Corpus V2 is a future corpus namespace, not yet opened, that would begin as a
clean reset to `motion-0001`.

Corpus V2 characteristics, once later opened by explicit motion:

- clean reset to `motion-0001`
- new corpus namespace
- JAI Agents fully operable under explicit limits
- motion packages generated with stronger machine assistance
- agent roles and voter identities canonicalized
- dry-run and evidence substrates usable as governed inputs
- execution still separately gated unless explicitly authorized

## Reset model

Corpus V2 resets corpus-local governance lineage:

- motion numbering
- corpus-local decision records
- corpus-local snapshot lineage
- corpus-local ratification sequence

This reset is future-only. It is not performed by this artifact.

## Carry-forward model

Corpus V2 carries forward settled boundaries and historical context:

- repo ownership boundaries
- authority denials unless explicitly changed
- Edge Runner dry-run substrate
- paid-beta and customer-data restrictions
- voter identity hygiene
- JAI Agent role taxonomy, if settled
- validation gates
- historical Corpus V1 archive

## Corpus V2 readiness gates

Before Corpus V2 may open, the following gates should be defined and reviewed:

- canonical agent role and voter identity taxonomy
- motion schema v2 or schema hygiene complete
- corpus namespace model
- snapshot model supports corpus id or corpus version
- dry-run substrate visible and validated
- evidence validation posture represented
- passalong format stable
- human override and abort rules defined
- no autonomous execution unless separately authorized
- no provider/model calls unless separately authorized
- no branch or PR automation unless separately authorized

## JAI Agent operability distinction

Corpus V1 remains human-routed and manual. JAI Agents may inform drafts,
fixtures, or readiness posture, but they do not participate as fully operable
governance actors.

Corpus V2 is intended to begin only when JAI Agent operability is explicit
enough for governed participation under clear limits. That means:

- canonicalized agent roles
- canonicalized voter identities
- stable schema and snapshot lineage
- dry-run and evidence inputs visible as governed inputs
- defined human override and abort posture

Agent operability in Corpus V2 is distinct from execution authority. Even if
agent operability becomes sufficient for governed participation, execution
remains separately gated.

## Edge Runner substrate relationship

The Edge Runner substrate contributes readiness inputs to Corpus V2 but does
not itself authorize opening or execution.

Relevant settled substrate posture:

- dry-run plan generation exists
- dry-run plan validation exists
- evidence validation exists
- structured schemas, fixtures, and harnesses exist
- source-side validation can be cited as governed readiness input

The Edge Runner substrate does not authorize:

- command execution
- runner execution
- scheduler authority
- automation execution
- branch-write authority
- PR creation or merge authority

## Explicitly not authorized by this readiness taxonomy

This artifact does not authorize:

- opening Corpus V2 immediately
- resetting numbering now
- live provider/model calls
- autonomous execution
- branch-write authority
- PR creation or merge authority
- scheduler authority
- production deployment
- customer workloads
- customer data collection
- payment or billing handling

## Non-goals

- opening Corpus V2
- resetting motion numbering
- mutating `orchestrator-nexus`
- mutating `jai-nexus`
- mutating `api-nexus`
- mutating `jai`
- mutating `audit-nexus`
- mutating `docs-nexus`
- enabling provider/model calls
- enabling live agent voting
- enabling autonomous execution

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

This artifact defines readiness taxonomy only. It does not open Corpus V2 or
change current authority posture.
