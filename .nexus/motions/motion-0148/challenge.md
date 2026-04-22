# Challenge: JAI Canon Interoperability Registry v0

**Motion:** motion-0148
**Challenger role:** Identify risks, boundary violations, and failure modes before ratification.

---

## Challenges and risks

### R-1 — Registry interpreted as authority layer

**Risk:** Authors treat registry presence as granting authority, leading to "not in the registry" being used as a blocking gate for new canon proposals.

**Mitigation:** The registry definition must state explicitly and prominently that registry presence does not confer authority. Authority comes from ratification under a governed motion. The boundary rules section must list "does not serve as a validator or gate; registry entries are declarations, not approvals."

**Residual:** Low. The proposal includes this language. Verify it is in the doc, not only in the boundary rules section.

---

### R-2 — Relationship vocabulary terms treated as new constraints

**Risk:** Naming six canonical relationship terms could be read as establishing new governance rules — e.g., "depends-on entries must be settled before ratification" interpreted as a hard gate enforced by the registry.

**Mitigation:** The registration canon must frame relationship declarations as navigational declarations, not enforcement mechanisms. The registry records relationships; it does not enforce them. Dependency review is a reviewer responsibility, not a registry gate.

**Residual:** Medium. This is a framing risk. Execution must verify the word "enforces" does not appear in the dependency declaration rules.

---

### R-3 — Existing mode model docs modified to conform to registry vocabulary

**Risk:** The registration and dependency canon could prompt authors (or a session) to retroactively edit motions 0140–0147 to add dependency declarations or relationship fields that do not currently exist.

**Mitigation:** The boundary rules must explicitly prohibit modifications to any existing `.nexus/docs/` documents. The no-touch list in execution.md must name all nine settled mode/canon docs.

**Residual:** Low. Proposal already prohibits this. Execution no-touch list enforces the boundary.

---

### R-4 — Stack map inflates into a full corpus index

**Risk:** The example doc (Sub-line C) could expand beyond its three-filled-template scope into a comprehensive stack index — effectively replacing the registry doc with a pre-populated index that becomes authoritative by virtue of being detailed.

**Mitigation:** The example doc must be clearly marked "Illustrative only." The proposal explicitly limits the example to: one stack map, three filled registration templates (foundation / cross-cutting / template), two navigation walkthroughs. Execution must verify the example doc does not register entries beyond the three representative settled entries.

**Residual:** Low if scope is enforced. The V-matrix should check example doc for "Illustrative only" marking and count of filled templates.

---

### R-5 — Template scope expands to include enforcement fields

**Risk:** The canon registration template (Sub-line B) adds fields beyond the six declaration rules — e.g., a "ratification status" field or a "compliance gate" field — that imply registry-mediated enforcement.

**Mitigation:** The template must cover exactly: entry name/path, artifact class, layer position, depends-on, relationship declarations, no-redefinition boundaries, notes. No additional fields. Execution must verify field count and names.

**Residual:** Low. Template scope is clearly bounded.

---

### R-6 — Example doc treated as normative canon

**Risk:** The example doc's filled registration templates could be cited as canonical registrations for the settled entries they illustrate (e.g., the CONTROL_THREAD registration in the example treated as the official registry entry for CONTROL_THREAD).

**Mitigation:** The example doc must be marked "Illustrative only" on every filled template, not only in the doc header. The registry doc must state that the registry is populated by future canon motions, not by the example doc. No filled example template may be cited as a registry entry.

**Residual:** Medium framing risk. Execution V-matrix should verify "Illustrative only" appears at each filled template block, not only at the document header.

---

## Boundary verification

The following must not occur as a result of this motion:

- [ ] No modifications to `.nexus/docs/control-thread-model.md`, `repo-execution-model.md`, `orchestrator-model.md`, `exploration-model.md`, `workflow-composition-model.md`, `workflow-kit-model.md`, `governance-constraint-stack.md`, or `canon-authoring-conventions.md`
- [ ] No changes to `.claude/commands/` or `.nexus/codex/evals/`
- [ ] No portal runtime mutation
- [ ] No grid governance script changes
- [ ] No `package.json` changes
- [ ] No automatic commit, PR generation, or branch creation
- [ ] No GitHub workflow integration
- [ ] No new coordination modes
- [ ] No new constraint classes
- [ ] Registry presence not used as ratification prerequisite

---

## Verdict

Proceed to execution with the following watch items for the V-matrix:

1. Registry definition includes "registry presence does not confer authority" in the body, not only in boundary rules
2. Dependency declaration rules use "record" / "declare" language, not "enforce" / "require" / "gate"
3. Example doc is marked "Illustrative only" at document header AND at each filled template block
4. No-touch list in execution covers all nine settled docs
5. Template field list matches exactly: entry name/path, artifact class, layer position, depends-on, relationship declarations, no-redefinition boundaries, notes
