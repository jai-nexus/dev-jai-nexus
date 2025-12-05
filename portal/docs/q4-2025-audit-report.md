# Q4 2025 – JAI NEXUS Audit Report

Date: 2025-12-05  
Scope: jai-nexus org (Tier-0 / Tier-1 repos)  

---

## 1. Outcomes

### 1.1 JAI & dev-jai-nexus roles

- Defined JAI agency in `jai/agents/agency.yaml` with NH IDs:
  - 1.0 – Operator
  - 1.1 – JAI core (`jai`)
  - 1.2 – Dev portal (`dev-jai-nexus`)
  - 2.1 – OffBook owner
  - 2.2 – Teacher Copilot owner
- Attached NH map to the `jai` repo (`docs/NH_MAP.md`).
- Wired JAI core to emit SoT events to `sot/SOT_DB_EVENTS.jsonl` via
  `jai_nexus/sot_events.py` and `tools/emit_test_event.py`.

### 1.2 Repo sprawl → registry

- Created `portal/config/repos.yaml` and `portal/config/projects.yaml`.
- Classified repos:

  **Tier-0 (active, existential)**  
  - `jai-nexus/jai-nexus` (meta)  
  - `jai-nexus/jai` (core engine)  
  - `jai-nexus/dev-jai-nexus` (portal / SoT DB)  

  **Tier-1 (active)**  
  - `jai-nexus/docs-nexus` (docs & specs)  
  - `jai-nexus/offbook-ai` (external product anchor)  

  **Tier-2 (frozen)**  
  - `jai-nexus/teacher-copilot`  
  - key infra repos: SourceTree, SoT tools, agency/orchestrator, memory/modelops, etc.

- Added `/operator/events` (alias of events view) and Operator nav link.

### 1.3 External project anchored (OffBook.v0)

- Added `docs/offbook-v0-design.md` with front-matter and v0 scope.
- Registered project in `config/projects.yaml` as `offbook.v0`
  (NH `2.1`, Tier-1, repo `jai-nexus/offbook-ai`).
- Logged OffBook events in `jai/sot/SOT_DB_EVENTS.jsonl`:
  - `OFFBOOK_PROJECT_ANCHORED`
  - `OFFBOOK_TASK_CREATED`
  - `OFFBOOK_SESSION_LOGGED`

---

## 2. SoT & operator loop

- Implemented Q4 audit script: `scripts/run-q4-audit.ts`
  - Reads `config/repos.yaml` / `config/projects.yaml`
  - Validates Tier-0/Tier-1 presence and anchored external project
  - Inserts `AUDIT_Q4_2025_COMPLETED` into the `SotEvent` table.

- `/operator/events` and `/events` both show the latest SoT events,
  including Q4 audit runs.

---

## 3. Q1 2026 starting position

Going into Q1:

- Only **five** repos are allowed to demand focus:
  - Tier-0: `jai-nexus/jai-nexus`, `jai-nexus/jai`, `jai-nexus/dev-jai-nexus`
  - Tier-1: `jai-nexus/docs-nexus`, `jai-nexus/offbook-ai`
- OffBook.v0 is the single external product focus.
- Heavy infra (SourceTree, SoT services, agency orchestrators, memory/modelops)
  is explicitly **frozen** until JAI core + OffBook v0 are stable.

Weekly operator loop (to refine in Q1):

1. Run `npm run audit:q4-2025` (to become `audit:weekly`).
2. Review `/operator/events` and `/repos`/`/operator/registry`.
3. Create/close NH-tagged issues for OffBook/JAI work and reflect major
   moves with SoT events.

This document should not be edited retroactively. Add new sections for future
audits instead of rewriting history.
