# Agent Voting and Ratification Design v0

## Purpose

Define the future design for canonical JAI Agent voting and visible
ratification in Corpus V2.

This artifact is design-only canon. Live agent voting is not active.
Autonomous ratification is not active.

## Voter identity model

Current recent canonical three-voter posture uses:

- `jai-proposer`
- `jai-challenger`
- `jai-arbiter`

Additional governance-lane identities may exist in the registry, including:

- `jai-council-root`
- `jai-executor`

Important note:

- `jai-executor` is governance-lane, but it is not part of the current recent
  canonical three-voter posture unless a later motion routes it explicitly

## Vote record shape guidance

Future visible vote records should include, at minimum:

- canonical voter identity
- vote value
- reason
- timestamp
- evidence reference
- human intervention field when needed

Vote records should remain explicit about who cast a governance vote and what
supporting evidence or intervention shaped the record.

## Distinction model

Future Corpus V2 voting must distinguish:

- governance voters
- execution or lens participants
- human operator intervention

Governance voter identities must not be replaced by execution or lens labels in
modern `vote.json` records.

## Ratification visibility model

Future ratification should be:

- visible
- governed
- attributable
- linked to the motion package and decision record

Visible ratification does not imply autonomous ratification. Human review and
approval boundaries remain explicit until separately changed.

## Human intervention model

Where human intervention occurs, future records should make that intervention
explicit rather than flattening it into a vote identity.

Possible uses include:

- override or approval marker
- audit note
- evidence reference
- exception handling note

## Relationship to PR #151

PR `#151` remains the relevant post-motion hygiene fix for modern voter
identity cleanup in motions `0191` through `0195`.

It preserved the current recent canonical mapping:

- `ARCHITECT` -> `jai-proposer`
- `VERIFIER` -> `jai-challenger`
- `OPERATOR` -> `jai-arbiter`

This design preserves that posture.

## Relationship to motion-0199

Motion `0199` documents the distinction between:

- role or lens assignment fields in `motion.yaml`
- canonical governance voter identities in `vote.json`
- human intervention in Corpus V1 manual governance

This design carries that distinction forward into future Corpus V2 voting
design without claiming live activation.

## Non-goals

This design does not:

- enable live agent voting
- enable autonomous ratification
- open Corpus V2
- reset numbering
- grant runtime or write authority

## Authority boundary

This voting and ratification design preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
