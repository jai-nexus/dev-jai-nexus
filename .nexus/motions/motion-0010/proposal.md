# Proposal (motion-0010)

## 0.0 Problem
We want the best decisions and implementations to emerge from JAI Agents, not from the human alone.
Today, each role effectively maps to a single model, which creates a monoculture and limits the system’s ability to:
- surface diverse approaches
- stress test assumptions
- upgrade models over time without refactoring the agent layer

## 1.0 Goal
Introduce a canonical “Agent Panel” concept:
- each role can have 5 “model variables” (candidate slots)
- a separate selector variable chooses the best output from candidates
- all selection is recorded so it stays defensible and auditable

## 2.0 Definitions
### 2.1 Model Slot
A named variable that resolves to a provider+model+version string (swappable over time).
Example: SLOT_BUILDER_01 = (provider=?, model=?, notes=?)

### 2.2 Agent Panel
A role-level configuration:
- role_id (e.g., JAI::DEV::BUILDER)
- candidates: 5 model slots
- selector: 1 model slot (or selector role mapping)
- selection rubric: deterministic scoring criteria

### 2.3 Selection Record
A durable artifact that stores:
- candidate outputs (or hashes/refs)
- selector scoring + rationale
- final chosen output
This prevents “silent railroading” and makes decisions defendable.

## 3.0 Solution (v0)
Ratify two new canonical config files under `.nexus/`:

1) `.nexus/model-slots.yaml`
- declares named slots (variables)
- allows swapping providers/models over time without changing role identity

2) `.nexus/agent-panels.yaml`
- declares which roles use panels
- defines 5 candidates + 1 selector + rubric
- starts with JAI::DEV::BUILDER as the first panel

No LLM API orchestration is required in this motion; this is a schema + canon move.
A future motion will implement an automated “panel runner” that executes candidates and writes selection records.

## 4.0 Scope
- Add `.nexus/model-slots.yaml` (new)
- Add `.nexus/agent-panels.yaml` (new)
- (Optional) Add a short doc note in `.nexus/` describing selection record format (v0)

## 5.0 Acceptance Criteria
- The two files exist at the exact paths and parse as YAML
- Builder panel is defined with 5 candidates and 1 selector
- Rubric is explicit and stable (weights sum to 1.00)
- Spec does not require any secrets or API keys

## 6.0 Next Actions
- Execute motion-0010 (create the config files)
- Later: create motion-0011 to implement the automated multi-model panel runner and selection record emission
