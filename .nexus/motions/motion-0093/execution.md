# Execution: Bounded First Real OffBook.ai Wave 0 Bootstrap Rollout

**Motion:** motion-0093
**Role:** VERIFIER
**Date:** 2026-03-30

## Scope

Files created or changed:

```
.nexus/planning/offbook-ai-intake.yaml          (new — real intake instance)
portal/scripts/generate-bootstrap.mjs           (minimal fix: repo_scope)
out/offbook-ai/                                 (12 Wave 0 artifacts, new)
```

No other files touched.

## Steps

### Step 1 — Dry-run against real intake

```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake.yaml \
  --output out/offbook-ai --dry-run
```

Result: Would write/copy: 12  Would skip: 0. All 12 classified correctly.

### Step 2 — Real rollout (run 1)

```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake.yaml \
  --output out/offbook-ai --yes
```

Result: Wrote/copied: 12  Skipped: 0.

### Step 3 — Defect observed

`project-constitution.yaml` contained `repo_scope: offbook-ai`. The spec
(bootstrap-generator.spec.md) mandates:

```
repo_scope  ← topology.governance_resident_repo
```

The generator used `intake.project_id` ("offbook-ai") instead of
`topology.governance_resident_repo` ("offbook-core"). This defect did not
surface in the motion-0090 proof run because dev-jai-nexus has
`project_id == governance_resident_repo`. The polyrepo rollout exposed it.

### Step 4 — Minimal fix applied

`portal/scripts/generate-bootstrap.mjs` — two-line change:

```diff
-function buildConstitution(intake, demand) {
+function buildConstitution(intake, demand, topology) {
   ...
-    repo_scope: intake.project_id,
+    repo_scope: topology.governance_resident_repo,
```

```diff
-    buildConstitution(intake, demand),
+    buildConstitution(intake, demand, topology),
```

Confirmed: `node --check portal/scripts/generate-bootstrap.mjs` SYNTAX OK.

### Step 5 — Re-run with --force (corrected rollout)

```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake.yaml \
  --output out/offbook-ai --force --yes
```

Result: Wrote/copied: 12  Skipped: 0. Corrected artifacts verified.

### Step 6 — Content verification

- `config/agency.yaml`:
  - Parses as valid YAML ✓
  - 9 agents: 5 governance (7.0, 7.0.1–7.0.4) + 4 execution (7.0.10–7.0.12, 7.0.14) ✓
  - ARCHITECT/BUILDER/VERIFIER scope: both offbook-core + offbook-web ✓
  - OPERATOR scope: offbook-core only ✓
  - No paths:portal/src/** in any scope entry ✓
- `.nexus/context/project-constitution.yaml`:
  - `repo_scope: offbook-core` ✓ (corrected from offbook-ai)
  - `project: OffBook AI` ✓
- `.nexus/motions/motion-0001/motion.yaml`:
  - `target.domain: offbook.ai` ✓
  - `target.repo: offbook-core` ✓
  - `summary: "<!-- TODO: ... -->"` — no governance prose ✓
- `.nexus/motions/motion-0001/proposal.md`:
  - Headings + HTML comment placeholders only — no governance prose ✓
- `CLAUDE.md`:
  - `## Repo\noffbook-core` ✓
  - All content sections are [TODO: ...] stubs ✓

### Step 7 — Idempotency run

```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake.yaml \
  --output out/offbook-ai
```

Result: Wrote/copied: 0  Skipped: 12. All 12 skipped. ✓

## Fixes applied

| Fix | Location | Justification |
|---|---|---|
| `buildConstitution` signature: add `topology` param; use `topology.governance_resident_repo` for `repo_scope` | generate-bootstrap.mjs L360, L629 | spec mandates `repo_scope ← topology.governance_resident_repo`; polyrepo rollout exposed the bug (not visible when project_id == repo name) |

## Evidence

- Real rollout: 12/12 artifacts emitted ✓
- Scope correctness: ARCHITECT/BUILDER/VERIFIER cross-repo; OPERATOR governance-resident-only ✓
- No dev-jai-nexus-specific paths in generated artifacts ✓
- constitution.yaml repo_scope: offbook-core ✓
- proposal.md: headings + HTML comment placeholders only ✓
- Idempotency: 12/12 skipped on final run ✓
