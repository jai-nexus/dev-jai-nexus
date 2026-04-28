# Q2M4 customer portal intake continuity wave

- wave_id: wave-q2m4-customer-portal-intake
- status: planned
- repo: jai-nexus/jai-nexus
- surface: Customer portal / customer console
- project: JAI Internal / Spine
- related_motion_ids: motion-0169, motion-0170, motion-0171, motion-0172
- related_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map, 2026-04-28__repo-planning__customer-portal-intake-planning
- related_work_packet_ids: wp-customer-intake-map
- related_candidate_ids: candidate-wp-customer-intake-map
- deliberation_route: /operator/deliberation

## Current Repo Framing

- Current repo truth is jai-nexus/jai-nexus.
- Customer portal and customer console are surfaces/product lanes inside jai-nexus/jai-nexus.
- The current seam does not edit jai-nexus and does not authorize code changes.

## Problem Statement

- Customer portal intake reasoning exists across deliberation, chats, and waves, but it needs one refined planning spine before any repo execution seam opens.
- The planning spine must make repo truth, product boundaries, auth assumptions, billing assumptions, workspace creation, and first-session expectations explicit.

## Customer Portal Intake Thesis

- Visitor/prospect reaches a public-site CTA or a direct customer-console entry.
- The user eventually creates or signs into an account, enters the customer console, creates or joins a workspace, creates a first project, and then receives a JAI assistant rail next action.

## Billing / Stripe Assumptions And Deferrals

- JAI NEXUS, LLC exists, EIN is secured, and the business bank account is open.
- Stripe and billing setup are therefore actionable later, but not in this motion.
- No Stripe keys, webhooks, checkout, billing schema, pricing model, or production billing enablement are authorized here.

## Auth / Account Assumptions And Deferrals

- The customer console will eventually require authenticated users.
- Account identity should eventually connect to workspace membership while keeping operator and customer identities separate.
- No auth provider choice, OAuth, magic-link, session middleware, account schema, or credentials are authorized here.

## Workspace / Project Planning

- Workspace is the customer/team/account container.
- Project is the primary unit of work inside a workspace.
- The first login flow should eventually support create-or-join workspace, create first project, choose project intent, enter project workspace, and receive a JAI assistant rail next action.

## Evidence And Gates

- Planning acceptance evidence must show repo/surface truth, intake map clarity, explicit Stripe/auth deferrals, and repo-facing handoff quality.
- Implementation readiness gates remain separate and will require a future jai-nexus execution seam, plus security/privacy and billing/auth readiness review.

## Deferred Execution Authority

- No implementation authority is granted here.
- No Stripe, auth, or DB authority is granted here.
- Future jai-nexus execution handoff and future Agent PR Workflow dependency remain deferred.

## Repo-facing Passalong Prompt

```text
# Repo-facing passalong for jai-nexus

Target repo: jai-nexus/jai-nexus
Target surfaces: customer portal / customer console
Planning status: motion-0172 planning only

Requested next seam:
- convert the current intake planning spine into a jai-nexus execution-scoped motion after operator review

Required repo framing:
- public-site entry should be considered from jai-nexus/apps/web
- direct customer-console entry should be considered from jai-nexus/apps/app
- customer portal remains a surface/product lane, not a standalone repo

Planning constraints:
- do not implement Stripe in this planning handoff
- do not implement auth/provider/session middleware in this planning handoff
- do not add DB schema or API routes in this planning handoff
- treat workspace and project creation as conceptual first-session flow only

Expected first-session thesis:
- visitor/prospect reaches a public-site CTA or direct console entry
- account creation/login will eventually gate the customer console
- user creates or joins a workspace
- user creates a first project and enters the project workspace
- JAI assistant rail suggests the next recommended action

Operator guardrail: Do not execute unless separately authorized by the operator.
```

## Next Prompt Preview

```text
# Repo-facing passalong for jai-nexus

Target repo: jai-nexus/jai-nexus
Target surfaces: customer portal / customer console
Planning status: motion-0172 planning only

Requested next seam:
- convert the current intake planning spine into a jai-nexus execution-scoped motion after operator review

Required repo framing:
- public-site entry should be considered from jai-nexus/apps/web
- direct customer-console entry should be considered from jai-nexus/apps/app
- customer portal remains a surface/product lane, not a standalone repo

Planning constraints:
- do not implement Stripe in this planning handoff
- do not implement auth/provider/session middleware in this planning handoff
- do not add DB schema or API routes in this planning handoff
- treat workspace and project creation as conceptual first-session flow only

Expected first-session thesis:
- visitor/prospect reaches a public-site CTA or direct console entry
- account creation/login will eventually gate the customer console
- user creates or joins a workspace
- user creates a first project and enters the project workspace
- JAI assistant rail suggests the next recommended action

Operator guardrail: Do not execute unless separately authorized by the operator.
```

