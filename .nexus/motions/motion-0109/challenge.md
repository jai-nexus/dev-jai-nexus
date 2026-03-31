# Challenge: Context bundle discoverability — add find-context-bundle.mjs with staleness detection

**Motion:** motion-0109
**Date:** 2026-03-31

## Separation of concerns challenge

**Q: Why a new script rather than adding discovery logic to `generate-context-bundle.mjs`?**

The generator's responsibility is to produce bundles. Adding discovery logic there
would conflate two concerns: production and consumption. A session that wants to
know "is there a current bundle for motion-0109?" should not have to run the
generator to find out — and should not accidentally trigger regeneration when it
only wants to check. A dedicated consumer-side script is the right separation.

This also matches how the operator workflow works in practice: you check first,
then generate if needed. The two actions have different triggers and different
intents.

## Exit code challenge

**Q: Should the script exit non-zero when the bundle is STALE?**

No. Staleness is informational, not an error. A stale bundle is a valid bundle
that may still be useful for some queries. The caller decides whether to regenerate.
Exit non-zero would prevent the script from being used in pipeline-style workflows
where the caller reads the output and decides. Exit 0 for all informational cases
(FRESH, STALE, NO BUNDLE) is correct. Exit 1 is reserved for actual script errors.

## Manifest compatibility challenge

**Q: Does this work with the old `context-bundle-0.1` manifest in `surfaces/chat-context/`?**

Yes. The script reads the `head_commit` field from the manifest. The existing
`2026-03-13_context-bundle_manifest.json` has `"head_commit": "981771a"` — this
is a valid commit hash that `git rev-list` can use to count commits behind HEAD.
The `motion` field is `"motion-0033"` in the old manifest, so a search for
any other motion will correctly find nothing and report NO BUNDLE.

The script degrades gracefully for older manifests: if `head_commit` is absent
or `"(unknown)"`, it reports STALE without a commit count rather than failing.

## Scope challenge

**Q: Should this motion also update `operating-workflow.md` to reference the new script?**

No. The operating-workflow update is a documentation change that follows naturally
once the script is proven and ratified. Including it here would mix a code change
with a doc change in the same builder-proof motion. The script ships first; the
doc reference follows as a separate small motion or as part of the next wave's
docs pass.

## Alternative challenge

**Q: Is a `find-context-bundle.mjs` script the right form, or would a flag on the
generator be simpler?**

A flag on the generator would require the user to invoke the generator to get
information about existing bundles — which conflates production and consumption
(see above). A standalone script is also easier to verify: the VERIFIER can run
`find-context-bundle.mjs --motion motion-XXXX` and check the output without
triggering a re-run of the entire bundle generation pipeline.

## Resolution

No blocking challenge identified. Proceed to execution.
