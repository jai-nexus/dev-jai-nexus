# Execution: Agent Work Packet Drafting v0

**Motion:** motion-0165
**Kind:** builder-proof
**Program:** q2-agent-work-packet-drafting-v0
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/src/app/operator/work/page.tsx`
- `portal/src/lib/agents/workPackets.ts`
- `portal/src/lib/agents/workPacketTypes.ts`
- `.nexus/motions/motion-0165/**`

---

## Ratified evidence record

The old DB-backed `/operator/work` execution queue was replaced with a
read-only draft work packet surface linked to the configuration-only Agent
Registry.

Initial seed packets implemented:

- landing page homepage refresh
- customer portal intake map
- agent registry follow-up
- API contract review

Each packet links to a configured named JAI agent and renders:

- assigned agent identity and registry link
- requested action compatibility
- repo-scope compatibility
- explicit execution-blocked posture
- human gates
- evidence expectations
- credential posture using env var names only

The surface explicitly preserves the v0 boundary:

- no run, dispatch, or execute controls
- no branch write controls
- no PR creation controls
- no API or DB mutation
- no runtime changes
- shared alias `agent@jai.nexus` remains non-assignable as an execution identity

For requested action compatibility:

- `draft_plan` derives from registry capability `draft_plan`
- `draft_files_preview` derives from registry capability `draft_files_preview`
- `verify` remains read-only and is linked to `view_only` posture for the named
  verifier identity only

---

## Acceptance evidence

Acceptance checks `WP-01` through `WP-17` passed:

- `WP-01` `/operator/work` route renders and compiles under portal typecheck
- `WP-02` initial packet list includes all seed packets
- `WP-03` every packet links to a configured named agent
- `WP-04` shared alias `agent@jai.nexus` is not assignable as execution identity
- `WP-05` repo-scope compatibility is shown
- `WP-06` requested capability status is shown
- `WP-07` execution is explicitly disabled for every packet
- `WP-08` no run, dispatch, or execute controls exist
- `WP-09` no branch write or PR creation controls exist
- `WP-10` human gates and evidence expectations render
- `WP-11` credential posture shows env var names only and no values
- `WP-12` no API route or DB write was added
- `WP-13` no runtime or proof files changed
- `WP-14` no existing motions were modified
- `WP-15` `pnpm -C portal typecheck` passed
- `WP-16` `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0165/motion.yaml` passed
- `WP-17` `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed

Concrete seed packet evidence:

- `wp-landing-homepage-refresh` -> `jai-landing-page-agent` on `jai-nexus`
- `wp-customer-intake-map` -> `jai-customer-portal-agent` on `customer-portal`
- `wp-agent-registry-follow-up` -> `jai-governance-agent` on `dev-jai-nexus`
- `wp-api-contract-review` -> `jai-verifier` on `api-nexus`

---

## Guardrails preserved

- no execution
- no branch writes
- no PR creation
- no dispatch
- no scheduler behavior
- no DB writes
- no API mutation
- no credentials or secret values
- no runtime changes
- no cross-repo mutation

---

## Caveats

- No browser or manual UI smoke test was run in this turn.
