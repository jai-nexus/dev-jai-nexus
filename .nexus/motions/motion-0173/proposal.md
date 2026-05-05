# Proposal: Q2M5 Control Thread Role Taxonomy v0

**Motion:** motion-0173
**Kind:** builder-proof
**Program:** q2m5-control-thread-role-taxonomy-v0
**Basis:** motion-0172

---

## Problem statement

Q2M5 has working control-thread, orchestrator, repo-execution, exploration, work,
agent, motion, chat, and wave surfaces, but the workflow-role taxonomy is still
distributed across prose docs rather than made explicit as routing canon.

That leaves three clarity gaps:

1. workflow-role outputs and blocked outputs are not captured in one canonical
   schema-first location
2. passalong and repo-routing packages do not yet have explicit YAML canon shapes
3. `ORCHESTRATOR` can still be misread as a live JAI agent role rather than a
   valid workflow role only

Motion-0173 resolves those gaps without opening new authority.

---

## Scope

In scope:

- add `.nexus/canon/workflow-role-taxonomy.yaml`
- add `.nexus/canon/passalong-schema.yaml`
- add `.nexus/canon/repo-routing-target-schema.yaml`
- add full draft motion artifacts under `.nexus/motions/motion-0173/`
- define `CONTROL_THREAD`, `ORCHESTRATOR`, `REPO_EXECUTION`, and `EXPLORATION`
  as workflow roles for routing clarity
- document allowed outputs and blocked outputs per workflow role
- make the workflow-role vs JAI-agent-role distinction explicit
- state that `ORCHESTRATOR` is valid as a workflow role and remains deferred/not
  active as a JAI agent role
- note future motion-0174 dependency without implementing it

Out of scope:

- motion-0174 implementation
- Agentic Docs Operations
- Agent Assets Library
- execution enablement
- branch-write authority expansion
- PR-creation authority expansion
- hidden persistence
- autonomous scheduling
- DB or API mutation
- credentials
- edits to `docs-nexus`
- edits to `jai-nexus`

---

## Deliverables

### 1. Workflow-role taxonomy canon

`.nexus/canon/workflow-role-taxonomy.yaml` must define:

- `CONTROL_THREAD`
  - cross-repo sequencing
  - priority control
  - passalong routing
  - portfolio-level decision tracking
- `ORCHESTRATOR`
  - passalong intake
  - candidate seam comparison
  - next-step planning
  - repo-init prompt preparation
- `REPO_EXECUTION`
  - one repo, branch, PR, motion, or implementation line
  - branch plan
  - file/path plan
  - acceptance criteria
  - commit plan
  - PR description
  - validation results
  - passalong back to `CONTROL_THREAD`
- `EXPLORATION`
  - bounded ideation
  - option shaping
  - problem framing only

Each role must include allowed outputs and blocked outputs.

### 2. Passalong schema canon

`.nexus/canon/passalong-schema.yaml` must define:

- source repo/chat
- target repo/chat
- date
- scope
- current baseline
- settled canon
- active work
- open questions
- deferred ideas
- tasks
- risks
- routing targets
- next prompts
- explicit boundaries
- validation/gate status where relevant

### 3. Repo routing target schema canon

`.nexus/canon/repo-routing-target-schema.yaml` must define:

- repo
- branch
- motion or seam
- baseline
- task
- allowed files/surfaces
- blocked files/surfaces
- acceptance criteria
- validation commands
- expected return fields
- passalong destination

### 4. Role-taxonomy guardrail

The canon must explicitly state:

- workflow roles are not JAI agent roles
- `ORCHESTRATOR` is valid as a workflow role
- Orchestrator must not be reintroduced as an active canonical JAI agent role
- jai-nexus role canon remains unchanged unless a future explicit motion changes it

---

## Acceptance criteria

- workflow roles defined
- allowed outputs documented
- blocked outputs documented
- passalong schema documented
- repo routing target schema documented
- workflow-role vs JAI-agent-role distinction explicit
- `ORCHESTRATOR` distinction explicit
- future motion-0174 dependency noted but not implemented
- validation passes
- no authority guardrails weakened
