# Challenge: Deterministic Agent Activation Agenda v0

**Motion:** motion-0183

---

## Risks

### Risk 1: Agenda semantics could be mistaken for execution activation

If the new surface looks like a runtime dispatch queue, operators may infer
authority that does not exist.

### Risk 2: Work packet identity could blur with scope configuration

The agenda must preserve the distinction between assigned identity, canonical
role mapping, and configured scope subset.

### Risk 3: Prompt previews could look actionable instead of bounded

Branch suggestions and next prompts must remain clearly copy-only and
non-authorizing.

### Risk 4: The seam could sprawl into workflow automation

The goal is deterministic planning/review coverage, not producer/runtime
activation or agent PR workflow.

---

## Challenger standard

Approve only if:

- `/operator/work` clearly reads as a deterministic planning/review agenda
- each item resolves the required chain fields end to end
- disabled authority posture remains explicit and repeated
- no runtime, mutation, or workflow automation path is introduced

---

## Required gates

- validate_motion
- validate_agency
- typecheck

Optional supporting gate:

- build

---

## Risk score

risk_score: 0.09
