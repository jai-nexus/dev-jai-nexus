# Proposal: JAI Canon Review and Maintenance Guidance v0

**Motion:** motion-0149
**Kind:** builder-proof
**Program:** q2-canon-stack-consolidation
**Date:** 2026-04-22
**Basis:** motion-0148 (JAI Canon Interoperability Registry v0)

---

## Current repo framing

Motions 0134–0148 are merged baseline. The full governance canon stack is settled:

- Operator surface / passalong schema v1.1 — motions 0134–0139
- CONTROL_THREAD — `.nexus/docs/control-thread-model.md` (motion-0140)
- REPO_EXECUTION — `.nexus/docs/repo-execution-model.md` (motion-0141)
- ORCHESTRATOR — `.nexus/docs/orchestrator-model.md` (motion-0142)
- EXPLORATION — `.nexus/docs/exploration-model.md` (motion-0143)
- Workflow composition — `.nexus/docs/workflow-composition-model.md` (motion-0144)
- Workflow kit — `.nexus/docs/workflow-kit-model.md` (motion-0145)
- Governance constraint stack — `.nexus/docs/governance-constraint-stack.md` (motion-0146)
- Canon authoring conventions — `.nexus/docs/canon-authoring-conventions.md` (motion-0147)
- Canon interoperability registry — `.nexus/docs/canon-interoperability-registry.md` (motion-0148)

This canon stack is the foundation for ongoing JAI NEXUS governance. As the stack is used, discrepancies, wording drift, overlap between layers, and stale examples will accumulate. The settled stack has no documented guidance for how to handle these situations — no vocabulary for maintenance action types, no decision criteria for when correction vs. extension vs. supersession is appropriate, and no explicit guardrail against casual reopening of settled layers.

---

## Problem

Four gaps remain:

**1. No maintenance action class canon.**
There is no vocabulary for distinguishing the types of maintenance actions that may be applied to settled canon entries. Without named action classes, authors cannot communicate precisely whether a proposed change is a bounded factual correction, a clarification that improves readability without changing meaning, an extension that adds new concepts, a supersession that replaces a settled layer, a deprecation that marks a layer as no longer current, or a drift-handling note that registers a known discrepancy without requiring action.

**2. No maintenance decision guidance.**
When an author encounters a discrepancy, stale example, overlap between canon layers, or wording divergence, there is no documented process for determining the correct response. The options — correct in place, clarify, extend via new motion, supersede via new motion, deprecate, or register as known drift — require judgment that is currently undocumented. Without decision guidance, authors either over-act (opening new motions for bounded corrections) or under-act (leaving structural inconsistencies unaddressed).

**3. No drift-handling canon.**
Three drift types accumulate across canon layers without detection or handling guidance:
- **Wording drift** — different layers use different terms for the same concept
- **Overlap drift** — two or more layers partially cover the same seam without cross-referencing
- **Example drift** — examples in an earlier layer become inconsistent with a later-settled layer

Without named drift types and handling guidance, these accumulate silently and erode the coherence of the stack over time.

**4. No casual-reopening guardrail.**
Without explicit guidance that style preferences, minor phrasing differences, and undocumented personal preferences do not constitute grounds for reopening a settled canon layer, the stack is vulnerable to unproductive churn. A canon layer should be reopened only when a concrete defect — factual error, structural inconsistency, or scope gap — cannot be addressed by a bounded correction or clarification.

---

## Solution

### Sub-line A — Canon review and maintenance guidance doc

Add `.nexus/docs/canon-review-maintenance-guidance.md` defining:

1. **Review and maintenance definition** — Canon review is the process of examining a settled canon entry to determine whether it contains a defect (factual error, broken reference, structural inconsistency, or scope gap) that warrants a maintenance action. Canon maintenance is the application of a scoped maintenance action to address an identified defect. Canon review and maintenance are advisory processes; they do not operate automatically, do not require a new motion for all action classes, and do not alter the authority of settled entries.

