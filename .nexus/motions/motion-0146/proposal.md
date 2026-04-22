# Proposal: JAI Governance Constraint Stack Canon v0

**Motion:** motion-0146
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-21
**Basis:** motion-0145 (JAI Workflow Kit Canon v0)

---

## Current repo framing

Motions 0134–0145 are merged baseline. The governance execution surface is fully
canonized through motion-0139. The four coordination modes, composition rules, and
workflow kit layer are settled:

- Operator surface / passalong schema v1.1 — motions 0134–0139
- CONTROL_THREAD — `.nexus/docs/control-thread-model.md` (motion-0140)
- REPO_EXECUTION — `.nexus/docs/repo-execution-model.md` (motion-0141)
- ORCHESTRATOR — `.nexus/docs/orchestrator-model.md` (motion-0142)
- EXPLORATION — `.nexus/docs/exploration-model.md` (motion-0143)
- Workflow composition — `.nexus/docs/workflow-composition-model.md` (motion-0144)
- Workflow kit — `.nexus/docs/workflow-kit-model.md` (motion-0145)

Each of these documents contains boundary rules and non-goal sections that assert
governance constraints. These constraints are correct but exist in isolation inside
their respective documents. They are not unified, classified, or made referenceable
as a coherent cross-layer set.

---

## Problem

Motions 0140–0145 have established governance constraints implicitly — embedded in
boundary rules, non-goals, and challenge risks within individual documents. What is
not yet documented is the constraint layer itself: the unified, named, classified
set of cross-cutting rules that apply across all coordination modes, artifact types,
and session boundaries.

Four gaps remain:

**1. No canonical constraint stack definition.**
Constraints are scattered across six separate model documents and their associated
motion packages. There is no single document that names the constraint layer, defines
what a governance constraint is in the JAI NEXUS context, or establishes the
constraint stack as an advisory/documentary canon layer (not a runtime enforcement
mechanism). Each session that wants to cite a constraint must find and quote the
relevant boundary rule from whichever mode doc it appears in.

