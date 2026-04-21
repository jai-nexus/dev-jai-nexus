# Challenge: JAI Orchestrator Canon v0

**Motion:** motion-0142

---

## Risks

- **R-1: ORCHESTRATOR could be confused with CONTROL_THREAD** — both operate at
  a program-arc level. An ORCHESTRATOR session and a CONTROL_THREAD session might
  appear to do the same thing: survey the arc and decide what is next.
  — mitigated: `orchestrator-model.md` explicitly distinguishes them.
  CONTROL_THREAD manages the arc after motions are ratified — it tracks what is
  settled, maintains the passalong chain, and closes governance cycles.
  ORCHESTRATOR is the seam-selection and recommendation-packaging surface that
  feeds the arc: it reviews candidate seams, recommends the next motion, and
  produces a routing recommendation for the mode that will execute it.
  ORCHESTRATOR does not own the arc; it initiates into it.

- **R-2: Three new templates could create confusion about which is required vs.
  optional in a given session** — a session might try to use all three even when
  only one is needed, or omit a required one.
  — mitigated: each template labels required vs. optional sections. The
  `orchestrator-model.md` artifact-outputs section explicitly states which
  templates apply to which scenario (seam review vs. motion recommendation vs.
  session routing).

- **R-3: The repo-init routing template could be misread as a live routing
  mechanism or a runtime input format** — the template's field names (request,
  return shape, constraints) could suggest an API contract rather than a
  documentation structure.
  — mitigated: the template is under `.nexus/docs/templates/`, not any schema
  directory. The motion explicitly prohibits automation, runtime mutation, and
  enforcement infrastructure. The template header will include an explicit note
  that it is a session-documentation structure.

- **R-4: The candidate-seam review format could encourage scope widening** —
  presenting multiple candidate seams in a structured format might tempt a session
  to begin planning for several seams simultaneously rather than committing to one.
  — mitigated: the template explicitly includes both a "Recommendation" section
  (one seam, ranked rationale) and an "Explicitly deferred seams" section (deferral
  reason per seam). The bounded-seam discipline from `repo-execution-model.md` and
  `control-thread-model.md` applies to ORCHESTRATOR sessions as well; this is
  stated in the operating constraints.

- **R-5: The example could be misread as a live governance artifact or as
  prescriptive for future motions** — users might treat the fictional motion IDs
  or package structure in the example as canonical rather than illustrative.
  — mitigated: the file is marked explicitly as illustrative only, placed under
  `.nexus/docs/examples/`, and uses placeholder values throughout (motion-XXXX,
  fictional branch names, fictional commit hashes).

- **R-6: ORCHESTRATOR could be confused with an AI orchestration engine** —
  the term "orchestrator" carries a specific meaning in AI / multi-agent system
  design, and could be misread as describing an automated coordination agent.
  — mitigated: the definition explicitly states that ORCHESTRATOR is a
  coordination mode, not an automation surface. The non-goals section explicitly
  excludes automation engine, background orchestration, and enforcement
  infrastructure. The operating constraints include "no direct execution authority."

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.03
