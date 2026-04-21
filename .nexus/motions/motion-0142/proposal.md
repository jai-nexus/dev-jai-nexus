# Proposal: JAI Orchestrator Canon v0

**Motion:** motion-0142
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0141 (JAI Repo Execution Canon v0)

---

## Current repo framing

Motions 0134–0141 are merged baseline. The coordination layer is partially
documented:

- CONTROL_THREAD — defined in `.nexus/docs/control-thread-model.md` (motion-0140).
  Governs the program arc: ratifies motions, tracks deferred extensions, maintains
  the passalong chain.
- REPO_EXECUTION — defined in `.nexus/docs/repo-execution-model.md` (motion-0141).
  Executes one bounded seam: implements a governed motion, produces artifacts,
  and closes the seam.
- EXPLORATION — named in the coordination mode comparison table but not yet
  canonically documented.
- ORCHESTRATOR — named in the broader coordination model but has no canonical
  document.

The passalong schema v1.1 (`.nexus/codex/passalong-schema.md`, motion-0140)
defines the inter-session handoff format. The repo-execution templates
(`.nexus/docs/templates/`, motion-0141) define in-session artifact structure.

---

## Problem

Motion-0141 settled REPO_EXECUTION. The coordination layer between program-arc
management (CONTROL_THREAD) and bounded execution (REPO_EXECUTION) — where seams
are selected, motions are initiated, and new sessions are routed — has no
canonical document.

Four gaps remain:

**1. No canonical ORCHESTRATOR definition.**
ORCHESTRATOR is the meta-coordination surface that selects the next seam, packages
a next-motion recommendation, and produces a routing recommendation for the
appropriate mode. It is
distinct from CONTROL_THREAD (which manages the arc after motions are ratified)
and REPO_EXECUTION (which implements a single bounded seam). Without a definition,
ORCHESTRATOR sessions reconstruct their role from context and prior conversation
each time — with no stable boundary on what they are or are not authorized to do.

**2. No canonical candidate-seam review structure.**
When an ORCHESTRATOR session surveys what work is next, there is no standard format
for how that survey is captured: what the current framing is, what seams are in
view, what the recommendation is, and what is explicitly deferred. Each session
invents this ad hoc.

**3. No canonical next-motion recommendation package structure.**
When an ORCHESTRATOR session recommends a new motion, the shape of that
recommendation — title, exact scope, non-goals, risks, touched paths, branch name,
motion id — is not standardized. Recipients must reconstruct what was intended
from natural language prose.

**4. No canonical repo-init routing package structure.**
When a new session begins and needs to be oriented, there is no standard format
for what an ORCHESTRATOR provides (repo baseline, settled canon, active seam,
request) and what it returns (artifacts, governance state change, keep-out
constraints). Each handoff re-invents the input/output contract.

---

## Solution

### Sub-line A — Orchestrator model doc

Add `.nexus/docs/orchestrator-model.md` defining:

1. **ORCHESTRATOR definition** — A meta-coordination layer. It is a
   decision-packaging surface, not an execution surface. An ORCHESTRATOR session
   selects the next bounded seam, packages a next-motion recommendation,
   and produces a routing recommendation for CONTROL_THREAD (arc decisions) or
   REPO_EXECUTION (bounded implementation). It does not execute work, mutate repo
   or runtime state, or replace repo-local judgment.

2. **Distinction from other coordination modes** — Explicit table distinguishing
   ORCHESTRATOR from CONTROL_THREAD, REPO_EXECUTION, and EXPLORATION across:
   primary focus, input artifacts, output artifacts, scope authority, and forbidden
   behavior.

3. **Operating constraints** — What ORCHESTRATOR does and does not do:
   - Reviews candidate seams, recommends one at a time
   - Produces a next-motion recommendation, not a ratified motion
   - Produces a routing recommendation for the receiving mode; does not execute for it
   - No direct repo mutation, no automated branching, no workflow trigger

