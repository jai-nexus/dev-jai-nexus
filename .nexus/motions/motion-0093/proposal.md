# Proposal: Bounded First Real OffBook.ai Wave 0 Bootstrap Rollout

**Motion:** motion-0093
**Date:** 2026-03-30

## Problem

The motion-0090 real-write proof confirmed the generator against a disposable
directory (`out/bootstrap-proof/offbook-ai/`). That directory was ephemeral —
not committed, not a governance record, used only to validate generator
behavior.

The next bounded step is the first **real** rollout: the same generator
applied to a real intake instance, producing artifacts tracked as the
governance-safe Wave 0 substrate for the `offbook-core` repo.

Two things distinguish this from the proof run:

1. **Real intake document.** The proof used `.nexus/planning/offbook-ai-intake-example.yaml`
   — a planning illustration. The real rollout uses `.nexus/planning/offbook-ai-intake.yaml`,
   a WS-A–conformant intake instance with `project_type: greenfield`, no
   derived fields, and `nh_root: "7.0"` as the confirmed NH assignment.

2. **Committed rollout record.** The output lands at `out/offbook-ai/` — a
   non-disposable location tracked in dev-jai-nexus. These artifacts serve as
   the staging output for offbook-core and are committed as part of this motion.

## Approach

1. Create `.nexus/planning/offbook-ai-intake.yaml` — real intake instance.
2. Dry-run to confirm 12/12 artifacts would be emitted.
3. Real rollout to `out/offbook-ai/`.
4. Inspect all 12 artifacts.
5. Confirm idempotency.
6. Apply minimal hardening fixes only if a concrete defect is found.

## Rollout output location

`out/offbook-ai/` within dev-jai-nexus.

This directory represents the Wave 0 governance substrate for `offbook-core`.
When `offbook-core` is initialized as its own repo, the contents of `out/offbook-ai/`
are transferred to its root. Until then, `out/offbook-ai/` is the durable
staging record committed to `dev-jai-nexus`.

## Scope boundary

| In scope | Out of scope |
|---|---|
| Real intake document creation | offbook-core repo initialization |
| generator rollout to out/offbook-ai/ | Wave 1+ motions or execution |
| artifact inspection + idempotency check | motion-0001 authorship |
| minimal hardening fix if rollout surfaces defect | dispatch/conductor wiring |
