# Execution: JAI Grid Council-Run Preconditions v0

**Motion:** motion-0134
**Role:** BUILDER
**Date:** 2026-04-15

---

## Cost estimate

Category: standard
Basis: this step opens only a repo-ready motion package. No implementation files change,
no portal runtime changes occur, and no governance scripts are executed beyond package
validation.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Scope

### New files

- `.nexus/motions/motion-0134/motion.yaml`
- `.nexus/motions/motion-0134/proposal.md`
- `.nexus/motions/motion-0134/challenge.md`
- `.nexus/motions/motion-0134/execution.md`

### Not created in this step

- `policy.yaml`
- `vote.json`
- `verify.json`
- `decision.yaml`
- `decision.md`

These artifacts are intentionally absent because this step opens the motion package only
and does not run the canonical ratification path.

### Unchanged

- `portal/scripts/grid-review-motion-package.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `package.json` - untouched
- All portal runtime files - untouched
- All database or cross-repo paths - untouched

---

## Execution plan

1. Create a repo-ready motion package for `motion-0134`
2. Encode the council-run precondition framing only
3. Keep the package bounded to:
   - explicit preconditions
   - blocked/ready outcomes
   - operator guidance
   - read-only checking
4. Validate the package with:
   - `validate-motion`
   - `validate-agency`
5. Commit only the motion package

---

## Evidence log

### 1. Package opened without implementation drift

This step creates only the `motion-0134` package under `.nexus/motions/`.
No implementation scripts, runtime files, or governance runners are modified.

### 2. Boundary preservation

The package explicitly preserves:

- `grid:review` stays read-only
- `council-run` stays a separate explicit operator action
- no portal-side writes
- no auto-commit
- no auto-PR
- no automatic `council-run`

### 3. Validation

Run after package creation:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0134/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```
