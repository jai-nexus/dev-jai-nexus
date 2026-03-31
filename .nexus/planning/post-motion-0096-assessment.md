# Post-motion-0096 Proof Assessment

**Motion:** motion-0097
**Date:** 2026-03-31
**Scope:** Assessment and readiness layer codification — no runtime changes

---

## Reference layer

| Motion | Title | Kind | Status |
|---|---|---|---|
| motion-0070 | bounded council policy seam extraction | runtime | RATIFIED |
| motion-0084 | Project Bootstrap and Agency Planning v0 | planning-umbrella | RATIFIED |
| motion-0093 | First real OffBook.ai Wave 0 Bootstrap Rollout | rollout | RATIFIED |
| motion-0095 | bootstrap-manifest.instance.yaml Emission | generator-extension | RATIFIED |
| motion-0096 | Staged Workstream Dispatch Activation v0 — OffBook.ai | staged-activation | RATIFIED |

---

## What motion-0096 proved

### Proven — definitively

1. **Planning-to-runtime seam is viable.**
   A coverage-declaration.yaml sourced entirely from committed Wave 0 planning
   artifacts satisfies all 10 planner-owned dispatch handle fields without any
   new intake fields or runtime lookups.

2. **Staged project identity binds into the execution lane.**
   `activate-staged-project.mjs` reads the coverage-declaration, derives the
   dispatch handle, and creates a WorkPacket + AgentInboxItem tagged with
   `["motion:motion-0096", "project:offbook-ai", "route:ARCHITECT"]`.
   The `project:offbook-ai` tag is visible in the operator work surface at
   `/operator/work/[id]` without any UI changes.

3. **The architect lane accepts a staged-project packet.**
   `enqueue-motion-packet.mjs` correctly bridges a staged-project packet to the
   architect queue (6.0.10). The architect runtime claims the packet, loads motion
   context from `motion-0096/execution.md`, emits `debug.plan`, and routes to
   BUILDER. `project:offbook-ai` persists through the routing.

4. **Idempotency is safe.**
   A second `--create` run against an existing live packet is refused with EXIT 1
   and a clear error message. No duplicate or incoherent packet is created.

5. **The coverage-declaration is the binding handoff artifact.**
   The 10 planner-owned dispatch handle fields are fully computable from the
   Wave 0 bootstrap artifacts (intake + agency + manifest defaults). No
   implementation-owned fields (conductor_endpoint, queue_binding, auth_handle)
   are needed for the seam to activate.

### Evidence record (WorkPacket 882, 2026-03-31)

```
WorkPacket 882:  nhId=motion-0096  status=DRAFT
InboxItem 11:    tags=["motion:motion-0096","project:offbook-ai","route:ARCHITECT"]
AgentQueueItem:  agentNhId=6.0.10  status=PENDING  repoScope=["dev-jai-nexus"]

SoT events:
  WORK_CLAIMED   → motion-0096 by 6.0.10
  debug.plan     → Architect plan recorded: motion-0096
  WORK_COMPLETED → motion-0096 by 6.0.10
  WORK_ROUTED    → motion-0096 -> BUILDER

Post-proof inbox tags: ["motion:motion-0096","project:offbook-ai","route:BUILDER"]
```

---

## What motion-0096 did NOT prove

1. **Builder side of the activation path.**
   Packet 882 reached `route:BUILDER` but no builder claim has been attempted.
   `run-builder-once.ts` has not been exercised for a staged-project packet.

2. **Verifier and operator approval chain.**
   The full ARCHITECT → BUILDER → VERIFIER → OPERATOR lane has not been walked
   end-to-end for a staged-project packet.

3. **Second staged project generalization.**
   `activate-staged-project.mjs` was only exercised against OffBook.ai. A second
   project's coverage-declaration (e.g., a monorepo project) has not been tested.
   The script's `deriveNhRoot` fallback logic (from `agent_coverage`) is untested.

4. **OffBook.ai's own agents (7.0.x) in live execution.**
   The activation used dev-jai-nexus's architect agent (6.0.10). OffBook.ai's
   staged agents (7.0.10, 7.0.11, 7.0.12, 7.0.14) are not in the live execution
   system. No proof exists that they can be activated.

5. **Live repo promotion.**
   `out/offbook-ai/` is staged in dev-jai-nexus. offbook-core does not exist as
   a separate git repository. No promotion motion has been proposed.

6. **Wave 1 readiness.**
   No model-slots.yaml, agent-panels.yaml, or staffing assignment has been
   attempted. Wave 1 prerequisites have not been scoped.

---

## Readiness layer codification

### Layer 1 — Staged rollout readiness

**Definition:** Can the Wave 0 bootstrap generator be run against a real intake
to produce a correct, idempotent, verifiable set of governance substrate artifacts?

**Status: PROVEN** (motion-0093 + motion-0095)

Evidence:
- 12 Wave 0 substrate artifacts emitted to `out/offbook-ai/` from real intake
- `bootstrap-manifest.instance.yaml` emitted with SHA-256 intake hash
- Both artifacts are idempotent under rerun
- `validate_motion` and `validate_agency` pass for the rollout motion

**Not covered by this layer:**
- Transfer to a live governance-resident repo
- Second project rollout (only OffBook.ai tested)

---

### Layer 2 — Staged activation proof

