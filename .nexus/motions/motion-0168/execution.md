# Execution: JAI Agent Deliberation Panel v0

**Motion:** motion-0168
**Kind:** builder-proof
**Program:** q2-agent-deliberation-panel-v0
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/src/lib/controlPlane/types.ts`
- `portal/src/lib/controlPlane/repoSurfaceModel.ts`
- `portal/src/lib/agents/deliberationTypes.ts`
- `portal/src/lib/agents/deliberationPanel.ts`
- `portal/src/app/operator/deliberation/page.tsx`
- `portal/src/components/operator/OperatorSubnav.tsx`
- `.nexus/motions/motion-0168/**`

---

## Ratified evidence record

The advisory-only deliberation panel now exists at `/operator/deliberation`.
It is deterministic, static, and read-only.

### Participating agents

Participating agents are loaded directly from the configuration-only Agent
Registry:

- `jai-orchestrator`
- `jai-builder`
- `jai-verifier`
- `jai-librarian`
- `jai-landing-page-agent`
- `jai-customer-portal-agent`
- `jai-governance-agent`

Shared alias `agent@jai.nexus` is not treated as a participating execution
identity.

### Candidate actions included

Nine advisory candidates are present, covering all required source kinds:

From work packets:

- `candidate-wp-landing-homepage-refresh`
- `candidate-wp-customer-intake-map`
- `candidate-wp-agent-registry-follow-up`
- `candidate-wp-api-contract-review`

From projects:

- `candidate-project-teacher-copilot-targeting`

From manual candidates:

- `candidate-manual-customer-portal-copy-pass`

From motions:

- `candidate-motion-0167-follow-up`

From planned toolchain targets:

- `candidate-toolchain-jai-pilot-handoff`
- `candidate-toolchain-vscode-nexus-handoff`

### Repo/surface/project targeting evidence

Every candidate resolves to the existing control-plane model:

- repo = actual GitHub repository
- surface = named product/operator area inside that repo
- project = optional workstream overlay

Observed examples:

- landing-page candidate -> `jai-nexus/jai-nexus` + `Landing page` + `jai-internal`
- customer-portal candidate -> `jai-nexus/jai-nexus` + `Customer portal` + `jai-internal`
- motion follow-up candidate -> `jai-nexus/dev-jai-nexus` + `Operator deliberation` + `jai-internal`
- planned toolchain candidates -> `jai-nexus/dev-jai-nexus` + `Operator deliberation` + `jai-internal`

### Planned toolchain target posture

`jai-pilot` and `vscode-nexus` are represented only as planned toolchain
targets.

They are not:

- integrated
- executable
- dispatchable
- credential-enabled
- connected to branch write or PR creation

Both planned toolchain candidates produce `planned only` consensus labels and
copy-only next-step prompts.

### Advisory vote and consensus behavior

Each candidate renders:

- per-agent reasoning
- a non-binding advisory vote
- a consensus summary
- a copy-only next repo/chat prompt

Vote states are:

- `support`
- `support_with_caution`
- `defer`
- `out_of_scope`

Consensus labels observed:

- `advisory support`
- `caution`
- `planned only`

All votes are explicitly non-binding and do not authorize execution or repo
mutation.

### Acceptance evidence

Acceptance checks `DP-01` through `DP-18` passed:

- `DP-01` `/operator/deliberation` route renders
- `DP-02` Operator subnav includes Deliberation
- `DP-03` participating agents are loaded from Agent Registry
- `DP-04` candidate actions are tied to repo + surface + project/work packet model
- `DP-05` per-agent advisory reasoning is visible
- `DP-06` advisory votes are visible
- `DP-07` consensus summary is visible
- `DP-08` operator next-step prompt is generated as copy-only text
- `DP-09` votes are explicitly non-binding
- `DP-10` no run/dispatch/execute controls exist
- `DP-11` no branch write or PR creation controls exist
- `DP-12` no API route or DB mutation was added
- `DP-13` no runtime or proof files changed
- `DP-14` no existing motions were modified
- `DP-15` no credentials or secret values are displayed
- `DP-16` `pnpm -C portal typecheck` passed
- `DP-17` `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0168/motion.yaml` passed
- `DP-18` `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed

### Guardrails preserved

- no execution
- no branch writes
- no PR creation
- no dispatch
- no scheduler
- no DB writes
- no API mutation
- no credentials or secret values
- no runtime changes
- no cross-repo mutation
- no auto-created motions
- no auto-ratification
- no live LLM calls
- no jai-pilot or vscode-nexus integration

### Caveats

- No browser or manual UI smoke test was run in this turn.
- Advisory votes are deterministic heuristics derived from current configured
  scope and capability posture; they are intentionally non-binding.