2. **Maintenance action classes** — Six named classes:

   **Correction** — Fixing a factual error, broken cross-reference, or an example that was incorrect at the time of ratification. Does not change the meaning or scope of the entry. May be applied as a bounded in-place edit without a new motion, provided the fix is limited to the error only and introduces no new terms, no new scope, and no new canonical rules. Does not address drift accumulated after ratification — post-ratification inconsistencies are handled via the drift handling pathway.

   **Clarification** — Improving readability, removing ambiguity, or aligning phrasing consistency across layers without changing meaning or scope. May be applied as a bounded in-place edit without a new motion, provided no new canonical terms are introduced and no scope is extended. If resolving ambiguity requires selecting among disputed interpretations of the original ratification context, the action class shifts to extension.

   **Extension** — Adding new concepts, terms, artifact types, relationship terms, or coverage to an existing canon layer without redefining existing terms. Always requires a new motion. Extension explicitly states which existing entry it extends and what it adds.

   **Supersession** — Replacing a settled canon layer with a new version that redefines or restructures its content. Always requires a new motion that explicitly states "supersedes motion-XXXX." The superseded entry is annotated as deprecated; it is not removed.

   **Deprecation** — Marking a settled entry as superseded, stale, or no longer the canonical reference on its seam. Requires a new motion or an explicit deprecation note in the superseding motion. A deprecated entry is annotated, not deleted.

   **Drift handling** — The assessment and routing pathway for accumulated drift scenarios. Selects the appropriate terminal action (correction, clarification, extension, supersession, or drift registration) based on drift severity; it is not itself a terminal action. The correct response depends on drift severity: cosmetic drift is registered as a known drift note (no new motion required); meaningful drift is addressed by clarification or correction (no new motion required); structural drift requires extension or supersession (new motion required).

3. **Maintenance decision guidance** — Criteria table for selecting the correct action class:

   | Situation | Action class | New motion required? |
   |---|---|---|
   | Factual error in a settled entry | Correction | No |
   | Broken cross-reference or stale file path | Correction | No |
   | Ambiguous phrasing causing misreading | Clarification | No |
   | Phrasing inconsistency across layers (cosmetic) | Clarification | No |
   | New concept to add to an existing layer | Extension | Yes |
   | Existing layer structurally outdated | Supersession | Yes |
   | Entry no longer the current canonical reference | Deprecation | Yes (or note in superseding motion) |
   | Wording drift across layers (cosmetic) | Drift handling — register as known drift | No |
   | Wording drift across layers (meaning shift) | Drift handling — clarification or extension | Depends on scope |
   | Overlap between two layers (complementary) | Drift handling — add cross-reference via clarification | No |
   | Overlap between two layers (contradictory) | Drift handling — extension or supersession | Yes |
   | Example inconsistent with later-settled layer (cosmetic) | Drift handling — correction | No |
   | Example inconsistent with later-settled layer (structural) | Drift handling — supersession | Yes |
   | Style preference or personal phrasing preference | No action — not a maintenance ground | No |

4. **Drift-handling canon** — Named drift types and handling approach:

   **Wording drift** — Different layers use different terms for the same concept without contradiction. Example: one layer uses "session arc," another uses "workflow arc" for equivalent concepts. Handling: register as known wording drift in a drift note. If the drift causes reader confusion, apply a clarification to the more recent layer. A new motion is not required unless a new canonical term is being established.

   **Overlap drift** — Two or more layers partially cover the same seam without cross-referencing. Example: governance-constraint-stack.md and workflow-kit-model.md both address state-carrying without referencing each other. Handling: if the overlap is complementary (consistent, non-contradictory), register as known overlap and add cross-references via clarification. If the overlap is contradictory, extension or supersession via new motion is required.

   **Example drift** — An example in an earlier layer becomes inconsistent with terminology or structure settled in a later layer. Example: a workflow example from the composition model uses terminology superseded by the kit model. Handling: if the inconsistency is cosmetic (terminology variation, no meaning change), apply a correction in place. If the inconsistency is structural (the example now illustrates incorrect behavior), extend or supersede via new motion.

