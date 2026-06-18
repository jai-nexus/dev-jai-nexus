# Operator Development Readiness Model v0

Status: reference model only. This document does not authorize execution, model dispatch, Agent execution, GitHub writes, branch or PR automation, receipt creation, canon update, or gate opening.

## Current Allowed Behavior

- Read-only canonical, DB-backed, YAML-backed, and fixture-backed displays may be shown when their source posture is visible.
- Compose-only and copy-only surfaces may prepare text or local drafts when they are labeled as non-dispatching.
- Pre-existing mutation surfaces may remain available only where they already existed and are visibly contained as `PRE-EXISTING MUTATION` or an equivalent label.
- Static render, build, lint, typecheck, and read-only validation may be used as evidence. Validation is not acceptance.

## Current Blocked Behavior

- No code push authority in v0.
- No Agent execution authority in v0.
- No model dispatch in v0.
- No GitHub integration, branch creation, PR creation, PR merge, repo mutation, DNS/provider mutation, or event mutation is authorized by the Operator cockpit.
- No receipt creation, canon update, motion-state mutation, route-state mutation, automatic scoring, automatic synthesis, or automatic gate evaluation is authorized by this model.
- No execution gates opened.

Authentication is not authorization. Step-up verification confirms operator presence only. Verified session does not open execution gates.

## Page Readiness Classification

| Surface | Current posture | Development-readiness classification | Required before real development workflow |
| --- | --- | --- | --- |
| `/` | Read-only cockpit overview with derived/status displays | Ready for read-only canonical state | Source freshness cleanup for any stored status that later becomes live |
| `/operator` and `/operator/control-plane` | Aggregate dashboard display | Ready for read-only canonical state | Route topology decision, receipt model, and security gate integration |
| `/operator/events`, `/events` | Read-only event display | Ready for DB/read-only state | Event provenance and stale/partial stream policy before live ingestion |
| `/operator/grid` | Read-only/configuration posture | Ready for compose-only planning | `.jai` profile support and Agent lane security gates |
| `/operator/chats`, `/operator/chats/[id]` | Read-only archive and extracted-decision display | Ready for read-only DB state | Receipt model before extracted decisions can affect canon |
| `/operator/motions` | Canonical motion browser plus session-local contender preview | Ready for read-only canonical and guarded preview | Receipt and CONTROL_THREAD approval model before promotion can imply acceptance |
| `/operator/decisions` | Read-only decision visibility | Ready for read-only canonical state | Receipt lineage and freshness policy |
| `/operator/agents` | Staged Agent lane visibility | Should remain blocked for execution | Agent identity, lane permissions, dispatch gates, and receipts |
| `/operator/projects`, `/operator/portfolio-status` | Fixture/derived portfolio state | Needs data-source cleanup | Canonical project source and receipt-backed acceptance model |
| `/operator/work` | Read-only agenda and copy/compose posture | Ready for compose-only workflow | Work packet receipt model and execution gate policy |
| `/operator/work/new` | Pre-existing create mutation contained | Needs action semantics cleanup before expansion | Security gate, receipt requirements, rollback model, and mutation audit |
| `/operator/work/[id]` | High-risk pre-existing actions, Prisma writes, SoT emissions, and receipt artifact file writes contained | Should remain review/containment-only | Dedicated authority design before any new lifecycle behavior |
| `/operator/deliberation` | Advisory, read-only, copy-only deliberation | Ready for compose-only workflow | Council authority and receipt model before acceptance |
| `/operator/waves`, `/operator/waves/[sessionId]` | Planning/session display, read-only or copy-only | Ready for read-only planning | Dispatch gates and receipt-backed wave completion semantics |
| `/operator/jai` | Gated/inert JAI shell | Should remain blocked | Model dispatch authority, provider routing, step-up gates, and receipts |
| `/operator/corpus` | Canon evidence plus fixture/simulated review data | Should remain prototype/review-only | Data-source cleanup and Corpus V2 opening decision |
| `/operator/operating-context` | Read-only protected setting snapshot | Ready for read-only canonical state | Live settings storage decision and protected-setting security model |
| `/operator/dct` | Read-only governance projection | Ready for read-only projection | Projection freshness and receipt policy |
| `/operator/design-system` | Reference surface | Ready as documentation/reference | Keep non-authorizing |
| `/operator/live-dashboard` | Existing route, not promoted | Needs route topology decision | CONTROL_THREAD route decision before replacing `/operator` |
| `/operator/council-prototype` | Prototype/advisory route | Needs route topology decision | Council authority model before `/operator/council` promotion |
| `/operator/repos`, `/operator/repos/[repoId]`, `/operator/repos/[repoId]/file` | Read-only repo browser and file preview | Ready for read-only repo state | GitHub integration, repo mutation gates, and audit logging before writes |
| `/operator/registry/repos` | Read-only table plus pre-existing admin-gated YAML import/upsert contained | Should remain admin-contained | Registry authority and rollback model before expansion |
| `/operator/registry/repos/new`, `/operator/registry/repos/[id]` | Pre-existing admin-gated create/update/delete contained | Should remain admin-contained | Dedicated registry mutation policy |
| `/operator/registry/domains`, `/operator/registry/domains/new`, `/operator/registry/domains/[id]` | Read-only or pre-existing admin-gated domain mutation contained | Should remain admin-contained | DNS/provider integration policy and rollback model |
| `/operator/sync-runs/[syncRunId]/review` | Pre-existing apply/reject API mutation controls contained | Should remain review-only | Apply/reject authority, rollback, receipts, and audit log before expansion |
| `/operator/panels/[motionId]/[panelId]` | Pre-existing panel score/write controls contained | Should remain review-only | Scoring authority and canon acceptance policy |
| `/repos`, `/domains`, `/events` | Top-level read-only surfaces | Ready for read-only canonical or DB state | Source freshness and topology decisions before deeper integration |

