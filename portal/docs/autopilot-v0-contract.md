# Autopilot v0 · SoT Contract

**NH root:** `1.3`  
**Project:** `jai-autopilot.v0`  
**Repo:** `jai-nexus/jai-autopilot-win`  
**Status:** `active` (demo / local-only)

Autopilot v0 is a **local Windows build agent**:

- Runs `npm run build` (or other scripts) for a configured repo.
- Reports start / success / failure into the SoT DB.
- Uses the `sot-event-0.1` envelope and the `/api/sot-events` endpoint
  on `dev.jai.nexus` (`portal` app).

This contract defines the **event kinds**, **payloads**, and **usage pattern**
for Autopilot v0.

---

## 1. Envelope

All Autopilot events use the standard SoT envelope v0.1:

- `version` — literal `"sot-event-0.1"`
- `ts` — ISO8601 UTC timestamp **when the event happened**
- `source` — `"jai-autopilot-win"`
- `kind` — one of the Autopilot kinds (below)
- `summary` — short human-readable description
- `payload` — opaque JSON (see suggestions below)

Optional metadata:

- `nhId` — `"1.3"` (NH root for `jai-autopilot.v0`)
- `repoName` — tracked repo (e.g. `"jai-nexus/dev-jai-nexus"`)
- `domainName` — not used in v0
- `tags` — not used in v0, reserved for future filters

SoT base spec: see `docs/sot-event-v0.1.md`.

---

## 2. Event kinds

Autopilot v0 uses four event kinds:

- `AUTOPILOT_PROJECT_REGISTERED`
- `AUTOPILOT_BUILD_STARTED`
- `AUTOPILOT_BUILD_FAILED`
- `AUTOPILOT_BUILD_SUCCEEDED`

All are emitted with:

- `source = "jai-autopilot-win"`
- `nhId = "1.3"`

### 2.1 `AUTOPILOT_PROJECT_REGISTERED`

**When:**  
Project `jai-autopilot.v0` is registered / updated in the system.

**Example:**

```json
{
  "version": "sot-event-0.1",
  "ts": "2025-12-06T00:06:01.636Z",
  "source": "jai-autopilot-win",
  "kind": "AUTOPILOT_PROJECT_REGISTERED",
  "summary": "Autopilot project jai-autopilot.v0 registered for jai-nexus/dev-jai-nexus",
  "nhId": "1.3",
  "payload": {
    "projectId": "jai-autopilot.v0",
    "repoName": "jai-nexus/dev-jai-nexus",
    "nhRoot": "1.3",
    "notes": "Local Windows build agent; demo v0.1"
  }
}
