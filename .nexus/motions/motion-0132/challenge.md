# Challenge: JAI Grid Repo Ingest Workflow v0

**Motion:** motion-0132

---

## Risks

- **R-1: Partial write on interrupted execution** — mitigated by design: all validation
  runs before `fs.mkdirSync()`; the four file writes occur after directory creation succeeds;
  no governance scripts run mid-write. An interrupted write leaves an incomplete directory
  that `validate-motion` will flag before `council:run` is reached.

- **R-2: `--force` overwrites a previously committed motion package** — mitigated: `--force`
  prints a visible warning before writing; no commits are created by the script; the operator
  sees the full `git diff` before running `council:run`.

- **R-3: Bundle format drift between `GridView.tsx` and ingest script** — mitigated: the
  delimiter format (`=== <filename> ===`) is defined once in `buildBundle()` (motion-0131,
  `GridView.tsx`) and matched by a single regex in the ingest script. Any format change to
  `buildBundle()` would require a coordinated motion that also updates the ingest script.

- **R-4: motionLib.mjs API change breaks ingest script** — mitigated: `motionLib.mjs` is
  a repo-local shared library used by `validate-motion.mjs` and `council-run.mjs`. Any
  breaking change to `parseMotionText()` would already break those scripts, so it will be
  caught before reaching the ingest script. The ingest script uses only the public
  `parseMotionText()` export.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.12
