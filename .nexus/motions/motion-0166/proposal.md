# Proposal: Agent Work Packet to Task Prompt v0

**Motion:** motion-0166
**Kind:** builder-proof
**Program:** q2-agent-work-packet-task-prompt-v0
**Basis:** motion-0165

---

## 1. Problem statement

The repo now has a draft-only work packet surface, but there is not yet a
standardized task prompt layer that turns those packets into copyable,
deterministic operator prompts for future agent use.

The missing seam is a preview-only prompt builder that includes:

- assigned agent identity
- target repo and surface
- branch suggestion as suggestion-only
- allowed and blocked paths
- compatibility and execution-blocked posture
- human gates, verification commands, evidence expectations
- credential posture by env var name only

---

## 2. Scope

In scope:

- `portal/src/app/operator/work/page.tsx`
- `portal/src/lib/agents/workPackets.ts`
- `portal/src/lib/agents/workPacketTypes.ts`
- `portal/src/lib/agents/workPacketTaskPrompts.ts`
- `.nexus/motions/motion-0166/**`

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

Add a deterministic task prompt schema and builder for draft work packets and
render prompt previews directly on `/operator/work`.

Prompts remain preview/copy only and must explicitly say:

- do not execute unless separately authorized by the operator

The prompt builder must validate assigned agent identity and compatibility
against the existing agent registry and work packet compatibility model.

---

## 4. Acceptance criteria

- `/operator/work` renders task prompt previews
- every initial work packet can generate a prompt
- prompts include agent id, target repo/surface, branch suggestion, allowed and blocked paths
- prompts include human gates, verification commands, evidence expectations, and credential posture
- prompts block shared alias assignment and warn or block on incompatible scope/capability
- no execution or write controls are introduced
- required gates pass
