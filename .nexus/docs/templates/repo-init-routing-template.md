# Repo Init Routing Template

Use this template when an orchestrator session needs to package the opening
context for a fresh repo thread.

This package launches a fresh repo thread in documentary form only. It does not
execute work, mutate the repo, or trigger any runtime process.

Required:

- repo baseline
- settled canon
- active seam
- request
- return shape
- keep-out-of-scope constraints

Optional:

- receiving execution role when that role is already known

---

## Repo baseline

Required:

- repo name: `{repo}`
- domain: `{domain}`
- current branch: `{branch}`
- last commit: `{hash + subject or placeholder}`
- working tree state: `{clean | dirty | unknown with note}`

This section frames where the fresh repo thread begins.

---

## Settled canon

Required:

- relevant ratified motions: `{list}`
- active template or schema versions: `{list}`
- active canon docs the receiving session should anchor to: `{paths}`

Only include canon that materially shapes the receiving seam.

---

## Active seam

Required:

- intended motion or placeholder motion id: `{motion-XXXX}`
- bounded seam description: `{one sentence}`
- receiving coordination mode: `{REPO_EXECUTION | EXPLORATION | CONTROL_THREAD}`

Optional:

- receiving execution role: `{BUILDER | ARCHITECT | VERIFIER | OPERATOR | LIBRARIAN}`

---

## Request

Required:

- one sentence stating exactly what the fresh repo thread is being asked to do

The request should be bounded and non-automated.

---

## Return shape

Required:

- expected outputs / artifacts:
  - `{artifact}`
  - `{artifact}`
- expected governance state change, if any:
  - `{state change or "none at init stage"}`

This section defines what the receiving thread should return in documentary terms.

---

## Keep-out-of-scope constraints

Required:

- paths that must not change:
  - `{path}`
  - `{path}`
- governance artifacts that must not be mutated:
  - `{artifact}`
  - `{artifact}`
- actions not authorized:
  - `{action}`
  - `{action}`

Use explicit boundary language. Keep-out constraints should be concrete enough to
survive handoff without reinterpretation.
