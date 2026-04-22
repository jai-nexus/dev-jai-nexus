# Proposal: JAI Canon Authoring Conventions v0

**Motion:** motion-0147
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-21
**Basis:** motion-0146 (JAI Governance Constraint Stack Canon v0)

---

## Current repo framing

Motions 0134–0146 are merged baseline. The full governance canon layer is settled:

- Operator surface / passalong schema v1.1 — motions 0134–0139
- CONTROL_THREAD — `.nexus/docs/control-thread-model.md` (motion-0140)
- REPO_EXECUTION — `.nexus/docs/repo-execution-model.md` (motion-0141)
- ORCHESTRATOR — `.nexus/docs/orchestrator-model.md` (motion-0142)
- EXPLORATION — `.nexus/docs/exploration-model.md` (motion-0143)
- Workflow composition — `.nexus/docs/workflow-composition-model.md` (motion-0144)
- Workflow kit — `.nexus/docs/workflow-kit-model.md` (motion-0145)
- Governance constraint stack — `.nexus/docs/governance-constraint-stack.md` (motion-0146)

Each of these documents was authored independently. The framing has been consistent
— boundary rules, non-goals, success criteria, model/template/example structure —
but the conventions governing how to write canon artifacts have never been formally
documented. Each new canon addition must reconstruct these conventions by reading
the full corpus.

---

## Problem

Motions 0140–0146 produced a consistent canon authoring pattern — but that pattern
exists only implicitly, embedded in the artifacts themselves. As the canon corpus
grows, new canon additions need a documented reference for how to write compliant
artifacts, differentiate artifact types, phrase continuity and boundary language,
and reference prior canon layers without redefining them.

Five gaps remain:

**1. No canonical authoring-convention definition.**
There is no document that defines what authoring conventions are in the JAI NEXUS
context, or establishes them as advisory/documentary guidance for writing canon docs,
templates, examples, and filled artifacts. New authors must reverse-engineer the
pattern from the existing corpus.

**2. No artifact differentiation canon.**
The corpus contains model docs, templates, examples, and filled artifacts (manifests,
constraint callouts, passalongs, transition matrix instances, kit manifests).
The naming and differentiation rules for these artifact types are not formally stated.
Authors must infer the distinctions from file naming conventions and document
structure. No document states: "model docs define; templates instantiate; examples
illustrate; filled artifacts are session outputs."

**3. No continuity and boundary phrasing canon.**
How to phrase settled canon, open questions, deferred ideas, non-goals, risks,
routing targets, next prompts, no-touch boundaries, and governance boundaries such
as the council-run boundary is not standardized. Authors currently follow the
implicit pattern of prior docs, but without a reference, language drifts across
the corpus.

**4. No cross-layer reference canon.**
When a new canon addition references a prior canon layer, there are no documented
rules for how to do so: how to state scope, cite inheritance, reference without
redefining, and preserve interoperability across role canon, composition canon,
workflow-kit canon, and constraint canon. Authors may inadvertently redefine or
contradict prior layers when extending the corpus.

**5. No authoring checklist.**
There is no compact, reusable checklist for future canon additions. Each new motion
must reconstruct its own quality check from the existing corpus. The absence of a
checklist creates inconsistency in what each new canon addition verifies before
ratification.

---

## Solution

### Sub-line A — Canon authoring conventions doc

Add `.nexus/docs/canon-authoring-conventions.md` defining:

1. **Authoring-convention definition** — Canon authoring conventions are advisory
   and documentary guidance for writing JAI NEXUS canon artifacts. They apply to
   model docs, templates, examples, and filled artifacts produced under the
   governance canon. They do not execute work, add runtime enforcement, or override
   settled governance execution boundaries. A convention is guidance, not a gate.

