# Challenge: JAI Canon Authoring Conventions v0

**Motion:** motion-0147
**Challenger role:** Identify risks and require mitigations before ratification.

---

## Risk register

**R-1 — Conventions as enforcement mechanism**
Risk: The authoring conventions may be read as a compliance gate or enforcement
layer — particularly if the authoring checklist is used as a blocking compliance gate
rather than advisory guidance. If convention items become de facto hard requirements,
the conventions overstep into enforcement territory not authorized by this motion.
Mitigation: The convention definition explicitly states "a convention is guidance,
not a gate." The checklist section states "the checklist is guidance, not a gate" and
"its absence is not a blocking condition." Non-goals list "establishing any checklist
item as a blocking gate." Boundary rules list "do not add runtime enforcement
mechanisms or automatic convention checking." Defect Trap 1 checks for gate-
implication language before ratification.

**R-2 — Artifact type naming collision**
Risk: The four artifact types (model doc, template, example, filled artifact) may
not be clearly differentiated in the conventions doc, leading to model/template/
example conflation in future artifacts.
Mitigation: Sub-line A defines each artifact type with an explicit naming pattern
and a one-line role statement: "model doc defines; template instantiates; example
illustrates; filled artifact is a session output." SC-1 requires all four types
with naming patterns. Defect Trap 2 checks that all four types are present with
naming patterns.

**R-3 — Redefining settled canon in the conventions doc**
Risk: The continuity and boundary phrasing canon section may re-explain concepts
from prior canon layers (mode models, composition model, constraint stack) rather
than referencing them, creating two competing definitions.
Mitigation: The conventions doc must cite, not redefine. The cross-layer reference
canon rules state: "when referencing a term from a prior canon layer, cite the
source document by file path and motion number; do not re-explain the term's full
definition." Defect Trap 3 checks that the conventions doc does not contain
definitions of terms defined in motions 0140–0146.

**R-4 — Authoring checklist scope inflation**
Risk: The thirteen-item checklist may expand during implementation — additional items
added, sub-items introduced, or items that imply enforcement (e.g., "MUST be
present" rather than "is present").
Mitigation: SC-1 specifies exactly thirteen checklist items. Non-goals state "establishing
any checklist item as a blocking gate." Defect Trap 4 counts checklist items and checks
for mandatory-implication language ("MUST", "required", "blocking").

**R-5 — Cross-layer reference canon creating new constraints**
Risk: The cross-layer reference canon rules may function as new governance constraints
rather than authoring guidance — particularly the "preserve interoperability" rule,
which could be read as a retroactive prohibition.
Mitigation: The conventions doc is explicitly advisory. The "preserve interoperability"
rule is phrased as guidance: "a new canon addition must not contradict... without
a new governed motion." This is not a new constraint — it restates the existing
scope-preservation constraint from motion-0146 Class 5. Defect Trap 5 verifies
the rule is phrased as guidance, not prohibition.

**R-6 — Existing mode doc modification**
Risk: Implementing the conventions doc may create pressure to add back-references
or convention tags to existing mode docs (0140–0146), violating SC-7.
Mitigation: No-touch list in execution.md explicitly names all existing mode docs.
SC-7 is a blocking ratification criterion. Defect Trap 6 runs `git diff --name-only`
before committing.

---

## Challenge conclusion

All six risks have documented mitigations. No blocking objections. Motion is
eligible to proceed to implementation subject to these mitigations being applied
and verified at ratification time.
