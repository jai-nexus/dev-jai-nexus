# Proposal: JAI Workflow Kit Canon v0

**Motion:** motion-0145
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0144 (JAI Workflow Composition Canon v0)

---

## Current repo framing

Motions 0140–0144 are merged baseline. The four coordination modes and their
composition rules are now fully canonized:

- CONTROL_THREAD — defined in `.nexus/docs/control-thread-model.md` (motion-0140).
- REPO_EXECUTION — defined in `.nexus/docs/repo-execution-model.md` (motion-0141).
- ORCHESTRATOR — defined in `.nexus/docs/orchestrator-model.md` (motion-0142).
- EXPLORATION — defined in `.nexus/docs/exploration-model.md` (motion-0143).
- Workflow composition — defined in `.nexus/docs/workflow-composition-model.md`
  (motion-0144). Defines the cross-layer session sequence, transition matrix
  (normal / optional / discouraged / prohibited), state-carrying contract (seven
  state buckets), failure-state guidance rules, and boundary rules.

Supporting artifacts: passalong schema v1.1 (`.nexus/codex/passalong-schema.md`);
mode templates under `.nexus/docs/templates/`; transition matrix template
(`.nexus/docs/templates/transition-matrix-template.md`); workflow composition
example (`.nexus/docs/examples/workflow-composition-example.md`).

---

## Problem

The composition model (motion-0144) defines how modes relate in sequence and what
state must travel across transition boundaries. What is not yet documented is a
reusable reference structure — a named, pre-built package that sessions can select
and instantiate rather than assembling a mode sequence from scratch each time.

Four gaps remain:

**1. No canonical workflow kit definition.**
The composition model describes the rules. There is no concept of a workflow kit:
a named, reusable multi-layer package that specifies a mode sequence, state-carrying
at each transition, artifacts referenced, and conditions under which it applies.
Sessions that want to run a known pattern (standard delivery loop, exploration-first
loop) have no pre-built reference to cite or instantiate.

**2. No standard v0 kit catalog.**
Even without a formal kit definition, common workflow patterns are implied by the
composition model. These patterns are not named, cataloged, or given selection
criteria. Each session assembles its own sequence from mode model documents and
the transition matrix. There is no canonical shorthand.

**3. No kit structure canon.**
Without a standard structure for what a kit contains, informal kit descriptions
will diverge: some will specify role sequences but omit state-carrying; others
will name artifacts but omit selection conditions. There is no agreed-upon schema
for a kit entry.

**4. No kit-selection guidance.**
Nothing tells a receiving session which kit applies to a given situation. Sessions
must infer the appropriate mode sequence from the composition model and transition
matrix without a named matching method. The gap between "I know the rules" and
"I know which pattern to use here" is not bridged.

---

## Solution

### Sub-line A — Workflow kit model doc

Add `.nexus/docs/workflow-kit-model.md` defining:

1. **Workflow kit definition** — A workflow kit is a named, reusable multi-layer
   package that specifies a mode sequence, the state-carrying contract at each
   transition boundary, the artifacts referenced at each stage, and the conditions
   under which the kit applies. A kit is a guide, not a controller. It does not
   dispatch sessions, enforce transitions, or mutate repo or runtime state. A kit
   is instantiated by the session that selects it; the kit does not initiate,
   advance, or terminate sessions.

2. **V0 kit catalog** — Four standard kits:

   **Kit 1: Normal delivery loop**
   Sequence: CONTROL_THREAD → ORCHESTRATOR → REPO_EXECUTION → CONTROL_THREAD
   Selection conditions: A clear scoped deliverable exists; ORCHESTRATOR can
   select a bounded seam; no unresolved problem space requiring investigation.
   This is the standard governed delivery chain for routine motion execution.

   **Kit 2: Exploration-first loop**
   Sequence: CONTROL_THREAD → EXPLORATION → ORCHESTRATOR → REPO_EXECUTION →
   CONTROL_THREAD
   Selection conditions: The problem space is not yet shaped enough for direct
   ORCHESTRATOR seam selection; investigation or option-shaping is required before
   a bounded seam can be identified. EXPLORATION produces a structured outcome
   that feeds ORCHESTRATOR.

   **Kit 3: Deferred/hold loop**
   Sequence: ORCHESTRATOR → deferred item registered in CONTROL_THREAD →
   CONTROL_THREAD (next cycle). CONTROL_THREAD itself may also register a hold
   without routing through ORCHESTRATOR.
   Selection conditions: A seam is identified but cannot be closed in the current
   cycle due to resource constraints, missing preconditions, or a governance hold.
   The deferred item is registered as an open item in CONTROL_THREAD; no
   transition to REPO_EXECUTION occurs in this cycle.

   **Kit 4: Governance-readiness review loop**
   Sequence: CONTROL_THREAD → EXPLORATION → CONTROL_THREAD
   Selection conditions: Arc-level pre-check is needed before committing to a
   motion or ratification decision. EXPLORATION is used with a bounded governance-
   readiness target; it produces a structured assessment that feeds CONTROL_THREAD's
   ratification or arc-routing decision. ORCHESTRATOR and REPO_EXECUTION are not
   included in this pattern.