2. **Artifact differentiation canon** — Four artifact types:

   **Model doc** — The normative reference for a concept or canon layer. Defines
   classifications, structures, and rules. The model doc defines; it is the source
   of truth for the concept it covers. Naming pattern: descriptive noun phrase in
   kebab-case (e.g., `workflow-kit-model.md`, `governance-constraint-stack.md`,
   `canon-authoring-conventions.md`). A model doc does not instantiate; it defines.

   **Template** — A blank structure for producing a filled artifact. Instantiates
   the canon structure defined by a model doc. Does not extend or redefine the
   model doc. Naming pattern: `[concept]-template.md` (e.g.,
   `kit-manifest-template.md`, `constraint-callout-template.md`). The template
   instantiates; the model doc defines.

   **Example** — An illustrative, non-normative instantiation of a concept or
   template. Always marked "Illustrative only." Uses fictional references and
   placeholder values. Does not establish new canon. Naming pattern:
   `[concept]-example.md` (e.g., `workflow-kit-example.md`,
   `governance-constraint-stack-example.md`). The example illustrates; it does not
   ratify or define.

   **Filled artifact** — A completed instance produced by a session using a
   template. Named for its artifact type, not as a template or example (e.g., kit
   manifest, constraint callout, passalong, transition matrix instantiation). Filled
   artifacts are session artifacts, not canon artifacts. They do not establish new
   canon.

3. **Continuity and boundary phrasing canon** — Required treatment for standard
   elements across all canon artifact types:

   **Settled canon** — Phrase as: "X is settled through motion-XXXX" or "X is
   defined in [file-path] (motion-XXXX)." Never redefine settled canon in a new
   document. If a new document uses a term from a prior canon, cite the source;
   do not re-explain the term's meaning.

   **Active work** — Phrase as: "In progress under motion-XXXX" or "This motion
   addresses: [description]." Active work is authorized by a ratified or in-progress
   motion and has not yet been closed. Do not conflate active work with settled canon
   (complete) or deferred ideas (not yet authorized). When handoff state travels
   across sessions, active work items must be explicitly listed so the receiving
   session can identify what is still open.

   **Open questions** — Phrase as: "Open question: [question text]." List under
   a dedicated section or inline with an explicit marker. An open question is not
   a gap — it is a named uncertainty that requires future investigation or
   ORCHESTRATOR routing.

   **Deferred ideas** — Phrase as: "Deferred to [future motion class or program
   arc]." If a deferred idea is actively tracked, it must be registered as an open
   item in CONTROL_THREAD. Do not leave deferred ideas as implicit non-goals.

   **Non-goals** — Phrase as an explicit bulleted list under `## Non-goals`. State
   what is excluded, not only what is included. Each item states a specific
   boundary: what this artifact or session does not do and will not do.

   **Risks** — Phrase as: "R-N — [Risk name]: [risk description]. Mitigation:
   [mitigation]." Use the numbered risk format in challenge.md artifacts. Risks
   must have named mitigations; risks without mitigations should be resolved before
   ratification.

   **Routing targets** — Phrase as: "produces a routing recommendation for [mode]"
   or "routes to [mode] for [reason]." Never phrase as "dispatches to [mode]" or
   "the kit/template routes to [mode]." Routing is produced by sessions, not
   executed by artifacts.

   **Next prompts** — Phrase as exact user-facing prompt starters. State what a
   session operator would type, not what an AI should do. Next prompts are
   handoff artifacts, not instructions.

   **No-touch boundaries** — Phrase as an explicit bulleted list under
   `## No-touch boundaries` or `### No-touch list`. Name specific files and
   directories. "All existing docs" is not sufficient — enumerate the paths.

   **Governance boundaries** — Phrase the council-run boundary as "the
   explicit/manual council-run boundary." Never phrase as "the automated
   council-run process" or "automatic ratification." The boundary is always
   explicit and manual.

4. **Cross-layer reference canon** — Rules for referencing prior canon in new
   canon additions:

   **State scope** — Each new canon doc must include a scope statement: "This
   document applies to [specific artifact types or session types]."

   **State inheritance** — If a new canon doc inherits from a prior canon layer,
   state it explicitly: "This document inherits from [prior-doc] (motion-XXXX)
   and does not redefine it."

   **Reference without redefining** — When referencing a term from a prior canon
   layer, cite the source document by file path and motion number. Do not
   re-explain the term's full definition. Use the term as defined in the source.

   **Preserve interoperability** — A new canon addition must not contradict,
   narrow, or extend a settled constraint class, transition class, or kit without
   a new governed motion. If a new doc would require changing a prior canon, it
   requires a new motion to amend the prior layer.

   **Cross-cutting status** — When a rule applies across all coordination modes
   or artifact types, phrase it as "applies across all coordination modes" or
   "applies to all artifact types." Do not list each mode/type individually unless
   the applicability differs.

