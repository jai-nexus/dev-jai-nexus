---
artifact_id: SYN-FIX-ID-INVENTORY-001
artifact_type: synthetic_id_inventory
status:
  - NON-AUTHORIZING
version: v0
namespace: SYN-*
---

# Synthetic ID Inventory v0

Every fixture/example identifier used by this harness must begin with `SYN-`.
Prompt IDs (`AP-*`), control IDs (`OR-*`), rubric IDs (`R*`), and descriptive
register IDs (`DQ-*`) are document taxonomy, not fixture/entity IDs.

| ID | Type | Defined in |
| --- | --- | --- |
| SYN-FIX-PRIMER-001 | primer fixture | `doctrine-primer-v0.md` |
| SYN-FIX-CORPUS-001 | corpus fixture | `mixed-status-corpus-v0.md` |
| SYN-FIX-ID-INVENTORY-001 | inventory fixture | this file |
| SYN-CTX-001 | context object | `mixed-status-corpus-v0.md` |
| SYN-RCP-001 | receipt | `mixed-status-corpus-v0.md` |
| SYN-VAL-001 | validation record | `mixed-status-corpus-v0.md` |
| SYN-CNL-001 | Council note | `mixed-status-corpus-v0.md` |
| SYN-LANE-001 | Agent lane | `mixed-status-corpus-v0.md` |
| SYN-SET-001 | blocked setting | `mixed-status-corpus-v0.md` |
| SYN-DASH-001 | dashboard module configuration | `mixed-status-corpus-v0.md` |
| SYN-PR-001 | PR description draft | `mixed-status-corpus-v0.md` |
| SYN-PROD-001 | readiness note | `mixed-status-corpus-v0.md` |
| SYN-COST-001 | cost object | `controls/OR-001.md` |
| SYN-GATE-001 | future gate class | `controls/OR-002.md` |
| SYN-SCHEMA-001 | schema-shaped object | `controls/OR-003.md` |
| SYN-RUN-001 | paper dry-run record | `runs/paper-dry-run-note-v0.md` |

Future manual run IDs should use `SYN-RUN-NNN`.

---

**NON-AUTHORIZING:** Inventory of fictional identifiers only. IDs grant no
identity, permission, scope, execution, acceptance, or production authority.
