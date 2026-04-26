# Proposal: JAI Agent Configuration Registry v0

**Motion:** motion-0164
**Kind:** builder-proof
**Program:** q2-agent-configuration-registry-v0
**Basis:** motion-0162

---

## 1. Problem statement

`/operator/motions` makes motion state visible before live execution is
enabled, but there is no equivalent read-only surface for named JAI agent
configuration.

Today the repo has partial identity clues:

- `admin@jai.nexus` is the current human operator login
- `agent@jai.nexus` is a shared alias
- agent execution and write controls remain intentionally disabled

What is missing is one explicit registry that shows:

- which named JAI agents exist conceptually
- how they differ from human operators and shared aliases
- what repo scopes they are intended to cover
- which capabilities are only view or preview posture
- which credentials are reserved by env-var name only

---

## 2. Scope

In scope:

- `portal/src/app/operator/agents/page.tsx`
- `portal/src/lib/agents/agentRegistry.ts`
- `portal/src/lib/agents/types.ts`
- `.nexus/motions/motion-0164/**`

Out of scope:

- execution enablement
- runtime changes
- branch writes
- PR creation
- dispatch, scheduling, or orchestration
- DB writes
- API mutation
- secret values
- mutation of existing motion packages

---

## 3. Implementation

Add a read-only operator route at `/operator/agents` backed by a static
registry model. The surface should:

- distinguish human operators from shared aliases and named JAI agents
- show named agents as future identities with `execution_identity: false`
- render a capability matrix with write and execute states disabled
- render a repo-scope matrix for the initial agent set
- render credential posture using env var names only

The registry is configuration-only. It does not grant live execution or
GitHub write ability.

---

## 4. Acceptance criteria

- `/operator/agents` route renders
- Operator subnav includes `Agents`
- initial named agent list renders
- `agent@jai.nexus` is marked shared alias and view-only
- named agents show execution disabled
- capability and repo-scope matrices render
- credential posture shows env var names only
- no API route or DB write is added
- required gates pass
