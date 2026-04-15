# Challenge: JAI Grid Post-Ingest Review Workflow v0

**Motion:** motion-0133

---

## Risks

- **R-1: Git state classification misreads mixed state** — mitigated: GIT_STATE is
  informational only and does not affect the READY/NOT_READY verdict. The operator sees
  the raw `git status --short` output alongside the classification. A misclassification
  cannot produce a false READY result.

- **R-2: Review script used as a substitute for `council:run`** — mitigated: the review
  script exits 0 on READY but does not invoke `council:run`. The final output always prints
  the explicit `pnpm council:run <motion-id>` next-step instruction. `council:run` remains
  the only path to ratification.

- **R-3: Known governance files not in allowed set trigger unexpected-file warnings** — 
  mitigated: the NO_UNEXPECTED_FILES check (warn-only) includes a known-files allowlist
  covering all files written by `grid:ingest`, `council-run`, and the agent-vote path
  (`motion.yaml`, `proposal.md`, `execution.md`, `challenge.md`, `policy.yaml`, `vote.json`,
  `verify.json`, `decision.yaml`, `decision.md`, `agent-vote.json`). New file patterns can
  be added to the allowlist without a breaking change.

- **R-4: validate-motion.mjs path assumption broken if script is moved** — mitigated:
  the review script resolves the validate-motion path relative to `process.cwd()` and
  `import.meta.url`, consistent with `grid-ingest-bundle.mjs` (motion-0132). Any move of
  `validate-motion.mjs` would already break the ingest script and council-run, so it will
  be caught independently.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.10
