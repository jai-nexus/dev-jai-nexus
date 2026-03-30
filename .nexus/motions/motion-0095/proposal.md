# Proposal: Bounded bootstrap-manifest.instance.yaml Emission

**Motion:** motion-0095
**Date:** 2026-03-30

## Context

`generate-bootstrap.mjs` (motion-0089) emits the 12 Wave 0 substrate artifacts
correctly. However, `bootstrap-generator.spec.md` (motion-0088) specifies that
the generator also emits `bootstrap-manifest.instance.yaml` — a durable output
record capturing generation timestamp, input hash, and per-artifact results.

This gap was accepted at motion-0089, re-accepted at motion-0093 (C-3 in
challenge.md), and explicitly deferred to a separate bounded motion by
motion-0094 (decision.md, "Known gap" section). This motion closes it.

## Problem

`bootstrap-manifest.instance.yaml` is not emitted by the current generator.
The manifest is the generation event record — not a Wave 0 governance substrate
artifact, but a necessary artifact for reproducibility, provenance, and honest
closure of the bootstrap generator spec.

Without it, there is no machine-readable record of what was emitted, when, or
from which inputs.

## Proposal

Add a `buildBootstrapManifest()` function to `generate-bootstrap.mjs` that:

1. Computes a SHA-256 hash of the intake input file via `node:crypto`.
2. Builds an instance document recording:
   - `project_id`, `governance_resident_repo`, `generated_at`, `wave: 0`
   - `input_hashes.intake` — SHA-256 hex of the intake YAML
   - `artifacts` — ordered list of the 12 substrate artifacts with
     `id`, `path`, `classification`, and `result` (wrote/copied/skipped/missing)
   - `totals` — aggregate counts
3. Writes the manifest to `<outputRoot>/.nexus/planning/bootstrap-manifest.instance.yaml`
   using the existing `writeFileIdempotent` helper, labeled `"manifest"`.
4. The manifest is written **after** the 12 substrate artifacts so
   `result` values are accurate.

No changes to the 12 existing artifact builders. No scope widening.

## Non-goals

- No SHA-256 hashes for demand or topology inputs (not required by spec).
- No changes to any of the 12 substrate artifact builders or their output.
- No Wave 1+ artifacts.
- No live-repo promotion, dispatch runtime, or council seam work.

## Success criteria

- `bootstrap-manifest.instance.yaml` is emitted to `out/offbook-ai/.nexus/planning/`.
- Manifest content is correct: project_id, governance_resident_repo, generated_at,
  wave=0, input_hashes.intake (SHA-256), artifacts list (12), totals.
- Second run without `--force` skips all 13 artifacts (idempotency preserved).
- `node --check portal/scripts/generate-bootstrap.mjs` exits 0.
- No unrelated files changed.
