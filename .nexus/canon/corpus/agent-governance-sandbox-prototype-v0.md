# Agent Governance Sandbox Prototype v0

## Purpose

Add the first static and local agent-governance sandbox prototype for future
motion drafting, voting, and ratification review.

## Sandbox prototype definition

The sandbox prototype is a fixture-only review layer that demonstrates future
agent-operable governance shapes without live agent behavior or authority.

It is:

- static and local only
- review-only
- not canon by default
- not executable
- not live drafting
- not live voting
- not autonomous ratification

## Trace categories

The sandbox prototype may include these trace categories:

- `motion_draft_trace`
- `role_lens_contribution_trace`
- `vote_trace`
- `ratification_trace`
- `validation_evidence_trace`
- `human_operator_boundary_trace`

## Fixture-only constraints

Sandbox prototype materials must remain:

- static or local only
- review-only
- not canon by default
- non-executable
- non-live
- non-authoritative

They must not:

- dispatch providers or models
- execute live agents
- write branches
- create PRs
- merge changes
- schedule tasks
- ratify motions autonomously

## Relationship to Corpus V2 readiness

The sandbox prototype supports readiness inspection by giving operators
something concrete to review while keeping Corpus V2 gated and unopened.

It does not satisfy readiness by itself.

## Relationship to sandbox boundary

This prototype is governed by:

- `agent-governance-sandbox-boundary-v0.md`

That boundary remains controlling for what sandbox materials may and may not
do.

## Relationship to drafting and voting designs

This prototype connects to:

- `agent-motion-drafting-design-v0.md`
- `agent-voting-ratification-design-v0.md`
- `corpus-v2-pre-opening-operator-checklist.md`

The prototype illustrates reviewable shapes derived from those designs without
claiming live activation.

## Non-goals

This prototype does not:

- open Corpus V2
- reset numbering
- enable live drafting
- enable live voting
- enable autonomous ratification
- add automation
- add machine enforcement

## Authority boundary

This prototype preserves the settled authority boundary:

- no provider or model calls
- no Agent runtime execution
- no branch-write authority
- no PR-creation authority
- no merge authority
- no scheduler
- no automation
- no API or DB mutation
- no hidden persistence

## Canon note

Fixture outputs are not canon unless they are later motionized explicitly.
