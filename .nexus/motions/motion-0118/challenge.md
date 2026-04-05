# Challenge: Corpus V1 Program Planning Canon v0 — pre-motion planning, program graph, context inheritance, and launch packets

**Motion:** motion-0118
**Date:** 2026-04-03

---

## C-1: Is this over-engineering? Corpus V1 produced 117 motions without a planning canon.

**Concern:** The repo has operated successfully for 117 motions without a
formal planning canon. Introducing a 9-phase workflow and seven new artifacts
adds process overhead that may slow execution without improving outcomes.

**Resolution:** The 117 Corpus V1 motions produced real results. They also
produced significant rework: the normalization arc (motions 0111–0117) existed
entirely to clean up governance debt that accumulated because earlier work
was not planned with enough structure to catch the self-unratified sweeps
(0083, 0092, 0094) before they were committed. The planning canon does not
prevent work — it reduces the probability of the same class of rework
occurring in Corpus V2.

Additionally, Corpus V1 motions were executed by a single human operator
working directly with Claude. Corpus V2 motions will involve JAI Agent
evaluation. An agent cannot evaluate a motion against a standard that does
not exist. The planning canon is a prerequisite for meaningful agent review,
not optional overhead.

Accepted with clarification: the canon must be usable as a lightweight
checklist in practice, not a bureaucratic gate. The quality standard document
should be structured to support quick self-assessment, not mandatory multi-page
pre-work for every small motion.

---

## C-2: Should Corpus V2 planning canon be authored instead?

**Concern:** If Corpus V2 is the real future, why invest in a Corpus V1
planning canon? Should the planning effort be directed at the Corpus V2
governance model instead?

**Resolution:** Corpus V2 begins at the first agent-voted motion. That
boundary has not been crossed. Authoring a Corpus V2 planning canon now
would be speculative — it would need to account for agent behavior, panel
composition, vote aggregation, and escalation patterns that have not yet
been observed or governed. The Corpus V1 planning canon is grounded in
observed behavior (117 motions) and can be written accurately.

The Corpus V1 canon also serves as the baseline from which the Corpus V2
canon will be derived. It is not discarded at the V2 boundary; it is
extended. Writing it now produces a stable foundation for that extension.

---

## C-3: Are 7 implementation artifacts too many for one motion?

**Concern:** motion-0118 targets 7 artifacts across two new directories.
This may be too wide for a single bounded motion, especially for a planning
motion where the artifacts are tightly interdependent.

**Resolution:** The 7 artifacts are tightly interdependent by design.
Splitting them across multiple motions would require either (a) creating
incomplete schemas before the narrative that gives them meaning, or (b)
creating narrative docs before the schemas they reference. The coherence of
the canon depends on all 7 artifacts being authored in a single governed
pass.

The motion does not implement any code. All 7 artifacts are documentation
or YAML schemas. The execution risk is low: if any artifact turns out to
require a scope adjustment, the implementation step can narrow it and record
the reason without blocking the others. The alternative — 7 individual
doc-authoring motions — would produce 7x the governance overhead for the
same output.

---

## C-4: Does the 9-phase planning workflow over-specify what Corpus V2 agent roles will do?

**Concern:** Phases 6 (agent/panel strategy) and 8 (cost/escalation design)
reference JAI Agent evaluation patterns that do not yet exist. Is it
premature to specify these?

**Resolution:** The canon acknowledges that Corpus V2 agent behavior is not
yet governed. Phases 6 and 8 are written at the level of intent, not
mechanism. Phase 6 names the perspectives (cost, architecture, governance,
operator usability, evidence/falsifiability, execution pragmatism) but does
not specify how a JAI Agent exercises them — that is Corpus V2 scope. Phase
8 defines cost/escalation as a planning discipline for the human operator
in Corpus V1; its extension to agent-driven escalation is explicitly deferred.

The framing is: these phases must be thought through before a motion line
opens, regardless of whether the actor is a human operator or a future agent.
The canon establishes the obligation without over-specifying the mechanism.

---

## C-5: Is `.nexus/programs/program-graph.yaml` in scope? Producing the full Corpus V1 program graph is substantial work.

**Concern:** Building `program-graph.yaml` requires classifying 118 motions
into eras, epics, programs, and motion lines. This may be a significant
research task that deserves its own motion.

**Resolution:** The program graph does not need to be complete at v0. The
initial implementation should produce a schema-valid graph covering the major
known programs (Q2 loop activation arc, bootstrap planning program, Track A
proof chain, normalization arc, operator posture arc, planning canon arc) and
mark uncategorized motions explicitly. A complete retrospective classification
is a natural follow-on, but the graph artifact should be scaffolded in this
motion so the schema and the data have the same provenance.

If the scope of the graph proves larger than expected during implementation,
the implementation step may narrow it to a well-labeled partial graph with
a `coverage: partial` field in the schema. This is acceptable and should be
documented in execution.md at that time.

---

## Resolution

No blocking challenge identified. Proceed to execution. The canon should be
written to be practically useful, not theoretically complete. Implementation
must prioritize the primary narrative doc and quality standard first; schemas
and templates second; the program graph third.
