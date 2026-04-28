# Repo planning continuity: customer portal intake planning

- chat_id: 2026-04-28__repo-planning__customer-portal-intake-planning
- source_kind: control_thread
- source_label: repo planning continuity capture
- repo: jai-nexus/jai-nexus
- surface: Customer portal
- status: captured
- captured_at: 2026-04-28T15:10:00.000Z
- related_motion_ids: motion-0169, motion-0170, motion-0171, motion-0172
- related_wave_ids: wave-q2m4-customer-portal-intake
- related_work_packet_ids: wp-customer-intake-map
- related_candidate_ids: candidate-wp-customer-intake-map

## Summary

Repo-facing planning capture that refines the customer portal intake wave into a structured handoff for a later jai-nexus execution seam.

## Decisions

- jai-nexus/jai-nexus remains the actual repo for both public-site and customer-console surfaces.
- Customer portal and customer console are treated as product/surface lanes, not standalone repos.
- Current seam remains planning-only and does not authorize implementation in jai-nexus.

## Risks

- Billing and auth assumptions are still planning inputs, not executable implementation decisions.
- Workspace/project planning must not be mistaken for DB or API authority.

## Tasks

- Refine the customer portal intake wave hierarchy and explicit deferrals.
- Carry forward a repo-facing passalong prompt for a future jai-nexus execution motion.

## Next Prompts

### Prompt 1

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
