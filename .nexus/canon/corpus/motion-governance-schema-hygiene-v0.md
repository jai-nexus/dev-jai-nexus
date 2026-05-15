# Motion Governance Schema Hygiene v0

## Purpose

This canon reduces Corpus V2 inheritance risk by documenting known Corpus V1
motion-governance schema drift across eras.

It clarifies how historical motion role/lens assignment fields relate to
modern canonical governance voter identities.

It does not rewrite historical outcomes.

## Corpus V1 schema-era overview

Corpus V1 contains multiple schema-era variants.

### 1. NHID-style motion fields

Representative motions:

- `motion-0147`
- `motion-0148`
- `motion-0149`

Observed characteristics:

- `motion.yaml` includes `proposer_nh_id`
- `motion.yaml` includes `council_nh_id`
- `vote.json` uses `votes[].role`
- role values are `proposer`, `challenger`, `arbiter`
- `vote_mode` and `required_roles` are explicit

This era tied governance posture more directly to NHID-rooted or council-rooted
manual governance metadata than to named JAI agent voter identities.

### 2. Role/lens assignment style in motion.yaml

Representative motions:

- `motion-0158`
- `motion-0191`
- `motion-0198`

Observed characteristics:

- `motion.yaml` uses:
  - `proposer: ARCHITECT`
  - `challenger: VERIFIER`
  - `arbiter: OPERATOR`
- these fields act as role/lens assignment labels for drafting or reasoning
  posture inside Corpus V1 manual governance
- they do not by themselves settle the modern `vote.json` voter identity layer

### 3. Mid-era role-slot vote records

Representative motions:

- `motion-0158`
- many `0150+` motions before the recent `voter` field transition

Observed characteristics:

- `vote.json` still uses `votes[].role`
- role values remain `proposer`, `challenger`, `arbiter`
- vote records remain unanimous-consent role-slot records rather than named
  governance identities

### 4. Recent voter-field records

Representative motions:

- `motion-0191`
- `motion-0192`
- `motion-0193`
- `motion-0194`
- `motion-0195`
- `motion-0196`
- `motion-0197`
- `motion-0198`

Observed characteristics:

- `vote.json` uses `votes[].voter`
- post-PR-151 canon uses canonical governance identities:
  - `jai-proposer`
  - `jai-challenger`
  - `jai-arbiter`

## Role/lens vs voter identity distinction

- Execution/lens labels may appear as motion drafting, reasoning, or role
  assignment labels.
- Canonical governance voter identities must be used in modern `vote.json`
  `votes[].voter` fields.
- `motion.yaml` role/lens fields and `vote.json` voter fields are related, but
  they are not always the same schema layer.
- In recent settled motion voting posture, the canonical governance voter
  identities are:
  - `jai-proposer`
  - `jai-challenger`
  - `jai-arbiter`

Corpus V1 compatibility posture therefore permits historical `motion.yaml`
role/lens labels while requiring modern `vote.json` voter hygiene where that
schema layer is used.

## Agent identity distinction

Execution/lens agents include, at minimum:

- `jai-architect`
- `jai-builder`
- `jai-verifier`
- `jai-librarian`
- `jai-operator`

Governance voter identities include, for current recent motion voting posture:

- `jai-proposer`
- `jai-challenger`
- `jai-arbiter`

Additional governance-lane identity:

- `jai-executor`

Important note:

- `jai-executor` is a canonical governance-lane identity in the registry, but
  it was intentionally not used as the PR `#151` replacement for `VERIFIER`
  when correcting motions `0191` through `0195`.

This canon does not overclaim live voting.

## Human operator intervention

- Corpus V1 ratification was human-mediated.
- Human `CONTROL_THREAD` and repo-execution chats remain part of Corpus V1
  manual-governance posture.
- Corpus V2 must explicitly distinguish human intervention from JAI Agent
  voting.
- Historical Corpus V1 vote records and decisions should therefore be read as
  governance records inside a manual-governance operating model, not proof of
  autonomous live agent voting.

## PR #151 relationship

PR `#151` was a post-motion hygiene fix.

It:

- corrected motions `0191` through `0195` `vote.json` voter identity drift
- replaced:
  - `ARCHITECT` -> `jai-proposer`
  - `VERIFIER` -> `jai-challenger`
  - `OPERATOR` -> `jai-arbiter`
- did not consume a motion number
- did not change outcomes, statuses, timestamps, or result fields

PR `#151` therefore corrected the modern voter-identity layer without rewriting
historical motion outcomes.

## Corpus V2 inheritance guardrails

- Corpus V2 must not inherit ambiguous Corpus V1 schema behavior as active
  governance behavior.
- Corpus V2 should use explicit canonical governance voter identities.
- Corpus V2 should distinguish:
  - governance voters
  - execution/lens participants
  - human interventions
  - runtime authority
- Corpus V2 should not open until readiness gates are met.
- Numbering reset is not performed here.

## Backward-compatibility posture

- Corpus V1 remains historical canon.
- Historical schema variants may remain as archival record.
- Historical records should not be mutated except through explicit hygiene
  fixes.
- This motion documents schema eras rather than rewriting them.
