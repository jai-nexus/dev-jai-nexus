# Challenge: JAI Grid Governance Contract Hardening v0

**Motion:** motion-0139

---

## Risks

- **R-1: Adding `--json` to backing sub-command calls could suppress useful output
  that was previously visible in the raw detail string** — mitigated: the upgraded
  detail logic has a three-tier fallback: (1) structured JSON path surfaces `verdict`
  and `failed_check`; (2) if `parseEmbeddedJson` returns null, the raw stdout/stderr
  fallback is used, identical to pre-patch behavior; (3) if no output at all, the exit
  code is surfaced alone. No information is silently dropped.

- **R-2: The `reviewOk` / `preflightOk` signal could be affected if the backing
  command emits different output with `--json`** — mitigated: both scripts still derive
  `ok` exclusively from `result.status === 0`. The `--json` flag changes the output
  format but not the exit code contract of `grid:review` or `grid:preflight`. The
  pass/fail determination is unchanged.

- **R-3: `grid:launch` next_step wording change could break a downstream parser
  consuming the `next_step` field** — mitigated: the change is from `"pnpm council:run"`
  to `"Run pnpm council:run"`. The council:run command string is still present. Any
  parser matching on `council:run` still matches. No JSON schema field is changed.

- **R-4: `grid:operator` calls `grid:preflight` and `grid:vote-prep` as sub-commands
  and parses their JSON output — a change to their probe invocations could affect
  cockpit state** — mitigated: `grid:operator` calls `grid:preflight` and `grid:vote-prep`
  directly with `--json`. The only change in those scripts is their internal sub-command
  invocations (one layer deeper). The JSON output contracts of `grid:preflight` and
  `grid:vote-prep` themselves are unchanged — no schema change, no exit code change.
  `grid:operator` is not affected.

- **R-5: The `parseEmbeddedJson` function is inlined into two additional scripts,
  creating four copies across the codebase** — mitigated: the motion explicitly does not
  extract a shared utility module. The inlined copies are identical and the scope is
  bounded. Extraction is a future concern beyond this motion's boundary.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.05
