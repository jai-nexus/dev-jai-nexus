# Agent Motion Drafting Design v0

## Purpose

Define the future design for JAI Agents drafting motions internally to
`dev.jai.nexus`.

This is future-state design only.

## Draft-state model

Future motion drafting should distinguish these states:

- `proposed`
- `under_review`
- `challenged`
- `revised`
- `ready_for_vote`
- `rejected`

These states describe draft governance posture only. They do not imply that
live agent drafting exists today.

## Drafting roles

Future drafting should distinguish:

- proposer
- challenger
- arbiter
- verifier or lens contributor
- human operator

Role notes:

- proposer owns the initial draft package
- challenger tests scope, assumptions, and readiness
- arbiter resolves whether the draft is ready to move forward
- verifier or lens contributor may add bounded evidence or reasoning support
- human operator retains the final review boundary until a later authority seam
  says otherwise

## Required draft outputs

Before a draft can be considered `ready_for_vote`, it should produce:

- `motion.yaml`
- `proposal.md`
- `challenge.md`
- `execution.md` or `plan.md`
- `vote.json` placeholder
- explicit validation expectations

Draft outputs must remain deterministic and schema-valid before Corpus V2 can
open.

## Identity and intervention distinction

This design must preserve the distinction between:

- governance voter identities
- execution or lens participants
- human operator intervention

The draft path must not collapse reasoning contributors into governance voter
identities.

## Human boundary

- no live JAI Agent drafting exists yet
- no provider or model calls are introduced here
- no runtime agent authority is introduced here
- human operator boundaries remain required

## Relationship to readiness

This design supports the future readiness gate for internal agent motion
drafting but does not satisfy that gate by itself.

It depends on:

- deterministic package generation
- schema validity
- visible human review boundaries
- separate authority motions if any runtime capability is ever requested

## Non-goals

This design does not:

- implement live drafting
- add provider or model calls
- add runtime execution
- open Corpus V2
- reset numbering
- grant write, PR, merge, or execution authority

## Authority boundary

This drafting design preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
