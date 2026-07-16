# Proposal: JAI Governance Intelligence Sequential Activation Portfolio Motion v0

## Ratified decision being staged

The human operator explicitly ratified:

`RATIFY_SEQUENTIAL_ACTIVATION_PORTFOLIO_MOTION`

Decision route:

`HUMAN_OPERATOR_DIRECTED / DELIBERATION_BYPASSED / JAI_NOT_ACTIVATED`

This package stages that already-ratified human decision. It does not simulate
or reconstruct deliberation. No JAI, JAI Agent, or JAI Council participated.

## Purpose

Reserve a durable, sequential portfolio boundary for future JAI Governance
Intelligence activation work while keeping the current state precise:

`NONE_OPEN / SEQUENTIAL_ACTIVATION_PORTFOLIO_RESERVED`

The reservation supplies order, prerequisites, and non-authorizations. It does
not open a Program, assign lanes, route execution, create NHIDs, or activate any
system or actor.

## Main-state grounding

| Observation | Grounded result | Authority effect |
|---|---|---|
| Fresh `origin/main` used before authoring | `04aa546d395c6c46b358c6b09f0e40b6f469717f` | Evidence only |
| Highest committed motion before this package | `motion-0247` | Numbering continuity only |
| `.nexus/motions/motion-0248` on baseline | Absent | Authoring precondition only |
| Recent motion package practice | Eight files including `decision.yaml`, without `decision.md` | Current package-shape evidence only |
| Motion Factory playbook | Describes nine files and council-based ratification | Drift evidence; not used for this bypass |
| Agent operator surfaces | Static, read-only, non-executing, and explicitly not activation | No Agent authority |
| Model-slot manifests | Static declarations include multiple panels, candidates, live labels, and deferred selectors | Do not establish the required five-slot system or activation |
| Legacy program graph | Contains historical `open` and Agent-participated Corpus V2 claims | Does not override current human-authorized state |
| Linear | Human-provided evidence says temporary mirror with no accepted portfolio record; no Linear query was run | No authority or source-of-truth effect |

## Ratified four-Program sequence

This is the complete and fixed sequence. It is not an alternate roadmap or an
implicit readiness chain.

| Order | Program ID | Program name | Initial state |
|---:|---|---|---|
| 1 | `jai-governance-intelligence-main-state-operating-loop-v0` | Main-State Reconciliation and Minimum Viable Operating Loop v0 | `RESERVED_NOT_OPENED / NO_EXECUTION_AUTHORITY` |
| 2 | `jai-five-slot-compounded-reasoning-shadow-kernel-v0` | Five-Slot Compounded Reasoning Shadow Kernel v0 | `RESERVED_NOT_OPENED / NO_EXECUTION_AUTHORITY` |
| 3 | `jai-founder-developer-workflow-pilot-v0` | Founder Developer Workflow Pilot v0 | `RESERVED_NOT_OPENED / NO_EXECUTION_AUTHORITY` |
| 4 | `jai-agent-council-bounded-activation-pilot-v0` | Bounded JAI Agent and Council Activation Pilot v0 | `RESERVED_NOT_OPENED / NO_EXECUTION_AUTHORITY` |

Recognized active Program count: `0`.

Core invariant: `active_program_count <= 1`.

Reservation grants no execution authority. No Program inherits opening,
acceptance, execution, activation, or authority from its predecessor.

## General opening prerequisites

Every Program opening requires all of the following:

1. `motion-0248` is accepted on `origin/main`.
2. A fresh `MAIN_STATE_RECEIPT` exists for the proposed opening.
3. The proposed Program remains inside motion-0248's fixed sequence, scope,
   authority envelope, and intended outcome.
4. CONTROL_THREAD issues a named `PROGRAM_OPENING_RECEIPT`.
5. The opening receipt cites its evidence basis and fresh `origin/main` SHA.
6. Acceptance criteria and Program exit conditions are explicit.
7. Authorized repositories, files, systems, environments, and data boundaries
   are explicit.
8. Budget, provider-spend posture, credential posture, and time/resource limits
   are explicit.
9. Rollback, hold, cancellation, and `NO_GO` behavior are explicit.
10. Non-authorizations are explicit.
11. No unresolved security, governance, evidence, dependency, cost, or
    authority-boundary blocker exists.
12. No stale branch, stacked branch, unrelated active work, or conflicting
    Program ledger entry creates ambiguity.
13. Reserved status is acknowledged as granting no execution authority.
14. Program opening authorizes Batch planning only.
15. Every Batch and Lane execution requires a separate exact CONTROL_THREAD
    repo-execution route.

## MAIN_STATE_RECEIPT requirements

The fresh receipt must record:

- repository ref, SHA, and timestamp;
- latest accepted merge and closeout receipts;
- open PR and active-work state;
- recognized active Program ledger;
- implemented capabilities;
- documentary, static, mock, placeholder, disabled, and unverified capabilities;
- runtime, provider, persistence, security, and authority gaps;
- exact proposed delta;
- unchanged and deferred scope;
- scope-fit determination;
- blockers and holds.

Legacy `open`, Corpus V2, or Agent-participation labels do not create a current
active Program or satisfy an opening gate.

## Program-specific opening prerequisites

### Program 1

Program 1 may open only after:

- motion-0248 is accepted on `origin/main`;
- a fresh main-state receipt confirms zero active Programs;
- reconciliation explicitly covers legacy Program, Corpus V2, Agent,
  model-slot, and mirror contradictions;
