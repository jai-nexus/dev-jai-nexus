# Proposal: JAI Canon Interoperability Registry v0

**Motion:** motion-0148
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-21
**Basis:** motion-0147 (JAI Canon Authoring Conventions v0)

---

## Current repo framing

Motions 0134–0147 are merged baseline. The full governance canon stack is settled:

- Operator surface / passalong schema v1.1 — motions 0134–0139
- CONTROL_THREAD — `.nexus/docs/control-thread-model.md` (motion-0140)
- REPO_EXECUTION — `.nexus/docs/repo-execution-model.md` (motion-0141)
- ORCHESTRATOR — `.nexus/docs/orchestrator-model.md` (motion-0142)
- EXPLORATION — `.nexus/docs/exploration-model.md` (motion-0143)
- Workflow composition — `.nexus/docs/workflow-composition-model.md` (motion-0144)
- Workflow kit — `.nexus/docs/workflow-kit-model.md` (motion-0145)
- Governance constraint stack — `.nexus/docs/governance-constraint-stack.md` (motion-0146)
- Canon authoring conventions — `.nexus/docs/canon-authoring-conventions.md` (motion-0147)

These nine canon layers form a connected stack. Some layers depend on others;
some consolidate constraints from multiple layers; some cross-reference others
for terminology. The relationships and dependencies between layers are correct but
undocumented at the stack level. New canon additions must infer these relationships
by reading the full corpus.

---

## Problem

Motions 0140–0147 produced a coherent, connected canon stack — but the connections
themselves are not mapped. As the stack grows, new canon additions and new readers
need a structured reference for navigating existing relationships, declaring new
dependencies correctly, and extending the stack without inadvertently redefining
or contradicting settled layers.

Five gaps remain:

**1. No canon registry definition.**
There is no document that defines the canon registry concept in the JAI NEXUS
context, or establishes it as a navigational map rather than an authority layer.
The registry would record artifact classes, relationship vocabulary, and dependency
chains — but without a definition, authors cannot reason about what it means for
a canon entry to be "in the registry" or "depend on" another entry.

**2. No artifact class canon for registry purposes.**
The canon stack contains model docs, templates, examples, filled artifacts, and
motion packages. For registry and navigation purposes, these need classification:
which entries are foundational (mode models, composition model), which are cross-
cutting (constraint stack, authoring conventions, interoperability registry), and
which are derivative (templates, examples, filled artifacts). These are navigation
and index categories, not runtime types.

**3. No relationship vocabulary canon.**
Canon layers reference each other in different ways — a workflow kit depends on
the composition model; the constraint stack extends all four mode models; an
example illustrates a model doc. These relationship types exist implicitly but
are not named, defined, or standardized. Authors expressing relationships use
ad hoc language that does not compose across the corpus.

**4. No registration and dependency canon.**
When a new canon entry is added, there is no documented convention for declaring
where it belongs in the stack, what it depends on, what it extends, and what
settled layers it must not redefine. Without this declaration structure, new
additions may introduce silent dependencies or inadvertent redefinitions.

**5. No navigation guidance canon.**
The canon stack has multiple valid entrypoints depending on a reader's purpose
(workflow roles, constraint lookup, authoring reference, stack navigation). There
is no guidance mapping reader intent to the correct entry document, leaving new
readers to reconstruct the entry structure from scratch.

---

## Solution

### Sub-line A — Canon interoperability registry doc

Add `.nexus/docs/canon-interoperability-registry.md` defining:

1. **Registry definition** — The canon interoperability registry is a navigational
   map of the JAI NEXUS governance canon stack. It records artifact classes,
   relationship vocabulary, and dependency chains for settled and future canon
   layers. The registry is a reference structure, not an authority layer. Registry
   presence does not confer authority; authority comes from ratification under a
   governed motion. The registry does not change authority relationships, enforce
   dependencies, dispatch sessions, or mutate state.

