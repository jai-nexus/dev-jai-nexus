# Execution: Motion Snapshot Gate v0

**Motion:** motion-0182
**Role:** BUILDER
**Date:** 2026-05-10
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one motion packet, one process doc, small script alias additions, and a
bundled snapshot refresh. No runtime changes, no automation, and no cross-repo
changes.

---

## Boundary confirmation

This motion must not:

- add schedulers
- add automation
- add emitters
- add provider/model calls
- add execution capability
- add branch-write authority
- add PR-creation authority
- add DB or API mutation
- change Sync Runs, Events, Decisions, `/operator/jai`, or agent registry behavior

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-10T17:33:12.1587983Z`

### 2. Files changed

- `portal/src/lib/motion/motionSnapshot.json`
- `portal/docs/motion-snapshot-gate.md`
- `portal/package.json`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `CLAUDE.md`
- `.nexus/motions/motion-0182/**`

No `docs-nexus` files were changed. No `jai-nexus` files were changed.

### 3. Gate policy decisions

- Future motion-bearing PRs must run both:
  - `node portal/scripts/build-motion-snapshot.mjs --write`
  - `node portal/scripts/build-motion-snapshot.mjs --check`
- Equivalent portal-local aliases were added:
  - `pnpm -C portal snapshot:motions`
  - `pnpm -C portal snapshot:motions:check`
- Root `package.json` already uses `snapshot:motions` for a different snapshot flow, so no root alias was added in order to avoid command-name collision.

### 4. Guidance surfaces updated

- `portal/docs/motion-snapshot-gate.md`
  - durable gate policy and evidence requirements
- `.github/PULL_REQUEST_TEMPLATE.md`
  - motion-bearing PR evidence section now includes snapshot write/check, latest bundled motion, and bundled motion count
- `CLAUDE.md`
  - repo-local working guidance now includes the motion snapshot closeout rule and portal-local commands

### 5. Snapshot refresh expectation

- This PR applies the new gate to itself.
- Final bundled snapshot is expected to include `motion-0182` rather than stopping at `motion-0181`.

### 6. Snapshot refresh result

- bundled snapshot before refresh:
  - motion count: `179`
  - latest bundled motion: `motion-0180`
- bundled snapshot after refresh:
  - motion count: `181`
  - latest bundled motion: `motion-0182`
- `motion-0181` and `motion-0182` are both present in the final bundled snapshot
- `node portal/scripts/build-motion-snapshot.mjs --check` returned `status: current`

### 7. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0182/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
pnpm -C portal build
```

Results recorded after final snapshot refresh and verification:

- `validate_motion` -> pass
- `validate_agency` -> pass
- `typecheck` -> pass
- `snapshot_write` -> pass
- `snapshot_check` -> pass
- `build` -> pass

### 8. Acceptance checks

- MSG-01 pass
- MSG-02 pass
- MSG-03 pass
- MSG-04 pass
- MSG-05 pass
- MSG-06 pass
- MSG-07 pass
- MSG-08 pass
- MSG-09 pass
- MSG-10 pass
- MSG-11 pass
- MSG-12 pass
- MSG-13 pass
- MSG-14 pass
- MSG-15 pass
- MSG-16 pass

### 9. Ratification closeout

Motion-0182 is ratified as a process/documentation and snapshot-refresh seam.

- `motion.yaml` status -> `ratified`
- `decision.yaml` status -> `RATIFIED`
- `vote.json` result -> `PASS`
- final bundled snapshot includes `motion-0182`
- no automation, emitters, authority, runtime behavior, or data mutation paths were added