## nh_id Plan

### 0.0 Context and framing

- status: planned
- summary: Use the current deliberation transcript and planning capture as the durable planning spine for the next customer portal motion.
- linked_motion_ids: motion-0169, motion-0170, motion-0171, motion-0172
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map, 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Transcript and planning captures are durable and navigable.
- Operator authorization remains required before execution.

### 0.1 Business readiness baseline

- status: planned
- summary: Business foundation is in place: JAI NEXUS, LLC exists, EIN is secured, and business banking is open.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Business readiness is documented as an assumption, not as billing enablement.

### 0.2 Product boundary and non-goals

- status: planned
- summary: This seam refines planning only and does not authorize jai-nexus implementation, Stripe setup, auth implementation, DB work, or API work.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Planning seam remains repo-native documentation only.

### 1.0 Target surface model

- status: planned
- summary: Clarify repo truth, customer console surface definition, and prototype/reference lane relationships.
- linked_motion_ids: motion-0167, motion-0169, motion-0170, motion-0171, motion-0172
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map, 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Repo-plus-surface targeting stays explicit.
- Customer portal remains a surface, not a standalone repo.

### 1.1 Repo and surface truth

- status: planned
- summary: jai-nexus/jai-nexus is the actual repo for landing page and customer portal/customer console surfaces.
- linked_motion_ids: motion-0167, motion-0172
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map, 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No standalone customer-portal repo is implied.

### 1.2 Customer console surface definition

- status: planned
- summary: Customer portal/customer console is the authenticated customer-facing lane that eventually contains onboarding, workspace setup, and first-project setup.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Operator surfaces and customer surfaces remain separated.

### 1.3 Prototype/reference lane relationship

- status: planned
- summary: Reference and prototype concepts may inform the plan, but the actual repo execution lane remains jai-nexus/jai-nexus and is deferred here.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No prototype lane is treated as execution authority.

### 2.0 Customer portal intake map

- status: planned
- summary: Refine the prospect-to-customer-console journey into explicit entry, auth, billing, workspace, and first-session planning nodes.
- linked_motion_ids: motion-0169, motion-0170, motion-0171, motion-0172
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map, 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- The intake map remains planning-only and copy-only.

### 2.1 Entry points

- status: planned
- summary: Document how customers reach the future customer console from public-site, direct app, or operator-assisted entry.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Entry points are planned, not implemented.

### 2.1.1 Public-site entry from jai-nexus/apps/web

- status: planned
- summary: Public-site CTA should eventually guide a visitor/prospect into account creation or login for the customer console.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No apps/web implementation is authorized here.

### 2.1.2 Direct customer-console entry from jai-nexus/apps/app

- status: planned
- summary: Existing or future direct app entry should drop users into the customer console lane after auth is eventually available.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No apps/app implementation is authorized here.

### 2.1.3 Operator-assisted onboarding path

- status: planned
- summary: Operator-assisted onboarding may bootstrap customer entry, but operator and customer identities must remain separate.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No operator-customer identity merge is implied.

### 2.2 Account/auth intake

- status: planned
- summary: Define account and session assumptions without choosing providers, credentials, or schema.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Auth planning is explicit and deferred from implementation.

### 2.2.1 User identity assumptions

- status: planned
- summary: The customer console will eventually require authenticated users with stable account identity.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No provider selection is made here.

### 2.2.2 Organization/customer account assumptions

- status: planned
- summary: Account identity should eventually map to workspace membership and customer/team ownership.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Workspace membership remains conceptual only.

### 2.2.3 Session/account state assumptions

- status: planned
- summary: The future customer console will need session and account state, but this seam does not authorize session middleware or account persistence.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No session implementation is authorized here.

### 2.2.4 Deferred auth implementation

- status: deferred
- summary: No provider selection, OAuth, magic-link, middleware, account schema, or credentials are authorized in this planning seam.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Auth execution authority is deferred.

### 2.3 Billing/Stripe intake

- status: planned
- summary: Document billing assumptions now that the business foundation is in place, while deferring all Stripe integration.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Billing readiness is explicit and execution remains deferred.

### 2.3.1 Business account readiness

- status: planned
- summary: JAI NEXUS, LLC exists, EIN is secured, and the business bank account is open, making future Stripe setup actionable later.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Business readiness does not equal billing enablement.

### 2.3.2 Stripe customer object assumptions

- status: planned
- summary: A future customer account will likely need a Stripe customer object relationship, but no schema or API decisions are made here.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No Stripe object implementation is authorized.

### 2.3.3 Subscription/payment assumptions

- status: planned
- summary: Subscription and payment assumptions should be documented, but pricing, checkout, invoices, and production billing are out of scope.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No pricing or billing workflow is authorized here.

