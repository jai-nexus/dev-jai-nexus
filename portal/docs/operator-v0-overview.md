# JAI NEXUS · Operator v0 Overview

**NH root:** `1.0`  
**Portal app:** `jai-nexus/dev-jai-nexus` → `portal/` (Next.js 16, Prisma, Neon)

Operator v0 is the control plane for dev.jai.nexus.  
It gives a single place to:

- Inspect **SoT events** (stream-of-record).
- See the **NH-based agent map** (Agency).
- See the **project registry** (Projects).
- Anchor external products (OffBook.ai) and internal agents (Autopilot v0).

This doc captures what is live at the end of Q4 2025.

---

## 1. Live routes

All routes live under the `portal/` Next.js app.

### 1.1 Operator home

- Path: `/operator`
- Purpose: Operator dashboard
- Data:
  - Total SoT events (DB count).
  - Total agents (from `config/agency.yaml`).
  - Total projects (from `config/projects.yaml`).
- Cards:
  - **Events** → `/operator/events`
  - **Agents** → `/operator/agents`
  - **Projects** → `/operator/projects`

This is the primary entrypoint when you click **Operator** in the top nav.

---

### 1.2 Events

- Paths:
  - Public list: `/events`
  - Operator tab: `/operator/events`
- Backed by: `SotEvent` table in Neon via Prisma.

Columns:

- **Event time** – canonical `ts` from SoT envelope (America/Chicago display).
- **Ingested** – DB `createdAt` (ingestion time).
- **Source** – `source` field (`CHATGPT`, `JAI-RUNNER`, `OFFBOOK-DEPLOY-SCRIPT`, etc.).
- **Kind** – event kind (`conversation`, `OFFBOOK_V0_DEPLOYED`, `AUDIT_Q4_2025_COMPLETED`, `AUTOPILOT_PROJECT_REGISTERED`, …).
- **NH_ID** – `nhId` field (ties to Agency / Projects).

Scripts that currently emit SoT events:

- `npm run ingest:event`  
  - Uses `scripts/ingest-sot-event.ts` to read a JSON file and insert a v0.1 SoT envelope.
- `npm run audit:q4-2025`  
  - Uses `scripts/run-q4-audit.ts` to emit `AUDIT_Q4_2025_COMPLETED` events.
- `npm run emit:offbook-v0`  
  - Uses `scripts/emit-offbook-v0-deployed.ts` to emit `OFFBOOK_V0_DEPLOYED`.
- `npm run emit:autopilot-v0`  
  - Uses `scripts/emit-autopilot-v0-init.ts` to emit `AUTOPILOT_PROJECT_REGISTERED`.

SoT contract: see `docs/sot-event-v0.1.md`.

---

### 1.3 Agency

- Path: `/operator/agents`
- Config: `portal/config/agency.yaml`
- Loader: `portal/src/lib/agencyConfig.ts`

What it shows:

- **Owner** block:
  - Name, handle, and root NH (`1.0`).
  - Schema version badge (e.g. `schema v0.1`).

- **Agents table**:
  - NH (with parent NH suffix when present).
  - Agent label + id (e.g. `JAI Operator` / `jai-operator`).
  - Tier chip:
    - Tier 0 = emerald
    - Tier 1 = sky
    - Tier 2+ = purple
  - Role, scope (repos or domains), delegates_to, GitHub labels.

- **Delegation rules**:
  - Current `default` rule:
    - Delegations flow down the NH tree.
    - Cross-branch communication goes through `1.0` (Operator).
    - No agent may create active work outside its scope.
    - Every significant delegation should be a GitHub issue + SoT event.

Current agents (Q4 2025):

- `1.0` – `jai-operator` (Owner proxy, Tier 0)
- `1.1` – `jai-core` (Core Engine, Tier 0)
- `1.2` – `dev-portal` (Portal & SoT DB, Tier 0)
- `2.1` – `offbook-owner` (OffBook v0, Tier 1)

Config is strictly typed by `AgencyConfig` in `src/lib/agencyConfig.ts`.

---

### 1.4 Projects

- Path: `/operator/projects`
- Config: `portal/config/projects.yaml`
- Loader: `portal/src/lib/projectsConfig.ts`

What it shows:

- Header:
  - Total project count.
  - Schema version badge (`schema v0.1`).

- Projects table (sorted by tier + NH):

Columns:

- **NH** – `root_nh_id`
- **Project** – name + `project_id`
- **Tier**:
  - 0: emerald chip (Tier 0)
  - 1: sky chip (Tier 1)
  - 2+: purple chip
- **Status** – `active`, `planned`, `frozen`, etc. (colored chip).
- **Repo** – GitHub `owner/repo`.
- **Owner agent** – `owner_agent_nh_id` (ties to Agency).
- **Description** – human-readable summary.

Current entries (Q4 2025):

- `1.1 / jai-core.v0` – **JAI Core Engine v0**
- `1.2 / dev-portal.v0` – **Dev JAI Nexus Portal v0**
- `1.3 / jai-autopilot.v0` – **JAI Autopilot Agent v0** (planned)
- `2.1 / offbook.v0` – **OffBook.ai v0**
- `2.2 / teacher-copilot.sandbox` – **Teacher Copilot Sandbox** (frozen)

This file is the **registry** connecting NH roots → repos → tiers.

---

## 2. Key config + code files

- `config/agency.yaml` – NH Agency config (owner + agents + delegation rules).
- `config/projects.yaml` – Project registry.
- `src/lib/agencyConfig.ts` – typed loader for Agency YAML.
- `src/lib/projectsConfig.ts` – typed loader for Projects YAML.
- `src/app/operator/layout.tsx` – Operator layout with sub-nav:
  - Tabs for **Events / Agents / Projects**.
- `src/app/operator/page.tsx` – Operator home dashboard (cards).
- `src/app/operator/events/page.tsx` – Operator view of the SoT stream.
- `src/app/operator/agents/page.tsx` – Agency table.
- `src/app/operator/projects/page.tsx` – Project registry UI.
- `docs/autopilot-v0-contract.md` – SoT event contract for Autopilot v0.
- `docs/offbook-v0-design.md` – OffBook v0 design anchor.
- `docs/q4-2025-audit-report.md` – Q4 audit document.

---

## 3. Autopilot v0 (planned)

**NH root:** `1.3`  
**Project:** `jai-autopilot.v0`  
**Repo (planned):** `JerryIngram/jai-autopilot-win`

Contract summary (see `docs/autopilot-v0-contract.md`):

- Local Windows agent that:
  - Runs `npm run build` / `npm test` etc. for tracked repos.
  - Watches for failures.
  - Calls LLMs to propose fixes.
  - Emits SoT events back into dev.jai.nexus.

Key SoT event kinds:

- `AUTOPILOT_PROJECT_REGISTERED`
- `AUTOPILOT_BUILD_STARTED`
- `AUTOPILOT_BUILD_FAILED`
- `AUTOPILOT_BUILD_SUCCEEDED`

At Q4 2025:

- Project is **registered** in the SoT DB.
- Contract is documented.
- Implementation in `jai-autopilot-win` is **not started yet** (planned Tier-0 work for Q1 ’26).

---

## 4. How to run this locally

From `dev-jai-nexus/portal`:

```bash
# Install deps
npm install

# Start dev server
npm run dev   # http://localhost:3000

# Build + test production build
npm run build
npm start
