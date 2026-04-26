# Execution: JAI Agent Configuration Registry v0

**Motion:** motion-0164
**Kind:** builder-proof
**Program:** q2-agent-configuration-registry-v0
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/src/app/operator/agents/page.tsx`
- `portal/src/lib/agents/agentRegistry.ts`
- `portal/src/lib/agents/types.ts`
- `.nexus/motions/motion-0164/**`

---

## Ratified evidence record

The existing `/operator/agents` route was replaced with a configuration-only
registry surface. The route no longer presents delegation or execution actions.

The implemented registry distinguishes:

- human operator identity: `admin@jai.nexus`
- shared view-only alias: `agent@jai.nexus`
- named JAI agent identities configured for future execution posture only

Initial named JAI agent configurations included:

- `jai-orchestrator`
- `jai-builder`
- `jai-verifier`
- `jai-librarian`
- `jai-landing-page-agent`
- `jai-customer-portal-agent`
- `jai-governance-agent`

The route now renders:

- a configuration-only page header and execution-disabled posture banner
- identity-boundary cards for human and alias behavior
- named agent cards
- a capability matrix
- a repo-scope matrix
- credential posture cards showing env var names only

The capability model is intentionally narrow:

- `view_only`: enabled
- `draft_plan`: enabled
- `draft_files_preview`: preview_only
- `branch_write`: disabled
- `propose_pr`: disabled
- `execute_runtime`: disabled

Operator subnav already included `Agents`, so no subnav edit was required in
this seam.

---

## Acceptance evidence

Acceptance checks `AR-01` through `AR-14` passed:

- `AR-01` `/operator/agents` route exists and compiles under portal typecheck
- `AR-02` Operator subnav includes `Agents`
- `AR-03` registry includes all initial named agents
- `AR-04` shared alias is marked view-only and non-execution
- `AR-05` named agents show execution disabled
- `AR-06` capability matrix renders and write/execute capabilities are disabled
- `AR-07` repo-scope matrix renders
- `AR-08` credential posture shows env var names only and no values
- `AR-09` no API route or DB write was added
- `AR-10` no runtime or proof files changed
- `AR-11` no existing motions were modified
- `AR-12` `pnpm -C portal typecheck` passed
- `AR-13` `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0164/motion.yaml` passed
- `AR-14` `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed

Registry-shape verification also passed:

- named agent count is `7`
- human operator handle is `admin@jai.nexus`
- shared alias handle is `agent@jai.nexus`
- write and execute capabilities are disabled for every named agent
- repo scope count is `5`

---

## Guardrails preserved

- no execution enablement
- no credentials committed
- no secret values shown
- no GitHub token enablement
- no branch writes
- no PR creation
- no dispatch
- no scheduler behavior
- no DB writes
- no API mutation
- no runtime changes
- no mutation of existing motion packages

---

## Caveats

- No browser or manual UI smoke test was run in this turn.
- The old agency/delegation surface was replaced for `/operator/agents`, but
  no execution capability was carried forward into the new registry.
