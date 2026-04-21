# Exploration Outcome Template

Use this template to close a bounded exploration session and route its advisory
outcome to the appropriate next coordination surface.

Required:

- recommended direction
- deferred ideas
- what becomes active work
- routing target
- next prompt

This template is advisory and non-executing.

---

## Recommended direction

Required:

- one recommended option: `{name}`
- rationale: `{why this option is preferred over the others}`

The recommended direction should be singular. If there is no single recommendation,
the exploration has not closed cleanly.

---

## Deferred ideas

Required:

- deferred idea: `{name}` - reason: `{why it is not being pursued now}`
- deferred idea: `{name}` - reason: `{why it is not being pursued now}`

Keep deferred ideas explicit so they do not vanish from continuity.

---

## What becomes active work

Required:

- concrete active-work translation: `{what the recommendation becomes next}`

Use the shape that matches the routing target:

- if routing to `ORCHESTRATOR`: describe the candidate seam or next-motion
  recommendation that should now be packaged
- if routing to `REPO_EXECUTION`: describe the bounded motion or implementation
  scope that is now ready
- if routing to `CONTROL_THREAD`: describe the arc-level decision or continuity
  matter that now becomes active

---

## Routing target

Required:

- routing target: `{ORCHESTRATOR | REPO_EXECUTION | CONTROL_THREAD}`
- why this target: `{one-sentence reason}`

Hard rule:

- `ORCHESTRATOR` is the default routing target for exploration outcomes

Exception rule:

- routing directly to `REPO_EXECUTION` requires an explicit justification note
  stating why `ORCHESTRATOR` is being bypassed

If routing directly to `REPO_EXECUTION`, include:

- direct-routing justification: `{why no seam-selection decision remains}`

---

## Next prompt

Required:

- exact prompt starter: `{prompt}`

Optional:

- one additional prompt starter if the receiving session needs a backup framing

The next prompt should be usable by the receiving session without extra
interpretation.
