# RFC: Canonical Boundaries v0.1 (JAI NEXUS)

## Purpose
Define the canonical boundary between key concepts so the system remains coherent over long time horizons:
- Agent Identity (WHO)
- Role Behavior (WHAT)
- Council Governance (HOW decisions become canon)
- Panels (HOW to get best output per role)
- Routing (WHERE a message goes next)

This document defines a single Source of Truth (SoT) for each concept.

---

## 1) Agent Identity (WHO)
**Definition:** Stable identity used for accountability and assignment across time.

**Properties:**
- stable NHID
- assigned at global/domain/repo tiers

**SoT:**
- `nexus-core/registry/agents.index.json`
- `nexus-core/registry/agents.generated.yaml`

**Change rule:**
- registry changes must be performed via governed process and re-generated deterministically.

---

## 2) Role Behavior (WHAT)
**Definition:** A behavioral contract that defines constraints and expected outputs.

**Examples:**
- JAI::DEV::BUILDER
- JAI::DEV::VERIFIER

**SoT:**
- `roles/*.md`
- `roles/rolemap.json`

**Change rule:**
- any role contract or permission change requires a motion.

---

## 3) Council Governance (HOW decisions become canon)
**Definition:** The protocol that converts work into durable, auditable canon.

**SoT:**
- `portal/scripts/council-run.mjs`
- `.nexus/council.config.yaml`
- `.nexus/motions/**` artifacts (proposal/challenge/policy/vote/decision/verify)

**Change rule:**
- governance changes require a motion; default vote mode is `unanimous_consent`.

---

## 4) Panels (HOW we get the best output per role)
**Definition:** A quality mechanism: 5 candidates + selector scored by rubric, producing a selection record.

**SoT:**
- `.nexus/agent-panels.yaml`
- `.nexus/model-slots.yaml`
- `.nexus/motions/<motionId>/panels/<panelId>/` artifacts

**Panels are NOT Council:**
- Panels recommend and justify.
- Council ratifies.

---

## 5) Routing (WHERE a message goes next)
**Definition:** Deterministic mapping from a message/task to the next responsible unit.

**Routing chooses:**
- domain/repo target (or “unknown” and request clarification)
- role contract
- agent identity (NHID)
- whether to invoke a panel

**SoT (declared):**
- Router spec doc (next motion)
- Route decision records (SoT event or trace artifact) (next motion)

**Change rule:**
- routing logic changes require motions and must emit durable route records.

---

## 6) Minimal invariants
- Identity ≠ Behavior
- Council ≠ Panels
- Routing must produce durable decisions
- Every concept has exactly one SoT

---

## 7) Next steps
- Motion: Router v0 spec + route decision record format
- Motion: Router v0 implementation + SoT event emission
