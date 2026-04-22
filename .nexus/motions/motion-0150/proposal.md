# Proposal: JAI Agent Dispatch Runtime Minimum v0

**Motion:** motion-0150
**Kind:** builder-proof
**Program:** q2-agent-operationalization-v0
**Date:** 2026-04-22
**Basis:** motion-0149 (JAI Canon Review and Maintenance Guidance v0)

---

## Current repo framing

Motions 0134–0149 are merged baseline. The governance canon stack, constraint stack, and
review/maintenance guidance are settled. The repo has:

- Named model slots in `.nexus/model-slots.yaml` — 30 slots across 5 roles (BUILDER,
  ARCHITECT, VERIFIER, LIBRARIAN, OPERATOR), all pointing to `openai / gpt-5`
- Agent panels in `.nexus/agent-panels.yaml` — 5 panels with candidate slots and deferred
  selectors
- Role-specific dispatch entry points in `portal/scripts/` — `run-builder-once.ts`,
  `run-architect-once.ts`, `run-verifier-once.ts` — each dispatching by `agentNhId`
  through the DB-mediated work packet system (`BuilderAgentRuntime`, `BaseAgentRuntime`)
- An existing work packet runtime (`portal/src/lib/agentRuntime.ts`,
  `portal/src/lib/work/builderRuntime.ts`) that reads motion context from
  `.nexus/motions/` and routes DB-backed work packets

No agent has executed a bounded repo task end-to-end through runtime code. The workflow
is still manual even though the infrastructure was built to support agents. Config presence
is not operational capability.

---

## Problem

Five gaps block the first agent dispatch proof:

**1. No slot-to-provider resolution path.**
`.nexus/model-slots.yaml` defines provider and model for each slot (e.g.,
`SLOT_BUILDER_01: provider: openai, model: gpt-5`) but there is no code path that reads
a named slot from this config and uses it to make a real provider API call. The existing
dispatch entry points (`run-builder-once.ts`) dispatch by `agentNhId` through the DB
work packet queue, not by slot name. Config-to-dispatch translation is not implemented.

**2. No standalone bounded task contract.**
The existing BUILDER dispatch passes `execution.md` contents as the execution plan via
DB-mediated packet routing. There is no standalone task contract that specifies — as a
self-describing durable artifact — the dispatch slot, task scope, output artifact
expectation, and human-review checkpoint. Without a standalone contract, a dispatch run
is not self-describing and cannot be audited independently of the DB state.

**3. No durable run ledger.**
There is no file-based ledger recording what ran, what slot and provider were used, what
output was produced, and what the human review status is. DB state is not portable or
directly reviewable by the operator without running a query. First dispatch proof requires
a durable, human-readable artifact that survives the session.

**4. No legible failure states for dispatch.**
If dispatch fails — provider auth error, model identifier not recognized, API timeout,
empty work packet queue — the failure is logged to the console but not captured in a
durable, reviewable artifact. Operators cannot diagnose and retry without re-running the
script and observing output live.

**5. No first dispatch proof record.**
No agent-dispatched run exists in this repo's history that used a real provider API call,
produced a durable output artifact, and has a human-reviewed result. The first dispatch
proof closes all four gaps above and establishes the minimum operational baseline.

---

## Solution

### Runtime minimum definition

The JAI Agent Dispatch Runtime Minimum is the smallest working path from operator
invocation to one verified agent output, using one non-selector executor slot from
`.nexus/model-slots.yaml`, one real provider API call, one bounded task contract, and
one durable run record — all under operator invocation only, with no autonomous loop
and no automatic commit, PR, or merge.

Config presence is not proof of dispatch capability. Operational proof requires:
1. Slot config read and resolved to provider + model
2. Real provider API call made (not stubbed)
3. Bounded task contract passed to the dispatched agent
4. Output artifact captured at a defined path
5. Run record written to the run ledger with all required fields
6. Failure states produce a legible run record, not a silent console exit
7. Operator reviews result before ratification

