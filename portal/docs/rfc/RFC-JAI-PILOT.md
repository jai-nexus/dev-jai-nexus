# RFC: JAI PILOT – Browser + Autopilot + Scene Graph

## 0. Status

- Status: DRAFT
- Target Wave: TBD (suggest WAVE 7+)
- Owner: admin@jai.nexus
- Scope: Define the architecture and SoT contracts for JAI Pilot:
  - Browser + Autopilot modes
  - Scene Graph representation
  - Integration with Projects, Waves, Chat, and Inbox

---

## 1. Problem

JAI NEXUS currently has:

- A growing **SoT** (Waves, JAI INDEX, Repo + FileIndex, Inbox).
- A conceptual **JAI Browser** (control plane UI).
- The idea of **Autopilot** (JAI taking actions on UI / systems).

What’s missing is a unified, governed way for JAI to:

1. **See** an environment (web page, dev console, VR cockpit) in a structured way.
2. **Plan** actions in the context of Projects, Waves, and NH_IDs.
3. **Act** in two modes:
   - Guide (suggested actions, user executes).
   - Autopilot (JAI executes).

We need a single abstraction and event model for this.

---

## 2. Goals & Non-Goals

### 2.1 Goals

- Define **JAI Pilot** as one system with multiple modes:
  - `observer` – read-only perception.
  - `guide` – JAI suggests actions, human executes.
  - `autopilot` – JAI issues actions directly.
- Introduce a **Scene Graph** abstraction:
  - For web (DOM-as-Scene).
  - Future for VR / 360-degree workspaces (Room-as-Scene).
- Define **SoT contracts**:
  - `PilotSession` – a bounded pilot run.
  - `PilotAction` – individual actions (or suggested actions) within a session.
- Integrate Pilot with:
  - Projects,
  - Waves,
  - JAI INDEX (NH_ID),
  - Inbox,
  - Chat sessions.

### 2.2 Non-Goals (for this RFC)

- Implement actual browser automation.
- Implement VR rendering or input.
- Define network protocols or browser extension details.
- Choose concrete LLMs or tool APIs.

This RFC only defines **concepts, contracts, and minimal DB schema** so future code has a stable target.

---

## 3. Concepts

### 3.1 JAI Pilot

**JAI Pilot** is the perception–plan–act loop for JAI:

- **Perception:** Receive a structured Scene Graph (web DOM tree, terminal layout, VR room).
- **Planning:** Use JAI NEXUS SoT (Projects, Waves, INDEX, logs) to decide next steps.
- **Action:** Emit:
  - `guide` instructions for humans, or
  - `autopilot` commands for automation systems.

Pilot is always scoped to:

- A `Project` (or `null` for exploratory work).
- Optionally a `Wave`.
- Optionally one or more `NH_ID` contexts (JAI INDEX entries).

### 3.2 Modes

Pilot defines three operating modes:

1. **observer**
   - JAI receives the Scene Graph.
   - It may describe, summarize, or analyze.
   - It does **not** issue actions.
   - Use for safe exploration, debugging, or “what am I looking at?” questions.

2. **guide**
   - JAI receives the Scene Graph.
   - It emits **suggested actions**:
     - e.g. “Click button X”, “Paste Y into field Z”.
   - The human executes those actions.
   - The system still logs these as `PilotAction` with `mode = guide`, including rationale.

3. **autopilot**
   - JAI receives the Scene Graph.
   - It issues **direct actions**:
     - Clicks, types, scrolls, navigation, workspace adjustments.
   - A separate execution layer performs the actions.
   - Every action is logged as `PilotAction` with `mode = autopilot`, including rationale.

Mode can be switched mid-session (e.g., start in observer, escalate to guide, then autopilot, then back).

---

## 4. Scene Graph

### 4.1 Purpose

The Scene Graph is how JAI “sees” an environment. Instead of raw screenshots, JAI gets a **structured representation**:

- Nodes (elements/widgets/components),
- Hierarchy (parent/child relationships),
- Geometry (position/size),
- Semantics (labels, roles, types),
- Possible actions (click, type, open, close, move, etc.).

This allows:

- More reliable reasoning,
- Safer action planning,
- Potential portability between 2D (web) and 3D (VR).

### 4.2 Web Scene Graph (v0)

For web, the Scene Graph is a **compressed DOM** plus metadata.

Minimal conceptual shape (not final JSON schema):

```jsonc
{
  "surface": "web",
  "url": "https://dev.jai.nexus/operator/projects",
  "viewport": { "width": 1920, "height": 1080 },
  "nodes": [
    {
      "id": "node-1",
      "role": "nav",
      "tag": "nav",
      "label": "Main Navigation",
      "bounds": { "x": 0, "y": 0, "w": 1920, "h": 64 },
      "children": ["node-2", "node-3"]
    },
    {
      "id": "node-10",
      "role": "button",
      "tag": "button",
      "label": "Sync Repos",
      "selector": "#sync-button",
      "bounds": { "x": 1600, "y": 80, "w": 120, "h": 32 },
      "actions": [ "click" ]
    }
  ]
}
