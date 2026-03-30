# Execution: Bounded Bootstrap Generator Real-Write Proof v0

**Motion:** motion-0090
**Role:** VERIFIER
**Date:** 2026-03-30

## Scope

One file changed:

```
portal/scripts/generate-bootstrap.mjs   (minimal fix: remove paths:portal/src/**)
```

Proof output directory `out/bootstrap-proof/offbook-ai/` is disposable and
not committed. 12 generated files verified, then removed from tracked scope.

## Proof steps and results

### Step 1 — Syntax check
```
node --check portal/scripts/generate-bootstrap.mjs
→ SYNTAX OK
```

### Step 2 — Real write (run 1, pre-fix)
```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake-example.yaml \
  --output out/bootstrap-proof/offbook-ai --yes
```
Result: 12 artifacts emitted (Wrote/copied: 12, Skipped: 0). All 12 expected
paths created.

### Step 3 — Defect observed
ARCHITECT scope contained `paths:portal/src/**` — a dev-jai-nexus-specific
path that was hardcoded in the inline topology derivation and incorrectly
bleeds into all generated projects.

### Step 4 — Minimal fix applied
Removed `"paths:portal/src/**"` from `deriveTopology()` governance-resident
path list. One-line change. `paths:src/**` already present from `srcPattern`.

### Step 5 — Re-write with --force
All 12 artifacts re-written. Corrected agency.yaml verified:
```
ARCHITECT scope: [repo:offbook-core, repo:offbook-web, paths:src/**, paths:.nexus/**,
                  paths:config/**, deny:**/.env*, deny:**/*.env*, deny:**/secrets/**,
                  actions:read, actions:plan, actions:design]
OPERATOR scope:  [repo:offbook-core, paths:src/**, paths:.nexus/**, paths:config/**,
                  deny:..., actions:read, actions:review, actions:approve]
```

### Step 6 — Content verification
- `config/agency.yaml` — parsed as valid YAML; 9 agents with correct NH IDs:
  7.0 through 7.0.4 (governance), 7.0.10/11/12/14 (execution)
- `council.config.yaml` — byte-for-byte identical to baseline (diff: IDENTICAL)
- `context/slot-policy.yaml` — byte-for-byte identical (diff: IDENTICAL)
- `motion-0001/proposal.md` — headings + HTML comment placeholders only;
  no governance prose; manual-only boundary holds
- `CLAUDE.md` — repo name pre-filled ("offbook-core"); all content sections
  are `[TODO: ...]` stubs; stubbed boundary holds

### Step 7 — Idempotency run (run 2, no --force)
```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake-example.yaml \
  --output out/bootstrap-proof/offbook-ai
```
Result: Wrote/copied: 0, Skipped: 12. All 12 artifacts skipped. ✓

## Fixes applied

| Fix | Location | Justification |
|---|---|---|
| Remove `paths:portal/src/**` from `deriveTopology()` | generate-bootstrap.mjs L162 | dev-jai-nexus-specific path should not appear in generated projects; `paths:src/**` already covers the generic case |

## Evidence

- Real write: 12/12 artifacts emitted ✓
- Scope correctness: ARCHITECT cross-repo, OPERATOR gov-resident-only ✓
- Copied files: byte-for-byte identical to baseline ✓
- Manual-only enforcement: proposal.md is shell only ✓
- Idempotency: 12/12 skipped on second run ✓
