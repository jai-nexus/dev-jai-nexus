# Paid Beta Gate Status Model v0

## Purpose

Define a small static status vocabulary for paid-beta gates so routing/canon
artifacts and read-only operator summaries can describe cross-repo readiness
consistently.

## Status Vocabulary

| Status | Meaning |
| --- | --- |
| `not_started` | no concrete boundary or planning artifact exists yet |
| `planned` | the gate is acknowledged and routed, but remains mostly future work |
| `boundary_defined` | a boundary or planning artifact exists, but implementation is not authorized |
| `preflight_defined` | a review/preflight artifact exists, but implementation is not authorized |
| `blocked_by_missing_owner` | work cannot proceed until a clear owner or routing decision is established |
| `blocked_by_security_review` | work cannot proceed until privacy/security review is routed or completed |
| `blocked_by_infrastructure` | work cannot proceed until production infrastructure boundary/selection work is routed later |
| `blocked_by_auth_billing` | work cannot proceed until auth/account/billing seams are planned explicitly |
| `ready_for_implementation_planning` | prerequisites are documented enough to begin a later implementation-planning seam, not implementation itself |
| `implementation_authorized` | a later motion would have to explicitly authorize implementation; no current gate has this status |

## Status Assignment Rules

- use `boundary_defined` when a planning/boundary artifact exists
- use `preflight_defined` when a privacy/security or review preflight exists
- use `planned` when the direction is known but the concrete boundary artifact is still missing
- use `blocked_*` statuses when a specific dependency prevents further planning
- use `ready_for_implementation_planning` only when deeper implementation planning is the next logical seam
- do not use `implementation_authorized` unless a later explicit motion grants it

## Current Authorization Posture

No current paid-beta gate reaches `implementation_authorized`.

Current posture remains:

- paid beta not open
- payment not authorized
- customer data not authorized
- production not selected
- local machines not customer-serving

## Non-Goals

- authorizing implementation
- opening paid beta
- creating runtime enforcement
- adding automation
- mutating any other repo

## Authority Boundary

- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler/automation
- No API/DB mutation
- No backend persistence
- No auth implementation
- No live Stripe

This status model is read-only, local, and descriptive only.
