# Proposal: JAI Exploration Canon v0

**Motion:** motion-0143
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0142 (JAI Orchestrator Canon v0)

---

## Current repo framing

Motions 0134–0142 are merged baseline. The coordination layer is now
three-quarters documented:

- CONTROL_THREAD — defined in `.nexus/docs/control-thread-model.md` (motion-0140).
  Governs the program arc: ratifies motions, tracks deferred extensions, maintains
  the passalong chain.
- REPO_EXECUTION — defined in `.nexus/docs/repo-execution-model.md` (motion-0141).
  Executes one bounded seam: implements a governed motion, produces artifacts,
  and closes the seam.
- ORCHESTRATOR — defined in `.nexus/docs/orchestrator-model.md` (motion-0142).
  Selects the next bounded seam, packages a next-motion recommendation, and
  produces a routing recommendation for the receiving mode.
- EXPLORATION — named in the coordination mode comparison table but has no
  canonical document.

The passalong schema v1.1 (`.nexus/codex/passalong-schema.md`, motion-0140),
repo-execution templates (`.nexus/docs/templates/`, motion-0141), and orchestrator
templates (`.nexus/docs/templates/`, motion-0142) are all settled canon.

---

## Problem

Motion-0142 settled ORCHESTRATOR. The fourth and final named coordination mode —
EXPLORATION — has no canonical document. Without one, exploration sessions operate
without a stable role boundary: they may produce work that silently drifts into
active canon, expand past their scope, or fail to produce a routable outcome.

Four gaps remain:

**1. No canonical EXPLORATION definition.**
EXPLORATION is the bounded ideation and option-shaping layer. It is a
thinking/structuring surface, not an execution surface. It is distinct from
ORCHESTRATOR (which selects among already-identified seams), CONTROL_THREAD (which
governs the arc), and REPO_EXECUTION (which implements a bounded seam). Without a
definition, exploration sessions have no stable boundary on what they are authorized
to do, produce, or decide.

**2. No canonical exploration appropriateness guidance.**
When should an exploration session be started instead of going directly to
ORCHESTRATOR or REPO_EXECUTION? When is a problem not yet well-defined enough
to scope a seam? When does an exploration session produce an outcome that routes
to ORCHESTRATOR vs. directly to REPO_EXECUTION? These questions are answered ad
hoc today.

**3. No canonical exploration artifact structure.**
Exploration sessions produce ad hoc notes, option lists, or analysis documents
with no standard shape. There is no defined structure for: current framing,
exploration target, constraints, evaluation lens, candidate ideas/options,
tradeoffs, risks, and open questions. Each session invents this from scratch.

**4. No canonical exploration outcome / routing structure.**
When an exploration session concludes, there is no standard format for how it
closes: what the recommended direction is, what ideas were deferred and why, what
becomes active work, which mode to route to, and what the next session prompt is.
Without this, exploration outcomes cannot be reliably acted on.

---

## Solution

### Sub-line A — Exploration model doc

Add `.nexus/docs/exploration-model.md` defining:

1. **EXPLORATION definition** — A bounded ideation and option-shaping layer. It
   is a thinking/structuring surface, not an execution surface. An EXPLORATION
   session investigates a problem space, evaluates options, and produces a
   structured outcome. It does not select the next seam (ORCHESTRATOR does that),
   does not govern the arc (CONTROL_THREAD does that), and does not implement
   (REPO_EXECUTION does that).

2. **Distinction from other coordination modes** — Explicit table distinguishing
   EXPLORATION from CONTROL_THREAD, ORCHESTRATOR, and REPO_EXECUTION across:
   primary focus, input artifacts, output artifacts, scope authority, and forbidden
   behavior.

3. **Exploration appropriateness** — When exploration is the right mode:
   - A problem is not yet well-defined enough to scope a seam or motion
   - Multiple candidate approaches exist and the right one is unclear
   - A new capability area needs investigation before a seam can be identified
   - Speculative or hypothetical work needs to be contained and evaluated
   When to route directly to ORCHESTRATOR instead (problem is already framed,
   seam is identifiable). When to route directly to REPO_EXECUTION instead
   (exception path: exploration produces a single unambiguous implementation scope
   requiring no seam-selection decision; requires explicit justification in the
   outcome artifact).

