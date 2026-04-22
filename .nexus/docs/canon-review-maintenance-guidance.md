# Canon Review and Maintenance Guidance - dev-jai-nexus

## Purpose

This document defines canon review and maintenance guidance for JAI NEXUS.

It belongs to the broader `q2-canon-stack-consolidation` program branch, but this
motion stays bounded to documentary and advisory guidance only.

The goal is to improve long-term maintainability across the settled canon stack
without introducing automation, runtime enforcement, or permission to casually
reopen settled canon.

Canon review and maintenance guidance does not:

- execute work
- mutate repo state
- mutate runtime state
- add runtime enforcement
- reopen settled canon for style churn
- override settled governance execution boundaries
- collapse role distinctions

Where governance read-only surfaces are relevant, this guidance preserves the
explicit/manual council-run boundary.

---

## Scope

This document applies to review and maintenance decisions involving settled canon
artifacts across:

- docs
- templates
- examples
- registry entries
- motion packages

This document inherits from:

- `.nexus/docs/governance-constraint-stack.md` (motion-0146)
- `.nexus/docs/canon-authoring-conventions.md` (motion-0147)
- `.nexus/docs/canon-interoperability-registry.md` (motion-0148)

It does not redefine those layers.

---

## Review and maintenance definition

Canon review is the documentary examination of a settled canon artifact to decide
whether a concrete issue exists and, if so, what bounded maintenance response is
appropriate.

Canon maintenance is the documentary decision support for that response and, when
appropriate, the selection of a bounded maintenance action.

This is advisory guidance, not enforcement.

It improves maintenance quality by naming issue types, action classes, and drift
handling pathways so authors do not have to reconstruct the decision logic from
scratch each time.

Canon review and maintenance is not casual reopening.

The question is not "could this wording be nicer?" The question is "does the
current settled canon contain a defect, ambiguity, contradiction, stale guidance,
or accumulated drift that merits a bounded response?"

---

## Maintenance action classes

The maintenance vocabulary is intentionally bounded to six action classes only.

### Correction

`Correction` applies to a defect that already existed at the time of ratification.

Typical cases:

- factual error
- broken file path or cross-reference
- incorrect example that was already incorrect when ratified
- malformed citation or metadata defect

Correction is bounded to the defect itself.

A correction should not:

- add new concepts
- add new scope
- introduce new canonical rules
- use an old defect as a pretext for broader cleanup

Post-ratification drift does not route through correction directly. It first goes
through drift handling.

### Clarification

`Clarification` improves interpretability without changing settled meaning or
scope.

Typical cases:

- ambiguous phrasing with one still-recoverable ratified meaning
- wording consistency improvements that keep the same concept
- explanatory tightening that removes a likely misreading

Clarification should not:

- introduce a new canonical term
- extend scope
- silently choose a new meaning

If resolving the ambiguity would require choosing among disputed interpretations
of the original ratification context, the action class shifts to `extension`.

### Extension

`Extension` adds new canon coverage without claiming the earlier layer already
contained it.

Typical cases:

- new concepts
- new artifact classes or new relationship terms
- new decision pathways
- ambiguity resolution that requires selecting among disputed original readings

Extension always belongs in a new governed motion because it adds new canon rather
than merely correcting or clarifying what was already settled.

### Supersession

`Supersession` replaces an older canon layer with a newer one when the older layer
is no longer the correct structural reference for the seam it covers.

Typical cases:

- structural inconsistency that cannot be repaired by bounded correction
- materially outdated guidance that needs replacement rather than patching
- a new document that intentionally reorganizes or replaces a prior layer

Supersession requires a new motion.

### Deprecation

`Deprecation` marks an entry as no longer the current canonical reference while
leaving the historical artifact intact.

Typical cases:

- an entry has been superseded
- an older layer remains useful historically but should not be used as the
  current reference

Deprecation is an annotation outcome, not deletion.

### Drift handling

`Drift handling` is the assessment and routing pathway for accumulated
post-ratification drift scenarios.

It is not itself a terminal action.

Drift handling examines the drift, decides whether it is cosmetic, meaningful, or
structural, and then routes to one of the bounded outcomes:

- correction
- clarification
- extension
- supersession
- deprecation
- leave as-is with documented drift awareness

The important distinction is:

- ratification-time defect -> `correction`
- post-ratification drift -> `drift handling` first

---

## Decision guidance

Use the following decision support when choosing a bounded response.

This table is advisory decision support, not a gate.

| Situation | Recommended path | Why |
|---|---|---|
| factual defect that existed at ratification | correction in place | the canon was already wrong when settled |
| broken file path or broken cross-reference that existed at ratification | correction in place | bounded defect, no new meaning |
| ambiguity with one undisputed ratified reading | clarification in place | meaning already exists, wording is the problem |
| ambiguity that requires choosing among disputed original readings | extension via new motion | the choice adds new canon rather than merely clarifying it |
| cosmetic wording drift after ratification | drift handling -> leave as-is or known drift note | no meaningful reader harm yet |
| wording drift that now causes reader confusion | drift handling -> clarification | wording changed enough to impair interpretation |
| overlap between two layers that is consistent and complementary | drift handling -> reference-first clarification | cross-reference solves the problem better than rewrite |
| overlap between two layers that is contradictory | drift handling -> extension or supersession | contradiction cannot be solved by cosmetic cleanup |
| stale guidance that is still accurate but less legible than newer layers | leave as-is or add reference-first clarification | avoid reopening for style churn |
| stale guidance that now points readers to the wrong structural answer | supersession or deprecation via new motion | the older layer is no longer safe as the live reference |
| example that was already wrong when ratified | correction in place | example defect existed at ratification |
| example that became stale only after later canon settled | drift handling -> clarification, extension, or supersession | post-ratification drift, not ratification-time defect |
| style preference, formatting preference, or synonym preference only | leave as-is | not a maintenance ground |

