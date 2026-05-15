# Fixture Drift Response Playbook v0

## Purpose

Define the manual response path for CONTROL_THREAD when sandbox fixture
validation fails or the `/operator/corpus` sandbox summary drifts from the
underlying fixture set.

This playbook is manual and human-gated. It does not add automation, runtime
enforcement, or rejection of real data based on fixture examples.

## Trigger conditions

Use this playbook when:

- `node portal/scripts/validate-sandbox-fixtures.mjs` fails
- fixture JSON changes without corresponding sandbox summary updates
- `/operator/corpus` shows stale or misleading fixture-review posture
- canonical voter identity examples drift from settled sandbox posture
- authority or human-boundary notes become unclear

## Manual response steps

1. Inspect the fixture diff.
2. Inspect validator output.
3. Determine whether the drift is expected or accidental.
4. Classify the drift.
5. Open a fix branch if correction is needed.
6. Preserve fixture-only, no-authority posture throughout the fix.
7. Refresh the motion snapshot only if motions are added or changed.

## Drift classes

Classify drift as one or more of:

- schema drift
- label drift
- voter identity drift
- authority-boundary drift
- human-boundary drift
- UI-summary drift

## Classification guidance

### Schema drift

The fixture structure no longer matches the documented static shape.

### Label drift

Required review-only, no-authority, or Corpus V2 not open labels are missing or weakened.

### Voter identity drift

Simulated governance voting examples stop using canonical governance voter identities.

### Authority-boundary drift

A fixture or summary implies provider dispatch, runtime execution, or write authority.

### Human-boundary drift

A fixture or summary weakens explicit human review or intervention requirements.

### UI-summary drift

The `/operator/corpus` summary no longer accurately reflects the current fixture set or validator posture.

## Response posture

The response must remain:

- manual
- review-only
- fixture-only
- non-authoritative
- non-automated

Do not auto-correct fixture drift.

## Fix branch note

If correction is needed, open a fix branch and route the change through the
normal motion or hygiene path appropriate to the scope of the change.

## Non-goals

This playbook does not:

- open Corpus V2
- reset numbering
- add runtime enforcement
- add automation
- reject real data based on fixture examples
- grant any new authority

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