### Exact runtime scope

**In scope:**
- One non-selector executor slot: `SLOT_BUILDER_01` (provider: openai, model: gpt-5) from
  `.nexus/model-slots.yaml`. Selector slots (`SLOT_BUILDER_SELECTOR`, etc.) are excluded —
  selector logic remains deferred per current agent-panels.yaml config.
- One provider path: openai. No multi-provider dispatch in this motion.
- One dispatch entry point: an operator-invoked script (`run-slot-dispatch.ts` or
  equivalent) that reads the slot config, resolves provider + model, and dispatches with a
  bounded task contract.
- One bounded task contract: specifies run ID, slot name, motion reference, scoped task
  description, output artifact path, and human-review-required flag.
- One run ledger append: each dispatch run appends a record to a file-based ledger at a
  defined path under `surfaces/agent-ops/`.
- Legible failure recording: dispatch failures write a failure record to the run ledger
  with a diagnostic note, not a bare console exit.

**Out of scope:**
- Selector logic or panel scoring
- Multi-provider dispatch
- Autonomous scheduling or looping
- Automatic commit, PR, or merge of agent output
- Cross-repo writes
- Modification of the existing DB-mediated work packet system
- Modification of `portal/src/lib/agentRuntime.ts` or existing `run-*-once.ts` scripts

### Sub-line A — Slot dispatch runtime module and operator entry point

Add `portal/src/lib/slotDispatch.ts` — a minimal module that:
- Reads a named slot from `.nexus/model-slots.yaml`
- Verifies the slot is not a selector slot (selector slots are excluded)
- Resolves provider and model identifiers
- Accepts a bounded task contract and calls the provider API
- Returns a dispatch result (success with output, or failure with diagnostic note)
- Does not modify the DB work packet system

Add `portal/scripts/run-slot-dispatch.ts` — an operator-invoked entry point that:
- Accepts `--slot <SLOT_NAME>`, `--motion <motionId>`, and `--scope <statement>` as arguments
- `--scope` is required and operator-supplied; it is not derived from `execution.md`
- Reads slot config from `.nexus/model-slots.yaml`
- Constructs a bounded task contract using the operator-supplied scope
- Calls `slotDispatch` and captures the result
- Writes a run record to the run ledger
- Prints the result and run ledger path to stdout

### Sub-line B — Bounded task contract shape

Add `portal/src/types/taskContract.ts` — a TypeScript type definition for the bounded
task contract passed to the dispatched agent:

```
TaskContract {
  run_id:                 string  // unique dispatch run identifier
  slot:                   string  // slot name (e.g. SLOT_BUILDER_01)
  provider:               string  // resolved provider (e.g. openai)
  model:                  string  // resolved model identifier
  motion_id:              string  // motion this dispatch executes under
  scope:                  string  // bounded task description (max 500 chars)
  output_artifact_path:   string  // where to write the output artifact
  human_review_required:  true    // always true for dispatches under this motion
}
```

The task contract is self-describing: a run record can be audited without querying the DB.

### Sub-line C — Durable run ledger

Add `portal/src/lib/runLedger.ts` — a module that appends run records to a YAML file at
`surfaces/agent-ops/run-ledger.yaml`. Each run record contains:

```
run_id:                 string
ts:                     ISO 8601 timestamp
slot:                   string
provider:               string
model:                  string
motion_id:              string
scope_summary:          string (first 120 chars of scope)
output_artifact_path:   string | null
result_status:          "success" | "failure" | "partial"
failure_note:           string | null
human_review_status:    "pending" | "reviewed" | "approved" | "rejected"
```

The ledger file is human-readable and operator-reviewable without tooling.

### Config-to-dispatch translation guidance

Config presence is not operational capability. The dispatch path must explicitly:
1. Read the slot config entry (provider + model)
2. Verify provider credentials are available (environment variable check, not embedded);
   record a legible failure note if credentials are absent before attempting the API call