---

## Defect, ambiguity, overlap, and stale-guidance handling

### Defect

Treat the issue as a `defect` when the artifact is wrong relative to what was
already settled at ratification time.

Typical response:

- correction

### Ambiguity

Treat the issue as `ambiguity` when readers can misread the text but the original
settled meaning still exists and can be recovered without adding new canon.

Typical response:

- clarification

If the ambiguity can only be resolved by selecting among disputed interpretations
of the original ratification context, the correct response is `extension`.

### Overlap

Treat the issue as `overlap` when two layers partly address the same seam.

Use the overlap path carefully:

- if the overlap is complementary, prefer reference-before-rewrite
- if the overlap is contradictory, route through drift handling to extension or
  supersession

### Stale guidance

Treat the issue as `stale guidance` when the artifact is still readable but is no
longer the best live reference because later canon changed the surrounding stack.

Typical response:

- leave as-is
- add a reference-first clarification
- deprecate or supersede if the old layer is now structurally misleading

---

## Terminal outcomes

After review, the bounded terminal outcome should be one of the following:

- correct in place
- clarify in place
- extend via new motion
- supersede via new motion
- deprecate via explicit governed note
- leave as-is

Drift handling routes to one of these outcomes. It is not itself the terminal
outcome.

---

## Reference-before-rewrite guidance

Interoperability and dependency concerns should normally be handled by reference
before rewrite.

Prefer cross-reference, dependency declaration, or bounded clarification when:

- the upstream layer is still correct
- the problem is reader navigation rather than canon correctness
- the issue is complementary overlap rather than contradiction
- the downstream artifact can cite the settled upstream term directly

Rewrite or reopen only when reference-first handling cannot preserve correctness.

This matters especially for:

- interoperable mode docs
- templates that instantiate model docs
- examples that should follow later-settled terminology
- registry entries that should index, not restate
- motion packages that should remain historical authority records

---

## Drift handling across artifact families

Use the following artifact-family guidance when drift is detected.

| Artifact family | Typical drift pattern | Safe first move | Escalation trigger |
|---|---|---|---|
| docs | wording drift, overlap drift, stale cross-reference | reference-first clarification or leave as-is | contradiction, scope gap, or structurally stale guidance |
| templates | field drift relative to defining model doc | check whether the mismatch existed at ratification or arose later | if the model now requires new fields or new semantics, extension is needed |
| examples | terminology drift or outdated illustrative flow | determine whether the example was already wrong when ratified | if the example now teaches incorrect behavior, route to extension or supersession |
| registry entries | stale dependency map, stale placement, missing no-redefinition note | correction or clarification to the index entry | if the relationship vocabulary itself is insufficient, extension is needed |
| motion packages | historical wording drift or stale surrounding context | preserve the package as a historical record and add later reference rather than rewrite | only bounded ratification-time defects should be corrected in place; structural replacement belongs in a later motion |

---

## Safe handling for common drift types

### Wording drift

`Wording drift` occurs when different layers use different wording for the same
concept after ratification.

Safe handling:

- if the difference is cosmetic and does not confuse readers, leave as-is or
  record the drift as known context
- if the difference now creates reader confusion, use drift handling to route to
  clarification
- if fixing the wording would establish a new canonical term, route to extension

Wording drift alone is not permission for style churn.

### Overlap drift

`Overlap drift` occurs when two layers partly cover the same seam after later
stack growth.

Safe handling:

- if the overlap is complementary, add cross-references or clarifying boundary
  notes before considering broader change
- if the overlap is contradictory, route through drift handling to extension or
  supersession

Do not rewrite both layers casually just to make them look more uniform.

### Example drift

`Example drift` occurs when an example becomes inconsistent with later-settled
canon.

Safe handling:

- if the example was already wrong when ratified, correction is appropriate
- if the example became stale only because later canon settled around it, the
  issue is post-ratification drift and must go through drift handling
- if the example still demonstrates the right behavior but uses older wording,
  clarification or leave-as-is is usually enough
- if the example now teaches incorrect or contradictory behavior, route to
  extension or supersession

---

## Casual-reopening guardrails

The following are not maintenance grounds by themselves:

- personal phrasing preference
- style churn
- synonym preference where the existing term is still clear
- formatting preference with no correctness impact
- generalized cleanup ambition with no bounded defect
- desire to make older docs sound like newer docs when the older docs remain
  correct

Settled canon must not be reopened for these reasons alone.

A reopening path such as extension or supersession is justified only when a
concrete problem cannot be handled by bounded correction, clarification, or
leave-as-is.

A useful threshold test is:

- would a careful reader following the current settled canon reach a materially
  incorrect or materially ambiguous governance conclusion?

If the answer is no, the safe outcome is usually leave-as-is or reference-first
clarification rather than reopening.

---

## Boundary rules

Canon review and maintenance guidance does not:

- execute work
- dispatch sessions
- mutate repo state
- mutate runtime state
- add runtime enforcement
- add automatic drift detection
- authorize unilateral rewrites of settled canon
- reopen settled canon for style churn
- override settled governance execution boundaries
- collapse role distinctions
- serve as a gate or blocking check

This guidance supports review decisions. It does not perform those decisions
automatically.

---

## Non-goals

This model does not authorize:

- automation
- controller behavior
- runtime enforcement
- repo/runtime mutation
- portal/runtime changes
- generic infra cleanup
- Pi/runtime widening
- automatic drift detection
- automated correction pipelines
- casual reopening of settled canon for style churn
- new coordination modes
- new constraint classes
- broad rewrites of settled canon through incidental maintenance language

This model is documentary v0 only.
