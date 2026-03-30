# Challenge: Bounded First Real OffBook.ai Wave 0 Bootstrap Rollout

**Motion:** motion-0093
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The rollout executed cleanly after one minimal fix. Three objections raised.

---

### C-1: The out/offbook-ai/ output is staged in dev-jai-nexus, not in
offbook-core — is this a real rollout or just another proof run?

**Concern:** The output lands in `out/offbook-ai/` inside dev-jai-nexus.
offbook-core doesn't exist yet. Calling this a "real rollout" while the
artifacts aren't in the actual target repo seems like a categorization problem.

**Resolution:** The distinction from the motion-0090 proof run is twofold:
(1) this uses a real intake instance (`offbook-ai-intake.yaml`, not the
`offbook-ai-intake-example.yaml` planning illustration) — a governance
document that is tracked and committed; (2) the output is committed to
dev-jai-nexus as a durable record rather than a disposable directory. When
offbook-core is initialized as its own repo, `out/offbook-ai/` is the
committed source of truth for its Wave 0 substrate. This is the correct
staging approach when the target repo does not yet exist. Accepted.

---

### C-2: The fix to buildConstitution (repo_scope) changes the generator —
does this invalidate the motion-0089 and motion-0090 ratifications?

**Concern:** motion-0089 and motion-0090 ratified the generator as written.
A code change to the generator, even minimal, could be seen as reopening
those motions.

**Resolution:** motion-0089 ratified the implementation; motion-0090 ratified
the proof against a same-repo context where the defect was invisible.
motion-0093 explicitly calls for "minimal hardening fixes if the real rollout
exposes a concrete blocker." The defect was exposed exactly by this rollout
(polyrepo case). The fix is two lines and correct per the spec. The spec
(motion-0088, bootstrap-generator.spec.md) defines `repo_scope ←
topology.governance_resident_repo` unambiguously. The generator now matches
the spec. This does not reopen or invalidate 0089/0090 — it is the expected
refinement path that proof motions exist to trigger. Accepted.

---

### C-3: The rollout does not emit a bootstrap-manifest.instance.yaml —
the spec requires one

**Concern:** `bootstrap-generator.spec.md` (motion-0088) states the generator
"also emits `bootstrap-manifest.instance.yaml`" as a record of what was
emitted. This file is not present in `out/offbook-ai/`.

**Resolution:** The bootstrap-manifest.instance.yaml is documented in the
spec under "Output contract" as a future requirement. The current generator
implementation (motion-0089) explicitly does not emit it — this was a known
gap at the time of motion-0089 ratification. It is out of scope for the
motion-0093 rollout and does not block Wave 0 governance use of the emitted
artifacts. A future bounded motion should address manifest instance emission.
Noted as a known gap. Accepted.

---

## Verdict

No blocking objections. All three resolved. motion-0093 Wave 0 rollout is
valid. `out/offbook-ai/` is the committed Wave 0 substrate for offbook-core.
