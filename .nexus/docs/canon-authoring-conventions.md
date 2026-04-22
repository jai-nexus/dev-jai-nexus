# Canon Authoring Conventions - dev-jai-nexus

## Purpose

This document defines stack-wide authoring conventions for JAI NEXUS canon
artifacts.

These conventions are documentary and advisory guidance for writing:

- canon docs
- templates
- examples
- filled artifacts

They improve interoperability across the settled canon corpus without introducing
automation, linting, or runtime enforcement.

The conventions in this document do not:

- execute work
- mutate repo state
- mutate runtime state
- add runtime enforcement
- override settled governance execution boundaries
- collapse role distinctions

Where governance-read-only wording is relevant, these conventions preserve the
explicit/manual council-run boundary.

---

## Scope

This document applies to future canon additions and adjacent governance artifacts
that need to align with the settled corpus from motions `0140` through `0146`.

It is a reference for authoring shape and phrasing. It is not a replacement for
the model documents it references.

---

## Authoring-convention definition

Canon authoring conventions are reusable writing rules that keep canon artifacts
legible, interoperable, and cross-referenceable across layers.

They help authors state:

- what kind of artifact they are writing
- what prior canon that artifact inherits from
- what the artifact does and does not do
- how continuity state and boundary language should be phrased

A convention is guidance, not a gate.

Using these conventions should make future canon additions easier to compare with
the existing corpus without reopening settled canon.

---

## Artifact differentiation

Future canon additions should keep the following artifact types clearly distinct.

### Model docs

A model doc defines a concept, classification, or canon layer.

A model doc should:

- define the concept it covers
- state its scope
- state inheritance from prior canon when relevant
- name boundary rules and non-goals

A model doc should not instantiate itself as a live session artifact.

Typical naming shape:

- descriptive kebab-case noun phrase such as `workflow-kit-model.md`
- descriptive kebab-case noun phrase such as `governance-constraint-stack.md`
- descriptive kebab-case noun phrase such as `canon-authoring-conventions.md`

### Templates

A template is a blank reusable structure for a later filled artifact.

A template should:

- instantiate a structure already defined by a model doc
- stay blank and reusable
- keep its fields aligned with the defining canon

A template should not redefine or extend the model doc it references.

Typical naming shape:

- `[concept]-template.md`

### Examples

An example is an illustrative, non-normative demonstration of how a concept or
template may be used.

An example should:

- be marked `Illustrative example only`
- use fictional references or placeholder values
- show one bounded scenario rather than an exhaustive taxonomy

An example should not establish new canon, ratify anything, or act as a live
governance record.

Typical naming shape:

- `[concept]-example.md`

### Filled artifacts

A filled artifact is a completed instance produced by a session.

Filled artifacts include things such as:

- passalongs
- manifests
- callouts
- transition-matrix instances
- sync-back records

Filled artifacts should:

- be named for the artifact type they are
- preserve the structure defined by the related template or model doc
- remain documentary unless a separate settled execution surface says otherwise

Filled artifacts are session artifacts. They are not new canon layers.

### Manifest and callout note

When a filled artifact is specifically a manifest or a callout, that name should
remain visible in the artifact title or section heading.

Examples:

- a filled `kit manifest`
- a filled `constraint callout`

Those names identify the artifact instance. They do not create a new artifact
class separate from the four types above.

---

## Phrasing canon

The following phrasing guidance should be used across canon artifacts where the
relevant concept appears.

### Settled canon

Phrase settled canon by citing the canon layer rather than redefining it.

Preferred shape:

- `X is settled through motion-XXXX.`
- `X is defined in [file-path] (motion-XXXX).`

Do not re-explain a settled concept when citation is enough.

### Active work

Keep active work explicitly separate from settled canon and from unresolved
questions.

Preferred shape:

- `Active work: [bounded seam in progress under motion-XXXX].`
- `In progress under motion-XXXX.`

Where continuity state is being recorded, active work should appear after settled
canon and before open questions.

### Open questions

Phrase open questions as named uncertainties rather than as implied gaps.

Preferred shape:

- `Open question: [question text].`

Open questions should stay distinct from active work and deferred ideas.

### Deferred ideas

Phrase deferred ideas as intentionally postponed rather than silently dropped.

Preferred shape:

- `Deferred to [future motion class, later seam, or program arc].`

If the deferred item remains active continuity state, it should stay visible in
`what remains open`.

### Non-goals