- the operating-loop plan includes durable Program lifecycle states,
  opening/hold/close receipts, and enforcement of
  `active_program_count <= 1`;
- its Batch plan includes one human-supervised local/dev intent -> decision ->
  Program/Batch/Lane -> repo handoff -> evidence -> closeout demonstration;
- negative cases cover parallel opening, stale or missing receipts,
  predecessor not accepted, and authority expansion.

No JAI Agent, Council, or provider activation is required to open Program 1.

### Program 2

Program 2 may open only after:

- Program 1 is `CLOSED_ACCEPTED`;
- Program 1 established the durable lifecycle and one-active-Program control;
- Program 1 completed and evidenced the minimum viable operating loop;
- a fresh main-state receipt confirms those capabilities remain accepted;
- the five-slot plan is provider-neutral and shadow/manual/replay-only;
- the plan requires same-model disclosure and prohibits false independent
  consensus claims;
- disagreement, missing-evidence, malformed-output, false-consensus,
  role-collapse, failure/timeout, and authority tests are defined.

### Program 3

Program 3 may open only after:

- Program 2 is `CLOSED_ACCEPTED`;
- the five-slot shadow kernel produced a reproducible, traceable packet;
- required dissent, provenance, evidence, confidence, synthesis, failure, and
  authority tests passed;
- a fresh main-state receipt confirms the kernel remains accepted;
- one low-risk founder developer workflow is explicitly selected;
- measurement criteria include time to close, operator interactions,
  failures/retries, evidence quality, cost, rollback, and residual risk.

### Program 4

Program 4 may open only after:

- Program 3 is `CLOSED_ACCEPTED`;
- the founder workflow pilot produced accepted practical-value evidence;
- a fresh main-state receipt confirms the manual operating loop remains intact;
- the pilot is manually triggered and sandbox-bounded;
- identity, scope, tool, memory, data, credential, and environment boundaries
  are explicit;
- hard budgets, provenance, kill switch, rollback, default-deny behavior, and
  valid `NO_GO` behavior are defined;
- autonomous Program creation and standing repository authority remain
  prohibited;
- any provider-backed or live Batch receives a separate specific human
  activation and spend receipt.

## Failure and amendment behavior

- `CLOSED_NO_GO`, cancellation, failure, or an unresolved hold freezes every
  downstream Program.
- CONTROL_THREAD cannot silently skip, reorder, substitute, or rename a Program.
- Material changes require an explicit human-operator amendment or superseding
  motion.
- No new motion is required between Programs when the ratified order, scope,
  authority envelope, and intended outcome remain unchanged and every gate
  passes.

## Authority and identity boundaries

- Authority originates with the human operator.
- `CONTROL_THREAD` preserves routing continuity and main-state comparison.
- `JAI::DEV::BUILDER` stages only this package under the lane exception.
- Human labels are aliases, not NHIDs.
- `NOT_ASSIGNED / COORDINATION ONLY` assigns no identity or authority.
- NHID coordinates cannot route, execute, approve, accept, mutate, or open gates.
- The lane exception ends when motion-0248 staging is closed out.
- This motion does not amend standing workflow-role canon.

## Package scope

Only these eight current-practice files are in scope:

- `motion.yaml`
- `policy.yaml`
- `proposal.md`
- `challenge.md`
- `decision.yaml`
- `vote.json`
- `execution.md`
- `verify.json`

The M0248-A2 repair additionally authorizes regeneration of
`portal/src/lib/motion/motionSnapshot.json`. The generated repository snapshot
is not a ninth motion-package file.

`decision.md` is not added. The playbook's nine-file description and the
current eight-file package practice are drifted. Adding a ninth file here would
misstate current practice and would not solve the factory's inability to model
this human-directed deliberation bypass.

## Evidence classes

- Human-authority evidence: the explicit ratification and lane authorization in
  the operator route.
- Alignment evidence: the CONTROL_THREAD steer containing the exact four
  Program IDs, names, order, opening prerequisites, and failure behavior.
- Git/source evidence: fresh main SHA, motion numbering, package shape, static
  Agent surfaces, model-slot manifests, and legacy program-graph text.
- Builder-validation evidence: schema, agency-validator attempt with an explicit
  external-input limitation, fixture, typecheck, syntax, scope, diff, and
  non-authorization checks recorded before commit.
- Not established: JAI capability, Agent/Council participation, five-slot
  architecture, provider/runtime behavior, deployed database behavior,
  activation readiness, or production readiness.

## Non-goals

- opening or executing any of the four Programs, a Batch, Wave, or Lane
- running Motion Factory or Council
- creating votes, quorum, dissent, or deliberation records
- activating JAI, JAI Agents, JAI Council, model slots, providers, or runtime
- dispatching provider/model/API requests or spending API funds
- changing source, tests, configuration, database, schema, or migrations
- mutating another repository, GitHub through an API, Linear, deployment, or production
- creating or merging a PR
- assigning NHIDs, transferring authority, or opening gates

## Effect of ratification

Ratification makes this package a durable portfolio reservation. It does not
open Program 1 or make any reserved Program active. Every named opening gate and
fresh receipt remains required before a Program can be opened, and every Batch
or Lane execution still requires a separate exact CONTROL_THREAD route.

Required resulting state:

- `MOTION_0248: STAGED_ALIGNED_PENDING_PR`
- `ACTIVE_PROGRAM_COUNT: 0`
- `PROGRAM_1: NOT_OPEN`
- `ZERO GATES GRANTED`

`ZERO GATES GRANTED`
