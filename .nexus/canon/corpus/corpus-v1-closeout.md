# Corpus V1 Closeout

## Purpose

Record the current closeout posture for Corpus V1 while preserving it as
historical governance canon.

## Current status

Corpus V1 remains the active corpus in closing posture.

- latest settled pre-closeout baseline motion: `motion-0195`
- later Corpus V1 closeout planning motions may extend the sequence explicitly
- Corpus V2 behaviors are not active in Corpus V1

## Corpus V1 characteristics

Corpus V1 is defined by:

- manual motions
- external chat-driven passalongs
- human-operated `CONTROL_THREAD`
- human-mediated repo execution
- manual ratification records
- early governance schema evolution
- post-motion hygiene fixes only when explicit

## Post-motion hygiene fix PR #151

PR `#151` is a post-motion hygiene fix inside Corpus V1.

It:

- corrected `vote.json` voter identity drift in motions `0191` through `0195`
- replaced execution/lens labels with canonical governance voter identities
- consumed no new motion
- changed no outcomes, statuses, timestamps, or result fields

Corrected mappings:

- `ARCHITECT` -> `jai-proposer`
- `VERIFIER` -> `jai-challenger`
- `OPERATOR` -> `jai-arbiter`

## Historical preservation policy

Corpus V1 records remain:

- historical canon
- training material
- audit record
- searchable operator reference

Corpus V1 records are not to be renamed, renumbered, or reopened. They remain
immutable except through explicit hygiene fixes.

## Non-transfer policy

Corpus V1 does not inherit Corpus V2 behavior by implication.

The following remain inactive in Corpus V1:

- live JAI Agent voting
- live motion drafting by agents
- governed ratification workflow driven by agents
- runtime execution authority
- branch-write, PR, merge, scheduler, or automation authority
