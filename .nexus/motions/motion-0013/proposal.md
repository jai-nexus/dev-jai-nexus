# Proposal (motion-0013)

## 0.0 Problem
JAI NEXUS contains multiple overlapping concepts:
- agents (NHIDs in nexus-core)
- roles (behavioral contracts in dev-jai-nexus)
- council (governance protocol and motion lifecycle)
- panels (multi-model candidate + selector system)
- routing (how messages/tasks decide the next hop)

Without explicit boundaries, the system risks:
- identity/behavior drift (who an agent is vs what it can do)
- duplicated sources of truth
- unclear “where does the message go next?” behavior
- brittle pivots

## 1.0 Goal
Define canonical boundaries with a single SoT rule for each concept.
This motion is *docs-only*: it codifies vocabulary and rules, not implementation.

## 2.0 Definitions (v0)
### 2.1 Agent Identity (WHO)
An Agent is a stable identity used for accountability and assignment across time.
- Identity must be stable (NHID).
- Identity does not define behavior; it binds to a behavior contract via role assignment and routing.

### 2.2 Role Behavior (WHAT)
A Role is a behavioral contract that specifies:
- allowed tasks
- constraints (paths, evidence requirements, safety rules)
- expected outputs

Roles are NOT identities; they are contracts that identities can be assigned to.

### 2.3 Council Governance (HOW DECISIONS BECOME CANON)
Council is the governance protocol that turns work into durable, auditable canon.
It defines:
- motion lifecycle
- required/optional gates
- vote evaluation mode (unanimous_consent)
- ratification requirements

### 2.4 Panels (HOW WE GET THE BEST OUTPUT FOR A ROLE)
Panels are the quality layer:
- 5 candidate outputs (model slots)
- 1 selector that scores via rubric
- durable selection record artifacts under motions

Panels are NOT the council; they produce a recommended output and justification.
Council is still the canonical ratifier.

### 2.5 Routing (WHERE A MESSAGE GOES NEXT)
Routing is the deterministic mapping from “a task/message” -> next responsible unit.
Routing chooses:
- target domain/repo (or leaves unknown and asks)
- role contract
- agent identity assignment
- whether to invoke a panel

Routing must produce a durable “route decision record”.

## 3.0 Single Source of Truth (SoT) Rules
### 3.1 Agent Identity SoT
SoT: nexus-core registry index (agents.index.json / agents.generated.yaml)
- Purpose: canonical list of agent NHIDs + domain/repo assignment
- Change rule: changes require a motion in dev-jai-nexus (or a registry lock process) that updates the registry input and regenerates indexes.

### 3.2 Role Behavior SoT
SoT: dev-jai-nexus/roles/*.md + roles/rolemap.json
- Purpose: canonical contracts and path permissions for behavior.
- Change rule: changes require a motion touching roles/ or rolemap.json.

### 3.3 Council SoT
SoT: portal/scripts/council-run.mjs + .nexus/council.config.yaml + motion artifacts under .nexus/motions/
- Purpose: canonical governance protocol + configuration + durable records.
- Change rule: changes require a motion targeting dev-jai-nexus.

### 3.4 Panels SoT
SoT: .nexus/agent-panels.yaml + .nexus/model-slots.yaml + motion-local artifacts at .nexus/motions/<id>/panels/
- Purpose: canonical definition of role panels and durable per-motion selection records.
- Change rule: changes require a motion targeting dev-jai-nexus.

### 3.5 Routing SoT (declared, not yet implemented)
SoT (v0 declaration):
- Spec: portal/docs (or .nexus/docs) routing spec doc (to be created in motion-0014)
- Records: SoT events or JSONL trace file (to be implemented)
- Change rule: routing changes require motions, not ad-hoc edits.

## 4.0 Acceptance Criteria
- A durable doc exists in-repo that states these boundaries and SoT rules.
- Doc is referenced by motion-0013 execution.
- No code changes required.

## 5.0 Next Motions
- motion-0014: Router v0 spec + route decision record format
- motion-0015: Router v0 implementation (internal API + SoT event emission)