3. **Kit structure canon** — Each kit entry in the catalog contains the following
   elements:
   - Kit ID and name
   - Role sequence (ordered list of modes)
   - Per-transition state-carrying (which state buckets are required at each
     boundary, sourced from the contract defined in workflow-composition-model.md)
   - Artifacts referenced (which templates and docs each mode session uses)
   - Selection conditions (the situational criteria that indicate this kit)
   - Boundary notes (what the kit does not authorize; kit-specific constraints)

4. **State-carrying** — Kits specify required state buckets at each transition
   boundary using the contract defined in `.nexus/docs/workflow-composition-model.md`.
   Kits do not define new state buckets. State bucket definitions remain in the
   composition model. Kit state-carrying specs instantiate the existing contract
   for the kit's specific mode sequence.

5. **Kit-selection guidance** — Matching conditions:
   - Clear scoped deliverable, bounded seam available → Kit 1 (Normal delivery loop)
   - Unresolved problem space, investigation required → Kit 2 (Exploration-first loop)
   - Seam identified but cannot close this cycle → Kit 3 (Deferred/hold loop)
   - Arc-level pre-check required before ratification → Kit 4 (Governance-readiness review loop)
   When multiple kits could apply, the session that selects the kit records the
   selection condition and the reason for the choice in its passalong.

6. **Boundary rules** — What workflow kits do not do:
   - Do not execute work, dispatch sessions, or advance mode transitions
   - Do not mutate repo or runtime state
   - Do not override or extend mode model documents
   - Do not define new coordination modes
   - Do not define new state buckets beyond those in the composition model
   - Do not substitute for governed motions; a kit describes a pattern, not a
     ratification
   - Do not turn the workflow chain into a controller or enforcement mechanism
   Governance constraints from workflow-composition-model.md apply at all
   transitions regardless of which kit is active: no ratification without evidence
   artifacts; no scope widening without a new governed motion.

7. **Non-goals** — Automation engine or runtime kit dispatch; enforcement
   infrastructure or runtime kit selection; new coordination modes; new state
   bucket schema; modifications to existing mode model documents.

### Sub-line B — Kit manifest template

Add `.nexus/docs/templates/kit-manifest-template.md` — a standard structure for
instantiating a single kit using the framework defined in `workflow-kit-model.md`.
The template instantiates the canonical kit structure; the model doc defines it.
- Kit ID and name
- Role sequence (ordered)
- Per-transition state-carrying (list of required state buckets per boundary)
- Artifacts referenced (templates and docs per mode session)
- Selection conditions (criteria that led to this kit being selected)
- Boundary notes (kit-specific constraints)
- Instantiation notes (session-specific context: motion, branch, date)

### Sub-line C — Workflow kit example

Add `.nexus/docs/examples/workflow-kit-example.md` — an illustrative example of
kit selection and instantiation. Explicitly marked as illustrative only. Uses
fictional references and placeholder values. Covers at minimum:
- A normal delivery loop instantiation (Kit 1)
- An exploration-first loop instantiation (Kit 2)
- A deferred/hold instantiation (Kit 3)
- A filled kit manifest for the normal delivery loop

### Boundary preservation

This motion does not authorize:
- Automation engine or runtime kit dispatch
- Enforcement infrastructure or runtime kit selection
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0140–0144
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to any existing `.nexus/docs/` documents (including all four
  mode model docs, the passalong schema, and the workflow composition model)
- Defining new coordination modes (the four modes are settled canon)
- Defining new state buckets (the seven buckets are settled in composition model)

---

## Success criteria

- **SC-1** `.nexus/docs/workflow-kit-model.md` exists and defines:
  workflow kit definition, v0 catalog (all four kits with ID, sequence, state-
  carrying, artifacts, selection conditions, boundary notes), kit structure canon,
  state-carrying (inherited from composition model), kit-selection guidance,
  boundary rules, non-goals
- **SC-2** `.nexus/docs/templates/kit-manifest-template.md` exists and covers:
  kit ID/name, role sequence, per-transition state-carrying, artifacts, selection
  conditions, boundary notes, instantiation notes
- **SC-3** `.nexus/docs/examples/workflow-kit-example.md` exists, is marked as
  illustrative only, and covers: Kit 1 instantiation (normal delivery loop), Kit 2
  instantiation (exploration-first loop), Kit 3 instantiation (deferred/hold), and
  a filled kit manifest for the normal delivery loop
- **SC-4** `validate-motion` passes for motion-0145
- **SC-5** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-6** `pnpm typecheck` passes
- **SC-7** No existing `.nexus/docs/*.md`, portal runtime, governance runner, skill
  prompt, eval fixture, or grid script files modified

---

## Non-goals

- Automation engine or runtime kit dispatch
- Enforcement infrastructure, runtime kit selection, or session dispatching
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0140–0144
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to existing `.nexus/docs/` documents
- Defining new coordination modes
- Defining new state buckets
- Specifying more than four kits in the v0 catalog