4. **Artifact outputs** — What an EXPLORATION session produces:
   exploration artifact (structured ideation record), exploration outcome
   (structured routing decision), passalong to the receiving mode.

5. **Boundary rules** — What EXPLORATION does not do:
   artifacts do not execute work, do not mutate repo or runtime state, do not
   silently become active canon, do not replace orchestrator recommendations or
   repo execution planning, do not initiate motions directly.

6. **Non-goals** — Automation, enforcement infrastructure, runtime gates, direct
   code or governance mutation.

### Sub-line B — Exploration artifact templates

Add two template files under `.nexus/docs/templates/`:

**`exploration-template.md`** — structure for exploration artifacts, covering both
session framing (current state, bounded target, constraints, evaluation lens) and
option development (candidates, tradeoffs, risks, open questions):
- Current framing (what is settled; what triggered this exploration)
- Exploration target — required: the bounded question or problem being explored,
  one sentence; sessions without an explicit bounded target are not valid
- Constraints (what cannot change; what is out of scope for this session)
- Evaluation lens (criteria by which options will be assessed)
- Candidate ideas / options (enumerated options with brief description each)
- Tradeoffs (per-option or cross-option analysis against evaluation lens)
- Risks (what could go wrong with each option or with the exploration itself)
- Open questions (what remains unresolved at session close)

**`exploration-outcome-template.md`** — structure for exploration session close
(recommended direction, routing, next prompt):
- Recommended direction (one recommended option; rationale)
- Deferred ideas (options not pursued; deferral reason per idea)
- What becomes active work (what the recommendation translates to concretely)
- Routing target (ORCHESTRATOR | REPO_EXECUTION | CONTROL_THREAD; and why);
  routing to REPO_EXECUTION requires an explicit justification note stating why
  ORCHESTRATOR is being bypassed
- Next prompt (exact prompt starter for the receiving session)

### Sub-line C — Exploration example

Add `.nexus/docs/examples/exploration-example.md` — an illustrative example of
a complete EXPLORATION session artifact set. Explicitly marked as illustrative
only. Uses fictional references and placeholder values. Includes abbreviated forms
of both artifact types (exploration artifact and exploration outcome).

### Boundary preservation

This motion does not authorize:
- Automation engine or background orchestration
- Runtime routing or enforcement infrastructure
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0142
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to any existing `.nexus/docs/` documents (including
  `control-thread-model.md`, `repo-execution-model.md`, `orchestrator-model.md`)

---

## Success criteria

- **SC-1** `.nexus/docs/exploration-model.md` exists and defines: EXPLORATION
  mode, distinction from CONTROL_THREAD/ORCHESTRATOR/REPO_EXECUTION, exploration
  appropriateness guidance, artifact outputs, boundary rules, non-goals
- **SC-2** `.nexus/docs/templates/exploration-template.md` exists and covers:
  current framing, exploration target, constraints, evaluation lens, candidate
  ideas/options, tradeoffs, risks, open questions
- **SC-3** `.nexus/docs/templates/exploration-outcome-template.md` exists and
  covers: recommended direction, deferred ideas, what becomes active work, routing
  target, next prompt
- **SC-4** `.nexus/docs/examples/exploration-example.md` exists, is marked as
  illustrative only, and includes abbreviated forms of both artifact types
- **SC-5** `validate-motion` passes for motion-0143
- **SC-6** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-7** `pnpm typecheck` passes
- **SC-8** No portal runtime, governance runner, skill prompt, eval fixture,
  existing `.nexus/docs/*.md`, or grid script files modified

---

## Non-goals

- Automation engine or background orchestration
- Runtime routing, enforcement infrastructure, or runtime gates
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0142
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to existing `.nexus/docs/` documents
- Open-ended ideation without a bounded exploration target
- Routing directly to REPO_EXECUTION without explicit justification in the outcome
  artifact (direct REPO_EXECUTION routing is the exception path, not the default;
  ORCHESTRATOR is the default routing target for most exploration outcomes)