**Definition:** Can a staged project's Wave 0 planning artifacts be converted
into a motion-linked work packet that correctly enters the governed execution
lane, carries project-visible tags, and is refused on duplicate creation?

**Status: PROVEN** (motion-0096, live 2026-03-31)

Evidence:
- coverage-declaration.yaml satisfies all 10 planner-owned dispatch handle fields
- WorkPacket 882 created with `project:offbook-ai` tag
- Architect claim, debug.plan emission, and ROUTE_BUILDER all confirmed by SoT events
- Rerun refused correctly

**Not covered by this layer:**
- Builder/verifier/operator chain (packet is at route:BUILDER, unpursued)
- Second staged project (only OffBook.ai tested)

---

### Layer 3 — Generalized dispatch/runtime readiness

**Definition:** Can the dispatch activation seam work for any conformant staged
project, not just OffBook.ai? Does a runtime conductor or queue system exist to
receive the activation?

**Status: NOT PROVEN — not started**

What is missing:
- No second project coverage-declaration created or dry-run
- `deriveNhRoot` fallback in `activate-staged-project.mjs` is untested
- `conductor_endpoint`, `queue_binding`, `auth_handle` fields are not populated
  for any project (explicitly deferred to Wave 1+ runtime wiring)
- No conductor or active dispatch runtime exists in dev-jai-nexus

**Preconditions for this layer:**
- At least one additional project coverage-declaration tested
- Staging or stub of conductor/queue binding
- Or explicit decision to defer beyond the current roadmap

---

### Layer 4 — Live repo promotion readiness

**Definition:** Are the staged Wave 0 governance artifacts committed to the
actual governance-resident repo (offbook-core), with that repo initialized and
operational?

**Status: NOT STARTED**

What is missing:
- offbook-core does not exist as a separate git repository
- No promotion motion proposed or scoped
- No transfer mechanism designed (git subtree, direct commit, templated init)
- No initial motion ceremony in offbook-core (motion-0001 is stub only)
- No operator decision on timing of promotion

**Preconditions for this layer:**
- offbook-core repo created
- Promotion motion designed and ratified
- Wave 0 artifact transfer executed and verified

---

### Layer 5 — Downstream builder-proof readiness

**Definition:** Has the full ARCHITECT → BUILDER → VERIFIER → OPERATOR lane been
walked end-to-end for a staged-project activation packet?

**Status: PARTIAL — architect lane proven only**

What is proven:
- Architect claim and route:BUILDER confirmed (WorkPacket 882)

What is missing:
- Builder claim against packet 882 not attempted
- `run-builder-once.ts` not exercised for staged-project activation path
- No patch, PR, or builder artifact in evidence
- Verifier and operator approval not proven for this packet type
- The `project:offbook-ai` tag has not been tested for persistence through
  builder → verifier → operator transitions

**Preconditions for this layer:**
- Builder claim on packet 882
- Builder artifact emitted (debug.patch or real patch)
- Verifier run and ROUTE_OPERATOR_REVIEW confirmed
- Operator approval action (APPROVE) confirmed

---

## Next track recommendations

These are recommendations only. None are implemented by this motion.

### Track A — Downstream builder-proof (highest priority, lowest risk)
**Scope:** Run builder and verifier on existing packet 882.
**Rationale:** The packet is already at route:BUILDER. This proves the full
execution lane for staged activation with zero new infrastructure.
**Suggested motion:** motion-0098 "Bounded Staged Activation Downstream Lane
Proof (Builder + Verifier) — OffBook.ai packet 882"
**Effort:** Minimal — no new files, just run existing scripts.

### Track B — Second staged project dry-run (generalization proof)
**Scope:** Create a second project's coverage-declaration (different topology —
monorepo) and run `activate-staged-project.mjs` dry-run against it.
**Rationale:** Proves the seam generalizes. Tests `deriveNhRoot` fallback.
**Suggested motion:** motion-XXXX "Bounded Staged Dispatch Generalization Proof
v0 — second staged project dry-run"
**Effort:** Small — one new YAML file, one dry-run run, no DB writes.

### Track C — Live repo promotion planning
**Scope:** Design the transfer of `out/offbook-ai/` to offbook-core when that
repo is created. A planning motion only — no code.
**Rationale:** Promotion is on the natural roadmap but has no designed mechanism.
**Suggested motion:** motion-XXXX "Bounded Live Repo Promotion Planning v0 —
OffBook.ai"
**Effort:** Planning doc only. Does not require offbook-core to exist yet.

### Track D — Wave 1 readiness scoping
**Scope:** Define what Wave 1 requires: model-slots.yaml, agent-panels.yaml,
staffing assignment, conductor/queue binding.
**Rationale:** Wave 0 is now complete and proven. Wave 1 prerequisites have
not been formally scoped.
**Suggested motion:** motion-XXXX "Wave 1 Readiness Scope and Planning v0 —
OffBook.ai"
**Effort:** Planning doc only.

### Recommended order
1. Track A first — completes the proven lane, no new infrastructure required
2. Track B second — validates generalization, small effort
3. Track C and D as parallel planning tracks when promotion timing is decided

---

## What this assessment does NOT recommend

- Starting a broad multi-project dispatch framework
- Implementing conductor_endpoint or queue_binding
- Promoting OffBook.ai to a live repo in this slice
- Any Wave 1+ work before Wave 0 is fully closed
- Reopening motion-0084 or any prior governance motion
