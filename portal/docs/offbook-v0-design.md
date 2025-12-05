---
project_id: offbook.v0
root_nh_id: "2.1"
tier: 1
status: active
repo: jai-nexus/offbook-ai
owner_agent_nh_id: "2.1"
---

# OffBook.ai v0 – Design

## 1. Problem

OffBook is a tool for actors, writers, and directors who need to
memorize and iterate on scripts. v0 is **not** the full vision; it is
a minimal, reliable workflow that proves the core loop:

> Load a script → create scenes/lines → rehearse → track progress.

## 2. v0 Goals

For v0, OffBook should:

- Accept a script (start with text upload or paste).
- Let the user define scenes and roles.
- Provide a basic “run lines” interface (even CLI or minimal web UI).
- Track simple session history (what was rehearsed, when).

Non-goals for v0:

- No marketplace, licensing, or payments.
- No multi-tenant orgs, casting, or recording studio.
- No complex RAG/memory infra beyond what is absolutely needed.

## 3. Architecture (v0)

- **Client**: simple UI (can be a barebones Next.js page or CLI).
- **Backend**: minimal OffBook API (could live in `offbook-ai` repo).
- **Storage**:
  - scripts/scenes: simplest persistent store you’re comfortable with
    (e.g., Postgres or even JSON files at first),
  - sessions: stored and mirrored into JAI SoT via events.

## 4. SoT Integration

OffBook v0 participates in the JAI SoT stream via these event types:

- `OFFBOOK_PROJECT_ANCHORED`
- `OFFBOOK_TASK_CREATED`
- `OFFBOOK_SESSION_LOGGED`

Each event uses the SotEvent v0.1 envelope and includes:

- `nhId`: `"2.1"` (OffBook owner agent),
- `repoName`: `"jai-nexus/offbook-ai"`,
- `domainName`: `"offbook.ai"` (or similar),
- `payload`: project/task/session details.

## 5. v0 Deliverables

To call v0 “real”, OffBook must have:

1. **Repo hygiene**
   - README that explains what OffBook is and how to run v0.
   - Clear note that it is owned by NH `2.1` and Tier-1 in the registry.

2. **Working flow**
   - Ability to create/load a script.
   - Ability to define at least one scene and role.
   - Ability to run a rehearsal session and see feedback (even just a log).

3. **SoT events**
   - At least one `OFFBOOK_PROJECT_ANCHORED` event.
   - At least one `OFFBOOK_TASK_CREATED` event (e.g., “implement v0 rehearsal loop”).
   - At least one `OFFBOOK_SESSION_LOGGED` event from an actual session.

## 6. Phasing

- **M0 – Anchor (now)**
  - Design doc created (this file).
  - Entry exists in `config/projects.yaml` as `offbook.v0`.
  - SoT “project anchored” event emitted.

- **M1 – Usable v0**
  - Basic end-to-end rehearsal loop working.
  - Sessions logged and visible in SoT via dev-jai-nexus portal.

- **M2 – Polished v0**
  - UI cleaned up, better prompts, nicer UX.
  - Decision made on next major feature (or pause OffBook and refocus).

