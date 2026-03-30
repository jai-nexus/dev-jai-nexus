# Proposal: Bounded Bootstrap Generator Real-Write Proof v0

**Motion:** motion-0090
**Parent:** motion-0084 (WS-D proof)
**Impl motion:** motion-0089
**Date:** 2026-03-30

## Context

The dry-run proof from motion-0089 confirmed the artifact list and
classification labels. A real-write proof is the correct next step before
WS-E: it validates that generated YAML is parseable, copied files arrive
intact, stubbed/manual-only content boundaries hold under real writes, and
idempotency works as specified.

## Proof design

**Output directory:** `out/bootstrap-proof/offbook-ai/`

Chosen because:
- `out/` is a standard disposable sandbox path in this repo
- Not tracked by git (will be gitignored or confirmed safe)
- Clearly named to indicate proof context, not a real project
- Easily cleaned up (`rm -rf out/bootstrap-proof/`)

**Proof target:** OffBook.ai intake example (already exists in `.nexus/planning/`)

**Proof steps:**

1. Syntax check (already confirmed; re-run for freshness)
2. Real write: `--output out/bootstrap-proof/offbook-ai --yes`
3. File list inspection: confirm 12 artifacts at correct paths
4. Content spot checks:
   - `config/agency.yaml` — parse as YAML, count agents
   - `.nexus/motions/motion-0001/proposal.md` — confirm no prose
   - `CLAUDE.md` — confirm TODO stubs present
   - `.nexus/agent-manifest.yaml` — confirm generated structure
   - `.nexus/council.config.yaml` — confirm copied verbatim
5. Second run (no --force): confirm all 12 skipped
6. Minimal fixes only if a concrete defect is found

## What the proof must not do

- Must not write to a real project repo
- Must not trigger OffBook.ai implementation
- Must not widen scope to Wave 1+ artifacts
- Generator must not be redesigned based on this proof
