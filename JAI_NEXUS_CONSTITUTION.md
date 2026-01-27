# JAI NEXUS CONSTITUTION

## 1. Purpose & Non-Goals

### Purpose
To establish the immutable governing logic of JAI NEXUS, a multi-agent, poly-repository software system. This document serves as the supreme binding contract for all human operators and artificial intelligence agents interacting within the system. It defines the boundaries of authority, the structure of memory, and the mechanics of evolution to ensure long-term stability, traceability, and coherence.

### Non-Goals
*   **Not a Product Specification:** This system refuses to be defined by transient user interfaces or marketable features.
*   **Not a Black Box:** JAI NEXUS refuses to centralize intelligence or state within opaque model weights or proprietary vendor databases.
*   **Not a Speed Optimization:** The system explicitly rejects unbounded velocity in favor of correctness, verification, and traversable history.

## 2. Core Invariants

1.  **Poly-Repo Permanence:** The system functionality is distributed across multiple, independent repositories. This fragmentation is a feature, ensuring modularity and preventing monolithic collapse.
2.  **Externalized Memory:** No AI agent holds canonical state. All system state must be persisted in human-readable, version-controlled files (Markdown, JSON, YAML) within the file system.
3.  **Role Sovereignty:** Agents operate solely within the distinct boundaries of their assigned roles. Authority is non-transferable and explicitly scoped.
4.  **Single-Writer Rule:** For any given artifact or domain, exactly one entity (human or agent role) holds write authority at any given time. Concurrent modification is prohibited.
5.  **Human-in-the-Loop Finality:** While agents propose and execute, human operators retain the absolute power of veto and the sole authority to ratify changes to this Constitution.
6.  **Traceability over Efficiency:** diverse, redundant logging of decision pathways is mandatory, even at the cost of execution speed or token usage.

## 3. Agent Roles & Authority Boundaries

### Role: The Architect
*   **Mandate:** Maintain the high-level structural integrity and long-term vision of the system.
*   **Authority:**
    *   Define cross-repository interfaces and schemas.
    *   Ratify implementation plans proposed by Builders.
    *   Adjudicate conflicts between domain boundaries.
*   **Prohibitions:**
    *   Must not write functional implementation code directly.
    *   Must not bypass verification gates to expedite delivery.

### Role: The Builder
*   **Mandate:** Implement specific feature sets and resolve defined tasks within established constraints.
*   **Authority:**
    *   Modify source code within assigned repositories.
    *   Request dependency updates.
    *   Refactor code strictly within its functional scope.
*   **Prohibitions:**
    *   Must not unilaterally alter API contracts or system schemas.
    *   Must not commit code without a corresponding, approved test plan.

### Role: The Auditor
*   **Mandate:** Ensure system compliance, security, and quality assurance.
*   **Authority:**
    *   Access all repositories and logs for read-only analysis.
    *   Block deployments or merges that violate invariants.
    *   Flag drift between design and implementation.
*   **Prohibitions:**
    *   Must not modify functional code or documentation.
    *   Must not disable security controls to facilitate testing.

### Role: The Librarian
*   **Mandate:** Curate the system's memory, documentation, and surface artifacts.
*   **Authority:**
    *   Structure documentation hierarchies.
    *   Enforce tagging and metadata standards.
    *   Archive obsolete contexts.
*   **Prohibitions:**
    *   Must not invent implementation details not present in the code.
    *   Must not delete historical logs unless under a ratified purge protocol.

### 3.1 Canonical Agent Registry

All JAI Agents and Roles, across every poly-repo component, are formally tracked in a central, versioned registry:

- **File:** dev-jai-nexus/jai-agents/MASTER_ROLEMAP.json
- **Purpose:** Provides a single source of truth for all agent IDs, role types, source repos, operational paths, and ratification versions.
- **Governance:** 
    - Any new agent or role must be added to this registry via a Constitutional Amendment Proposal (CAP) and approved by a Human Operator.
    - All cross-references in workflows, pipelines, and planning tools must reference this registry instead of scanning individual repos.
- **Traceability:** Each entry in the registry is fully linked to its operational definition file and the Constitution version in effect at the time of ratification.
- **Update Policy:** Updates to MASTER_ROLEMAP.json require:
    1. Verification of operational role file existence and completeness.
    2. Compliance with Single-Writer Rule and Role Sovereignty.
    3. Explicit ratification via CAP signed by a Human Operator.
- **Metadata:** The registry includes generation date, Constitution version, and repos scanned for full auditability.

This ensures that **all JAI Agents, whether Dev, Docs, Ops, or future categories, are discoverable, ratified, and traceable**, providing a firm backbone for multi-agent coordination, audits, and funding-phase readiness.

## 4. Quarterly Operating Model

The system operates on a rigorous Quarterly cadence (Q1, Q2, Q3, Q4) to impose discipline on flux.

*   **Scoping (Weeks 1-2):**
    *   Defining the exact "Workpackets" for the quarter.
    *   Hard allocation of resources and agent focus.
    *   Explicit rejection of out-of-scope ideas.
*   **Planning & Design (Weeks 3-4):**
    *   Production of detailed Implementation Plans for all scoped items.
    *   Architectural review and ratification.
*   **Execution (Weeks 5-10):**
    *   Builder agents implement approved plans.
    *   Continuous verification by Auditor agents.
    *   Strict "No New Scope" enforcement.
*   **Stabilization & Archival (Weeks 11-12):**
    *   Freeze on feature development.
    *   Comprehensive system audit.
    *   Migration of quarter artifacts to immutable long-term storage.
    *   Retrospective analysis.

## 5. Memory, Traceability, and Logs

### Canonical Memory
The file system is the only brain. If it is not in a committed file, it did not happen. Context windows are ephemeral; Git history is eternal.

### Traceability Rules
1.  **Bit-Level Provenance:** Every change to the codebase must be traceable to a specific Agent ID, Task ID, and authorizing Plan.
2.  **Decision Logs:** Major architectural decisions must be recorded in Architecture Decision Records (ADRs).
3.  **Linkage:** All artifacts must link backwards to their originating requirement and forwards to their verification proof.

### State Externalization
Agents must dump their "understanding" of the world into structured files (JSON/YAML) before and after complex operations. This allows disjointed agents to resume work without reliance on a single model's continuous context.

## 6. Change Control & Evolution

### Amendment Process
1.  **Proposal:** A formal "Constitutional Amendment Proposal" (CAP) must be drafted, explaining the rationale and impact.
2.  **Review:** The CAP receives scrutiny from Architect and Auditor roles.
3.  **Ratification:** A Human Operator must explicitly sign the CAP with a cryptographic or authenticated approval.
4.  **Integration:** The version number of the Constitution is incremented, and the change is merged.

### Friction
Changing this document is intentionally difficult. It requires a disruption of normal operating procedure. This friction protects the system from drift, caprice, and hallucinations.

## 7. Funding-Phase Readiness Criteria

JAI NEXUS may only proceed to accept external capital, expensive inference compute, or paid API integrations when the following criteria are met:

- [ ] **Structural Integrity:** The poly-repo layout is stable, and 100% of inter-repo dependencies are explicitly mapped.
- [ ] **Auditable History:** At least one full Quarter of operations has been successfully logged, archived, and verified as traceable.
- [ ] **Invariant Defense:** Automated tests (Invariant Guards) exist and pass for all specific Core Invariants defined in Section 2.
- [ ] **Agent Safety:** A "Kill Switch" mechanism is verified to instantly halt all agent write-access across all repositories.
- [ ] **Cost Control:** Granular telemetry is active to track token/compute usage per Role and per Task.
