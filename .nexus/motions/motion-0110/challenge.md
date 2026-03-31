# Challenge: Context bundle refresh workflow — add refresh-context-bundle.mjs as single-command entrypoint

**Motion:** motion-0110
**Date:** 2026-03-31

## Single-responsibility challenge

**Q: Should `find-context-bundle.mjs` gain a `--refresh` flag instead of creating
a new script?**

No. `find-context-bundle.mjs` is a read-only inspector: it reports state without
modifying anything. Adding a generation side-effect to an inspector changes its
fundamental nature and makes it harder to reason about. A session running
`find-context-bundle.mjs` to check bundle state should not trigger regeneration
as a side effect. The separation is intentional and maps to the Unix pattern:
one tool inspects, another tool acts.

`refresh-context-bundle.mjs` is the actor: it may write (via the generator) and
always produces a files list. The distinction is clear at the name level.

## Subprocess vs. direct logic challenge

**Q: Should `refresh-context-bundle.mjs` call `find-context-bundle.mjs` as a
subprocess rather than duplicating the manifest logic?**

No. Parsing subprocess stdout is fragile — any format change to find-context-bundle's
output would silently break the refresh script. The stable interface between these
two scripts is the manifest format (context-bundle-0.2 JSON), not the CLI output.
Both scripts read manifests directly. The ~30 lines of manifest-reading and
staleness logic are a deliberate, bounded duplication at the correct layer.

`generate-context-bundle.mjs` is the right target for subprocess invocation: its
output is the new manifest path on stdout, and the refresh script needs to trigger
it and then re-read manifests — not parse its output.

## Generation failure challenge

**Q: What if `generate-context-bundle.mjs` fails during the STALE or NO BUNDLE case?**

`execFileSync` throws on non-zero exit. The `main()` catch block re-throws with
the `[refresh-context-bundle] FAILED` prefix and exits 1. This is correct: a
generation failure is a real error, not an informational state. The caller sees
the generator's own error output (via `stdio: "inherit"`) followed by the refresh
script's failure line.

## No-bundle-after-generation challenge

**Q: What if generation succeeds but the new manifest is not found in the re-read
(e.g. timing or write issue)?**

This is treated as a script error: exit 1 with a clear message. This case should
not happen if `generate-context-bundle.mjs` exits 0 and the filesystem is consistent.
It is a safety guard, not an expected branch.

## FRESH-skip challenge

**Q: Is it always correct to skip generation when the bundle is FRESH?**

Yes. FRESH means `bundle.head_commit === git rev-parse --short HEAD` — the bundle
was generated at the exact same commit as the current working state. No new commits
have changed any files. The bundle content is valid. Regenerating a FRESH bundle
would be redundant and potentially confusing (new timestamp, same content).

## Resolution

No blocking challenge identified. Proceed to execution.