**2. No constraint classification.**
Constraints embedded in individual documents are not classified by type. A boundary
rule in the orchestrator model ("ORCHESTRATOR produces a recommendation; it does not
execute work") and a boundary rule in the workflow composition model ("no ratification
without evidence artifacts") address different categories of constraint — but this
distinction is not named or made referenceable. Sessions cannot reason about which
constraint class applies to a given situation without reading all six documents.

**3. No cross-artifact applicability map.**
Even when constraint classes are implied, there is no document stating how each class
applies to each artifact type — control-thread artifacts, orchestrator artifacts,
repo-execution artifacts, exploration artifacts, workflow kits, and governance
read-only surfaces. The REPO_EXECUTION exception (which may execute and commit under
a ratified motion) exists implicitly in the mode model but is not named in relation
to other constraint classes that apply uniformly.

**4. No reusable constraint-callout canon.**
When authors write future docs, templates, examples, motion packages, plans, routing
packages, workflow kits, or sync-back artifacts, there is no standard minimum
structure for expressing a constraint. Each author invents their own boundary-rule
format. The result is inconsistent constraint language across the corpus.

---

## Solution

### Sub-line A — Governance constraint stack canon doc

Add `.nexus/docs/governance-constraint-stack.md` defining:

1. **Constraint stack definition** — The governance constraint stack is the named,
   classified set of cross-cutting rules that govern what JAI coordination sessions,
   artifacts, and mode transitions may and may not do. The stack is advisory and
   documentary. It does not execute work, evaluate gates, dispatch sessions, or
   enforce transitions at runtime. It makes implicit governance discipline explicit,
   named, and referenceable. A constraint in the stack is a rule, not a trigger.
   The constraint stack does not introduce new governance rules. It consolidates
   cross-cutting constraints already present in the settled mode model documents
   (motions 0140–0145) and makes them uniformly named and cross-referenceable.
   The explicit/manual council-run boundary is a foundational governance constraint
   that propagates across all five constraint classes.

2. **Constraint classification** — Five classes:

   **Class 1: Non-execution constraints**
   No artifact class (kit, template, example, model doc, routing package, motion
   package, context bundle) may execute work or run scripts. Only the REPO_EXECUTION
   session role may execute — and only under a ratified motion, via the explicit/manual
   council-run boundary. All other session roles and all artifact classes are
   non-executing.

   **Class 2: Non-mutation constraints**
   No commentary, advisory, documentary, or routing artifact may modify repo or
   runtime state. Passalong documents, context bundles, constraint docs, kit
   manifests, and transition matrix instantiations are read artifacts. They describe
   state; they do not change it.

   **Class 3: Non-controller constraints**
   No artifact may dispatch sessions, advance mode transitions, enforce transition
   gates, or auto-route to a next session. Kits, templates, model docs, and routing
   packages describe patterns; they do not orchestrate. No artifact is a controller,
   dispatcher, or scheduler.

   **Class 4: Continuity / state-carrying constraints**
   Required state must travel intact across session boundaries via passalong
   documents. State may be compressed across long chains but must not be silently
   dropped. A drop is detected by the receiving session's inability to reconstruct
   the missing state from the passalong; when detected, the receiving session
   requests a state-bucket fill before proceeding. Inference and assumption are not
   valid substitutes for missing required state.

   **Class 5: Scope / non-goal preservation constraints**
   No session may widen scope beyond the ratified motion without a new governed
   motion. Deferred extensions remain deferred until a new motion ratifies them.
   The explicit/manual council-run boundary must be preserved: no automatic
   ratification, no automatic gate execution, no scope expansion by implication.

3. **Cross-artifact applicability** — How each constraint class applies to each
   artifact domain:

   | Constraint class | CT artifacts | ORC artifacts | RE artifacts | EXP artifacts | Kits | Gov read-only surfaces |
   |---|---|---|---|---|---|---|
   | Non-execution | applies | applies | exception: RE executes under ratified motion | applies | applies | applies |
   | Non-mutation | applies | applies | exception: RE commits under ratified motion | applies | applies | applies |
   | Non-controller | applies | applies | applies | applies | applies | applies |
   | Continuity | applies | applies | applies | applies | n/a (kits are reference, not state-carrying sessions) | n/a |
   | Scope preservation | applies | applies | applies | applies | applies | applies |

   The REPO_EXECUTION exception for Classes 1 and 2 is bounded by the
   explicit/manual council-run boundary: execution and mutation are permitted only
   when council-run has cleared all required gates for a ratified motion. This
   exception does not extend to any other session role or artifact class.

4. **Constraint-callout canon** — The minimum reusable structure for expressing a
   constraint in any future artifact (doc, template, example, motion package, plan,
   routing package, workflow kit, sync-back artifact):
   - **Constraint class** — which of the five classes applies
   - **Constraint statement** — the specific rule being asserted (what is
     prohibited or required in this artifact)
   - **Scope** — which artifact types or session types this callout applies to
     in this context (may be narrower than the full class scope)
   - **Exception path** — if any: the conditions under which the prohibited action
     is permitted (e.g., "REPO_EXECUTION under a ratified motion via council-run")
   - **Reference** — the canon doc or motion that establishes this constraint

   A constraint callout is not a gate. It is a named, structured assertion in a
   documentary artifact. Its presence does not trigger evaluation or enforcement.

5. **Boundary rules** — What the governance constraint stack does not do:
   - Does not execute work or dispatch sessions
   - Does not mutate repo or runtime state
   - Does not add runtime enforcement mechanisms or automatic gate evaluation
   - Does not override settled governance execution boundaries (the council-run
     boundary remains explicit and manual)
   - Does not collapse role distinctions (REPO_EXECUTION's execution exception
     is named and preserved, not suppressed)
   - Does not create new constraint classes beyond the five defined here

6. **Non-goals** — Automatic constraint enforcement engine; runtime constraint
   evaluation; constraint violations as gate failures; changes to existing mode
   model documents; portal or runtime mutation; telemetry or notification hooks;
   new constraint classes beyond the five v0 classes.

### Sub-line B — Constraint-callout template

Add `.nexus/docs/templates/constraint-callout-template.md` — a standard blank
structure for expressing a single constraint callout using the five-class canon
defined in `governance-constraint-stack.md`. The template instantiates the callout
canon; the model doc defines it.
- Constraint class (one of the five v0 classes)
- Constraint statement
- Scope
- Exception path (or "None")
- Reference

### Sub-line C — Governance constraint stack example

Add `.nexus/docs/examples/governance-constraint-stack-example.md` — an illustrative
multi-layer example. Explicitly marked as illustrative only. Uses fictional
references and placeholder values. Covers at minimum:
- One filled callout per constraint class (five callouts total)
- A cross-artifact applicability example for one constraint class across all six
  artifact domains
- A note showing how constraint callouts appear in a motion package boundary rules
  section

### Boundary preservation

This motion does not authorize:
- Automatic constraint enforcement engine or runtime evaluation
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0145
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to any existing `.nexus/docs/` documents
- Defining constraint classes beyond the five v0 classes
- Collapsing the REPO_EXECUTION execution exception into a general prohibition

---

## Success criteria

- **SC-1** `.nexus/docs/governance-constraint-stack.md` exists and defines:
  constraint stack definition, five constraint classes (non-execution, non-mutation,
  non-controller, continuity, scope preservation), cross-artifact applicability map
  (six artifact domains), constraint-callout canon (five required fields), boundary
  rules, non-goals
- **SC-2** `.nexus/docs/templates/constraint-callout-template.md` exists and
  covers: constraint class, constraint statement, scope, exception path, reference
- **SC-3** `.nexus/docs/examples/governance-constraint-stack-example.md` exists,
  is marked as illustrative only, and covers: one filled callout per class (five),
  a cross-artifact applicability example, and a motion-package boundary-rules note
- **SC-4** `validate-motion` passes for motion-0146
- **SC-5** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-6** `pnpm typecheck` passes
- **SC-7** No existing `.nexus/docs/*.md`, portal runtime, governance runner, skill
  prompt, eval fixture, or grid script files modified

---

## Non-goals

- Automatic constraint enforcement engine or runtime evaluation
- Constraint violations as gate failures or blocking conditions
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0145
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to existing `.nexus/docs/` documents
- Defining more than five constraint classes in v0
- Collapsing REPO_EXECUTION execution exception
