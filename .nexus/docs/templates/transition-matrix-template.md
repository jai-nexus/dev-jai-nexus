# Transition Matrix Template

Use this template to document a concrete workflow-composition scenario using the
framework defined in `workflow-composition-model.md`.

This template instantiates the model. It does not redefine role semantics,
transition semantics, or governance rules.

The matrix is documentary only. It is not an enforcement artifact or runtime
schema.

---

## Current context

Required:

- current scenario: `{one-sentence workflow context}`
- relevant repo or program framing: `{what the chain is about}`
- active boundary: `{what is already settled and what is not}`

Optional:

- placeholder motion or branch references if needed for clarity

---

## Involved roles

Required:

- coordination roles in scope:
  - `{CONTROL_THREAD}`
  - `{ORCHESTRATOR}`
  - `{REPO_EXECUTION}`
  - `{EXPLORATION}`

Only list the roles actually involved in the scenario.

---

## Normal transitions

Document each normal transition used in the scenario.

- source: `{role}`
- target: `{role}`
- why normal here: `{one sentence}`

Repeat per transition as needed.

---

## Optional transitions

Document valid but non-required transitions used or considered in the scenario.

- source: `{role}`
- target: `{role}`
- why optional here: `{one sentence}`

Repeat per transition as needed.

---

## Discouraged transitions

Document known problematic transitions relevant to this scenario, even if they are
not being used.

- source: `{role}`
- target: `{role}`
- why discouraged here: `{one sentence}`

Repeat per transition as needed.

---

## Prohibited transitions

Document transitions that must not be used in this scenario.

- source: `{role}`
- target: `{role}`
- why prohibited here: `{one sentence}`

Repeat per transition as needed.

---

## State carried across handoffs

For each handoff, state whether the following buckets must be present:

| Handoff | Current baseline | What is settled | What remains open | Tasks | Risks | Routing targets | Next prompts | Notes |
|---|---|---|---|---|---|---|---|---|
| `{source -> target}` | `{required | compressed | n/a}` | `{required | compressed | n/a}` | `{required | compressed | n/a}` | `{required | compressed | n/a}` | `{required | compressed | n/a}` | `{required | compressed | n/a}` | `{required | compressed | n/a}` | `{continuity note}` |

Use `compressed` only when the receiving session can still reconstruct the required
continuity.

---

## Governance constraints

Required:

- `{constraint that applies regardless of transition class}`
- `{constraint that applies regardless of transition class}`

This section captures boundary rules that remain in force no matter which
transition is active.
