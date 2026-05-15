# Sandbox Validator Evidence Record v0

## Purpose

Document what the static sandbox fixture validator checks and what a passing run
means for Corpus V2 readiness inspection.

This record describes validation evidence only. It does not open Corpus V2,
reset numbering, or grant any runtime or governance authority.

## Validator command

Run:

- `node portal/scripts/validate-sandbox-fixtures.mjs`

## Fixture files checked

The validator checks these static local fixtures:

- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/motion-draft.v0.json`
- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/vote-ratification-trace.v0.json`
- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/failure-traces.v0.json`
- `.nexus/fixtures/corpus-v2/agent-governance-sandbox/gate-evidence.v0.json`

## Fields checked

The validator checks:

- required top-level fixture identity fields
- allowed fixture types
- required review and authority labels
- human review or intervention fields
- category-specific structural expectations for each fixture file

## Canonical voter identity checks

For the vote and ratification fixture, the validator checks that vote traces use
only:

- `jai-proposer`
- `jai-challenger`
- `jai-arbiter`

It rejects execution or role-lens labels as simulated governance voters in that
fixture shape.

## Authority and review label checks

The validator checks that fixtures preserve explicit static/manual review
posture, including labels such as:

- `Fixture-only`
- `Simulated`
- `Review-only`
- `No authority` or `Non-authoritative`
- `Corpus V2 not open`

## Human boundary checks

The validator checks that human review or intervention remains explicit where
the simulated flow would otherwise look autonomous.

## What PASS means

PASS means the current sandbox fixture files match the expected static shape and
label posture documented in canon.

PASS means:

- fixture JSON parses
- required fields are present
- vote traces keep canonical governance voter identities
- review and authority labels remain explicit
- human review and intervention fields remain present where expected

## What PASS does not mean

PASS does not mean:

- live agents exist
- Corpus V2 is open
- fixtures are canon by default
- live drafting exists
- live voting exists
- autonomous ratification exists
- runtime enforcement exists
- scheduler or automation exists
- provider or model calls are authorized
- branch-write, PR creation, merge, execution, API, DB, or hidden persistence authority is granted

## Evidence note

This validator is a static/manual evidence aid. A passing run supports review
and inspection only and must not be treated as runtime policy enforcement.
