# Challenge: JAI Governance Constraint Stack Canon v0

**Motion:** motion-0146
**Challenger role:** Identify risks and require mitigations before ratification.

---

## Risk register

**R-1 — Constraint stack as enforcement mechanism**
Risk: Despite the "advisory and documentary" framing, the constraint stack may be
read or used as a runtime enforcement mechanism — particularly if the cross-artifact
applicability table is interpreted as a gate matrix rather than a descriptive map.
Mitigation: Constraint stack definition explicitly states: "A constraint in the
stack is a rule, not a trigger." Boundary rules section states "does not add runtime
enforcement mechanisms or automatic gate evaluation." Constraint-callout canon states
"its presence does not trigger evaluation or enforcement." Defect Trap 1 in
execution.md checks for enforcement-implication language before ratification.

**R-2 — REPO_EXECUTION exception collapse**
Risk: The non-execution and non-mutation constraint classes, if stated without
the REPO_EXECUTION carve-out, effectively prohibit REPO_EXECUTION from doing its
defined work — contradicting its settled canon (motion-0141). The exception must
be named, not implied.
Mitigation: Both Class 1 and Class 2 definitions include the explicit exception:
"Only REPO_EXECUTION under a ratified motion via the explicit/manual council-run
boundary." The cross-artifact applicability table names the exception inline.
Boundary rules explicitly state "does not collapse role distinctions." Defect Trap 2
checks that the RE exception is present in both class definitions.

**R-3 — Constraint class scope inflation**
Risk: The v0 catalog of five constraint classes may expand during implementation
— additional classes added for edge cases, sub-classes introduced, or overlapping
classes that fragment the taxonomy.
Mitigation: SC-1 success criterion specifies exactly five constraint classes. Non-
goals section states "defining more than five constraint classes in v0." Defect Trap 3
in execution.md counts class headings before ratification.

**R-4 — Existing mode doc modification**
Risk: Implementing the constraint stack may create pressure to add constraint-class
back-references or callout sections to existing mode docs (0140–0145), violating SC-7.
Mitigation: No-touch list in execution.md explicitly names all existing mode docs.
SC-7 is a blocking ratification criterion. Defect Trap 5 runs `git diff --name-only`
before committing.

**R-5 — Template-model boundary erosion**
Risk: constraint-callout-template.md may add fields not in the callout canon or
omit required fields, diverging from the model doc.
Mitigation: Proposal states "the template instantiates the callout canon; the model
doc defines it." Execution.md model spec lists exactly five required template fields.
Defect Trap 4 checks field parity.

**R-6 — Example scope expansion**
Risk: governance-constraint-stack-example.md may introduce constraint classes,
artifact domains, or applicability rules beyond those in the v0 canon.
Mitigation: SC-3 scope is explicitly limited: five callouts (one per class) plus
one cross-artifact example plus one motion-package note. Marked illustrative only.
Defect Trap 6 checks illustrative marker and section scope.

---

## Challenge conclusion

All six risks have documented mitigations. No blocking objections. Motion is
eligible to proceed to implementation subject to these mitigations being applied
and verified at ratification time.