5. **Authoring checklist** — A compact reusable checklist for future canon additions.
   Applied before ratification to verify a new canon artifact is compliant:

   - [ ] Artifact type is identified (model doc / template / example / filled artifact)
   - [ ] Scope is stated (what artifact types or session types this applies to)
   - [ ] Prior canon inheritance is cited by file path and motion number
   - [ ] Settled canon is not redefined in this artifact
   - [ ] Non-goals are listed explicitly (not just implied)
   - [ ] Boundary rules section is present
   - [ ] No-touch boundaries are enumerated (not "all existing docs")
   - [ ] If template: fields match the model doc's canon structure exactly
   - [ ] If example: marked "Illustrative only" with fictional references
   - [ ] Council-run boundary is not phrased as automatic
   - [ ] No dispatch language in non-REPO_EXECUTION artifacts
   - [ ] No new constraint classes beyond settled v0 catalog (unless new motion)
   - [ ] No new coordination modes beyond the settled four (unless new motion)

   The checklist is guidance, not a gate. Its presence in a canon doc signals that
   the author has applied it. Its absence is not a blocking condition — but
   unanswered checklist items should be treated as open questions.

6. **Boundary rules** — What canon authoring conventions do not do:
   - Do not execute work or dispatch sessions
   - Do not mutate repo or runtime state
   - Do not add runtime enforcement mechanisms or automatic convention checking
   - Do not override settled governance execution boundaries
   - Do not collapse role distinctions
   - Do not define new canon layers (new layers require new motions)
   - Preserve the explicit/manual council-run boundary

7. **Non-goals** — Automatic enforcement of authoring conventions; linting or CI
   checks for convention compliance; violation reporting; changes to existing mode
   model documents; portal or runtime mutation; new coordination modes; new
   constraint classes.

### Sub-line B — Canon authoring checklist template

Add `.nexus/docs/templates/canon-authoring-checklist-template.md` — a blank
instantiation of the authoring checklist from Sub-line A, formatted for use in motion
packages, model docs, or any future canon addition that wants to record checklist
compliance. The template instantiates the checklist; the conventions doc defines it.
Fields:
- Artifact type
- Scope statement
- Prior canon inheritance citations
- Settled canon not redefined (checked list)
- Non-goals listed
- Boundary rules present
- No-touch list enumerated
- Template/example markers (if applicable)
- Council-run boundary phrasing confirmed
- Dispatch language check
- Constraint class count check
- Mode count check

### Sub-line C — Canon authoring example

Add `.nexus/docs/examples/canon-authoring-example.md` — an illustrative example
of a compliant canon artifact structure. Explicitly marked as illustrative only.
Uses fictional references and placeholder values. Covers at minimum:
- A fictional model doc skeleton with all required sections and phrasing
- A filled authoring checklist for the fictional model doc
- An annotation layer showing which convention each section satisfies

### Boundary preservation

This motion does not authorize:
- Automatic enforcement of authoring conventions or linting
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0146
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to any existing `.nexus/docs/` documents
- Defining new coordination modes
- Defining new constraint classes
- Establishing any checklist item as a blocking gate

---

## Success criteria

- **SC-1** `.nexus/docs/canon-authoring-conventions.md` exists and defines:
  authoring-convention definition, four artifact types with naming patterns, ten
  continuity/boundary phrasing rules, four cross-layer reference rules, thirteen-
  item authoring checklist, boundary rules, non-goals
- **SC-2** `.nexus/docs/templates/canon-authoring-checklist-template.md` exists
  and covers all thirteen checklist items from SC-1
- **SC-3** `.nexus/docs/examples/canon-authoring-example.md` exists, is marked as
  illustrative only, and covers: fictional model doc skeleton, filled checklist,
  annotation layer
- **SC-4** `validate-motion` passes for motion-0147
- **SC-5** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-6** `pnpm typecheck` passes
- **SC-7** No existing `.nexus/docs/*.md`, portal runtime, governance runner, skill
  prompt, eval fixture, or grid script files modified

---

## Non-goals

- Automatic enforcement of authoring conventions or CI linting
- Violation reporting or convention compliance gates
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0146
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Modifications to existing `.nexus/docs/` documents
- Defining new coordination modes
- Defining new constraint classes
- Establishing any checklist item as a blocking gate or hard requirement
