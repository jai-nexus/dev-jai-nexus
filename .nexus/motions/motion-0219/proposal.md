# Proposal: Sandbox Fixture Static Validator v0

## Purpose

Add a lightweight static/manual validator for sandbox fixture JSON shape.

## Scope

- add `portal/scripts/validate-sandbox-fixtures.mjs`
- validate the four sandbox fixture files under `.nexus/fixtures/corpus-v2/agent-governance-sandbox/`
- check required fields, allowed fixture types, canonical voter identities, labels, and human-boundary fields
- print deterministic manual gate output

## Non-goals

- no runtime enforcement
- no automation
- no scheduler hooks
- no API or DB behavior
- no Corpus V2 opening