2. **Artifact class canon** — Six navigation classes (index categories, not runtime
   types):

   **Foundation layer** — Model docs that define core coordination roles and
   rules. The four mode models (motions 0140–0143) and the workflow composition
   model (motion-0144). Foundational layers should be settled before derived
   layers that depend on them are ratified; an entry that depends on an unsettled
   foundation layer carries an undeclared dependency risk. New entries must not
   redefine foundation-layer terms; any such redefinition requires a new motion
   amending the foundation layer.

   **Cross-cutting layer** — Model docs that apply across all coordination modes
   and artifact types. Workflow kit (motion-0145), governance constraint stack
   (motion-0146), canon authoring conventions (motion-0147), and this registry
   (motion-0148). Cross-cutting layers may extend foundation layers and each other
   without redefining them.

   **Template layer** — Blank structures for producing filled artifacts.
   Instantiate a model doc's canon structure; do not extend or redefine it.

   **Example layer** — Illustrative, non-normative instantiations. Always marked
   "Illustrative only." Do not establish new canon.

   **Filled artifact layer** — Session outputs produced by applying a template:
   kit manifests, constraint callouts, passalongs, transition matrix instances,
   canon authoring checklists. Filled artifacts are session artifacts, not canon
   artifacts.

   **Motion package layer** — The eight-file governance packages under
   `.nexus/motions/motion-XXXX/`. Each motion package governs one bounded seam.
   Motion packages are the authority source for ratification decisions.

3. **Relationship vocabulary** — Six canonical relationship terms for expressing
   how canon entries relate to each other:

   **depends-on** — This entry requires the referenced entry to be settled before
   it can be ratified or meaningfully used. Dependency is structural: if the
   depended-on entry changes, the dependent entry must be reviewed.
   Example: `workflow-kit-model.md` depends-on `workflow-composition-model.md`.

   **extends** — This entry builds on the referenced entry, adding new concepts
   without redefining it. The extended entry's terms and constraints are inherited
   as-is.
   Example: `governance-constraint-stack.md` extends all four mode model docs.

   **composes** — This entry uses the referenced entry as a component of a
   larger pattern or workflow.
   Example: `workflow-composition-model.md` composes CONTROL_THREAD, ORCHESTRATOR,
   REPO_EXECUTION, EXPLORATION.

   **references** — This entry cites the referenced entry for context, terminology,
   or examples, without a structural dependency.
   Example: `canon-authoring-conventions.md` references all mode model docs for
   phrasing examples.

   **example-of** — This artifact illustrates the referenced entry without
   modifying or extending it. Applies to example-layer artifacts only.
   Example: `workflow-kit-example.md` is example-of `workflow-kit-model.md`.

   **constrained-by** — This entry or artifact class is governed by the referenced
   constraint class from the governance constraint stack. The constraint applies
   to the entry at authoring and session time.
   Example: all non-REPO_EXECUTION artifacts are constrained-by Class 1
   (Non-execution) from `governance-constraint-stack.md`.

4. **Registration and dependency canon** — Rules for declaring a new canon entry
   in the registry:

   **Declare artifact class** — State which of the six navigation classes this
   entry belongs to (foundation, cross-cutting, template, example, filled artifact,
   motion package).

   **Declare layer position** — State whether this entry is a foundational layer
   or a derived/cross-cutting layer. Foundational layers require explicit ratification
   of all depended-on entries before this entry can be ratified.

   **Declare dependencies** — List all depends-on relationships by file path and
   motion number. A dependency that is not declared is treated as an undocumented
   dependency: the receiving session cannot identify it without reading the full
   corpus.

   **Declare relationships** — List all extends, composes, references, constrained-
   by, and example-of relationships applicable to this entry. Use only the six
   canonical relationship terms; do not invent new relationship types.

   **Declare no-redefinition boundaries** — Explicitly state which settled terms
   and layers this entry must not redefine. Foundational layer terms may be cited
   and referenced but not redefined in any cross-cutting or template entry.

