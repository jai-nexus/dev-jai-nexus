# RFC-JAI-CONTEXT-API-v0.1

**Status:** draft  
**Owner:** JAI NEXUS · dev.jai.nexus  
**Scope:** Workspace context for JAI agents

## 1. Purpose

The JAI Context API exposes the **poly-repo workspace** for JAI agents and operator tools.

Goals:

- Single, canonical source of truth for **which repos exist** and where they live.
- Fast listing of **files per repo**, with basic metadata.
- Safe way to **read file content** given a relative path.
- Stable contract that can be wired into JAI agents (ChatGPT custom GPT, future Pilot, etc.).

This is **read-only** in v0.1.

---

## 2. Base URL

Local dev:

- `http://localhost:3000/api`

Production (future):

- `https://dev.jai.nexus/api` (TBD)

All endpoints below are relative to `/api`.

---

## 3. Endpoints

### 3.1 `GET /repos`

List active repos known to dev.jai.nexus.

**Request**

- No query params.

**Response**

```ts
type RepoSummary = {
  id: number;
  nhId: string;
  name: string;          // e.g. "jai-nexus/dev-jai-nexus"
  domainPod: string | null;
  engineGroup: string | null;
  status: string | null; // "ACTIVE", "SLEEPING", etc.
  githubUrl: string | null;
  defaultBranch: string | null;
};
