# Proposal: Agent Work Packet Drafting v0

**Motion:** motion-0165
**Kind:** builder-proof
**Program:** q2-agent-work-packet-drafting-v0
**Basis:** motion-0164

---

## 1. Problem statement

The repo now has a configuration-only agent registry, but there is still no
draft-only operator surface that links those configured JAI agents to proposed
repo work.

The missing seam is a read-only work packet surface that shows:

- which named JAI agent a packet targets
- whether the repo is in scope
- whether requested draft capabilities are compatible
- that execution remains blocked in v0
- what human gates and evidence are still required

---

## 2. Scope

In scope:

- `portal/src/app/operator/work/page.tsx`
- `portal/src/lib/agents/workPackets.ts`
- `portal/src/lib/agents/workPacketTypes.ts`
- `.nexus/motions/motion-0165/**`

Out of scope:

- execution enablement
- branch writes
- PR creation
- dispatch or scheduler behavior
- DB writes
- API mutation
- runtime changes
- mutation of existing motion packages

---

## 3. Implementation

Replace the old `/operator/work` execution queue with a read-only draft work
packet registry linked to configured named JAI agents.

Initial seed packets should cover:

- landing page homepage refresh
- customer portal intake map
- agent registry follow-up
- API contract review

Each packet should show registry linkage, capability compatibility, human
gates, evidence expectations, and credential posture by env var name only.

---

## 4. Acceptance criteria

- `/operator/work` route renders
- seed packets render
- packets link to configured named agents
- shared alias is not assignable as execution identity
- repo-scope and requested capability status render
- execution is explicitly disabled
- no run/dispatch/execute or branch-write/PR controls exist
- human gates and evidence expectations render
- required gates pass
