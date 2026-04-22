# Challenge: JAI Canon Review and Maintenance Guidance v0

**Motion:** motion-0149
**Challenger role:** Identify risks, boundary violations, and failure modes before ratification.

---

## Challenges and risks

### R-1 — Maintenance guidance treated as authority to reopen settled layers

**Risk:** Authors read "Correction" and "Clarification" action classes as a general license to edit settled canon layers without a motion, leading to accumulating in-place rewrites that are not individually disqualifying but collectively drift the settled text away from its ratified form.

**Mitigation:** Correction and clarification must be narrowly scoped: correction fixes a factual error only; clarification resolves ambiguity only. Neither action class introduces new terms, new scope, or new canonical rules. The casual-reopening guardrail must explicitly state that style preferences and phrasing preferences are not maintenance grounds. The guidance doc should note that the accumulated total of in-place corrections and clarifications on a single entry is itself a signal that supersession via new motion may be warranted.

**Residual:** Medium. Framing risk. Execution V-matrix should verify no motion-free action class grants "extends scope" or "adds new terms" permission.

---

### R-2 — "Correction" scope creep into extension territory

**Risk:** A "correction" that fixes a broken cross-reference leads the author to also update surrounding context, rephrase the definition for clarity, and add a new example — resulting in a de facto extension without a motion.

**Mitigation:** Correction must be explicitly bounded to the error only. The decision guidance table must make clear that if a correction requires adding new content, the action class shifts to extension (and requires a new motion). The checklist template must include a "casual-reopening check" field that prompts the author to confirm scope has not expanded.

**Residual:** Low if the checklist template is used. The checklist field is a guardrail against silent scope expansion.

---

### R-3 — Drift-handling note becomes a permanent limbo state

**Risk:** "Register as known drift" is used indefinitely for structural inconsistencies that should be addressed by extension or supersession. The drift note category becomes a holding pen that defers real maintenance indefinitely.

**Mitigation:** The drift-handling canon must distinguish cosmetic drift (appropriate for permanent drift registration) from meaningful drift (should be addressed by clarification or extension within a bounded period) and structural drift (requires new motion). The decision guidance table must make explicit that contradictory overlap drift requires a new motion, not a drift note.

**Residual:** Low. The decision criteria table provides clear escalation triggers.

---

### R-4 — Decision guidance table treated as an automated gate

**Risk:** The decision guidance table ("New motion required? Yes/No") is interpreted as a compliance check that automatically validates or blocks a maintenance action, rather than as advisory decision support.

**Mitigation:** The guidance doc must state prominently that the decision table is advisory. The "New motion required?" column is a judgment output, not a registry gate. The boundary rules must list "does not serve as a gate or blocking check." The checklist template must label its fields as decision-support fields, not approval fields.

**Residual:** Low. The framing in the guidance doc and boundary rules section covers this.

---

### R-5 — Casual-reopening guardrail misread as prohibiting all corrections

**Risk:** The casual-reopening guardrail is read as prohibiting any in-place edit to settled canon, leading authors to open unnecessary new motions for bounded factual corrections that could be handled in place.

**Mitigation:** The guardrail must be scoped to prohibiting style-preference-driven reopening, not all in-place edits. The guidance doc must lead with the correction and clarification action classes (which permit in-place edits for bounded defects) before introducing the guardrail (which prohibits style-driven reopening). Sequencing matters: define permitted actions first, then define what does not qualify as a maintenance ground.

**Residual:** Low if sequencing is correct. Execution V-matrix should verify correction/clarification classes appear before the casual-reopening guardrail section.

---

### R-6 — Maintenance checklist template adds enforcement or approval fields

**Risk:** The canon maintenance checklist template (Sub-line B) adds fields that imply a formal approval or compliance review — e.g., "approved by," "verified by," "compliance status" — converting an advisory decision-support tool into an authority-granting mechanism.

**Mitigation:** The template must contain exactly the eight declaration fields. No approval, verification, or compliance-status fields. The template note must state it instantiates the guidance doc's decision framework; it does not grant authority to proceed.

**Residual:** Low. Template scope is clearly bounded.

---

## Boundary verification

The following must not occur as a result of this motion:

- [ ] No modifications to any existing `.nexus/docs/` document
- [ ] No corrections, clarifications, or extensions applied to motions 0134–0148 via this motion
- [ ] No changes to `.claude/commands/` or `.nexus/codex/evals/`
- [ ] No portal runtime mutation
- [ ] No grid governance script changes
- [ ] No `package.json` changes
- [ ] No automatic commit, PR generation, or branch creation
- [ ] No GitHub workflow integration
- [ ] No new coordination modes
- [ ] No new constraint classes
- [ ] Maintenance guidance not used as ratification prerequisite or blocking gate

---

## Verdict

Proceed to execution with the following watch items for the V-matrix:

1. Correction and clarification action classes are explicitly scoped to "no new terms, no new scope, no new canonical rules"
2. The casual-reopening guardrail section appears after the correction/clarification action classes are defined (not before)
3. Decision guidance table is labeled as advisory, not a gate
4. Drift-handling canon distinguishes cosmetic drift (register) from structural drift (new motion)
5. Checklist template field list matches exactly eight fields with no approval or compliance-status fields
6. Example doc is marked "Illustrative only" at header and at each filled scenario block
