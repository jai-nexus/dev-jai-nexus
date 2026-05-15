# Sandbox Fixture Schema Guards v0

## Purpose

Add lightweight schema and review guardrails for fixture-only sandbox JSON
shapes used in Corpus V2 readiness inspection.

These guards improve consistency across sandbox fixtures without opening
Corpus V2, resetting numbering, or granting any live authority.

## Guardrail model

Sandbox fixture guardrails define a review-only expectation for durable fixture
shape. They exist to make simulated examples easier to compare, inspect, and
reuse.

The guardrail model is:

- static and local
- review-only
- non-authoritative
- fixture-only
- not runtime enforcement

## Required fixture fields

Every sandbox fixture should include these baseline fields where applicable:

- `fixture_id`
- `fixture_type`
- `fixture_status`

Category-specific records should also carry explicit review metadata such as:

- canonical voter identities when vote traces are present
- authority-boundary labels
- human review or intervention fields
- source design or canon references

## Fixture categories

These guardrails currently cover:

- motion draft fixture
- vote/ratification fixture
- failure trace fixture
- gate evidence fixture

## Required authority labels

Sandbox fixtures should use explicit review labels such as:

- `Fixture-only`
- `Simulated`
- `Non-authoritative`
- `Review-only`
- `No authority`
- `Corpus V2 not open`
- `Guardrails only`
- `Not runtime enforcement`

## Canonical voter identity requirements

Where a sandbox fixture models governance voting, it should use canonical
governance voter identities only:

- `jai-proposer`
- `jai-challenger`
- `jai-arbiter`

Execution or role-lens labels must not be presented as `vote.json` voter
identities in sandbox voting examples.

## Human boundary requirements

Sandbox fixtures must preserve the manual review boundary by including explicit
human review, human intervention, or human approval notes where the modeled
flow would otherwise look autonomous.

## Relationship to existing fixtures

These guards apply to the current sandbox fixtures under:

- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/motion-draft.v0.json`
- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/vote-ratification-trace.v0.json`
- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/failure-traces.v0.json`
- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/gate-evidence.v0.json`

## Non-goals

This guard seam does not:

- open Corpus V2
- reset numbering
- enable live drafting
- enable live voting
- enable autonomous ratification
- add runtime execution
- add provider or model calls
- add automation
- reject real data based on fixture examples

## Authority boundary

The settled authority boundary remains unchanged:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
- no hidden persistence

## Enforcement note

These guards are documentation and review aids only. They are not runtime
enforcement and must not be described as machine-enforced policy.
