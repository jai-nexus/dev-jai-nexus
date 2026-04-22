Illustrative example only. This document does not establish new canon, apply any
maintenance action, or modify any settled canon layer.

# Canon Maintenance Example

This example shows review and maintenance guidance in practice using fictional,
bounded scenarios only.

The example is documentary and advisory. It does not imply automation,
enforcement, or permission to casually reopen settled canon.

---

## Example framing

- scenario family: fictional review of a settled documentation-only canon stack
- branch context: broader consolidation program is visible, but each scenario is
  still bounded to one maintenance question
- governing boundary: no runtime, portal, command-surface, or automation changes

---

## Scenario 1: Correction vs clarification distinction

Illustrative example only.

### Correction case

Observed issue:

- a fictional settled model doc points to `./docs/fictional-routing-map.md`
  even though the correct file at ratification time was
  `./docs/fictional-routing-guide.md`

Why this is correction:

- the defect existed at ratification time
- no disputed meaning needs to be selected
- the fix is bounded to the broken reference

Safe outcome:

- correct in place
- no new motion

### Clarification case

Observed issue:

- a fictional settled template says `returns the next route package` in a way that
  can be misread as dispatch behavior, even though the surrounding canon already
  makes clear that the artifact is documentary only

Why this is clarification:

- the underlying meaning is recoverable from the original ratified context
- the issue is ambiguous phrasing, not a broken fact
- no new canonical term is needed

Safe outcome:

- clarify in place
- no new motion

Important boundary:

- if reviewers disagree about what the original ratification intended, the issue
  no longer stays in clarification territory and shifts to `extension`

---

## Scenario 2: Drift-handling routing example

Illustrative example only.

Observed issue:

- a fictional earlier example uses `workflow arc`
- a later settled model doc uses `session arc`
- both still describe the same concept and a careful reader can reconstruct the
  meaning

Why this is drift handling:

- the difference accumulated after ratification
- the earlier example was not defective when ratified
- the issue is post-ratification wording drift, not correction territory

Safe routing:

- start with drift handling
- assess severity
- because the drift is cosmetic and non-contradictory, prefer `leave as-is` or a
  known drift note

Escalation rule:

- if the wording drift later causes real reader confusion, drift handling routes
  to clarification
- if the wording difference hardens into a disputed concept split, drift handling
  routes to extension

Reference-before-rewrite posture:

- cite the newer settled term before rewriting older layers wholesale

---

## Scenario 3: Style-churn guardrail

Illustrative example only.

Observed issue:

- a reviewer prefers the phrase `coordination surface` over `routing surface` in a
  settled fictional doc, but the current wording is already unambiguous

Why this is not a maintenance ground:

- no factual defect exists
- no ambiguity changes the governance outcome
- the preference is stylistic only

Safe outcome:

- leave as-is
- do not reopen the settled layer

---

## Filled canon maintenance review checklist

Illustrative example only.

```markdown
# Canon Maintenance Review Checklist: Fictional Workflow Example

## Artifact under review

- artifact name: `Fictional Workflow Example`
- file path: `.nexus/docs/examples/fictional-workflow-example.md`
- motion number: `motion-0999`

## Current settled status

- `settled and active`

## Issue type

- `example drift`

## Issue summary

- `The example still teaches the correct flow, but it uses older wording that no longer matches a later-settled model doc.`

## Candidate action class

- `drift handling`

## Ratification-time defect vs post-ratification drift

- `post-ratification drift`
- reasoning: `The example was consistent when ratified and only became stale after later canon settled around it.`

## Dependency and interoperability considerations

- `Readers now compare the example against a later-settled fictional model doc and may expect terminology alignment.`

## No-rewrite / reference-first check

- `Yes. Add a cross-reference or note to the later-settled term before considering a rewrite.`

## No-touch boundaries where relevant

- `portal/**`
- `.claude/**`

## Council-run boundary relevance where applicable

- `Relevant only as wording preservation: if governance read-only surfaces are mentioned, keep the explicit/manual council-run boundary phrasing intact.`

## Why this is not casual reopening

- `The issue is real interoperability drift, not a pure style preference, but it is still bounded and non-structural.`

## Recommended terminal action or leave-as-is outcome

- outcome: `leave as-is`
- motion implication: `no new motion`
- reasoning: `Because the drift is cosmetic and the behavior remains correct, drift handling should end with a known-drift note rather than a rewrite.`
```

---

## Why the example is compliant

- action-class differentiation
  - The example keeps correction, clarification, and drift handling distinct instead of using one label for all maintenance work.
- style-churn guardrail
  - Scenario 3 shows that wording preference alone is not enough to reopen settled canon.
- reference-before-rewrite posture
  - Scenario 2 and the filled checklist both prefer cross-reference or a known-drift note before any broader rewrite.
- council-run boundary preservation
  - The checklist keeps governance-read-only wording bounded to the explicit/manual council-run boundary rather than implying automation.
