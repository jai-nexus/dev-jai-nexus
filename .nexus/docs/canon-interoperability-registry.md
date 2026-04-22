# Canon Interoperability Registry - dev-jai-nexus

## Purpose

This document defines the canon interoperability registry for JAI NEXUS.

The registry is a documentary and advisory navigational map of the current canon
ladder. It helps readers locate settled canon, understand how artifacts relate to
each other, and place future canon additions without restating or rewriting the
layers that already exist.

The registry improves navigation and extension without introducing automation,
runtime enforcement, or authority changes.

The registry does not:

- execute work
- mutate repo state
- mutate runtime state
- add runtime enforcement
- change authority relationships among settled docs
- override settled governance execution boundaries
- collapse role distinctions

Where governance read-only surfaces appear, the registry preserves the
explicit/manual council-run boundary.

---

## Scope

This document applies to the settled governance canon stack and to future canon
additions that need to declare where they belong, what they depend on, what they
extend, and what they must not redefine.

This registry is a navigational map. It is not a new authority layer.

Registry presence does not confer authority. Authority remains grounded in
ratification under a governed motion.

---

## Registry definition

The canon interoperability registry records:

- artifact classes used for stack navigation
- the compact relationship vocabulary used across entries
- current canon placement for the settled ladder
- declaration guidance for future canon additions
- entrypoint guidance for readers who need to navigate the stack

The registry indexes settled canon. It does not rewrite settled canon.

An undeclared dependency is a dependency risk because later readers may not be
able to locate the correct upstream layer quickly. It is not a runtime gate or an
automatic blocker.

---

## Current canon ladder snapshot

The current ladder can be read as the following compact stack snapshot.

### Continuity foundation context

- `.nexus/codex/passalong-schema.md` (motions `0134` through `0139`)

### Foundational model docs

- `.nexus/docs/control-thread-model.md` (motion-0140)
- `.nexus/docs/repo-execution-model.md` (motion-0141)
- `.nexus/docs/orchestrator-model.md` (motion-0142)
- `.nexus/docs/exploration-model.md` (motion-0143)
- `.nexus/docs/workflow-composition-model.md` (motion-0144)

### Derived model docs

- `.nexus/docs/workflow-kit-model.md` (motion-0145)
- `.nexus/docs/governance-constraint-stack.md` (motion-0146)
- `.nexus/docs/canon-authoring-conventions.md` (motion-0147)
- `.nexus/docs/canon-interoperability-registry.md` (motion-0148)

### Template family

- `.nexus/docs/templates/*.md`

### Example family

- `.nexus/docs/examples/*.md`

### Motion-package family

- `.nexus/motions/motion-XXXX/`

Filled artifacts, manifests, and callouts are not maintained here as a live list.
They are session-produced entries that can be registered when a specific canon
artifact needs to reference them.

---

## Artifact classes

The registry uses the following artifact classes.

These are index and navigation categories. They are not runtime types.

### Model docs

Model docs define concepts, classifications, or canon layers.

Within this class, some model docs are foundational and some are derived.

Foundational model docs should be settled before dependent additions are ratified.
If a future addition relies on an unsettled foundational doc, that should be
called out as a dependency risk rather than treated as automatic registry gating.

Derived model docs may extend or compose foundational docs without redefining
them.

### Templates

Templates are blank reusable structures that instantiate canon already defined by
model docs.

Templates belong in the stack as reusable support artifacts. They do not redefine
the model docs they instantiate.

### Examples

Examples are illustrative, non-normative demonstrations.

Examples should stay marked `Illustrative example only` and should be read as
navigation aids rather than as authority sources.

### Filled artifacts / manifests / callouts

Filled artifacts are completed session outputs such as:

- manifests
- callouts
- passalongs
- transition-matrix instances
- authoring checklists

These artifacts are indexable when needed for navigation, but they remain session
artifacts rather than canon layers.

### Motion packages

Motion packages under `.nexus/motions/motion-XXXX/` govern one bounded seam at a
time.

They remain the authority source for ratification decisions. Registry presence
does not elevate a motion package or replace the motion package as the governing
basis.

---

## Relationship vocabulary

The registry uses the following bounded relationship vocabulary.

### `foundational`

Use `foundational` when the referenced entry is part of the settled base that a
later addition stands on.

This label is advisory. It signals that later additions should cite and preserve
that layer rather than redefine it.

Example:

- `.nexus/docs/workflow-composition-model.md` is foundational to
  `.nexus/docs/workflow-kit-model.md`

### `extends`

Use `extends` when the current entry adds a new layer or guidance surface on top
of an earlier canon entry without redefining it.

Example:

- `.nexus/docs/workflow-kit-model.md` extends
  `.nexus/docs/workflow-composition-model.md`

### `composes`

Use `composes` when the current entry uses other canon entries as components of a
larger pattern or navigational structure.

Example:

- `.nexus/docs/workflow-composition-model.md` composes `CONTROL_THREAD`,
  `ORCHESTRATOR`, `REPO_EXECUTION`, and `EXPLORATION`

### `references`

Use `references` when the current entry cites another entry for terminology,
context, or guidance without restating it as a new layer.

Example:

- `.nexus/docs/canon-authoring-conventions.md` references prior canon docs by path
  and motion number

### `example-of`

Use `example-of` for illustrative artifacts that demonstrate a model doc or
template without modifying it.

Example:

- `.nexus/docs/workflow-kit-example.md` is example-of
  `.nexus/docs/workflow-kit-model.md`

### `constrained-by`

Use `constrained-by` when the current entry is shaped by already-settled
constraint guidance that it must preserve.

Example:

- `.nexus/docs/canon-authoring-conventions.md` is constrained-by
  `.nexus/docs/governance-constraint-stack.md`

Only use these six relationship terms in registration entries. Do not introduce
new relationship labels for similar concepts.

---

## Registration guidance

Future canon additions should register themselves in a compact declarative way.

### Where it belongs

State the artifact class and the primary placement in the stack.

Examples:

- foundational model doc
- derived model doc
- template
- example
- filled artifact
- motion package

### What it depends on

List the prior canon entries required for the new artifact to make sense.

Use file paths and motion numbers when available. If a dependency is omitted, that
omission should be treated as a dependency risk because readers may not be able to
reconstruct the intended stack position quickly.

### What it extends, composes, references, is example-of, or is constrained-by

Declare whichever of the bounded relationship terms apply.

Use only:

- `foundational`
- `extends`
- `composes`
- `references`
- `example-of`
- `constrained-by`

### What it must not redefine

State the settled terms, layers, or boundaries that remain upstream of the new
entry.

Common no-redefinition boundaries include:

- role definitions already settled in mode model docs
- transition classes and continuity buckets already settled in
  `workflow-composition-model.md`
- constraint classes already settled in `governance-constraint-stack.md`
- explicit/manual council-run boundary wording where governance read-only surfaces
  are in scope

### Advisory and non-executing status

If the entry is documentary, advisory, or non-executing, say so directly inside
the registration entry.

This keeps the stack legible without implying that registration itself performs
indexing, validation, or authority transfer.

---

## Navigation guidance

Use the following entrypoints when navigating the stack.

| Reader intent | Start here |
|---|---|
| Understand a workflow role | the relevant mode model doc in `.nexus/docs/` |
| Understand cross-layer session sequencing | `.nexus/docs/workflow-composition-model.md` |
| Understand workflow kits and reusable session loops | `.nexus/docs/workflow-kit-model.md` |
| Look up governance read-only surface boundaries | `.nexus/docs/governance-constraint-stack.md` |
| Look up constraint guidance for non-executing and non-mutating artifacts | `.nexus/docs/governance-constraint-stack.md` |
| Write or review a canon artifact | `.nexus/docs/canon-authoring-conventions.md` |
| Register a new canon addition in the stack | `.nexus/docs/templates/canon-registration-template.md` and this registry |
| Understand continuity and passalong vocabulary | `.nexus/codex/passalong-schema.md` |

The registry helps a reader choose the right starting document. It does not
replace those documents.

---

## Boundary rules

The canon interoperability registry does not:

- execute work
- dispatch sessions
- mutate repo state
- mutate runtime state
- add runtime enforcement
- add automatic indexing or generation
- change authority relationships among settled docs
- override settled governance execution boundaries
- collapse role distinctions
- serve as a validator or gate

The registry describes placement and relationships. It does not approve, reject,
or ratify entries.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- runtime enforcement
- automatic indexing or generation
- repo/runtime mutation
- portal/runtime changes
- file moves
- broad canon rewrites
- changes to `.claude/**`
- changes to `package.json`
- changes to runtime command surfaces
- new authority relationships among settled docs
- registry presence as a ratification prerequisite

This model is documentary v0 only.
