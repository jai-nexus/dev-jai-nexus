# Motion 0172 Execution

Status: RATIFIED evidence record

## Touched files

- `.nexus/waves/wave-q2m4-customer-portal-intake/plan.md`
- `.nexus/waves/wave-q2m4-customer-portal-intake/wave.yaml`
- `portal/src/lib/continuity/waves.ts`
- `portal/src/lib/continuity/conversations.ts`
- `portal/src/lib/continuity/types.ts`
- `portal/src/app/operator/chats/page.tsx`
- `portal/scripts/export-continuity-artifacts.mjs`
- `.nexus/chats/2026-04-28__repo-planning__customer-portal-intake-planning.md`

## Planning outcomes

- Refined the customer portal intake wave into the required planning spine under `wave-q2m4-customer-portal-intake`.
- Added the refined `nh_id` hierarchy from `0.0` through `4.4`, including entry points, auth/account assumptions, billing assumptions, workspace/project planning, evidence/gates, and deferred execution authority.
- Recorded the customer portal intake thesis and explicit repo truth:
  - repo: `jai-nexus/jai-nexus`
  - surfaces: `customer portal / customer console`
- Added a repo-native planning capture:
  - `.nexus/chats/2026-04-28__repo-planning__customer-portal-intake-planning.md`
- Produced a copy-only repo-facing passalong prompt for a future `jai-nexus` execution seam.

## Billing and auth posture

- Documented business readiness baseline:
  - JAI NEXUS, LLC established
  - EIN secured
  - business bank account opened
- Documented Stripe and billing as actionable later, but explicitly deferred:
  - no Stripe keys
  - no webhooks
  - no checkout
  - no billing DB schema
  - no pricing model
  - no production billing enablement
- Documented auth/account assumptions and explicit deferrals:
  - authenticated customer users required later
  - account identity should later map to workspace membership
  - operator/customer identities remain separate
  - no provider choice, OAuth, magic-link, session middleware, account schema, or credentials

## Workspace and first-session planning

- Defined:
  - `Workspace` as the customer/team/account container
  - `Project` as the primary unit of work inside a workspace
- Captured the first-session thesis:
  - create or join workspace
  - create first project
  - choose project intent
  - enter project workspace
  - receive a JAI assistant rail next action

## Continuity export evidence

- `node portal/scripts/export-continuity-artifacts.mjs --write` regenerated the committed continuity projections.
- `node portal/scripts/export-continuity-artifacts.mjs --check` returned `status: current`.
- Current exported continuity set:
  - chats:
    - `2026-04-28__operator-deliberation__customer-portal-intake-map`
    - `2026-04-28__repo-planning__customer-portal-intake-planning`
  - waves:
    - `wave-q2m4-customer-portal-intake`

## Gates

- `node portal/scripts/export-continuity-artifacts.mjs --check` -> PASS
- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0172/motion.yaml` -> PASS
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` -> PASS
- `pnpm -C portal typecheck` -> PASS

## Guardrails preserved

- planning only
- no jai-nexus edits
- no apps/web or apps/app implementation
- no Stripe integration
- no auth implementation
- no DB schema or API mutation
- no execution
- no branch writes or PR creation
- no credentials or secret values
- no runtime changes