## Future Development Capability Gates

| Capability | v0 classification | Required gate before enablement |
| --- | --- | --- |
| Branch planning | `REAL-COMPOSE` only | Human approval and source/target repo authority |
| Branch creation | `BLOCKED` | GitHub integration, repo authorization, receipt, rollback |
| Diff generation | `GATED` / compose-only | Deterministic source model and validation policy |
| File mutation | `BLOCKED` except pre-existing contained paths | Repo write gate, rollback, receipt artifact, audit trail |
| Code validation | `READ-ONLY` evidence only | Validation runner isolation and acceptance policy |
| PR description composition | `REAL-COMPOSE` | Copy-only or explicit submit boundary |
| PR creation | `BLOCKED` | GitHub integration, branch policy, receipt, rollback |
| PR review | `GATED` | Review authority model and provenance |
| PR merge | `BLOCKED` | CONTROL_THREAD decision, repo authority, receipts |
| Repo status ingestion | `GATED` | GitHub API integration and stale/live labeling |
| GitHub API integration | `BLOCKED` | Token, permission, audit, and rollback design |
| Agent lane staging | `GATED` | `.jai` profile support and lane identity model |
| Agent execution | `BLOCKED` | Execution gates, step-up, receipts, rollback |
| Model dispatch | `BLOCKED` | Provider policy, prompt lineage, receipt model |
| Receipt creation | `BLOCKED` | Receipt schema, storage, and acceptance semantics |
| Canon update | `BLOCKED` | CONTROL_THREAD approval and rollback |
| Rollback/revert support | `BLOCKED` | Artifact lineage and repo-state authority |

## Pre-Existing Mutation Paths To Keep Contained

- `/operator/sync-runs/[syncRunId]/review`: existing apply/reject POST controls through operator API routes.
- `/operator/registry/repos`: existing `repos.yaml` import and `prisma.repo.upsert`.
- `/operator/registry/repos/new` and `/operator/registry/repos/[id]`: existing repo create/update/delete server actions.
- `/operator/registry/domains/new` and `/operator/registry/domains/[id]`: existing domain create/update/delete server actions.
- `/operator/work/new`: existing work packet create transaction, inbox/queue sync, and SoT event emission.
- `/operator/work/[id]`: existing route actions, operator decision actions, Prisma updates, SoT events, and receipt artifact file writes.
- `/operator/panels/[motionId]/[panelId]`: existing panel score writes and selection artifact writes.
- `/operator/motions`: existing guarded contender promotion path.

These paths are not new Slate authority. Existing mutation controls are not new Slate authority. Slate migration does not grant new authority.

## Do Not Build Yet

- Live provider/model dispatch.
- Agent execution.
- Branch/PR automation.
- GitHub write integration.
- DNS/provider mutation.
- Automatic best-agent selection.
- Automatic scoring as canon.
- Receipt creation without an accepted receipt model.
- Canon updates without CONTROL_THREAD approval.
- Execution gates without security, receipts, rollback, and audit trail.
