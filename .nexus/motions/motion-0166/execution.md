# Execution: Agent Work Packet to Task Prompt v0

**Motion:** motion-0166
**Kind:** builder-proof
**Program:** q2-agent-work-packet-task-prompt-v0
**Status:** RATIFIED

---

## Implementation scope

Implementation is confined to:

- `portal/src/app/operator/work/page.tsx`
- `portal/src/lib/agents/workPackets.ts`
- `portal/src/lib/agents/workPacketTypes.ts`
- `portal/src/lib/agents/workPacketTaskPrompts.ts`
- `.nexus/motions/motion-0166/**`

---

## Ratified evidence record

The draft-only work packet surface now renders deterministic task prompt
previews for every initial seed packet.

Each prompt includes:

- assigned agent key and display name
- target repo and target surface
- branch suggestion labeled suggestion-only
- allowed and blocked paths
- compatibility summary
- human gates
- verification commands
- evidence expectations
- credential posture using env var names only
- explicit operator guardrail text:
  - do not execute unless separately authorized by the operator

Prompt generation is bounded and preview-only:

- no run, dispatch, or execute controls were added
- no branch write or PR creation controls were added
- no API or DB mutation path was added
- no runtime changes were introduced

The prompt builder validates:

- assigned agent exists in the named agent registry
- assigned identity is not the shared alias `agent@jai.nexus`
- requested repo is in scope
- requested capability state is compatible, preview-only, or blocked

Observed prompt outputs:

- `prompt-wp-landing-homepage-refresh`
  - assigned agent: `jai-landing-page-agent`
  - target repo: `jai-nexus`
  - branch suggestion: `draft/jai-landing-page-agent/wp-landing-homepage-refresh`
  - status: `warning` because `draft_files_preview` remains preview-only
- `prompt-wp-customer-intake-map`
  - assigned agent: `jai-customer-portal-agent`
  - target repo: `customer-portal`
  - branch suggestion: `draft/jai-customer-portal-agent/wp-customer-intake-map`
  - status: `ready_preview`
- `prompt-wp-agent-registry-follow-up`
  - assigned agent: `jai-governance-agent`
  - target repo: `dev-jai-nexus`
  - branch suggestion: `draft/jai-governance-agent/wp-agent-registry-follow-up`
  - status: `ready_preview`
- `prompt-wp-api-contract-review`
  - assigned agent: `jai-verifier`
  - target repo: `api-nexus`
  - branch suggestion: `draft/jai-verifier/wp-api-contract-review`
  - status: `ready_preview`

---

## Acceptance evidence

Acceptance checks `TP-01` through `TP-18` passed:

- `TP-01` `/operator/work` renders task prompt previews
- `TP-02` every initial work packet can generate a prompt
- `TP-03` prompt includes assigned agent id and display name
- `TP-04` prompt blocks shared alias as execution identity
- `TP-05` prompt includes target repo and surface
- `TP-06` prompt includes branch name suggestion labeled suggestion-only
- `TP-07` prompt includes allowed and blocked paths
- `TP-08` prompt includes human gate text and explicit do-not-execute language
- `TP-09` prompt includes verification commands and evidence expectations
- `TP-10` prompt warns or blocks on incompatible capability or repo scope
- `TP-11` no run, dispatch, or execute controls exist
- `TP-12` no branch write or PR creation controls exist
- `TP-13` no API route or DB write was added
- `TP-14` no runtime or proof files changed
- `TP-15` no existing motions were modified
- `TP-16` `pnpm -C portal typecheck` passed
- `TP-17` `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0166/motion.yaml` passed
- `TP-18` `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` passed

---

## Guardrails preserved

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

---

## Caveats

- No browser or manual UI smoke test was run in this turn.
- Prompt previews are copy-only and do not include clipboard or execution affordances.
