# Challenge: JAI Workflow Kit Canon v0

**Motion:** motion-0145
**Challenger role:** Identify risks and require mitigations before ratification.

---

## Risk register

**R-1 — Kit-as-controller confusion**
Risk: Sessions may treat a selected kit as an execution mechanism rather than a
reference guide, attempting to "run the kit" or treating kit steps as dispatched
actions rather than self-selected mode transitions.
Mitigation: Boundary rule in workflow-kit-model.md explicitly states "kits do not
dispatch sessions, enforce transitions, or mutate state." Kit manifest template
includes a boundary notes field with this constraint. No dispatch language
permitted anywhere in the kit catalog or template. Defect Trap 1 in execution.md
checks for dispatch language before ratification.

**R-2 — State-carrying redefinition**
Risk: Kit state-carrying specs may introduce new state bucket definitions or
diverge from the contract established in workflow-composition-model.md, creating
two competing state schemas.
Mitigation: Model doc explicitly states "kits do not define new state buckets;
state bucket definitions remain in the composition model." Kit state-carrying specs
instantiate the existing seven-bucket contract, referencing workflow-composition-
model.md by name. Defect Trap 3 in execution.md verifies no new buckets are
introduced.

**R-3 — Kit catalog scope inflation**
Risk: The v0 catalog of four kits may expand during implementation — additional
kits added for edge cases, sub-variants introduced, or placeholder entries that
imply future catalog entries.
Mitigation: SC-1 success criterion specifies exactly four kits. No-goals section
explicitly states "specifying more than four kits in the v0 catalog" is out of
scope. Defect Trap 2 in execution.md counts kit entries before ratification.

**R-4 — Template-model boundary erosion**
Risk: kit-manifest-template.md may attempt to extend the kit structure canon
rather than instantiate it, adding fields not defined in workflow-kit-model.md or
removing required fields.
Mitigation: Proposal states "the template instantiates the canonical kit structure;
the model doc defines it." Execution.md model spec lists exactly which fields the
template must contain, sourced from the kit structure canon. Defect Trap 4 checks
template field parity with model spec.

**R-5 — Example scope expansion**
Risk: workflow-kit-example.md may cover kits or transitions not in the v0 catalog,
implying additional standard patterns or extending the canon beyond what is
ratified.
Mitigation: SC-3 scope is explicitly limited to three kit instantiations (Kit 1,
Kit 2, Kit 3) plus one filled manifest. The example must be marked illustrative
only. Defect Trap 5 in execution.md checks for the illustrative marker and scope.

**R-6 — Existing mode doc modification**
Risk: Implementing the kit catalog may create pressure to modify existing mode
model documents to add kit references, back-links, or "used by kit X" annotations
— violating SC-7 and the motion's boundary preservation.
Mitigation: No-touch list in execution.md explicitly names all four mode docs,
the passalong schema, and workflow-composition-model.md. Defect Trap 6 runs
`git diff --name-only` before committing to verify no existing docs were modified.
SC-7 is a blocking ratification criterion.

---

## Challenge conclusion

All six risks have documented mitigations. No blocking objections. Motion is
eligible to proceed to implementation subject to these mitigations being applied
and verified at ratification time.
