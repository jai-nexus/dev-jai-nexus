# Challenge: Project Bootstrap and Agency Planning v0

**Motion:** motion-0084
**Challenger role:** DEV Challenger (6.0.3)
**Date:** 2026-03-30

## Challenges raised

### C1: Is this umbrella premature? Should WS-A through WS-E be defined
before any specific second project exists?

**Resolution:** No. The schemas produced by WS-A and WS-B are directly
informed by what we learned from dev-jai-nexus. Waiting for a second project
to exist before defining the intake model risks repeating the same hand-craft
overhead. The schemas should be written now, before OffBook.ai specifics
constrain them prematurely. The OffBook.ai example is used as a test case,
not as the schema driver.

### C2: Should WS-E (dispatch / coverage integration) be included in this
umbrella at all? It is the most speculative workstream.

**Resolution:** Include it as a named workstream but do not start it until
WS-A through WS-C have committed schemas. WS-E is in the umbrella to prevent
scope creep in later motions, not to authorize premature implementation.
Its presence here is a scope declaration, not an implementation authorization.

### C3: Should the NH root assignment convention for new projects be resolved
in WS-A or WS-B?

**Resolution:** WS-B. The intake object (WS-A) describes what a project
needs; the demand planner (WS-B) computes specific identities. NH root
assignment is an identity/registry concern, not an intake concern. However,
WS-A should include a `nh_root` placeholder field so the intake object is
complete even if the value is TBD.

### C4: Is "minimum_viable vs expanded vs panel" staffing tier the right
vocabulary, or does it overlap with the existing slot-policy.yaml
minimum_slot_intent?

**Resolution:** The staffing tier is a per-project decision that maps to
slot-policy.yaml intent fields. "minimum_viable" = 1 slot per role (no
panel). "expanded" = role.min_slots. "panel" = role.max_slots. The mapping
should be explicit in the WS-B schema. The vocabulary is deliberately
additive, not a replacement for slot-policy.yaml.

### C5: Should OffBook.ai be defined as monorepo or polyrepo in the example?

**Resolution:** Polyrepo, because that exercises the harder case — cross-repo
scope entries, governance-resident repo concept, and per-repo agent scope.
If the schema works for polyrepo, it trivially works for monorepo. Using a
monorepo example would underspecify the schema.

## Verdict

No blockers. Challenges C1–C5 resolved inline. motion-0084 is a valid
planning umbrella. WS-A through WS-D are concrete enough to produce committed
planning artifacts. WS-E is deferred pending WS-A–C progress.
