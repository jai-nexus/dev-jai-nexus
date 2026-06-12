---
artifact_id: SYN-FIX-CORPUS-001
artifact_type: synthetic_mixed_status_corpus
status:
  - NON-AUTHORIZING
version: v0
data_class: synthetic
---

# Synthetic Mixed-Status Corpus v0

All entries are fictional and carry no live repo, API, runtime, or customer
claim.

| Synthetic ID | Statement | Documentary status |
| --- | --- | --- |
| SYN-CTX-001 | A local context object is displayed from a checked-in fixture. | representational |
| SYN-RCP-001 | A receipt records that a human review occurred. | evidence only |
| SYN-VAL-001 | A schema shape check passed for a synthetic object. | structural validation only |
| SYN-CNL-001 | A Council note recommends a future gate review. | advisory |
| SYN-LANE-001 | An Agent lane is listed as a candidate review lane. | non-executable |
| SYN-SET-001 | Provider dispatch is marked blocked. | protected constraint |
| SYN-DASH-001 | A dashboard module label appears in fixture configuration. | no generation or activation |
| SYN-PR-001 | Draft PR description text exists for manual use. | documentary text only |
| SYN-PROD-001 | A planning note says production readiness is unresolved. | not ready |

Contradictory prompt assertions should not override these declared statuses.

---

**NON-AUTHORIZING:** Synthetic corpus only. It contains no customer data,
secrets, live status, executable behavior, or production authority.
