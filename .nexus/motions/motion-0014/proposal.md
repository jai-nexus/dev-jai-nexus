# Proposal (motion-0014)

## 0.0 Problem
- The portal/operator surfaces can crash with an ENOENT for `portal/config/agency.yaml` when running with `cwd=portal/`, even though the canonical agency config lives at repo-root `config/agency.yaml`.
- This creates an implicit (and incorrect) second “source of truth” location and breaks local dev ergonomics.

## 1.0 Implications
- Operator pages become brittle: behavior depends on the process working directory (repo root vs `portal/`).
- Developers are tempted to duplicate `agency.yaml` into `portal/config/` to “make it work,” which violates the repo-root SoT boundary and risks drift.
- Any automation (scripts, vercel builds, local tooling) that runs from a different cwd can regress the portal.

## 2.0 Solutions
- Make agency config resolution robust and explicit:
  - Prefer a single canonical file: `repoRoot/config/agency.yaml`.
  - Support running from repo root or from `portal/` by discovering repoRoot (e.g., via `.nexus` root discovery / walking up).
  - Add an optional escape hatch env var (e.g., `JAI_AGENCY_PATH`) for debugging or nonstandard layouts.
- Do **not** duplicate config into `portal/config/`.

## 3.0 Decision Proposal
- Adopt “repo-root SoT” resolution for agency config:
  - Default path: `config/agency.yaml` at repo root.
  - Robust resolver works regardless of cwd.
  - Optional `JAI_AGENCY_PATH` override is allowed, but does not change the canonical SoT.

## 4.0 Evidence / Links
- Required checks for this motion include `validate_agency` and `typecheck` (with optional `dct_replay_check`). :contentReference[oaicite:2]{index=2}
- Evidence expectations:
  - `pnpm -C portal typecheck` PASS
  - Operator pages load without ENOENT when `portal/config/agency.yaml` is missing
  - Resolution works when `cwd` is `portal/` (e.g., `pnpm -C portal dev`) :contentReference[oaicite:3]{index=3}

## 5.0 Next Actions
- Ensure all reads of agency config go through the shared resolver (no ad-hoc `portal/config/agency.yaml` reads).
- (Optional) Document `JAI_AGENCY_PATH` in a short note (either in motion notes or a small docs snippet).
