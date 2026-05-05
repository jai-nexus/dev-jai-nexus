# Proposal: Control Plane Authority Visibility v0

**Motion:** motion-0178
**Kind:** builder-proof
**Program:** q2m5-control-plane-authority-visibility-v0
**Basis:** motion-0177

---

## Problem statement

The repo now has settled workflow-role canon, settled docs-ops authority canon,
dry-run canon, and a static agent-assets library, but the current authority
posture is not surfaced clearly enough in existing operator pages.

Operators should be able to discover:

- which workflow roles exist
- which docs-ops levels are planning-safe
- which levels remain modeled disabled
- that agent assets are static material only
- which capabilities remain explicitly blocked

This should be visible without introducing any new authority surface.

---

## Scope

In scope:

- add a static authority posture model under `portal/src/lib/controlPlane/`
- update `/operator/agents` to show workflow roles, docs-agent posture, and
  agent-assets status
- update `/operator/work` to show docs-ops levels and blocked capabilities
- add the `motion-0178` governance packet

Out of scope:

- docs-nexus edits
- jai-nexus edits
- Level 3 activation
- Level 4 activation
- Level 5 activation
- branch-write authority
- PR-creation authority
- execution authority
- automation
- scheduler
- hidden persistence
- credentials
- provider dispatch
- API or DB mutation
- live capture
- autonomous merge
- new API routes

---

## Deliverables

### 1. Static authority posture model

Define a read-only model that exposes:

- workflow roles
- docs-ops levels and current posture
- agent-assets status and location
- blocked capabilities

### 2. Operator surface visibility

`/operator/agents` should show:

- workflow roles
- docs-agent posture
- Agent Assets Library status

`/operator/work` should show:

- docs-ops levels 0 through 5
- exercised/planning-safe vs modeled-disabled status
- blocked capabilities

### 3. Explicit guardrail copy

The surfaces must explicitly say:

- visibility is read-only
- assets do not grant authority
- disabled authority remains disabled
- no branch, PR, execution, automation, or scheduler capability is enabled

---

## Acceptance criteria

- CPAV-01 Workflow roles visible or clearly referenced
- CPAV-02 Docs-ops Levels 0/1/2 shown as exercised or planning-safe
- CPAV-03 Docs-ops Levels 3/4/5 shown as modeled disabled
- CPAV-04 Agent Assets Library shown as static reusable operating material
- CPAV-05 Explicit copy states assets do not grant authority
- CPAV-06 Explicit copy states disabled authority remains disabled
- CPAV-07 No new authority introduced
- CPAV-08 No docs-nexus or jai-nexus files touched
- CPAV-09 No API/DB mutation introduced
- CPAV-10 No automation, scheduler, provider dispatch, credential, hidden persistence, live capture, or execution capability added
- CPAV-11 Existing operator surfaces remain usable
- CPAV-12 validate-motion passes
- CPAV-13 validate-agency passes
- CPAV-14 portal typecheck passes