3. Attempt the provider API call; treat unrecognized model identifier as a legible dispatch
   failure — record `result_status: failure` with `failure_note` naming the unrecognized
   model ID. Do not require a pre-dispatch model verification call.
4. Capture success output or failure note as a `DispatchResult` — never a silent console exit

The motivation: `model-slots.yaml` currently specifies `gpt-5` for all slots. If this
model ID is not recognized by the provider API, the dispatch will fail. That failure must
be captured in a legible run record, not treated as a blocking precondition that prevents
the dispatch attempt.

### Acceptance path for first dispatch success

Motion-0150 is complete when all of the following are true:

1. `run-slot-dispatch.ts` (or equivalent) resolves `SLOT_BUILDER_01` from
   `.nexus/model-slots.yaml` and uses provider=openai at dispatch time
2. A real provider API call is made — not stubbed, not mocked
3. A bounded task contract under a real motion reference is passed to the dispatched agent
4. The agent produces output captured at `surfaces/agent-ops/<run_id>_output.md`
   (or equivalent defined path)
5. A run record is appended to `surfaces/agent-ops/run-ledger.yaml`
6. A dispatch failure (auth error, model not found, timeout) produces a run record with
   `result_status: failure` and a `failure_note` — not a bare console exit
7. The operator reviews the output artifact and run record before ratification
8. Governance gates pass: validate-motion, validate-agency, typecheck

### Boundary rules

Motion-0150 does not:
- Introduce autonomous loop, scheduling, or background orchestration
- Introduce automatic commit, PR, or merge of agent output
- Introduce controller or autopilot behavior
- Perform cross-repo writes
- Override settled governance execution boundaries
- Modify the existing DB-mediated work packet system
  (`agentRuntime.ts`, `builderRuntime.ts`, `run-builder-once.ts`, etc.)
- Wire selector logic (selectors remain deferred)
- Attempt multi-provider dispatch before single-provider is proved
- Override the explicit/manual council-run boundary

Runtime mutation is bounded to the minimum needed for first dispatch proof:
- One run ledger append per dispatch invocation
- One output artifact file per dispatch invocation

---

## Success criteria

- **SC-1** `portal/src/lib/slotDispatch.ts` exists; reads a named slot from
  `.nexus/model-slots.yaml`; excludes selector slots; resolves provider + model; calls
  provider API with a bounded task contract; returns legible result or failure note
- **SC-2** `portal/scripts/run-slot-dispatch.ts` exists; accepts `--slot`, `--motion`,
  and `--scope` args (`--scope` is required and operator-supplied, not derived from
  execution.md); reads slot config; constructs TaskContract; calls slotDispatch; writes
  run record; prints result to stdout
- **SC-3** `portal/src/types/taskContract.ts` exists; defines `TaskContract` with the
  seven required fields including `human_review_required: true`
- **SC-4** `portal/src/lib/runLedger.ts` exists; appends run records to
  `surfaces/agent-ops/run-ledger.yaml`; covers all nine run record fields
- **SC-5** A real dispatch has been executed against `SLOT_BUILDER_01` (not stubbed);
  output artifact exists at `surfaces/agent-ops/<run_id>_output.md`; run record exists
  in `surfaces/agent-ops/run-ledger.yaml`; operator has reviewed the result
- **SC-6** `validate-motion` passes for motion-0150
- **SC-7** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-8** `pnpm typecheck` passes
- **SC-9** No existing work packet runtime, operator UI, or DB schema modified

---

## Non-goals

- Multi-provider dispatch
- Selector logic or panel scoring
- Autonomous scheduling or looping
- Automatic commit, PR, or merge of agent output
- Background orchestration
- Cross-repo writes
- Modifying the existing DB-mediated work packet system
- Widening to full agent workflow automation
- Runtime enforcement layer
- Treating config presence as proof of operational capability
- Pi/runtime, Live Ops, telemetry, notification, or collaboration system widening
