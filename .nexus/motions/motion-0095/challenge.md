# Challenge: Bounded bootstrap-manifest.instance.yaml Emission

**Motion:** motion-0095
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The implementation is minimal and correctly scoped. Two objections raised.

---

### C-1: The manifest records results of the --force rerun, not the original
motion-0093 emission — is that truthful?

**Concern:** The manifest emitted here will show `result: wrote` for all 12
artifacts because we ran with `--force --yes`. The original motion-0093 emission
also wrote all 12. So the manifest accurately reflects a generation event, but
not specifically the motion-0093 event.

**Resolution:** The spec describes the manifest as a record of "what was emitted,
generation timestamp, and input document hashes" — not a historical audit of
the motion-0093 run. The manifest correctly records the current generation event
(timestamp, input hash, results). If re-run idempotently, the manifest is skipped
and retains the original `generated_at`. The manifest is an emission record, not
a motion history log. Accepted.

---

### C-2: Only the intake hash is recorded — not demand or topology inputs.
Is this incomplete?

**Concern:** The spec (note 6) says the manifest "should include SHA-256 hashes
of input documents." The generator accepts `--demand` and `--topology` as optional
inputs, but only `input_hashes.intake` is recorded.

**Resolution:** For the OffBook.ai rollout, demand and topology are both derived
inline from the intake (not passed as separate files). There are no separate files
to hash. The implementation correctly hashes only what is provided as a file path.
The spec says "should" not "must" for hashes. This is the correct minimal
implementation for the current generator contract. Adding demand/topology hashes
when those inputs are files would be a straightforward follow-up. Accepted.

---

## Verdict

No blocking objections. Both challenges accepted. motion-0095 implementation
is correct, minimal, and within scope.
