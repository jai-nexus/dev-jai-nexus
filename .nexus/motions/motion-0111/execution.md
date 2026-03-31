# Execution: Motion corpus audit — schema family classification and normalization inventory

**Motion:** motion-0111
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Files created:

```
.nexus/docs/motion-corpus-audit.md             (new — committed audit document)
.nexus/motions/motion-0111/                    (6 files — this motion package)
```

Files NOT changed:
- No existing motions edited
- No scripts changed
- No runtime, DB, or UI changes

## Steps

### Step 1 — Repo state inspection

Branch: `sprint/q2-motion-normalization-audit`. Clean working tree.
Corpus on branch: 108 motions (0001–0108) in `.nexus/motions/`.
Last commit: `5afacb1 feat(context): fix active-path-pack and repo-capsule accuracy (motion-0108)`.

Additional motions 0109 and 0110 exist on `sprint/q2-context-workflow-hardening`
(not yet merged). Their decision.yaml files were read from git history at specific
commit hashes to include them in the full-corpus audit:
- motion-0109: commit d744582 — status: RATIFIED, Family D
- motion-0110: commit fa2be2a — status: RATIFIED, Family D

Full corpus size at audit: 110 motions (0001–0110).

### Step 2 — Corpus survey (actual artifact reads)

Survey methodology:
- `grep "^protocol_version:"` on all motion.yaml → identifies Family D boundary
- `grep "^status:"` on all motion.yaml → identifies when status field appeared
- `grep "^protocol_version:"` on all decision.yaml → identifies sub-family B boundaries
- `grep "^status:"` on all decision.yaml → identifies the 4 DRAFT motions
- artifact presence check (vote.json, verify.json, policy.yaml, decision.md, trace.json)
- `git show {hash}:{path}` for motion-0109 (d744582) and motion-0110 (fa2be2a) decision.yaml
  → both RATIFIED, both Family D; open-motion set unchanged

Results: see `motion-corpus-audit.md`.

### Step 3 — Draft motion-corpus-audit.md

Committed to `.nexus/docs/motion-corpus-audit.md`. Contains:
- Audit metadata (date, branch, corpus size: 110 motions 0001–0110, methodology including git-history reads)
- Explicit status-source rule: decision.yaml is authoritative; motion.yaml status: proposed is constant
- Schema family table with exact boundaries (Family D: 0098–0110)
- Artifact completeness table per family
- Open motion register (0037, 0083, 0092, 0094) with anomaly types — verified against full 110-motion corpus
- Canonical forward contract (what a normalized motion-0098+ package looks like)
- Normalization action registry with priority

### Step 4 — Gate validation

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0111/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence

- `motion-corpus-audit.md`: 110 motions (0001–0110), 4 families, 4 open motions, canonical contract, normalization registry ✓
- motions 0109–0110 confirmed RATIFIED Family D via git-history reads (d744582, fa2be2a) ✓
- Status-source rule stated explicitly: decision.yaml is authoritative; motion.yaml status: proposed is constant ✓
- All family boundaries derived from actual artifact reads, not assumed ✓
- Open-motion set verified after including 0109–0110: unchanged (0037, 0083, 0092, 0094) ✓
- No existing motion edited ✓
- validate_motion EXIT 0 ✓
- validate_agency EXIT 0 ✓