5. **Casual-reopening guardrail** — The following do not constitute grounds for reopening, extending, or superseding a settled canon layer:
   - Personal phrasing preference with no canonical correctness implication
   - Style churn with no meaning change
   - Desire to use different terminology when existing terminology is unambiguous and consistent
   - Minor formatting preferences
   - Cosmetic wording drift that does not cause reader confusion

   A reopening (extension or supersession) requires a concrete defect — factual error, structural inconsistency, or scope gap — that cannot be addressed by a bounded correction or clarification. The bar for a new motion is: a reader following the existing canon would reach an incorrect or ambiguous conclusion on a meaningful governance question.

6. **Boundary rules** — What canon review and maintenance guidance does not do:
   - Does not execute work or dispatch sessions
   - Does not mutate repo or runtime state
   - Does not add runtime enforcement or automatic drift detection
   - Does not authorize unilateral rewrites of settled canon layers
   - Does not reopen settled layers for style churn or personal preference
   - Does not override settled governance execution boundaries
   - Does not collapse role distinctions
   - Does not serve as a gate or blocking check
   - Preserves the explicit/manual council-run boundary

7. **Non-goals** — Automatic drift detection or monitoring; runtime enforcement of maintenance actions; automated correction pipelines; new authority relationships among settled docs; changes to any existing canon docs via this motion; portal or runtime mutation; new coordination modes; new constraint classes.

### Sub-line B — Canon maintenance review checklist

Add `.nexus/docs/templates/canon-maintenance-checklist-template.md` — a blank maintenance review checklist for assessing a settled canon entry. The checklist instantiates the decision framework from `canon-review-maintenance-guidance.md`; the guidance doc defines it. The canonical artifact name is "maintenance review checklist"; the "-template" suffix in the filename signals it is a blank structure.

Fields:
- Entry being reviewed (name + file path + motion number)
- Issue identified (description of the defect or drift observed)
- Issue type (factual error / ambiguity / wording drift / overlap drift / example drift / scope gap / other)
- Drift type (if applicable: wording / overlap / example)
- Recommended action class (correction / clarification / extension / supersession / deprecation / drift handling — register / no action)
- New motion required? (yes / no / depends — with reasoning)
- Casual-reopening check (confirm the issue is not a style preference or personal phrasing preference)
- Notes

### Sub-line C — Canon maintenance example

Add `.nexus/docs/examples/canon-maintenance-example.md` — an illustrative example of the maintenance checklist applied to representative scenarios. Explicitly marked as illustrative only. Covers at minimum:
- One correction example (factual error, no new motion)
- One clarification example (phrasing ambiguity, no new motion)
- One drift-registration example (wording drift, cosmetic, registered as known drift)
- One supersession trigger example (structural inconsistency requiring new motion)

### Boundary preservation

This motion does not authorize:
- Changes to any existing `.nexus/docs/` documents
- Corrections, clarifications, or extensions to motions 0134–0148
- Automatic drift detection or runtime enforcement
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- `package.json` changes
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- New coordination modes
- New constraint classes
- Maintenance guidance as a ratification prerequisite or blocking gate

---

## Success criteria

- **SC-1** `.nexus/docs/canon-review-maintenance-guidance.md` exists and defines: maintenance definition, six action classes with decision criteria, decision guidance table, three drift types with handling approach, casual-reopening guardrail, boundary rules, non-goals
- **SC-2** `.nexus/docs/templates/canon-maintenance-checklist-template.md` (maintenance review checklist) exists and covers: entry reviewed, issue identified, issue type, drift type, recommended action class, new motion required (yes/no/depends), casual-reopening check, notes
- **SC-3** `.nexus/docs/examples/canon-maintenance-example.md` exists, is marked as illustrative only, and covers: one correction example, one clarification example, one drift-registration example, one supersession trigger example
- **SC-4** `validate-motion` passes for motion-0149
- **SC-5** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-6** `pnpm typecheck` passes
- **SC-7** No existing `.nexus/docs/*.md`, portal runtime, governance runner, skill prompt, eval fixture, or grid script files modified

---

## Non-goals

- Automatic drift detection, monitoring, or enforcement
- Runtime enforcement of maintenance action classes
- Automated correction pipelines
- New authority relationships among settled canon layers
- Changes to existing `.nexus/docs/` documents via this motion
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- `package.json` changes
- Reopening or amending motions 0134–0148
- New coordination modes
- New constraint classes
- Maintenance guidance as a ratification prerequisite or blocking gate
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