### 2.3.4 Customer portal billing entry assumptions

- status: planned
- summary: Billing entry in the future customer console should be planned as a later lane tied to account/workspace context.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Customer-billing UX remains a planning topic only.

### 2.3.5 Deferred Stripe integration

- status: deferred
- summary: No Stripe keys, webhooks, checkout, billing DB schema, pricing model, or production billing enablement are authorized here.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Stripe execution authority is deferred.

### 2.4 Workspace/project creation

- status: planned
- summary: Model the workspace and project creation sequence that a new customer should experience after first entry.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Workspace and project remain conceptual planning objects here.

### 2.4.1 Workspace creation concept

- status: planned
- summary: Workspace is the customer/team/account container that organizes later projects and members.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No workspace schema is authorized here.

### 2.4.2 Project creation concept

- status: planned
- summary: Project is the primary unit of work created inside the workspace before the assistant rail begins next-action guidance.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No project schema or project APIs are authorized here.

### 2.4.3 User-to-workspace relationship

- status: planned
- summary: User identity should eventually determine workspace membership and access posture.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Membership logic is planning-only here.

### 2.4.4 Project-centric assistant rail relationship

- status: planned
- summary: The JAI assistant rail should eventually operate inside the selected project context rather than as a global unauthenticated lane.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Assistant behavior remains conceptual and execution-disabled.

### 2.5 First-session experience

- status: planned
- summary: Define the first-session user experience after account entry and before any deeper assistant execution capability exists.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- First-session planning remains repo-facing guidance only.

### 2.5.1 Empty state

- status: planned
- summary: A first-time user should land in a clear empty state that explains next setup steps and avoids operator-only terminology.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No UI implementation is authorized here.

### 2.5.2 Guided intake

- status: planned
- summary: The user should be guided through workspace and first-project setup with explicit planning checkpoints.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Guidance remains planning-only.

### 2.5.3 JAI assistant rail handoff

- status: planned
- summary: Once the project context is established, the customer-facing JAI assistant rail should eventually suggest the next recommended action.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No assistant execution is authorized here.

### 2.5.4 Next recommended action

- status: planned
- summary: The first-session outcome should set up a clear next recommended action for the customer inside the project workspace.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Next-action guidance remains a future execution seam.

### 3.0 Evidence and gates

- status: planned
- summary: Define the evidence required to move from planning-only intake framing to a later jai-nexus implementation seam.
- linked_motion_ids: motion-0169, motion-0170, motion-0171, motion-0172
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map, 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Evidence and gates remain explicit before implementation authority opens.

### 3.1 Planning acceptance evidence

- status: planned
- summary: Planning acceptance must show repo framing, intake map clarity, billing/auth deferrals, workspace model, and passalong quality.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Planning evidence must be repo-facing and reviewable.

### 3.2 Implementation readiness gates

- status: planned
- summary: A future jai-nexus execution seam must define implementation gates separately before any apps/web or apps/app work begins.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No implementation authority is implied by this planning wave.

### 3.3 Security/privacy review gates

- status: planned
- summary: A future implementation seam must address security and privacy review before customer auth or data handling is enabled.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Security/privacy review is deferred but explicit.

### 3.4 Billing/auth readiness gates

- status: planned
- summary: A future implementation seam must separately prove billing and auth readiness before Stripe or account work is opened.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Billing and auth readiness remain future gates, not current authority.

### 4.0 Deferred execution authority

- status: deferred
- summary: Make the non-goals and future handoff path explicit so this wave remains planning-only.
- linked_motion_ids: motion-0170, motion-0171, motion-0172
- linked_chat_ids: 2026-04-28__operator-deliberation__customer-portal-intake-map, 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- This wave remains capture/index/planning only.

### 4.1 No implementation authority

- status: deferred
- summary: No apps/web or apps/app implementation authority is granted by this motion.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- jai-nexus remains untouched in this seam.

### 4.2 No Stripe/auth/DB authority

- status: deferred
- summary: No Stripe integration, auth implementation, DB schema, or API route authority is granted by this motion.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Billing/auth/DB changes remain out of scope.

### 4.3 Future jai-nexus execution handoff

- status: deferred
- summary: The next repo-facing handoff should open a separate jai-nexus implementation seam using the passalong prompt captured here.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- Repo-facing passalong is produced, not executed.

### 4.4 Future Agent PR Workflow dependency

- status: deferred
- summary: Any later agent-driven branch write or PR workflow remains dependent on a separate authority seam.
- linked_motion_ids: motion-0172
- linked_chat_ids: 2026-04-28__repo-planning__customer-portal-intake-planning
- linked_work_packet_ids: wp-customer-intake-map
- linked_candidate_ids: candidate-wp-customer-intake-map

Acceptance notes:
- No branch-write or PR authority is introduced here.