List non-goals explicitly under a visible non-goals section.

Preferred shape:

- explicit bullet list under `## Non-goals`

Non-goals should say what is out of scope, not only what is in scope.

### Risks

Phrase risks advisorially and pair them with mitigations.

Preferred shape:

- `Risk: [description]`
  `Mitigation: [mitigation]`

Risks should be phrased as concerns that should be resolved before ratification or
before relying on the artifact for closure, not as runtime blocking logic.

### Routing targets

Phrase routing as documentary output from a session, not as dispatch behavior from
an artifact.

Preferred shape:

- `produces a routing recommendation for [mode]`
- `routes to [mode] for [reason]`

Avoid phrases that treat the artifact itself as a dispatcher.

### Next prompts

Phrase next prompts as exact operator-facing prompt starters.

Preferred shape:

- a literal prompt line that a later session operator could reuse

Next prompts are continuity aids. They are not automation hooks.

### No-touch boundaries

List no-touch boundaries explicitly when boundary-sensitive surfaces matter.

Preferred shape:

- explicit bullet list under `## No-touch boundaries`
- explicit bullet list under `### No-touch list`

Use concrete files or directories. Avoid vague phrases such as `all existing docs`.

### Explicit/manual boundaries

When governance-read-only language is relevant, preserve the settled phrasing:

- `the explicit/manual council-run boundary`

Do not phrase council-run as automatic, hidden, or self-executing.

---

## Continuity treatment

When a canon artifact records continuity-bearing state, it should preserve the
settled seven-bucket vocabulary inherited from
`workflow-composition-model.md` (motion-0144):

1. current baseline
2. what is settled
3. what remains open
4. tasks
5. risks
6. routing targets
7. next prompts

Where these buckets are present, authors should keep the ordering legible.

The preferred continuity sequence is:

1. settled canon
2. active work
3. open questions
4. deferred ideas
5. risks
6. routing targets
7. next prompts

Not every artifact needs every item. When a subset is used, the distinctions
should still remain explicit.

---

## Cross-layer reference rules

Future canon additions should reference prior canon layers in the following way.

### State scope

Each new canon addition should say what artifact types or session types it applies
to.

Preferred shape:

- `This document applies to [artifact types or session types].`

### State inheritance

If the new artifact depends on prior canon, say so directly.

Preferred shape:

- `This document inherits from [file-path] (motion-XXXX) and does not redefine it.`

### State advisory and non-executing status

If the artifact is documentary or advisory, say that explicitly near the front of
the document.

Preferred shape:

- `This document is documentary and advisory.`
- `This template is reusable and non-executing.`

### Cross-reference without redefining

When a prior canon term is used, cite the source document and motion rather than
re-explaining the full concept.

Reference the source; do not redefine the source.

### Preserve interoperability

Future canon additions should not contradict, narrow, or extend a settled canon
layer unless a new governed motion explicitly does that work.

If a new artifact would change prior canon, that change belongs in a new motion,
not in an incidental rephrasing.

---

## Authoring checklist

The following self-applied checklist is the compact authoring pass for future
canon additions.

This checklist is guidance, not a gate.

An unanswered item is still worth surfacing, but the checklist itself is not a
runtime blocker or compliance mechanism.

- [ ] artifact type identified
- [ ] scope and inheritance stated
- [ ] advisory and non-executing status stated
- [ ] settled canon cited rather than redefined
- [ ] active work stated separately from settled canon and open questions where relevant
- [ ] continuity phrasing present where relevant
- [ ] boundary language present where relevant
- [ ] non-goals present
- [ ] risks present
- [ ] routing targets and next prompts present where relevant
- [ ] no-touch boundaries present where relevant
- [ ] template, example, and filled-artifact distinction preserved
- [ ] explicit/manual council-run boundary preserved where relevant

---

## Boundary rules

Canon authoring conventions do not:

- execute work
- dispatch sessions
- mutate repo state
- mutate runtime state
- add runtime enforcement
- add linting logic
- override settled governance execution boundaries
- collapse role distinctions
- create hidden controller behavior

These conventions describe how canon should be written. They do not perform the
work they describe.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- background orchestration
- runtime enforcement
- automatic linting or generation
- automatic routing
- automatic branch creation
- automatic motion-id generation
- PR generation
- GitHub workflow integration
- repo/runtime mutation
- portal/runtime changes
- new coordination modes
- new constraint classes
- reopening settled canon through incidental rephrasing

This model is documentary v0 only.
