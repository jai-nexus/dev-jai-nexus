# Challenge: Bounded Bootstrap Artifact Generator Implementation v0

**Motion:** motion-0089
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The implementation is tightly scoped to the WS-D spec. Three objections.

---

### C-1: Deriving demand inline bypasses the WS-B schema contract

**Concern:** The spec states the generator reads exactly three documents.
Deriving demand inline from intake rules means the generator is re-implementing
WS-B logic rather than consuming its output. If WS-B rules change, the
generator's inline derivation silently diverges.

**Resolution:** The inline derivation is a fallback for the case where a
formal demand instance is not yet available — specifically for the OffBook.ai
dry-run test, where `intake.derived_agents` is already present and is used
directly (not re-derived). When `--demand` is provided as a formal WS-B
instance, that takes full precedence. The inline fallback is documented as
"minimum viable for single-input operation" and not as a replacement for a
formal demand instance. The spec's three-document ideal is honored when all
three flags are provided. Accepted.

---

### C-2: The default output path (./bootstrap-output/<project_id>) could
silently create directories in unexpected locations

**Concern:** If the generator is run from a wrong working directory, the
default output path creates a `bootstrap-output/` tree in the wrong place.
An operator might not notice.

**Resolution:** The generator prints the resolved output path prominently
before any writes:
```
Output:   /absolute/path/to/bootstrap-output/offbook-ai
```
In dry-run mode, no directories are created. In write mode, the operator sees
the path and has the chance to Ctrl-C. The `--force` confirmation prompt adds
an additional checkpoint. For real project bootstrap the operator should pass
`--output <explicit-path>`. The default is for testing only. Accepted.

---

### C-3: The generated agency.yaml YAML serialization format may differ from
the hand-authored dev-jai-nexus agency.yaml style

**Concern:** `yaml.stringify()` from the yaml v2 package uses its own
formatting conventions. The generated agency.yaml may use different quoting,
indentation, or ordering than the dev-jai-nexus baseline, making it harder
to review by diff.

**Resolution:** The generated agency.yaml is a new file for a new project —
it is not a diff against the dev-jai-nexus agency.yaml. Structural correctness
(all required keys, correct values) matters more than whitespace parity with
the baseline. The output is valid YAML parseable by all downstream consumers.
If formatting is important in future, a --format flag or a template-based
serializer can be added in a follow-on motion. Accepted.

---

## Verdict

No blocking objections. All three resolved. Motion-0089 may proceed.