4. **Artifact outputs** — What an ORCHESTRATOR session produces:
   candidate-seam review, next-motion recommendation, repo-init routing package,
   passalong to the receiving session.

5. **Relationship to execution roles** — Orthogonal to ARCHITECT / BUILDER /
   VERIFIER / OPERATOR / LIBRARIAN.

6. **Non-goals** — Automation engine, enforcement infrastructure, runtime gates,
   direct code or governance mutation.

### Sub-line B — Orchestrator artifact templates

Add three template files under `.nexus/docs/templates/`:

**`candidate-seam-template.md`** — structure for candidate-seam reviews:
- Current repo framing (active program, settled canon as of this review)
- Candidate seams (one entry per seam: description, why viable, what it unblocks,
  risk if deferred)
- Recommendation (recommended next seam, ranked rationale)
- Explicitly deferred seams (with deferral reason per seam)
- Routing (which coordination mode should receive this recommendation, and why)

**`next-motion-recommendation-template.md`** — structure for next-motion recommendation packages:
- Recommended motion (title, next available motion id, kind, program, basis)
- Scope (exact bounded scope, non-goals, risks)
- Likely touched paths (new files, modified files, explicitly excluded paths)
- Recommended branch name
- Next step (what the receiving session should do first)

**`repo-init-routing-template.md`** — input/output format for ORCHESTRATOR sessions:
- Input: repo baseline (repo name, domain, branch, last commit, working tree state)
- Input: settled canon (ratified motions relevant to this session, active schema
  versions)
- Input: active seam (current or intended motion, coordination mode for this
  session)
- Request (one sentence: what this session is asked to do)
- Return shape (expected outputs, expected governance state change)
- Keep-out-of-scope constraints (paths that must not change, governance artifacts
  that must not be mutated, actions not authorized)

### Sub-line C — Orchestrator example

Add `.nexus/docs/examples/orchestrator-example.md` — an illustrative example of
a complete ORCHESTRATOR session artifact set. Explicitly marked as illustrative
only. Uses fictional motion references and placeholder values. Includes abbreviated
forms of all three artifact types (candidate-seam review, next-motion
recommendation, repo-init routing package).

### Boundary preservation

This motion does not authorize:
- Automation engine or background orchestration
- Runtime routing or enforcement infrastructure
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0141
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to any existing `.nexus/docs/` documents (including
  `control-thread-model.md`, `repo-execution-model.md`, `passalong-schema.md`)

---

## Success criteria

- **SC-1** `.nexus/docs/orchestrator-model.md` exists and defines: ORCHESTRATOR
  mode, distinction from CONTROL_THREAD/REPO_EXECUTION/EXPLORATION, operating
  constraints, artifact outputs, execution-role orthogonality, non-goals
- **SC-2** `.nexus/docs/templates/candidate-seam-template.md` exists and covers:
  current repo framing, candidate seams, recommendation, explicitly deferred seams,
  routing
- **SC-3** `.nexus/docs/templates/next-motion-recommendation-template.md` exists and covers:
  recommended motion, exact scope, non-goals, risks, touched paths, branch,
  next step
- **SC-4** `.nexus/docs/templates/repo-init-routing-template.md` exists and covers:
  input (repo baseline, settled canon, active seam), request, return shape,
  keep-out-of-scope constraints
- **SC-5** `.nexus/docs/examples/orchestrator-example.md` exists, is marked as
  illustrative only, and includes abbreviated forms of all three artifact types
- **SC-6** `validate-motion` passes for motion-0142
- **SC-7** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-8** `pnpm typecheck` passes
- **SC-9** No portal runtime, governance runner, skill prompt, eval fixture,
  existing `.nexus/docs/*.md`, or grid script files modified

---

## Non-goals

- Automation engine or background orchestration
- Runtime routing, enforcement infrastructure, or runtime gates
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0141
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to existing `.nexus/docs/` documents
- EXPLORATION coordination mode canon (explicitly deferred)
