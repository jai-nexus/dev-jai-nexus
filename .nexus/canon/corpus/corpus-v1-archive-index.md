# Corpus V1 Archive Index

## Purpose

This artifact indexes Corpus V1 as historical governance canon for search,
handoff, audit, and future Corpus V2 readiness work.

It does not open Corpus V2 and does not reset motion numbering.

## Corpus V1 archive/index posture

- Corpus V1 is the manual-governance corpus.
- Corpus V1 is preserved as historical canon, training record, and audit
  record.
- Corpus V1 records are immutable except through explicit hygiene fixes.
- This artifact is an index and reference layer, not a mutation of historical
  records.

## Key Corpus V1 phases

### Manual-governance foundation

Corpus V1 established the manual-governance operating posture:

- manual motions
- external chat-driven passalongs
- human-operated `CONTROL_THREAD`
- human-mediated repo execution
- manual ratification records

### Operator-loop foundation

Corpus V1 then consolidated the operator loop around deterministic and
copy-safe control-plane behavior:

- root operator status overview
- deterministic agenda
- deterministic deliberation
- copy-only passalong block
- agenda-to-deliberation routing
- eligible candidate review posture

### Cross-repo ownership/routing sweep

The late Corpus V1 sweep clarified repo-local ownership and routing:

- `motion-0194`: Cross-Repo Canonical Timeline and Golden Script Routing v0
- `motion-0195`: Cross-Repo Ownership Sweep Consolidation v0

Settled repo-local boundaries were recorded for:

- `audit-nexus`
- `docs-nexus`
- `jai`
- `jai-nexus`
- `api-nexus`
- `jai-format`
- `orchestrator-nexus`

### Corpus transition modeling

Corpus transition work defined the era model and readiness posture:

- `motion-0196`: Corpus V1 Closeout and Corpus Model v0
- `motion-0197`: Corpus V2 Readiness Gate v0
- `motion-0198`: Operator Surface for Corpus Transition v0

### Schema hygiene and post-motion fixes

Corpus V1 historical compatibility and maintenance are tracked through:

- PR `#151`: corrected `vote.json` voter identity drift
- `motion-0199`: Motion Governance Schema Hygiene v0
- historical schema variants documented as archival compatibility notes

## Hygiene-fix register

### PR #151

PR `#151` is a post-motion hygiene fix recorded against Corpus V1 history.

- corrected motions `0191` through `0195` `vote.json` voter identity drift
- replacements:
  - `ARCHITECT` -> `jai-proposer`
  - `VERIFIER` -> `jai-challenger`
  - `OPERATOR` -> `jai-arbiter`
- no motion number consumed
- no outcomes, statuses, timestamps, or result fields changed

## Known schema-era variants

Corpus V1 historical schema variants include:

- NHID-style `motion.yaml` fields:
  - `proposer_nh_id`
  - `council_nh_id`
- role/lens assignment fields:
  - `proposer: ARCHITECT`
  - `challenger: VERIFIER`
  - `arbiter: OPERATOR`
- mid-era role-slot `vote.json` records:
  - `votes[].role`
  - `proposer`
  - `challenger`
  - `arbiter`
- recent canonical `vote.json` voter identities:
  - `jai-proposer`
  - `jai-challenger`
  - `jai-arbiter`

These variants are documented in
`motion-governance-schema-hygiene-v0.md` as compatibility notes rather than
targets for retroactive normalization.

## Relationship to Corpus V2 readiness

- Corpus V2 is the future agent-operable corpus.
- Corpus V2 is gated and not open.
- Motion numbering may reset in a future Corpus, but not here.
- Corpus V2 should not inherit Corpus V1 schema ambiguity as active behavior.
- Corpus V2 readiness still requires:
  - live agent motion drafting
  - canonical voting
  - visible ratification
  - deterministic motion package generation
  - workflow-ready outputs
  - snapshot gates
  - authority boundaries

## Non-goals

This archive index does not:

- open Corpus V2
- reset numbering
- rewrite historical records
- normalize old motion packages
- add live voting
- add runtime authority
- add API or DB mutation
- create a passalong index
- introduce live heartbeat semantics

## Authority boundary

This archive index preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
- no hidden persistence
- no passalong index
- no ToolchainModule registry
- no per-agent pages
- no live heartbeat behavior
