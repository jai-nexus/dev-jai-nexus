# Challenge: JAI Grid Vote Preparation Ergonomics v0

**Motion:** motion-0135

---

## Risks

- **R-1: Scaffold could silently overwrite an operator-authored vote.json** — mitigated:
  `--scaffold` must detect an existing `vote.json` and block unless `--force` is passed.
  Default behavior must not overwrite.

- **R-2: Scaffold vote values could be auto-populated and treated as authoritative** —
  mitigated: this motion explicitly forbids auto-population of vote values. The template
  must use `"vote": ""` placeholders. The operator is responsible for explicit values.

- **R-3: The scope could collapse into validating vote outcomes** — mitigated: outcome
  evaluation (PASS/FAIL/PENDING) belongs to `council-run`. This tool stops at structural
  validation of the vote.json artifact, not at evaluating the governance result.

- **R-4: The tool could route the operator into running council-run automatically** —
  mitigated: `VOTE_READY` outcome must emit a concrete next-step command for the operator
  to run explicitly. No auto-invocation.

- **R-5: The required_roles source could drift from council.config.yaml** — mitigated:
  `grid-vote-prep.mjs` must read `required_roles` from `.nexus/council.config.yaml` at
  runtime, not hardcode them.

- **R-6: The tool could be mistaken for a vote-casting surface** — mitigated: the script
  is a validator and scaffold generator only. It does not cast, record, or submit votes.
  Vote values must be written by the operator directly into the file.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.07