5. **Navigation guidance** — Reader-intent-to-entrypoint mapping:

   | Reader intent | Start here |
   |---|---|
   | Understand a coordination role | Mode model doc for that role (motions 0140–0143) |
   | Understand how sessions sequence and compose | `workflow-composition-model.md` (motion-0144) |
   | Select a workflow pattern for a session arc | `workflow-kit-model.md` (motion-0145) |
   | Look up a governance constraint | `governance-constraint-stack.md` (motion-0146) |
   | Write a new canon artifact | `canon-authoring-conventions.md` (motion-0147) |
   | Navigate the canon stack and declare dependencies | `canon-interoperability-registry.md` (this doc) |
   | Understand the passalong state contract | `passalong-schema.md` (motions 0134–0139) |

6. **Boundary rules** — What the canon interoperability registry does not do:
   - Does not execute work or dispatch sessions
   - Does not mutate repo or runtime state
   - Does not add runtime enforcement or automatic indexing
   - Does not change authority relationships among settled docs (ratification is
     the authority source, not registry presence)
   - Does not override settled governance execution boundaries
   - Does not collapse role distinctions
   - Does not serve as a validator or gate; registry entries are declarations,
     not approvals
   - Preserve the explicit/manual council-run boundary

7. **Non-goals** — Automatic registry generation or maintenance; runtime dependency
   checking; new authority relationships; changes to existing mode model documents;
   portal or runtime mutation; new coordination modes; new constraint classes;
   registry presence as a ratification prerequisite.

### Sub-line B — Canon registration template

Add `.nexus/docs/templates/canon-registration-template.md` — a blank declaration
structure for registering a new canon entry using the framework defined in
`canon-interoperability-registry.md`. The template instantiates the registration
canon; the registry doc defines it.
- Entry name and file path
- Artifact class (one of the six navigation classes)
- Layer position (foundation / cross-cutting / template / example / filled / motion package)
- depends-on (list of file paths and motion numbers)
- Relationship declarations (extends / composes / references / constrained-by / example-of)
- No-redefinition boundaries (list of settled terms and layers this entry must not redefine)
- Notes

### Sub-line C — Canon interoperability example

Add `.nexus/docs/examples/canon-interoperability-example.md` — an illustrative
example of the canon stack map and filled registration templates. Explicitly marked
as illustrative only. Uses the settled canon entries as reference points but does
not add canon or modify any settled layer. Covers at minimum:
- A stack map showing the six artifact classes and their navigation relationships
- Three filled canon registration templates for representative settled entries
  (one foundation layer, one cross-cutting layer, one template layer)
- A navigation walkthrough for two reader intents (workflow roles, authoring guidance)

### Boundary preservation

This motion does not authorize:
- Automatic registry generation, maintenance, or enforcement
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0147
- File moves or broad canon rewrites
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to any existing `.nexus/docs/` documents
- New coordination modes
- New constraint classes
- Registry presence as a ratification prerequisite or blocking gate

---

## Success criteria

- **SC-1** `.nexus/docs/canon-interoperability-registry.md` exists and defines:
  registry definition, six artifact classes, six relationship terms with examples,
  registration and dependency canon (five declaration rules), navigation guidance
  table, boundary rules, non-goals
- **SC-2** `.nexus/docs/templates/canon-registration-template.md` exists and covers:
  entry name/path, artifact class, layer position, depends-on, relationship
  declarations, no-redefinition boundaries, notes
- **SC-3** `.nexus/docs/examples/canon-interoperability-example.md` exists, is
  marked as illustrative only, and covers: stack map, three filled registration
  templates (foundation / cross-cutting / template), two navigation walkthroughs
- **SC-4** `validate-motion` passes for motion-0148
- **SC-5** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-6** `pnpm typecheck` passes
- **SC-7** No existing `.nexus/docs/*.md`, portal runtime, governance runner, skill
  prompt, eval fixture, or grid script files modified

---

## Non-goals

- Automatic registry generation, maintenance, or enforcement
- Runtime dependency checking or validation
- New authority relationships among settled canon layers
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- File moves or broad canon rewrites
- Reopening or amending motions 0134–0147
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to existing `.nexus/docs/` documents
- New coordination modes
- New constraint classes
- Registry presence as a ratification prerequisite
