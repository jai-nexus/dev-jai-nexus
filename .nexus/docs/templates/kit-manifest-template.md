# Kit Manifest Template

Use this template when a selecting session needs to declare one workflow kit for a
concrete cross-layer sequence.

This template instantiates `workflow-kit-model.md`. It does not redefine the kit
catalog, dispatch sessions, execute work, or advance the workflow by itself.

---

## Instantiation context

- selecting session role: `{CONTROL_THREAD | ORCHESTRATOR | REPO_EXECUTION | EXPLORATION}`
- repo or program context: `{bounded context for this selection}`
- date: `{YYYY-MM-DD}`
- reference motion or branch if relevant: `{motion-XXXX | branch-name | n/a}`

---

## Selected kit

- selected kit: `{normal delivery loop | exploration-first loop | deferred / hold loop | governance-readiness review loop}`
- why this kit is being used now: `{one sentence}`

---

## Entry condition

- observed entry condition: `{what made this kit appropriate}`
- why nearby kits were not chosen: `{one sentence}`

---

## Role chain

List the actual role sequence for this instantiation.

1. `{role}`
2. `{role}`
3. `{role}`
4. `{role if applicable}`
5. `{role if applicable}`

---

## Required artifacts

List the artifacts that must be present for this instantiation.

- `{artifact path or artifact type}`
- `{artifact path or artifact type}`
- `{artifact path or artifact type}`

---

## Optional branches

List only branches that remain valid inside the selected kit.

- `{optional branch}`
- `{condition for using it}`

Use `none` when no optional branch is expected.

---

## Deferred outcomes

Describe how deferred or hold outcomes would be recorded if this instantiation
cannot close in the current cycle.

- deferred shape: `{what remains open}`
- recording rule: `{where the deferred state is recorded}`

Use `none expected` when deferral is not currently anticipated.

---

## Sync-back endpoint

- receiving role: `{CONTROL_THREAD | n/a}`
- closure artifact or continuity record: `{sync-back record | continuity update | n/a}`
- closure condition: `{what must be true before the kit is treated as closed}`

---

## State carried

Record how the seven settled state buckets will be carried through this
instantiation.

| State bucket | How it is carried in this instantiation |
|---|---|
| current baseline | `{required | compressed | n/a}` |
| what is settled | `{required | compressed | n/a}` |
| what remains open | `{required | compressed | n/a}` |
| tasks | `{required | compressed | n/a}` |
| risks | `{required | compressed | n/a}` |
| routing targets | `{required | compressed | n/a}` |
| next prompts | `{required | compressed | n/a}` |

Compression is valid only when the receiving session can still reconstruct the
needed continuity.

---

## Governance constraints

List the governance constraints that remain in force for this instantiation.

- `{constraint}`
- `{constraint}`
- `{constraint}`

---

## Keep-out-of-scope constraints

List what this selected kit does not authorize in this specific case.

- `{constraint}`
- `{constraint}`
- `{constraint}`

This manifest records a chosen guide. It does not dispatch or execute sessions.
