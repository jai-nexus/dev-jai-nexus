# Challenge: JAI Exploration Canon v0

**Motion:** motion-0143

---

## Risks

- **R-1: EXPLORATION could be confused with ORCHESTRATOR** — both survey a
  problem space before committing to a direction. A session might use EXPLORATION
  when ORCHESTRATOR would be more appropriate (seam is already identifiable), or
  begin an ORCHESTRATOR session when the problem space is not yet defined enough.
  — mitigated: `exploration-model.md` defines the appropriateness boundary
  explicitly. ORCHESTRATOR selects among already-identified seams and packages a
  next-motion recommendation. EXPLORATION is used when the seam is not yet
  identifiable — when the problem, options, and tradeoffs need to be worked out
  first. The appropriateness guidance section states both when to use EXPLORATION
  and when to route directly to ORCHESTRATOR instead.

- **R-2: Exploration outcomes could drift into active canon without explicit
  routing** — a well-argued exploration artifact might be treated as a decision
  or a motion-initiation package without the required routing step.
  — mitigated: the boundary rules explicitly state that exploration artifacts do
  not silently become active canon and do not replace orchestrator recommendations
  or repo execution planning. The exploration-outcome-template.md requires an
  explicit routing target and next prompt, forcing every session to explicitly
  hand off rather than implicitly decide.

- **R-3: Two templates could create confusion about sequencing** — a session
  might use the outcome template without completing an exploration artifact first,
  or produce an exploration artifact without closing it into an outcome.
  — mitigated: the `exploration-model.md` artifact-outputs section describes the
  expected sequencing: exploration artifact is produced during the session;
  exploration outcome is produced at close. Each template labels required vs.
  optional sections. The example demonstrates the full two-step sequence.

- **R-4: "Speculative work handling" framing could widen scope** — "speculative"
  could be read as authorizing open-ended ideation without a bounded target, or
  as allowing exploration sessions to run indefinitely without exit criteria.
  — mitigated: the definition explicitly states that EXPLORATION is a *bounded*
  ideation and option-shaping layer. The exploration-template.md requires an
  explicit exploration target (what question is being explored) and constraints
  (what is out of scope). The non-goals section explicitly excludes "speculative
  execution or open-ended ideation without a bounded target."

- **R-5: EXPLORATION could be confused with a research or documentation mode**
  — "exploration" could suggest a free-form research session with no governance
  obligation to produce a routable outcome.
  — mitigated: the definition states that every EXPLORATION session produces a
  structured outcome that routes to a specific coordination mode. The
  exploration-outcome-template.md requires a routing target and next prompt.
  EXPLORATION is bounded: it has a start (bounded target), a process (structured
  artifact), and an exit (routable outcome).

- **R-6: The example could be misread as a live governance artifact or as
  prescriptive for future sessions** — fictional motion IDs or problem framings
  might be treated as canonical.
  — mitigated: the file is marked explicitly as illustrative only, placed under
  `.nexus/docs/examples/`, and uses placeholder values throughout (motion-XXXX,
  fictional scenario, placeholder options).

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.03
